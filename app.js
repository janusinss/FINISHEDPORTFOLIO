"use strict";

// Register Plugins
gsap.registerPlugin(ScrollTrigger);

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
}

// ==========================================
// API SERVICE
// ==========================================
class ApiService {
    static BASE_URL = './api';

    static getApiKey() {
        return sessionStorage.getItem('PORTFOLIO_API_KEY');
    }

    static async get(endpoint) {
        try {
            const res = await fetch(`${this.BASE_URL}/${endpoint}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`API GET Error (${endpoint}):`, error);
            throw error;
        }
    }

    static async post(endpoint, payload) {
        const headers = { 'Content-Type': 'application/json' };
        
        // Contacts API is public, others need Auth
        if (endpoint !== 'contacts_api.php') {
            const apiKey = this.getApiKey();
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }
        }

        const res = await fetch(`${this.BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            throw { status: res.status, message: data.message || 'Server Error' };
        }
        return data;
    }
}

// ==========================================
// AUDIO ENGINE
// ==========================================
class AudioEngine {
    static ctx = null;
    static masterGain = null;
    static isMuted = false;

    static init() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1;
        this.masterGain.connect(this.ctx.destination);
    }

    static playTone(freq, type = 'sine', duration = 0.05, maxGain = 0.5) {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.type = type;
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, now + duration);
        gain.gain.setValueAtTime(maxGain, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    static playHover() { this.playTone(800, 'sine', 0.05, 0.5); }
    static playClick() { this.playTone(150, 'triangle', 0.15, 0.8); }
    static playKeystroke() { this.playTone(600, 'square', 0.03, 0.1); }

    static playGlitch() {
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
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById("mute-btn");
        if (btn) btn.classList.toggle("muted");
    }
}

// ==========================================
// ANIMATION ENGINE
// ==========================================
class AnimationEngine {
    static prefersReducedMotion = false; // Override for debugging if needed
    static lenis = null;

    static init() {
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.prefersReducedMotion = false; // FORCE ANIMATION FOR DEBUGGING

        this.simulateLoading();
        this.initCustomCursor();
        this.initSmoothNav();
        
        try {
            if (!this.prefersReducedMotion) {
                this.initLenis();
                this.initMagneticButtons();
            }
        } catch (err) {
            console.error("Animation Error:", err);
            document.body.style.overflow = "auto";
        }
    }

    static initLenis() {
        if (typeof Lenis === "undefined") return;
        this.lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
        const content = document.querySelector(".content-wrapper");
        let skew = 0;

        this.lenis.on("scroll", ({ velocity }) => {
            ScrollTrigger.update();
            const targetSkew = velocity * 0.15;
            skew += (targetSkew - skew) * 0.1;
            if (content) content.style.transform = `skewY(${skew}deg) translate3d(0,0,0)`;
        });

        gsap.ticker.add((time) => this.lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
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
                e.preventDefault();
                const targetElem = document.querySelector(anchor.getAttribute("href"));
                if (targetElem) {
                    if (this.lenis) {
                        this.lenis.scrollTo(targetElem, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                        targetElem.scrollIntoView({ behavior: "smooth" });
                    }
                }
            });
        });
    }

