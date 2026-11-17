/*
 * Mode Adult — pràctica amb textos llargs, estil "guitar hero" de mecanografia.
 *
 * Independent de app.js: només comparteix la navegació per `data-screen`
 * (gestionada a app.js) i el DOM de index.html. Té el seu propi estat,
 * persistit a localStorage amb la clau `typingTutorAdult_v1` (i els llibres
 * importats a `typingTutorAdult_v1_book_<id>`).
 *
 * Funcionalitats:
 *  - Modes Flux (fantasma objectiu o millor marca), Ritme i Progressiu.
 *  - Pausa (Esc / botó / automàtica en canviar de finestra).
 *  - Estadístiques persistents per tecla i per transició (bigrama) i
 *    entrenament adaptatiu a partir dels punts febles.
 *  - Resultats amb transicions lentes, mapa de calor del teclat i repetició
 *    del fragment més difícil.
 *  - Ajudes visuals graduables, teclats Mac ES / Windows ES / US.
 *  - Biblioteca: importar .txt o .epub i practicar-los per seccions.
 *  - Exercicis temàtics i panell de progrés amb objectiu diari.
 */
(function () {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const STORE_KEY = 'typingTutorAdult_v1';

    // ==========================================
    // DITS
    // ==========================================
    const LANES = ['lp', 'lr', 'lm', 'li', 'th', 'ri', 'rm', 'rr', 'rp'];
    const FINGER = {
        lp: { name: 'Xic esquerre',    short: 'Xic',   color: '#ff6b9d' },
        lr: { name: 'Anular esquerre', short: 'Anul.', color: '#ff9f43' },
        lm: { name: 'Cor esquerre',    short: 'Cor',   color: '#fecA57' },
        li: { name: 'Índex esquerre',  short: 'Índex', color: '#26de81' },
        th: { name: 'Polze',           short: 'Polze', color: '#45aaf2' },
        ri: { name: 'Índex dret',      short: 'Índex', color: '#26de81' },
        rm: { name: 'Cor dret',        short: 'Cor',   color: '#fecA57' },
        rr: { name: 'Anular dret',     short: 'Anul.', color: '#ff9f43' },
        rp: { name: 'Xic dret',        short: 'Xic',   color: '#ff6b9d' }
    };
    const isLeft = (f) => f && f[0] === 'l';

    // ==========================================
    // DISPOSICIONS DE TECLAT
    // [normal, shift, dit, opcions]  o  {id, label, w, f, mod}
    // ==========================================
    const L = (n, s, f, o) => [n, s, f, o || {}];
    const ES_LETTERS = {
        r1: [L('q', 'Q', 'lp'), L('w', 'W', 'lr'), L('e', 'E', 'lm'), L('r', 'R', 'li'), L('t', 'T', 'li'),
            L('y', 'Y', 'ri'), L('u', 'U', 'ri'), L('i', 'I', 'rm'), L('o', 'O', 'rr'), L('p', 'P', 'rp')],
        r2: [L('a', 'A', 'lp'), L('s', 'S', 'lr'), L('d', 'D', 'lm'), L('f', 'F', 'li', { bump: true }), L('g', 'G', 'li'),
            L('h', 'H', 'ri'), L('j', 'J', 'ri', { bump: true }), L('k', 'K', 'rm'), L('l', 'L', 'rr')],
        r3: [L('z', 'Z', 'lp'), L('x', 'X', 'lr'), L('c', 'C', 'lm'), L('v', 'V', 'li'), L('b', 'B', 'li'),
            L('n', 'N', 'ri'), L('m', 'M', 'ri')]
    };
    const ES_TOP = [L('º', 'ª', 'lp'), L('1', '!', 'lp'), L('2', '"', 'lr'), L('3', '·', 'lm'), L('4', '$', 'li'),
        L('5', '%', 'li'), L('6', '&', 'ri'), L('7', '/', 'ri'), L('8', '(', 'rm'), L('9', ')', 'rr'),
        L('0', '=', 'rp'), L("'", '?', 'rp'), L('¡', '¿', 'rp')];
    const MAC_BOTTOM = [
        { id: 'fn', label: 'fn', sub: '🌐︎', w: 1, mod: 'left' },
        { id: 'ctrl', label: 'control', sub: '⌃', w: 1, mod: 'left' },
        { id: 'optL', label: 'option', sub: '⌥', w: 1, mod: 'left' },
        { id: 'cmdL', label: 'command', sub: '⌘', w: 1.25, mod: 'left' },
        { id: 'space', label: '', w: 5, f: 'th' },
        { id: 'cmdR', label: 'command', sub: '⌘', w: 1.25, mod: 'left' },
        { id: 'optR', label: 'option', sub: '⌥', w: 1, mod: 'left' },
        { id: 'arrows', label: '', w: 3, arrows: true }
    ];

    const LAYOUTS = {
        'mac-es': {
            name: 'Mac espanyol (ISO)', rpHome: 'Ñ', dead: true,
            rows: [
                [...ES_TOP, { id: 'bksp', label: 'delete', w: 1.5, f: 'rp', mod: 'right' }],
                [{ id: 'tab', label: 'tab', w: 1.5, f: 'lp', mod: 'left' }, ...ES_LETTERS.r1,
                    L('`', '^', 'rp', { dead: true, id: 'grave' }), L('+', '*', 'rp'),
                    { id: 'ret', label: '', w: 1, f: 'rp', cls: 'ret-top' }],
                [{ id: 'caps', label: 'caps lock', w: 1.75, f: 'lp', mod: 'left' }, ...ES_LETTERS.r2, L('ñ', 'Ñ', 'rp'),
                    L('´', '¨', 'rp', { dead: true, id: 'acute' }), L('ç', 'Ç', 'rp'),
                    { id: 'ret2', label: 'return', w: 0.75, f: 'rp', cls: 'ret-bottom', alias: 'ret' }],
                [{ id: 'shiftL', label: 'shift', w: 1.25, f: 'lp', mod: 'left' }, L('<', '>', 'lp'), ...ES_LETTERS.r3,
                    L(',', ';', 'rm'), L('.', ':', 'rr'), L('-', '_', 'rp'),
                    { id: 'shiftR', label: 'shift', w: 2.25, f: 'rp', mod: 'right' }],
                MAC_BOTTOM
            ]
        },
        'win-es': {
            name: 'Windows espanyol', rpHome: 'Ñ', dead: true,
            rows: [
                [...ES_TOP, { id: 'bksp', label: '⟵', w: 1.5, f: 'rp', mod: 'right' }],
                [{ id: 'tab', label: 'tab ⇥', w: 1.5, f: 'lp', mod: 'left' }, ...ES_LETTERS.r1,
                    L('`', '^', 'rp', { dead: true, id: 'grave' }), L('+', '*', 'rp'),
                    { id: 'ret', label: '', w: 1, f: 'rp', cls: 'ret-top' }],
                [{ id: 'caps', label: 'bloq mayús', w: 1.75, f: 'lp', mod: 'left' }, ...ES_LETTERS.r2, L('ñ', 'Ñ', 'rp'),
                    L('´', '¨', 'rp', { dead: true, id: 'acute' }), L('ç', 'Ç', 'rp'),
                    { id: 'ret2', label: 'intro', w: 0.75, f: 'rp', cls: 'ret-bottom', alias: 'ret' }],
                [{ id: 'shiftL', label: '⇧', w: 1.25, f: 'lp', mod: 'left' }, L('<', '>', 'lp'), ...ES_LETTERS.r3,
                    L(',', ';', 'rm'), L('.', ':', 'rr'), L('-', '_', 'rp'),
                    { id: 'shiftR', label: '⇧', w: 2.25, f: 'rp', mod: 'right' }],
                [
                    { id: 'ctrl', label: 'ctrl', w: 1.25, mod: 'left' },
                    { id: 'win', label: '⊞', w: 1.25, mod: 'left' },
                    { id: 'alt', label: 'alt', w: 1.25, mod: 'left' },
                    { id: 'space', label: '', w: 5.5, f: 'th' },
                    { id: 'altgr', label: 'alt gr', w: 1.25, mod: 'left' },
                    { id: 'menu', label: '☰', w: 1.25, mod: 'left' },
                    { id: 'ctrlR', label: 'ctrl', w: 1.25, mod: 'left' },
                    { id: 'arrows', label: '', w: 1.5, arrows: true }
                ]
            ]
        },
        'us': {
            name: 'US (ANSI)', rpHome: ';', dead: false,
            rows: [
                [L('`', '~', 'lp'), L('1', '!', 'lp'), L('2', '@', 'lr'), L('3', '#', 'lm'), L('4', '$', 'li'),
                    L('5', '%', 'li'), L('6', '^', 'ri'), L('7', '&', 'ri'), L('8', '*', 'rm'), L('9', '(', 'rr'),
                    L('0', ')', 'rp'), L('-', '_', 'rp'), L('=', '+', 'rp'),
                    { id: 'bksp', label: 'delete', w: 1.5, f: 'rp', mod: 'right' }],
                [{ id: 'tab', label: 'tab', w: 1.5, f: 'lp', mod: 'left' }, ...ES_LETTERS.r1,
                    L('[', '{', 'rp'), L(']', '}', 'rp'), L('\\', '|', 'rp', { w: 1 })],
                [{ id: 'caps', label: 'caps lock', w: 1.75, f: 'lp', mod: 'left' }, ...ES_LETTERS.r2,
                    L(';', ':', 'rp'), L("'", '"', 'rp'),
                    { id: 'ret', label: 'return', w: 1.75, f: 'rp', mod: 'right' }],
                [{ id: 'shiftL', label: 'shift', w: 2.25, f: 'lp', mod: 'left' }, ...ES_LETTERS.r3,
                    L(',', '<', 'rm'), L('.', '>', 'rr'), L('/', '?', 'rp'),
                    { id: 'shiftR', label: 'shift', w: 2.25, f: 'rp', mod: 'right' }],
                MAC_BOTTOM
            ]
        }
    };

    let LAYOUT = null;
    let KEYS = {};      // id -> {id, normal, shift, f, dead}
    let CHARMAP = {};   // char -> {key, shift}
    let KBEL = {};      // id -> [elements] del teclat del joc

    function setLayout(id) {
        LAYOUT = LAYOUTS[id] || LAYOUTS['mac-es'];
        KEYS = {}; CHARMAP = {};
        LAYOUT.rows.forEach((row) => row.forEach((k) => {
            if (Array.isArray(k)) {
                const [n, s, f, o] = k;
                const kid = o.id || 'k_' + n;
                KEYS[kid] = { id: kid, normal: n, shift: s, f, dead: !!o.dead };
                // les tecles mortes també serveixen per escriure l'accent sol (accent + espai)
                CHARMAP[n] = { key: kid, shift: false };
                CHARMAP[s] = { key: kid, shift: true };
            } else if (!k.alias) {
                KEYS[k.id] = { id: k.id, f: k.f || null };
            }
        }));
        CHARMAP[' '] = { key: 'space', shift: false };
        CHARMAP['\n'] = { key: 'ret', shift: false };
        charCache.clear();
    }

    const DEAD_FOR_MARK = {
        '̀': { key: 'grave', shift: false, label: '`' },
        '́': { key: 'acute', shift: false, label: '´' },
        '̈': { key: 'acute', shift: true,  label: '¨' },
        '̂': { key: 'grave', shift: true,  label: '^' }
    };
    const charCache = new Map();

    /** Com es tecleja un caràcter: tecla principal, dit, shift i tecla morta. */
    function analyzeChar(c) {
        if (charCache.has(c)) return charCache.get(c);
        let base = c, dead = null, loose = false, res = null;
        if (!CHARMAP[c]) {
            const nfd = c.normalize('NFD');
            if (nfd.length === 2 && CHARMAP[nfd[0]]) {
                base = nfd[0];
                if (LAYOUT.dead && DEAD_FOR_MARK[nfd[1]]) dead = DEAD_FOR_MARK[nfd[1]];
                else loose = true; // el teclat no té aquest accent: s'accepta la lletra base
            } else {
                charCache.set(c, null);
                return null; // no es pot teclejar: es salta automàticament
            }
        }
        const m = CHARMAP[base];
        const f = KEYS[m.key].f;
        const shiftKey = m.shift ? (isLeft(f) ? 'shiftR' : 'shiftL') : null;
        res = {
            key: m.key, f, loose,
            shift: shiftKey, shiftF: shiftKey ? KEYS[shiftKey].f : null,
            dead: dead ? dead.key : null, deadShift: dead ? dead.shift : false,
            deadLabel: dead ? dead.label : null
        };
        charCache.set(c, res);
        return res;
    }
    const typeable = (str) => [...str].every((c) => analyzeChar(c));

    // ==========================================
    // TEXT
    // ==========================================
    function normalizeText(t) {
        return t
            .replace(/\r/g, '')
            .replace(/[“”„«»]/g, '"')
            .replace(/[‘’‚′]/g, "'")
            .replace(/[—–]/g, '-')
            .replace(/…/g, '...')
            .replace(/ŀ/g, 'l·').replace(/Ŀ/g, 'L·')
            .replace(/_/g, '')
            .replace(/[\t ]/g, ' ')
            .replace(/ {2,}/g, ' ')
            .split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
            .normalize('NFC')
            .trim();
    }
    const stripMarks = (c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const lbl = (c) => c === ' ' ? '␣' : c === '\n' ? '↵' : esc(c);
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const today = () => new Date().toISOString().slice(0, 10);
    const fmtTime = (secs) => Math.floor(secs / 60) + ':' + String(Math.floor(secs % 60)).padStart(2, '0');

    const CA_ACCENT_WORDS = ('això també què perquè cançó plaça col·legi il·lusió intel·ligent paral·lel veïna raïm llengües aigües pingüí ' +
        'cafè França força Barça València àvia mòbil pàgina música església Pirineu país països raó lliçó acció ' +
        'col·lecció excel·lent tranquil·la novel·la síl·laba cèl·lula il·lustració pel·lícula ' +
        "l'escola d'aquí s'ha n'hi m'agrada t'estimo l'home l'aigua d'Andorra qu'és " +
        'àmplia època fàcil difícil útil típic públic màquina mètode història política teoria ' +
        'camió cosí només després encara però què qui quan on com això allò dóna són més està havia').split(' ');

    const CODE_LINES = [
        'const total = items.reduce((a, b) => a + b, 0);',
        'if (x > 10 && y < 5) return x * y;',
        'for i in range(10): print(i ** 2)',
        'def area(r): return 3.14159 * r * r',
        'let name = "Vortex"; console.log(name.length);',
        "SELECT id, name FROM users WHERE age >= 18;",
        'git commit -m "fix: corregeix el bug del login"',
        'ls -la | grep ".csv" > llista.txt',
        'x = [n % 3 for n in data if n != 0]',
        'function add(a, b) { return a + b; }',
        'df = pd.read_csv("dades.csv", sep=";")',
        'while (i < n) { sum += arr[i++]; }',
        'export PATH="$HOME/bin:$PATH"',
        "print(f'Total: {total:.2f} kWh')",
        'a = (b + c) / 2 - d * 0.5;',
        'curl -s https://api.exemple.cat/v1/vent?lat=41.4&lon=2.1'
    ];

    function corpusWords(lang) {
        const key = 'w_' + lang;
        if (corpusWords[key]) return corpusWords[key];
        const texts = window.ADULT_TEXTS.filter((t) => lang === 'all' || t.lang === lang);
        const set = new Set();
        texts.forEach((t) => normalizeText(t.text).split(/\s+/).forEach((w) => {
            const c = w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
            if (c.length >= 2 && c.length <= 13) set.add(c);
        }));
        if (lang !== 'en') CA_ACCENT_WORDS.forEach((w) => set.add(w));
        corpusWords[key] = [...set];
        return corpusWords[key];
    }

    // ==========================================
    // PERSISTÈNCIA
    // ==========================================
    const store = {
        settings: { lang: 'all', mode: 'flow', wpm: 45, metro: false, block: false, accents: false,
            ghost: 'target', layout: 'mac-es', aids: '0', goal: '10', autopause: true },
        best: {},      // textId -> {wpm, acc, times[]}
        history: [],   // {id, date, wpm, acc, mode, secs, peak?}
        keyStats: {},  // char -> {n, err, ms, mn}
        bigrams: {},   // "ab" -> {n, err, ms, mn}
        daily: {},     // data -> segons de pràctica
        books: []      // {id, title, author, n, pos, stored}
    };
    const memBooks = {}; // llibres que no caben a localStorage
    function loadStore() {
        try {
            const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
            if (s) {
                Object.assign(store.settings, s.settings || {});
                ['best', 'keyStats', 'bigrams', 'daily'].forEach((k) => { if (s[k]) store[k] = s[k]; });
                store.history = s.history || [];
                store.books = s.books || [];
            }
        } catch (e) { /* sense emmagatzematge: valors per defecte */ }
    }
    function saveStore() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {
            // si no hi cap, retallem les marques de temps del fantasma més antigues
            try {
                Object.values(store.best).forEach((b) => { delete b.times; });
                localStorage.setItem(STORE_KEY, JSON.stringify(store));
            } catch (e2) { /* ignorat */ }
        }
    }
    function bookChunks(id) {
        if (memBooks[id]) return memBooks[id];
        try { return JSON.parse(localStorage.getItem(STORE_KEY + '_book_' + id) || 'null'); } catch (e) { return null; }
    }

    // ==========================================
    // ÀUDIO
    // ==========================================
    let audioCtx = null;
    function ctx() {
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }
    function tick(at, accent) {
        const a = ctx(); if (!a) return;
        const o = a.createOscillator(), g = a.createGain();
        o.type = 'square';
        o.frequency.value = accent ? 1760 : 1180;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(accent ? 0.12 : 0.06, at + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
        o.connect(g).connect(a.destination);
        o.start(at); o.stop(at + 0.05);
    }
    function errBuzz() {
        const a = ctx(); if (!a) return;
        const o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
        o.type = 'sawtooth'; o.frequency.value = 140;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.07, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.13);
    }

    // ==========================================
    // ESTADÍSTIQUES PER TECLA I PER TRANSICIÓ
    // ==========================================
    const isWordChar = (c) => c && c !== ' ' && c !== '\n';

    /**
     * Recorre les pulsacions d'una sessió i en treu, per a cada caràcter i cada
     * parell de caràcters consecutius (sense espais), el nombre de primers
     * intents, els errors i el temps de transició (només entre encerts seguits).
     */
    function analyzeSession(keystrokes) {
        const keys = {}, bigrams = {};
        const seen = new Set();
        let prev = null;
        const bump = (map, k) => (map[k] = map[k] || { n: 0, err: 0, times: [] });
        keystrokes.forEach((k) => {
            const first = !seen.has(k.i);
            seen.add(k.i);
            if (first) {
                const K = bump(keys, k.exp);
                K.n++; if (!k.ok) K.err++;
                if (k.i > 0 && isWordChar(k.prevExp) && isWordChar(k.exp)) {
                    const B = bump(bigrams, k.prevExp + k.exp);
                    B.n++; if (!k.ok) B.err++;
                }
            }
            if (k.ok && prev && prev.ok && prev.i === k.i - 1) {
                const dt = k.t - prev.t;
                if (dt > 0 && dt < 1500) {
                    bump(keys, k.exp).times.push(dt);
                    if (isWordChar(k.prevExp) && isWordChar(k.exp)) bump(bigrams, k.prevExp + k.exp).times.push(dt);
                }
            }
            prev = k;
        });
        const fin = (m) => Object.values(m).forEach((v) => { v.ms = v.times.length ? v.times.reduce((a, b) => a + b, 0) / v.times.length : null; });
        fin(keys); fin(bigrams);
        return { keys, bigrams };
    }

    function mergeGlobal(session) {
        const merge = (dst, src) => Object.entries(src).forEach(([k, v]) => {
            const d = dst[k] = dst[k] || { n: 0, err: 0, ms: null, mn: 0 };
            d.n += v.n; d.err += v.err;
            v.times.forEach((t) => {
                const w = Math.min(d.mn, 40); // mitjana mòbil: pesa més la pràctica recent
                d.ms = d.ms == null ? t : (d.ms * w + t) / (w + 1);
                d.mn++;
            });
            if (d.ms != null) d.ms = Math.round(d.ms);
        });
        merge(store.keyStats, session.keys);
        merge(store.bigrams, session.bigrams);
    }

    const median = (arr) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

    /** Punts febles: combinació de taxa d'error i lentitud relativa. */
    function weakPoints(keyMap, bigramMap, opts = {}) {
        const minK = opts.minK || 6, minB = opts.minB || 3;
        const score = (map, min, filter) => {
            const items = Object.entries(map).filter(([k, v]) => v.n >= min && filter(k));
            const med = median(items.map(([, v]) => v.ms).filter(Boolean));
            return items.map(([k, v]) => {
                const er = v.err / v.n;
                const slow = v.ms && med ? Math.max(0, v.ms / med - 1) : 0;
                return { k, n: v.n, err: v.err, er, ms: v.ms ? Math.round(v.ms) : null, slow, score: er * 4 + slow };
            }).filter((x) => x.score > 0.12).sort((a, b) => b.score - a.score);
        };
        const keys = score(keyMap, minK, (k) => isWordChar(k) && analyzeChar(k));
        const bigrams = score(bigramMap, minB, (k) => [...k].every((c) => analyzeChar(c)));
        bigrams.forEach((b) => {
            const a = analyzeChar(b.k[0]), c = analyzeChar(b.k[1]);
            b.sameFinger = a && c && a.f === c.f;
            b.sameHand = a && c && isLeft(a.f) === isLeft(c.f);
        });
        return { keys, bigrams };
    }

    // ==========================================
    // GENERADORS D'EXERCICIS
    // ==========================================
    function wordsWith(targets, lang, count) {
        const words = corpusWords(lang).filter((w) => typeable(w));
        const OPEN = '¿¡"(\'';
        const buckets = targets.map((t) => {
            if (t.length === 1 && !/\p{L}/u.test(t)) {
                // signe de puntuació o número: l'enganxem a paraules
                const base = shuffle(words.slice()).slice(0, 30);
                return base.map((w) => OPEN.includes(t) ? t + w + (t === '¿' ? '?' : t === '¡' ? '!' : t === '(' ? ')' : t === '"' ? '"' : '') : w + t);
            }
            return shuffle(words.filter((w) => w.toLowerCase().includes(t.toLowerCase())));
        });
        const out = [];
        let guard = 0;
        while (out.length < count && guard++ < count * 10) {
            const bi = guard % Math.max(1, buckets.length);
            const b = buckets[bi];
            if (b && b.length) out.push(b[Math.floor(Math.random() * b.length)]);
            else if (!buckets.some((x) => x.length)) out.push(pick(words));
        }
        return out;
    }

    function makeAdaptive() {
        const lang = store.settings.lang;
        const w = weakPoints(store.keyStats, store.bigrams);
        const tb = w.bigrams.slice(0, 5).map((x) => x.k);
        const tk = w.keys.slice(0, 3).map((x) => x.k);
        const targets = [...tb, ...tk];
        const enough = Object.values(store.keyStats).reduce((a, v) => a + v.n, 0) >= 150;
        const words = targets.length ? wordsWith(targets, lang, 55) : shuffle(corpusWords(lang).filter(typeable)).slice(0, 55);
        return {
            id: 'adaptive', custom: true, lang, author: 'Entrenament adaptatiu',
            work: targets.length ? 'Focus: ' + targets.map((t) => t === ' ' ? '␣' : t).join(' · ') : (enough ? 'Repàs general' : 'Encara no hi ha prou dades: text variat'),
            text: words.join(' ')
        };
    }

    function makeFocusDrill(session, title) {
        const w = weakPoints(session.keys, session.bigrams, { minK: 2, minB: 1 });
        const targets = [...w.bigrams.slice(0, 4).map((x) => x.k), ...w.keys.slice(0, 3).map((x) => x.k)];
        const words = wordsWith(targets.length ? targets : ['e'], store.settings.lang, 40);
        return { id: 'drill', custom: true, lang: store.settings.lang, author: 'Exercici de reforç',
            work: title || ('Focus: ' + targets.join(' · ')), text: words.join(' ') };
    }

    const DRILLS = [
        { id: 'pinky', title: 'Dits xics', desc: 'Paraules carregades de Q, A, Z, P, Ñ, Ç i puntuació', icon: '✋' },
        { id: 'accents', title: 'Accents i l·l', desc: 'à è é í ò ó ú ï ü ç l·l i apòstrofs', icon: 'à' },
        { id: 'caps', title: 'Majúscules', desc: 'Shift amb la mà contrària a la lletra', icon: '⇧' },
        { id: 'numbers', title: 'Números i símbols', desc: 'Xifres, percentatges, parèntesis, signes', icon: '#' },
        { id: 'code', title: 'Codi', desc: 'JS, Python, SQL i terminal', icon: '{ }' }
    ];

    function makeDrill(id) {
        const lang = store.settings.lang;
        const words = corpusWords(lang).filter(typeable);
        let text = '';
        if (id === 'pinky') {
            const pinkyShare = (w) => [...w].filter((c) => { const a = analyzeChar(c); return a && (a.f === 'lp' || a.f === 'rp'); }).length / w.length;
            const pool = words.filter((w) => w.length >= 3 && pinkyShare(w) >= 0.34);
            const extra = ['aquí', 'quatre', 'zero', 'pa', 'plaça', 'paquet', 'qualsevol', 'pizza', 'puzzle', 'papa', 'quasi', 'aqua', 'pala'].filter(typeable);
            text = shuffle([...pool, ...extra]).slice(0, 48).map((w, i) => i % 9 === 8 ? w + '.' : i % 6 === 5 ? w + ',' : w).join(' ');
        } else if (id === 'accents') {
            const pool = [...CA_ACCENT_WORDS, ...words.filter((w) => /[àèéíïòóúüç·']/i.test(w))].filter(typeable);
            text = shuffle([...new Set(pool)]).slice(0, 45).join(' ');
        } else if (id === 'caps') {
            const pool = shuffle(words.filter((w) => w.length >= 3)).slice(0, 44);
            text = pool.map((w, i) => (i % 2 === 0 ? w[0].toUpperCase() + w.slice(1) : w) + (i % 7 === 6 ? '.' : '')).join(' ');
        } else if (id === 'numbers') {
            const gen = [
                () => Math.floor(Math.random() * 900 + 10) + ',' + Math.floor(Math.random() * 90 + 10),
                () => Math.floor(Math.random() * 100) + '%',
                () => '(' + Math.floor(Math.random() * 50) + '+' + Math.floor(Math.random() * 50) + ')',
                () => Math.floor(Math.random() * 24) + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
                () => Math.floor(Math.random() * 31 + 1) + '/' + Math.floor(Math.random() * 12 + 1) + '/2026',
                () => '"' + pick(words) + '"',
                () => '¿' + pick(words) + '?',
                () => '¡' + pick(words) + '!',
                () => Math.floor(Math.random() * 9000 + 1000) + ' km',
                () => '$' + Math.floor(Math.random() * 500),
                () => '#' + Math.floor(Math.random() * 99),
                () => 'x' + Math.floor(Math.random() * 9) + '=' + Math.floor(Math.random() * 99) + ';',
                () => Math.floor(Math.random() * 10) + '*' + Math.floor(Math.random() * 10) + '-' + Math.floor(Math.random() * 10)
            ];
            const out = [];
            let g = 0;
            while (out.length < 40 && g++ < 400) { const t = pick(gen)(); if (typeable(t)) out.push(t); }
            text = out.join(' ');
        } else if (id === 'code') {
            const lines = CODE_LINES.filter(typeable);
            const fallback = CODE_LINES.map((l) => [...l].filter((c) => analyzeChar(c)).join(''));
            text = shuffle(lines.length >= 6 ? lines : fallback).slice(0, 7).join('\n');
        }
        const d = DRILLS.find((x) => x.id === id);
        return { id: 'drill-' + id, custom: true, lang, author: 'Exercici temàtic', work: d.title, text: text || 'asdf jklñ' };
    }

    // ==========================================
    // ESTAT DE LA PARTIDA
    // ==========================================
    let G = null;
    const SP = 46;           // separació vertical entre notes (px)
    const VISIBLE = 9;       // notes visibles per sobre de la línia
    const MISS_WINDOW = 1.6; // caràcters de retard abans de donar una nota per perduda

    function newGame(textObj) {
        const text = normalizeText(textObj.text);
        const chars = [...text].map((c) => ({ c, info: analyzeChar(c), state: 'pending', typed: null, hadErr: false }));
        const s = store.settings;
        const best = store.best[textObj.id];
        G = {
            textObj, text, chars,
            cur: 0, pos: 0,
            mode: s.mode, wpm: s.wpm, cps: (s.wpm * 5) / 60, wpmNow: s.wpm,
            block: s.block, accents: s.accents, metro: s.metro,
            ghostTimes: s.mode === 'flow' && s.ghost === 'best' && best && best.times ? best.times : null,
            started: false, finished: false, paused: false, t0: 0, now: 0, pausedAt: 0,
            keystrokes: [], errors: 0, combo: 0, maxCombo: 0, score: 0,
            judges: { perfect: 0, good: 0, early: 0, late: 0, miss: 0 },
            recent: [], peak: 0, rampFail: false,
            shiftWrong: 0, lastShiftCode: null, times: [],
            notes: new Map(), lastFrame: 0, raf: null,
            nextTick: 0, tickN: 0, lastLineTop: -1, samples: [], dead: null, ignoreInput: null
        };
        skipUntypeable();
        G.pos = G.mode === 'flow' ? G.cur : -(VISIBLE - 1.5); // la primera nota entra per dalt
    }

    const trackMode = () => G.mode === 'rhythm' || G.mode === 'ramp';

    function skipUntypeable() {
        while (G.cur < G.chars.length && !G.chars[G.cur].info) {
            G.chars[G.cur].state = 'ok';
            G.times[G.cur] = G.started ? Math.round(performance.now() - G.t0) : 0;
            G.cur++;
        }
    }

    // ==========================================
    // PANTALLA DE SELECCIÓ
    // ==========================================
    function go(id) {
        document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
        $(id).classList.add('active');
    }
    function setSeg(id, v) {
        document.querySelectorAll('#' + id + ' button').forEach((b) => b.classList.toggle('on', b.dataset.v === String(v)));
    }

    function streakDays() {
        const goal = (+store.settings.goal || 10) * 60;
        let n = 0;
        const d = new Date();
        if ((store.daily[today()] || 0) < goal) d.setDate(d.getDate() - 1); // avui encara hi ets a temps
        for (;;) {
            const k = d.toISOString().slice(0, 10);
            if ((store.daily[k] || 0) >= goal) { n++; d.setDate(d.getDate() - 1); } else break;
        }
        return n;
    }

    function renderProgress() {
        const h = store.history;
        const panel = $('ad-progress-panel');
        const goal = (+store.settings.goal || 10);
        const todaySecs = store.daily[today()] || 0;
        const pct = Math.min(100, (todaySecs / (goal * 60)) * 100);
        const totalSecs = Object.values(store.daily).reduce((a, b) => a + b, 0);
        const series = h.filter((x) => x.mode === 'flow').slice(-30).map((x) => x.wpm);
        const w = weakPoints(store.keyStats, store.bigrams);
        panel.innerHTML =
            '<div class="ad-pp-col ad-pp-today">' +
                '<div class="ad-ring" style="--p:' + pct + '"><b>' + Math.floor(todaySecs / 60) + '′</b><span>de ' + goal + '′</span></div>' +
                '<div class="ad-pp-facts"><div><b>' + streakDays() + '</b><span>dies de ratxa</span></div>' +
                '<div><b>' + Math.round(totalSecs / 60) + '′</b><span>temps total</span></div>' +
                '<div><b>' + h.length + '</b><span>sessions</span></div></div>' +
            '</div>' +
            '<div class="ad-pp-col ad-pp-chart"><h4>Velocitat (sessions Flux)</h4>' +
                (series.length >= 2 ? sparkline(series, store.settings.wpm, 300, 90) : '<p class="ad-muted">Fes un parell de textos per veure la teva evolució.</p>') +
            '</div>' +
            '<div class="ad-pp-col ad-pp-heat"><h4>Errors per tecla <small>(històric)</small></h4><div class="ad-heat ad-heat-mini" id="ad-heat-global"></div></div>' +
            '<div class="ad-pp-col ad-pp-weak"><h4>Punts febles</h4>' + weakChips(w) + '</div>';
        renderHeatmap($('ad-heat-global'), store.keyStats, 'err');
    }

    function weakChips(w) {
        if (!w.keys.length && !w.bigrams.length) return '<p class="ad-muted">Encara no n\'hi ha prou dades. Practica uns quants textos i apareixeran aquí.</p>';
        return '<div class="ad-chips">' +
            w.bigrams.slice(0, 6).map((b) => '<span class="ad-chipw" title="' + b.n + ' cops · ' + Math.round(b.er * 100) + '% errors' + (b.ms ? ' · ' + b.ms + ' ms' : '') + '"><b>' + esc(b.k) + '</b>' + (b.sameFinger ? '<i>mateix dit</i>' : '') + '</span>').join('') +
            w.keys.slice(0, 5).map((k) => '<span class="ad-chipw ad-chipk" title="' + k.n + ' cops · ' + Math.round(k.er * 100) + '% errors' + (k.ms ? ' · ' + k.ms + ' ms' : '') + '"><b>' + lbl(k.k) + '</b></span>').join('') +
            '</div>';
    }

    function renderTraining() {
        const list = $('ad-train-list');
        const w = weakPoints(store.keyStats, store.bigrams);
        list.innerHTML = '';
        const ad = document.createElement('button');
        ad.className = 'ad-train ad-train-main';
        ad.innerHTML = '<span class="ad-train-ico">◎</span><div><b>Entrenament adaptatiu</b>' +
            '<p>Paraules reals amb les tecles i transicions que més et costen, segons totes les sessions.</p>' + weakChips(w) + '</div>';
        ad.addEventListener('click', () => startGame(makeAdaptive()));
        list.appendChild(ad);
        DRILLS.forEach((d) => {
            const b = document.createElement('button');
            b.className = 'ad-train';
            b.innerHTML = '<span class="ad-train-ico">' + esc(d.icon) + '</span><div><b>' + d.title + '</b><p>' + d.desc + '</p></div>';
            b.addEventListener('click', () => startGame(makeDrill(d.id)));
            list.appendChild(b);
        });
    }

    function renderLibrary() {
        const lib = $('ad-library');
        lib.innerHTML = '';
        store.books.forEach((bk) => {
            const card = document.createElement('div');
            card.className = 'ad-book';
            const done = bk.pos >= bk.n;
            card.innerHTML =
                '<div class="ad-book-main"><b>' + esc(bk.title) + '</b><span>' + esc(bk.author || '') + '</span>' +
                '<div class="ad-book-bar"><i style="width:' + (bk.pos / bk.n * 100) + '%"></i></div>' +
                '<small>Secció ' + Math.min(bk.pos + 1, bk.n) + ' de ' + bk.n + (bk.stored === false ? ' · només en aquesta sessió (massa gran per desar-lo)' : '') + '</small></div>' +
                '<div class="ad-book-actions">' +
                '<button class="ad-btn ad-btn-primary" data-act="go">' + (done ? 'Tornar a començar' : bk.pos ? 'Continuar' : 'Començar') + '</button>' +
                '<button class="ad-btn ad-btn-ghost" data-act="del">Eliminar</button></div>';
            card.querySelector('[data-act=go]').onclick = () => { if (done) { bk.pos = 0; saveStore(); } startBookSection(bk.id); };
            const del = card.querySelector('[data-act=del]');
            del.onclick = () => {
                if (!del.classList.contains('confirm')) { del.classList.add('confirm'); del.textContent = 'Segur?'; return; }
                store.books = store.books.filter((x) => x.id !== bk.id);
                try { localStorage.removeItem(STORE_KEY + '_book_' + bk.id); } catch (e) { /* ignorat */ }
                delete memBooks[bk.id];
                saveStore(); renderLibrary();
            };
            lib.appendChild(card);
        });
        const add = document.createElement('label');
        add.className = 'ad-book ad-book-add';
        add.innerHTML = '<input type="file" accept=".txt,.epub,text/plain,application/epub+zip" hidden>' +
            '<span class="ad-train-ico">+</span><div><b>Afegir un llibre</b><p>Fitxer .txt o .epub sense DRM. Es divideix en seccions i continues on ho vas deixar. Es desa només en aquest navegador.</p><small id="ad-import-status"></small></div>';
        add.querySelector('input').addEventListener('change', (e) => { if (e.target.files[0]) importBook(e.target.files[0]); e.target.value = ''; });
        lib.appendChild(add);
    }

    function renderTexts() {
        const s = store.settings;
        const list = $('ad-text-list');
        list.innerHTML = '';
        window.ADULT_TEXTS.filter((t) => s.lang === 'all' || t.lang === s.lang).forEach((t) => {
            const len = normalizeText(t.text).length;
            const best = store.best[t.id];
            const card = document.createElement('button');
            card.className = 'ad-card';
            card.innerHTML =
                '<div class="ad-card-tags"><span class="ad-tag ad-tag-' + t.lang + '">' + t.lang.toUpperCase() + '</span>' +
                '<span class="ad-tag">' + t.era + '</span><span class="ad-card-year">' + t.year + '</span></div>' +
                '<div class="ad-card-author">' + esc(t.author) + '</div>' +
                '<div class="ad-card-work">' + esc(t.work) + '</div>' +
                '<div class="ad-card-snippet">' + esc(normalizeText(t.text).slice(0, 90)) + '…</div>' +
                '<div class="ad-card-meta"><span>' + len + ' caràcters · ~' + Math.max(1, Math.round(len / (s.wpm * 5))) + ' min</span>' +
                (best ? '<span class="ad-card-best">Millor: <b>' + best.wpm + '</b> ppm · ' + best.acc + '%</span>' : '<span class="ad-card-new">Nou</span>') +
                '</div>';
            card.addEventListener('click', () => startGame(t));
            list.appendChild(card);
        });
    }

    function renderSelect() {
        const s = store.settings;
        ['lang', 'mode', 'ghost', 'layout', 'aids', 'goal'].forEach((k) => setSeg('ad-' + k, s[k]));
        $('ad-wpm').value = s.wpm;
        $('ad-wpm-val').textContent = s.wpm;
        $('ad-wpm-label').textContent = s.mode === 'ramp' ? 'Velocitat inicial' : 'Objectiu';
        $('ad-opt-metro').checked = s.metro;
        $('ad-opt-block').checked = s.block;
        $('ad-opt-accents').checked = s.accents;
        $('ad-opt-autopause').checked = s.autopause !== false;

        const h = store.history;
        if (h.length) {
            const last = h.slice(-10);
            const avg = Math.round(last.reduce((a, x) => a + x.wpm, 0) / last.length);
            const top = Math.max(...h.filter((x) => x.mode === 'flow').map((x) => x.wpm), 0);
            const peak = Math.max(...h.map((x) => x.peak || 0), 0);
            $('ad-best').innerHTML = '<div><b>' + top + '</b><span>rècord ppm</span></div><div><b>' + avg + '</b><span>mitjana (10)</span></div>' +
                (peak ? '<div><b>' + peak + '</b><span>màx. sostinguda</span></div>' : '');
        } else {
            $('ad-best').innerHTML = '';
        }
        renderProgress();
        renderTraining();
        renderLibrary();
        renderTexts();
    }

    // ==========================================
    // TECLAT (genèric: joc i mapes de calor)
    // ==========================================
    function buildKeyboard(container) {
        const map = {};
        container.innerHTML = '';
        LAYOUT.rows.forEach((row) => {
            const r = document.createElement('div');
            r.className = 'mb-row';
            row.forEach((k) => {
                const el = document.createElement('div');
                el.className = 'mb-key';
                let id, w = 1;
                if (Array.isArray(k)) {
                    const [n, s, f, o] = k;
                    id = o.id || 'k_' + n;
                    w = o.w || 1;
                    const isLetter = n.toUpperCase() !== n && s === n.toUpperCase();
                    if (isLetter) el.innerHTML = '<span class="mb-c">' + s + '</span>';
                    else {
                        el.classList.add('mb-dual');
                        el.innerHTML = '<span class="mb-s">' + esc(s) + '</span><span class="mb-n">' + esc(n) + '</span>';
                    }
                    if (o.bump) el.classList.add('mb-bump');
                    el.style.setProperty('--fc', FINGER[f].color);
                    el.dataset.f = f;
                } else {
                    id = k.alias || k.id;
                    w = k.w;
                    el.classList.add('mb-mod');
                    if (k.mod) el.classList.add('mb-mod-' + k.mod);
                    if (k.cls) el.classList.add(k.cls);
                    if (k.arrows) {
                        el.classList.add('mb-arrows');
                        el.innerHTML = '<span>◀</span><span class="mb-ud"><i>▲</i><i>▼</i></span><span>▶</span>';
                    } else {
                        el.innerHTML = (k.sub ? '<span class="mb-sub">' + k.sub + '</span>' : '') + '<span class="mb-l">' + esc(k.label) + '</span>';
                    }
                    if (k.f) { el.style.setProperty('--fc', FINGER[k.f].color); el.dataset.f = k.f; }
                    if (k.id === 'space') el.classList.add('mb-space');
                }
                el.style.flexGrow = w;
                el.style.flexBasis = 0;
                (map[id] = map[id] || []).push(el);
                r.appendChild(el);
            });
            container.appendChild(r);
        });
        return map;
    }

    /** Pinta un teclat segons errors ('err') o velocitat ('ms') per tecla. */
    function renderHeatmap(container, keyStats, metric) {
        if (!container) return;
        container.classList.add('mb-keyboard', 'ad-heatkb');
        const map = buildKeyboard(container);
        const agg = {};
        Object.entries(keyStats).forEach(([c, v]) => {
            const a = analyzeChar(c);
            if (!a) return;
            const A = agg[a.key] = agg[a.key] || { n: 0, err: 0, msSum: 0, msN: 0, chars: [] };
            A.n += v.n; A.err += v.err;
            if (v.ms) { A.msSum += v.ms * (v.mn || v.times?.length || 1); A.msN += (v.mn || v.times?.length || 1); }
            A.chars.push(c);
        });
        const meds = Object.values(agg).filter((a) => a.msN).map((a) => a.msSum / a.msN);
        const med = median(meds);
        Object.entries(agg).forEach(([id, a]) => {
            if (!map[id] || a.n < 2) return;
            let t, label;
            if (metric === 'err') {
                const r = a.err / a.n;
                t = Math.min(1, r / 0.15);
                label = Math.round(r * 100) + '% errors';
            } else {
                if (!a.msN || !med) return;
                const ms = a.msSum / a.msN;
                t = Math.min(1, Math.max(0, (ms / med - 0.75) / 0.8));
                label = Math.round(ms) + ' ms';
            }
            const hue = 130 - t * 130;
            map[id].forEach((el) => {
                el.style.background = 'hsl(' + hue + ' 70% ' + (22 + t * 8) + '%)';
                el.style.boxShadow = '0 0 0 1px hsl(' + hue + ' 80% 45% / .6), 0 0 ' + (4 + t * 12) + 'px hsl(' + hue + ' 90% 50% / ' + (0.15 + t * 0.4) + ')';
                el.title = a.chars.join(' ') + ' · ' + a.n + ' pulsacions · ' + label;
                el.classList.add('heat-on');
            });
        });
    }

    // ==========================================
    // CONSTRUCCIÓ DEL JOC
    // ==========================================
    function buildGameKeyboard() {
        KBEL = buildKeyboard($('ad-keyboard'));
    }

    function buildHighway() {
        const lanes = $('ad-lanes'), frets = $('ad-frets');
        lanes.innerHTML = ''; frets.innerHTML = '';
        const home = { lp: 'A', lr: 'S', lm: 'D', li: 'F', th: '␣', ri: 'J', rm: 'K', rr: 'L', rp: LAYOUT.rpHome };
        LANES.forEach((f) => {
            const l = document.createElement('div');
            l.className = 'ad-lane ad-lane-' + f;
            l.style.setProperty('--fc', FINGER[f].color);
            lanes.appendChild(l);
            const fr = document.createElement('div');
            fr.className = 'ad-fret ad-fret-' + f;
            fr.dataset.f = f;
            fr.style.setProperty('--fc', FINGER[f].color);
            fr.innerHTML = '<b>' + home[f] + '</b><span>' + FINGER[f].short + '</span>';
            frets.appendChild(fr);
        });
    }

    function buildTape() {
        const inner = $('ad-tape-inner');
        const frag = document.createDocumentFragment();
        G.spans = G.chars.map((ch) => {
            const sp = document.createElement('span');
            sp.className = 'tc';
            if (ch.c === '\n') {
                sp.textContent = '↵';
                sp.classList.add('nl');
                frag.appendChild(sp);
                frag.appendChild(document.createElement('br'));
            } else {
                sp.textContent = ch.c;
                if (ch.c === ' ') sp.classList.add('sp');
                frag.appendChild(sp);
            }
            return sp;
        });
        inner.innerHTML = '';
        inner.appendChild(frag);
        inner.style.transform = 'translateY(0)';
        G.chars.forEach((ch, i) => { if (ch.state === 'ok') G.spans[i].classList.add('ok'); });
    }

    function startGame(textObj) {
        stopLoop();
        newGame(textObj);
        const scr = $('adult-game-screen');
        scr.classList.toggle('mode-track', trackMode());
        scr.classList.remove('aids-0', 'aids-1', 'aids-2', 'aids-3');
        scr.classList.add('aids-' + store.settings.aids);
        $('ad-now-author').textContent = textObj.author + (textObj.section ? ' · ' + textObj.section : '');
        $('ad-now-work').textContent = textObj.work + (textObj.year ? ' (' + textObj.year + ')' : '');
        $('ad-hud-pace-l').textContent = G.mode === 'rhythm' ? 'punts' : G.mode === 'ramp' ? 'ppm pista' : G.ghostTimes ? 'vs millor marca' : 'vs objectiu';
        $('ad-start-hint').innerHTML = trackMode()
            ? (G.mode === 'ramp' ? 'Mode Progressiu: comença a <b>' + G.wpm + ' ppm</b> i accelera' : 'Mode Ritme a <b>' + G.wpm + ' ppm</b>') + ' · prem <b>Retorn</b> per començar'
            : 'Col·loca els dits a <b>ASDF</b> · <b>JKL' + esc(LAYOUT.rpHome) + '</b> i comença a escriure' + (G.ghostTimes ? ' · competeixes amb la teva millor marca' : '');
        $('ad-start-hint').classList.remove('hidden');
        $('ad-judge').textContent = '';
        $('ad-pressed-c').textContent = '–';
        $('ad-pressed-f').textContent = '';
        $('ad-pressed').className = 'ad-pressed';
        $('ad-pause').hidden = true;
        buildTape();
        G.notes.forEach((el) => el.remove());
        G.notes.clear();
        $('ad-track').innerHTML = '';
        go('adult-game-screen');
        focusInput();
        updateTape(true);
        updateTargets();
        renderNotes();
        updateHud();
        G.lastFrame = performance.now();
        G.raf = requestAnimationFrame(loop);
    }

    function begin() {
        if (G.started) return;
        G.started = true;
        G.t0 = performance.now();
        $('ad-start-hint').classList.add('hidden');
        const a = ctx();
        if (a) G.nextTick = a.currentTime + (trackMode() ? (((VISIBLE - 1.5) % 1) || 1) / G.cps : 0.05);
    }

    // ==========================================
    // PAUSA
    // ==========================================
    function pause(auto) {
        if (!G || G.finished || G.paused) return;
        G.paused = true;
        G.pausedAt = performance.now();
        $('ad-pause-info').textContent = (auto ? 'Pausa automàtica: has canviat de finestra. ' : '') +
            (G.started ? 'El temps està aturat a ' + fmtTime(elapsedMs() / 1000) + '.' : 'Encara no has començat.');
        $('ad-pause').hidden = false;
    }
    function resume() {
        if (!G || !G.paused) return;
        const d = performance.now() - G.pausedAt;
        G.paused = false;
        if (G.started) {
            G.t0 += d;
            if (G._lastOkT != null) G._lastOkT += d;
            // en els modes amb pista, tornem enrere perquè la nota actual torni a baixar
            if (trackMode()) G.pos = Math.min(G.pos, G.cur - G.cps * 1.5);
        }
        const a = ctx();
        if (a) G.nextTick = a.currentTime + 0.1;
        G.lastFrame = performance.now();
        $('ad-pause').hidden = true;
        focusInput();
    }
    const togglePause = () => (G && G.paused ? resume() : pause(false));

    // ==========================================
    // BUCLE D'ANIMACIÓ
    // ==========================================
    function loop(ts) {
        if (!G || G.finished) return;
        const dt = Math.min(0.1, (ts - G.lastFrame) / 1000);
        G.lastFrame = ts;
        G.now = ts;

        if (!G.paused) {
            if (trackMode()) {
                if (G.started) {
                    if (G.mode === 'ramp') {
                        G.wpmNow += dt * (20 / 60); // +20 ppm per minut
                        G.cps = (G.wpmNow * 5) / 60;
                    }
                    G.pos += dt * G.cps;
                    while (G.cur < G.chars.length && G.pos - G.cur > MISS_WINDOW) {
                        G.chars[G.cur].state = 'miss';
                        G.judges.miss++;
                        G.combo = 0;
                        pushRecent(false);
                        markSpan(G.cur);
                        judge('Perduda', 'miss');
                        G.cur++;
                        skipUntypeable();
                        updateTargets();
                        updateTape();
                    }
                    if (G.cur >= G.chars.length || G.rampFail) { finish(); return; }
                }
            } else {
                G.pos += (G.cur - G.pos) * Math.min(1, dt * 16);
            }
            renderNotes();
            if (G.started && G.metro) scheduleTicks();
            if (G.started && (!G._hudT || ts - G._hudT > 200)) { updateHud(); G._hudT = ts; }
        }
        G.raf = requestAnimationFrame(loop);
    }

    function stopLoop() {
        if (G && G.raf) cancelAnimationFrame(G.raf);
    }

    function scheduleTicks() {
        const a = ctx(); if (!a) return;
        const every = G.cps > 6 ? 2 : 1;
        const interval = every / G.cps;
        if (G.nextTick < a.currentTime - 0.2) G.nextTick = a.currentTime + 0.02;
        while (G.nextTick < a.currentTime + 0.12) {
            tick(G.nextTick, (G.tickN * every) % 5 === 0);
            G.nextTick += interval;
            G.tickN++;
        }
    }

    /** Mode Progressiu: finestra de les últimes notes per decidir quan s'acaba. */
    function pushRecent(ok) {
        if (G.mode !== 'ramp') return;
        G.recent.push({ ok, wpm: G.wpmNow });
        if (G.recent.length > 30) G.recent.shift();
        const bad = G.recent.filter((r) => !r.ok).length;
        if (G.recent.length >= 20 && bad / G.recent.length <= 0.07) G.peak = Math.max(G.peak, Math.round(G.recent[0].wpm));
        if (G.recent.length >= 20 && bad / G.recent.length > 0.15) G.rampFail = true;
    }

    // ==========================================
    // PISTA
    // ==========================================
    function renderNotes() {
        const from = Math.max(0, Math.floor(G.pos) - 2);
        const to = Math.min(G.chars.length - 1, Math.ceil(G.pos) + VISIBLE);
        G.notes.forEach((el, i) => { if (i < from || i > to) { el.remove(); G.notes.delete(i); } });
        const track = $('ad-track');
        for (let i = from; i <= to; i++) {
            if (!G.notes.has(i)) {
                const el = makeNote(i);
                if (el) { track.appendChild(el); G.notes.set(i, el); }
            }
        }
        track.style.transform = 'translateY(' + (G.pos * SP).toFixed(1) + 'px)';
        G.notes.forEach((el, i) => {
            const d = i - G.pos;
            el.style.opacity = d < -0.6 ? Math.max(0, 1 + (d + 0.6) * 1.2) : d > VISIBLE - 2 ? Math.max(0, (VISIBLE - d) / 2) : 1;
        });
    }

    function makeNote(i) {
        const ch = G.chars[i];
        if (!ch.info) return null;
        const g = document.createElement('div');
        g.className = 'ad-note-row';
        g.style.bottom = (i * SP) + 'px';
        const main = document.createElement('div');
        const f = ch.info.f;
        main.className = 'ad-note ad-lane-pos-' + f + ' st-' + ch.state;
        main.style.setProperty('--fc', FINGER[f].color);
        main.textContent = ch.c === ' ' ? '' : ch.c === '\n' ? '↵' : ch.c;
        if (ch.c === ' ') main.classList.add('ad-note-space');
        g.appendChild(main);
        if (ch.info.shift) g.appendChild(chip(ch.info.shiftF, '⇧'));
        if (ch.info.dead) g.appendChild(chip('rp', ch.info.deadLabel + (ch.info.deadShift ? '⇧' : ''), true));
        g._main = main;
        return g;
    }

    function chip(f, label, dead) {
        const c = document.createElement('div');
        c.className = 'ad-chip ad-lane-pos-' + f + (dead ? ' ad-chip-dead' : '');
        c.style.setProperty('--fc', FINGER[f].color);
        c.textContent = label;
        return c;
    }

    function refreshNote(i) {
        const g = G.notes.get(i);
        if (!g) return;
        g._main.className = g._main.className.replace(/\bst-\w+/, 'st-' + G.chars[i].state);
    }

    // ==========================================
    // CINTA DE TEXT
    // ==========================================
    function markSpan(i) {
        const ch = G.chars[i], sp = G.spans[i];
        sp.classList.remove('ok', 'err', 'fix', 'miss', 'cur', 'err-now');
        if (ch.state === 'ok') sp.classList.add(ch.hadErr ? 'fix' : 'ok');
        else if (ch.state === 'err') sp.classList.add('err');
        else if (ch.state === 'miss') sp.classList.add('miss');
        if (ch.typed != null && ch.hadErr) sp.dataset.t = ch.typed === ' ' ? '␣' : ch.typed === '\n' ? '↵' : ch.typed;
        else delete sp.dataset.t;
        refreshNote(i);
    }

    function updateTape(force) {
        const prev = G._curSpan;
        if (prev != null && G.spans[prev]) G.spans[prev].classList.remove('cur');
        if (G.cur < G.spans.length) {
            const sp = G.spans[G.cur];
            sp.classList.add('cur');
            G._curSpan = G.cur;
            const top = sp.offsetTop;
            if (force || top !== G.lastLineTop) {
                G.lastLineTop = top;
                const lh = sp.offsetHeight || 32;
                $('ad-tape-inner').style.transform = 'translateY(' + (-Math.max(0, top - lh * 0.9)) + 'px)';
            }
        }
    }

    function ghostIndex() {
        const el = elapsedMs();
        if (G.ghostTimes) {
            let lo = 0, hi = G.ghostTimes.length;
            while (lo < hi) { const m = (lo + hi) >> 1; if (G.ghostTimes[m] <= el) lo = m + 1; else hi = m; }
            return lo;
        }
        return (el / 1000) * G.cps;
    }

    function updateGhost() {
        if (G.mode !== 'flow' || !G.started) return;
        const gi = Math.min(G.chars.length - 1, Math.floor(ghostIndex()));
        if (G._ghost === gi) return;
        if (G._ghost != null && G.spans[G._ghost]) G.spans[G._ghost].classList.remove('ghost');
        if (G.spans[gi]) G.spans[gi].classList.add('ghost');
        G._ghost = gi;
    }

    // ==========================================
    // OBJECTIUS I REALIMENTACIÓ
    // ==========================================
    function updateTargets() {
        document.querySelectorAll('#ad-keyboard .mb-key.target').forEach((e) => e.classList.remove('target', 'target-mod'));
        document.querySelectorAll('.ad-fret.target').forEach((e) => e.classList.remove('target', 'target-mod'));
        if (!G || G.cur >= G.chars.length) return;
        const info = G.chars[G.cur].info;
        if (!info) return;
        const mark = (id, mod) => (KBEL[id] || []).forEach((e) => e.classList.add('target', ...(mod ? ['target-mod'] : [])));
        mark(info.key);
        if (info.shift) mark(info.shift, true);
        if (info.dead) { mark(info.dead, true); if (info.deadShift) mark(isLeft(info.f) ? 'shiftR' : 'shiftL', true); }
        document.querySelector('.ad-fret-' + info.f)?.classList.add('target');
        if (info.shiftF) document.querySelector('.ad-fret-' + info.shiftF)?.classList.add('target', 'target-mod');
        if (info.dead) document.querySelector('.ad-fret-rp')?.classList.add('target', 'target-mod');
    }

    function flashKey(id, cls) {
        (KBEL[id] || []).forEach((e) => {
            e.classList.remove('hit-ok', 'hit-bad', 'hit-mod');
            void e.offsetWidth;
            e.classList.add(cls);
            clearTimeout(e._t);
            e._t = setTimeout(() => e.classList.remove(cls), 260);
        });
    }

    function flashFret(f, cls) {
        const el = document.querySelector('.ad-fret-' + f);
        if (!el) return;
        el.classList.remove('hit-ok', 'hit-bad');
        void el.offsetWidth;
        el.classList.add(cls);
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove(cls), 280);
    }

    function showPressed(ch, ok) {
        const info = analyzeChar(ch);
        const box = $('ad-pressed');
        box.className = 'ad-pressed show ' + (ok ? 'ok' : 'bad');
        $('ad-pressed-c').textContent = ch === ' ' ? '␣' : ch === '\n' ? '↵' : ch;
        $('ad-pressed-f').textContent = info ? FINGER[info.f].name : '';
        if (info) box.style.setProperty('--fc', FINGER[info.f].color);
    }

    function judge(text, cls) {
        const j = $('ad-judge');
        j.textContent = text;
        j.className = 'ad-judge show j-' + cls;
        clearTimeout(j._t);
        j._t = setTimeout(() => j.classList.remove('show'), 650);
    }

    // ==========================================
    // ENTRADA
    // ==========================================
    function onKeyDown(e) {
        if (!$('adult-game-screen').classList.contains('active') || !G || G.finished) return;
        if (e.ctrlKey || e.metaKey) return;

        if (e.key === 'Escape') { e.preventDefault(); togglePause(); return; }
        if (e.key === 'Tab') { e.preventDefault(); startGame(G.textObj); return; }
        if (G.paused) { if (e.key.length === 1 || e.key === 'Enter') e.preventDefault(); return; }
        if (e.key === 'Shift') {
            G.lastShiftCode = e.code;
            flashKey(e.code === 'ShiftRight' ? 'shiftR' : 'shiftL', 'hit-mod');
            return;
        }
        if (e.key === 'Dead') {
            // Recordem l'accent i el componem nosaltres amb la tecla següent:
            // no depenem de si el navegador compon (ni de si la capa oculta té el focus).
            // (sense preventDefault: si el navegador compon, compositionupdate ens diu quin accent és)
            G.dead = { mark: deadMarkFromCode(e.code, e.shiftKey), code: e.code };
            const id = e.code === 'Quote' ? 'acute' : e.code === 'BracketLeft' ? 'grave' : null;
            if (id) flashKey(id, 'hit-mod');
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (G.mode === 'flow' && !G.block && G.cur > 0) {
                G.cur--;
                G.chars[G.cur].state = 'pending';
                markSpan(G.cur);
                G.combo = 0;
                flashKey('bksp', 'hit-mod');
                updateTape(); updateTargets();
            }
            return;
        }
        if (e.altKey && e.key.length !== 1) return;
        let ch = null;
        if (e.key === 'Enter') ch = '\n';
        else if (e.key.length === 1) ch = e.key;
        if (ch === null) return; // 'Process', 'Unidentified'...: ho recull la capa oculta
        e.preventDefault();
        if (G.dead) {
            ch = composeDead(ch, G.dead.mark);
            G.dead = null;
            resetHiddenInput(ch);
        } else if (e.isComposing) {
            resetHiddenInput(ch);
        }

        if (trackMode() && !G.started) {
            if (ch === '\n') begin();
            return;
        }
        typeChar(ch, e);
    }

    // ---- Accents amb tecla morta ----
    const SPACING = { '\u0301': '´', '\u0300': '`', '\u0308': '¨', '\u0302': '^' };
    const MARK_OF = { '´': '\u0301', '`': '\u0300', '¨': '\u0308', '^': '\u0302' };
    function deadMarkFromCode(code, shift) {
        // teclat espanyol: ´/¨ a la tecla 'Quote', `/^ a 'BracketLeft'
        if (code === 'Quote') return shift ? '\u0308' : '\u0301';
        if (code === 'BracketLeft') return shift ? '\u0302' : '\u0300';
        return null; // es determinarà amb compositionupdate si n'hi ha
    }
    function composeDead(ch, mark) {
        if (!mark) return ch;
        if (ch.normalize('NFD').length > 1) return ch;           // ja ve compost (é)
        if (ch === ' ') return SPACING[mark] || ch;              // accent sol
        const c = (ch + mark).normalize('NFC');
        return c.length === 1 ? c : ch;
    }
    function resetHiddenInput(ch) {
        // el navegador pot enviar després el mateix caràcter (o l'accent sol) per la capa oculta
        G.ignoreInput = { data: ch, until: performance.now() + 300 };
        const ta = $('ad-input');
        if (!ta) return;
        ta.value = '';
        // tanca qualsevol composició oberta del navegador
        ta.blur(); ta.value = ''; focusInput();
    }

    /** Capa d'entrada oculta: IME i navegadors que no envien keydown útils. */
    function onHiddenInput(e) {
        const ta = e.target;
        const data = e.data != null ? e.data : ta.value;
        ta.value = '';
        if (!G || G.finished || G.paused || !data || e.inputType === 'insertCompositionText') return;
        if (G.ignoreInput && performance.now() < G.ignoreInput.until && (data === G.ignoreInput.data || MARK_OF[data])) return;
        // composició amb accent sol i tecla morta pendent: l'ignorem
        if (G.dead && data.length === 1 && MARK_OF[data]) return;
        const now = performance.now();
        if (e.fromComposition) G._lastComp = { data, t: now };
        else if (G._lastComp && G._lastComp.data === data && now - G._lastComp.t < 80) return;
        for (const ch of data) {
            if (trackMode() && !G.started) return;
            typeChar(ch, null);
        }
    }
    function focusInput() {
        const ta = $('ad-input');
        if (ta && document.activeElement !== ta) ta.focus({ preventScroll: true });
    }

    function matches(got, exp, info) {
        if (got === exp) return true;
        if (exp === '\n' && got === ' ') return true;
        if ((G.accents || (info && info.loose)) && stripMarks(got) === stripMarks(exp)) return true;
        return false;
    }

    function typeChar(got, e) {
        if (G.cur >= G.chars.length || G.paused) return;
        begin();
        const now = performance.now();
        const i = G.cur;
        const ch = G.chars[i];
        const ok = matches(got, ch.c, ch.info);
        const gotInfo = analyzeChar(got);

        G.keystrokes.push({ i, exp: ch.c, prevExp: i > 0 ? G.chars[i - 1].c : null, got, ok, t: now - G.t0, f: ch.info.f });
        showPressed(got, ok);
        if (gotInfo) { flashKey(gotInfo.key, ok ? 'hit-ok' : 'hit-bad'); flashFret(gotInfo.f, ok ? 'hit-ok' : 'hit-bad'); }

        if (ok && ch.info.shift && e && e.shiftKey && G.lastShiftCode) {
            const used = G.lastShiftCode === 'ShiftRight' ? 'shiftR' : 'shiftL';
            if (used !== ch.info.shift) {
                G.shiftWrong++;
                judge(ch.info.shift === 'shiftR' ? 'Usa el Shift dret' : 'Usa el Shift esquerre', 'hint');
            }
        }

        if (ok) {
            ch.state = 'ok';
            G.times[i] = Math.round(now - G.t0);
            G.combo++;
            G.maxCombo = Math.max(G.maxCombo, G.combo);
            const mult = Math.min(4, 1 + Math.floor(G.combo / 15));
            if (trackMode()) {
                const offMs = ((i - G.pos) / G.cps) * 1000; // >0: abans d'hora
                let j, pts;
                if (Math.abs(offMs) <= 110) { j = 'perfect'; pts = 20; judge('Perfecte', 'perfect'); }
                else if (Math.abs(offMs) <= 260) { j = 'good'; pts = 10; judge('Bé', 'good'); }
                else if (offMs > 0) { j = 'early'; pts = 4; judge('Aviat', 'early'); }
                else { j = 'late'; pts = 4; judge('Tard', 'late'); }
                G.judges[j]++;
                G.score += pts * mult;
                pushRecent(true);
            } else {
                G.score += 10 * mult;
                if (G.combo > 0 && G.combo % 50 === 0) judge(G.combo + ' seguides!', 'perfect');
            }
            if (G._lastOkT != null) { G.samples.push(now - G._lastOkT); if (G.samples.length > 24) G.samples.shift(); }
            G._lastOkT = now;
            markSpan(i);
            G.cur++;
            skipUntypeable();
        } else {
            G.errors++;
            G.combo = 0;
            G._lastOkT = null;
            ch.hadErr = true;
            ch.typed = got;
            errBuzz();
            pushRecent(false);
            judge((got === ' ' ? 'espai' : got === '\n' ? 'retorn' : got) + ' → ' + (ch.c === ' ' ? 'espai' : ch.c === '\n' ? 'retorn' : ch.c), 'miss');
            ch.state = 'err';
            markSpan(i);
            if (G.mode === 'flow' && !G.block) {
                G.cur++;
                skipUntypeable();
            } else {
                ch.state = 'pending';
                G.spans[i].classList.add('err-now');
                refreshNote(i);
            }
        }

        updateTape();
        updateTargets();
        updateHud();
        if (G.cur >= G.chars.length) finish();
    }

    // ==========================================
    // HUD
    // ==========================================
    function elapsedMs() {
        if (!G.started) return 0;
        const end = G.finished ? G.tEnd : G.paused ? G.pausedAt : performance.now();
        return Math.max(0, end - G.t0);
    }
    const elapsedMin = () => Math.max(1 / 60, elapsedMs() / 60000);
    function correctChars() {
        let n = 0;
        for (let i = 0; i < G.cur; i++) if (G.chars[i].state === 'ok' && G.chars[i].info) n++;
        return n;
    }
    function accuracy() {
        const n = G.keystrokes.length;
        return n ? Math.round((G.keystrokes.filter((k) => k.ok).length / n) * 1000) / 10 : 100;
    }
    function consistency() {
        const s = G.samples;
        if (s.length < 6) return null;
        const m = s.reduce((a, b) => a + b, 0) / s.length;
        const sd = Math.sqrt(s.reduce((a, b) => a + (b - m) * (b - m), 0) / s.length);
        return Math.max(0, Math.round((1 - sd / m) * 100));
    }

    function updateHud() {
        const min = elapsedMin();
        $('ad-hud-wpm').textContent = G.started ? Math.round(correctChars() / 5 / min) : 0;
        $('ad-hud-acc').textContent = accuracy();
        $('ad-hud-combo').textContent = G.combo;
        const mult = Math.min(4, 1 + Math.floor(G.combo / 15));
        $('ad-hud-mult').textContent = mult > 1 ? 'combo ×' + mult : 'combo';
        $('ad-hud-combo').parentElement.classList.toggle('hot', mult > 1);
        $('ad-hud-time').textContent = fmtTime(G.started ? elapsedMs() / 1000 : 0);
        const paceEl = $('ad-hud-pace');
        if (G.mode === 'rhythm') { paceEl.textContent = G.score; paceEl.className = ''; }
        else if (G.mode === 'ramp') { paceEl.textContent = Math.round(G.wpmNow); paceEl.className = ''; }
        else {
            const d = G.started ? Math.round(G.cur - ghostIndex()) : 0;
            paceEl.textContent = (d > 0 ? '+' : d < 0 ? '−' : '±') + Math.abs(d);
            paceEl.className = d >= 0 ? 'pace-ahead' : 'pace-behind';
            updateGhost();
        }
        $('ad-progress-fill').style.width = (G.cur / G.chars.length * 100) + '%';
        const c = consistency();
        $('ad-rm-val').textContent = c == null ? '–' : c + '%';
        $('ad-rm-fill').style.height = (c == null ? 0 : c) + '%';
        $('ad-rm-fill').style.background = c == null ? '' : c > 70 ? '#30d158' : c > 50 ? '#ffd60a' : '#ff453a';
    }

    // ==========================================
    // FINAL
    // ==========================================
    /** Desa temps de pràctica i estadístiques (també en sortir a mitges). */
    function recordSession() {
        if (G._recorded || !G.started) return null;
        G._recorded = true;
        const secs = Math.round(elapsedMs() / 1000);
        store.daily[today()] = (store.daily[today()] || 0) + secs;
        let session = null;
        if (G.keystrokes.length >= 15) {
            session = analyzeSession(G.keystrokes);
            mergeGlobal(session);
        }
        saveStore();
        return session;
    }

    function finish() {
        if (G.finished) return;
        if (G.paused) { G.paused = false; }
        G.finished = true;
        G.tEnd = performance.now();
        stopLoop();
        const session = recordSession() || analyzeSession(G.keystrokes);
        const res = computeResults(session);
        const id = G.textObj.id;
        if (!G.textObj.custom && G.mode === 'flow') {
            const b = store.best[id];
            res.newBest = res.acc >= 85 && (!b || res.wpm > b.wpm);
            if (res.newBest) store.best[id] = { wpm: res.wpm, acc: res.acc, times: G.times.slice() };
            if (G.ghostTimes && b) res.vsBest = res.wpm - b.wpm;
        }
        if (G.textObj.bookId && (!trackMode() || G.cur >= G.chars.length)) {
            const bk = store.books.find((x) => x.id === G.textObj.bookId);
            if (bk && bk.pos === G.textObj.chunkIndex) bk.pos = Math.min(bk.n, bk.pos + 1);
        }
        store.history.push({ id, date: today(), wpm: res.wpm, acc: res.acc, mode: G.mode, secs: Math.round(res.min * 60), peak: G.mode === 'ramp' ? res.peak : undefined });
        if (store.history.length > 300) store.history.shift();
        saveStore();
        setTimeout(() => showResults(res, session), 350);
    }

    function computeResults(session) {
        const min = elapsedMin();
        const ok = correctChars();
        const wpm = Math.round(ok / 5 / min);
        const raw = Math.round(G.keystrokes.length / 5 / min);
        const acc = accuracy();

        const fingers = {};
        LANES.forEach((f) => (fingers[f] = { n: 0, err: 0, time: 0, tn: 0 }));
        let prev = null;
        G.keystrokes.forEach((k) => {
            const F = fingers[k.f];
            F.n++;
            if (!k.ok) F.err++;
            if (prev && prev.ok && k.ok && prev.i === k.i - 1 && k.t - prev.t < 2000) { F.time += k.t - prev.t; F.tn++; }
            prev = k;
        });

        const problems = Object.entries(session.keys)
            .filter(([, v]) => v.err > 0)
            .sort((a, b) => b[1].err - a[1].err || b[1].err / b[1].n - a[1].err / a[1].n)
            .slice(0, 8)
            .map(([c, v]) => {
                const wrong = {};
                G.keystrokes.forEach((k) => { if (k.exp === c && !k.ok) wrong[k.got] = (wrong[k.got] || 0) + 1; });
                return { c, n: v.n, err: v.err, top: Object.entries(wrong).sort((a, b) => b[1] - a[1])[0]?.[0] || '' };
            });

        // Transicions: les més lentes (mínim 2 mostres) i les que més fallen
        const bgs = Object.entries(session.bigrams).map(([k, v]) => {
            const a = analyzeChar(k[0]), c = analyzeChar(k[1]);
            return { k, n: v.n, err: v.err, ms: v.ms ? Math.round(v.ms) : null, samples: v.times.length,
                sameFinger: a && c && a.f === c.f && k[0].toLowerCase() !== k[1].toLowerCase(),
                sameKey: k[0].toLowerCase() === k[1].toLowerCase(), sameHand: a && c && isLeft(a.f) === isLeft(c.f) };
        });
        const medB = median(bgs.filter((b) => b.ms).map((b) => b.ms));
        const slow = bgs.filter((b) => b.ms && b.samples >= 2).sort((a, b) => b.ms - a.ms).slice(0, 10);
        const failing = bgs.filter((b) => b.err > 0).sort((a, b) => b.err - a.err).slice(0, 6);

        const series = [];
        const totalS = min * 60;
        const W = Math.max(3, Math.min(8, totalS / 16));
        for (let t = W; t <= totalS + 0.01; t += W) {
            const n = G.keystrokes.filter((k) => k.ok && k.t > (t - W) * 1000 && k.t <= t * 1000).length;
            series.push(Math.round((n / 5) / (W / 60)));
        }

        return { wpm, raw, acc, min, ok, errors: G.errors, maxCombo: G.maxCombo, score: G.score,
            consistency: consistency(), fingers, problems, series, judges: G.judges, shiftWrong: G.shiftWrong,
            slow, failing, medB, peak: G.peak || (G.mode === 'ramp' ? Math.round(G.wpm) : 0), endWpm: Math.round(G.wpmNow),
            hard: hardestFragment() };
    }

    /** Frase amb més errors i lentitud. */
    function hardestFragment() {
        const segs = [];
        let start = 0;
        G.chars.forEach((ch, i) => {
            if (/[.!?;:\n]/.test(ch.c) || i === G.chars.length - 1) {
                if (i - start >= 12 || i === G.chars.length - 1) { segs.push([start, i + 1]); start = i + 1; }
            }
        });
        const gaps = [];
        for (let i = 1; i < G.chars.length; i++) if (G.times[i] != null && G.times[i - 1] != null) gaps[i] = G.times[i] - G.times[i - 1];
        const medGap = median(gaps.filter((g) => g > 0 && g < 3000)) || 250;
        let best = null;
        segs.forEach(([a, b]) => {
            let errs = 0, slow = 0, n = 0;
            for (let i = a; i < b; i++) {
                const ch = G.chars[i];
                if (ch.hadErr || ch.state === 'miss') errs++;
                if (gaps[i] > 0 && gaps[i] < 3000) slow += Math.max(0, gaps[i] / medGap - 1);
                n++;
            }
            const score = (errs * 3 + slow) / Math.max(20, n) * 20;
            if (!best || score > best.score) best = { a, b, errs, score };
        });
        if (!best || best.score < 0.5) return null;
        const text = G.text.slice(best.a, best.b).replace(/\n/g, ' ').replace(/^[\s"')\]»,.;:]+/, '').trim();
        return text.length >= 8 ? { text, errs: best.errs } : null;
    }

    function showResults(r, session) {
        const t = G.textObj;
        const secs = Math.round(r.min * 60);
        const fmax = Math.max(1, ...LANES.map((f) => r.fingers[f].n));
        const fingerRows = LANES.filter((f) => r.fingers[f].n > 0).map((f) => {
            const F = r.fingers[f];
            const er = F.n ? (F.err / F.n) * 100 : 0;
            const ms = F.tn ? Math.round(F.time / F.tn) : null;
            return '<div class="ad-fr" style="--fc:' + FINGER[f].color + '">' +
                '<span class="ad-fr-name"><i></i>' + FINGER[f].name + '</span>' +
                '<span class="ad-fr-bar"><b style="width:' + (F.n / fmax * 100) + '%"></b><em style="width:' + (F.err / fmax * 100) + '%"></em></span>' +
                '<span class="ad-fr-n">' + F.n + '</span>' +
                '<span class="ad-fr-err ' + (er > 8 ? 'bad' : er > 3 ? 'mid' : 'good') + '">' + er.toFixed(1) + '%</span>' +
                '<span class="ad-fr-ms">' + (ms ? ms + ' ms' : '–') + '</span></div>';
        }).join('');

        const probs = r.problems.length ? r.problems.map((p) =>
            '<div class="ad-prob"><b>' + lbl(p.c) + '</b><span>' + p.err + '/' + p.n + '</span><small>sovint: ' + lbl(p.top) + '</small></div>').join('')
            : '<p class="ad-muted">Cap error. Impecable!</p>';

        const maxMs = Math.max(1, ...r.slow.map((b) => b.ms));
        const slowRows = r.slow.length ? r.slow.map((b) =>
            '<div class="ad-bg"><b>' + esc(b.k) + '</b><span class="ad-bg-bar"><i style="width:' + (b.ms / maxMs * 100) + '%" class="' + (b.ms > r.medB * 1.6 ? 'bad' : b.ms > r.medB * 1.25 ? 'mid' : '') + '"></i></span>' +
            '<span class="ad-bg-ms">' + b.ms + ' ms</span><span class="ad-bg-tag">' + (b.sameKey ? 'tecla repetida' : b.sameFinger ? 'mateix dit' : b.sameHand ? 'mateixa mà' : 'alternança') + '</span></div>').join('')
            : '<p class="ad-muted">Text massa curt per analitzar transicions.</p>';
        const failRows = r.failing.length ? '<div class="ad-chips">' + r.failing.map((b) => '<span class="ad-chipw"><b>' + esc(b.k) + '</b><i>' + b.err + ' errors</i></span>').join('') + '</div>' : '';

        const spark = sparkline(r.series, G.mode === 'flow' ? G.wpm : Math.round(G.wpm));
        const rhythm = trackMode()
            ? '<div class="ad-judges"><span class="j-perfect">Perfecte <b>' + r.judges.perfect + '</b></span><span class="j-good">Bé <b>' + r.judges.good + '</b></span><span class="j-early">Aviat <b>' + r.judges.early + '</b></span><span class="j-late">Tard <b>' + r.judges.late + '</b></span><span class="j-miss">Perdudes <b>' + r.judges.miss + '</b></span><span>Punts <b>' + r.score + '</b></span></div>'
            : '';
        const rampInfo = G.mode === 'ramp'
            ? '<div class="ad-ramp-banner"><b>' + r.peak + ' ppm</b><span>velocitat màxima sostinguda amb ≥93% d\'encerts' + (G.rampFail ? ' · la pista ha arribat a ' + r.endWpm + ' ppm' : ' · has acabat el text a ' + r.endWpm + ' ppm') + '</span></div>'
            : '';
        const bookNext = t.bookId ? store.books.find((x) => x.id === t.bookId) : null;

        $('ad-results').innerHTML =
            '<header class="ad-res-head"><div><h2>' + esc(t.author) + (t.section ? ' · ' + esc(t.section) : '') + '</h2><p>' + esc(t.work) + '</p></div>' +
            (r.newBest ? '<span class="ad-newbest">Nou rècord personal</span>' : r.vsBest != null ? '<span class="ad-newbest ' + (r.vsBest >= 0 ? '' : 'ad-behind') + '">' + (r.vsBest >= 0 ? '+' : '') + r.vsBest + ' ppm vs millor marca</span>' : '') + '</header>' +
            rampInfo +
            '<div class="ad-res-kpis">' +
            kpi(r.wpm, 'ppm netes', G.mode === 'flow' && r.wpm >= G.wpm ? 'good' : '') + kpi(r.acc + '%', 'precisió', r.acc >= 97 ? 'good' : r.acc < 90 ? 'bad' : '') +
            kpi(r.raw, 'ppm brutes') + kpi(r.consistency == null ? '–' : r.consistency + '%', 'regularitat') +
            kpi(r.maxCombo, 'combo màx.') + kpi(fmtTime(secs), 'temps') +
            '</div>' + rhythm +
            '<div class="ad-res-grid">' +
            '<section class="ad-panel"><h3>Velocitat durant el text <small>línia discontínua = ' + (G.mode === 'ramp' ? 'velocitat inicial' : 'objectiu') + '</small></h3>' + spark + '</section>' +
            '<section class="ad-panel"><h3>Tecles a millorar</h3><div class="ad-probs">' + probs + '</div>' +
            (r.shiftWrong ? '<p class="ad-muted">Shift del costat equivocat: ' + r.shiftWrong + ' cops (usa el Shift de la mà contrària a la lletra).</p>' : '') + '</section>' +
            '<section class="ad-panel"><h3>Transicions més lentes <small>temps entre dues tecles · mediana ' + Math.round(r.medB || 0) + ' ms</small></h3><div class="ad-bgs">' + slowRows + '</div>' +
            (failRows ? '<h3 class="ad-sub">Transicions amb errors</h3>' + failRows : '') + '</section>' +
            '<section class="ad-panel"><h3>Mapa de calor <span class="ad-seg ad-seg-sm" id="ad-heat-tg"><button data-v="err" class="on">Errors</button><button data-v="ms">Velocitat</button></span></h3>' +
            '<div class="ad-heat" id="ad-heat-session"></div><p class="ad-muted">Verd = bé · vermell = errors o lentitud. Passa el ratolí per sobre d\'una tecla per veure\'n el detall.</p></section>' +
            '<section class="ad-panel ad-panel-wide"><h3>Ús dels dits <small>pulsacions · errors · temps mitjà</small></h3><div class="ad-fingers">' + fingerRows + '</div></section>' +
            '<section class="ad-panel ad-panel-wide"><h3>Revisió del text <small><span class="leg ok">correcte</span> <span class="leg fix">corregit</span> <span class="leg err">error</span>' + (trackMode() ? ' <span class="leg miss">perduda</span>' : '') + '</small></h3><div class="ad-review">' + reviewHTML() + '</div></section>' +
            '</div>' +
            (r.hard ? '<section class="ad-panel ad-hard"><h3>Fragment més difícil <small>' + r.hard.errs + ' errors</small></h3><p>“' + esc(r.hard.text) + '”</p></section>' : '') +
            '<div class="ad-res-actions">' +
            (bookNext && bookNext.pos < bookNext.n ? '<button class="ad-btn ad-btn-primary" id="ad-res-nextsec">Següent secció</button>' : '') +
            '<button class="ad-btn ' + (bookNext ? '' : 'ad-btn-primary') + '" id="ad-res-retry">Repetir</button>' +
            (r.hard ? '<button class="ad-btn" id="ad-res-hard">Repetir el fragment difícil ×3</button>' : '') +
            ((r.problems.length || r.slow.length) ? '<button class="ad-btn" id="ad-res-drill">Practicar els punts febles</button>' : '') +
            '<button class="ad-btn" id="ad-res-back">Altres textos</button></div>';

        const heatSession = {};
        Object.entries(session.keys).forEach(([c, v]) => { heatSession[c] = { n: v.n, err: v.err, ms: v.ms, mn: v.times.length }; });
        renderHeatmap($('ad-heat-session'), heatSession, 'err');
        document.querySelectorAll('#ad-heat-tg button').forEach((b) => b.addEventListener('click', () => {
            setSeg('ad-heat-tg', b.dataset.v);
            renderHeatmap($('ad-heat-session'), heatSession, b.dataset.v);
        }));

        $('ad-res-retry').onclick = () => startGame(t);
        $('ad-res-back').onclick = () => { renderSelect(); go('adult-select-screen'); };
        if ($('ad-res-drill')) $('ad-res-drill').onclick = () => startGame(makeFocusDrill(session));
        if ($('ad-res-hard')) $('ad-res-hard').onclick = () => startGame({
            id: 'fragment', custom: true, lang: t.lang, author: 'Fragment difícil', work: t.work, text: [r.hard.text, r.hard.text, r.hard.text].join(' ')
        });
        if ($('ad-res-nextsec')) $('ad-res-nextsec').onclick = () => startBookSection(t.bookId);
        go('adult-results-screen');
    }

    const kpi = (v, l, cls) => '<div class="ad-kpi ' + (cls || '') + '"><b>' + v + '</b><span>' + l + '</span></div>';

    function reviewHTML() {
        return G.chars.map((ch) => {
            const c = ch.c === '\n' ? '↵<br>' : esc(ch.c);
            const t = esc(ch.typed === ' ' ? '␣' : ch.typed || '');
            if (ch.state === 'miss') return '<span class="miss">' + c + '</span>';
            if (ch.hadErr && ch.state === 'ok') return '<span class="fix" data-t="' + t + '">' + c + '</span>';
            if (ch.state === 'err') return '<span class="err" data-t="' + t + '">' + c + '</span>';
            if (ch.state === 'pending') return '<span class="pend">' + c + '</span>';
            return c;
        }).join('');
    }

    function sparkline(series, target, W = 520, H = 150) {
        if (series.length < 2) return '<p class="ad-muted">Text massa curt per a la gràfica.</p>';
        const P = 22;
        const max = Math.max(target * 1.2, ...series) * 1.05;
        const x = (i) => P + (i / (series.length - 1)) * (W - P * 2);
        const y = (v) => H - P - (v / max) * (H - P * 2);
        const pts = series.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
        const area = 'M' + x(0) + ',' + (H - P) + ' L' + pts.replace(/ /g, ' L') + ' L' + x(series.length - 1) + ',' + (H - P) + ' Z';
        const avg = Math.round(series.reduce((a, b) => a + b, 0) / series.length);
        return '<svg class="ad-spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" style="height:' + H + 'px">' +
            '<line x1="' + P + '" x2="' + (W - P) + '" y1="' + y(target) + '" y2="' + y(target) + '" class="tg"/>' +
            '<text x="' + (W - P) + '" y="' + (y(target) - 5) + '" text-anchor="end" class="tl">' + target + '</text>' +
            '<path d="' + area + '" class="ar"/><polyline points="' + pts + '" class="ln"/>' +
            '<text x="' + P + '" y="14" class="tl">mitjana ' + avg + ' ppm</text></svg>';
    }

    function quit() {
        if (G && !G.finished) {
            G.finished = true;
            G.tEnd = G.paused ? G.pausedAt : performance.now();
            stopLoop();
            recordSession();
        }
        renderSelect();
        go('adult-select-screen');
    }

    // ==========================================
    // BIBLIOTECA: IMPORTAR .TXT / .EPUB
    // ==========================================
    async function unzip(buf) {
        const dv = new DataView(buf);
        let eocd = -1;
        for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 70000); i--) {
            if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd < 0) throw new Error('No és un fitxer ZIP/EPUB vàlid');
        const count = dv.getUint16(eocd + 10, true);
        let off = dv.getUint32(eocd + 16, true);
        const files = {};
        const dec = new TextDecoder();
        for (let n = 0; n < count; n++) {
            if (dv.getUint32(off, true) !== 0x02014b50) break;
            const method = dv.getUint16(off + 10, true);
            const csize = dv.getUint32(off + 20, true);
            const nlen = dv.getUint16(off + 28, true), xlen = dv.getUint16(off + 30, true), clen = dv.getUint16(off + 32, true);
            const lho = dv.getUint32(off + 42, true);
            const name = dec.decode(new Uint8Array(buf, off + 46, nlen));
            files[name] = { method, csize, lho };
            off += 46 + nlen + xlen + clen;
        }
        const read = async (name) => {
            const f = files[name];
            if (!f) return null;
            const nlen = dv.getUint16(f.lho + 26, true), xlen = dv.getUint16(f.lho + 28, true);
            const data = new Uint8Array(buf, f.lho + 30 + nlen + xlen, f.csize);
            if (f.method === 0) return dec.decode(data);
            if (f.method === 8) {
                if (typeof DecompressionStream === 'undefined') throw new Error('El navegador no pot descomprimir EPUB');
                const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                return await new Response(stream).text();
            }
            throw new Error('Compressió no suportada');
        };
        return { names: Object.keys(files), read };
    }

    async function parseEpub(buf) {
        const z = await unzip(buf);
        const xml = (s) => new DOMParser().parseFromString(s, 'application/xml');
        const container = xml(await z.read('META-INF/container.xml'));
        const opfPath = container.querySelector('rootfile').getAttribute('full-path');
        const base = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';
        const opf = xml(await z.read(opfPath));
        const title = opf.getElementsByTagName('dc:title')[0]?.textContent || 'Llibre';
        const author = opf.getElementsByTagName('dc:creator')[0]?.textContent || '';
        const manifest = {};
        [...opf.getElementsByTagName('item')].forEach((it) => { manifest[it.getAttribute('id')] = it.getAttribute('href'); });
        const spine = [...opf.getElementsByTagName('itemref')].map((r) => manifest[r.getAttribute('idref')]).filter(Boolean);
        const chapters = [];
        for (const href of spine) {
            const path = decodeURIComponent(base + href.split('#')[0]);
            const html = await z.read(path);
            if (!html) continue;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const head = doc.querySelector('h1, h2, h3')?.textContent.trim() || '';
            let paras = [...doc.querySelectorAll('p, h1, h2, h3, h4, li, blockquote')].map((p) => p.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
            if (!paras.length) paras = (doc.body?.textContent || '').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
            if (paras.join(' ').length > 200) chapters.push({ title: head, paras });
        }
        return { title, author, chapters };
    }

    function parseTxt(text, filename) {
        let t = text.replace(/\r/g, '');
        const s = t.indexOf('*** START'), e = t.indexOf('*** END');
        if (s >= 0) t = t.slice(t.indexOf('\n', s) + 1, e > s ? e : undefined);
        const paras = t.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
        return { title: filename.replace(/\.[^.]+$/, ''), author: '', chapters: [{ title: '', paras }] };
    }

    /** Divideix en seccions de ~600-1300 caràcters respectant paràgrafs i frases. */
    function chunkBook(book) {
        const chunks = [];
        book.chapters.forEach((ch, ci) => {
            let cur = [], len = 0;
            const flush = () => { if (len) chunks.push({ ch: ch.title || ('Capítol ' + (ci + 1)), text: cur.join('\n') }); cur = []; len = 0; };
            ch.paras.forEach((p) => {
                const parts = p.length > 1300 ? p.match(/[^.!?]+[.!?]+["')»]*\s*|[^.!?]+$/g) || [p] : [p];
                let buf = '';
                const pieces = [];
                parts.forEach((s) => { if ((buf + s).length > 1100 && buf) { pieces.push(buf.trim()); buf = ''; } buf += s; });
                if (buf.trim()) pieces.push(buf.trim());
                pieces.forEach((piece) => {
                    if (len + piece.length > 1300 && len >= 500) flush();
                    cur.push(piece); len += piece.length;
                    if (len >= 1000) flush();
                });
            });
            flush();
        });
        return chunks.filter((c) => normalizeText(c.text).length > 40);
    }

    async function importBook(file) {
        const st = $('ad-import-status');
        if (st) st.textContent = 'Llegint ' + file.name + '…';
        try {
            const buf = await file.arrayBuffer();
            const book = /\.epub$/i.test(file.name) ? await parseEpub(buf) : parseTxt(new TextDecoder().decode(buf), file.name);
            const chunks = chunkBook(book);
            if (!chunks.length) throw new Error('No s\'hi ha trobat text');
            const id = 'b' + Date.now().toString(36);
            const meta = { id, title: book.title, author: book.author, n: chunks.length, pos: 0, stored: true };
            try { localStorage.setItem(STORE_KEY + '_book_' + id, JSON.stringify(chunks)); }
            catch (e) { meta.stored = false; memBooks[id] = chunks; }
            store.books.push(meta);
            saveStore();
            renderLibrary();
        } catch (err) {
            if (st) st.textContent = 'No s\'ha pogut importar: ' + err.message;
        }
    }

    function startBookSection(bookId) {
        const bk = store.books.find((x) => x.id === bookId);
        const chunks = bk && bookChunks(bookId);
        if (!chunks) { renderLibrary(); return; }
        const i = Math.min(bk.pos, chunks.length - 1);
        startGame({
            id: 'book:' + bookId + ':' + i, custom: true, bookId, chunkIndex: i, lang: 'all',
            author: bk.title, section: 'Secció ' + (i + 1) + '/' + bk.n, work: chunks[i].ch, year: '', text: chunks[i].text
        });
    }

    // ==========================================
    // INICIALITZACIÓ
    // ==========================================
    function init() {
        if (!window.ADULT_TEXTS || !$('adult-select-screen')) return;
        loadStore();
        setLayout(store.settings.layout);
        buildGameKeyboard();
        buildHighway();

        document.querySelectorAll('[data-screen="adult-select-screen"]').forEach((b) =>
            b.addEventListener('click', () => setTimeout(renderSelect, 0)));

        const seg = (id, key, after) => document.querySelectorAll('#' + id + ' button').forEach((b) =>
            b.addEventListener('click', () => {
                store.settings[key] = b.dataset.v;
                saveStore();
                setSeg(id, b.dataset.v);
                if (after) after(b.dataset.v);
            }));
        seg('ad-lang', 'lang', () => { renderTexts(); renderTraining(); });
        seg('ad-mode', 'mode', (v) => { $('ad-wpm-label').textContent = v === 'ramp' ? 'Velocitat inicial' : 'Objectiu'; });
        seg('ad-ghost', 'ghost');
        seg('ad-aids', 'aids');
        seg('ad-goal', 'goal', renderProgress);
        seg('ad-layout', 'layout', (v) => { setLayout(v); buildGameKeyboard(); buildHighway(); renderSelect(); });
        $('ad-wpm').addEventListener('input', (e) => {
            store.settings.wpm = +e.target.value;
            $('ad-wpm-val').textContent = e.target.value;
        });
        $('ad-wpm').addEventListener('change', () => { saveStore(); renderTexts(); renderProgress(); });
        [['ad-opt-metro', 'metro'], ['ad-opt-block', 'block'], ['ad-opt-accents', 'accents'], ['ad-opt-autopause', 'autopause']].forEach(([id, k]) =>
            $(id).addEventListener('change', (e) => { store.settings[k] = e.target.checked; saveStore(); }));

        $('ad-custom-start').addEventListener('click', () => {
            const txt = $('ad-custom-text').value;
            if (normalizeText(txt).length < 5) return;
            startGame({ id: 'custom', custom: true, lang: 'all', author: 'Text propi', work: normalizeText(txt).slice(0, 40) + '…', year: '', text: txt });
        });
        $('ad-quit').addEventListener('click', quit);
        $('ad-pause-btn').addEventListener('click', togglePause);
        $('ad-resume').addEventListener('click', resume);
        $('ad-restart').addEventListener('click', () => startGame(G.textObj));
        $('ad-pause-quit').addEventListener('click', quit);

        const ta = document.createElement('textarea');
        ta.id = 'ad-input';
        ta.className = 'ad-hidden-input';
        ['autocomplete', 'autocorrect', 'autocapitalize'].forEach((a) => ta.setAttribute(a, 'off'));
        ta.setAttribute('spellcheck', 'false');
        ta.setAttribute('aria-hidden', 'true');
        $('adult-game-screen').appendChild(ta);
        ta.addEventListener('input', onHiddenInput);
        ta.addEventListener('compositionupdate', (e) => {
            if (G && G.dead && !G.dead.mark && e.data && MARK_OF[e.data]) G.dead.mark = MARK_OF[e.data];
        });
        ta.addEventListener('compositionend', (e) => { if (e.data) { ta.value = ''; onHiddenInput({ target: ta, data: e.data, inputType: 'insertText', fromComposition: true }); } });
        $('adult-game-screen').addEventListener('mousedown', (e) => { if (e.target.closest('button')) return; e.preventDefault(); focusInput(); });

        document.addEventListener('keydown', onKeyDown);
        const autoPause = () => {
            if (store.settings.autopause !== false && G && G.started && !G.finished && $('adult-game-screen').classList.contains('active')) pause(true);
        };
        document.addEventListener('visibilitychange', () => { if (document.hidden) autoPause(); });
        window.addEventListener('blur', autoPause);
        window.addEventListener('resize', () => { if (G && !G.finished) updateTape(true); });
        renderSelect();
    }

    // exposat només per a proves
    window.__adultMode = {
        analyzeChar, normalizeText, weakPoints, analyzeSession, chunkBook, parseTxt,
        makeAdaptive, makeDrill, setLayout, pause, resume, store,
        get state() { return G; }
    };

    document.addEventListener('DOMContentLoaded', init);
})();
