/* ==========================================================
   FNAF Web Night Shift — Game Logic (FNAF 1 Authentic)
   ========================================================== */

/* ----------------------------------------------------------
   ANTI-CHEAT
   ---------------------------------------------------------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
        e.preventDefault();
    }
});

/* ----------------------------------------------------------
   NIGHT SYSTEM
   ---------------------------------------------------------- */
let savedNight = parseInt(localStorage.getItem('fnaf_web_night')) || 1;
if (savedNight > 5) savedNight = 5;

document.getElementById('start-night-display').innerText = `Night ${savedNight}`;
document.getElementById('night-display').innerText = `Night ${savedNight}`;

function resetData() {
    if (confirm('Are you sure you want to erase all data (Return to Night 1)?')) {
        localStorage.removeItem('fnaf_web_night');
        location.reload();
    }
}

/* ----------------------------------------------------------
   AUDIO SYSTEM
   ---------------------------------------------------------- */
let audioCtx, droneOsc, freddyMusicInterval, gfHallucinationOsc, masterGainNode;
let globalVolume = 0.5, isMuted = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.setValueAtTime(globalVolume, audioCtx.currentTime);
        masterGainNode.connect(audioCtx.destination);

        droneOsc = audioCtx.createOscillator();
        const droneGain = audioCtx.createGain();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(40, audioCtx.currentTime);
        droneGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        droneOsc.connect(droneGain);
        droneGain.connect(masterGainNode);
        droneOsc.start();
    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

const TOREADOR_NOTES = [349.23, 349.23, 349.23, 293.66, 233.08, 293.66, 261.63, 261.63, 261.63, 220, 261.63, 293.66];

function playFreddyMusicBox() {
    if (!audioCtx) return;
    let noteIdx = 0;
    freddyMusicInterval = setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = TOREADOR_NOTES[noteIdx];
        osc.connect(gain);
        gain.connect(masterGainNode);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
        noteIdx = (noteIdx + 1) % TOREADOR_NOTES.length;
    }, 500);
}

function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGainNode);

    switch (type) {
        case 'click':
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            break;

        case 'door': {
            // FNAF 1: heavy metallic mechanical door slam
            // Low impact thud
            osc.type = 'sine';
            osc.frequency.setValueAtTime(70, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            // Metallic clang resonance
            const clang = audioCtx.createOscillator();
            const clangGain = audioCtx.createGain();
            clang.type = 'square';
            clang.frequency.setValueAtTime(300, audioCtx.currentTime);
            clang.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);
            clang.connect(clangGain);
            clangGain.connect(masterGainNode);
            clangGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            clangGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            clang.start();
            clang.stop(audioCtx.currentTime + 0.12);
            // High metallic rattle
            const rattle = audioCtx.createOscillator();
            const rattleGain = audioCtx.createGain();
            rattle.type = 'sawtooth';
            rattle.frequency.setValueAtTime(800, audioCtx.currentTime);
            rattle.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
            rattle.connect(rattleGain);
            rattleGain.connect(masterGainNode);
            rattleGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            rattleGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            rattle.start();
            rattle.stop(audioCtx.currentTime + 0.15);
            break;
        }

        case 'light': {
            // FNAF 1: fluorescent ballast buzz/hum
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
            // Higher harmonic buzz
            const buzz = audioCtx.createOscillator();
            const buzzGain = audioCtx.createGain();
            buzz.type = 'square';
            buzz.frequency.setValueAtTime(240, audioCtx.currentTime);
            buzz.connect(buzzGain);
            buzzGain.connect(masterGainNode);
            buzzGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            buzzGain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.3);
            buzz.start();
            buzz.stop(audioCtx.currentTime + 0.3);
            // Initial click/pop of the switch
            const pop = audioCtx.createOscillator();
            const popGain = audioCtx.createGain();
            pop.type = 'square';
            pop.frequency.setValueAtTime(1500, audioCtx.currentTime);
            pop.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.02);
            pop.connect(popGain);
            popGain.connect(masterGainNode);
            popGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
            pop.start();
            pop.stop(audioCtx.currentTime + 0.03);
            break;
        }

        case 'jumpscare': {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.5);
            const osc2 = audioCtx.createOscillator();
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc2.connect(gain);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 2);
            gain.gain.setValueAtTime(1, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 2);
            break;
        }

        case 'gf-hallucination': {
            gfHallucinationOsc = audioCtx.createOscillator();
            gfHallucinationOsc.type = 'square';
            gfHallucinationOsc.frequency.setValueAtTime(20, audioCtx.currentTime);
            const gfGain = audioCtx.createGain();
            gfGain.gain.setValueAtTime(2, audioCtx.currentTime);
            gfHallucinationOsc.connect(gfGain);
            gfGain.connect(masterGainNode);
            gfHallucinationOsc.start();
            break;
        }

        case 'gf-crash':
            osc.type = 'square';
            osc.frequency.setValueAtTime(50, audioCtx.currentTime);
            gain.gain.setValueAtTime(2, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 3);
            break;

        case 'static': {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            const noise = audioCtx.createOscillator();
            const noiseGain = audioCtx.createGain();
            noise.type = 'sawtooth';
            noise.frequency.setValueAtTime(3000 + Math.random() * 2000, audioCtx.currentTime);
            noise.connect(noiseGain);
            noiseGain.connect(masterGainNode);
            noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            noise.start();
            noise.stop(audioCtx.currentTime + 0.15);
            break;
        }

        case 'powerout': {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 1);
            gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.5);
            break;
        }
    }
}

