// Register Plugins
gsap.registerPlugin(ScrollTrigger);

let lenis;
// Check for Reduced Motion Preference
let prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
prefersReducedMotion = false; // FORCE ANIMATION FOR DEBUGGING

// === GLOBAL DATA STORE ===
window.siteData = {
  projects: [],
  skills: [],
  experience: [],
  generic: [],
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Start Boot Sequence
  simulateLoading();

  // 2. Init Smooth Scroll & Physics (Conditional)
  // 2. Init Smooth Scroll & Physics (Forced)
  try {
    if (!prefersReducedMotion) {
      initLenis();
      initMagneticButtons();
      // We delay initTilt slightly to ensure DOM elements from APIs are painted
      setTimeout(() => {
        document.querySelectorAll(".project-card").forEach(initTilt);
      }, 500);
    }
  } catch (err) {
    console.error("Critical Animation Error:", err);
    // Fallback: Ensure body scroll is enabled if Lenis blocked it (though Lenis usually doesn't block unless init)
    document.body.style.overflow = "auto";
  }

  initSmoothNav();
  initCustomCursor();
  initAudioInteractions();

  // 3. Personality Features
  initTabListener();
  initClickEffects();
  initConsoleSignature();
  initConsoleSignature();
  initKonamiCode();
  initAdminMode();

  // 4. Load Data
  loadProfile();
  loadProjects();
  loadSkills();
  loadGeneric(
    "experience_api.php?duration=true",
    "experience-list",
    renderExperience
  );
  loadGeneric(
    "education_api.php",
    "education-list",
    renderSimpleCard("education")
  );
  loadGeneric(
    "certifications_api.php",
    "certifications-list",
    renderSimpleCard("certification")
  );
  loadGeneric(
    "achievements_api.php",
    "achievements-list",
    renderSimpleCard("achievement")
  );
  loadGeneric("hobbies_api.php", "hobbies-list", renderHobby);

  setupContactForm();
});

// === VELOCITY SKEW ===
function initLenis() {
  // Check if Lenis is defined (CDN loaded?)
  if (typeof Lenis === "undefined") {
    console.warn("Lenis library not loaded. Falling back to native scroll.");
    return;
  }
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  const content = document.querySelector(".content-wrapper");
  let skew = 0;

  lenis.on("scroll", ({ velocity }) => {
    ScrollTrigger.update();
    const targetSkew = velocity * 0.15;
    skew += (targetSkew - skew) * 0.1;
    content.style.transform = `skewY(${skew}deg) translate3d(0,0,0)`;
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// === MAGNETIC BUTTONS ===
function initMagneticButtons() {
  const targets = document.querySelectorAll(
    ".nav-item, .btn-minimal, .theme-toggle"
  );
  targets.forEach((el) => {
    const wrap = document.createElement("div");
    wrap.className = "magnetic-wrap";
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    wrap.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    });
  });
}

// === SMOOTH NAV ===
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        if (lenis) {
          lenis.scrollTo(targetElem, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          targetElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// === BOOT SEQUENCE (CRT TV TURN OFF EFFECT) ===
function simulateLoading() {
  const bar = document.getElementById("loader-bar");
  const logs = document.getElementById("boot-logs");
  const preloader = document.getElementById("preloader");
  const flash = document.getElementById("tv-flash");

  document.body.classList.add("loading");

  const bootText = [
    "INITIALIZING CORE...",
    "MOUNTING DOM...",
    "Loading SHADERS...",
    "Loading GPU...",
    "Loading ASSETS...",
    "SYSTEM READY.",
  ];

  let width = 0;
  let logIndex = 0;

  const addLog = (text) => {
    const p = document.createElement("div");
    p.innerHTML = `<span class="text-accent">>></span> ${text}`;
    logs.appendChild(p);
    if (logs.children.length > 6) logs.removeChild(logs.firstChild);
  };

  const interval = setInterval(() => {
    width += Math.random() * 2.5; // Random speed
    if (width > 100) width = 100;
    bar.style.width = width + "%";

    // Add logs based on progress
    if (width > (logIndex + 1) * 14 && logIndex < bootText.length) {
      addLog(bootText[logIndex]);
      logIndex++;
    }

    if (width === 100) {
      clearInterval(interval);
      addLog("ACCESS GRANTED.");

      // === THE "TV TURN OFF" ANIMATION ===
      const tl = gsap.timeline({
        onComplete: () => document.body.classList.remove("loading"),
      });

      // 1. Flash White (Bang!)
      tl.to(flash, { opacity: 1, duration: 0.1, ease: "power2.in" })

        // 2. Collapse Vertically (Squeeze)
        .to(preloader, {
          scaleY: 0.005,
          duration: 0.2,
          ease: "power2.inOut",
          onStart: () => {
            flash.style.opacity = 0; // Hide flash instantly
            if (window.playIntroAnimation) window.playIntroAnimation();
          },
        })

        // 3. Collapse Horizontally (Zip) & Fade
        .to(preloader, {
          scaleX: 0,
          duration: 0.2,
          ease: "power2.in",
        })

        // 4. Hide Element
        .set(preloader, { display: "none" });

      // Trigger Rest of Site
      setTimeout(() => {
        animateItems(".fade-in");
        const h1 = document.querySelector("h1");
        scrambleText(h1);
        if (h1) h1.addEventListener("mouseenter", () => scrambleText(h1));
        initScrollSpy();
        initFooterSystem();
      }, 400);
    }
  }, 20);
}
// === 3D TILT ===
function initTilt(element) {
  if (prefersReducedMotion) return;

  const image = element.querySelector("img");
  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    const xRot = yPct * -10;
    const yRot = xPct * 10;
    gsap.to(element, {
      transform: `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`,
      duration: 0.1,
      ease: "power1.out",
    });
    if (image)
      gsap.to(image, {
        x: xPct * -20,
        y: yPct * -20,
        scale: 1.1,
        duration: 0.1,
        ease: "power1.out",
      });
  });
  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      transform: `perspective(1000px) rotateX(0) rotateY(0) scale(1)`,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
    });
    if (image)
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
  });
}

