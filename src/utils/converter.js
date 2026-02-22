import * as OpenCC from 'opencc-js';
import { pinyin } from 'pinyin-pro';

// Initialize OpenCC converter
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

/**
 * Converts Simplified Chinese to Traditional Chinese
 * @param {string} text 
 * @returns {Promise<string>}
 */
export const toTraditional = async (text) => {
    return converter(text);
};

// Pinyin to Zhuyin mapping tables
const initials = {
    'b': 'ㄅ', 'p': 'ㄆ', 'm': 'ㄇ', 'f': 'ㄈ',
    'd': 'ㄉ', 't': 'ㄊ', 'n': 'ㄋ', 'l': 'ㄌ',
    'g': 'ㄍ', 'k': 'ㄎ', 'h': 'ㄏ',
    'j': 'ㄐ', 'q': 'ㄑ', 'x': 'ㄒ',
    'zh': 'ㄓ', 'ch': 'ㄔ', 'sh': 'ㄕ', 'r': 'ㄖ',
    'z': 'ㄗ', 'c': 'ㄘ', 's': 'ㄙ',
    'y': 'ㄧ', 'w': 'ㄨ'
};

const finals = {
    'a': 'ㄚ', 'o': 'ㄛ', 'e': 'ㄜ', 'i': 'ㄧ', 'u': 'ㄨ', 'v': 'ㄩ', 'ü': 'ㄩ',
    'ai': 'ㄞ', 'ei': 'ㄟ', 'ui': 'ㄨㄟ', 'ao': 'ㄠ', 'ou': 'ㄡ', 'iu': 'ㄧㄡ',
    'ie': 'ㄧㄝ', 've': 'ㄩㄝ', 'üe': 'ㄩㄝ', 'er': 'ㄦ',
    'an': 'ㄢ', 'en': 'ㄣ', 'in': 'ㄧㄣ', 'un': 'ㄨㄣ', 'vn': 'ㄩㄣ', 'ün': 'ㄩㄣ',
    'ang': 'ㄤ', 'eng': 'ㄥ', 'ing': 'ㄧㄥ', 'ong': 'ㄨㄥ',
    // Special combinations
    'ia': 'ㄧㄚ', 'ua': 'ㄨㄚ',
    'uo': 'ㄨㄛ',
    'iai': 'ㄧㄞ', 'uai': 'ㄨㄞ',
    'iao': 'ㄧㄠ',
    'ian': 'ㄧㄢ', 'uan': 'ㄨㄢ',
    'iang': 'ㄧㄤ', 'uang': 'ㄨㄤ',
    'iong': 'ㄩㄥ',
    'ue': 'ㄩㄝ'
};

const tones = {
    1: '',    // First tone (no mark)
    2: 'ˊ',   // Second tone
    3: 'ˇ',   // Third tone
    4: 'ˋ',   // Fourth tone
    0: '˙',   // Neutral tone (often represented as 5 or 0)
    5: '˙'
};

/**
 * Converts a pinyin syllable to zhuyin
 * @param {string} pinyinStr 
 * @returns {string}
 */