/* ----------------------------------------------------------
   VOLUME CONTROLS
   ---------------------------------------------------------- */
const volSlider = document.getElementById('volume-slider');
const volIcon = document.getElementById('volume-icon');

volSlider.addEventListener('input', (e) => {
    globalVolume = parseFloat(e.target.value);
    if (isMuted) toggleMute();
    if (masterGainNode) masterGainNode.gain.setValueAtTime(globalVolume, audioCtx.currentTime);
    updateVolumeIcon();
});

volIcon.addEventListener('click', toggleMute);

function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        volIcon.innerText = '🔇';
        if (masterGainNode) masterGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        volSlider.value = 0;
    } else {
        if (globalVolume === 0) globalVolume = 0.5;
        if (masterGainNode) masterGainNode.gain.setValueAtTime(globalVolume, audioCtx.currentTime);
        volSlider.value = globalVolume;
        updateVolumeIcon();
    }
}

function updateVolumeIcon() {
    if (isMuted || globalVolume === 0) volIcon.innerText = '🔇';
    else if (globalVolume < 0.5) volIcon.innerText = '🔉';
    else volIcon.innerText = '🔊';
}

/* ----------------------------------------------------------
   GAME STATE
   ---------------------------------------------------------- */
const gameState = {
    power: 100,
    timeHour: 12,
    night: savedNight,
    isCamOpen: false,
    doors: { left: false, right: false },
    lights: { left: false, right: false },
    currentCam: '1A',
    isPowerOut: false,
    gameActive: false,
    gfActive: false
};

let timeInSeconds = 0;
const SECONDS_PER_HOUR = 45;
let gameLoop, aiLoop, gfTimeout;

const AI_LIST = [
    {
        name: 'Bonnie',
        icon: '🐰',
        side: 'left',
        position: 6,
        path: ['1A', '1B', '5', '1C', '2A', '2B', 'left_door'],
        level: 2 + savedNight
    },
    {
        name: 'Chica',
        icon: '🐔',
        side: 'right',
        position: 6,
        path: ['1A', '1B', '7', '6', '4A', '4B', 'right_door'],
        level: 1 + savedNight
    }
];