// === MASKED REVEAL & SCRAMBLE ===
function animateItems(selector) {
  setTimeout(() => {
    const items = document.querySelectorAll(selector);
    items.forEach((el) => {
      // Wrap headers in mask
      if (el.tagName.match(/^H[1-6]$/)) {
        const text = el.innerText;
        el.innerHTML = `<div class="reveal-text"><span>${text}</span></div>`;
        el.classList.remove("opacity-0", "translate-y-8");
      }
    });

    ScrollTrigger.batch(selector, {
      onEnter: (batch) => {
        batch.forEach((el, i) => {
          const mask = el.querySelector(".reveal-text");
          if (mask) {
            setTimeout(() => mask.classList.add("is-visible"), i * 100);
          } else {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              delay: i * 0.1,
              duration: 0.8,
              ease: "power3.out",
            });
          }

          if (
            el.hasAttribute("data-scramble") ||
            el.querySelector("[data-scramble]")
          ) {
            const target = el.hasAttribute("data-scramble")
              ? el
              : el.querySelector("[data-scramble]");
            scrambleText(target);
            target.addEventListener("mouseenter", () => {
              scrambleText(target);
              if (typeof AudioEngine !== "undefined") AudioEngine.playGlitch();
            });
          }
        });
      },
      start: "top 90%",
      once: true,
    });
  }, 100);
}

function scrambleText(element) {
  if (!element || element.dataset.scrambling === "true") return;
  element.dataset.scrambling = "true";
  const finalText = element.dataset.originalText || element.innerText;
  if (!element.dataset.originalText) element.dataset.originalText = finalText;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
  let iterations = 0;
  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((letter, index) => {
        if (index < iterations) return finalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
    if (iterations >= finalText.length) {
      clearInterval(interval);
      element.dataset.scrambling = "false";
    }
    iterations += 1 / 3;
  }, 30);
}

// === CUSTOM CURSOR ===
function initCustomCursor() {
  if (prefersReducedMotion) return;
  const cursor = document.getElementById("cursor");
  const mouse = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
  });
  document.body.addEventListener("mouseover", (e) => {
    if (
      e.target.closest(
        "a, button, input, textarea, .project-card, .magnetic-wrap"
      )
    )
      cursor.classList.add("hovered");
    else cursor.classList.remove("hovered");
  });
}

// === API LOADERS ===
const API_BASE = "./api";