    static initCustomCursor() {
        if (this.prefersReducedMotion) return;
        const cursor = document.getElementById("cursor");
        if (!cursor) return;
        
        const mouse = { x: -100, y: -100 };
        const pos = { x: -100, y: -100 };
        
        document.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(0.8, gsap.ticker.deltaRatio());
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        });
        
        document.body.addEventListener("mouseover", (e) => {
            if (e.target.closest("a, button, input, textarea, .project-card, .magnetic-wrap")) cursor.classList.add("hovered");
            else cursor.classList.remove("hovered");
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
                                AudioEngine.playGlitch();
                            });
                        }
                    });
                },
                start: "top 90%",
                once: true,
            });
        }, 100);
    }

    static initTilt(element) {
        if (AnimationEngine.prefersReducedMotion) return;
        const image = element.querySelector("img");
        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const xPct = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(element, { transform: `perspective(1000px) rotateX(${yPct * -10}deg) rotateY(${xPct * 10}deg) scale(1.02)`, duration: 0.1 });
            if (image) gsap.to(image, { x: xPct * -20, y: yPct * -20, scale: 1.1, duration: 0.1 });
        });
        element.addEventListener("mouseleave", () => {
            gsap.to(element, { transform: `perspective(1000px) rotateX(0) rotateY(0) scale(1)`, duration: 0.6, ease: "elastic.out(1, 0.6)" });
            if (image) gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
        });
    }

    static simulateLoading() {
        const bar = document.getElementById("loader-bar");
        const logs = document.getElementById("boot-logs");
        const preloader = document.getElementById("preloader");
        const flash = document.getElementById("tv-flash");
        
        if (!preloader) return;
        document.body.classList.add("loading");

        const bootText = ["INITIALIZING CORE...", "MOUNTING DOM...", "Loading SHADERS...", "SYSTEM READY."];
        let width = 0, logIndex = 0;

        const interval = setInterval(() => {
            width += Math.random() * 5;
            if (width > 100) width = 100;
            if (bar) bar.style.width = width + "%";

            if (logs && width > (logIndex + 1) * 25 && logIndex < bootText.length) {
                logs.innerHTML += `<div><span class="text-accent">>></span> ${bootText[logIndex]}</div>`;
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
                            AudioEngine.playGlitch();
                        });
                    }
                }, 400);
            }
        }, 20);
    }
}

// ==========================================
// UI MANAGER
// ==========================================
class UIManager {
    static init() {
        this.initAudioInteractions();
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
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn" onclick="AdminController.openEditModal('project', ${p.id})">EDIT</button>
                    <button class="admin-action-btn del-btn" onclick="AdminController.deleteItem('project', ${p.id})">DEL</button>
                </div>
                <div class="mb-6 border-b border-gray-500/20 pb-6">
                     <h3 class="text-3xl font-bold mb-2">${Utils.escapeHTML(p.title)}</h3>
                </div>
                <p class="text-sm text-secondary mb-8 leading-relaxed flex-grow">${Utils.escapeHTML(p.description)}</p>
                <div class="flex justify-between text-xs font-mono tracking-widest mt-auto">
                    <a href="${Utils.escapeHTML(p.project_url)}" target="_blank" class="hover:text-accent">[ VIEW PROJECT ]</a>
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
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 transition-colors cursor-default relative overflow-hidden">
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn text-[0.5rem] px-1.5 py-0.5 h-auto min-h-0" onclick="AdminController.openEditModal('skill', ${s.id})">EDIT</button>
                    <button class="admin-action-btn del-btn text-[0.5rem] px-1.5 py-0.5 h-auto min-h-0" onclick="AdminController.deleteItem('skill', ${s.id})">DEL</button>
                </div>
                ${Utils.escapeHTML(s.name)}
            </div>
        `).join("");
        AnimationEngine.animateItems(".skill-tag");
    }

    static renderExperience(data) {
        const container = document.getElementById("experience-list");
        if (!container) return;
        container.innerHTML = data.map(exp => `
            <div class="info-card p-6 opacity-0 translate-y-8 border-l-2 border-transparent transition-all relative">
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn" onclick="AdminController.openEditModal('experience', ${exp.id})">EDIT</button>
                    <button class="admin-action-btn del-btn" onclick="AdminController.deleteItem('experience', ${exp.id})">DEL</button>
                </div>
                <h4 class="font-bold text-lg">${Utils.escapeHTML(exp.position)}</h4>
                <p class="text-sm font-mono mb-4 text-secondary">${Utils.escapeHTML(exp.company)}</p>
                <p class="text-sm text-secondary/80 leading-relaxed">${Utils.escapeHTML(exp.description)}</p>
            </div>
        `).join("");
        AnimationEngine.animateItems("#experience-list > div");
    }

    static renderSimpleCard(type, data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = data.map(item => `
            <div class="info-card p-6 opacity-0 translate-y-8 relative">
                <div class="admin-controls">
                    <button class="admin-action-btn edit-btn" onclick="AdminController.openEditModal('${type}', ${item.id})">EDIT</button>
                    <button class="admin-action-btn del-btn" onclick="AdminController.deleteItem('${type}', ${item.id})">DEL</button>
                </div>
                <h4 class="font-bold text-lg mb-1">${Utils.escapeHTML(item.degree || item.title || item.name)}</h4>
                <p class="text-sm font-mono text-accent">${Utils.escapeHTML(item.institution || item.issuing_organization || '')}</p>
                ${item.description ? `<p class="text-sm text-secondary/80 mt-2">${Utils.escapeHTML(item.description)}</p>` : ''}
            </div>
        `).join("");
        AnimationEngine.animateItems(`#${containerId} > div`);
    }

