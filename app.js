"use strict";

// Register GSAP Plugins
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// STATIC PORTFOLIO DATA (ZERO BACKEND / ZERO DB)
// ==========================================
const PORTFOLIO_DATA = {
    profile: {
        full_name: "Janus Dominic",
        professional_title: "Full-Stack Developer & Software Engineer",
        bio: "Passionate developer with expertise in building modern web applications. Specializing in high-performance web applications, interactive 3D interfaces, and seamless digital user experiences.",
        email: "janusdominic0@gmail.com",
        phone: "+63 994 873 9200",
        facebook_url: "https://www.facebook.com/notagirlgamer69",
        profile_photo_url: "https://i.pravatar.cc/400?img=33"
    },
    projects: [
        {
            id: 1,
            title: "SayLess Company Website",
            description: "A professional website for a tech company called 'SayLess' that specializes in building digital experiences, such as premium websites and applications. It features a portfolio of their work (including a Research Ethics Office portal), a list of team members (with Janus Dominic as Project Manager), and a blog with industry insights.",
            project_url: "https://sayless.click/"
        },
        {
            id: 2,
            title: "QuickNote",
            description: "A simple web utility designed for fast, frictionless text capture. It lets you open a page, type your thoughts immediately, and keep quick reference notes accessible across your devices.",
            project_url: "https://quicknote.ct.ws/"
        },
        {
            id: 3,
            title: "Fitness Gym (Old Project)",
            description: "A promotional landing page for a local gym ('Fitness Gym'). It outlines the gym's offerings, including basic equipment (cardio, weights), training guides (moderate to expert levels), and opportunities to become a trainer.",
            project_url: "https://dominic-lab09.netlify.app/#"
        },
        {
            id: 4,
            title: "BlitzType",
            description: "A typing game that challenges players to type as fast as possible. It features a leaderboard and a timer to keep track of the player's progress.",
            project_url: "https://blitztype-5cd8b.web.app/"
        }
    ],
    skills: [
        { id: 1, name: "PHP" },
        { id: 2, name: "JavaScript" },
        { id: 3, name: "Python" },
        { id: 4, name: "HTML5/CSS3" },
        { id: 5, name: "React" },
        { id: 6, name: "Tailwind CSS" },
        { id: 7, name: "MySQL" },
        { id: 8, name: "PostgreSQL" },
        { id: 9, name: "Git & GitHub" },
        { id: 10, name: "VS Code" },
        { id: 11, name: "Problem Solving" },
        { id: 12, name: "Team Collaboration" },
        { id: 13, name: "Full-Stack Developer" },
        { id: 14, name: "Software Engineer" },
        { id: 15, name: "TypeScript" },
        { id: 16, name: "Laravel" },
        { id: 17, name: "Node.js" },
        { id: 18, name: "MongoDB" },
        { id: 19, name: "Docker" },
        { id: 20, name: "Communication" }
    ],
    hobbies: [
        { id: 1, name: "Gaming", description: "Playing strategy and RPG games" },
        { id: 2, name: "Creating Websites", description: "Building experimental applications" },
        { id: 3, name: "Reading Tech Blogs", description: "Staying updated with latest technology trends" },
        { id: 4, name: "Coding Side Projects", description: "Building experimental applications" },
        { id: 5, name: "Instrumental Music", description: "Playing the Guitar" }
    ],
    experience: [
        {
            id: 1,
            position: "Junior Full-Stack Developer",
            company: "Western Mindanao State University",
            description: "Developing and maintaining web applications using PHP, MySQL, and React. Collaborating with cross-functional teams to deliver high-quality software solutions."
        },
        {
            id: 2,
            position: "Web Development Intern",
            company: "Western Mindanao State University",
            description: "Assisted in building responsive websites and learned industry best practices. Worked on 5+ client projects during the internship period."
        }
    ],
    education: [
        {
            id: 1,
            degree: "Bachelor of Science in Computer Science",
            institution: "Western Mindanao State University",
            description: "Focused on software engineering, database systems, and web development. Dean's Lister for 4 consecutive semesters."
        },
        {
            id: 2,
            degree: "High School Diploma",
            institution: "Zamboanga National High School West",
            description: "Specialized in Science, Technology, Engineering, and Mathematics (STEM Track)."
        }
    ],
    certifications: [
        {
            id: 1,
            title: "Legacy Responsive Web Design V8",
            issuing_organization: "FreeCodeCamp",
            description: "Validates expertise in developing and maintaining web applications"
        },
        {
            id: 2,
            title: "School Internship",
            issuing_organization: "Western Mindanao State University",
            description: "Professional certification for database administration & web development"
        }
    ],
    achievements: [
        {
            id: 1,
            title: "FreeCodeCamp Responsive Web Design",
            issuing_organization: "FreeCodeCamp",
            description: "Recognized for outstanding capstone project in Computer Science with innovative approach to solving real-world problems."
        },
        {
            id: 2,
            title: "Research Ethics Office",
            issuing_organization: "Western Mindanao State University",
            description: "Research Ethics Office was built. This system was built to help the Research Ethics Office with their daily tasks."
        },
        {
            id: 3,
            title: "ACT Internship",
            issuing_organization: "ACT",
            description: "Recognized for significant contributions to open-source PHP projects on GitHub."
        }
    ]
};