async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile_api.php`);
    const data = await res.json();
    document.getElementById("professional-title").innerText =
      data.professional_title;
    document.getElementById("bio-text").innerText = data.bio;
    document.getElementById("contact-info").innerHTML = `
            <div class="flex justify-between border-b border-gray-500/30 pb-2"><span>EMAIL</span> <span>${data.email}</span></div>
            <div class="flex justify-between border-b border-gray-500/30 pb-2 pt-2"><span>PHONE</span> <span>${data.phone}</span></div>
            <div class="pt-4"><a href="${data.facebook_url}" target="_blank" class="text-accent hover:underline">FACEBOOK LINK_</a></div>
        `;
  } catch (e) {
    console.error("Error loading profile:", e);
  }
}

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects_api.php`);
    const data = await res.json();
    window.siteData.projects = data; // Cache data
    document.getElementById("projects-grid").innerHTML = data
      .map(
        (p) => `
            <div class="project-card p-8 opacity-0 translate-y-8 group relative flex flex-col h-full">
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn" onclick="openEditModal('project', ${p.id})">EDIT</button>
                    <button class="admin-action-btn del-btn" onclick="deleteItem('project', ${p.id})">DEL</button>
                </div>
                <div class="mb-6 border-b border-gray-500/20 pb-6">
                     <h3 class="text-3xl font-bold mb-2 transition-colors">${p.title}</h3>
                </div>
                <p class="text-sm text-secondary mb-8 leading-relaxed flex-grow">${p.description}</p>
                <div class="flex justify-between text-xs font-mono tracking-widest mt-auto">
                    <a href="${p.project_url}" target="_blank" class="hover:text-accent">[ VIEW PROJECT ]</a>
                </div>
            </div>
        `
      )
      .join("");
    animateItems(".project-card");

    // Add tilt to new elements if motion allowed
    // Add tilt to new elements if motion allowed
    if (!prefersReducedMotion) {
      setTimeout(() => {
        document.querySelectorAll(".project-card").forEach(initTilt);
        ScrollTrigger.refresh(); // Force refresh positions
      }, 100);
    }
  } catch (e) {
    console.error("Error loading projects:", e);
  }
}

async function loadSkills() {
  try {
    const res = await fetch(`${API_BASE}/skills_api.php`);
    const data = await res.json();
    window.siteData.skills = data; // Cache data
    document.getElementById("skills-container").innerHTML = data
      .map(
        (s) => `
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 transition-colors cursor-default relative overflow-hidden">
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn text-[0.5rem] px-1.5 py-0.5 h-auto min-h-0" onclick="openEditModal('skill', ${s.id})">EDIT</button>
                    <button class="admin-action-btn del-btn text-[0.5rem] px-1.5 py-0.5 h-auto min-h-0" onclick="deleteItem('skill', ${s.id})">DEL</button>
                </div>
                ${s.name}
            </div>
        `
      )
      .join("");
    animateItems(".skill-tag");
  } catch (e) {
    console.error("Error loading skills:", e);
  }
}

async function loadGeneric(endpoint, id, renderFn) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    const data = await res.json();

    // Store generic data based on ID for easier retrieval
    if (!window.siteData[id]) window.siteData[id] = [];
    window.siteData[id] = data;

    document.getElementById(id).innerHTML = data.map(renderFn).join("");
    animateItems(`#${id} > div`);
  } catch (e) {
    console.error(`Error loading generic data for ${id}:`, e);
  }
}

// === RENDER HELPERS ===
const renderExperience = (exp) => `
    <div class="info-card p-6 opacity-0 translate-y-8 border-l-2 border-transparent transition-all relative">
        <div class="admin-controls">
            <button class="admin-action-btn edit-btn" onclick="openEditModal('experience', ${exp.id})">EDIT</button>
            <button class="admin-action-btn del-btn" onclick="deleteItem('experience', ${exp.id})">DEL</button>
        </div>
        <div class="flex justify-between items-baseline mb-2">
            <h4 class="font-bold text-lg">${exp.position}</h4>
        </div>
        <p class="text-sm font-mono mb-4 text-secondary">${exp.company}</p>
        <p class="text-sm text-secondary/80 leading-relaxed">${exp.description}</p>
    </div>
`;

const renderSimpleCard = (type) => (item) =>
  `
    <div class="info-card p-6 opacity-0 translate-y-8 relative">
        <div class="admin-controls">
            <button class="admin-action-btn edit-btn" onclick="openEditModal('${type}', ${
    item.id
  })">EDIT</button>
            <button class="admin-action-btn del-btn" onclick="deleteItem('${type}', ${
    item.id
  })">DEL</button>
        </div>
        <h4 class="font-bold text-lg mb-1">${item.degree || item.title}</h4>
        <p class="text-sm font-mono text-accent">${
          item.institution || item.issuing_organization
        }</p>
    </div>
`;

