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
   INTERNATIONALIZATION (i18n)
   ---------------------------------------------------------- */
let currentLang = localStorage.getItem('fnaf_lang') || 'en';

const TRANSLATIONS = {
    en: {
        nightShift: 'NIGHT SHIFT',
        night: 'Night',
        startGame: 'START GAME',
        eraseData: 'ERASE DATA',
        eraseConfirm: 'Are you sure you want to erase all data (Return to Night 1)?',
        howToPlay: 'HOW TO PLAY',
        inst1: 'Survive your shift from <strong>12:00 AM</strong> to <strong>6:00 AM</strong>.',
        inst2: 'Check the <span class="inst-highlight">Camera Monitor</span> to track the movement of the animatronics.',
        inst3: 'Use the <span class="inst-highlight">Door Lights</span> to check the blind spots outside your office.',
        inst4: 'If an animatronic is at your door, press the <span class="inst-highlight">Door Button</span> immediately to close it.',
        inst5: '<strong>Manage your Power!</strong> Using doors, lights, and cameras drains your battery. If you run out of power... you are dead.',
        beginShift: 'BEGIN SHIFT',
        power: 'Power:',
        usage: 'Usage:',
        openMonitor: 'Open Monitor',
        closeMonitor: 'Close Monitor',
        gameOver: 'GAME OVER',
        tryAgain: 'TRY AGAIN',
        youSurvived: 'YOU SURVIVED NIGHT',
        youBeat: 'YOU BEAT NIGHT 5!',
        continue: 'CONTINUE',
        audioOnly: '[AUDIO ONLY]',
        celebrate: '★ CELEBRATE! ★',
        outOfOrder: '⚠ OUT OF ORDER',
        letsParty: "LET'S PARTY!",
        rulesFor: 'RULES FOR<br>SAFETY',
        youAreHere: '📍 YOU',
        camShowStage: 'Show Stage',
        camDiningArea: 'Dining Area',
        camPirateCove: 'Pirate Cove',
        camWestHall: 'West Hall',
        camWHallCorner: 'W. Hall Corner',
        camSupplyCloset: 'Supply Closet',
        camEastHall: 'East Hall',
        camEHallCorner: 'E. Hall Corner',
        camBackstage: 'Backstage',
        camKitchen: 'Kitchen',
        camRestrooms: 'Restrooms',
        timeAM: 'AM',
    },
    vi: {
        nightShift: 'CA ĐÊM',
        night: 'Đêm',
        startGame: 'BẮT ĐẦU',
        eraseData: 'XÓA DỮ LIỆU',
        eraseConfirm: 'Bạn có chắc muốn xóa toàn bộ dữ liệu (Quay về Đêm 1)?',
        howToPlay: 'HƯỚNG DẪN',
        inst1: 'Sống sót qua ca trực từ <strong>12:00 SA</strong> đến <strong>6:00 SA</strong>.',
        inst2: 'Kiểm tra <span class="inst-highlight">Màn hình Camera</span> để theo dõi sự di chuyển của các robot.',
        inst3: 'Sử dụng <span class="inst-highlight">Đèn cửa</span> để kiểm tra điểm mù bên ngoài phòng bạn.',
        inst4: 'Nếu robot ở ngay cửa, nhấn <span class="inst-highlight">Nút đóng cửa</span> ngay lập tức.',
        inst5: '<strong>Quản lý Năng lượng!</strong> Sử dụng cửa, đèn và camera sẽ hao pin. Nếu hết pin... bạn sẽ chết.',
        beginShift: 'VÀO CA',
        power: 'Pin:',
        usage: 'Tiêu thụ:',
        openMonitor: 'Mở Camera',
        closeMonitor: 'Đóng Camera',
        gameOver: 'BẠN ĐÃ CHẾT',
        tryAgain: 'THỬ LẠI',
        youSurvived: 'BẠN ĐÃ SỐNG SÓT QUA ĐÊM',
        youBeat: 'BẠN ĐÃ VƯỢT QUA ĐÊM 5!',
        continue: 'TIẾP TỤC',
        audioOnly: '[CHỈ ÂM THANH]',
        celebrate: '★ CHÚC MỪNG! ★',
        outOfOrder: '⚠ NGỪNG HOẠT ĐỘNG',
        letsParty: 'TIỆC THÔI!',
        rulesFor: 'QUY TẮC<br>AN TOÀN',
        youAreHere: '📍 BẠN',
        camShowStage: 'Sân Khấu',
        camDiningArea: 'Phòng Ăn',
        camPirateCove: 'Hang Cướp Biển',
        camWestHall: 'Hành Lang Tây',
        camWHallCorner: 'Góc HL Tây',
        camSupplyCloset: 'Kho Đồ',
        camEastHall: 'Hành Lang Đông',
        camEHallCorner: 'Góc HL Đông',
        camBackstage: 'Hậu Trường',
        camKitchen: 'Nhà Bếp',
        camRestrooms: 'Nhà Vệ Sinh',
        timeAM: 'SA',
    }
};