// ==========================================
// UTILITIES
// ==========================================
class Utils {
    static escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    static sanitizeURL(url) {
        if (!url || typeof url !== 'string') return '#';
        const trimmed = url.trim();
        // Strict allowlist: only http, https, mailto, tel, or hash anchors to block javascript: URI XSS
        if (/^(https?:\/\/|mailto:|tel:|#)/i.test(trimmed)) {
            return Utils.escapeHTML(trimmed);
        }
        return '#';
    }

    static isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        // ReDoS-safe RFC 5322 standard email validation regex
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email.trim());
    }
}



// ==========================================
// ANIMATION ENGINE
// ==========================================
class AnimationEngine {
    static lenis = null;

    static init() {
        this.simulateLoading();
        this.initCustomCursor();
        this.initLenis();
        this.initSmoothNav();
        this.initHolographicSpotlight();
        this.initMagneticButtons();
    }

    static initLenis() {
        if (typeof Lenis === "undefined") {
            console.warn("Lenis library not loaded");
            return;
        }

        // Initialize Lenis smooth scroll
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false
        });

        // Expose globally for Three.js uniform synchronizer
        window.lenis = this.lenis;

        // Synchronize with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== "undefined") {
            this.lenis.on("scroll", () => {
                ScrollTrigger.update();
            });
            ScrollTrigger.refresh();
        }

        // Bind Lenis RAF directly to GSAP Ticker
        if (typeof gsap !== "undefined") {
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    static initMagneticButtons() {
        const targets = document.querySelectorAll(".nav-item, .btn-minimal, .theme-toggle");
        targets.forEach((el) => {
            const wrap = document.createElement("div");
            wrap.className = "magnetic-wrap";
            el.parentNode.insertBefore(wrap, el);
            wrap.appendChild(el);
            wrap.addEventListener("mousemove", (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: "power2.out" });
            });
            wrap.addEventListener("mouseleave", () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    static initSmoothNav() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                const href = anchor.getAttribute("href");
                if (!href || href === "#") return;
                const targetElem = document.querySelector(href);
                if (targetElem) {
                    e.preventDefault();
                    if (this.lenis) {
                        this.lenis.scrollTo(targetElem, { offset: -30, duration: 1.2 });
                    } else {
                        targetElem.scrollIntoView({ behavior: "smooth" });
                    }
                }
            });
        });
    }

    static initHolographicSpotlight() {
        document.body.addEventListener("mousemove", (e) => {
            document.querySelectorAll('.project-card, .info-card, .skill-tag').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    static initCustomCursor() {
        const dot = document.getElementById("cursor-dot");
        const ring = document.getElementById("cursor-ring");
        if (!dot || !ring) return;

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let hasMoved = false;

        const updateCursorPos = (clientX, clientY) => {
            mouseX = clientX;
            mouseY = clientY;

            // Instant pinpoint tracking for center dot (0ms hardware-accelerated transform)
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            if (!hasMoved) {
                ringX = mouseX;
                ringY = mouseY;
                ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
                hasMoved = true;
            }

            if (!dot.classList.contains("is-active")) {
                dot.classList.add("is-active");
                ring.classList.add("is-active");
            }
        };

        const onPointerMove = (e) => {
            updateCursorPos(e.clientX, e.clientY);
        };

        window.addEventListener("mousemove", onPointerMove, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        // Outer ring smooth follower loop via GSAP ticker
        if (typeof gsap !== "undefined") {
            gsap.ticker.add(() => {
                if (!hasMoved) return;
                const dt = 1.0 - Math.pow(0.72, gsap.ticker.deltaRatio());
                ringX += (mouseX - ringX) * dt;
                ringY += (mouseY - ringY) * dt;
                ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            });
        }

        // Expand hover aura on interactive elements
        document.addEventListener("mouseover", (e) => {
            if (e.target.closest("a, button, input, textarea, .project-card, .skill-tag, .info-card, .btn-minimal, .theme-toggle, .magnetic-wrap, [role='button']")) {
                dot.classList.add("hovered");
                ring.classList.add("hovered");
            } else {
                dot.classList.remove("hovered");
                ring.classList.remove("hovered");
            }
        });

        // Click compression feedback
        window.addEventListener("mousedown", () => {
            dot.classList.add("clicked");
            ring.classList.add("clicked");
        });
        window.addEventListener("mouseup", () => {
            dot.classList.remove("clicked");
            ring.classList.remove("clicked");
        });

        // Window boundary handling
        document.addEventListener("mouseleave", () => {
            dot.classList.remove("is-active");
            ring.classList.remove("is-active");
        });
        document.addEventListener("mouseenter", () => {
            if (hasMoved) {
                dot.classList.add("is-active");
                ring.classList.add("is-active");
            }
        });
    }

    static animateItems(selector) {
        setTimeout(() => {
            const items = document.querySelectorAll(selector);
            items.forEach((el) => {
                if (el.tagName.match(/^H[1-6]$/)) {
                    el.innerHTML = `<div class="reveal-text"><span>${el.innerText}</span></div>`;
                    el.classList.remove("opacity-0", "translate-y-8");
                }
            });

            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.batch(selector, {
                    onEnter: (batch) => {
                        batch.forEach((el, i) => {
                            const mask = el.querySelector(".reveal-text");
                            if (mask) {
                                setTimeout(() => mask.classList.add("is-visible"), i * 100);
                            } else {
                                gsap.to(el, { opacity: 1, y: 0, delay: i * 0.1, duration: 0.8, ease: "power3.out" });
                            }

                            if (el.hasAttribute("data-scramble") || el.querySelector("[data-scramble]")) {
                                const target = el.hasAttribute("data-scramble") ? el : el.querySelector("[data-scramble]");
                                UIManager.scrambleText(target);
                                target.addEventListener("mouseenter", () => {
                                    UIManager.scrambleText(target);
                                });
                            }
                        });
                    },
                    start: "top 90%",
                    once: true,
                });
            } else {
                items.forEach((el, i) => {
                    gsap.to(el, { opacity: 1, y: 0, delay: i * 0.05, duration: 0.6 });
                });
            }
        }, 100);
    }

    static initTilt(element) {
        if (AnimationEngine.prefersReducedMotion) return;
        const image = element.querySelector("img");
        
        let lastX = 0;
        let lastY = 0;
        let velocity = 0;
        
        gsap.set(element, { transformPerspective: 1000, transformOrigin: "center center" });
        
        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const xPct = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct = (e.clientY - rect.top) / rect.height - 0.5;
            
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            velocity = Math.sqrt(dx*dx + dy*dy);
            lastX = e.clientX;
            lastY = e.clientY;

            if (velocity > 40) {
                element.classList.add('is-tearing');
                const tearDisplacement = document.getElementById('tear-displacement');
                if (tearDisplacement) tearDisplacement.setAttribute('scale', Math.min(velocity, 80).toString());
                
                gsap.to(element, { rotationX: yPct * -30, rotationY: xPct * 30, scale: 1.05, duration: 0.2, ease: "power4.out" });
                if (image) gsap.to(image, { x: xPct * -40, y: yPct * -40, scale: 1.15, duration: 0.2, ease: "power4.out" });
            } else {
                element.classList.remove('is-tearing');
                gsap.to(element, { rotationX: yPct * -10, rotationY: xPct * 10, scale: 1.02, duration: 0.1 });
                if (image) gsap.to(image, { x: xPct * -20, y: yPct * -20, scale: 1.1, duration: 0.1 });
            }
        });
        
        element.addEventListener("mouseleave", () => {
            element.classList.remove('is-tearing');
            gsap.to(element, { rotationX: 0, rotationY: 0, scale: 1, duration: 1.2, ease: "elastic.out(1.2, 0.3)" });
            if (image) gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
        });
    }

    static simulateLoading() {
        const bar = document.getElementById("loader-bar");
        const logs = document.getElementById("boot-logs");
        const preloader = document.getElementById("preloader");
        const flash = document.getElementById("tv-flash");
        
        if (!preloader) return;
        document.body.classList.add("loading");

        const bootText = ["INITIALIZING CORE...", "MOUNTING DOM...", "LOADING SHADERS...", "SYSTEM READY."];
        let width = 0, logIndex = 0;

        const interval = setInterval(() => {
            width += Math.random() * 8 + 4;
            if (width > 100) width = 100;
            if (bar) bar.style.width = width + "%";

            if (logs && width > (logIndex + 1) * 25 && logIndex < bootText.length) {
                logs.innerHTML += `<div><span class="text-accent">&gt;&gt;</span> ${bootText[logIndex]}</div>`;
                if (logs.children.length > 6) logs.removeChild(logs.firstChild);
                logIndex++;
            }

            if (width === 100) {
                clearInterval(interval);
                const tl = gsap.timeline({ onComplete: () => document.body.classList.remove("loading") });
                
                if (flash) tl.to(flash, { opacity: 1, duration: 0.1, ease: "power2.in" });
                tl.to(preloader, {
                    scaleY: 0.005, duration: 0.2, ease: "power2.inOut",
                    onStart: () => { 
                        if (flash) flash.style.opacity = 0; 
                        if (window.playIntroAnimation) window.playIntroAnimation();
                    }
                }).to(preloader, { scaleX: 0, duration: 0.2, ease: "power2.in" }).set(preloader, { display: "none" });

                setTimeout(() => {
                    this.animateItems(".fade-in");
                    const h1 = document.querySelector("h1");
                    if (h1) {
                        UIManager.scrambleText(h1);
                        h1.addEventListener("mouseenter", () => {
                            UIManager.scrambleText(h1);
                        });
                    }
                }, 300);
            }
        }, 15);
    }
}

