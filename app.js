/**
 * Eid Wishes PWA — App Logic
 * Starfield, Particles, Navigation, Countdown, Image Share
 */
const $ = id => document.getElementById(id);

// ══════════════════════════════════════
// STARFIELD BACKGROUND
// ══════════════════════════════════════
function initStarfield() {
    const canvas = $('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 200;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.2,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.015 + 0.003,
                phase: Math.random() * Math.PI * 2,
                isGold: Math.random() < 0.3,
            });
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Royal Dark Green Gradient
        const grad = ctx.createRadialGradient(
            canvas.width * 0.5, canvas.height * 0.3, 0,
            canvas.width * 0.5, canvas.height * 0.3, canvas.height
        );
        grad.addColorStop(0, '#0b2c1c');
        grad.addColorStop(0.5, '#071d12');
        grad.addColorStop(1, '#030a06');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const s of stars) {
            const twinkle = Math.sin(time * s.speed + s.phase) * 0.35 + 0.65;
            // Star colors for dark theme
            const color = s.isGold
                ? `rgba(212, 165, 55, ${s.alpha * twinkle})`
                : `rgba(255, 255, 248, ${s.alpha * twinkle})`;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            if (s.radius > 1.4) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = s.isGold
                    ? `rgba(212, 165, 55, ${0.06 * twinkle})`
                    : `rgba(220, 220, 255, ${0.04 * twinkle})`;
                ctx.fill();
            }
        }
        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); createStars(); });
}

// ══════════════════════════════════════
// FLOATING PARTICLES
// ══════════════════════════════════════
function initParticles() {
    const container = $('particles');
    const PARTICLE_COUNT = 20;
    const emojis = ['✨', '⭐', '🌟', '💫', '🌙', '✧', '۞'];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (Math.random() * 12 + 8) + 'px';
        p.style.animationDuration = (Math.random() * 14 + 10) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        container.appendChild(p);
    }
}

// ══════════════════════════════════════
// PAGE NAVIGATION
// ══════════════════════════════════════
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.dataset.page;
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pages.forEach(p => p.classList.remove('active'));
            const target = $(`page-${targetPage}`);
            if (target) target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ══════════════════════════════════════
