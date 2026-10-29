import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, Github, Instagram, Menu, MoveUpRight, Send, X, Download, Moon, Sun } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroScene, TechScene } from './components/Scene'
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true }) // stops re-layout every time the mobile URL bar shows/hides while scrolling

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
    const id = window.setInterval(() => setI((v) => (v + 1) % heroWords.length), 2000)
    return () => window.clearInterval(id)
  }, [])
  return <em key={i} className="rotating-word" aria-live="polite">{heroWords[i]}.</em>
}

const tech = ['React', 'TypeScript', 'JavaScript', 'Three.js', 'GSAP', 'CSS / SCSS', 'Node.js', 'Git & GitHub']

function Loader({ done }: { done: () => void }) {
  useEffect(() => { const t = window.setTimeout(done, 1050); return () => window.clearTimeout(t) }, [done])
  return <div className="loader"><div className="loader-mark"><img src="/logo.svg" alt="Shahzaib logo" /></div><div className="loader-bottom"><span>DESIGNING THE DIGITAL</span><span>LOADING EXPERIENCE <i /></span></div><div className="loader-line"><i /></div></div>
}
const inkColorsDark = ['#f4f0f7', '#ff6b6b', '#ff9f43', '#feca57', '#fbbf24', '#34d399', '#2dd4bf', '#22d3ee', '#48dbfb', '#60a5fa', '#a78bfa', '#c084fc', '#f472b6', '#fb7185', '#ffb4a2']
const inkColorsLight = ['#17121b', '#d62839', '#e4572e', '#c2410c', '#a16207', '#15803d', '#0f766e', '#0e7490', '#0369a1', '#2563eb', '#6d4aff', '#9333ea', '#c026d3', '#be185d', '#b91c1c']

function InkCycle({ theme }: { theme: 'dark' | 'light' }) {
  useEffect(() => {
    const inkColors = theme === 'light' ? inkColorsLight : inkColorsDark
    let i = 0
    const root = document.documentElement
    const coarse = window.matchMedia('(pointer: coarse)').matches
    root.classList.toggle('no-fade', coarse)
    const id = window.setInterval(() => {
      if (document.hidden) return
      i = (i + 1) % inkColors.length
      document.documentElement.style.setProperty('--ink', inkColors[i])
    }, 2000)
    return () => { window.clearInterval(id); document.documentElement.style.removeProperty('--ink') }
  }, [theme])
  return null
}

const packages = [
  { n: '01', name: 'Starter', desc: 'A clean one-page site to get you online fast.', items: ['One-page responsive website', 'Modern custom design', 'Contact form (WhatsApp + email)', 'Basic SEO setup'], category: 'Website Development', featured: false },
  { n: '02', name: 'Business', desc: 'A complete multi-page website for your business.', items: ['Multi-page responsive website', 'SEO-ready: meta tags, sitemap, schema', 'Contact form + WhatsApp button', 'Speed & mobile optimisation', 'Hosting & domain setup help'], category: 'Website Development', featured: true },
  { n: '03', name: 'Custom', desc: 'Web apps, 3D experiences and automation built around your idea.', items: ['React web apps & dashboards', '3D / interactive websites (Three.js)', 'Python automation', 'AI chatbots & WhatsApp bots'], category: 'React / Frontend App', featured: false },
]
const faqs = [
  ['How long does a project take?', 'A simple landing page can take a few days. A full business website or web app usually takes 1–4 weeks, depending on the scope. I’ll give you a clear timeline once we talk.'],
  ['How much does it cost?', 'It depends on the pages, features and design you need. Send me your idea through the contact form and I’ll reply with a quote — no obligation.'],
  ['Will my website work on mobile?', 'Yes. Every site I build is fully responsive and works on phones, tablets and desktops.'],
  ['Can you help with domain and hosting?', 'Yes. I can set up hosting (for example Vercel or Netlify), connect your domain and deploy the site for you.'],
  ['Can you make my website rank on Google?', 'I build SEO-ready sites with proper titles, meta tags, a sitemap, schema and fast loading. Rankings also depend on content and time, so I can’t promise a specific position.'],
  ['Do you offer support after launch?', 'Yes. I can fix bugs and make updates after delivery — we’ll agree on the support you need up front.'],
  ['How do we get started?', 'Fill in the contact form or message me on WhatsApp with your idea, and I’ll get back to you.'],
]