    static setupContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;
        const btn = form.querySelector("button");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const originalText = btn.innerText;
            btn.classList.add("loading");
            btn.innerText = "TRANSMITTING...";
            AudioEngine.playClick();

            const formData = Object.fromEntries(new FormData(form));
            try {
                await ApiService.post('contacts_api.php', formData);
                
                // Formspree Integration
                const formspreeId = "xreezznd";
                if (formspreeId !== "YOUR_FORMSPREE_ID") {
                    await fetch(`https://formspree.io/f/${formspreeId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).catch(()=>console.warn('Formspree failed'));
                }

                btn.classList.remove("loading");
                btn.classList.add("success");
                btn.innerText = "TRANSMISSION RECEIVED";
                form.reset();
                setTimeout(() => { btn.classList.remove("success"); btn.innerText = originalText; }, 3000);
            } catch (e) {
                btn.classList.remove("loading");
                btn.innerText = "ERROR - RETRY";
                btn.style.borderColor = "red";
                this.showToast("Failed to send message.", "error");
            }
        });
    }

    static initAudioInteractions() {
        const startAudio = () => {
            if (!AudioEngine.ctx) AudioEngine.init();
            if (AudioEngine.ctx.state === "suspended") AudioEngine.ctx.resume();
            document.removeEventListener("click", startAudio);
        };
        document.addEventListener("click", startAudio);
        document.body.addEventListener("mouseenter", (e) => {
            if (e.target.closest("a, button, .project-card, .magnetic-wrap")) AudioEngine.playHover();
        }, true);
        document.body.addEventListener("click", (e) => {
            if (e.target.closest("a, button, .theme-toggle")) AudioEngine.playClick();
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
        console.log("%c SECURE ADMIN SYSTEM ONLINE ", "background: #0f172a; color: #22d3ee; padding: 10px; border: 1px solid #22d3ee;");
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
                    AudioEngine.playGlitch();
                    current = 0;
                }
            } else current = 0;
        });
    }

    static initScrollSpy() {
        ["projects", "skills", "info", "contact"].forEach(id => {
            ScrollTrigger.create({
                trigger: `#${id}`, start: "top center", end: "bottom center",
                onToggle: (self) => {
                    if (self.isActive) {
                        document.querySelectorAll(".nav-item").forEach(l => l.classList.remove("active-link"));
                        const link = document.querySelector(`a[href="#${id}"]`);
                        if (link) link.classList.add("active-link");
                    }
                }
            });
        });
    }

    static initFooterSystem() {
        const footerYear = document.getElementById("footer-year");
        if (footerYear) footerYear.textContent = new Date().getFullYear();
    }
}

// ==========================================
// ADMIN CONTROLLER
// ==========================================
class AdminController {
    static init() {
        const btn = document.getElementById("admin-btn");
        if (btn) btn.addEventListener("click", () => this.toggleAdminMode(btn));

        const form = document.getElementById("edit-form");
        if (form) form.addEventListener("submit", (e) => this.handleEditSubmit(e));
        
        // Expose openAddModal globally for HTML inline onclick
        window.openAddModal = (type) => this.openAddModal(type);
        
        this.setupDeleteModal();
    }

