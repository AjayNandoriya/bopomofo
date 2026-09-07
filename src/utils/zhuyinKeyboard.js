/**
 * Taiwan Standard Dai Chien (大千) Zhuyin Keyboard Mapping & Helper Utilities
 */

export const KEY_TO_ZHUYIN = {
    // Number Row
    '1': 'ㄅ',
    '2': 'ㄉ',
    '3': 'ˇ', // 3rd tone
    '4': 'ˋ', // 4th tone
    '5': 'ㄓ',
    '6': 'ˊ', // 2nd tone
    '7': '˙', // 5th / neutral tone
    '8': 'ㄚ',
    '9': 'ㄞ',
    '0': 'ㄢ',
    '-': 'ㄦ',

    // Q Row
    'q': 'ㄆ', 'Q': 'ㄆ',
    'w': 'ㄊ', 'W': 'ㄊ',
    'e': 'ㄍ', 'E': 'ㄍ',
    'r': 'ㄐ', 'R': 'ㄐ',
    't': 'ㄔ', 'T': 'ㄔ',
    'y': 'ㄗ', 'Y': 'ㄗ',
    'u': 'ㄧ', 'U': 'ㄧ',
    'i': 'ㄛ', 'I': 'ㄛ',
    'o': 'ㄟ', 'O': 'ㄟ',
    'p': 'ㄣ', 'P': 'ㄣ',

    // A Row
    'a': 'ㄇ', 'A': 'ㄇ',
    's': 'ㄋ', 'S': 'ㄋ',
    'd': 'ㄎ', 'D': 'ㄎ',
    'f': 'ㄑ', 'F': 'ㄑ',
    'g': 'ㄕ', 'G': 'ㄕ',
    'h': 'ㄘ', 'H': 'ㄘ',
    'j': 'ㄨ', 'J': 'ㄨ',
    'k': 'ㄜ', 'K': 'ㄜ',
    'l': 'ㄠ', 'L': 'ㄠ',
    ';': 'ㄤ',

    // Z Row
    'z': 'ㄈ', 'Z': 'ㄈ',
    'x': 'ㄌ', 'X': 'ㄌ',
    'c': 'ㄏ', 'C': 'ㄏ',
    'v': 'ㄒ', 'V': 'ㄒ',
    'b': 'ㄖ', 'B': 'ㄖ',
    'n': 'ㄙ', 'N': 'ㄙ',
    'm': 'ㄩ', 'M': 'ㄩ',
    ',': 'ㄝ',
    '.': 'ㄡ',
    '/': 'ㄥ',

    // Spacebar - 1st Tone (or space)
    ' ': ' '
};

export const ZHUYIN_TO_KEY = {
    // Initials
    'ㄅ': '1', 'ㄆ': 'q', 'ㄇ': 'a', 'ㄈ': 'z',
    'ㄉ': '2', 'ㄊ': 'w', 'ㄋ': 's', 'ㄌ': 'x',
    'ㄍ': 'e', 'ㄎ': 'd', 'ㄏ': 'c',
    'ㄐ': 'r', 'ㄑ': 'f', 'ㄒ': 'v',
    'ㄓ': '5', 'ㄔ': 't', 'ㄕ': 'g', 'ㄖ': 'b',
    'ㄗ': 'y', 'ㄘ': 'h', 'ㄙ': 'n',

    // Medials
    'ㄧ': 'u', 'ㄨ': 'j', 'ㄩ': 'm',

    // Finals
    'ㄚ': '8', 'ㄛ': 'i', 'ㄜ': 'k', 'ㄝ': ',',
    'ㄞ': '9', 'ㄟ': 'o', 'ㄠ': 'l', 'ㄡ': '.',
    'ㄢ': '0', 'ㄣ': 'p', 'ㄤ': ';', 'ㄥ': '/',
    'ㄦ': '-',

    // Tones
    'ˊ': '6', // 2nd tone
    'ˇ': '3', // 3rd tone
    'ˋ': '4', // 4th tone
    '˙': '7', // neutral tone
    ' ': 'Space' // 1st tone
};

export const ZHUYIN_CATEGORIES = {
    INITIALS: new Set(['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ']),
    MEDIALS: new Set(['ㄧ', 'ㄨ', 'ㄩ']),
    FINALS: new Set(['ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ']),
    TONES: new Set(['ˊ', 'ˇ', 'ˋ', '˙', ' '])
};