const CAM_NAME_KEYS = {
    '1A': 'camShowStage',
    '1B': 'camDiningArea',
    '1C': 'camPirateCove',
    '2A': 'camWestHall',
    '2B': 'camWHallCorner',
    '3': 'camSupplyCloset',
    '4A': 'camEastHall',
    '4B': 'camEHallCorner',
    '5': 'camBackstage',
    '6': 'camKitchen',
    '7': 'camRestrooms',
};

function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS.en[key] || key;
}

function getCamName(camId) {
    const key = CAM_NAME_KEYS[camId];
    return key ? t(key) : camId;
}

function applyLanguage() {
    const lang = currentLang;

    document.getElementById('lang-toggle').innerText = lang === 'en' ? '🇻🇳' : '🇬🇧';

    document.querySelector('#start-screen h1').innerText = t('nightShift');
    document.getElementById('start-night-display').innerText = t('night') + ' ' + savedNight;
    document.querySelector('#start-screen .menu-btn[onclick="showInstructions()"]').innerText = t('startGame');
    document.querySelector('#start-screen .menu-btn[onclick="resetData()"]').innerText = t('eraseData');

    document.querySelector('#instruction-screen h2').innerText = t('howToPlay');
    const lis = document.querySelectorAll('#instruction-screen li');
    if (lis[0]) lis[0].innerHTML = t('inst1');
    if (lis[1]) lis[1].innerHTML = t('inst2');
    if (lis[2]) lis[2].innerHTML = t('inst3');
    if (lis[3]) lis[3].innerHTML = t('inst4');
    if (lis[4]) lis[4].innerHTML = t('inst5');
    const beginBtn = document.querySelector('#instruction-screen .menu-btn');
    if (beginBtn) beginBtn.innerText = t('beginShift');

    const powerLabel = document.querySelector('.hud-bottom-left > div:first-child');
    if (powerLabel) {
        const span = document.getElementById('power-display');
        powerLabel.innerHTML = '';
        powerLabel.style.color = '#aaa';
        powerLabel.append(t('power') + ' ');
        powerLabel.appendChild(span);
    }
    const usageLabel = document.querySelector('.hud-bottom-left > div:nth-child(2)');
    if (usageLabel) {
        const span = document.getElementById('usage-display');
        usageLabel.innerHTML = '';
        usageLabel.style.color = '#aaa';
        usageLabel.append(t('usage') + ' ');
        usageLabel.appendChild(span);
    }

    document.getElementById('night-display').innerText = t('night') + ' ' + savedNight;
    try { document.getElementById('cam-toggle').innerText = gameState.isCamOpen ? t('closeMonitor') : t('openMonitor'); } catch(e) { document.getElementById('cam-toggle').innerText = t('openMonitor'); }

    const goDiv = document.querySelector('#game-over > div:first-child');
    if (goDiv) goDiv.innerText = t('gameOver');
    const goBtn = document.querySelector('#game-over .menu-btn');
    if (goBtn) goBtn.innerText = t('tryAgain');

    const winBtn = document.querySelector('#win-screen .menu-btn');
    if (winBtn) winBtn.innerText = t('continue');

    const youHere = document.querySelector('.you-are-here');
    if (youHere) youHere.innerText = t('youAreHere');

    // Update camera map onclick handlers with translated names
    const camBtns = {
        '1A': 'camShowStage', '1B': 'camDiningArea', '1C': 'camPirateCove',
        '2A': 'camWestHall', '2B': 'camWHallCorner', '3': 'camSupplyCloset',
        '4A': 'camEastHall', '4B': 'camEHallCorner', '5': 'camBackstage',
        '6': 'camKitchen', '7': 'camRestrooms'
    };
    Object.entries(camBtns).forEach(([id, key]) => {
        const btn = document.getElementById('cam-' + id);
        if (btn) btn.setAttribute('onclick', "switchCam('" + id + "','" + t(key).replace(/'/g, "\\'") + "')");
    });

    // Update current cam label + scene if camera is open (guard against early call)
    try {
        if (gameState && gameState.isCamOpen && DOM) {
            const camId = gameState.currentCam;
            document.getElementById('cam-label').innerText = 'CAM ' + camId + ' - ' + getCamName(camId);
            currentSceneCam = null; currentSceneLang = null;
            updateCamVisuals();
        }
    } catch(e) {}
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'vi' : 'en';
    localStorage.setItem('fnaf_lang', currentLang);
    applyLanguage();
}

/* ----------------------------------------------------------
   NIGHT SYSTEM
   ---------------------------------------------------------- */
let savedNight = parseInt(localStorage.getItem('fnaf_web_night')) || 1;
if (savedNight > 5) savedNight = 5;

document.getElementById('start-night-display').innerText = `${t('night')} ${savedNight}`;
document.getElementById('night-display').innerText = `${t('night')} ${savedNight}`;

applyLanguage();

function resetData() {
    if (confirm(t('eraseConfirm'))) {
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
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
            break;

        case 'door-close':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);

            const metalHit = audioCtx.createOscillator();
            const metalGain = audioCtx.createGain();
            metalHit.type = 'square';
            metalHit.frequency.setValueAtTime(150, audioCtx.currentTime);
            metalHit.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
            metalHit.connect(metalGain);
            metalGain.connect(masterGainNode);
            metalGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            metalGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            metalHit.start();
            metalHit.stop(audioCtx.currentTime + 0.2);
            break;

        case 'door-open':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(30, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
            break;

        case 'light-buzz':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
            break;

        case 'monitor-up': {
            const noise = audioCtx.createBufferSource();
            const bufferSize = audioCtx.sampleRate * 0.3;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
            noise.buffer = buffer;
            const noiseGain = audioCtx.createGain();
            noise.connect(noiseGain);
            noiseGain.connect(masterGainNode);
            noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            noise.start();
            noise.stop(audioCtx.currentTime + 0.3);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            break;
        }

        case 'monitor-down': {
            const noise2 = audioCtx.createBufferSource();
            const bufferSize2 = audioCtx.sampleRate * 0.2;
            const buffer2 = audioCtx.createBuffer(1, bufferSize2, audioCtx.sampleRate);
            const data2 = buffer2.getChannelData(0);
            for (let i = 0; i < bufferSize2; i++) data2[i] = (Math.random() * 2 - 1) * 0.2;
            noise2.buffer = buffer2;
            const noiseGain2 = audioCtx.createGain();
            noise2.connect(noiseGain2);
            noiseGain2.connect(masterGainNode);
            noiseGain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
            noiseGain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            noise2.start();
            noise2.stop(audioCtx.currentTime + 0.2);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
            break;
        }

        case 'jumpscare': {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(2000, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(80, audioCtx.currentTime + 0.1);
            osc.frequency.linearRampToValueAtTime(3000, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.7, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.7, audioCtx.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.5);

            const noise3 = audioCtx.createBufferSource();
            const bufferSize3 = audioCtx.sampleRate * 1.5;
            const buffer3 = audioCtx.createBuffer(1, bufferSize3, audioCtx.sampleRate);
            const data3 = buffer3.getChannelData(0);
            for (let i = 0; i < bufferSize3; i++) data3[i] = (Math.random() * 2 - 1);
            noise3.buffer = buffer3;
            const screamGain = audioCtx.createGain();
            noise3.connect(screamGain);
            screamGain.connect(masterGainNode);
            screamGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            screamGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
            noise3.start();
            noise3.stop(audioCtx.currentTime + 1.5);
            break;
        }

        case 'powerout': {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.8);
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.0);

            const buzz = audioCtx.createOscillator();
            const buzzGain = audioCtx.createGain();
            buzz.type = 'sawtooth';
            buzz.frequency.setValueAtTime(60, audioCtx.currentTime);
            buzz.connect(buzzGain);
            buzzGain.connect(masterGainNode);
            buzzGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            buzzGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            buzz.start();
            buzz.stop(audioCtx.currentTime + 0.5);
            break;
        }

        case 'gf-hallucination': {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
            osc.start();
            osc.stop(audioCtx.currentTime + 3);

            gfHallucinationOsc = audioCtx.createOscillator();
            const gfGain = audioCtx.createGain();
            gfHallucinationOsc.type = 'sawtooth';
            gfHallucinationOsc.frequency.setValueAtTime(40, audioCtx.currentTime);
            gfHallucinationOsc.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 3);
            gfHallucinationOsc.connect(gfGain);
            gfGain.connect(masterGainNode);
            gfGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gfGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 2);
            gfGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
            gfHallucinationOsc.start();
            gfHallucinationOsc.stop(audioCtx.currentTime + 3);
            break;
        }

        case 'gf-jumpscare': {
            osc.type = 'square';
            osc.frequency.setValueAtTime(60, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(4000, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
            osc.start();
            osc.stop(audioCtx.currentTime + 2.0);

            const gfNoise = audioCtx.createBufferSource();
            const gfBufSize = audioCtx.sampleRate * 2;
            const gfBuf = audioCtx.createBuffer(1, gfBufSize, audioCtx.sampleRate);
            const gfData = gfBuf.getChannelData(0);
            for (let i = 0; i < gfBufSize; i++) gfData[i] = (Math.random() * 2 - 1);
            gfNoise.buffer = gfBuf;
            const gfNoiseGain = audioCtx.createGain();
            gfNoise.connect(gfNoiseGain);
            gfNoiseGain.connect(masterGainNode);
            gfNoiseGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
            gfNoiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
            gfNoise.start();
            gfNoise.stop(audioCtx.currentTime + 2.0);
            break;
        }

        case 'move': {
            const moveNoise = audioCtx.createBufferSource();
            const moveBufSize = audioCtx.sampleRate * 0.15;
            const moveBuf = audioCtx.createBuffer(1, moveBufSize, audioCtx.sampleRate);
            const moveData = moveBuf.getChannelData(0);
            for (let i = 0; i < moveBufSize; i++) moveData[i] = (Math.random() * 2 - 1) * 0.15;
            moveNoise.buffer = moveBuf;
            const moveGain = audioCtx.createGain();
            moveNoise.connect(moveGain);
            moveGain.connect(masterGainNode);
            moveGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            moveGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            moveNoise.start();
            moveNoise.stop(audioCtx.currentTime + 0.15);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
            break;
        }
    }
}

/* ----------------------------------------------------------
   VOLUME CONTROLS
   ---------------------------------------------------------- */
const volSlider = document.getElementById('volume-slider');
const volIcon = document.getElementById('volume-icon');

volSlider.addEventListener('input', () => {
    globalVolume = parseFloat(volSlider.value);
    isMuted = (globalVolume === 0);
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
    },
    {
        name: 'Foxy',
        icon: '🦊',
        side: 'left',
        position: 4,
        path: ['1C', '2A', '2B', 'left_door', 'left_door'],
        level: savedNight
    }
];

let currentSceneCam = null;
let currentSceneLang = null;

/* ----------------------------------------------------------
   CAMERA SCENES — visual backgrounds for each camera
   ---------------------------------------------------------- */
function getCamScene(camId) {
    const scenes = {
        '1A': '<div class="scene-wrapper scene-stage"><div class="curtain-left"></div><div class="curtain-right"></div><div class="curtain-top"></div><div class="stage-floor"></div><div class="star-deco">⭐</div><div class="star-deco">⭐</div><div class="star-deco">✨</div></div>',
        '1B': '<div class="scene-wrapper scene-dining"><div class="banner">' + t('celebrate') + '</div><div class="table"></div><div class="table"></div><div class="table"></div><div class="table"></div></div>',
        '1C': '<div class="scene-wrapper scene-pirate"><div class="pirate-curtain"></div><div class="oor-sign">' + t('outOfOrder') + '</div></div>',
        '2A': '<div class="scene-wrapper scene-westhall"><div class="hall-perspective"></div><div class="hall-poster"></div><div class="hall-light"></div></div>',
        '2B': '<div class="scene-wrapper scene-whallcorner"><div class="corner-wall"></div><div class="corner-poster"></div><div class="corner-papers">📄 📄</div></div>',
        '3': '<div class="scene-wrapper scene-closet"><div class="shelf"></div><div class="shelf"></div><div class="shelf"></div><div class="closet-items">🧹 🧴 🪣</div><div class="closet-items-2">📦 🔧</div></div>',
        '4A': '<div class="scene-wrapper scene-easthall"><div class="hall-perspective"></div><div class="rules-poster"></div><div class="hall-light"></div></div>',
        '4B': '<div class="scene-wrapper scene-ehallcorner"><div class="corner-wall"></div><div class="rules-poster"></div></div>',
        '5': '<div class="scene-wrapper scene-backstage"><div class="bs-shelf"></div><div class="bs-shelf-2"></div><div class="bs-heads">💀 💀 💀</div><div class="bs-parts">🦾 🦿 🔩</div><div class="bs-table"></div></div>',
        '6': '<div class="scene-wrapper scene-kitchen"><div class="audio-icon">📡</div><div class="audio-only-text">' + t('audioOnly') + '</div></div>',
        '7': '<div class="scene-wrapper scene-restrooms"><div class="restroom-sign">🚻</div><div class="restroom-light"></div></div>',
    };
    return scenes[camId] || '';
}

/* ----------------------------------------------------------
   KITCHEN AUDIO — metallic clang sounds when Chica is there
   ---------------------------------------------------------- */
let kitchenAudioInterval = null;

function playKitchenClang() {
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(800 + Math.random() * 600, now);
    osc1.frequency.exponentialRampToValueAtTime(100 + Math.random() * 100, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(masterGainNode);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.start(now);
    osc1.stop(now + 0.2);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2000 + Math.random() * 1500, now);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    osc2.connect(gain2);
    gain2.connect(masterGainNode);
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.start(now);
    osc2.stop(now + 0.12);

    const noise = audioCtx.createBufferSource();
    const bufSize = audioCtx.sampleRate * 0.08;
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    noise.buffer = buf;
    const noiseGain = audioCtx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(masterGainNode);
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    noise.start(now);
    noise.stop(now + 0.1);
}

function startKitchenAudio() {
    if (kitchenAudioInterval) return;
    playKitchenClang();
    kitchenAudioInterval = setInterval(() => {
        playKitchenClang();
    }, 600 + Math.random() * 1200);
}

function stopKitchenAudio() {
    if (kitchenAudioInterval) {
        clearInterval(kitchenAudioInterval);
        kitchenAudioInterval = null;
    }
}

function isChicaInKitchen() {
    const chica = AI_LIST.find(ai => ai.name === 'Chica');
    if (!chica) return false;
    let room = chica.path[chica.path.length - 1 - chica.position];
    if (chica.position === chica.path.length - 1) room = '1A';
    return room === '6';
}

/* ----------------------------------------------------------
   DOM CACHE
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
    noiseCanvas: document.getElementById('cam-noise-canvas'),
    camScene: document.getElementById('cam-scene')
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
    DOM.timeDisplay.innerText = `12:00 ${t('timeAM')}`;
    gameLoop = setInterval(gameTimerLoop, 1000);
    aiLoop = setInterval(updateAI, 3000);
    updateCamVisuals();
    startCamTimestamp();
}

/* ----------------------------------------------------------
   OFFICE PANNING (mouse-driven)
   ---------------------------------------------------------- */
let officeX = -30;

document.addEventListener('mousemove', e => {
    if (gameState.isCamOpen || !gameState.gameActive || gameState.isPowerOut) return;
    const pct = e.clientX / window.innerWidth;
    officeX = -(pct * 60);
    DOM.office.style.transform = `translateX(${officeX}vw)`;
});

/* ----------------------------------------------------------
   POWER USAGE
   ---------------------------------------------------------- */
function updateUsageDisplay() {
    let usage = 1;
    if (gameState.isCamOpen) usage++;
    if (gameState.doors.left) usage++;
    if (gameState.doors.right) usage++;
    if (gameState.lights.left) usage++;
    if (gameState.lights.right) usage++;
    DOM.usageDisplay.innerText = '🔋'.repeat(Math.min(usage, 5));
    return usage;
}

/* ----------------------------------------------------------
   DOORS & LIGHTS
   ---------------------------------------------------------- */
function toggleDoor(side) {
    if (!gameState.gameActive || gameState.isPowerOut) return;
    gameState.doors[side] = !gameState.doors[side];
    playSound(gameState.doors[side] ? 'door-close' : 'door-open');
    updateDoorVisuals(side);
    updateUsageDisplay();
}

function toggleLight(side, on) {
    if (!gameState.gameActive || gameState.isPowerOut) return;
    gameState.lights[side] = on;
    if (on) playSound('light-buzz');
    updateDoorVisuals(side);
    updateUsageDisplay();
}

/* ----------------------------------------------------------
   VISUAL UPDATES (doors, lights, animatronics at doors)
   ---------------------------------------------------------- */
function updateDoorVisuals(side) {
    const door = document.getElementById(`door-${side}`);
    const light = document.getElementById(`light-${side}-overlay`);
    const ai = document.getElementById(`ai-${side}-visual`);
    const doorBtn = document.getElementById(`btn-door-${side}`);
    const lightBtn = document.getElementById(`btn-light-${side}`);

    door.classList.toggle('closed', gameState.doors[side]);
    doorBtn.classList.toggle('active', gameState.doors[side]);

    light.classList.toggle('active', gameState.lights[side]);
    lightBtn.classList.toggle('active', gameState.lights[side]);

    const atDoor = AI_LIST.some(a => a.side === side && a.position === 0);
    ai.classList.toggle('is-here', atDoor);

    updateWindowCharacter();
}

function updateWindowCharacter() {
    const chicaAtDoor = AI_LIST.find(a => a.name === 'Chica' && a.position === 0);
    if (chicaAtDoor && gameState.lights.right && !gameState.doors.right) {
        DOM.windowChar.classList.add('visible');
    } else {
        DOM.windowChar.classList.remove('visible');
    }
}

/* ----------------------------------------------------------
   CAMERA NOISE (animated grain on camera feed)
   ---------------------------------------------------------- */
let noiseAnimId = null;
const noiseCtx = DOM.noiseCanvas ? DOM.noiseCanvas.getContext('2d') : null;

function drawCameraNoise() {
    if (!noiseCtx) return;
    const w = DOM.noiseCanvas.width;
    const h = DOM.noiseCanvas.height;
    const imageData = noiseCtx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
    }

    if (Math.random() < 0.15) {
        const lineY = Math.floor(Math.random() * h);
        const lineHeight = 1 + Math.floor(Math.random() * 3);
        for (let y = lineY; y < Math.min(lineY + lineHeight, h); y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                data[idx] = 255;
                data[idx + 1] = 255;
                data[idx + 2] = 255;
                data[idx + 3] = 100 + Math.random() * 100;
            }
        }
    }

    if (Math.random() < 0.08) {
        const rollOffset = Math.floor(Math.random() * 10) - 5;
        const startY = Math.floor(Math.random() * h);
        const blockH = Math.floor(h * 0.1);
        for (let y = startY; y < Math.min(startY + blockH, h); y++) {
            for (let x = 0; x < w; x++) {
                const srcX = (x + rollOffset + w) % w;
                const dstIdx = (y * w + x) * 4;
                const srcIdx = (y * w + srcX) * 4;
                data[dstIdx] = data[srcIdx];
                data[dstIdx + 1] = data[srcIdx + 1];
                data[dstIdx + 2] = data[srcIdx + 2];
            }
        }
    }

    noiseCtx.putImageData(imageData, 0, 0);
    noiseAnimId = requestAnimationFrame(drawCameraNoise);
}

