'use client';

import { ArrowDownRight, Mail, Moon, Sun } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';

const MetalScene = lazy(() =>
  import('@/components/metal-scene').then((module) => ({ default: module.MetalScene })),
);

const concepts = [
  {
    name: 'MINERVA',
    type: 'Knowledge intelligence',
    summary:
      'A source-grounded research copilot designed to turn scattered documents into traceable answers, decisions, and next actions.',
    focus: 'RAG · citations · semantic search',
    accent: 'M–01',
  },
  {
    name: 'ODYSSEY',
    type: 'Agent orchestration',
    summary:
      'A multi-agent workflow concept for planning complex goals, routing specialist tasks, and preserving a clear audit trail.',
    focus: 'Agents · tool use · workflow state',
    accent: 'O–02',
  },
  {
    name: 'CUSTORAD',
    type: 'Customer intelligence',
    summary:
      'An AI support layer that classifies intent, surfaces relevant context, and keeps a human reviewer in control of every response.',
    focus: 'NLP · triage · human-in-the-loop',
    accent: 'C–03',
  },
  {
    name: 'TERMINUS',
    type: 'Code evaluation',
    summary:
      'A language-aware debugging and assessment sandbox built around reproducible tests, useful feedback, and measurable quality.',
    focus: 'Python · Java · C++ · evaluation',
    accent: 'T–04',
  },
  {
    name: 'TUN',
    type: 'Training utility network',
    summary:
      'A feedback system for validating datasets, comparing model outputs, and converting reviewer judgment into quality signals.',
    focus: 'Data QA · scoring · feedback loops',
    accent: 'T–05',
  },
];

