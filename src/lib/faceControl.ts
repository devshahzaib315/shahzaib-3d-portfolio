// Webcam head tracking for the 3D robot.
// Everything runs on the visitor's device (MediaPipe in the browser) — no video is uploaded anywhere.
// The MediaPipe library is only downloaded after the visitor clicks the camera button.

export type FaceStatus = 'idle' | 'loading' | 'on' | 'denied' | 'error'

// Shared mutable state read by the 3D scene every frame (values are -1..1, "screen" orientation)
export const faceState = { active: false, x: 0, y: 0 }

const VISION_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs'
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

let stream: MediaStream | null = null
let video: HTMLVideoElement | null = null
let detector: any = null
let raf = 0
let running = false
// neutral (resting) head pitch/position, learned from the first moments so up/down works for any phone angle
let calib = { n: 0, pitch: 0, posY: 0 }

const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v))

export async function startFaceControl(onStatus: (s: FaceStatus) => void) {
  if (running) return
  running = true
  onStatus('loading')
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } }, audio: false })
  } catch {
    running = false
    onStatus('denied')
    return
  }
  try {
    const mod: any = await import(/* @vite-ignore */ VISION_URL)
    const fileset = await mod.FilesetResolver.forVisionTasks(WASM_URL)
    const make = (delegate: 'GPU' | 'CPU') => mod.FaceDetector.createFromOptions(fileset, { baseOptions: { modelAssetPath: MODEL_URL, delegate }, runningMode: 'VIDEO' })
    try { detector = await make('GPU') } catch { detector = await make('CPU') }

    video = document.createElement('video')
    video.playsInline = true
    video.muted = true
    video.srcObject = stream
    await video.play()
    if (!running) return // stopped while loading
    onStatus('on')

    let lastTime = -1
    let lastSeen = 0
    let lastRun = 0
    const loop = () => {
      if (!running || !video || !detector) return
      raf = requestAnimationFrame(loop)
      const now = performance.now()
      if (document.hidden || now - lastRun < 33 || video.currentTime === lastTime || video.readyState < 2) return
      lastRun = now
      lastTime = video.currentTime
      const res = detector.detectForVideo(video, now)
      const kp = res?.detections?.[0]?.keypoints
      if (kp && kp.length >= 3) {
        // keypoints: 0/1 = eyes, 2 = nose tip (normalised 0..1, un-mirrored camera image)
        const eyeMidX = (kp[0].x + kp[1].x) / 2
        const eyeMidY = (kp[0].y + kp[1].y) / 2
        const eyeDist = Math.max(0.01, Math.abs(kp[0].x - kp[1].x))
        const yaw = (kp[2].x - eyeMidX) / eyeDist        // head turn (raw camera orientation)
        const pitch = (kp[2].y - eyeMidY) / eyeDist      // head up/down
        const posX = eyeMidX - 0.5                       // face position in frame
        const posY = eyeMidY - 0.5
        // mirror horizontally so it feels like a mirror: you turn/move right -> robot looks right
        const tx = clamp(-(yaw * 2.6 + posX * 2.2))
        if (calib.n < 20) { calib.pitch = (calib.pitch * calib.n + pitch) / (calib.n + 1); calib.posY = (calib.posY * calib.n + posY) / (calib.n + 1); calib.n++ }
        // up/down: much stronger than before, measured relative to the neutral pose
        const ty = clamp(-((pitch - calib.pitch) * 5 + (posY - calib.posY) * 4))
        faceState.x += (tx - faceState.x) * 0.6
        faceState.y += (ty - faceState.y) * 0.6
        faceState.active = true
        lastSeen = now
      } else if (now - lastSeen > 1200) {
        faceState.active = false // face lost -> go back to mouse/touch
      }
    }
    loop()
  } catch {
    stopFaceControl()
    onStatus('error')
  }
}

export function stopFaceControl() {
  running = false
  cancelAnimationFrame(raf)
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
  if (video) { video.srcObject = null; video = null }
  try { detector?.close?.() } catch { /* ignore */ }
  detector = null
  faceState.active = false
  faceState.x = 0
  faceState.y = 0
  calib = { n: 0, pitch: 0, posY: 0 }
                              }
