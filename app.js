/**
 * ESCRIU COM UN PRO! v2 - App de Mecanografia per a Nens
 * VERSIO MILLORADA - Basada en analisi de typing tutors existents
 * 
 * MILLORES RESPECTE AL ORIGINAL:
 * - Paraules mes interessants per a nens (animals, fruites, colors)
 * - Sistema de streaks amb compte enrere visual
 * - Reptes temporitzats amb barra de temps animada
 * - Animacions mes divertides (confeti, particles, shake)
 * - Feedback visual ampliat amb particules
 * - Gamificacio mes enganxosa (EP extra, bonificacions)
 * - Insignes originals mes divertides
 * - Teclat amb animacions 3D mes realistes
 * - Modes de joc adicionals (marato, carrera)
 * - Sistema de progres mes visual
 */

(function() {
    'use strict';

    // ==========================================
    // DATA - Lessons, Words, Badges, Challenges
    // ==========================================

    // PARAULES MES INTERESSANTS PER A NENS (v2)
    const WORDS_BY_CATEGORY = {
        animals: ['gat', 'gos', 'cavall', 'lleon', 'elefant', 'ocell', 'peix', 'formiga', 'cuc', 'aranya', 'casa', 'pessarra', 'canya', 'culler', 'cullera', 'forquilla', 'ganivet'],
        animals2: ['dofi', 'tigre', 'cogombr', 'conill', 'gall', 'porc', 'vaca', 'ovella', 'cabra', 'rusc', 'cargol', 'papallona', 'abella', 'serp', 'dragon', 'unicornio'],
        fruits: ['poma', 'pera', 'platan', 'taronga', 'llimona', 'maduixa', 'cirera', 'pressec', 'albercoc', 'raïm', 'melancia', 'sindria', 'mango', 'kiwi', 'pinya', 'cereixa'],
        colors: ['vermell', 'blau', 'verd', 'groc', 'taronja', 'violeta', 'rosa', 'blanc', 'negre', 'gris', 'marró', 'lila', 'turquesa', 'grana', 'beix', 'cian'],
        objects: ['llapis', 'llibre', 'carpeta', ' estoig', 'taula', 'cadira', 'finestra', 'porta', 'llum', 'ordinador', 'telefon', 'rellotge', 'ulleres', 'clau', 'motxilla', 'bossa'],
        nature: ['sol', 'lluna', 'estel', 'nuvol', 'pluja', 'vent', 'neu', 'terra', 'mar', 'riu', 'montanya', 'bosc', 'flor', 'herba', 'arbre', 'fulla'],
        actions: ['corre', 'salta', ' juga', 'dansa', 'canta', 'dibuixa', 'pinta', 'escriu', 'llegeix', 'neda', 'vola', 'subeix', 'baixa', 'tira', 'agafa', ' deixa'],
        food: ['pa', 'formatge', 'ous', 'lleite', 'aigua', 'suc', 'pasta', 'arròs', 'carner', 'peix', 'pollastre', 'verdura', 'fruita', 'pizza', 'sandvitx', 'macarrones']
    };

    const LESSONS = [
        {
            id: 'home-row-left',
            title: 'Mans Esquerra - Casa',
            week: 1,
            keys: ['A', 'S', 'D', 'F'],
            finger: 'index-left',
            fingerLabel: 'Dit Índex (esquerra)',
            fingerColor: '#69DB7C',
            intro: 'Comencem amb la mà Esquerra! La lletra A és el teu punt de partida.',
            words: ['fada', 'sala', 'dada', 'fase', 'data', 'fals', 'dads', 'asa', 'ada', 'faf', 'sas', 'sds', 'fds', 'dfs', 'sala', 'dada', 'assa', 'fada', 'salsa'],
            xpReward: 30,
            unlocked: true,
            order: 1
        },
        {
            id: 'home-row-right',
            title: 'Mans Dreta - Casa',
            week: 1,
            keys: ['J', 'K', 'L'],
            finger: 'index-right',
            fingerLabel: 'Dit Índex (dreta)',
            fingerColor: '#69DB7C',
            intro: 'Ara la mà dreta! Amb J, K i L escriuràs paraules màgiques.',
            words: ['jjj', 'kkk', 'lll', 'jkl', 'klj', 'lkj', 'kjl', 'jlk', 'jkj', 'kjk', 'ljl', 'jll', 'kjj', 'lkk', 'jjj', 'klk', 'ljl', 'jlk', 'kkl', 'llk'],
            xpReward: 30,
            unlocked: true,
            order: 2
        },
        {
            id: 'home-row-complete',
            title: 'Fila Central Completa',
            week: 1,
            keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Super! Ara tens les dues mans preparades. La fila central és la clau!',
            words: ['sala', 'dada', 'fada', 'jocs', 'flors', 'cassa', 'fals', 'saldo', 'dats', 'fas', 'jas', 'kas', 'las', 'saga', 'faja', 'cala', 'sall', 'fals', 'ados', 'llar'],
            xpReward: 50,
            unlocked: false,
            order: 3
        },
        {
            id: 'top-row-qwerty',
            title: 'Fila Superior - QWERTY',
            week: 2,
            keys: ['Q', 'W', 'E', 'R', 'T'],
            finger: 'index-left',
            fingerLabel: 'Dit Índex (esquerra)',
            fingerColor: '#69DB7C',
            intro: 'Amunt! Les tecles superiors esperen. Q, W, E, R, T - endavant!',
            words: ['terra', 'torrent', 'trrr', 'qqq', 'www', 'eee', 'ttt', 'rrr', 'qwet', 'tree', 'tret', 'qwer', 'qqq', 'ter', 'wer', 'req', 'rete', 'terra', 'torre', 'terra', 'tatar'],
            xpReward: 50,
            unlocked: false,
            order: 4
        },
        {
            id: 'top-row-yuiop',
            title: 'Fila Superior - YUIOP',
            week: 2,
            keys: ['Y', 'U', 'I', 'O', 'P'],
            finger: 'index-right',
            fingerLabel: 'Dit Índex (dreta)',
            fingerColor: '#69DB7C',
            intro: 'La mà dreta puja dalt! Y, U, I, O, P - ja quasi ho tens!',
            words: ['yyy', 'uuu', 'iii', 'ooo', 'ppp', 'yui', 'yoy', 'pip', 'pop', 'iui', 'you', 'yyy', 'uuu', 'ppp', 'ooo', 'yup', 'oyo', 'pop', 'pip', 'uyu'],
            xpReward: 50,
            unlocked: false,
            order: 5
        },
        {
            id: 'top-row-complete',
            title: 'Fila Superior Completa',
            week: 2,
            keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Incredible! Has conquerit tota la fila superior. Ets un campió!',
            words: ['terra', 'porta', 'quartet', 'quota', 'titol', 'trip', 'pour', 'write', 'type', 'your', 'robot', 'tower', 'power', 'quiet', 'quite', 'route', 'ratio', 'quote', 'tower', 'petit'],
            xpReward: 70,
            unlocked: false,
            order: 6
        },
        {
            id: 'bottom-row-zxcvb',
            title: 'Fila Inferior - ZXCVB',
            week: 3,
            keys: ['Z', 'X', 'C', 'V', 'B'],
            finger: 'index-left',
            fingerLabel: 'Dit Índex (esquerra)',
            fingerColor: '#69DB7C',
            intro: 'Baixem! Les tecles inferiors son fàcils. Z, X, C, V, B - ràpid!',
            words: ['caz', 'vzxx', 'cvzb', 'zxcv', 'cvcx', 'zxzx', 'bxcb', 'cvbz', 'zxcx', 'bzbx', 'xcxc', 'cvbb', 'zxxx', 'cvvc', 'bzbz', 'zxzx', 'cxcx', 'vbcv', 'zbcv', 'cvcb'],
            xpReward: 50,
            unlocked: false,
            order: 7
        },
        {
            id: 'bottom-row-nm',
            title: 'Fila Inferior - NM',
            week: 3,
            keys: ['N', 'M'],
            finger: 'index-right',
            fingerLabel: 'Dit Índex (dreta)',
            fingerColor: '#69DB7C',
            intro: 'Lúltima fila! N i M son els teus amics. Ja casi acabes!',
            words: ['nnn', 'mmm', 'nnm', 'mnn', 'nmn', 'mnm', 'nnn', 'mnm', 'nmn', 'nnn', 'mmm', 'nnm', 'mnn', 'nmn', 'nmm', 'mnn', 'mnm', 'nnm', 'nmn', 'mmm'],
            xpReward: 40,
            unlocked: false,
            order: 8
        },
        {
            id: 'bottom-row-complete',
            title: 'Fila Inferior Completa',
            week: 3,
            keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Fantàstic! Totes les tecles de la mà Esquerra funcionen perfectament!',
            words: ['cinema', 'cambra', 'clova', 'nabiu', 'muneca', 'camba', 'emba', 'blava', 'comeia', 'banyes', 'brau', 'carrer', 'marbre', 'canca', 'vanu', 'nabis', 'cambo', 'banya', 'civac', 'clovc'],
            xpReward: 70,
            unlocked: false,
            order: 9
        },
        {
            id: 'numbers',
            title: 'Números',
            week: 4,
            keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Els números! Ara aprendràs a escriure números ràpid.',
            words: ['123', '321', '132', '111', '222', '333', '444', '555', '1234', '4321', '1243', '2143', '1122', '1133', '2233', '1020', '2040', '3060', '4080', '5100'],
            xpReward: 80,
            unlocked: false,
            order: 10
        },
        {
            id: 'mixed-words',
            title: 'Paraules Mixtes',
            week: 4,
            keys: 'all',
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Hora del repte! Paraules de totes les tecles. Pots fer-ho!',
            words: ['gat', 'gos', 'sol', 'lluna', 'estel', 'arbre', 'flor', 'casa', 'cotxe', 'avió', 'jardi', 'porta', 'finestra', 'cadira', 'taula', 'llibre', 'llapis', 'poma', 'ordi', 'bici'],
            xpReward: 100,
            unlocked: false,
            order: 11
        },
        {
            id: 'sentences',
            title: 'Frases',
            week: 5,
            keys: 'all',
            finger: 'both',
            fingerLabel: 'Tots els dits',
            fingerColor: '#69DB7C',
            intro: 'Ara escriuràs frases senceres! Això és d adults!',
            words: ['el gat juga', 'avui fa sol', 'la lluna brilla', 'una estrella', 'el gos corre', 'una flor rosa', 'el sol arriba', 'la casa es gran', 'un cotxe blau', 'fem un joc', 'bon dia', 'hola mon', 'mes bonic', 'el cel es blau', 'te amo'],
            xpReward: 120,
            unlocked: false,
            order: 12
        }
    ];

    function generateWordsFromKeys(keys, categories) {
        const result = [];
        const availableWords = [];
        
        // Collect all words from specified categories that only use the allowed keys
        categories.forEach(cat => {
            const catWords = WORDS_BY_CATEGORY[cat] || [];
            catWords.forEach(word => {
                const chars = [...word.toLowerCase()].filter(c => c !== ' ');
                const isValid = chars.every(c => keys.includes(c) || c === ' ');
                if (isValid) {
                    availableWords.push(word);
                }
            });
        });
        
        // If not enough words, generate more
        while (result.length < 12) {
            if (availableWords.length > 0) {
                const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
                if (!result.includes(randomWord)) {
                    result.push(randomWord);
                }
            }
            
            // Generate simple combinations
            const keyCombos = [];
            for (let i = 0; i < keys.length; i++) {
                for (let j = i; j < keys.length && keyCombos.length < 20; j++) {
                    const combo = keys[i] + keys[j] + keys[i];
                    keyCombos.push(combo);
                }
            }
            keyCombos.forEach(c => {
                if (result.length < 12 && !result.includes(c)) {
                    result.push(c);
                }
            });
            
            if (result.length < 12) {
                keys.forEach(k => {
                    if (result.length < 12) {
                        result.push(k + k + k);
                    }
                });
            }
            
            break;
        }
        
        return result.slice(0, 12);
    }

    // TUTORIAL: teoria bàsica de la mecanografia, amb el mateix motor que les lliçons.
    const TUTORIAL_STEPS = [
        {
            id: 'tutorial-postura',
            title: '1. Postura',
            intro: 'Seu recte amb l\'esquena al respatller i els peus plans a terra. Els colzes formen 90°. La pantalla ha d\'estar davant dels teus ulls. No t\'encorbis: així podràs escriure molta estona sense cansar-te.',
            keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            finger: 'both',
            fingerLabel: 'Les dues mans',
            words: ['asdf', 'jkl', 'fads', 'lkj', 'sdf', 'kjl'],
            xpReward: 10,
            unlocked: true,
            order: 0,
            week: 0
        },
        {
            id: 'tutorial-base',
            title: '2. La posició base',
            intro: 'Els dits índexs van sempre a F (esquerra) i J (dreta). Tenen un relleu que els notaràs sense mirar. Des d\'aquesta posició base arribes a totes les altres tecles i sempre tornes al mateix lloc.',
            keys: ['f', 'j'],
            finger: 'both',
            fingerLabel: 'Índexs',
            words: ['ffff', 'jjjj', 'fjfj', 'jfjf', 'ffjj', 'jjff'],
            xpReward: 10,
            unlocked: true,
            order: 1,
            week: 0
        },
        {
            id: 'tutorial-dits',
            title: '3. Un dit per cada tecla',
            intro: 'Cada dit té les seves tecles i no les canvia. Polze (1) → espai. Índex (2) → F, J i les del costat. Cor (3) → D i K. Anular (4) → S i L. Xic (5) → A i Ñ. No facis servir un dit a fer feina d\'un altre.',
            keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            words: ['asdf', 'jkl', 'sala', 'dada', 'fal', 'lak', 'jas', 'dal'],
            xpReward: 10,
            unlocked: true,
            order: 2,
            week: 0
        },
        {
            id: 'tutorial-vista',
            title: '4. No miris el teclat',
            intro: 'El secret de la mecanografia: mira la pantalla, mai les tecles. Al principi faràs més errors, però en poques setmanes els teus dits sabran sols on anar. Confia en la memòria muscular!',
            keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            words: ['fads', 'jall', 'sala', 'lak', 'dada', 'fjl', 'jas'],
            xpReward: 10,
            unlocked: true,
            order: 3,
            week: 0
        },
        {
            id: 'tutorial-ritme',
            title: '5. Ritme abans que velocitat',
            intro: 'És millor escriure a poc a poc i sense errors que ràpid i fent faltes. La velocitat arriba sola quan el ritme és constant. Tecleja com si fos música: cada tecla al seu temps.',
            keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            finger: 'both',
            fingerLabel: 'Tots els dits',
            words: ['sala', 'dada', 'fads', 'jall', 'lakal', 'dalla', 'sas', 'jal'],
            xpReward: 10,
            unlocked: true,
            order: 4,
            week: 0
        }
    ];

    // INSIGNE S MES DIVERTIDES I ORIGINALS (v2)
    const BADGES = [
        {
            id: 'first_lesson',
            name: 'Primer Pas',
            desc: 'Has completat la teva primera lliçó!',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>',
            color: '#FFD700',
            condition: (stats) => stats.lessonsCompleted >= 1
        },
        {
            id: 'perfect_lesson',
            name: 'Perfecció Total!',
            desc: '100% de precisió en una lliçó',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            color: '#FF6B6B',
            condition: (stats) => stats.perfectLessons >= 1
        },
        {
            id: 'speed_demon',
            name: 'Llamp!',
            desc: 'Més de 30 paraules/min',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>',
            color: '#FFE066',
            condition: (stats) => stats.maxWPM >= 30
        },
        {
            id: 'home_row_master',
            name: 'Rei de Casa',
            desc: 'Fila central dominada',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
            color: '#69DB7C',
            condition: (stats) => stats.lessonsByWeek[1] >= 3
        },
        {
            id: 'top_row_master',
            name: 'Mestre del Cel',
            desc: 'Fila superior conquerida',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
            color: '#74C0FC',
            condition: (stats) => stats.lessonsByWeek[2] >= 3
        },
        {
            id: 'bottom_row_master',
            name: 'Explorer del Fons',
            desc: 'Fila inferior dominada',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>',
            color: '#FFA94D',
            condition: (stats) => stats.lessonsByWeek[3] >= 3
        },
        {
            id: 'week_master',
            name: 'Super Campió',
            desc: 'Totes les lliçons completades!',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>',
            color: '#B197FC',
            condition: (stats) => stats.lessonsCompleted >= 12
        },
        {
            id: 'practice_100',
            name: 'Aprenent Expert',
            desc: '100 paraules practicades',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg>',
            color: '#748FFC',
            condition: (stats) => stats.totalWordsTyped >= 100
        },
        {
            id: 'practice_500',
            name: 'Mestre de la Pràctica',
            desc: '500 paraules practicades',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>',
            color: '#9775FA',
            condition: (stats) => stats.totalWordsTyped >= 500
        },
        {
            id: 'xp_500',
            name: 'Estrella Brilllant',
            desc: '500 XP acumulats',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
            color: '#FFD700',
            condition: (stats) => stats.totalXP >= 500
        },
        {
            id: 'streak_3',
            name: 'En ratxa!',
            desc: '3 dies seguits practicant',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>',
            color: '#FF922B',
            condition: (stats) => stats.currentStreak >= 3
        },
        {
            id: 'streak_7',
            name: 'Setmana de Foc!',
            desc: '7 dies seguits!',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>',
            color: '#FF6B35',
            condition: (stats) => stats.currentStreak >= 7
        },
        {
            id: 'marathon_runner',
            name: 'Maratonista',
            desc: 'Has fet un repte de 50 paraules',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>',
            color: '#20C997',
            condition: (stats) => stats.marathonCompleted >= 1
        },
        {
            id: 'speedster',
            name: 'Velocista!',
            desc: 'Més de 50 paraules/min',
            icon: '🏎️',
            color: '#F06595',
            condition: (stats) => stats.maxWPM >= 50
        }
    ];

    const CHALLENGES = [
        {
            id: 'speed_10',
            title: 'Velocista Novato',
            desc: 'Escriu 10 paraules en 60 segons',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            words: 10,
            timeLimit: 60,
            xpReward: 40,
            unlocked: true,
            bonusXP: 20,
            color: '#4ECDC4'
        },
        {
            id: 'speed_20',
            title: 'Velocista Expert',
            desc: 'Escriu 20 paraules en 60 segons',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H9V7h2v10zm4 0h-2v-4h2v4zm0-6h-2V7h2v4z"/></svg>',
            words: 20,
            timeLimit: 60,
            xpReward: 80,
            unlocked: false,
            bonusXP: 40,
            color: '#FFE066'
        },
        {
            id: 'accuracy_10',
            title: ' Tir Precís',
            desc: '10 paraules amb 100% precisió',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-7v4h4l-5 7z"/></svg>',
            words: 10,
            timeLimit: 90,
            xpReward: 60,
            accuracy: 100,
            unlocked: false,
            bonusXP: 30,
            color: '#FF6B6B'
        },
        {
            id: 'marathon',
            title: 'Marató',
            desc: 'Escriu 50 paraules!',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>',
            words: 50,
            timeLimit: 180,
            xpReward: 150,
            unlocked: false,
            bonusXP: 75,
            color: '#69DB7C'
        },
        {
            id: 'survival',
            title: 'Supervivència',
            desc: 'Escriu 30 paraules sense errors',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
            words: 30,
            timeLimit: 120,
            xpReward: 100,
            noErrors: true,
            unlocked: false,
            bonusXP: 50,
            color: '#B197FC'
        },
        {
            id: 'endless',
            title: 'Mode Infinit',
            desc: 'Escriu paraules fins que fallis!',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"/></svg>',
            words: 999,
            timeLimit: 300,
            xpReward: 200,
            endless: true,
            unlocked: false,
            bonusXP: 100,
            color: '#FF922B'
        }
    ];

    // ==========================================
    // CONSTANTS
    // ==========================================

    const XP_PER_LEVEL = 200;
    const STREAK_BONUS_XP = 10; // Extra XP per streak
    const PERFECT_LESSON_BONUS_XP = 25;

    // Virtual keyboard: key -> finger assignments (standard touch-typing layout).
    const KEYBOARD_LAYOUT = [
        [
            { key: '1', finger: 'pinky-left' },
            { key: '2', finger: 'ring-left' },
            { key: '3', finger: 'middle-left' },
            { key: '4', finger: 'index-left' },
            { key: '5', finger: 'index-left' },
            { key: '6', finger: 'index-right' },
            { key: '7', finger: 'index-right' },
            { key: '8', finger: 'middle-right' },
            { key: '9', finger: 'ring-right' },
            { key: '0', finger: 'pinky-right' }
        ],
        [
            { key: 'q', finger: 'pinky-left' },
            { key: 'w', finger: 'ring-left' },
            { key: 'e', finger: 'middle-left' },
            { key: 'r', finger: 'index-left' },
            { key: 't', finger: 'index-left' },
            { key: 'y', finger: 'index-right' },
            { key: 'u', finger: 'index-right' },
            { key: 'i', finger: 'middle-right' },
            { key: 'o', finger: 'ring-right' },
            { key: 'p', finger: 'pinky-right' }
        ],
        [
            { key: 'a', finger: 'pinky-left' },
            { key: 's', finger: 'ring-left' },
            { key: 'd', finger: 'middle-left' },
            { key: 'f', finger: 'index-left' },
            { key: 'g', finger: 'index-left' },
            { key: 'h', finger: 'index-right' },
            { key: 'j', finger: 'index-right' },
            { key: 'k', finger: 'middle-right' },
            { key: 'l', finger: 'ring-right' },
            { key: 'ñ', finger: 'pinky-right' }
        ],
        [
            { key: 'z', finger: 'pinky-left' },
            { key: 'x', finger: 'ring-left' },
            { key: 'c', finger: 'middle-left' },
            { key: 'v', finger: 'index-left' },
            { key: 'b', finger: 'index-left' },
            { key: 'n', finger: 'index-right' },
            { key: 'm', finger: 'index-right' },
            { key: ',', finger: 'middle-right' },
            { key: '.', finger: 'ring-right' },
            { key: '-', finger: 'pinky-right' }
        ],
        [
            { key: ' ', finger: 'thumb', label: 'Espai', wide: 'space' }
        ]
    ];

    const FINGER_NAMES = {
        'pinky-left':   'Dit Xic (esquerra)',
        'ring-left':    'Dit Anular (esquerra)',
        'middle-left':  'Dit Cor (esquerra)',
        'index-left':   'Dit Índex (esquerra)',
        'pinky-right':  'Dit Xic (dreta)',
        'ring-right':   'Dit Anular (dreta)',
        'middle-right': 'Dit Cor (dreta)',
        'index-right':  'Dit Índex (dreta)',
        'thumb':        'Polze',
        'both':         'Les dues mans',
        'index':        'Dit Índex'
    };

    // ==========================================
    // STATE
    // ==========================================

    let gameState = {
        currentScreen: 'home-screen',
        currentLesson: null,
        currentWordIndex: 0,
        currentLetterIndex: 0,
        words: [],
        correctCount: 0,
        wrongCount: 0,
        typedLetters: [],
        gameMode: 'lesson',
        challengeData: null,
        soundEnabled: true,
        playerName: '',
        lastPlayedDate: null,
        stats: {
            totalXP: 0,
            level: 1,
            lessonsCompleted: 0,
            perfectLessons: 0,
            totalWordsTyped: 0,
            maxWPM: 0,
            lessonsByWeek: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            badges: [],
            completedLessons: [],
            currentStreak: 0,
            marathonCompleted: 0
        }
    };

    // Timer state
    let timerInterval = null;
    let timeRemaining = 0;

    // ==========================================
    // LOCAL STORAGE
    // ==========================================

    function loadState() {
        const saved = localStorage.getItem('typingTutorState_v2');
        if (saved) {
            const parsed = JSON.parse(saved);
            gameState.stats = { ...gameState.stats, ...parsed.stats };
            gameState.playerName = parsed.playerName || '';
            gameState.soundEnabled = parsed.soundEnabled !== false;
            gameState.lastPlayedDate = parsed.lastPlayedDate || null;
            
            // Update streak
            updateStreak();
            
            // Unlock lessons based on completed ones
            LESSONS.forEach((lesson, index) => {
                if (index === 0 || index === 1) {
                    lesson.unlocked = true;
                } else {
                    lesson.unlocked = gameState.stats.completedLessons.includes(LESSONS[index - 1].id);
                }
            });
        }
    }

    function saveState() {
        localStorage.setItem('typingTutorState_v2', JSON.stringify({
            stats: gameState.stats,
            playerName: gameState.playerName,
            soundEnabled: gameState.soundEnabled,
            lastPlayedDate: gameState.lastPlayedDate
        }));
    }

    function updateStreak() {
        const today = new Date().toDateString();
        const lastPlayed = gameState.lastPlayedDate;
        
        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
                // Streak broken
                gameState.stats.currentStreak = 0;
            }
        }
    }

    function recordPlay() {
        const today = new Date().toDateString();
        const lastPlayed = gameState.lastPlayedDate;
        
        if (lastPlayed !== today) {
            const lastDate = lastPlayed ? new Date(lastPlayed) : null;
            const todayDate = new Date(today);
            
            if (lastDate) {
                const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    // Consecutive day - increase streak
                    gameState.stats.currentStreak++;
                } else if (diffDays > 1) {
                    // Streak broken
                    gameState.stats.currentStreak = 1;
                }
            } else {
                // First time playing
                gameState.stats.currentStreak = 1;
            }
            
            gameState.lastPlayedDate = today;
        }
    }

    // ==========================================
    // SOUND SYSTEM
    // ==========================================

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
    }

    function playSound(type) {
        if (!gameState.soundEnabled) return;
        
        try {
            initAudio();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            switch(type) {
                case 'correct':
                    oscillator.frequency.value = 523.25;
                    oscillator.type = 'sine';
                    gainNode.gain.value = 0.2;
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.1);
                    break;
                case 'wrong':
                    oscillator.frequency.value = 180;
                    oscillator.type = 'square';
                    gainNode.gain.value = 0.15;
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.15);
                    break;
                case 'complete':
                    playCompleteSound();
                    return;
                case 'levelup':
                    playLevelUpSound();
                    return;
                case 'badge':
                    playBadgeSound();
                    return;
                case 'countdown':
                    oscillator.frequency.value = 880;
                    oscillator.type = 'square';
                    gainNode.gain.value = 0.1;
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.1);
                    break;
            }
        } catch (e) {
            // Audio not available
        }
    }

    function playCompleteSound() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                try {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.value = 0.25;
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.2);
                } catch (e) {}
            }, i * 120);
        });
    }

    function playLevelUpSound() {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                try {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.value = 0.25;
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.25);
                } catch (e) {}
            }, i * 150);
        });
    }

    function playBadgeSound() {
        setTimeout(() => {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
            } catch (e) {}
        }, 0);
        setTimeout(() => {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 1100;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
            } catch (e) {}
        }, 150);
        setTimeout(() => {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 1320;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            } catch (e) {}
        }, 300);
    }

    // ==========================================
    // VISUAL EFFECTS
    // ==========================================

    function createConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE066', '#69DB7C', '#B197FC', '#F06595'];
        const container = document.getElementById('app');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 9999;
                pointer-events: none;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            `;
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    function createParticleFeedback(x, y, correct) {
        const colors = correct ? ['#69DB7C', '#51CF66', '#2F9E44'] : ['#FF6B6B', '#FA5252', '#E03131'];
        const container = document.getElementById('app');
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                z-index: 9999;
                pointer-events: none;
                animation: particleBurst 0.5s ease-out forwards;
            `;
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = 50 + Math.random() * 50;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 500);
        }
    }

    // ==========================================
    // NAVIGATION
    // ==========================================

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        gameState.currentScreen = screenId;
    }

    function setupNavigation() {
        document.querySelectorAll('[data-screen]').forEach(btn => {
            btn.addEventListener('click', () => {
                showScreen(btn.dataset.screen);
            });
        });
    }

    // ==========================================
    // RENDER FUNCTIONS
    // ==========================================

    function renderHomeStats() {
        document.getElementById('home-xp').textContent = gameState.stats.totalXP;
        document.getElementById('home-level').textContent = gameState.stats.level;
        document.getElementById('home-badges').textContent = gameState.stats.badges.length;
        
        // Render streak
        const streakEl = document.getElementById('home-streak');
        if (streakEl) {
            streakEl.textContent = gameState.stats.currentStreak;
        }
        
        // Update sound toggle
        const soundOn = document.querySelector('.sound-on');
        const soundOff = document.querySelector('.sound-off');
        if (gameState.soundEnabled) {
            soundOn.classList.remove('hidden');
            soundOff.classList.add('hidden');
        } else {
            soundOn.classList.add('hidden');
            soundOff.classList.remove('hidden');
        }
        
        // Update level progress bar
        const progressBar = document.getElementById('level-progress');
        if (progressBar) {
            const xpInLevel = gameState.stats.totalXP % XP_PER_LEVEL;
            const progress = (xpInLevel / XP_PER_LEVEL) * 100;
            progressBar.style.width = progress + '%';
            document.getElementById('level-xp-current').textContent = xpInLevel;
            document.getElementById('level-xp-max').textContent = XP_PER_LEVEL;
        }
    }

    function renderLessonsGrid() {
        const grid = document.getElementById('lessons-grid');
        grid.innerHTML = '';
        
        LESSONS.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            if (lesson.unlocked) card.classList.add('unlocked');
            if (gameState.stats.completedLessons.includes(lesson.id)) {
                card.classList.add('completed');
            }
            
            const progress = gameState.stats.completedLessons.includes(lesson.id) ? 100 : 0;
            
            card.innerHTML = `
                <div class="lesson-card-week">Setmana ${lesson.week}</div>
                <h3 class="lesson-card-title">${lesson.title}</h3>
                <div class="lesson-card-keys">
                    ${(lesson.keys === 'all' ? 'TOT' : lesson.keys.map(k => `<span class="lesson-key">${k.toUpperCase()}</span>`).join(''))}
                </div>
                <div class="lesson-card-progress">
                    <div class="lesson-progress-bar">
                        <div class="lesson-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="lesson-progress-text">${progress}%</span>
                </div>
                ${!lesson.unlocked ? '<span class="lesson-lock-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></span>' : ''}
                ${gameState.stats.completedLessons.includes(lesson.id) ? '<span class="lesson-complete-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>' : ''}
            `;
            
            if (lesson.unlocked) {
                card.addEventListener('click', (function(l) {
                    return function() { startLesson(l); };
                })(lesson));
            }
            
            grid.appendChild(card);
        });
        
        document.getElementById('lesson-xp').textContent = gameState.stats.totalXP;
    }

    function renderTutorialsGrid() {
        const grid = document.getElementById('tutorials-grid');
        if (!grid) return;
        grid.innerHTML = '';
        TUTORIAL_STEPS.forEach(step => {
            const card = document.createElement('div');
            card.className = 'tutorial-card';
            card.innerHTML = `
                <h3 class="tutorial-card-title">${step.title}</h3>
                <p class="tutorial-card-intro">${step.intro}</p>
                <div class="tutorial-card-cta">Comença <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg></div>
            `;
            card.addEventListener('click', () => startTutorial(step));
            grid.appendChild(card);
        });
    }

    function renderChallenges() {
        const list = document.getElementById('challenges-list');
        list.innerHTML = '';
        
        // Calculate which challenges are unlocked
        CHALLENGES[1].unlocked = gameState.stats.totalWordsTyped >= 50;
        CHALLENGES[2].unlocked = gameState.stats.lessonsCompleted >= 3;
        CHALLENGES[3].unlocked = gameState.stats.totalWordsTyped >= 200;
        CHALLENGES[4].unlocked = gameState.stats.totalWordsTyped >= 100;
        CHALLENGES[5].unlocked = gameState.stats.lessonsCompleted >= 5;
        
        CHALLENGES.forEach(challenge => {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            if (!challenge.unlocked) card.classList.add('locked');
            
            card.innerHTML = `
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h3 class="challenge-title">${challenge.title}</h3>
                    <p class="challenge-desc">${challenge.desc}</p>
                    <div class="challenge-meta">
                        <span class="challenge-time">${challenge.timeLimit}s</span>
                        <span class="challenge-words">${challenge.words > 100 ? 'Infinit' : challenge.words + ' paraules'}</span>
                    </div>
                </div>
                <div class="challenge-reward">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <span>${challenge.xpReward}</span>
                    ${challenge.bonusXP ? `<span class="bonus-xp">+${challenge.bonusXP}</span>` : ''}
                </div>
            `;
            
            if (challenge.unlocked) {
                card.addEventListener('click', (function(c) {
                    return function() { startChallenge(c); };
                })(challenge));
            }
            
            list.appendChild(card);
        });
    }

    function renderPracticeOptions() {
        document.querySelectorAll('.practice-card').forEach(card => {
            card.addEventListener('click', () => {
                const practiceType = card.dataset.practice;
                startPractice(practiceType);
            });
        });
    }

    // ==========================================
    // GAME LOGIC
    // ==========================================

    function startLesson(lesson) {
        clearTimer();
        gameState.gameMode = 'lesson';
        gameState.currentLesson = lesson;
        gameState.currentWordIndex = 0;
        gameState.currentLetterIndex = 0;
        gameState.words = [...lesson.words];
        gameState.correctCount = 0;
        gameState.wrongCount = 0;
        gameState.typedLetters = [];
        
        recordPlay();
        showScreen('game-screen');
        showLessonIntro(lesson);
    }

    function showLessonIntro(lesson, onDismiss) {
        const intro = document.getElementById('lesson-intro');
        if (!intro) {
            renderGame();
            if (onDismiss) onDismiss();
            return;
        }
        intro.querySelector('.intro-title').textContent = lesson.title;
        intro.querySelector('.intro-text').textContent = lesson.intro || 'Posa a prova les teves habilitats!';
        intro.classList.add('active');

        const btn = document.getElementById('intro-continue');
        const dismissed = { done: false };
        const dismiss = () => {
            if (dismissed.done) return;
            dismissed.done = true;
            intro.classList.remove('active');
            renderGame();
            if (onDismiss) onDismiss();
        };
        if (btn) btn.onclick = dismiss;
    }

    function startTutorial(step) {
        clearTimer();
        gameState.gameMode = 'tutorial';
        gameState.currentLesson = step;
        gameState.currentWordIndex = 0;
        gameState.currentLetterIndex = 0;
        gameState.words = [...step.words];
        gameState.correctCount = 0;
        gameState.wrongCount = 0;
        gameState.typedLetters = [];

        recordPlay();
        showScreen('game-screen');
        showLessonIntro(step);
    }

    function startPractice(type) {
        clearTimer();
        gameState.gameMode = 'practice';
        gameState.currentLesson = {
            title: getPracticeTitle(type),
            keys: type === 'all' ? 'all' : getPracticeKeys(type),
            intro: 'Practica tot el que vulguis!'
        };
        gameState.currentWordIndex = 0;
        gameState.currentLetterIndex = 0;
        gameState.words = generatePracticeWords(type, 15);
        gameState.correctCount = 0;
        gameState.wrongCount = 0;
        gameState.typedLetters = [];
        
        recordPlay();
        showScreen('game-screen');
        renderGame();
    }

    function startChallenge(challenge) {
        clearTimer();
        gameState.gameMode = 'challenge';
        gameState.challengeData = challenge;
        gameState.currentLesson = {
            title: challenge.title,
            keys: 'all',
            intro: challenge.desc
        };
        gameState.currentWordIndex = 0;
        gameState.currentLetterIndex = 0;
        gameState.words = generateChallengeWords(challenge.words);
        gameState.correctCount = 0;
        gameState.wrongCount = 0;
        gameState.typedLetters = [];
        
        timeRemaining = challenge.timeLimit;

        recordPlay();
        showScreen('game-screen');
        showLessonIntro(gameState.currentLesson, () => startTimer());
    }

    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            
            if (timeRemaining <= 5 && timeRemaining > 0) {
                playSound('countdown');
            }
            
            if (timeRemaining <= 0) {
                clearTimer();
                endGame(true);
            }
        }, 1000);
    }

    function clearTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTimerDisplay() {
        const timerEl = document.getElementById('timer-display');
        if (timerEl) {
            timerEl.textContent = timeRemaining;
            timerEl.className = 'timer-display';
            if (timeRemaining <= 10) {
                timerEl.classList.add('warning');
            }
            if (timeRemaining <= 5) {
                timerEl.classList.add('critical');
            }
        }
        
        // Update progress bar
        const progressBar = document.getElementById('timer-bar');
        if (progressBar && gameState.challengeData) {
            const progress = (timeRemaining / gameState.challengeData.timeLimit) * 100;
            progressBar.style.width = progress + '%';
        }
    }

    function getPracticeTitle(type) {
        const titles = {
            'home-row': 'Pràctica: Fila Central',
            'top-row': 'Pràctica: Fila Superior',
            'bottom-row': 'Pràctica: Fila Inferior',
            'numbers': 'Pràctica: Números',
            'all': 'Pràctica Lliure'
        };
        return titles[type] || 'Pràctica';
    }

    function getPracticeKeys(type) {
        const keys = {
            'home-row': ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            'top-row': ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            'bottom-row': ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            'numbers': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        };
        return keys[type] || [];
    }

    function generatePracticeWords(type, count) {
        const allPracticeWords = [
            'sala', 'dada', 'fals', 'jocs', 'kasal', 'terra', 'puerto',
            'rata', 'equipo', 'cavall', 'nena', 'bici', 'gos', 'gat', 'sol',
            'flor', 'casa', 'lluna', 'estel', 'arbre', 'cotxe',
            'piu', 'yupi', 'zebra', 'caca', 'nom', 'noi', 'mono',
            '12', '34', '56', '78', '90', '11', '22'
        ];

        let pool;
        if (type === 'all') {
            pool = allPracticeWords.slice();
        } else {
            const allowedKeys = getPracticeKeys(type);
            pool = allPracticeWords.filter(word =>
                [...word].every(char => allowedKeys.includes(char.toLowerCase()))
            );
            // Fall back to key-only drills when the filtered pool is thin
            if (pool.length < 4) {
                const drills = [];
                for (let i = 0; i < allowedKeys.length; i++) {
                    drills.push(allowedKeys[i] + allowedKeys[i] + allowedKeys[i]);
                    for (let j = i + 1; j < allowedKeys.length; j++) {
                        drills.push(allowedKeys[i] + allowedKeys[j]);
                        drills.push(allowedKeys[j] + allowedKeys[i] + allowedKeys[j]);
                    }
                }
                pool = pool.concat(drills);
            }
        }

        if (pool.length === 0) return [];
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return words;
    }

    function generateChallengeWords(count) {
        const words = [
            'gat', 'gos', 'sol', 'lluna', 'estel', 'arbre', 'flor', 'casa',
            'cotxe', 'bici', 'tren', 'taula', 'cadira', 'llibre',
            'sala', 'dada', 'terra', 'puerto', 'rata', 'nena', 'noi',
            'poma', 'pera', 'platan', 'llapis', 'sol', 'lluna'
        ];
        
        if (count >= 999) {
            // Endless mode
            const result = [];
            while (result.length < 50) {
                result.push(words[Math.floor(Math.random() * words.length)]);
            }
            return result;
        }
        
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(words[Math.floor(Math.random() * words.length)]);
        }
        return result;
    }

    function renderGame() {
        document.getElementById('current-lesson-name').textContent = gameState.currentLesson.title;
        document.getElementById('correct-count').textContent = gameState.correctCount;
        document.getElementById('wrong-count').textContent = gameState.wrongCount;
        document.getElementById('game-xp').textContent = calculateXP();
        
        const total = gameState.currentWordIndex + 1;
        const lessonWords = gameState.words.length;
        document.getElementById('lesson-progress').textContent = `${total}/${lessonWords}`;
        
        // Update progress bar
        const progress = (gameState.currentWordIndex / lessonWords) * 100;
        document.getElementById('game-progress-fill').style.width = progress + '%';
        
        // Show/hide timer based on mode
        const timerContainer = document.getElementById('timer-container');
        if (timerContainer) {
            timerContainer.style.display = gameState.gameMode === 'challenge' ? 'flex' : 'none';
        }
        
        renderWord();
        renderFingerHint();
        updateKeyboardHighlights();
    }

    function calculateXP() {
        const baseXP = gameState.correctCount * 2;
        const streakBonus = Math.min(gameState.stats.currentStreak, 5) * STREAK_BONUS_XP;
        return baseXP + streakBonus;
    }

    function renderWord() {
        const word = gameState.words[gameState.currentWordIndex];
        const wordDisplay = document.getElementById('current-word');
        wordDisplay.innerHTML = '';
        
        [...word].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u2423' : char.toUpperCase();
            if (index < gameState.currentLetterIndex) {
                const typed = gameState.typedLetters[index];
                span.className = typed.correct ? 'correct' : 'wrong';
                if (!typed.correct) span.dataset.typed = typed.char === ' ' ? '\u2423' : typed.char;
            } else if (index === gameState.currentLetterIndex) {
                span.className = 'current';
            }
            wordDisplay.appendChild(span);
        });
        
        // Update word progress bar
        const progress = word ? (gameState.currentLetterIndex / word.length) * 100 : 0;
        document.getElementById('word-progress-fill').style.width = progress + '%';
        
        renderTypedLetters();
    }

    function renderTypedLetters() {
        const container = document.getElementById('typed-letters');
        container.innerHTML = '';
        
        const startIdx = Math.max(0, gameState.currentWordIndex - 4);
        for (let i = startIdx; i < gameState.currentWordIndex; i++) {
            const word = gameState.words[i];
            const wordDiv = document.createElement('div');
            wordDiv.className = 'typed-word';
            wordDiv.textContent = word.toUpperCase();
            container.appendChild(wordDiv);
        }
    }

    function renderFingerHint() {
        const word = gameState.words[gameState.currentWordIndex];
        const currentChar = word ? word[gameState.currentLetterIndex]?.toLowerCase() : '';

        let finger = 'index-left';
        if (currentChar === ' ') {
            finger = 'thumb';
        } else if (currentChar) {
            KEYBOARD_LAYOUT.forEach(row => {
                row.forEach(keyData => {
                    if (keyData.key === currentChar) {
                        finger = keyData.finger;
                    }
                });
            });
        }

        const fingerLabel = document.getElementById('finger-label');
        if (fingerLabel) {
            fingerLabel.textContent = FINGER_NAMES[finger] || 'Dit Índex';
        }

        // Reset all active/inactive state
        document.querySelectorAll('.finger').forEach(f => f.classList.remove('active'));
        document.querySelectorAll('.ah-finger').forEach(f => f.classList.remove('active'));
        document.querySelectorAll('.finger-hand').forEach(fh => fh.classList.remove('inactive'));
        document.querySelectorAll('.animated-hand').forEach(ah => ah.classList.remove('inactive'));

        const fingerClass = finger.includes('index') ? 'index' :
                           finger.includes('middle') ? 'middle' :
                           finger.includes('ring') ? 'ring' :
                           finger.includes('pinky') ? 'pinky' :
                           finger.includes('thumb') ? 'thumb' : 'index';

        // Hand scope: space uses either thumb — default to right.
        const hand = finger.includes('left') ? 'left' :
                     finger.includes('right') ? 'right' :
                     'right';

        const activeSide = hand === 'left' ? 'left' : 'right';
        const inactiveSide = activeSide === 'left' ? 'right' : 'left';

        // Top hint display: hide the inactive hand, light up the finger on the active one.
        document.querySelector('.finger-hand-' + inactiveSide)?.classList.add('inactive');
        document.querySelectorAll(`.finger-hand-${activeSide} .finger-${fingerClass}`)
            .forEach(f => f.classList.add('active'));

        // Lower animated hands: same treatment.
        document.querySelector('.animated-hand.hand-' + inactiveSide)?.classList.add('inactive');
        document.querySelectorAll(`.animated-hand.hand-${activeSide} .ah-${fingerClass}`)
            .forEach(f => f.classList.add('active'));
    }

    function renderKeyboard() {
        const kb = document.getElementById('keyboard');
        if (!kb) return;
        kb.innerHTML = '';
        KEYBOARD_LAYOUT.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'keyboard-row';
            row.forEach(keyData => {
                const keyEl = document.createElement('div');
                const fingerBase = keyData.finger.split('-')[0];
                keyEl.className = 'key finger-' + fingerBase;
                keyEl.dataset.key = keyData.key;
                if (keyData.wide === 'space') {
                    keyEl.classList.add('space');
                    keyEl.textContent = keyData.label || '';
                } else {
                    keyEl.textContent = keyData.key.toUpperCase();
                }
                rowEl.appendChild(keyEl);
            });
            kb.appendChild(rowEl);
        });
    }

    function updateKeyboardHighlights() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('target');
        });
        
        if (gameState.currentWordIndex < gameState.words.length) {
            const word = gameState.words[gameState.currentWordIndex];
            const currentChar = word ? word[gameState.currentLetterIndex]?.toLowerCase() : '';
            
            if (currentChar) {
                document.querySelectorAll('.key').forEach(key => {
                    if (key.dataset.key === currentChar) {
                        key.classList.add('target');
                    }
                });
            }
        }
    }

    const keyLabel = (c) => c === ' ' ? 'Espai' : (c || '').toUpperCase();

    function showPressedKey(pressed, expected, correct) {
        const box = document.getElementById('pressed-key');
        if (!box) return;
        box.className = 'pressed-key show ' + (correct ? 'ok' : 'bad');
        box.innerHTML = '<span class="pk-label">Has premut</span>' +
            '<span class="pk-char">' + keyLabel(pressed) + '</span>' +
            (correct ? '' : '<span class="pk-expected">calia <b>' + keyLabel(expected) + '</b></span>');
        clearTimeout(showPressedKey._t);
        showPressedKey._t = setTimeout(() => box.classList.remove('show'), 1600);
    }

    function handleKeyPress(keyPressed) {
        if (gameState.currentWordIndex >= gameState.words.length) return;
        
        const word = gameState.words[gameState.currentWordIndex];
        const expectedChar = word ? word[gameState.currentLetterIndex]?.toLowerCase() : '';
        
        // Visual feedback: show the letter actually pressed (big badge + keyboard flash)
        const pressedLower = keyPressed.toLowerCase();
        const isCorrect = pressedLower === expectedChar;
        showPressedKey(keyPressed, expectedChar, isCorrect);
        document.querySelectorAll('.key').forEach(key => {
            if (key.dataset.key === pressedLower) {
                const cls = isCorrect ? 'pressed-ok' : 'pressed-bad';
                key.classList.remove('pressed-ok', 'pressed-bad');
                void key.offsetWidth;
                key.classList.add('pressed', cls);
                setTimeout(() => key.classList.remove('pressed'), 120);
                setTimeout(() => key.classList.remove(cls), 450);
            }
        });
        
        if (keyPressed.toLowerCase() === expectedChar) {
            gameState.typedLetters.push({ char: keyPressed, correct: true });
            gameState.currentLetterIndex++;
            gameState.correctCount++;
            playSound('correct');
            
            // Particle effect
            createParticleFeedback(window.innerWidth / 2, window.innerHeight / 2, true);
            
            if (gameState.currentLetterIndex >= word.length) {
                gameState.currentWordIndex++;
                gameState.currentLetterIndex = 0;
                gameState.typedLetters = [];
                
                // Check for lesson complete
                if (gameState.currentWordIndex >= gameState.words.length) {
                    clearTimer();
                    setTimeout(() => endGame(true), 500);
                }
            }
        } else {
            // Wrong!
            gameState.typedLetters.push({ char: keyPressed, correct: false });
            gameState.wrongCount++;
            gameState.currentLetterIndex++; // Move forward for kids
            playSound('wrong');

            // Particle effect (error)
            createParticleFeedback(window.innerWidth / 2, window.innerHeight / 2, false);

            // Survival / endless end on any mistake — short-circuit before word/lesson completion.
            if (gameState.challengeData && (gameState.challengeData.noErrors || gameState.challengeData.endless)) {
                clearTimer();
                setTimeout(() => endGame(false), 500);
                renderGame();
                return;
            }

            if (gameState.currentLetterIndex >= word.length) {
                gameState.currentWordIndex++;
                gameState.currentLetterIndex = 0;
                gameState.typedLetters = [];

                if (gameState.currentWordIndex >= gameState.words.length) {
                    clearTimer();
                    setTimeout(() => endGame(true), 500);
                }
            }
        }
        
        renderGame();
    }

    function endGame(success) {
        clearTimer();
        
        const totalWords = gameState.words.length;
        const totalChars = gameState.correctCount + gameState.wrongCount;
        const accuracy = totalChars > 0 ? Math.round((gameState.correctCount / totalChars) * 100) : 0;
        
        // Calculate base XP
        let xpEarned = Math.round(gameState.correctCount * 2);
        
        // Add streak bonus
        xpEarned += Math.min(gameState.stats.currentStreak, 5) * STREAK_BONUS_XP;
        
        // Add perfect lesson bonus
        if (accuracy === 100) {
            xpEarned += PERFECT_LESSON_BONUS_XP;
        }
        
        // Challenge completion bonus
        if (gameState.gameMode === 'challenge' && success) {
            xpEarned += gameState.challengeData.bonusXP || 0;
        }
        
        // Update stats
        const oldLevel = gameState.stats.level;
        gameState.stats.totalXP += xpEarned;
        gameState.stats.totalWordsTyped += totalWords;
        gameState.stats.level = Math.floor(gameState.stats.totalXP / XP_PER_LEVEL) + 1;
        
        // Check for level up
        if (gameState.stats.level > oldLevel) {
            playLevelUpSound();
        }
        
        if (accuracy === 100) {
            gameState.stats.perfectLessons++;
        }
        
        // Calculate WPM
        const elapsedMinutes = gameState.challengeData ? (gameState.challengeData.timeLimit - timeRemaining) / 60 : totalWords / 5;
        const wpm = Math.round((gameState.correctCount / 5) / Math.max(elapsedMinutes, 0.5));
        if (wpm > gameState.stats.maxWPM) {
            gameState.stats.maxWPM = wpm;
        }
        
        // Mark lesson complete
        if (gameState.gameMode === 'lesson' && gameState.currentLesson) {
            const lesson = gameState.currentLesson;
            if (!gameState.stats.completedLessons.includes(lesson.id)) {
                gameState.stats.completedLessons.push(lesson.id);
                gameState.stats.lessonsCompleted++;
                gameState.stats.lessonsByWeek[lesson.week]++;
                
                const lessonIndex = LESSONS.findIndex(l => l.id === lesson.id);
                if (lessonIndex < LESSONS.length - 1) {
                    LESSONS[lessonIndex + 1].unlocked = true;
                }
            }
        }
        
        // Marathon check
        if (gameState.gameMode === 'challenge' && gameState.challengeData.id === 'marathon') {
            gameState.stats.marathonCompleted++;
        }
        
        // Check for badges
        const newBadge = checkBadges();
        
        saveState();
        
        // Show confetti for good results
        if (accuracy >= 80 || success) {
            createConfetti();
        }
        
        showResults(accuracy, wpm, xpEarned, newBadge);
    }

    function checkBadges() {
        for (const badge of BADGES) {
            if (!gameState.stats.badges.includes(badge.id) && badge.condition(gameState.stats)) {
                gameState.stats.badges.push(badge.id);
                return badge;
            }
        }
        return null;
    }

    function showResults(accuracy, wpm, xpEarned, newBadge) {
        document.getElementById('result-accuracy').textContent = accuracy + '%';
        document.getElementById('result-speed').textContent = wpm;
        document.getElementById('result-xp').textContent = '+' + xpEarned;
        
        // XP breakdown
        const xpBreakdown = document.getElementById('xp-breakdown');
        if (xpBreakdown) {
            const streakBonus = Math.min(gameState.stats.currentStreak, 5) * STREAK_BONUS_XP;
            let breakdownHTML = `<span class="xp-base">Base: ${gameState.correctCount * 2}</span>`;
            if (streakBonus > 0) breakdownHTML += `<span class="xp-streak">Racha: +${streakBonus}</span>`;
            if (accuracy === 100) breakdownHTML += `<span class="xp-perfect">Perfecte: +${PERFECT_LESSON_BONUS_XP}</span>`;
            xpBreakdown.innerHTML = breakdownHTML;
        }
        
        // Set result message
        const icon = document.getElementById('results-icon');
        const title = document.getElementById('results-title');
        const subtitle = document.getElementById('results-subtitle');
        
        // SVG icons for results
        const svgStar = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
        const svgClap = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>';
        const svgTrophy = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/></svg>';
        const svgRetry = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
        
        if (accuracy >= 90) {
            icon.innerHTML = svgStar;
            title.textContent = 'Incredible!';
            subtitle.textContent = 'Ets un crack absolut!';
            playCompleteSound();
        } else if (accuracy >= 70) {
            icon.innerHTML = svgTrophy;
            title.textContent = 'Molt Be!';
            subtitle.textContent = 'Segueix aixi!';
        } else if (success) {
            icon.innerHTML = svgClap;
            title.textContent = 'Bon Intent!';
            subtitle.textContent = 'Practica mes i milloraràs!';
        } else {
            icon.innerHTML = svgRetry;
            title.textContent = 'Game Over';
            subtitle.textContent = 'No et rendeixis, torna a provar!';
        }
        
        // Show new badge
        const badgeContainer = document.getElementById('new-badge-container');
        if (newBadge) {
            badgeContainer.style.display = 'block';
            document.getElementById('new-badge-icon').innerHTML = newBadge.icon;
            document.getElementById('new-badge-name').textContent = newBadge.name;
            playBadgeSound();
            showBadgeModal(newBadge);
        } else {
            badgeContainer.style.display = 'none';
        }
        
        // Update next lesson button
        const nextLessonBtn = document.getElementById('btn-next-lesson');
        if (nextLessonBtn) {
            const nextLabel = nextLessonBtn.querySelector('span') || nextLessonBtn;
            if (gameState.gameMode === 'lesson' && gameState.currentLesson) {
                const lessonIndex = LESSONS.findIndex(l => l.id === gameState.currentLesson.id);
                if (lessonIndex < LESSONS.length - 1 && LESSONS[lessonIndex + 1].unlocked) {
                    nextLessonBtn.style.display = 'block';
                    nextLabel.textContent = 'Següent Lliçó';
                    nextLessonBtn.onclick = () => startLesson(LESSONS[lessonIndex + 1]);
                } else {
                    nextLessonBtn.style.display = 'none';
                }
            } else if (gameState.gameMode === 'tutorial' && gameState.currentLesson) {
                const stepIndex = TUTORIAL_STEPS.findIndex(s => s.id === gameState.currentLesson.id);
                if (stepIndex !== -1 && stepIndex < TUTORIAL_STEPS.length - 1) {
                    nextLessonBtn.style.display = 'block';
                    nextLabel.textContent = 'Següent pas';
                    nextLessonBtn.onclick = () => startTutorial(TUTORIAL_STEPS[stepIndex + 1]);
                } else {
                    nextLessonBtn.style.display = 'none';
                }
            } else {
                nextLessonBtn.style.display = 'none';
            }
        }
        
        document.getElementById('btn-retry').onclick = () => {
            if (gameState.gameMode === 'lesson') {
                startLesson(gameState.currentLesson);
            } else if (gameState.gameMode === 'tutorial') {
                startTutorial(gameState.currentLesson);
            } else if (gameState.gameMode === 'practice') {
                startPractice('all');
            } else {
                startChallenge(gameState.challengeData);
            }
        };
        
        showScreen('results-screen');
    }

    function showBadgeModal(badge) {
        document.getElementById('badge-modal-icon').innerHTML = badge.icon;
        document.getElementById('badge-modal-name').textContent = badge.name;
        document.getElementById('badge-modal-desc').textContent = badge.desc;
        document.getElementById('badge-modal-icon').style.background = badge.color;
        document.getElementById('badge-modal').classList.add('active');
        
        document.getElementById('badge-modal-close').onclick = () => {
            document.getElementById('badge-modal').classList.remove('active');
        };
    }

    // ==========================================
    // FULLSCREEN
    // ==========================================

    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function toggleFullscreen() {
        const el = document.documentElement;
        if (!isFullscreen()) {
            const req = el.requestFullscreen || el.webkitRequestFullscreen;
            if (req) req.call(el).catch(() => {});
        } else {
            const exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (exit) exit.call(document).catch(() => {});
        }
    }

    function updateFullscreenIcon() {
        const btn = document.getElementById('fullscreen-toggle');
        if (!btn) return;
        const fs = isFullscreen();
        btn.querySelector('.fs-enter')?.classList.toggle('hidden', fs);
        btn.querySelector('.fs-exit')?.classList.toggle('hidden', !fs);
        btn.title = fs ? 'Sortir de pantalla completa' : 'Pantalla completa';
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    function setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (gameState.currentScreen !== 'game-screen') return;
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                handleKeyPress(e.key);
            }
        });
        
        document.getElementById('sound-toggle').addEventListener('click', () => {
            gameState.soundEnabled = !gameState.soundEnabled;
            saveState();
            renderHomeStats();
        });

        document.getElementById('fullscreen-toggle')?.addEventListener('click', toggleFullscreen);
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
        
        renderPracticeOptions();
        
        const nameModal = document.getElementById('name-modal');
        document.getElementById('name-save').addEventListener('click', () => {
            const name = document.getElementById('player-name').value.trim();
            if (name) {
                gameState.playerName = name;
                saveState();
                nameModal.classList.remove('active');
            }
        });
        
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('name-save').click();
            }
        });
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function init() {
        loadState();
        setupNavigation();
        setupEventListeners();
        
        if (!gameState.playerName) {
            document.getElementById('name-modal').classList.add('active');
        }
        
        renderHomeStats();
        renderLessonsGrid();
        renderChallenges();
        renderTutorialsGrid();
        renderKeyboard();

        showScreen('home-screen');
    }

    document.addEventListener('DOMContentLoaded', init);
})();