    static toggleAdminMode(btn) {
        document.body.classList.toggle("admin-mode");
        btn.classList.toggle("active");
        AudioEngine.playClick();

        if (document.body.classList.contains("admin-mode")) {
            if (!ApiService.getApiKey()) {
                const key = prompt("Admin Mode Activated.\nTo edit/delete items, please enter your API_KEY from the .env file:");
                if (key) {
                    sessionStorage.setItem('PORTFOLIO_API_KEY', key.trim());
                    UIManager.showToast("API Key registered for session.", "success");
                } else {
                    document.body.classList.remove("admin-mode");
                    btn.classList.remove("active");
                    UIManager.showToast("Admin Mode cancelled (No key provided).", "error");
                }
            } else {
                UIManager.showToast("Admin Mode Active (Key present in session).", "success");
            }
        }
    }

    static getEndpoints() {
        return {
            'project': 'projects_api.php',
            'skill': 'skills_api.php',
            'experience': 'experience_api.php',
            'education': 'education_api.php',
            'certification': 'certifications_api.php',
            'achievement': 'achievements_api.php',
            'hobby': 'hobbies_api.php'
        };
    }

    static openEditModal(type, id) {
        const modal = document.getElementById("edit-modal");
        let item = null;
        
        if (type === "project") item = App.state.projects.find(i => i.id == id);
        else if (type === "skill") item = App.state.skills.find(i => i.id == id);
        else item = App.state.generic[`${type}s-list`]?.find(i => i.id == id);

        if (!item) return;

        document.getElementById("edit-id").value = id;
        document.getElementById("edit-type").value = type;
        document.getElementById("edit-title").value = item.title || item.name || item.position || item.degree || "";
        document.getElementById("edit-subtitle").value = item.project_url || item.status || item.company || item.institution || item.issuing_organization || "";
        document.getElementById("edit-desc").value = item.description || "";
        
        this.toggleModalFields(type);
        modal.classList.add("active");
    }

    static openAddModal(type) {
        const modal = document.getElementById("edit-modal");
        document.getElementById("edit-form").reset();
        document.getElementById("edit-id").value = ""; 
        document.getElementById("edit-type").value = type;
        
        this.toggleModalFields(type);
        modal.classList.add("active");
    }

    static toggleModalFields(type) {
        const groupSubtitle = document.getElementById("group-subtitle");
        const groupDesc = document.getElementById("group-desc");
        const labelSubtitle = document.getElementById("label-subtitle");
        
        groupSubtitle.style.display = "block";
        groupDesc.style.display = "block";
        if (labelSubtitle) labelSubtitle.innerText = type === "project" ? "Project URL" : "Subtitle / Role";

        if (type === "skill") {
            groupDesc.style.display = "none";
            groupSubtitle.style.display = "none";
        } else if (["education", "certification", "achievement"].includes(type)) {
            groupDesc.style.display = "none";
        } else if (type === "hobby") {
            groupSubtitle.style.display = "none";
        }
    }

    static closeEditModal() {
        document.getElementById("edit-modal").classList.remove("active");
    }

    static async handleEditSubmit(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const { type, id, title, subtitle, description } = formData;
        const endpoints = this.getEndpoints();
        const endpoint = endpoints[type];

        if (!endpoint) return UIManager.showToast("Save not implemented for this type.", "error");

        const payload = { action: id ? "update" : "add", id, title, description, name: title, position: title, degree: title, company: subtitle, institution: subtitle, issuing_organization: subtitle, project_url: subtitle };

        try {
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = `SAVING <span class="animate-pulse">...</span>`;
            btn.classList.add("loading");
            btn.disabled = true;

            await ApiService.post(endpoint, payload);
            
            UIManager.showToast("CHANGES SAVED", "success");
            this.closeEditModal();
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            UIManager.showToast("ERROR: " + (err.message || "Unauthorized or Server Error"), "error");
            if (err.status === 401) {
                // Clear invalid key
                sessionStorage.removeItem('PORTFOLIO_API_KEY');
                UIManager.showToast("API Key invalid or expired. Turn Admin Mode off and on again.", "error");
            }
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerHTML = "RETRY SAVE";
            btn.classList.remove("loading");
            btn.disabled = false;
        }
    }