function startCameraNoise() {
    if (noiseAnimId === null) drawCameraNoise();
}

function stopCameraNoise() {
    if (noiseAnimId !== null) {
        cancelAnimationFrame(noiseAnimId);
        noiseAnimId = null;
    }
}

/* ----------------------------------------------------------
   STATIC BURST (on camera switch)
   ---------------------------------------------------------- */
let staticBurstTimeout = null;
const staticCtx = DOM.camStaticCanvas ? DOM.camStaticCanvas.getContext('2d') : null;

function drawStaticFrame(ctx, canvas) {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v; d[i+1] = v; d[i+2] = v; d[i+3] = 200;
    }
    ctx.putImageData(img, 0, 0);
}

function triggerStaticBurst() {
    if (!staticCtx) return;
    drawStaticFrame(staticCtx, DOM.camStaticCanvas);

    DOM.camStaticOverlay.classList.remove('fade-out');
    DOM.camStaticOverlay.classList.add('burst');

    if (staticBurstTimeout) clearTimeout(staticBurstTimeout);
    staticBurstTimeout = setTimeout(() => {
        DOM.camStaticOverlay.classList.remove('burst');
        DOM.camStaticOverlay.classList.add('fade-out');

        staticBurstTimeout = setTimeout(() => {
            DOM.camStaticOverlay.classList.remove('fade-out');
        }, 350);
    }, 80);
}