/* ----------------------------------------------------------
   DOM ELEMENT CACHE
   ---------------------------------------------------------- */
const DOM = {
    startScreen: document.getElementById('start-screen'),
    instructionScreen: document.getElementById('instruction-screen'),
    office: document.getElementById('office'),
    cameraSystem: document.getElementById('camera-system'),
    camToggle: document.getElementById('cam-toggle'),
    camLabel: document.getElementById('cam-label'),
    camAiVisual: document.getElementById('cam-ai-visual'),
    camTimestamp: document.getElementById('cam-timestamp'),
    camStaticOverlay: document.getElementById('cam-static-overlay'),
    camStaticCanvas: document.getElementById('cam-static-canvas'),
    staticOverlay: document.getElementById('static-overlay'),
    vignette: document.getElementById('vignette'),
    poweroutOverlay: document.getElementById('powerout-overlay'),
    timeDisplay: document.getElementById('time-display'),
    powerDisplay: document.getElementById('power-display'),
    usageDisplay: document.getElementById('usage-display'),
    goldenFreddy: document.getElementById('golden-freddy-office'),
    windowChar: document.getElementById('window-character'),
    jumpscare: document.getElementById('jumpscare'),
    jumpscareIcon: document.getElementById('jumpscare-icon'),
    jumpscareStatic: document.getElementById('jumpscare-static'),
    jumpscareStaticCanvas: document.getElementById('jumpscare-static-canvas'),
    gfJumpscare: document.getElementById('gf-jumpscare'),
    gameOver: document.getElementById('game-over'),
    winScreen: document.getElementById('win-screen'),
    winSubtext: document.getElementById('win-subtext'),
    noiseCanvas: document.getElementById('cam-noise-canvas')
};

/* ----------------------------------------------------------
   SCREEN MANAGEMENT
   ---------------------------------------------------------- */
function showInstructions() {
    DOM.startScreen.style.display = 'none';
    DOM.instructionScreen.style.display = 'flex';
    initAudio();
}

function startGameplay() {
    DOM.instructionScreen.style.display = 'none';
    gameState.gameActive = true;
    gameLoop = setInterval(gameTimerLoop, 1000);
    aiLoop = setInterval(updateAI, 3000);
    updateCamVisuals();
    startCamTimestamp();
}

/* ----------------------------------------------------------
   OFFICE PANNING (mouse-driven)
   ---------------------------------------------------------- */
let officeX = -30;

document.addEventListener('mousemove', (e) => {
    if (gameState.isCamOpen || !gameState.gameActive || gameState.isPowerOut) return;
    if (e.target.id === 'cam-toggle') return;

    const mouseX = e.clientX;
    const screenW = window.innerWidth;
    const speed = 1.5;

    if (mouseX < screenW * 0.25) officeX += speed;
    else if (mouseX > screenW * 0.75) officeX -= speed;

    officeX = Math.max(-60, Math.min(0, officeX));
    DOM.office.style.transform = `translateX(${officeX}vw)`;
});

/* ----------------------------------------------------------
   POWER MANAGEMENT
   ---------------------------------------------------------- */
function updateUsageDisplay() {
    let usage = 1;
    if (gameState.doors.left) usage++;
    if (gameState.doors.right) usage++;
    if (gameState.lights.left) usage++;
    if (gameState.lights.right) usage++;
    if (gameState.isCamOpen) usage++;

    DOM.usageDisplay.innerText = '🔋'.repeat(usage);
    return usage;
}

/* ----------------------------------------------------------
   DOOR & LIGHT CONTROLS
   ---------------------------------------------------------- */
function toggleDoor(side) {
    if (gameState.isPowerOut || !gameState.gameActive) return;
    playSound('door');
    gameState.doors[side] = !gameState.doors[side];
    document.getElementById(`door-${side}`).classList.toggle('closed');
    document.getElementById(`btn-door-${side}`).classList.toggle('active');
    updateDoorVisuals(side);
    updateUsageDisplay();
}