const renderHobby = (h) => `
    <div class="info-card p-6 opacity-0 translate-y-8 relative">
        <div class="admin-controls">
            <button class="admin-action-btn edit-btn" onclick="openEditModal('hobby', ${h.id})">EDIT</button>
            <button class="admin-action-btn del-btn" onclick="deleteItem('hobby', ${h.id})">DEL</button>
        </div>
        <h4 class="font-bold text-lg mb-2">${h.name}</h4>
        <p class="text-sm text-secondary/80 leading-relaxed">${h.description}</p>
    </div>
`;

// === FORM & SYSTEM ===
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const btn = form.querySelector("button");
  btn.id = "submit-btn";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const originalText = btn.innerText;

    btn.classList.add("loading");
    btn.innerText = "TRANSMITTING...";
    AudioEngine.playClick();

    const formData = new FormData(form);
    try {
      await new Promise((r) => setTimeout(r, 1500)); // Fake delay
      const res = await fetch(`${API_BASE}/contacts_api.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (res.ok) {
        // Database save successful, now send to Formspree
        try {
          // IMPORTANT: User must replace 'YOUR_FORMSPREE_ID' with their actual Form ID from formspree.io
          // Example: 'https://formspree.io/f/xpqvjrz'
          const formspreeId = "xreezznd";

          if (formspreeId !== "YOUR_FORMSPREE_ID") {
            await fetch(`https://formspree.io/f/${formspreeId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(formData)),
            });
          }
        } catch (mailErr) {
          console.warn(
            "Formspree email failed, but message saved to DB.",
            mailErr
          );
        }

        btn.classList.remove("loading");
        btn.classList.add("success");
        btn.innerText = "TRANSMISSION RECEIVED";
        form.reset();
        setTimeout(() => {
          btn.classList.remove("success");
          btn.innerText = originalText;
        }, 3000);
      }
    } catch (e) {
      btn.classList.remove("loading");
      btn.innerText = "ERROR - RETRY";
      btn.style.borderColor = "red";
    }
  });
}

function initScrollSpy() {
  const sections = ["projects", "skills", "info", "contact"];
  sections.forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) {
          document
            .querySelectorAll(".nav-item")
            .forEach((l) => l.classList.remove("active-link"));
          const link = document.querySelector(`a[href="#${id}"]`);
          if (link) link.classList.add("active-link");
        }
      },
    });
  });
}

function initFooterSystem() {
  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  const uptimeContainer = document.getElementById("system-uptime");
  if (uptimeContainer) {
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const hrs = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
      const mins = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      uptimeContainer.innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }
}

// === PERSONALITY EXTRAS ===
function initTabListener() {
  const originalTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) document.title = "⚠ CONNECTION LOST...";
    else document.title = originalTitle;
  });
}

function initClickEffects() {
  if (prefersReducedMotion) return;
  document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.className = "click-ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

function initConsoleSignature() {
  const style =
    "background: #0f172a; color: #22d3ee; font-size: 12px; padding: 10px; border: 1px solid #22d3ee;";
  console.log("%c CREATED BY JANUS DOMINIC | SYSTEM ONLINE ", style);
}

function initKonamiCode() {
  const code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let current = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === code[current]) {
      current++;
      if (current === code.length) {
        activateGodMode();
        current = 0;
      }
    } else {
      current = 0;
    }
  });
}

function activateGodMode() {
  alert("GOD MODE ACTIVATED");
  document.documentElement.style.setProperty("--accent", "#ff00ff");
  document.body.style.filter = "invert(1) hue-rotate(180deg)";
  AudioEngine.playGlitch();
}

// === AUDIO ENGINE ===
const AudioEngine = {
  ctx: null,
  masterGain: null,
  isMuted: false,
  init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.1;
    this.masterGain.connect(this.ctx.destination);
  },
  playHover() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "sine";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  },
  playClick() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "triangle";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  },
  playGlitch() {
    if (!this.ctx || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    noise.connect(gain);
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    noise.start();
  },
  playKeystroke() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "square";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start(now);
    osc.stop(now + 0.03);
  },
};

