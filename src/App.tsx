import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, Github, Instagram, Menu, MoveUpRight, Send, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroScene, TechScene } from './components/Scene'
gsap.registerPlugin(ScrollTrigger)

const projects = [
  { n: '01', type: 'DIGITAL EXPERIENCE', title: 'NOVA / Studio', desc: 'A bold digital home for a new generation creative studio.', tags: ['React', 'GSAP', 'WebGL'], visual: 'nova' },
  { n: '02', type: 'PRODUCT DESIGN', title: 'Monogram', desc: 'A minimal commerce experience with a tactile visual language.', tags: ['TypeScript', 'Motion', 'UI/UX'], visual: 'mono' },
  { n: '03', type: 'INTERACTIVE WEB', title: 'Orbit Finance', desc: 'A new way to make complex financial tools feel simple.', tags: ['React', 'Three.js', 'Data viz'], visual: 'orbit' },
  { n: '04', type: 'CREATIVE DEVELOPMENT', title: 'After Hours', desc: 'A digital playground for sound, culture, and community.', tags: ['WebGL', 'GSAP', 'Creative code'], visual: 'after' },
]
const heroWords = ['feelings', 'dreams', 'worlds', 'magic', 'possibilities', 'interfaces', 'experiences', 'stories', 'ideas', 'moments']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % heroWords.length), 5000)
    return () => window.clearInterval(id)
  }, [])
  return <em key={i} className="rotating-word" aria-live="polite">{heroWords[i]}.</em>
}

const tech = ['React', 'TypeScript', 'JavaScript', 'Three.js', 'GSAP', 'CSS / SCSS', 'Node.js', 'Git & GitHub']