// EID COUNTDOWN
// ══════════════════════════════════════
function initCountdown() {
    const eidDate = new Date('2026-03-21T06:00:00+05:30');
    const container = $('countdown-container');
    function update() {
        const now = new Date();
        let diff = eidDate - now;
        if (diff <= 0) {
            if (container) {
                container.innerHTML = `
                    <p class="countdown-label" style="font-size: 1.1rem; color: var(--gold-dark); letter-spacing: 2px;">
                        🎉 Eid Mubarak! The celebration has begun! 🎉
                    </p>`;
            }
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const cdH = $('cd-hours');
        const cdM = $('cd-minutes');
        const cdS = $('cd-seconds');
        if (cdH) cdH.textContent = String(hours).padStart(2, '0');
        if (cdM) cdM.textContent = String(minutes).padStart(2, '0');
        if (cdS) cdS.textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ══════════════════════════════════════════════════════════
// CANVAS-BASED IMAGE GENERATOR
// Perfectly matches the Glossy Glassmorphism UI!
// ══════════════════════════════════════════════════════════
function generateShareImage(type) {
    const W = 1080, H = 1350; // Instagram Portrait Aspect Ratio (4:5)
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. Royal Dark Green Background
    const bgGrad = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, H);
    bgGrad.addColorStop(0, '#0b2c1c'); // Emerald Dark
    bgGrad.addColorStop(0.5, '#071d12'); 
    bgGrad.addColorStop(1, '#030a06');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Add Background Glowing Stars
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const r = Math.random() * 2 + 0.5;
        const alpha = Math.random() * 0.7 + 0.1;
        const isGold = Math.random() < 0.4;
        
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isGold ? `rgba(212, 165, 55, ${alpha})` : `rgba(255, 255, 248, ${alpha})`;
        ctx.fill();

        if (r > 1.8) {
            ctx.beginPath();
            ctx.arc(x, y, r * 4, 0, Math.PI * 2);
            ctx.fillStyle = isGold ? `rgba(212, 165, 55, ${alpha*0.15})` : `rgba(255,255,255, ${alpha*0.1})`;
            ctx.fill();
        }
    }

    // 3. Draw The Glossy Glassmorphism Card
    const cardX = 60, cardW = W - 120;
    const cardY = 120, cardH = H - 240;
    const cardR = 30;

    function drawRoundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 20;
    drawRoundedRect(cardX, cardY, cardW, cardH, cardR);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'; // glass-bg-strong
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Border (gold glassy)
    ctx.strokeStyle = 'rgba(212, 165, 55, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Subtle inner glowing border
    drawRoundedRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4, cardR - 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Gold line at top of card
    const topGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    topGrad.addColorStop(0, 'transparent');
    topGrad.addColorStop(0.5, 'rgba(212, 165, 55, 0.9)');
    topGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = topGrad;
    ctx.fillRect(cardX + 40, cardY, cardW - 80, 4);

    // 4. Content Writers
    const cx = W / 2;
    let currY = cardY + 140;

    function writeCenter(text, y, font, color, maxW = cardW - 80) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const words = text.split(' ');
        let line = '';
        const lines = [];
        for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxW && line) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());
        
        // Safely extract the font size (e.g. from 'bold 64px Outfit')
        const match = font.match(/\d+/);
        const fontSize = match ? parseInt(match[0]) : 30;
        const lineH = fontSize * 1.5;

        for (const l of lines) {
            ctx.fillText(l, cx, y);
            y += lineH;
        }
        return y;
    }

    function addDivider(y) {
        const dGrad = ctx.createLinearGradient(cx - 150, y, cx + 150, y);
        dGrad.addColorStop(0, 'transparent');
        dGrad.addColorStop(0.5, 'rgba(212, 165, 55, 0.6)');
        dGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = dGrad;
        ctx.fillRect(cx - 150, y, 300, 2);
        
        ctx.font = '20px serif';
        ctx.fillStyle = 'rgba(212, 165, 55, 0.8)';
        ctx.fillText('◆', cx, y - 8);
        return y + 60;
    }

    // 5. Build Layouts
    if (type === 'chand-raat') {
        currY = writeCenter('🌙', currY - 60, '80px serif', '#fff') + 20;
        currY = writeCenter('Chand Raat Duas', currY, 'bold 64px Outfit, sans-serif', '#f5d782') + 40;
        
        const dua = "اللّٰهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ";
        currY = writeCenter(dua, currY, 'bold 58px Amiri, serif', '#f5d782') + 20;
        
        const trans = "\"O Allah, bring this moon upon us with security, faith, safety, and Islam.\"";
        currY = writeCenter(trans, currY, 'italic 28px Outfit, sans-serif', 'rgba(255, 255, 255, 0.7)');
        currY += 30;
        currY = addDivider(currY);

        const msg = "May Allah accept all our fasts, prayers, and good deeds from this Ramadan. May He forgive our shortcomings and grant us the strength to continue on the path of righteousness.";
        currY = writeCenter(msg, currY, '34px Outfit, sans-serif', 'rgba(255, 255, 255, 0.95)', cardW - 140) + 40;
        
        writeCenter("✨ Wishing you a beautiful Chand Raat! ✨", currY, '600 36px Outfit, sans-serif', '#eec15c');

    } else if (type === 'eid') {
        currY = writeCenter('🕌', currY - 60, '80px serif', '#fff') + 20;
        currY = writeCenter('Eid ul-Fitr Mubarak', currY, 'bold 64px Outfit, sans-serif', '#f5d782') + 40;
        
        const dua = "تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ";
        currY = writeCenter(dua, currY, 'bold 64px Amiri, serif', '#f5d782') + 20;
        
        const trans = "\"May Allah accept from us and from you.\"";
        currY = writeCenter(trans, currY, 'italic 28px Outfit, sans-serif', 'rgba(255, 255, 255, 0.7)');
        currY += 30;
        currY = addDivider(currY);

        const msg = "On this blessed day of Eid ul-Fitr, I send you my warmest wishes and heartfelt prayers. May this Eid bring immense joy, lasting peace, and abundant blessings to you and your family.";
        currY = writeCenter(msg, currY, '34px Outfit, sans-serif', 'rgba(255, 255, 255, 0.95)', cardW - 140) + 40;
        
        writeCenter("🎉 Have a blessed and joyful Eid! 🎉", currY, '600 36px Outfit, sans-serif', '#eec15c');

    } else if (type === 'invitation') {
        currY = writeCenter('🎊', currY - 60, '80px serif', '#fff') + 20;
        currY = writeCenter("You're Invited!", currY, 'bold 64px Outfit, sans-serif', '#2ecc71') + 10;
        currY = writeCenter('Eid ul-Fitr Celebration', currY, '40px Outfit, sans-serif', 'rgba(46, 204, 113, 0.8)') + 60;

        const details = [
            ['📅', 'Saturday, March 21, 2026'],
            ['🕐', 'After Eid Salah'],
            ['📍', "Our Home — You're always welcome!"],
            ['🍽️', 'Eid Feast & Celebration']
        ];

        for (const [icon, text] of details) {
            const rX = cardX + 80, rY = currY - 15, rW = cardW - 160, rH = 75;
            
            // Draw list row background
            drawRoundedRect(rX, rY, rW, rH, 16);
            ctx.fillStyle = 'rgba(46, 204, 113, 0.08)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(46, 204, 113, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Text
            ctx.font = '36px serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.fillText(icon, rX + 30, currY + 6);

            ctx.font = '500 32px Outfit, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillText(text, rX + 90, currY + 6);

            currY += 95;
        }

        currY = addDivider(currY + 10);
        writeCenter("Your presence would make our Eid complete! 💖", currY, '34px Outfit, sans-serif', 'rgba(255, 255, 255, 0.95)');
    }

    // 6. Watermark at bottom
    ctx.font = '24px Outfit, sans-serif';
    ctx.fillStyle = 'rgba(212, 165, 55, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('eid-wishes.pwa', W / 2, H - 60);

    return canvas;
}