const expertise = [
  ['AI & data', 'Dataset evaluation', 'Model-output analysis', 'Data annotation', 'Quality feedback'],
  ['Engineering', 'Python', 'JavaScript', 'React / Next.js', 'Java', 'C++'],
  ['Product craft', 'Problem framing', 'System thinking', 'Debugging', 'Accessible UI'],
];

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = window.localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
    gsap.fromTo(
      '.theme-toggle-icon',
      { rotate: -40, scale: 0.45, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(2)' },
    );
  }, [theme]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        timeline
          .from('.nav-reveal', { y: -24, opacity: 0, duration: 0.7 })
          .from('.hero-kicker', { y: 24, opacity: 0, duration: 0.6 }, '-=0.25')
          .from('.hero-line', { yPercent: 110, duration: 1.1, stagger: 0.12 }, '-=0.25')
          .from('.hero-copy', { y: 28, opacity: 0, duration: 0.75 }, '-=0.55')
          .from('.hero-action', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.45');

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('.concept-card').forEach((card, index) => {
          gsap.from(card, {
            y: 72,
            opacity: 0,
            duration: 0.85,
            delay: (index % 2) * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });
        });

        gsap.to('.marquee-track', {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });

        const cardCleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>('.motion-card').forEach((card) => {
          const sheen = card.querySelector<HTMLElement>('.metal-sheen');
          const metal = card.querySelector<HTMLElement>('.card-metal');

          const handleMove = (event: PointerEvent) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            const tiltX = (0.5 - y) * 5;
            const tiltY = (x - 0.5) * 5;
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
            gsap.to(card, { rotateX: tiltX, rotateY: tiltY, y: -7, duration: 0.45, ease: 'power2.out' });
            if (sheen) gsap.to(sheen, { opacity: 0.82, duration: 0.25 });
            if (metal) {
              gsap.to(metal, {
                x: (x - 0.5) * 34,
                y: (y - 0.5) * 26,
                rotate: (x - 0.5) * 16,
                scale: 1.08,
                opacity: 0.88,
                duration: 0.55,
                ease: 'power2.out',
              });
            }
          };

          const handleLeave = () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.55)' });
            if (sheen) gsap.to(sheen, { opacity: 0, duration: 0.4 });
            if (metal) gsap.to(metal, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0, duration: 0.5 });
          };

          card.addEventListener('pointermove', handleMove);
          card.addEventListener('pointerleave', handleLeave);
          cardCleanups.push(() => {
            card.removeEventListener('pointermove', handleMove);
            card.removeEventListener('pointerleave', handleLeave);
          });
        });

        return () => cardCleanups.forEach((cleanup) => cleanup());
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <main ref={root} className="site-shell" data-theme={theme}>
      <div className="global-grid" aria-hidden="true" />
      <header className="nav-reveal site-nav">
        <a className="wordmark" href="#top" aria-label="Dheeraj home">
          DKP<span>®</span>
        </a>
        <div className="nav-status" aria-label="Available for opportunities">
          <span className="status-dot" />
          Available for AI &amp; software roles
        </div>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'day' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'day' : 'dark'} mode`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </span>
            <span>{theme === 'dark' ? 'Day' : 'Dark'}</span>
          </button>
        </nav>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <Suspense fallback={<div className="metal-fallback" aria-hidden="true" />}>
          <MetalScene theme={theme} />
        </Suspense>

        <div className="hero-content">
          <p className="hero-kicker">
            <span>AI systems</span>
            <span>Software engineering</span>
            <span>India · 2026</span>
          </p>

          <h1 className="hero-title" aria-label="Dheeraj Kumar Prajapati">
            <span className="title-mask">
              <span className="hero-line">DHEERAJ</span>
            </span>
            <span className="title-mask title-indent">
              <span className="hero-line outline-word">PRAJAPATI</span>
            </span>
          </h1>

          <div className="hero-lower">
            <p className="hero-copy">
              I design reliable AI workflows and thoughtful software systems - turning raw data,
              complex evaluation, and ambitious ideas into products people can trust.
            </p>

            <div className="hero-actions">
              <a className="hero-action primary-action" href="#work">
                Explore selected work
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
              <div className="social-links hero-action" aria-label="Social links">
                <a href="https://github.com/premdheeraj" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <span aria-hidden="true">GH</span>
                </a>
                <a href="https://www.linkedin.com/in/dheeraj121" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <span aria-hidden="true">IN</span>
                </a>
                <a href="mailto:pprajapati991@gmail.com" aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-rail" aria-hidden="true">
          <span>Data evaluation</span>
          <span>Model analysis</span>
          <span>Product engineering</span>
          <span>Creative development</span>
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">01 / Selected work</p>
          <h2>
            Intelligence,
            <br />
            <span>made useful.</span>
          </h2>
          <p className="heading-copy">
            One completed healthcare system and five focused product directions that show how I
            approach data, evaluation, and human-centered AI.
          </p>
        </div>

        <article className="featured-project motion-card" data-reveal>
          <div className="card-grid-layer" aria-hidden="true" />
          <div className="metal-sheen" aria-hidden="true" />
          <div className="card-metal featured-metal" aria-hidden="true" />
          <div className="featured-visual" aria-hidden="true">
            <div className="signal-orbit orbit-one" />
            <div className="signal-orbit orbit-two" />
            <div className="signal-core">
              <span>HOSPITAL</span>
              <strong>DEMAND</strong>
              <small>FORECAST / 01</small>
            </div>
            <div className="signal-data">
              <span>CASE LOAD</span>
              <span>RESOURCE INDEX</span>
              <span>CAPACITY SIGNAL</span>
            </div>
          </div>

          <div className="featured-content">
            <div className="project-meta">
              <span>Built project · 2023–2024</span>
              <span>Healthcare AI</span>
            </div>
            <h3>COVID-19 CASE MONITORING &amp; HOSPITAL RESOURCE PREDICTION</h3>
            <p>
              An AI-enabled web application designed to monitor patient health data and support
              forward planning for hospital resources. The work connects health signals with a
              clear operational view for capacity decisions.
            </p>
            <ul className="tag-list" aria-label="Project capabilities">
              <li>Predictive analytics</li>
              <li>Health monitoring</li>
              <li>Web application</li>
              <li>Git workflow</li>
            </ul>
          </div>
        </article>

        <div className="concept-intro" data-reveal>
          <p className="eyebrow">AI product concepts</p>
          <p>
            The following are transparent concept directions - not presented as shipped client
            products or separate public repositories.
          </p>
        </div>

        <div className="concept-grid">
          {concepts.map((concept, index) => (
            <article className="concept-card motion-card" key={concept.name}>
              <div className="card-grid-layer" aria-hidden="true" />
              <div className="metal-sheen" aria-hidden="true" />
              <div className="card-metal" aria-hidden="true" />
              <div className="concept-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>Concept / R&amp;D</span>
              </div>
              <div className="concept-mark" aria-hidden="true">
                {concept.accent}
              </div>
              <p className="concept-type">{concept.type}</p>
              <h3>{concept.name}</h3>
              <p className="concept-summary">{concept.summary}</p>
              <p className="concept-focus">{concept.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>BUILD · EVALUATE · REFINE · SHIP · </span>
          <span>BUILD · EVALUATE · REFINE · SHIP · </span>
        </div>
      </div>

      <section id="about" className="about-section section-pad">
        <div className="about-title" data-reveal>
          <p className="eyebrow">02 / About</p>
          <h2>ENGINEERING WITH JUDGMENT.</h2>
        </div>

        <div className="about-grid">
          <div className="about-statement" data-reveal>
            <p>
              I am a software engineer with hands-on experience in AI data training, model-output
              evaluation, debugging, and technical feedback across Python, Java, C++, JavaScript,
              React, and Next.js.
            </p>
            <p>
              My strength is the layer between raw capability and dependable results: identifying
              what is wrong, explaining why, and iterating until the system behaves clearly.
            </p>
          </div>

          <div className="experience-list" data-reveal>
            <article>
              <div>
                <p>AI Data Training Intern</p>
                <span>AI Data Solutions Pvt. Ltd. · Bengaluru</span>
              </div>
              <time>Mar–Dec 2025</time>
            </article>
            <article>
              <div>
                <p>E-Governance Services Assistant</p>
                <span>Citizen Facilitation Center · Allahabad</span>
              </div>
              <time>Jan 2023–Mar 2024</time>
            </article>
            <article>
              <div>
                <p>B.Sc. Computer Science</p>
                <span>Dr. C. V. Raman University</span>
              </div>
              <time>Computer science</time>
            </article>
          </div>
        </div>
      </section>

      <section className="expertise-section section-pad">
        <div className="section-heading compact-heading" data-reveal>
          <p className="eyebrow">03 / Capabilities</p>
          <h2>STACK &amp; PRACTICE</h2>
        </div>
        <div className="expertise-grid">
          {expertise.map(([title, ...items], index) => (
            <article className="expertise-card motion-card" key={title} data-reveal>
              <div className="card-grid-layer" aria-hidden="true" />
              <div className="metal-sheen" aria-hidden="true" />
              <div className="card-metal" aria-hidden="true" />
              <div className="expertise-number">0{index + 1}</div>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-grid" aria-hidden="true" />
        <p className="eyebrow" data-reveal>04 / Start a conversation</p>
        <h2 data-reveal>
          HAVE A HARD
          <br />
          <span>PROBLEM?</span>
        </h2>
        <div className="contact-bottom" data-reveal>
          <p>
            I am open to AI evaluation, software engineering, and product-focused opportunities.
          </p>
          <a className="contact-link" href="mailto:pprajapati991@gmail.com">
            <span>pprajapati991@gmail.com</span>
            <ArrowDownRight size={26} aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer>
        <span>© 2026 Dheeraj Kumar Prajapati</span>
        <span>Beernagar · Bihar · India</span>
        <div>
          <a href="https://github.com/premdheeraj" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/dheeraj121" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