function toggleLight(side, on) {
    if (gameState.isPowerOut || !gameState.gameActive) return;
    if (on) playSound('light');
    gameState.lights[side] = on;

    const overlay = document.getElementById(`light-${side}-overlay`);
    const btn = document.getElementById(`btn-light-${side}`);

    if (on) {
        overlay.classList.add('active');
        btn.classList.add('active');
    } else {
        overlay.classList.remove('active');
        btn.classList.remove('active');
    }

    if (side === 'right') updateWindowCharacter();
    updateUsageDisplay();
}

/* ----------------------------------------------------------
   DOOR VISUALS & WINDOW CHARACTER
   ---------------------------------------------------------- */
function updateDoorVisuals(side) {
    const ai = AI_LIST.find(a => a.side === side && a.position === 0);
    const doorVisual = document.getElementById(`ai-${side}-visual`);

    if (ai) {
        if (doorVisual.tagName.toLowerCase() !== 'img') doorVisual.innerText = ai.icon;
        doorVisual.classList.add('is-here');
        if (side === 'right') {
            DOM.windowChar.innerText = ai.icon;
            DOM.windowChar.classList.add('is-here');
        }
    } else {
        doorVisual.classList.remove('is-here');
        if (side === 'right') {
            DOM.windowChar.classList.remove('is-here');
        }
    }

    if (side === 'right') updateWindowCharacter();
}

function updateWindowCharacter() {
    const wc = DOM.windowChar;
    if (gameState.lights.right && wc.classList.contains('is-here')) {
        wc.classList.add('visible');
    } else {
        wc.classList.remove('visible');
    }
}

/* ----------------------------------------------------------
   CAMERA NOISE (Canvas-based — FNAF authentic)
   Multi-layer: random pixels + horizontal interference bands
   ---------------------------------------------------------- */
let noiseAnimId = null;
const noiseCtx = DOM.noiseCanvas ? DOM.noiseCanvas.getContext('2d') : null;

function drawCameraNoise() {
    if (!noiseCtx) return;
    const w = DOM.noiseCanvas.width;
    const h = DOM.noiseCanvas.height;
    const imageData = noiseCtx.createImageData(w, h);
    const buf = imageData.data;
    const len = buf.length;

    for (let i = 0; i < len; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 50;
    }

    const bandY = (performance.now() * 0.15) % (h + 60) - 30;
    const bandHeight = 15 + Math.random() * 20;
    for (let y = Math.max(0, bandY | 0); y < Math.min(h, (bandY + bandHeight) | 0); y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            buf[idx] = 255;
            buf[idx + 1] = 255;
            buf[idx + 2] = 255;
            buf[idx + 3] = 40 + (Math.random() * 30) | 0;
        }
    }

    if (Math.random() < 0.03) {
        const glitchY = (Math.random() * h) | 0;
        const glitchH = (2 + Math.random() * 6) | 0;
        for (let y = glitchY; y < Math.min(h, glitchY + glitchH); y++) {
            const shift = ((Math.random() - 0.5) * 20) | 0;
            for (let x = 0; x < w; x++) {
                const srcX = Math.max(0, Math.min(w - 1, x + shift));
                const dstIdx = (y * w + x) * 4;
                const srcIdx = (y * w + srcX) * 4;
                buf[dstIdx] = buf[srcIdx];
                buf[dstIdx + 1] = buf[srcIdx + 1];
                buf[dstIdx + 2] = buf[srcIdx + 2];
                buf[dstIdx + 3] = 80;
            }
        }
    }

    noiseCtx.putImageData(imageData, 0, 0);
    noiseAnimId = requestAnimationFrame(drawCameraNoise);
}

function startCameraNoise() {
    if (!noiseAnimId) drawCameraNoise();
}

function stopCameraNoise() {
    if (noiseAnimId) {
        cancelAnimationFrame(noiseAnimId);
        noiseAnimId = null;
    }
}