export const getZhuyinType = (char) => {
    if (ZHUYIN_CATEGORIES.INITIALS.has(char)) return 'initial';
    if (ZHUYIN_CATEGORIES.MEDIALS.has(char)) return 'medial';
    if (ZHUYIN_CATEGORIES.FINALS.has(char)) return 'final';
    if (ZHUYIN_CATEGORIES.TONES.has(char)) return 'tone';
    return 'other';
};

/**
 * Visual definition of full standard keyboard
 */
export const VIRTUAL_KEYBOARD_LAYOUT = [
    // Row 1
    [
        { key: '`', label: '`', sub: '~', type: 'func' },
        { key: '1', label: '1', sub: 'ㄅ', zhuyin: 'ㄅ', type: 'initial' },
        { key: '2', label: '2', sub: 'ㄉ', zhuyin: 'ㄉ', type: 'initial' },
        { key: '3', label: '3', sub: 'ˇ', zhuyin: 'ˇ', type: 'tone' },
        { key: '4', label: '4', sub: 'ˋ', zhuyin: 'ˋ', type: 'tone' },
        { key: '5', label: '5', sub: 'ㄓ', zhuyin: 'ㄓ', type: 'initial' },
        { key: '6', label: '6', sub: 'ˊ', zhuyin: 'ˊ', type: 'tone' },
        { key: '7', label: '7', sub: '˙', zhuyin: '˙', type: 'tone' },
        { key: '8', label: '8', sub: 'ㄚ', zhuyin: 'ㄚ', type: 'final' },
        { key: '9', label: '9', sub: 'ㄞ', zhuyin: 'ㄞ', type: 'final' },
        { key: '0', label: '0', sub: 'ㄢ', zhuyin: 'ㄢ', type: 'final' },
        { key: '-', label: '-', sub: 'ㄦ', zhuyin: 'ㄦ', type: 'final' },
        { key: '=', label: '=', sub: '+', type: 'func' },
        { key: 'Backspace', label: '⌫ Back', width: 'w-16', type: 'action' }
    ],
    // Row 2
    [
        { key: 'Tab', label: 'Tab', width: 'w-14', type: 'func' },
        { key: 'q', label: 'Q', sub: 'ㄆ', zhuyin: 'ㄆ', type: 'initial' },
        { key: 'w', label: 'W', sub: 'ㄊ', zhuyin: 'ㄊ', type: 'initial' },
        { key: 'e', label: 'E', sub: 'ㄍ', zhuyin: 'ㄍ', type: 'initial' },
        { key: 'r', label: 'R', sub: 'ㄐ', zhuyin: 'ㄐ', type: 'initial' },
        { key: 't', label: 'T', sub: 'ㄔ', zhuyin: 'ㄔ', type: 'initial' },
        { key: 'y', label: 'Y', sub: 'ㄗ', zhuyin: 'ㄗ', type: 'initial' },
        { key: 'u', label: 'U', sub: 'ㄧ', zhuyin: 'ㄧ', type: 'medial' },
        { key: 'i', label: 'I', sub: 'ㄛ', zhuyin: 'ㄛ', type: 'final' },
        { key: 'o', label: 'O', sub: 'ㄟ', zhuyin: 'ㄟ', type: 'final' },
        { key: 'p', label: 'P', sub: 'ㄣ', zhuyin: 'ㄣ', type: 'final' },
        { key: '[', label: '[', sub: '{', type: 'func' },
        { key: ']', label: ']', sub: '}', type: 'func' },
        { key: '\\', label: '\\', sub: '|', type: 'func' }
    ],
    // Row 3
    [
        { key: 'Caps', label: 'Caps', width: 'w-16', type: 'func' },
        { key: 'a', label: 'A', sub: 'ㄇ', zhuyin: 'ㄇ', type: 'initial' },
        { key: 's', label: 'S', sub: 'ㄋ', zhuyin: 'ㄋ', type: 'initial' },
        { key: 'd', label: 'D', sub: 'ㄎ', zhuyin: 'ㄎ', type: 'initial' },
        { key: 'f', label: 'F', sub: 'ㄑ', zhuyin: 'ㄑ', type: 'initial' },
        { key: 'g', label: 'G', sub: 'ㄕ', zhuyin: 'ㄕ', type: 'initial' },
        { key: 'h', label: 'H', sub: 'ㄘ', zhuyin: 'ㄘ', type: 'initial' },
        { key: 'j', label: 'J', sub: 'ㄨ', zhuyin: 'ㄨ', type: 'medial' },
        { key: 'k', label: 'K', sub: 'ㄜ', zhuyin: 'ㄜ', type: 'final' },
        { key: 'l', label: 'L', sub: 'ㄠ', zhuyin: 'ㄠ', type: 'final' },
        { key: ';', label: ';', sub: 'ㄤ', zhuyin: 'ㄤ', type: 'final' },
        { key: "'", label: "'", sub: '"', type: 'func' },
        { key: 'Enter', label: 'Enter ↵', width: 'w-18', type: 'action' }
    ],
    // Row 4
    [
        { key: 'ShiftLeft', label: 'Shift', width: 'w-20', type: 'func' },
        { key: 'z', label: 'Z', sub: 'ㄈ', zhuyin: 'ㄈ', type: 'initial' },
        { key: 'x', label: 'X', sub: 'ㄌ', zhuyin: 'ㄌ', type: 'initial' },
        { key: 'c', label: 'C', sub: 'ㄏ', zhuyin: 'ㄏ', type: 'initial' },
        { key: 'v', label: 'V', sub: 'ㄒ', zhuyin: 'ㄒ', type: 'initial' },
        { key: 'b', label: 'B', sub: 'ㄖ', zhuyin: 'ㄖ', type: 'initial' },
        { key: 'n', label: 'N', sub: 'ㄙ', zhuyin: 'ㄙ', type: 'initial' },
        { key: 'm', label: 'M', sub: 'ㄩ', zhuyin: 'ㄩ', type: 'medial' },
        { key: ',', label: ',', sub: 'ㄝ', zhuyin: 'ㄝ', type: 'final' },
        { key: '.', label: '.', sub: 'ㄡ', zhuyin: 'ㄡ', type: 'final' },
        { key: '/', label: '/', sub: 'ㄥ', zhuyin: 'ㄥ', type: 'final' },
        { key: 'ShiftRight', label: 'Shift', width: 'w-20', type: 'func' }
    ],
    // Row 5
    [
        { key: ' ', label: 'Space  (一聲 / 1st Tone)', sub: '空白鍵', zhuyin: ' ', width: 'w-80 md:w-96', type: 'tone' }
    ]
];

