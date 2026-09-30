import { pinyin } from 'pinyin-pro';

/**
 * Color definitions for Mandarin Chinese tones:
 * 1st tone (陰平): Blue
 * 2nd tone (陽平): Green
 * 3rd tone (上聲): Orange
 * 4th tone (去聲): Red
 * Neutral tone (輕聲): Neutral Gray / Slate
 */
export const TONE_COLORS = {
    1: '#2563eb', // Blue (blue-600)
    2: '#16a34a', // Green (green-600)
    3: '#ea580c', // Orange (orange-600)
    4: '#dc2626', // Red (red-600)
    5: '#6b7280', // Neutral (gray-500)
    0: 'inherit'  // Non-Chinese / punctuation
};

export const TONE_CLASSES = {
    1: 'text-blue-600',
    2: 'text-green-600',
    3: 'text-orange-600',
    4: 'text-red-600',
    5: 'text-gray-500',
    0: ''
};

export const TONE_META = [
    { tone: 1, name: '第一聲', mark: 'ˉ', label: '1st Tone', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { tone: 2, name: '第二聲', mark: 'ˊ', label: '2nd Tone', color: '#16a34a', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    { tone: 3, name: '第三聲', mark: 'ˇ', label: '3rd Tone', color: '#ea580c', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    { tone: 4, name: '第四聲', mark: 'ˋ', label: '4th Tone', color: '#dc2626', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    { tone: 5, name: '輕聲', mark: '˙', label: 'Neutral', color: '#6b7280', bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-200' }
];

// In-memory cache for character tones to avoid redundant pinyin lookups
const charToneCache = new Map();

/**
 * Determines the tone number (1, 2, 3, 4, 5, or 0) for a Chinese character or syllable
 * @param {string} [char] - Chinese character
 * @param {string} [zhuyin] - Zhuyin phonetic string (e.g. ㄨㄛˇ, ˙ㄅㄚ)
 * @param {string} [pinyinStr] - Pinyin string (e.g. wǒ, wo3, ba)
 * @returns {number} 1, 2, 3, 4, 5 (neutral), or 0 (non-Chinese/punctuation)
 */
export function getTone(char, zhuyin, pinyinStr) {
    // 1. Direct tone check if zhuyin is provided
    if (zhuyin) {
        if (zhuyin.includes('˙')) return 5;
        if (zhuyin.includes('ˊ')) return 2;
        if (zhuyin.includes('ˇ')) return 3;
        if (zhuyin.includes('ˋ')) return 4;
        if (/[ㄅ-ㄩ]/.test(zhuyin)) return 1;
    }

    // 2. Check pinyinStr if provided
    if (pinyinStr) {
        // Numbered pinyin (e.g. hao3, ma5, de0)
        const matchNum = pinyinStr.match(/([0-5])$/);
        if (matchNum) {
            const num = parseInt(matchNum[1], 10);
            return num === 0 ? 5 : num;
        }

        // Accented pinyin
        if (/[āēīōūǖĀĒĪŌŪǕ]/.test(pinyinStr)) return 1;
        if (/[áéíóúǘÁÉÍÓÚǗ]/.test(pinyinStr)) return 2;
        if (/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(pinyinStr)) return 3;
        if (/[àèìòùǜÀÈÌÒÙǛ]/.test(pinyinStr)) return 4;
        
        // Latin letters with no accent / number usually indicate neutral tone
        if (/^[a-zA-Z]+$/.test(pinyinStr)) return 5;
    }

    // 3. Check character itself if it's Chinese
    if (char && /[\u4e00-\u9fa5]/.test(char)) {
        if (charToneCache.has(char)) {
            return charToneCache.get(char);
        }

        try {
            const py = pinyin(char, { toneType: 'num', nonZh: 'consecutive' });
            const m = py.match(/([0-5])$/);
            let tone = 1;
            if (m) {
                const n = parseInt(m[1], 10);
                tone = n === 0 ? 5 : n;
            }
            charToneCache.set(char, tone);
            return tone;
        } catch {
            return 1;
        }
    }

    return 0;
}

/**
 * Returns hex color string for a tone
 * @param {number} tone 
 * @returns {string}
 */
export function getToneColor(tone) {
    return TONE_COLORS[tone] || TONE_COLORS[0];
}

/**
 * Returns Tailwind class for a tone
 * @param {number} tone 
 * @returns {string}
 */
export function getToneClass(tone) {
    return TONE_CLASSES[tone] || '';
}