/* ----------------------------------------------------------
   CAMERA STATIC BURST (FNAF 1 authentic)
   Full-frame static that fades in then slowly fades out
   ---------------------------------------------------------- */
let staticBurstTimeout = null;
const staticCtx = DOM.camStaticCanvas ? DOM.camStaticCanvas.getContext('2d') : null;

function drawStaticFrame(ctx, canvas) {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const buf = imageData.data;
    for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 80 + (Math.random() * 60) | 0;
    }
    ctx.putImageData(imageData, 0, 0);
}

function triggerStaticBurst() {
    if (staticBurstTimeout) clearTimeout(staticBurstTimeout);

    drawStaticFrame(staticCtx, DOM.camStaticCanvas);
    DOM.camStaticOverlay.classList.remove('fade-out');
    DOM.camStaticOverlay.classList.add('burst');
    playSound('static');

    let frames = 0;
    const maxFrames = 4;
    const animateStatic = () => {
        if (frames < maxFrames) {
            drawStaticFrame(staticCtx, DOM.camStaticCanvas);
            frames++;
            requestAnimationFrame(animateStatic);
        }
    };
    requestAnimationFrame(animateStatic);

    staticBurstTimeout = setTimeout(() => {
        DOM.camStaticOverlay.classList.remove('burst');
        DOM.camStaticOverlay.classList.add('fade-out');
        staticBurstTimeout = setTimeout(() => {
            DOM.camStaticOverlay.classList.remove('fade-out');
        }, 400);
    }, 150);
}

/* ----------------------------------------------------------
   CAMERA TIMESTAMP
   ---------------------------------------------------------- */
let camTimestampInterval = null;

function startCamTimestamp() {
    if (camTimestampInterval) return;
    camTimestampInterval = setInterval(() => {
        if (!DOM.camTimestamp) return;
        const now = new Date();
        const h = now.getHours() % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        DOM.camTimestamp.innerText = `${h}:${m}:${s} AM`;
    }, 1000);
}

/* ----------------------------------------------------------
   CAMERA SYSTEM
   ---------------------------------------------------------- */
function toggleCameras() {
    if (gameState.isPowerOut || !gameState.gameActive) return;
    playSound('click');
    gameState.isCamOpen = !gameState.isCamOpen;

    if (!gameState.isCamOpen) {
        DOM.cameraSystem.classList.remove('monitor-opening');
        DOM.cameraSystem.classList.add('monitor-closing');
        stopCameraNoise();
        setTimeout(() => {
            if (!gameState.isCamOpen) DOM.cameraSystem.style.display = 'none';
        }, 300);
        if (Math.random() < 0.05 && !gameState.gfActive) triggerGoldenFreddy();
    } else {
        DOM.cameraSystem.classList.remove('monitor-closing');
        DOM.cameraSystem.classList.add('monitor-opening');
        triggerStaticBurst();
        startCameraNoise();
        if (gameState.gfActive) cancelGoldenFreddy();
    }

    DOM.camToggle.innerText = gameState.isCamOpen ? 'Close Monitor' : 'Open Monitor';
    updateUsageDisplay();
    updateCamVisuals();
}