/**
 * Mobile touch-optimized Zhuyin keyboard layout (clean, thumb-friendly grid without PC modifier keys)
 */
export const MOBILE_KEYBOARD_LAYOUT = [
    // Row 1 (11 keys)
    [
        { key: '1', label: 'ㄅ', sub: '1', zhuyin: 'ㄅ', type: 'initial' },
        { key: '2', label: 'ㄉ', sub: '2', zhuyin: 'ㄉ', type: 'initial' },
        { key: '3', label: 'ˇ', sub: '3', zhuyin: 'ˇ', type: 'tone' },
        { key: '4', label: 'ˋ', sub: '4', zhuyin: 'ˋ', type: 'tone' },
        { key: '5', label: 'ㄓ', sub: '5', zhuyin: 'ㄓ', type: 'initial' },
        { key: '6', label: 'ˊ', sub: '6', zhuyin: 'ˊ', type: 'tone' },
        { key: '7', label: '˙', sub: '7', zhuyin: '˙', type: 'tone' },
        { key: '8', label: 'ㄚ', sub: '8', zhuyin: 'ㄚ', type: 'final' },
        { key: '9', label: 'ㄞ', sub: '9', zhuyin: 'ㄞ', type: 'final' },
        { key: '0', label: 'ㄢ', sub: '0', zhuyin: 'ㄢ', type: 'final' },
        { key: '-', label: 'ㄦ', sub: '-', zhuyin: 'ㄦ', type: 'final' }
    ],
    // Row 2 (10 keys)
    [
        { key: 'q', label: 'ㄆ', sub: 'Q', zhuyin: 'ㄆ', type: 'initial' },
        { key: 'w', label: 'ㄊ', sub: 'W', zhuyin: 'ㄊ', type: 'initial' },
        { key: 'e', label: 'ㄍ', sub: 'E', zhuyin: 'ㄍ', type: 'initial' },
        { key: 'r', label: 'ㄐ', sub: 'R', zhuyin: 'ㄐ', type: 'initial' },
        { key: 't', label: 'ㄔ', sub: 'T', zhuyin: 'ㄔ', type: 'initial' },
        { key: 'y', label: 'ㄗ', sub: 'Y', zhuyin: 'ㄗ', type: 'initial' },
        { key: 'u', label: 'ㄧ', sub: 'U', zhuyin: 'ㄧ', type: 'medial' },
        { key: 'i', label: 'ㄛ', sub: 'I', zhuyin: 'ㄛ', type: 'final' },
        { key: 'o', label: 'ㄟ', sub: 'O', zhuyin: 'ㄟ', type: 'final' },
        { key: 'p', label: 'ㄣ', sub: 'P', zhuyin: 'ㄣ', type: 'final' }
    ],
    // Row 3 (10 keys)
    [
        { key: 'a', label: 'ㄇ', sub: 'A', zhuyin: 'ㄇ', type: 'initial' },
        { key: 's', label: 'ㄋ', sub: 'S', zhuyin: 'ㄋ', type: 'initial' },
        { key: 'd', label: 'ㄎ', sub: 'D', zhuyin: 'ㄎ', type: 'initial' },
        { key: 'f', label: 'ㄑ', sub: 'F', zhuyin: 'ㄑ', type: 'initial' },
        { key: 'g', label: 'ㄕ', sub: 'G', zhuyin: 'ㄕ', type: 'initial' },
        { key: 'h', label: 'ㄘ', sub: 'H', zhuyin: 'ㄘ', type: 'initial' },
        { key: 'j', label: 'ㄨ', sub: 'J', zhuyin: 'ㄨ', type: 'medial' },
        { key: 'k', label: 'ㄜ', sub: 'K', zhuyin: 'ㄜ', type: 'final' },
        { key: 'l', label: 'ㄠ', sub: 'L', zhuyin: 'ㄠ', type: 'final' },
        { key: ';', label: 'ㄤ', sub: ';', zhuyin: 'ㄤ', type: 'final' }
    ],
    // Row 4 (11 keys: 10 symbols + Backspace)
    [
        { key: 'z', label: 'ㄈ', sub: 'Z', zhuyin: 'ㄈ', type: 'initial' },
        { key: 'x', label: 'ㄌ', sub: 'X', zhuyin: 'ㄌ', type: 'initial' },
        { key: 'c', label: 'ㄏ', sub: 'C', zhuyin: 'ㄏ', type: 'initial' },
        { key: 'v', label: 'ㄒ', sub: 'V', zhuyin: 'ㄒ', type: 'initial' },
        { key: 'b', label: 'ㄖ', sub: 'B', zhuyin: 'ㄖ', type: 'initial' },
        { key: 'n', label: 'ㄙ', sub: 'N', zhuyin: 'ㄙ', type: 'initial' },
        { key: 'm', label: 'ㄩ', sub: 'M', zhuyin: 'ㄩ', type: 'medial' },
        { key: ',', label: 'ㄝ', sub: ',', zhuyin: 'ㄝ', type: 'final' },
        { key: '.', label: 'ㄡ', sub: '.', zhuyin: 'ㄡ', type: 'final' },
        { key: '/', label: 'ㄥ', sub: '/', zhuyin: 'ㄥ', type: 'final' },
        { key: 'Backspace', label: '⌫', sub: 'Del', width: 'flex-[1.4]', type: 'action' }
    ],
    // Row 5 (Spacebar / 1st tone)
    [
        { key: ' ', label: 'Space (一聲 / 1st Tone)', sub: '空白鍵', zhuyin: ' ', width: 'w-full max-w-sm', type: 'tone' }
    ]
];