// ══════════════════════════════════════
// SHARE FUNCTIONALITY
// ══════════════════════════════════════
function initShare() {
    const chandRaatText = `🌙 Chand Raat Mubarak! 🌙\n\nMay this blessed night fill your heart with peace and your life with countless blessings.\n\n✨ Wishing you a beautiful Chand Raat! ✨`;
    const eidText = `🕌 Eid ul-Fitr Mubarak! 🕌\n\nتَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ\n"May Allah accept from us and from you."\n\n🎉 Wishing you and your family a blessed Eid! 🎉`;
    const invitationText = `💌 Eid Invitation 💌\n\nYou're warmly invited to celebrate Eid ul-Fitr with us!\n\n📅 Saturday, March 21, 2026\n🕐 After Eid Salah\n📍 Our Home — You're always welcome!\n🍽️ Eid Feast & Celebration\n\nYour presence would make our Eid complete! 💖`;

    async function shareCard(e, type, text, filename) {
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span> Preparing...';
        btn.disabled = true;

        try {
            // NATIVE Canvas perfectly styled to look exactly like the HTML cards!
            const canvas = generateShareImage(type);

            // Fallback to Data URL if toBlob fails
            let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            
            let shareSuccess = false;

            // 1. Try Rich Web Share API
            try { 
                if (!blob) throw new Error("Image generating failed");
                const file = new File([blob], filename, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Eid Mubarak 2026',
                        text: text + '\n\n🔗 ',
                        url: window.location.href,
                        files: [file]
                    });
                    shareSuccess = true;
                }
            } catch(e) { console.warn('File share skipped/failed', e); }

            // 2. Try Text-only Web Share API
            if (!shareSuccess) {
                try {
                    if (navigator.share) {
                        await navigator.share({ title: 'Eid Mubarak 2026', text: text, url: window.location.href });
                        if (blob) downloadBlob(blob, filename); // Deliver the image anyways
                        shareSuccess = true;
                    }
                } catch(e) { console.warn('Text share skipped/failed', e); }
            }

            // 3. Absolute Fallback (Clipboard + Download)
            if (!shareSuccess) {
                if (blob) downloadBlob(blob, filename);
                try {
                    await navigator.clipboard.writeText(text + '\n\n🔗 ' + window.location.href);
                    showToast('Image downloaded & text copied! 📋');
                } catch (e) {
                    showToast('Image downloaded! 📥');
                }
            }
        } catch (err) {
            console.error('Critical Share Error:', err);
            const errMsg = err.message ? err.message.substring(0, 30) : 'Unknown';
            showToast('Err: ' + errMsg);
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }

    function downloadBlob(blob, filename) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append is strictly required in some environments
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            if (a.parentNode) a.parentNode.removeChild(a);
        }, 1000);
    }

    const sc = $('share-chand-raat-img');
    if (sc) sc.addEventListener('click', e => shareCard(e, 'chand-raat', chandRaatText, 'chand-raat-mubarak.png'));

    const se = $('share-eid-img');
    if (se) se.addEventListener('click', e => shareCard(e, 'eid', eidText, 'eid-mubarak-2026.png'));

    const si = $('share-invitation-img');
    if (si) si.addEventListener('click', e => shareCard(e, 'invitation', invitationText, 'eid-invitation-2026.png'));
}