// ==========================================
// UI MANAGER
// ==========================================
class UIManager {
    static init() {
        this.initTabListener();
        this.initClickEffects();
        this.initConsoleSignature();
        this.initKonamiCode();
        this.initScrollSpy();
        this.initFooterSystem();
        this.setupContactForm();
    }

    static scrambleText(element) {
        if (!element || element.dataset.scrambling === "true") return;
        element.dataset.scrambling = "true";
        const finalText = element.dataset.originalText || element.innerText;
        if (!element.dataset.originalText) element.dataset.originalText = finalText;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
        let iterations = 0;
        const interval = setInterval(() => {
            element.innerText = finalText.split("").map((letter, i) => i < iterations ? finalText[i] : chars[Math.floor(Math.random() * chars.length)]).join("");
            if (iterations >= finalText.length) {
                clearInterval(interval);
                element.dataset.scrambling = "false";
            }
            iterations += 0.33;
        }, 30);
    }

    static showToast(message, type = "success") {
        const container = document.getElementById("toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="text-lg font-bold toast-icon">${type === "success" ? "✓" : "⚠"}</span> <span>${Utils.escapeHTML(message)}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    static renderProjects(data) {
        const grid = document.getElementById("projects-grid");
        if (!grid) return;
        grid.innerHTML = data.map(p => `
            <div class="project-card p-8 opacity-0 translate-y-8 group relative flex flex-col h-full">
                <div class="mb-6 border-b border-gray-500/20 pb-6">
                     <h3 class="text-3xl font-bold mb-2">${Utils.escapeHTML(p.title)}</h3>
                </div>
                <p class="text-sm text-secondary mb-8 leading-relaxed flex-grow">${Utils.escapeHTML(p.description)}</p>
                <div class="flex items-center text-xs font-mono tracking-widest mt-auto">
                    <a href="${Utils.sanitizeURL(p.project_url)}" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors">[ VIEW PROJECT ]</a>
                </div>
            </div>
        `).join("");
        AnimationEngine.animateItems(".project-card");
        setTimeout(() => document.querySelectorAll(".project-card").forEach(el => AnimationEngine.initTilt(el)), 500);
    }

    static renderSkills(data) {
        const container = document.getElementById("skills-container");
        if (!container) return;
        container.innerHTML = data.map(s => `
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 transition-colors relative overflow-hidden">
                ${Utils.escapeHTML(s.name)}
            </div>
        `).join("");
        AnimationEngine.animateItems(".skill-tag");
        setTimeout(() => document.querySelectorAll(".skill-tag").forEach(el => AnimationEngine.initTilt(el)), 500);
    }

    static renderExperience(data) {
        const container = document.getElementById("experience-list");
        if (!container) return;
        container.innerHTML = data.map(exp => `
            <div class="info-card p-6 opacity-0 translate-y-8 border-l-2 border-transparent transition-all relative">
                <h4 class="font-bold text-lg">${Utils.escapeHTML(exp.position)}</h4>
                <p class="text-sm font-mono mb-4 text-secondary">${Utils.escapeHTML(exp.company)}</p>
                <p class="text-sm text-secondary/80 leading-relaxed">${Utils.escapeHTML(exp.description)}</p>
            </div>
        `).join("");
        AnimationEngine.animateItems("#experience-list > div");
        setTimeout(() => document.querySelectorAll("#experience-list > div").forEach(el => AnimationEngine.initTilt(el)), 500);
    }

    static renderSimpleCard(type, data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = data.map(item => `
            <div class="info-card p-6 opacity-0 translate-y-8 relative">
                <h4 class="font-bold text-lg mb-1">${Utils.escapeHTML(item.degree || item.title || item.name)}</h4>
                <p class="text-sm font-mono text-accent">${Utils.escapeHTML(item.institution || item.issuing_organization || '')}</p>
                ${item.description ? `<p class="text-sm text-secondary/80 mt-2">${Utils.escapeHTML(item.description)}</p>` : ''}
            </div>
        `).join("");
        AnimationEngine.animateItems(`#${containerId} > div`);
        setTimeout(() => document.querySelectorAll(`#${containerId} > div`).forEach(el => AnimationEngine.initTilt(el)), 500);
    }

    static setupContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;
        const btn = form.querySelector("button");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const originalText = btn.innerText;

            const formData = Object.fromEntries(new FormData(form));

            // Honeypot bot trap: silent drop if bot fills the hidden _gotcha input
            if (formData._gotcha && formData._gotcha.trim() !== "") {
                btn.classList.add("success");
                btn.innerText = "TRANSMISSION RECEIVED";
                form.reset();
                this.showToast("Message transmitted successfully.", "success");
                setTimeout(() => { btn.classList.remove("success"); btn.innerText = originalText; }, 3000);
                return;
            }

            // Anti-Automation / Client-side Rate Limiting (45-second cooldown)
            const lastSubmission = localStorage.getItem("pf_last_transmission");
            const now = Date.now();
            if (lastSubmission && (now - parseInt(lastSubmission, 10)) < 45000) {
                const waitSec = Math.ceil((45000 - (now - parseInt(lastSubmission, 10))) / 1000);
                this.showToast(`Rate limit active. Please wait ${waitSec}s before transmitting another message.`, "error");
                return;
            }

            // Input boundary validation & sanitization
            const visitorName = (formData.visitor_name || "").trim().slice(0, 100);
            const visitorEmail = (formData.visitor_email || "").trim().slice(0, 120);
            const subject = (formData.subject || "").trim().slice(0, 150);
            const message = (formData.message || "").trim().slice(0, 2000);

            if (!visitorName || visitorName.length < 2) {
                this.showToast("Please enter a valid name (at least 2 characters).", "error");
                return;
            }

            if (!Utils.isValidEmail(visitorEmail)) {
                this.showToast("Please enter a valid email address.", "error");
                return;
            }

            if (!message || message.length < 5) {
                this.showToast("Please provide a descriptive message (at least 5 characters).", "error");
                return;
            }

            btn.classList.add("loading");
            btn.innerText = "TRANSMITTING...";

            const payload = {
                name: visitorName,
                email: visitorEmail,
                subject: subject || "Portfolio Contact",
                message: message
            };

            try {
                // Direct Formspree submission without PHP/backend requirement
                const formspreeId = "xreezznd";
                const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("Transmission failed");

                localStorage.setItem("pf_last_transmission", Date.now().toString());
                btn.classList.remove("loading");
                btn.classList.add("success");
                btn.innerText = "TRANSMISSION RECEIVED";
                form.reset();
                this.showToast("Message transmitted successfully.", "success");
                setTimeout(() => { btn.classList.remove("success"); btn.innerText = originalText; }, 3000);
            } catch (err) {
                btn.classList.remove("loading");
                btn.innerText = "ERROR - RETRY";
                btn.style.borderColor = "red";
                this.showToast("Failed to transmit message. Please check connection.", "error");
                setTimeout(() => { btn.innerText = originalText; btn.style.borderColor = ""; }, 3000);
            }
        });
    }

    static initTabListener() {
        const originalTitle = document.title;
        document.addEventListener("visibilitychange", () => { document.title = document.hidden ? "⚠ CONNECTION LOST..." : originalTitle; });
    }

    static initClickEffects() {
        document.addEventListener("click", (e) => {
            const ripple = document.createElement("div");
            ripple.className = "click-ripple";
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    static initConsoleSignature() {
        console.log("%c PORTFOLIO SYSTEM ONLINE ", "background: #0f172a; color: #22d3ee; padding: 10px; border: 1px solid #22d3ee; font-weight: bold;");
    }

    static initKonamiCode() {
        const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        let current = 0;
        document.addEventListener("keydown", (e) => {
            if (e.key === code[current]) {
                current++;
                if (current === code.length) {
                    document.documentElement.style.setProperty("--accent", "#ff00ff");
                    document.body.style.filter = "invert(1) hue-rotate(180deg)";
                    current = 0;
                }
            } else current = 0;
        });
    }

    static initScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    document.querySelectorAll(".nav-item").forEach(l => l.classList.remove("active-link"));
                    const link = document.querySelector(`a[href="#${id}"]`);
                    if (link) link.classList.add("active-link");
                }
            });
        }, observerOptions);

        ["projects", "skills", "info", "contact"].forEach(id => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });
    }

    static initFooterSystem() {
        const footerYear = document.getElementById("footer-year");
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        const uptimeEl = document.getElementById("system-uptime");
        if (uptimeEl) {
            const startTime = Date.now();
            setInterval(() => {
                const diff = Math.floor((Date.now() - startTime) / 1000);
                const h = String(Math.floor(diff / 3600)).padStart(2, '0');
                const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
                const s = String(diff % 60).padStart(2, '0');
                uptimeEl.textContent = `${h}:${m}:${s}`;
            }, 1000);
        }
    }
}