/* ----------------------------------------------------------
   CAMERA TIMESTAMP
   ---------------------------------------------------------- */
let camTimestampInterval = null;

function startCamTimestamp() {
    if (camTimestampInterval) return;
    camTimestampInterval = setInterval(() => {
        const now = new Date();
        const h = now.getHours() % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        DOM.camTimestamp.innerText = `${h}:${m}:${s} ${t('timeAM')}`;
    }, 1000);
}

/* ----------------------------------------------------------
   CAMERA TOGGLE & SWITCHING
   ---------------------------------------------------------- */
function toggleCameras() {
    if (gameState.isPowerOut || !gameState.gameActive) return;
    gameState.isCamOpen = !gameState.isCamOpen;

    const fanEl = document.querySelector('.fan');

    if (!gameState.isCamOpen) {
        // --- MONITOR DOWN ---
        playSound('monitor-down');
        DOM.cameraSystem.classList.remove('monitor-opening');
        DOM.cameraSystem.classList.add('monitor-closing');
        stopCameraNoise();
        stopKitchenAudio();
        currentSceneCam = null; currentSceneLang = null;
        // Resume fan when camera is lowered
        if (fanEl) fanEl.style.animationPlayState = 'running';
        setTimeout(() => {
            if (!gameState.isCamOpen) DOM.cameraSystem.style.display = 'none';
        }, 250);
        if (Math.random() < 0.05 && !gameState.gfActive) triggerGoldenFreddy();
    } else {
        // --- MONITOR UP ---
        playSound('monitor-up');
        DOM.cameraSystem.classList.remove('monitor-closing');
        DOM.cameraSystem.classList.add('monitor-opening');
        triggerStaticBurst();
        startCameraNoise();
        // Fan stops when looking at camera (FNAF 1 detail)
        if (fanEl) fanEl.style.animationPlayState = 'paused';
        if (gameState.gfActive) cancelGoldenFreddy();
        DOM.camLabel.innerText = `CAM ${gameState.currentCam} - ${getCamName(gameState.currentCam)}`;
    }

    DOM.camToggle.innerText = gameState.isCamOpen ? t('closeMonitor') : t('openMonitor');
    updateUsageDisplay();
    updateCamVisuals();
}