function initAudioInteractions() {
  const startAudio = () => {
    if (!AudioEngine.ctx) AudioEngine.init();
    if (AudioEngine.ctx.state === "suspended") AudioEngine.ctx.resume();
    document.removeEventListener("click", startAudio);
    document.removeEventListener("mousemove", startAudio);
  };
  document.addEventListener("click", startAudio);
  document.addEventListener("mousemove", startAudio);

  document.body.addEventListener(
    "mouseenter",
    (e) => {
      if (e.target.closest("a, button, .project-card, .magnetic-wrap"))
        AudioEngine.playHover();
    },
    true
  );
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("a, button, .theme-toggle")) AudioEngine.playClick();
  });
  document
    .querySelectorAll(".theme-toggle")
    .forEach((btn) =>
      btn.addEventListener("click", () => AudioEngine.playGlitch())
    );

  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("keydown", () => AudioEngine.playKeystroke());
    input.addEventListener("focus", () => AudioEngine.playHover());
  });
}

// === GLOBAL MUTE TOGGLE ===
window.toggleMute = function () {
  if (typeof AudioEngine !== "undefined") {
    AudioEngine.isMuted = !AudioEngine.isMuted;
    // Optional: Save to localStorage
    // localStorage.setItem('isMuted', AudioEngine.isMuted);

    const btn = document.getElementById("mute-btn");
    if (btn) btn.classList.toggle("muted");
  }
};

// === ADMIN MODE LOGIC ===
function initAdminMode() {
  const btn = document.getElementById("admin-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Toggle Class
    document.body.classList.toggle("admin-mode");
    btn.classList.toggle("active");

    // Sound Effect
    if (typeof AudioEngine !== "undefined") AudioEngine.playClick();

    // Optional: Simple Security Check (Client-side only)
    if (document.body.classList.contains("admin-mode")) {
      // alert("ADMIN MODE ACTIVATED");
    }
  });
}

// === ADMIN FUNCTIONS ===
function openEditModal(type, id) {
  const modal = document.getElementById("edit-modal");
  const form = document.getElementById("edit-form");

  // 1. Find the Item
  let item = null;
  if (type === "project")
    item = window.siteData.projects.find((i) => i.id == id);
  else if (type === "skill")
    item = window.siteData.skills.find((i) => i.id == id);
  else if (type === "experience")
    item = window.siteData["experience-list"]?.find((i) => i.id == id);
  else if (type === "education")
    item = window.siteData["education-list"]?.find((i) => i.id == id);
  else if (type === "certification")
    item = window.siteData["certifications-list"]?.find((i) => i.id == id);
  else if (type === "achievement")
    item = window.siteData["achievements-list"]?.find((i) => i.id == id);
  else if (type === "hobby")
    item = window.siteData["hobbies-list"]?.find((i) => i.id == id);

  if (!item) {
    console.error("Item not found:", type, id);
    return;
  }

  // 2. Populate Form
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-type").value = type;
  document.getElementById("edit-title").value =
    item.title || item.name || item.position || item.degree || "";

  // Dynamic Label & Value
  const labelSubtitle = document.getElementById("label-subtitle");
  if (type === "project") {
    document.getElementById("edit-subtitle").value = item.project_url || "";
    if (labelSubtitle) labelSubtitle.innerText = "Project URL";
  } else {
    document.getElementById("edit-subtitle").value =
      item.status ||
      item.proficiency ||
      item.company ||
      item.institution ||
      item.issuing_organization ||
      "";
    if (labelSubtitle) labelSubtitle.innerText = "Subtitle / Role";
  }

  document.getElementById("edit-desc").value = item.description || "";

  // 3. Toggle Visibility based on Type
  const groupSubtitle = document.getElementById("group-subtitle");
  const groupDesc = document.getElementById("group-desc");

  // Reset defaults (Show All)
  groupSubtitle.style.display = "block";
  groupDesc.style.display = "block";

  if (type === "project") {
    // Show Subtitle (as URL), Keep Description
    groupSubtitle.style.display = "block";
  } else if (type === "skill") {
    // Remove Description and Subtitle for Skills (Name only)
    groupDesc.style.display = "none";
    groupSubtitle.style.display = "none";
  } else if (["education", "certification", "achievement"].includes(type)) {
    // Remove Description for Background
    groupDesc.style.display = "none";
  } else if (type === "hobby") {
    // Hide Subtitle, Show Description
    groupSubtitle.style.display = "none";
  }
  // Experience keeps everything

  modal.classList.add("active");
}