// ==========================================
// APP INITIALIZATION
// ==========================================
class App {
    static init() {
        AnimationEngine.init();
        UIManager.init();

        this.renderAllData();
    }

    static renderAllData() {
        const profile = PORTFOLIO_DATA.profile;
        
        // Render Profile
        const titleEl = document.getElementById("professional-title");
        if (titleEl) titleEl.innerText = profile.professional_title;

        const bioEl = document.getElementById("bio-text");
        if (bioEl) bioEl.innerText = profile.bio;

        const contactInfoEl = document.getElementById("contact-info");
        if (contactInfoEl) {
            contactInfoEl.innerHTML = `
                <div class="flex justify-between border-b border-gray-500/30 pb-2"><span>EMAIL</span> <a href="mailto:${Utils.escapeHTML(profile.email)}" class="text-secondary hover:text-accent transition-colors">${Utils.escapeHTML(profile.email)}</a></div>
                <div class="flex justify-between border-b border-gray-500/30 pb-2 pt-2"><span>PHONE</span> <a href="tel:${Utils.escapeHTML(profile.phone.replace(/\s+/g, ''))}" class="text-secondary hover:text-accent transition-colors">${Utils.escapeHTML(profile.phone)}</a></div>
                <div class="pt-4"><a href="${Utils.sanitizeURL(profile.facebook_url)}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">FACEBOOK LINK_</a></div>
            `;
        }

        // Render Portfolio Sections
        UIManager.renderProjects(PORTFOLIO_DATA.projects);
        UIManager.renderSkills(PORTFOLIO_DATA.skills);
        UIManager.renderSimpleCard('hobby', PORTFOLIO_DATA.hobbies, 'hobbies-list');
        UIManager.renderExperience(PORTFOLIO_DATA.experience);
        UIManager.renderSimpleCard('education', PORTFOLIO_DATA.education, 'education-list');
        UIManager.renderSimpleCard('certification', PORTFOLIO_DATA.certifications, 'certifications-list');
        UIManager.renderSimpleCard('achievement', PORTFOLIO_DATA.achievements, 'achievements-list');
    }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => App.init());