function switchCam(cam, name) {
    playSound('click');
    triggerStaticBurst();
    stopKitchenAudio();
    gameState.currentCam = cam;
    DOM.camLabel.innerText = `CAM ${cam} - ${name}`;
    document.querySelectorAll('.cam-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`cam-${cam}`).classList.add('active');
    updateCamVisuals();
}

function updateCamVisuals() {
    if (!gameState.isCamOpen) return;

    if (DOM.camScene && (currentSceneCam !== gameState.currentCam || currentSceneLang !== currentLang)) {
        currentSceneCam = gameState.currentCam;
        currentSceneLang = currentLang;
        DOM.camScene.innerHTML = getCamScene(gameState.currentCam);
    }

    if (gameState.currentCam === '6') {
        DOM.camAiVisual.innerText = '';
        DOM.camAiVisual.style.fontSize = '';
        // Kitchen audio: play if Chica is in kitchen
        if (isChicaInKitchen()) {
            startKitchenAudio();
        } else {
            stopKitchenAudio();
        }
        return;
    }

    // Not on kitchen — stop kitchen audio
    stopKitchenAudio();

    DOM.camAiVisual.style.fontSize = '';
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
        if (gameState.gfActive) executeGoldenFreddyJumpscare();
    }, 5000);
}

function cancelGoldenFreddy() {
    gameState.gfActive = false;
    DOM.goldenFreddy.style.display = 'none';
    if (gfTimeout) clearTimeout(gfTimeout);
    if (gfHallucinationOsc) {
        try { gfHallucinationOsc.stop(); } catch(e) {}
        gfHallucinationOsc = null;
    }
}