function switchCam(cam, name) {
    playSound('click');
    triggerStaticBurst();
    gameState.currentCam = cam;
    DOM.camLabel.innerText = `CAM ${cam} - ${name}`;
    document.querySelectorAll('.cam-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`cam-${cam}`).classList.add('active');
    updateCamVisuals();
}

function updateCamVisuals() {
    if (!gameState.isCamOpen) return;

    if (gameState.currentCam === '6') {
        DOM.camAiVisual.innerText = '[AUDIO ONLY]';
        return;
    }

    const icons = [];
    AI_LIST.forEach(ai => {
        let room = ai.path[ai.path.length - 1 - ai.position];
        if (ai.position === ai.path.length - 1) room = '1A';
        if (room === gameState.currentCam) icons.push(ai.icon);
    });
    DOM.camAiVisual.innerText = icons.join(' ');
}

/* ----------------------------------------------------------
   GOLDEN FREDDY
   ---------------------------------------------------------- */
function triggerGoldenFreddy() {
    gameState.gfActive = true;
    DOM.goldenFreddy.style.display = 'block';
    playSound('gf-hallucination');
    gfTimeout = setTimeout(() => {
        if (gameState.gfActive && !gameState.isCamOpen) executeGoldenFreddyJumpscare();
    }, 2000);
}

function cancelGoldenFreddy() {
    gameState.gfActive = false;
    DOM.goldenFreddy.style.display = 'none';
    clearTimeout(gfTimeout);
    if (gfHallucinationOsc) {
        gfHallucinationOsc.stop();
        gfHallucinationOsc = null;
    }
}

function executeGoldenFreddyJumpscare() {
    gameState.gameActive = false;
    clearInterval(gameLoop);
    clearInterval(aiLoop);
    stopCameraNoise();
    if (gfHallucinationOsc) {
        gfHallucinationOsc.stop();
        gfHallucinationOsc = null;
    }
    playSound('gf-crash');
    DOM.cameraSystem.style.display = 'none';
    DOM.staticOverlay.classList.add('heavy-static');
    DOM.gfJumpscare.style.display = 'flex';
    setTimeout(() => location.reload(), 3000);
}

/* ----------------------------------------------------------
   AI MOVEMENT
   ---------------------------------------------------------- */
function updateAI() {
    if (!gameState.gameActive || gameState.isPowerOut) return;

    let camInterrupted = false;

    AI_LIST.forEach(ai => {
        const roll = Math.floor(Math.random() * 20) + 1;
        if (roll <= ai.level) {
            let prevRoom = ai.path[ai.path.length - 1 - ai.position];
            if (ai.position === ai.path.length - 1) prevRoom = '1A';

            let moved = false;

            if (ai.position > 0) {
                ai.position--;
                moved = true;
            } else if (ai.position === 0) {
                if (gameState.doors[ai.side]) {
                    ai.position = Math.floor(Math.random() * 2) + 1;
                    moved = true;
                } else {
                    triggerJumpscare(ai.icon);
                }
            }

            if (moved && gameState.isCamOpen) {
                const newRoom = ai.path[ai.path.length - 1 - ai.position];
                if (prevRoom === gameState.currentCam || newRoom === gameState.currentCam) {
                    camInterrupted = true;
                }
            }
        }
    });

    if (camInterrupted) triggerStaticBurst();
    updateCamVisuals();
    updateDoorVisuals('left');
    updateDoorVisuals('right');
}

/* ----------------------------------------------------------
   JUMPSCARE (FNAF 1 authentic: static flash → jumpscare → shake)
   ---------------------------------------------------------- */
function drawJumpscareStatic() {
    const canvas = DOM.jumpscareStaticCanvas;
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!ctx) return;
    drawStaticFrame(ctx, canvas);
}

function triggerJumpscare(icon) {
    gameState.gameActive = false;
    clearInterval(gameLoop);
    clearInterval(aiLoop);
    if (freddyMusicInterval) clearInterval(freddyMusicInterval);
    stopCameraNoise();

    DOM.cameraSystem.style.display = 'none';

    drawJumpscareStatic();
    DOM.jumpscareStatic.style.display = 'block';

    setTimeout(() => {
        DOM.jumpscareStatic.style.display = 'none';

        playSound('jumpscare');
        document.body.classList.add('shaking');
        DOM.jumpscareIcon.innerText = icon;
        DOM.jumpscare.style.display = 'none';
        void DOM.jumpscare.offsetWidth;
        DOM.jumpscare.style.display = 'flex';

        setTimeout(() => {
            document.body.classList.remove('shaking');
            DOM.jumpscare.style.display = 'none';
            DOM.gameOver.style.display = 'flex';
        }, 1500);
    }, 100);
}