// ══════════════════════════════════════
// DYNAMIC HOMEPAGE DATE SWITCHING
// ══════════════════════════════════════
function initDynamicRouting() {
    const today = new Date();
    // Assuming Eid starts on March 21, 2026 (local time)
    const eidStart = new Date('2026-03-21T00:00:00');
    const isEid = today >= eidStart;
    
    // Clear all actives
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    if (isEid) {
        document.querySelector('.nav-btn[data-page="eid"]').classList.add('active');
        document.getElementById('page-eid').classList.add('active');
    } else {
        document.querySelector('.nav-btn[data-page="chand-raat"]').classList.add('active');
        document.getElementById('page-chand-raat').classList.add('active');
    }

    // Toggle conditional greet cards
    document.querySelectorAll('.conditional-eid-card').forEach(el => {
        el.style.display = isEid ? '' : 'none';
    });
}

// ══════════════════════════════════════
// HOVER & TOUCH STARS EFFECT
// ══════════════════════════════════════
function initHoverStars() {
    let lastTime = 0;
    const container = document.createElement('div');
    container.id = 'hover-stars-container';
    container.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden;';
    document.body.appendChild(container);

    function spawnStar(x, y, force = false) {
        const now = Date.now();
        if (!force && now - lastTime < 40) return;
        lastTime = now;

        const star = document.createElement('div');
        star.className = 'hover-star';
        const types = ['✨', '⭐', '✧'];
        star.textContent = types[Math.floor(Math.random() * types.length)];
        
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--tx', (Math.random() - 0.5) * 80 + 'px');
        star.style.setProperty('--ty', (Math.random() - 0.5) * 80 - 20 + 'px');
        star.style.setProperty('--rot', (Math.random() - 0.5) * 180 + 'deg');

        container.appendChild(star);
        setTimeout(() => { if (star.parentNode) star.remove(); }, 1200);
    }

    // Mouse Tracking
    document.addEventListener('mousemove', e => spawnStar(e.clientX, e.clientY));

    // Mobile Touch Dragging
    document.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            spawnStar(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // Click/Tap Star Burst
    document.addEventListener('click', e => {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => spawnStar(e.clientX, e.clientY, true), i * 20);
        }
    });
}

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
function showToast(msg) {
    const toast = $('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// ══════════════════════════════════════
// PWA
// ══════════════════════════════════════
function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.warn('SW registration failed:', err);
        });
    }
}

// ══════════════════════════════════════
// BOOT
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initDynamicRouting();
    initStarfield();
    initParticles();
    initHoverStars();
    initNavigation();
    initCountdown();
    initShare();
    initPWA();
});