const WHATSAPP = '923225083527'
const CONTACT_EMAIL = 'btw.jutt.9@gmail.com'
const categories = ['Website Development', 'React / Frontend App', '3D & Interactive Website', 'Python & Automation', 'AI Chatbot / WhatsApp Bot', 'UI/UX Design', 'SEO & Performance', 'Bug Fixing / Maintenance', 'Other']

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const pick = (e: Event) => { const sel = formRef.current?.elements.namedItem('category') as HTMLSelectElement | null; if (sel) sel.value = (e as CustomEvent<string>).detail }
    window.addEventListener('pick-category', pick)
    return () => window.removeEventListener('pick-category', pick)
  }, [])
  const read = () => {
    const f = new FormData(formRef.current!)
    return { category: String(f.get('category') || '').trim(), name: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), message: String(f.get('message') || '').trim() }
  }
  const text = ({ category, name, email, message }: { category: string; name: string; email: string; message: string }) => `Hi Shahzaib, I'm ${name}.\nEmail: ${email}\nCategory: ${category}\n\n${message}`
  const sendWhatsApp = (e: FormEvent) => {
    e.preventDefault()
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text(read()))}`, '_blank', 'noopener,noreferrer')
  }
  const sendEmail = () => {
    if (!formRef.current?.reportValidity()) return
    const d = read()
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${d.category} — message from ${d.name}`)}&body=${encodeURIComponent(text(d))}`
  }
  return <form ref={formRef} className="contact-form" onSubmit={sendWhatsApp}>
    <label><span>NAME</span><input name="name" type="text" placeholder="Your name" required autoComplete="name" /></label>
    <label><span>EMAIL</span><input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></label>
    <label><span>CATEGORY</span><select name="category" required defaultValue=""><option value="" disabled>Select a category</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
    <label><span>MESSAGE</span><textarea name="message" rows={4} placeholder="Tell me about your project or idea..." required /></label>
    <div className="form-actions">
      <button type="submit" className="btn-primary">Send on WhatsApp <ArrowUpRight size={15}/></button>
      <button type="button" className="btn-ghost" onClick={sendEmail}>Send via Email</button>
    </div>
  </form>
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || !dot.current || !ring.current) return
    const d = dot.current, r = ring.current
    document.documentElement.classList.add('has-custom-cursor')
    gsap.set([d, r], { xPercent: -50, yPercent: -50 })
    const dx = gsap.quickSetter(d, 'x', 'px'), dy = gsap.quickSetter(d, 'y', 'px')
    const rx = gsap.quickTo(r, 'x', { duration: .3, ease: 'power3.out' }), ry = gsap.quickTo(r, 'y', { duration: .3, ease: 'power3.out' })
    const move = (e: MouseEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      d.classList.add('is-visible'); r.classList.add('is-visible')
    }
    const over = (e: Event) => {
      const t = e.target as HTMLElement
      r.classList.toggle('is-active', !!t.closest?.('a,button,.project-card,[role="button"]'))
    }
    const down = () => r.classList.add('is-down')
    const up = () => r.classList.remove('is-down')
    const leave = () => { d.classList.remove('is-visible'); r.classList.remove('is-visible') }
    window.addEventListener('mousemove', move); document.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down); window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])
  return <><div ref={ring} className="cursor-ring" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>
}
function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f3f8' : '#100d13')
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable */ }
  }, [theme])
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
    <InkCycle theme={theme} />
    <Cursor />
    {!loading && <a className="wa-float" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi Shahzaib, I visited your portfolio and would like to talk about a project.')}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>}
    <div className={`site-shell ${loading ? 'is-loading' : ''}`}>
      <div className="scroll-progress" ref={progress} />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Shahzaib home"><img src="/logo.svg" alt="Shahzaib logo" /><small>PORTFOLIO / 2026</small></a>
        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
          {[['About','#about'],['What I do','#services'],['Career','#career'],['Work','#work'],['Stack','#stack']].map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={14}/></a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero section-pad" id="home" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-year">— 2026</span></p>
            <h1 id="hero-title">Building<br/>digital <RotatingWord /></h1>
            <div className="hero-subrow"><p className="hero-sub">I’m Shahzaib — a full-stack developer from Lahore shaping thoughtful interfaces and immersive web experiences.</p><a className="round-link" href="#work" aria-label="Explore selected work"><ArrowDownRight /></a></div>
            <div className="hero-meta"><span>FULL-STACK DEVELOPER</span><span>BASED IN LAHORE, PAKISTAN · WORKING WORLDWIDE</span></div>
          </div>
          <div className="hero-art" aria-label="Interactive 3D character illustration"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-label label-top">FIG. 001 <span>— THE BUILDER</span></div><HeroScene /><div className="art-caption"><span>CURIOUS BY DESIGN</span><Asterisk size={16}/><span>BUILT TO MOVE</span></div></div>
          <a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><div><i /></div></a>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="section-heading reveal"><span className="section-index">01 / A LITTLE ABOUT ME</span><span className="section-note">HUMAN FIRST. PIXEL PRECISE.</span></div>
          <div className="about-layout"><h2 className="about-statement reveal">Good digital work isn’t just seen. <em>It’s felt.</em></h2><div className="about-copy reveal"><figure className="about-photo"><img src="/shahzaib.jpg" width="705" height="827" loading="lazy" alt="Shahzaib Juttx, full-stack developer from Lahore, Pakistan" /><figcaption><i />SHAHZAIB · LAHORE, PAKISTAN</figcaption></figure><p>I’m a full-stack developer who loves the space where clean engineering meets expressive design. I turn ideas into fast, responsive, and memorable experiences — with a little motion and a lot of intention.</p><p>From the first sketch to the final interaction, I care about how every detail works together.</p><a className="text-link" href="#contact">A bit more about working together <ArrowUpRight size={16}/></a><a className="text-link cv-link" href="/Shahzaib-CV.pdf" download>Download my CV <Download size={16}/></a></div></div>
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

        <section className="packages-section section-pad" id="packages">
          <div className="section-heading reveal"><span className="section-index">06 / PACKAGES</span><span className="section-note">PICK A STARTING POINT</span></div>
          <h2 className="section-title reveal">Simple ways to<br/><em>work together.</em></h2>
          <div className="package-grid">
            {packages.map((p) => <article className={`package-card reveal ${p.featured ? 'featured' : ''}`} key={p.n}>
              {p.featured && <span className="package-badge">MOST POPULAR</span>}
              <span className="package-num">{p.n}</span><h3>{p.name}</h3><p>{p.desc}</p>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <span className="package-price">PRICE: ON REQUEST</span>
              <a className={p.featured ? 'btn-primary' : 'btn-ghost'} href="#contact" onClick={() => window.dispatchEvent(new CustomEvent('pick-category', { detail: p.category }))}>Get a quote <ArrowUpRight size={15}/></a>
            </article>)}
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="section-heading reveal"><span className="section-index">07 / FAQ</span><span className="section-note">QUICK ANSWERS</span></div>
          <div className="faq-layout"><h2 className="section-title reveal">Good<br/><em>questions.</em></h2><div className="faq-list">{faqs.map(([q, ans]) => <details className="faq-item reveal" key={q}><summary>{q}</summary><p>{ans}</p></details>)}</div></div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="section-heading reveal"><span className="section-index">08 / YOUR TURN</span><span className="section-note">GOOD THINGS START WITH HELLO</span></div>
          <div className="contact-layout"><div><p className="eyebrow reveal"><span className="status-dot"/> OPEN TO THE RIGHT OPPORTUNITY</p><h2 className="contact-title reveal">Have a good<br/>one in <em>mind?</em></h2><p className="contact-copy reveal">Have a project, an idea, or just want to say hello? My inbox is open.</p></div><div className="contact-action reveal"><a className="email-link" href="mailto:btw.jutt.9@gmail.com">Let’s make it real <ArrowUpRight /></a><ContactForm /><div className="social-links"><a href="https://github.com/devshahzaib315" target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={13}/></a><a href="https://www.instagram.com/devshahzaib315/" target="_blank" rel="noreferrer"><Instagram size={17}/> Instagram <ArrowUpRight size={13}/></a><a href="https://t.me/devshahzaib315" target="_blank" rel="noreferrer"><Send size={16}/> Telegram <ArrowUpRight size={13}/></a></div></div></div>
          <footer className="footer"><a className="brand" href="#home" aria-label="Back to top"><img src="/logo.svg" alt="Shahzaib logo" /></a><span>DESIGNED WITH CURIOSITY · BUILT WITH CARE</span><a href="#home" className="back-top">BACK TO TOP <MoveUpRight size={13}/></a><span className="copyright">© SHAHZAIB 2026</span></footer>
        </section>
      </main>
    </div>
  </>
}
export default App