function openAddModal(type) {
  const modal = document.getElementById("edit-modal");
  document.getElementById("edit-form").reset();
  document.getElementById("edit-id").value = ""; // Empty ID signals "Add"
  document.getElementById("edit-type").value = type;

  // Reset Labels
  const labelSubtitle = document.getElementById("label-subtitle");
  if (type === "project") {
    if (labelSubtitle) labelSubtitle.innerText = "Project URL";
  } else {
    if (labelSubtitle) labelSubtitle.innerText = "Subtitle / Role";
  }

  // Visibility Logic
  const groupSubtitle = document.getElementById("group-subtitle");
  const groupDesc = document.getElementById("group-desc");
  groupSubtitle.style.display = "block";
  groupDesc.style.display = "block";

  if (type === "skill") {
    groupDesc.style.display = "none";
    groupSubtitle.style.display = "none";
  } else if (["education", "certification", "achievement"].includes(type))
    groupDesc.style.display = "none";
  else if (type === "hobby") groupSubtitle.style.display = "none";

  modal.classList.add("active");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("active");
}

// Handle Form Submission
document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const rawData = Object.fromEntries(formData.entries());
  const type = rawData.type;
  const id = rawData.id;

  // 1. Prepare Payload & Endpoint
  let endpoint = "";
  const action = id ? "update" : "add"; // Detect Action
  let payload = { action: action };
  if (id) payload.id = id;

  const today = new Date().toISOString().split("T")[0]; // Default date

  if (type === "project") {
    endpoint = "projects_api.php";
    payload.title = rawData.title;
    payload.project_url = rawData.subtitle;
    payload.description = rawData.description;
  } else if (type === "skill") {
    endpoint = "skills_api.php";
    payload.name = rawData.title;

    // payload.proficiency = rawData.subtitle; // Removed

    // Default or Preserve Category
    if (action === "add") payload.category_id = 1;
    else {
      const original = window.siteData.skills.find((s) => s.id == id);
      if (original) payload.category_id = original.category_id;
    }
  } else if (type === "experience") {
    endpoint = "experience_api.php";
    payload.position = rawData.title;
    payload.company = rawData.subtitle;
    payload.description = rawData.description;

    if (action === "add") {
      payload.start_date = today;
      payload.is_current = true;
    } else {
      const original = window.siteData["experience-list"]?.find(
        (e) => e.id == id
      );
      if (original) {
        payload.start_date = original.start_date;
        payload.end_date = original.end_date;
        payload.is_current = original.is_current;
      }
    }
  } else if (type === "education") {
    endpoint = "education_api.php";
    payload.degree = rawData.title;
    payload.institution = rawData.subtitle;
    payload.description = rawData.description;

    if (action === "add") {
      payload.start_date = today;
      payload.is_current = true;
    } else {
      const original = window.siteData["education-list"]?.find(
        (e) => e.id == id
      );
      if (original) {
        payload.start_date = original.start_date;
        payload.end_date = original.end_date;
        payload.is_current = original.is_current;
        payload.grade = original.grade;
        payload.location = original.location;
        payload.field_of_study = original.field_of_study;
      }
    }
  } else if (type === "certification") {
    endpoint = "certifications_api.php";
    payload.title = rawData.title;
    payload.issuing_organization = rawData.subtitle;
    payload.description = rawData.description;

    if (action === "add") {
      payload.issue_date = today;
    } else {
      const original = window.siteData["certifications-list"]?.find(
        (e) => e.id == id
      );
      if (original) {
        payload.issue_date = original.issue_date;
        payload.expiry_date = original.expiry_date;
        payload.credential_id = original.credential_id;
        payload.credential_url = original.credential_url;
      }
    }
  } else if (type === "achievement") {
    endpoint = "achievements_api.php";
    payload.title = rawData.title;
    payload.issuing_organization = rawData.subtitle;
    payload.description = rawData.description;

    if (action === "add") {
      payload.date_achieved = today;
      payload.category = "other";
    } else {
      const original = window.siteData["achievements-list"]?.find(
        (e) => e.id == id
      );
      if (original) {
        payload.date_achieved = original.date_achieved;
        payload.category = original.category;
      }
    }
  } else if (type === "hobby") {
    endpoint = "hobbies_api.php";
    payload.name = rawData.title;
    payload.description = rawData.description;
  }

  if (!endpoint) {
    alert("Save not implemented for this type yet.");
    return;
  }

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Loading State
    btn.innerHTML = `SAVING <span class="animate-pulse">...</span>`;
    btn.classList.add("loading");
    btn.disabled = true;

    // Artificial Delay for effect (optional, feels more 'processed')
    await new Promise((r) => setTimeout(r, 600));

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (res.ok) {
      showToast("CHANGES SAVED TO SYSTEM", "success");
      closeEditModal();

      // Refresh Data w/o full reload if possible, but reload is safer for now
      setTimeout(() => location.reload(), 1000);
    } else {
      showToast("ERROR: " + (result.message || "Unknown error"), "error");
      btn.innerHTML = originalText;
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  } catch (err) {
    console.error("Save Error:", err);
    showToast("CRITICAL SAVE FAILURE", "error");
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = "RETRY SAVE";
    btn.classList.remove("loading");
    btn.disabled = false;
  }
});