function executeGoldenFreddyJumpscare() {
    gameState.gameActive = false;
    clearInterval(gameLoop);
    clearInterval(aiLoop);
    if (freddyMusicInterval) clearInterval(freddyMusicInterval);
    stopCameraNoise();
    stopKitchenAudio();

    DOM.cameraSystem.style.display = 'none';
    DOM.goldenFreddy.style.display = 'none';

    playSound('gf-jumpscare');
    document.body.classList.add('shaking');
    DOM.gfJumpscare.style.display = 'flex';

    setTimeout(() => {
        document.body.classList.remove('shaking');
        DOM.gfJumpscare.style.display = 'none';
        DOM.gameOver.style.display = 'flex';
    }, 2000);
}

/* ----------------------------------------------------------
   AI MOVEMENT
   ---------------------------------------------------------- */
function updateAI() {
    if (!gameState.gameActive || gameState.isPowerOut) return;

    AI_LIST.forEach(ai => {
        if (ai.position <= 0) {
            // At the door — check if door is closed
            if (gameState.doors[ai.side]) {
                ai.position = Math.min(ai.path.length - 1, 3 + Math.floor(Math.random() * 3));
                playSound('move');
            } else {
                // Door open — chance to attack
                if (Math.random() < 0.25 && !gameState.isCamOpen) {
                    triggerJumpscare(ai.icon);
                    return;
                }
            }
        } else {
            const roll = Math.random() * 20;
            if (roll < ai.level) {
                ai.position--;
                playSound('move');
            }
        }
    });

    updateDoorVisuals('left');
    updateDoorVisuals('right');
    updateCamVisuals();
}

/* ----------------------------------------------------------
   JUMPSCARE
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
    stopKitchenAudio();

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
        DOM.timeDisplay.innerText = `${gameState.timeHour}:00 ${t('timeAM')}`;
        AI_LIST.forEach(ai => ai.level++);

        if (gameState.timeHour === 6) {
            gameState.gameActive = false;
            clearInterval(gameLoop);
            clearInterval(aiLoop);
            stopCameraNoise();
            stopKitchenAudio();

            if (gameState.night < 5) {
                localStorage.setItem('fnaf_web_night', gameState.night + 1);
                DOM.winSubtext.innerText = `${t('youSurvived')} ${gameState.night}`;
            } else {
                DOM.winSubtext.innerText = t('youBeat');
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
    stopKitchenAudio();

    if (gameState.gfActive) cancelGoldenFreddy();
    playSound('powerout');

    ['left', 'right'].forEach(side => {
        gameState.doors[side] = false;
        document.getElementById(`door-${side}`).classList.remove('closed');
        document.getElementById(`light-${side}-overlay`).classList.remove('active');
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
    }, 2000);
}