function Loader({ done }: { done: () => void }) {
  useEffect(() => { const t = window.setTimeout(done, 1050); return () => window.clearTimeout(t) }, [done])
  return <div className="loader"><div className="loader-mark"><img src="/logo.svg" alt="Shahzaib logo" /></div><div className="loader-bottom"><span>DESIGNING THE DIGITAL</span><span>LOADING EXPERIENCE <i /></span></div><div className="loader-line"><i /></div></div>
}
function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const move = (e: MouseEvent) => { gsap.to(ref.current, { x: e.clientX, y: e.clientY, duration: .24, ease: 'power3.out' }) }
    const over = (e: Event) => { const target = e.target as HTMLElement; if (target.closest('a,button,.project-card')) ref.current?.classList.add('cursor-active'); else ref.current?.classList.remove('cursor-active') }
    window.addEventListener('mousemove', move); document.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over) }
  }, [])
  return <div ref={ref} className="custom-cursor" aria-hidden="true"><span /></div>
}
function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const progress = useRef<HTMLDivElement>(null)
  const workTrack = useRef<HTMLDivElement>(null)
  const setDone = () => setLoading(false)

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-copy > *', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: .1, ease: 'power3.out', delay: .1 })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => gsap.fromTo(el, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }))
      gsap.to(progress.current, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .2 } })
      if (workTrack.current && window.matchMedia('(min-width: 850px)').matches) {
        const maxX = () => Math.max(0, workTrack.current!.scrollWidth - window.innerWidth + 80)
        gsap.to(workTrack.current, { x: () => -maxX(), ease: 'none', scrollTrigger: { trigger: '.work-section', start: 'top top', end: () => `+=${maxX() + window.innerHeight * .45}`, scrub: 1, pin: true, invalidateOnRefresh: true, onUpdate: (self) => setActiveProject(Math.min(projects.length - 1, Math.floor(self.progress * projects.length))) } })
      }
    })
    return () => ctx.revert()
  }, [loading])

  const closeMenu = () => setMenuOpen(false)
  return <>
    {loading && <Loader done={setDone} />}
    <Cursor />
    <div className={`site-shell ${loading ? 'is-loading' : ''}`}>
      <div className="scroll-progress" ref={progress} />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Shahzaib home"><img src="/logo.svg" alt="Shahzaib logo" /><small>PORTFOLIO / 2026</small></a>
        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
          {[['About','#about'],['What I do','#services'],['Career','#career'],['Work','#work'],['Stack','#stack']].map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={14}/></a>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero section-pad" id="home" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-year">— 2026</span></p>
            <h1 id="hero-title">Building<br/>digital <RotatingWord /></h1>
            <div className="hero-subrow"><p className="hero-sub">I’m Shahzaib — a frontend developer shaping thoughtful interfaces and immersive web experiences.</p><a className="round-link" href="#work" aria-label="Explore selected work"><ArrowDownRight /></a></div>
            <div className="hero-meta"><span>FRONTEND DEVELOPER</span><span>BASED IN PAKISTAN · WORKING WORLDWIDE</span></div>
          </div>
          <div className="hero-art" aria-label="Interactive 3D character illustration"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-label label-top">FIG. 001 <span>— THE BUILDER</span></div><HeroScene /><div className="art-caption"><span>CURIOUS BY DESIGN</span><Asterisk size={16}/><span>BUILT TO MOVE</span></div></div>
          <a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><div><i /></div></a>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="section-heading reveal"><span className="section-index">01 / A LITTLE ABOUT ME</span><span className="section-note">HUMAN FIRST. PIXEL PRECISE.</span></div>
          <div className="about-layout"><h2 className="about-statement reveal">Good digital work isn’t just seen. <em>It’s felt.</em></h2><div className="about-copy reveal"><p>I’m a frontend developer who loves the space where clean engineering meets expressive design. I turn ideas into fast, responsive, and memorable experiences — with a little motion and a lot of intention.</p><p>From the first sketch to the final interaction, I care about how every detail works together.</p><a className="text-link" href="#contact">A bit more about working together <ArrowUpRight size={16}/></a></div></div>
          <div className="stat-row reveal"><div><strong>01<span>+</span></strong><span>CURIOUS MINDSET</span></div><div><strong>∞</strong><span>THINGS TO LEARN</span></div><div><strong>100<span>%</span></strong><span>DETAIL OBSESSED</span></div><div className="stat-manifesto">MAKE IT USEFUL.<br/><em>MAKE IT MATTER.</em></div></div>
        </section>

        <section className="services-section section-pad" id="services">
          <div className="section-heading reveal"><span className="section-index">02 / WHAT I DO</span><span className="section-note">FROM IDEA TO INTERACTION</span></div>
          <h2 className="section-title reveal">A little bit of logic.<br/><em>A lot of feeling.</em></h2>
          <div className="service-list">
            {[['01','Frontend development','Thoughtful, accessible, responsive interfaces built with modern tools and solid foundations.','01 / BUILD'],['02','Creative development','Motion, 3D, and playful details that turn a page into an experience.','02 / EXPLORE'],['03','UI implementation','Bringing visual systems to life with precision, consistency, and care.','03 / REFINE']].map((item) => <article className="service-item reveal" key={item[0]}><span className="service-num">{item[0]}</span><div><h3>{item[1]}</h3><p>{item[2]}</p></div><span className="service-tag">{item[3]}</span><ArrowUpRight className="service-arrow" /></article>)}
          </div>
        </section>

        <section className="career-section section-pad" id="career">
          <div className="section-heading reveal"><span className="section-index">03 / THE JOURNEY</span><span className="section-note">ALWAYS IN PROGRESS</span></div>
          <div className="career-layout"><h2 className="section-title reveal">Learning by<br/><em>making.</em></h2><div className="career-timeline"><article className="timeline-item reveal"><span className="timeline-date">NOW / 2026</span><div><h3>Independent developer</h3><p>Building personal projects, refining my craft, and exploring new ways to make the web feel more human.</p><span className="timeline-pill">CURRENT CHAPTER</span></div></article><article className="timeline-item reveal"><span className="timeline-date">ALWAYS ON</span><div><h3>Curiosity-led learning</h3><p>Practicing frontend fundamentals, studying interaction design, and experimenting with motion and 3D.</p></div></article></div></div>
        </section>

        <section className="work-section" id="work">
          <div className="work-intro section-pad"><div className="section-heading reveal"><span className="section-index">04 / SELECTED WORK</span><span className="section-note">CONCEPTS & EXPERIMENTS</span></div><div className="work-title-row"><h2 className="section-title reveal">Made with<br/><em>intention.</em></h2><p className="work-intro-copy reveal">A selection of concept projects exploring design, interaction, and what the browser can do. These are showcase concepts — replace them with your live projects when ready.</p></div><div className="work-hint"><span>SCROLL TO EXPLORE</span><ArrowRight size={16}/></div></div>
          <div className="work-track" ref={workTrack}>{projects.map((project, i) => <article className={`project-card ${project.visual}`} key={project.n}><div className="project-art"><div className="project-art-top"><span>{project.type}</span><span>({project.n})</span></div><div className="project-graphic"><div className="graphic-ring ring-a"/><div className="graphic-ring ring-b"/><div className="graphic-core">{project.visual === 'nova' ? 'N.' : project.visual === 'mono' ? 'M' : project.visual === 'orbit' ? 'O' : 'AH'}</div><span className="graphic-cross cross-a">+</span><span className="graphic-cross cross-b">✳</span></div><div className="project-art-bottom"><span>DESIGN STUDY / {2026 + i}</span><ArrowUpRight size={20}/></div></div><div className="project-info"><div><span className="project-counter">PROJECT {project.n}</span><h3>{project.title}</h3><p>{project.desc}</p></div><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
          <div className="work-footer section-pad"><span>FOUR STUDIES. ENDLESS ITERATIONS.</span><span>01 — 04 <span className="work-active">/ {String(activeProject + 1).padStart(2, '0')}</span></span></div>
        </section>

        <section className="stack-section section-pad" id="stack">
          <div className="section-heading reveal"><span className="section-index">05 / TECH STACK</span><span className="section-note">TOOLS, NOT RULES</span></div>
          <div className="stack-layout"><div className="stack-copy"><h2 className="section-title reveal">The right tools<br/>for the <em>feeling.</em></h2><p className="reveal">A flexible toolkit for turning thoughtful ideas into real, resilient experiences. Tap, drag, and play with the floating spheres.</p><div className="tech-tags reveal">{tech.map(t => <span key={t}>{t}</span>)}</div><span className="stack-caption">INTERACTIVE 3D / GRAB A SPHERE</span></div><div className="tech-scene reveal"><TechScene /><div className="scene-cross scene-cross-one">+</div><div className="scene-cross scene-cross-two">✳</div></div></div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="section-heading reveal"><span className="section-index">06 / YOUR TURN</span><span className="section-note">GOOD THINGS START WITH HELLO</span></div>
          <div className="contact-layout"><div><p className="eyebrow reveal"><span className="status-dot"/> OPEN TO THE RIGHT OPPORTUNITY</p><h2 className="contact-title reveal">Have a good<br/>one in <em>mind?</em></h2><p className="contact-copy reveal">Have a project, an idea, or just want to say hello? My inbox is open.</p></div><div className="contact-action reveal"><a className="email-link" href="mailto:btw.jutt.9@gmail.com">Let’s make it real <ArrowUpRight /></a><div className="social-links"><a href="https://github.com/devshahzaib315" target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={13}/></a><a href="https://www.instagram.com/devshahzaib315/" target="_blank" rel="noreferrer"><Instagram size={17}/> Instagram <ArrowUpRight size={13}/></a><a href="https://t.me/devshahzaib315" target="_blank" rel="noreferrer"><Send size={16}/> Telegram <ArrowUpRight size={13}/></a></div></div></div>
          <footer className="footer"><a className="brand" href="#home" aria-label="Back to top"><img src="/logo.svg" alt="Shahzaib logo" /></a><span>DESIGNED WITH CURIOSITY · BUILT WITH CARE</span><a href="#home" className="back-top">BACK TO TOP <MoveUpRight size={13}/></a><span className="copyright">© SHAHZAIB 2026</span></footer>
        </section>
      </main>
    </div>
  </>
}
export default App