const convertPinyinToZhuyin = (pinyinStr) => {
    if (!pinyinStr || pinyinStr === ' ') return '';

    // Handle neutral tone specifically if it comes as 0 or 5
    // pinyin-pro with type='array' usually gives tone as separate property or number at end
    // But we will use 'toneType: num' to get numbers.

    // Simple parsing logic (imperfect but functional for most)
    let tone = 1;
    let base = pinyinStr;
    const lastChar = pinyinStr.slice(-1);
    if (/[0-5]/.test(lastChar)) {
        tone = parseInt(lastChar);
        base = pinyinStr.slice(0, -1);
    }

    // Special case for 'yi', 'wu', 'yu' which are 'i', 'u', 'v' sounds
    // but in pinyin they act as initials.
    if (base === 'yi') base = 'i';
    else if (base === 'wu') base = 'u';
    else if (base === 'yu') base = 'v';
    else if (base === 'ju') base = 'jv'; // 'ju' -> 'j' + 'ü'
    else if (base === 'qu') base = 'qv';
    else if (base === 'xu') base = 'xv';

    // Parsing initial and final
    let initial = '';
    let final = base;

    // Greedy match for initial (2 chars then 1 char)
    if (base.length >= 2 && initials[base.slice(0, 2)]) {
        initial = initials[base.slice(0, 2)];
        final = base.slice(2);
    } else if (base.length >= 1 && initials[base.slice(0, 1)]) {
        // Exclude y and w if they are part of special handling above?
        // Actually standard parsing:
        initial = initials[base.slice(0, 1)];
        final = base.slice(1);
    }

    // Map initial and final
    const zhuyinInitial = initial; // Already mapped

    // Map final (need to handle combinations if not in map directly)
    // Some finals starts with i, u, v are combinations
    // The map above covers most standard finals.

    let zhuyinFinal = finals[final] || '';

    // If no direct final match, try to split (e.g., 'iang' -> 'i' + 'ang' might be needed if map incomplete,
    // but my map has 'iang'.
    // One special case: 'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si'
    // in pinyin they end in 'i' but in zhuyin they are just the initial.
    if (['zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si'].includes(base)) {
        zhuyinFinal = '';
    }

    // Special handling: 'y' -> 'i', 'w' -> 'u' when initial is used?
    // Actually standard pinyin 'yan' -> 'i' + 'an'.
    // If I map 'y' to 'ㄧ' and 'an' to 'ㄢ', it becomes 'ㄧㄢ'.

    // Re-verify my simple logic:
    // 'shuang' -> 'sh' + 'uang' -> 'ㄕ' + 'ㄨㄤ'. Correct.

    const zhuyinTone = tones[tone] || '';

    // Tone 5 (neutral) usually goes first? Or last?
    // In Taiwan standard, expected: ˙ (neutral) before, others after.
    // e.g. ˙ㄇㄚ (ma), ㄇㄚˊ (ma2).
    // Let's stick to standard position (right side / after) for 2,3,4.
    // Use dot for light tone.

    if (tone === 0 || tone === 5) {
        return zhuyinTone + zhuyinInitial + zhuyinFinal;
    }
    return zhuyinInitial + zhuyinFinal + zhuyinTone;
};

/**
 * Annotates text with Zhuyin
 * @param {string} text - Traditional Chinese text
 * @returns {Array<{char: string, zhuyin: string}>}
 */
export const annotateZhuyin = (text) => {
    // Get pinyin array with tone numbers
    const pyData = pinyin(text, { type: 'array', toneType: 'num', nonZh: 'consecutive' });

    // pyData might mismatch length if non-chinese chars are grouped.
    // e.g. 'Hello世界' -> ['Hello', 'shi4', 'jie4']

    // We need to align with original text characters for display?
    // Or we just output what pinyin gives us?
    // The UI wants vertical alignment. Ideally 1 char -> 1 zhuyin block.

    const result = [];
    let pinyinIndex = 0;

    for (const char of text) {
        if (pinyinIndex >= pyData.length) break;

        const currentPinyin = pyData[pinyinIndex];

        // Check if char is Chinese
        if (/[\u4e00-\u9fa5]/.test(char)) {
            // It's a chinese char
            result.push({
                char,
                zhuyin: convertPinyinToZhuyin(currentPinyin)
            });
            pinyinIndex++;
        } else {
            // Non-Chinese.
            // If pinyin output grouped them (e.g. "Hello"), we need to handle that.
            // Check if currentPinyin starts with current char?
            // Or simplified: Just push char with empty zhuyin.
            // But valid 'pinyin-pro' behavior for 'nonZh: consecutive' is grouping.
            // Maybe use 'nonZh: spacer' or default?
            // Default splits everything?
            // Let's use 'nonZh: separated' or just default (char based).
            // Default pinyin('Text') -> 'T e x t' if spaced.

            // Actually, let's just re-call pinyin with different config inside loop? No, slow.
            // Let's change pinyin config above to NOT group non-zh.
        }
    }

    // Refined approach:
    // Use default pinyin which maps 1-to-1 if possible?
    // pinyin-pro default for string "Hello" is "H e l l o".
    // "Hello 世界" -> "H e l l o shi4 jie4"

    // Get pinyin for display (with tone marks)
    const pyDataSingle = pinyin(text, { type: 'array', toneType: 'num', nonZh: 'boxed' });
    const pyDataDisplay = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'boxed' });

    return pyDataSingle.map((item, index) => {
        const char = text[index] || '';

        if (/[\u4e00-\u9fa5]/.test(char)) {
            return {
                char,
                zhuyin: convertPinyinToZhuyin(item),
                pinyin: pyDataDisplay[index]
            };
        } else {
            return { char, zhuyin: '', pinyin: '' }; // No annotation for non-Chinese
        }
    });
};
