class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.instructions = document.getElementById('instructions');
        this.gameOverScreen = document.getElementById('gameOver');
        
        // Language system
        this.setupLanguages();
        this.currentLanguage = this.loadLanguage();
        
        // Mobile detection
        this.isMobile = this.detectMobile();
        
        // Game state
        this.gameActive = false;
        this.score = 0;
        this.lives = 3;
        this.record = this.loadRecord();
        this.currentID = '';
        
        // Game objects
        this.playerPaddle = { x: 20, y: 150, width: 15, height: 60, speed: 0 };
        this.aiPaddle = { x: 605, y: 150, width: 15, height: 60 };
        this.ball = { x: 312, y: 172, radius: 8, speedX: 5, speedY: 5 };
        
        // Colors
        this.colors = {
            background: '#1a1a2f',
            paddle: '#6d5ba6',
            ball: '#ff3c7d',
            text: '#ffffff',
            accent: '#6d5ba6'
        };
        
        // Audio setup
        this.setupAudio();
        
        // Event listeners
        this.setupEventListeners();
        
        // Generate initial ID
        this.generateUserID();
        
        // Initialize UI text
        setTimeout(() => this.updateUIText(), 100);
        
        // Start game loop
        this.gameLoop();
        
        // Update datetime every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Update ID every 300ms
        setInterval(() => {
            this.generateUserID();
        }, 300);
    }
    
    setupLanguages() {
        this.translations = {
            'ru': {
                name: 'Русский',
                pongGame: 'ПОНГ ИГРА',
                pressSpace: 'Нажмите ПРОБЕЛ чтобы начать игру',
                moveMouse: 'Двигайте мышью чтобы управлять ракеткой',
                pressEsc: 'Нажмите ESC чтобы приостановить игру',
                gameOver: 'ИГРА ОКОНЧЕНА',
                playAgain: 'Нажмите ПРОБЕЛ чтобы играть снова',
                score: 'СЧЁТ',
                lives: 'ЖИЗНИ',
                record: 'РЕКОРД',
                language: 'ЯЗЫК',
                start: 'СТАРТ',
                pause: 'ПАУЗА',
                tapStart: 'Нажмите СТАРТ чтобы начать',
                touchDrag: 'Касайтесь и двигайте чтобы управлять ракеткой',
                tapStartAgain: 'Нажмите СТАРТ чтобы играть снова',
                gameDevelopment: 'Разработка Игр',
                loading: 'Загрузка...'
            },
            'uk': {
                name: 'Українська',
                pongGame: 'ГРА ПОНГ',
                pressSpace: 'Натисніть ПРОБІЛ щоб розпочати гру',
                moveMouse: 'Рухайте мишею щоб керувати ракеткою',
                pressEsc: 'Натисніть ESC щоб призупинити гру',
                gameOver: 'ГРА ЗАКІНЧЕНА',
                playAgain: 'Натисніть ПРОБІЛ щоб грати знову',
                score: 'РАХУНОК',
                lives: 'ЖИТТЯ',
                record: 'РЕКОРД',
                language: 'МОВА',
                start: 'СТАРТ',
                pause: 'ПАУЗА',
                tapStart: 'Натисніть СТАРТ щоб почати',
                touchDrag: 'Торкайтесь і рухайте щоб керувати ракеткою',
                tapStartAgain: 'Натисніть СТАРТ щоб грати знову',
                gameDevelopment: 'Розробка Ігор',
                loading: 'Завантаження...'
            },
            'be': {
                name: 'Беларуская',
                pongGame: 'ГУЛЬНЯ ПОНГ',
                pressSpace: 'Націсніце ПРАБЕЛ каб пачаць гульню',
                moveMouse: 'Рухайце мышшу каб кіраваць ракеткай',
                pressEsc: 'Націсніце ESC каб прыпыніць гульню',
                gameOver: 'ГУЛЬНЯ СКОНЧАНА',
                playAgain: 'Націсніце ПРАБЕЛ каб гуляць зноў',
                score: 'ЛІК',
                lives: 'ЖЫЦЦЁ',
                record: 'РЭКОРД',
                language: 'МОВА',
                start: 'СТАРТ',
                pause: 'ПАЎЗА',
                tapStart: 'Націсніце СТАРТ каб пачаць',
                touchDrag: 'Дакраніцеся і рухайце каб кіраваць ракеткай',
                tapStartAgain: 'Націсніце СТАРТ каб гуляць зноў',
                gameDevelopment: 'Распрацоўка Гульняў',
                loading: 'Загрузка...'
            },
            'kk': {
                name: 'Қазақша',
                pongGame: 'ПОНГ ОЙЫНЫ',
                pressSpace: 'Ойынды бастау үшін БОС ОРЫН басыңыз',
                moveMouse: 'Ракетканы басқару үшін тышқанды жылжытыңыз',
                pressEsc: 'Ойынды тоқтату үшін ESC басыңыз',
                gameOver: 'ОЙЫН АЯҚТАЛДЫ',
                playAgain: 'Қайта ойнау үшін БОС ОРЫН басыңыз',
                score: 'ЕСЕП',
                lives: 'ӨМІР',
                record: 'РЕКОРД',
                language: 'ТІЛ',
                start: 'БАСТАУ',
                pause: 'ТОҚТАТУ',
                tapStart: 'Бастау үшін БАСТАУ басыңыз',
                touchDrag: 'Жанасу арқылы ракетканы басқарыңыз',
                tapStartAgain: 'Қайта ойнау үшін БАСТАУ басыңыз',
                gameDevelopment: 'Ойын Жасау',
                loading: 'Жүктелуде...'
            },
            'uz': {
                name: 'Oʻzbekcha',
                pongGame: 'PONG O\'YINI',
                pressSpace: 'O\'yinni boshlash uchun PROBEL bosing',
                moveMouse: 'Raketani boshqarish uchun sichqonchani harakatlantiring',
                pressEsc: 'O\'yinni to\'xtatish uchun ESC bosing',
                gameOver: 'O\'YIN TUGADI',
                playAgain: 'Qayta o\'ynash uchun PROBEL bosing',
                score: 'HISOB',
                lives: 'JON',
                record: 'REKORD',
                language: 'TIL',
                start: 'BOSHLASH',
                pause: 'TO\'XTATISH',
                tapStart: 'Boshlash uchun BOSHLASH bosing',
                touchDrag: 'Tegib va harakat qilib raketani boshqaring',
                tapStartAgain: 'Qayta o\'ynash uchun BOSHLASH bosing',
                gameDevelopment: 'O\'yin Yaratish',
                loading: 'Yuklanmoqda...'
            },
            'ky': {
                name: 'Кыргызча',
                pongGame: 'ПОНГ ОЮНУ',
                pressSpace: 'Оюнду баштоо үчүн БОШТУК басыңыз',
                moveMouse: 'Ракетканы башкаруу үчүн чычканды жылдырыңыз',
                pressEsc: 'Оюнду токтотуу үчүн ESC басыңыз',
                gameOver: 'ОЮН БҮТТҮ',
                playAgain: 'Кайра ойноо үчүн БОШТУК басыңыз',
                score: 'ЭСЕП',
                lives: 'ЖАШОО',
                record: 'РЕКОРД',
                language: 'ТИЛ'
            },
            'tg': {
                name: 'Тоҷикӣ',
                pongGame: 'БОЗИИ ПОНГ',
                pressSpace: 'Барои оғози бозӣ ФОСИЛА пахш кунед',
                moveMouse: 'Барои идораи ракетка мушро ҳаракат диҳед',
                pressEsc: 'Барои таваққуфи бозӣ ESC пахш кунед',
                gameOver: 'БОЗӢ ТАМОМ ШУД',
                playAgain: 'Барои бозии нав ФОСИЛА пахш кунед',
                score: 'ҲИСОБ',
                lives: 'ҲАЁТ',
                record: 'РЕКОРД',
                language: 'ЗАБОН'
            },
            'tk': {
                name: 'Türkmençe',
                pongGame: 'PONG OÝNY',
                pressSpace: 'Oýny başlatmak üçin BOŞLUK basyň',
                moveMouse: 'Raketka dolandyrmak üçin syçany hereketlen',
                pressEsc: 'Oýny saklatmak üçin ESC basyň',
                gameOver: 'OÝUN GUTARDY',
                playAgain: 'Täzeden oýnamak üçün BOŞLUK basyň',
                score: 'BAL',
                lives: 'DURMUŞ',
                record: 'REKORD',
                language: 'DIL'
            },
            'hy': {
                name: 'Հայերեն',
                pongGame: 'ՊՈՆԳ ԽԱՂ',
                pressSpace: 'Խաղը սկսելու համար սեղմեք ԲԱՑԱՏ',
                moveMouse: 'Ռակետկան կառավարելու համար շարժեք մկնիկը',
                pressEsc: 'Խաղը դադարեցնելու համար սեղմեք ESC',
                gameOver: 'ԽԱՂԸ ԱՎԱՐՏՎԵՑ',
                playAgain: 'Նորից խաղալու համար սեղմեք ԲԱՑԱՏ',
                score: 'ՀԱՇԻՎ',
                lives: 'ԿԱՑ',
                record: 'ՌԵԿՈՐԴ',
                language: 'ԼԵԶՈՒ',
                start: 'ՍԿՍԵԼ',
                pause: 'ԴԱԴԱՐ',
                tapStart: 'Սկսելու համար սեղմեք ՍԿՍԵԼ',
                touchDrag: 'Հպեք և շարժեք ռակետկան կառավարելու համար',
                tapStartAgain: 'Նորից խաղալու համար սեղմեք ՍԿՍԵԼ'
            },
            'az': {
                name: 'Azərbaycanca',
                pongGame: 'PONQ OYUNU',
                pressSpace: 'Oyunu başlatmaq üçün BOŞLUQ basın',
                moveMouse: 'Raketkani idarə etmək üçün siçanı hərəkət edin',
                pressEsc: 'Oyunu dayandırmaq üçün ESC basın',
                gameOver: 'OYUN BİTDİ',
                playAgain: 'Yenidən oynamaq üçün BOŞLUQ basın',
                score: 'XAL',
                lives: 'CAN',
                record: 'REKORD',
                language: 'DİL'
            },
            'ka': {
                name: 'ქართული',
                pongGame: 'პონგის თამაში',
                pressSpace: 'თამაშის დასაწყებად დააჭირეთ ღილაკს SPACE',
                moveMouse: 'რეკეტის მართვისთვის გადაადგილეთ მაუსი',
                pressEsc: 'თამაშის შესაჩერებლად დააჭირეთ ESC-ს',
                gameOver: 'თამაში დასრულდა',
                playAgain: 'ხელახლა სათამაშოდ დააჭირეთ SPACE-ს',
                score: 'ქულა',
                lives: 'სიცოცხლე',
                record: 'რეკორდი',
                language: 'ენა',
                start: 'დაწყება',
                pause: 'პაუზა',
                tapStart: 'დასაწყებად დააჭირეთ დაწყება-ს',
                touchDrag: 'შეეხეთ და გადააადგილეთ რეკეტის მართვისთვის',
                tapStartAgain: 'ხელახლა სათამაშოდ დააჭირეთ დაწყება-ს'
            },
            'ro': {
                name: 'Română',
                pongGame: 'JOC PONG',
                pressSpace: 'Apăsați SPAȚIU pentru a începe jocul',
                moveMouse: 'Mișcați mouse-ul pentru a controla racheta',
                pressEsc: 'Apăsați ESC pentru a pauzata jocul',
                gameOver: 'JOC TERMINAT',
                playAgain: 'Apăsați SPAȚIU pentru a juca din nou',
                score: 'SCOR',
                lives: 'VIEȚI',
                record: 'RECORD',
                language: 'LIMBA',
                start: 'START',
                pause: 'PAUZĂ',
                tapStart: 'Apăsați START pentru a începe',
                touchDrag: 'Atingeți și trageți pentru a controla racheta',
                tapStartAgain: 'Apăsați START pentru a juca din nou'
            }
        };
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }
    
    setupAudio() {
        // Create audio context for generating sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Generate hit sound
        this.hitSound = this.createBeepSound(800, 0.1);
        
        // Generate game over sound
        this.gameOverSound = this.createBeepSound(200, 0.5);
        
        // Background music (simple tone)
        this.backgroundMusic = null;
    }
    
    createBeepSound(frequency, duration) {
        return () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameActive) {
                    this.startGame();
                }
            } else if (e.code === 'Escape') {
                if (this.gameActive) {
                    this.pauseGame();
                }
            }
        });
        
        // Mouse movement for paddle control
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameActive) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseY = e.clientY - rect.top;
                this.playerPaddle.y = Math.max(0, Math.min(mouseY - this.playerPaddle.height / 2, 
                    this.canvas.height - this.playerPaddle.height));
            }
        });
        
        // Touch events for mobile support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.gameActive && e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const touchY = e.touches[0].clientY - rect.top;
                this.playerPaddle.y = Math.max(0, Math.min(touchY - this.playerPaddle.height / 2, 
                    this.canvas.height - this.playerPaddle.height));
            }
        });
        
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Mobile control buttons
        this.startButton = document.getElementById('startButton');
        this.pauseButton = document.getElementById('pauseButton');
        
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                if (!this.gameActive) {
                    this.startGame();
                }
            });
            
            this.startButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.gameActive) {
                    this.startGame();
                }
            });
        }
        
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => {
                if (this.gameActive) {
                    this.pauseGame();
                }
            });
            
            this.pauseButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameActive) {
                    this.pauseGame();
                }
            });
        }
        
        // Improved touch handling for paddle control
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameActive && e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const touchY = e.touches[0].clientY - rect.top;
                this.playerPaddle.y = Math.max(0, Math.min(touchY - this.playerPaddle.height / 2, 
                    this.canvas.height - this.playerPaddle.height));
            }
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.lives = 3;
        this.resetBall();
        this.instructions.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        
        // Update mobile buttons visibility
        if (this.startButton) {
            this.startButton.style.display = 'none';
        }
        if (this.pauseButton) {
            this.pauseButton.style.display = 'block';
        }
        
        // Start background music (simple tone)
        this.startBackgroundMusic();
    }
    
    pauseGame() {
        this.gameActive = false;
        this.instructions.style.display = 'block';
        this.stopBackgroundMusic();
        
        // Update mobile buttons visibility
        if (this.startButton) {
            this.startButton.style.display = 'block';
        }
        if (this.pauseButton) {
            this.pauseButton.style.display = 'none';
        }
    }
    
    startBackgroundMusic() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Simple background music loop
        this.backgroundMusic = setInterval(() => {
            if (this.gameActive) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = 220 + Math.sin(Date.now() / 1000) * 50;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }
        }, 1000);
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            clearInterval(this.backgroundMusic);
            this.backgroundMusic = null;
        }
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        
        // Random angle between -30 and 30 degrees, or 150 and 210 degrees
        const angle = (Math.random() * 60 - 30) * Math.PI / 180;
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        this.ball.speedX = Math.cos(angle) * 5 * direction;
        this.ball.speedY = Math.sin(angle) * 5;
        
        // Ensure minimum vertical speed
        if (Math.abs(this.ball.speedY) < 1.5) {
            this.ball.speedY = this.ball.speedY < 0 ? -2 : 2;
        }
    }
    
    generateUserID() {
        // Собираем данные о пользователе
        const userData = {
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 20) // Первые 20 символов
        };
        
        // Создаем строку из данных пользователя
        const dataString = `${userData.screen}_${userData.timezone}_${userData.language}_${userData.platform}_${userData.timestamp}`;
        
        // Простое шифрование - преобразуем в hex и берем части
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Преобразуем в 32-битное целое
        }
        
        // Преобразуем в положительное число и в base36 (0-9, A-Z)
        const positiveHash = Math.abs(hash).toString(36).toUpperCase();
        
        // Добавляем текущие миллисекунды для изменения каждые 300ms
        const timeComponent = (Date.now() % 100000).toString(36).toUpperCase();
        
        // Комбинируем и обрезаем до 8 символов
        const combined = (positiveHash + timeComponent).substring(0, 8).padEnd(8, '0');
        
        this.currentID = 'ID: ' + combined;
    }
    
    updateDateTime() {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        this.currentDateTime = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    }
    
    loadRecord() {
        const saved = localStorage.getItem('pongRecord');
        return saved ? parseInt(saved) : 0;
    }
    
    saveRecord() {
        localStorage.setItem('pongRecord', this.record.toString());
    }
    
    loadLanguage() {
        const saved = localStorage.getItem('pongLanguage');
        return saved && this.translations[saved] ? saved : 'ru';
    }
    
    saveLanguage() {
        localStorage.setItem('pongLanguage', this.currentLanguage);
    }
    
    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
    
    changeLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            this.saveLanguage();
            this.updateUIText();
        }
    }
    
    updateUIText() {
        // Update HTML elements
        const instructionsElement = document.querySelector('.instructions h2');
        const instructionsParagraphs = document.querySelectorAll('.instructions p:not(.mobile-instructions p)');
        const gameOverElement = document.querySelector('.game-over h2');
        const gameOverParagraph = document.querySelector('.game-over p:not(.mobile-instructions p)');
        
        // Mobile instructions
        const mobileTapStart = document.querySelector('.instructions .mobile-instructions p:first-child');
        const mobileTouchDrag = document.querySelector('.instructions .mobile-instructions p:last-child');
        const gameOverMobileInstructions = document.querySelector('.game-over .mobile-instructions p');
        const touchInstructions = document.querySelector('.touch-instructions p');
        
        if (instructionsElement) {
            instructionsElement.textContent = this.translate('pongGame');
        }
        
        if (instructionsParagraphs.length >= 3) {
            instructionsParagraphs[0].textContent = this.translate('pressSpace');
            instructionsParagraphs[1].textContent = this.translate('moveMouse');
            instructionsParagraphs[2].textContent = this.translate('pressEsc');
        }
        
        if (gameOverElement) {
            gameOverElement.textContent = this.translate('gameOver');
        }
        
        if (gameOverParagraph) {
            gameOverParagraph.textContent = this.translate('playAgain');
        }
        
        // Update mobile-specific text
        if (mobileTapStart) {
            mobileTapStart.textContent = this.translate('tapStart');
        }
        
        if (mobileTouchDrag) {
            mobileTouchDrag.textContent = this.translate('touchDrag');
        }
        
        if (gameOverMobileInstructions) {
            gameOverMobileInstructions.textContent = this.translate('tapStartAgain');
        }
        
        if (touchInstructions) {
            touchInstructions.textContent = this.translate('touchDrag');
        }
        
        // Update mobile buttons
        if (this.startButton) {
            this.startButton.textContent = this.translate('start');
        }
        
        if (this.pauseButton) {
            this.pauseButton.textContent = this.translate('pause');
        }
    }
    
    update() {
        if (!this.gameActive) return;
        
        // Move ball
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top/bottom walls
        if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.canvas.height) {
            this.ball.speedY *= -1;
            this.ball.y = this.ball.y - this.ball.radius <= 0 ? this.ball.radius : this.canvas.height - this.ball.radius;
        }
        
        // Ball collision with player paddle
        if (this.ball.x - this.ball.radius <= this.playerPaddle.x + this.playerPaddle.width &&
            this.ball.x + this.ball.radius >= this.playerPaddle.x &&
            this.ball.y >= this.playerPaddle.y &&
            this.ball.y <= this.playerPaddle.y + this.playerPaddle.height) {
            
            const hitPos = (this.ball.y - this.playerPaddle.y) / this.playerPaddle.height;
            this.ball.speedX = Math.abs(this.ball.speedX) * 1.05;
            this.ball.speedY += (hitPos - 0.5) * Math.PI / 3;
            this.hitSound();
            this.score++;
        }
        
        // Ball collision with AI paddle
        if (this.ball.x + this.ball.radius >= this.aiPaddle.x &&
            this.ball.x - this.ball.radius <= this.aiPaddle.x + this.aiPaddle.width &&
            this.ball.y >= this.aiPaddle.y &&
            this.ball.y <= this.aiPaddle.y + this.aiPaddle.height) {
            
            const hitPos = (this.ball.y - this.aiPaddle.y) / this.aiPaddle.height;
            this.ball.speedX = -Math.abs(this.ball.speedX) * 1.05;
            this.ball.speedY += (hitPos - 0.5) * Math.PI / 3;
            this.hitSound();
        }
        
        // AI paddle movement
        const aiCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
        const targetY = this.ball.y;
        const diff = targetY - aiCenter;
        this.aiPaddle.y += diff * 0.1;
        
        // Keep AI paddle within bounds
        this.aiPaddle.y = Math.max(0, Math.min(this.aiPaddle.y, this.canvas.height - this.aiPaddle.height));
        
        // Ball out of bounds
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.resetBall();
            }
        }
    }
    
    gameOver() {
        this.gameActive = false;
        this.stopBackgroundMusic();
        this.gameOverSound();
        
        if (this.score > this.record) {
            this.record = this.score;
            this.saveRecord();
        }
        
        this.gameOverScreen.style.display = 'block';
        
        // Update mobile buttons visibility
        if (this.startButton) {
            this.startButton.style.display = 'block';
        }
        if (this.pauseButton) {
            this.pauseButton.style.display = 'none';
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw middle line
        this.ctx.fillStyle = this.colors.accent;
        this.ctx.fillRect(this.canvas.width / 2 - 1, 0, 2, this.canvas.height);
        
        // Draw paddles
        this.ctx.fillStyle = this.colors.paddle;
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);
        
        // Draw ball
        this.ctx.fillStyle = this.colors.ball;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw text
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`${this.translate('score')}: ${this.score}`, 20, 40);
        
        // Draw lives as hearts
        let livesText = `${this.translate('lives')}: `;
        for (let i = 0; i < this.lives; i++) {
            livesText += '❤';
        }
        this.ctx.fillText(livesText, 20, 70);
        
        // Draw record
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`${this.translate('record')}: ${this.record}`, 20, this.canvas.height - 10);
        
        // Draw datetime
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = this.colors.accent;
        if (this.currentDateTime) {
            const dateTimeWidth = this.ctx.measureText(this.currentDateTime).width;
            this.ctx.fillText(this.currentDateTime, this.canvas.width - dateTimeWidth - 10, this.canvas.height - 10);
        }
        
        // Draw ID
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = this.colors.ball;
        const idWidth = this.ctx.measureText(this.currentID).width;
        this.ctx.fillText(this.currentID, this.canvas.width - idWidth - 10, this.canvas.height - 30);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Splash Screen Logic
function showSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const loadingText = splashScreen.querySelector('.loading-text');
    const subtitleElement = splashScreen.querySelector('.logo-subtitle');
    
    // Get current language from localStorage or default to Russian
    const currentLang = localStorage.getItem('pongLanguage') || 'ru';
    
    // Define translations object for splash screen
    const splashTranslations = {
        'ru': { loading: 'Загрузка...', gameDevelopment: 'Разработка Игр' },
        'uk': { loading: 'Завантаження...', gameDevelopment: 'Розробка Ігор' },
        'be': { loading: 'Загрузка...', gameDevelopment: 'Распрацоўка Гульняў' },
        'kk': { loading: 'Жүктелуде...', gameDevelopment: 'Ойын Жасау' },
        'uz': { loading: 'Yuklanmoqda...', gameDevelopment: 'O\'yin Yaratish' },
        'ky': { loading: 'Жүктөлүүдө...', gameDevelopment: 'Оюн Түзүү' },
        'tg': { loading: 'Бор мешавад...', gameDevelopment: 'Сохтани Бозӣ' },
        'tk': { loading: 'Ýüklenýär...', gameDevelopment: 'Oýun Döretmek' },
        'hy': { loading: 'Բեռնվում...', gameDevelopment: 'Խաղերի Մշակում' },
        'az': { loading: 'Yüklənir...', gameDevelopment: 'Oyun Yaradılması' },
        'ka': { loading: 'იტვირთება...', gameDevelopment: 'თამაშების შექმნა' },
        'ro': { loading: 'Se încarcă...', gameDevelopment: 'Dezvoltare Jocuri' }
    };
    
    // Update text based on current language
    const translations = splashTranslations[currentLang] || splashTranslations['ru'];
    loadingText.textContent = translations.loading;
    subtitleElement.textContent = translations.gameDevelopment;
    
    // Show splash screen for 3 seconds
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        
        // Remove splash screen after fade animation and initialize game
        setTimeout(() => {
            splashScreen.style.display = 'none';
            window.game = new PongGame();
        }, 800);
    }, 3000);
}

// Initialize splash screen when page loads
window.addEventListener('load', () => {
    showSplashScreen();
});

// Handle audio context for mobile browsers
document.addEventListener('click', () => {
    if (window.game && window.game.audioContext && window.game.audioContext.state === 'suspended') {
        window.game.audioContext.resume();
    }
});