    static setupDeleteModal() {
        const cancelBtn = document.getElementById("cancel-delete");
        const confirmBtn = document.getElementById("confirm-delete");
        const backdrop = document.getElementById("delete-backdrop");

        if (cancelBtn) cancelBtn.addEventListener("click", () => this.closeDeleteModal());
        if (backdrop) backdrop.addEventListener("click", () => this.closeDeleteModal());
        if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
                if (this.deleteConfirmCallback) this.deleteConfirmCallback();
                this.closeDeleteModal();
            });
        }
    }

    static deleteItem(type, id) {
        const modal = document.getElementById("delete-modal");
        const messageEl = document.getElementById("delete-message");
        if (messageEl) {
            messageEl.innerHTML = `Are you sure you want to delete this ${type}? <br><span class="text-[#ef4444] font-bold mt-4 block uppercase tracking-widest text-xs border border-[#ef4444] p-2 inline-block bg-[rgba(239,68,68,0.1)]">⚠ This action cannot be undone.</span>`;
        }
        this.deleteConfirmCallback = () => this.performDelete(type, id);
        modal.classList.add("active");
    }

    static closeDeleteModal() {
        document.getElementById("delete-modal").classList.remove("active");
        this.deleteConfirmCallback = null;
    }

    static async performDelete(type, id) {
        const endpoint = this.getEndpoints()[type];
        if (!endpoint) return;

        try {
            await ApiService.post(endpoint, { action: "delete", id });
            UIManager.showToast(`${type.toUpperCase()} DELETED SUCCESSFULLY`, "success");
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            UIManager.showToast("DELETE FAILED: " + (err.message || "Unauthorized"), "error");
        }
    }
}

// ==========================================
// APP INITIALIZATION
// ==========================================
class App {
    static state = {
        projects: [],
        skills: [],
        generic: {}
    };

    static init() {
        AnimationEngine.init();
        UIManager.init();
        AdminController.init();
        this.loadAllData();
        
        // Expose global for inline HTML toggleMute calls
        window.toggleMute = () => AudioEngine.toggleMute();
    }

    static async loadAllData() {
        try {
            const profile = await ApiService.get('profile_api.php');
            document.getElementById("professional-title").innerText = profile.professional_title;
            document.getElementById("bio-text").innerText = profile.bio;
            document.getElementById("contact-info").innerHTML = `
                <div class="flex justify-between border-b border-gray-500/30 pb-2"><span>EMAIL</span> <span>${Utils.escapeHTML(profile.email)}</span></div>
                <div class="flex justify-between border-b border-gray-500/30 pb-2 pt-2"><span>PHONE</span> <span>${Utils.escapeHTML(profile.phone)}</span></div>
                <div class="pt-4"><a href="${Utils.escapeHTML(profile.facebook_url)}" target="_blank" class="text-accent hover:underline">FACEBOOK LINK_</a></div>
            `;
        } catch (e) { console.error("Error loading profile"); }

        try {
            this.state.projects = await ApiService.get('projects_api.php');
            UIManager.renderProjects(this.state.projects);
        } catch (e) {}

        try {
            this.state.skills = await ApiService.get('skills_api.php');
            UIManager.renderSkills(this.state.skills);
        } catch (e) {}

        this.loadGeneric('experience_api.php?duration=true', 'experiences-list', UIManager.renderExperience);
        this.loadGeneric('education_api.php', 'educations-list', (d) => UIManager.renderSimpleCard('education', d, 'education-list'));
        this.loadGeneric('certifications_api.php', 'certifications-list', (d) => UIManager.renderSimpleCard('certification', d, 'certifications-list'));
        this.loadGeneric('achievements_api.php', 'achievements-list', (d) => UIManager.renderSimpleCard('achievement', d, 'achievements-list'));
        this.loadGeneric('hobbies_api.php', 'hobbies-list', (d) => UIManager.renderSimpleCard('hobby', d, 'hobbies-list'));
    }

    static async loadGeneric(endpoint, stateKey, renderFn) {
        try {
            const data = await ApiService.get(endpoint);
            this.state.generic[stateKey] = data;
            renderFn(data);
        } catch (e) {
            console.error(`Error loading generic data: ${endpoint}`);
        }
    }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => App.init());