/**
 * Decomposes a target Zhuyin string into ordered components (symbols and tone)
 * Examples:
 * 'ㄏㄠˇ' -> { symbols: ['ㄏ', 'ㄠ'], tone: 'ˇ', expectedSequence: ['ㄏ', 'ㄠ', 'ˇ'] }
 * '˙ㄉㄜ' -> { symbols: ['ㄉ', 'ㄜ'], tone: '˙', expectedSequence: ['ㄉ', 'ㄜ', '˙'] }
 * 'ㄊㄧㄢ' -> { symbols: ['ㄊ', 'ㄧ', 'ㄢ'], tone: '', expectedSequence: ['ㄊ', 'ㄧ', 'ㄢ'] }
 */
export const decomposeZhuyin = (zhuyinStr) => {
    if (!zhuyinStr) return { symbols: [], tone: '', expectedSequence: [], toneNum: 1 };

    let tone = '';
    let toneNum = 1;
    const symbols = [];

    for (const char of zhuyinStr) {
        if (char === 'ˊ') {
            tone = 'ˊ';
            toneNum = 2;
        } else if (char === 'ˇ') {
            tone = 'ˇ';
            toneNum = 3;
        } else if (char === 'ˋ') {
            tone = 'ˋ';
            toneNum = 4;
        } else if (char === '˙') {
            tone = '˙';
            toneNum = 5;
        } else {
            symbols.push(char);
        }
    }

    // When typing, tone is always typed at the end!
    // For 1st tone, in standard Zhuyin typing, pressing space specifies tone 1.
    const expectedSequence = [...symbols];
    if (tone) {
        expectedSequence.push(tone);
    }

    return {
        symbols,
        tone,
        toneNum,
        expectedSequence,
        canonicalString: tone ? (tone === '˙' ? `˙${symbols.join('')}` : `${symbols.join('')}${tone}`) : symbols.join('')
    };
};