/* ----------------------------------------------------------
   GAME TIMER
   ---------------------------------------------------------- */
function gameTimerLoop() {
    if (!gameState.gameActive) return;

    timeInSeconds++;
    if (timeInSeconds >= SECONDS_PER_HOUR) {
        timeInSeconds = 0;
        gameState.timeHour++;
        if (gameState.timeHour === 13) gameState.timeHour = 1;
        DOM.timeDisplay.innerText = `${gameState.timeHour}:00 AM`;
        AI_LIST.forEach(ai => ai.level++);

        if (gameState.timeHour === 6) {
            gameState.gameActive = false;
            clearInterval(gameLoop);
            clearInterval(aiLoop);
            stopCameraNoise();

            if (gameState.night < 5) {
                localStorage.setItem('fnaf_web_night', gameState.night + 1);
                DOM.winSubtext.innerText = `YOU SURVIVED NIGHT ${gameState.night}`;
            } else {
                DOM.winSubtext.innerText = 'YOU BEAT NIGHT 5!';
            }
            DOM.winScreen.style.display = 'flex';
            return;
        }
    }

    if (!gameState.isPowerOut) {
        const usage = updateUsageDisplay() * 0.15;
        gameState.power -= usage;

        if (gameState.power <= 0) {
            gameState.power = 0;
            triggerPowerOut();
        }

        const color = gameState.power < 20 ? 'red' : 'white';
        DOM.powerDisplay.innerHTML = `<span style="color:${color}">${Math.floor(gameState.power)}%</span>`;
    }
}

/* ----------------------------------------------------------
   POWER OUT (FNAF 1 authentic sequence)
   1. Everything goes dark instantly
   2. Freddy's face appears left, eyes flicker with music
   3. Music stops, brief silence
   4. Jumpscare
   ---------------------------------------------------------- */
function triggerPowerOut() {
    gameState.isPowerOut = true;
    gameState.isCamOpen = false;
    DOM.cameraSystem.style.display = 'none';
    DOM.camToggle.style.display = 'none';
    stopCameraNoise();

    if (gameState.gfActive) cancelGoldenFreddy();
    playSound('powerout');

    ['left', 'right'].forEach(side => {
        gameState.doors[side] = false;
        document.getElementById(`door-${side}`).classList.remove('closed');
        document.getElementById(`btn-door-${side}`).classList.remove('active');
        toggleLight(side, false);
    });

    DOM.poweroutOverlay.style.display = 'block';

    DOM.office.style.background = '#000';
    DOM.vignette.style.background = 'rgba(0,0,0,0.98)';
    document.querySelector('.wall-texture').style.opacity = '0';
    document.querySelector('.floor').style.opacity = '0';
    document.querySelector('.desk').style.opacity = '0';
    DOM.windowChar.style.display = 'none';

    if (droneOsc) {
        droneOsc.stop();
        droneOsc = null;
    }

    const leftVisual = document.getElementById('ai-left-visual');
    leftVisual.innerText = '🐻';
    leftVisual.className = 'animatronic-door freddy-powerout';

    setTimeout(() => {
        leftVisual.classList.add('eyes-flicker');
        playFreddyMusicBox();

        const waitTime = 5000 + Math.random() * 7000;
        setTimeout(() => {
            clearInterval(freddyMusicInterval);
            leftVisual.classList.remove('eyes-flicker');
            leftVisual.classList.remove('eyes-visible');
            leftVisual.style.filter = 'brightness(0)';

            const silenceTime = 2000 + Math.random() * 3000;
            setTimeout(() => {
                DOM.poweroutOverlay.style.display = 'none';
                triggerJumpscare('🐻');
            }, silenceTime);
        }, waitTime);
    }, 1500);
}