// === TOAST SYSTEM ===
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Icon
  const icon = type === "success" ? "✓" : "⚠";

  toast.innerHTML = `
        <span class="text-lg font-bold toast-icon">${icon}</span>
        <span>${message}</span>
    `;

  container.appendChild(toast);

  // Trigger Animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

async function deleteItem(type, id) {
  // OLD: confirm()
  // NEW: Open Custom Modal
  openDeleteModal(`Are you sure you want to delete this ${type}?`, async () => {
    // Callback when "DELETE" is clicked in modal
    await performDelete(type, id);
  });
}

async function performDelete(type, id) {
  let endpoint = "";
  switch (type) {
    case "project":
      endpoint = "projects_api.php";
      break;
    case "skill":
      endpoint = "skills_api.php";
      break;
    case "experience":
      endpoint = "experience_api.php";
      break;
    case "education":
      endpoint = "education_api.php";
      break;
    case "certification":
      endpoint = "certifications_api.php";
      break;
    case "achievement":
      endpoint = "achievements_api.php";
      break;
    case "hobby":
      endpoint = "hobbies_api.php";
      break;
    default:
      console.error("Unknown type for delete:", type);
      showToast("DELETE FAILED: Unknown Type", "error");
      return;
  }

  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify({ action: "delete", id: id }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (res.ok) {
      showToast(`${type.toUpperCase()} DELETED SUCCESSFULLY`, "success");
      // Give time for toast to be seen, then reload
      setTimeout(() => location.reload(), 1000);
    } else {
      showToast(
        "DELETE FAILED: " + (result.message || "Unknown error"),
        "error"
      );
    }
  } catch (e) {
    console.error("Delete Error:", e);
    showToast("SYSTEM ERROR DURING DELETE", "error");
  }
}

// ==========================================
// Custom Delete Modal Logic
// ==========================================
let deleteConfirmCallback = null;

function openDeleteModal(message, onConfirm) {
  const modal = document.getElementById("delete-modal");
  const messageEl = document.getElementById("delete-message");

  if (message) {
    // preserve the warning span styled in HTML
    messageEl.innerHTML = `${message} <br><span class="text-[#ef4444] font-bold mt-4 block uppercase tracking-widest text-xs border border-[#ef4444] p-2 inline-block bg-[rgba(239,68,68,0.1)]">⚠ This action cannot be undone.</span>`;
  }

  deleteConfirmCallback = onConfirm;

  // Use .active for flex display (matches CSS)
  modal.classList.add("active");

  // Animate in (Optional: GSAP can still be used for flair, or rely on CSS transition)
  // CSS handles opacity/scale, but we can enforce it here too just in case
}

function closeDeleteModal() {
  const modal = document.getElementById("delete-modal");

  modal.classList.remove("active");
  deleteConfirmCallback = null;
}

// Event Listeners for Modal
document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancel-delete");
  const confirmBtn = document.getElementById("confirm-delete");
  const backdrop = document.getElementById("delete-backdrop");

  if (cancelBtn) cancelBtn.addEventListener("click", closeDeleteModal);
  if (backdrop) backdrop.addEventListener("click", closeDeleteModal);

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (deleteConfirmCallback) {
        deleteConfirmCallback();
      }
      closeDeleteModal();
    });
  }

  // Expose to window for inline calls if needed
  window.openDeleteModal = openDeleteModal;
});