/**
 * Checks if user's input buffer matches the target Zhuyin syllable.
 * Also returns whether the input is a valid prefix (so far so good) or incorrect.
 */
export const evaluateZhuyinInput = (inputBuffer, targetZhuyin) => {
    if (!targetZhuyin) return { matched: true, isPrefix: true, nextExpected: null };

    const { symbols, tone, expectedSequence } = decomposeZhuyin(targetZhuyin);
    const cleanInput = inputBuffer.trim();

    // If tone is 1 (unmarked):
    // The user may complete by typing just all symbols, OR all symbols + space.
    if (!tone) {
        const symbolsStr = symbols.join('');
        // If input equals symbolsStr, or symbolsStr + ' '
        if (cleanInput === symbolsStr || inputBuffer === `${symbolsStr} `) {
            return { matched: true, isPrefix: true, nextExpected: null };
        }
        if (symbolsStr.startsWith(cleanInput)) {
            const nextExpectedChar = symbols[cleanInput.length] || ' ';
            return {
                matched: false,
                isPrefix: true,
                nextExpected: nextExpectedChar,
                nextKey: ZHUYIN_TO_KEY[nextExpectedChar] || 'Space'
            };
        }
        return { matched: false, isPrefix: false, nextExpected: null };
    }

    // For tones 2, 3, 4, 5:
    // Expected order: symbols then tone mark
    const expectedTypingString = `${symbols.join('')}${tone}`;
    // Also allow neutral tone typed either before or after:
    const altNeutralString = tone === '˙' ? `˙${symbols.join('')}` : null;

    if (inputBuffer === expectedTypingString || (altNeutralString && inputBuffer === altNeutralString)) {
        return { matched: true, isPrefix: true, nextExpected: null };
    }

    if (expectedTypingString.startsWith(inputBuffer)) {
        const nextExpectedChar = expectedSequence[inputBuffer.length] || null;
        return {
            matched: false,
            isPrefix: true,
            nextExpected: nextExpectedChar,
            nextKey: nextExpectedChar ? (ZHUYIN_TO_KEY[nextExpectedChar] || null) : null
        };
    }

    return { matched: false, isPrefix: false, nextExpected: null };
};

/**
 * Lightweight Web Audio API Synthesizer for pleasant typing sound effects
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playTone(freq, duration = 0.08, type = 'sine', gainVal = 0.1) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio error non-blocking
        }
    }

    playKeypress() {
        this.playTone(600, 0.04, 'triangle', 0.05);
    }

    playCharSuccess() {
        this.playTone(880, 0.08, 'sine', 0.12);
        setTimeout(() => this.playTone(1320, 0.1, 'sine', 0.12), 40);
    }

    playError() {
        this.playTone(220, 0.12, 'sawtooth', 0.08);
    }

    playComplete() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'sine', 0.15), i * 90);
        });
    }
}

export const soundEffects = new SoundEngine();
