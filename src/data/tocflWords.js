/**
 * Official TOCFL Vocabulary Dataset categorized by Level (Band A, B, C) and Part of Speech
 * Taiwan Standard Traditional Chinese with Zhuyin (Bopomofo) and English definitions
 * Covers all 7,170+ official TOCFL terms (Steering Committee for the Test Of Proficiency-Huayu)
 */
import tocflWordsData from './tocflWordsAll.js';

export const TOCFL_LEVEL_META = [
    {
        id: 'A',
        name: 'TOCFL Level A',
        subName: '入門 / 基礎級 (Band A: A1-A2)',
        badge: 'Band A',
        description: '日常生活必備實用詞彙，包括購物、問候、交通與生活習慣 (1,200+ 詞)。',
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
    },
    {
        id: 'B',
        name: 'TOCFL Level B',
        subName: '進階 / 高階級 (Band B: B1-B2)',
        badge: 'Band B',
        description: '社交、職場工作、社會文化與生活深入交流常用詞彙 (3,200+ 詞)。',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        id: 'C',
        name: 'TOCFL Level C',
        subName: '流利 / 精通級 (Band C: C1-C2)',
        badge: 'Band C',
        description: '深度學術、新聞論述、科技發展與精準文化表達高級詞彙 (2,600+ 詞)。',
        color: 'from-purple-500 to-rose-600',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    }
];

export const TOCFL_WORD_TYPES = [
    { id: 'all', labelEn: 'All Types', labelZh: '全部詞性', icon: '✨' },
    { id: 'noun', labelEn: 'Noun', labelZh: '名詞', icon: '📦' },
    { id: 'verb', labelEn: 'Verb', labelZh: '動詞', icon: '⚡' },
    { id: 'adjective', labelEn: 'Adjective', labelZh: '形容詞', icon: '🎨' },
    { id: 'adverb', labelEn: 'Adverb', labelZh: '副詞', icon: '🚀' },
    { id: 'phrase', labelEn: 'Phrase / Idiom', labelZh: '片語 / 成語', icon: '📜' },
    { id: 'other', labelEn: 'Other', labelZh: '其他', icon: '🔖' }
];

export const TOCFL_WORDS = tocflWordsData;

/**
 * Filter words by level and POS type
 */
export const getFilteredTOCFLWords = (level = 'A', type = 'all') => {
    return TOCFL_WORDS.filter(item => {
        const matchesLevel = !level || level === 'all' || item.level === level;
        const matchesType = !type || type === 'all' || item.type === type;
        return matchesLevel && matchesType;
    });
};

/**
 * Count helper for UI badges
 */
export const getWordCountsByLevelAndType = () => {
    const counts = {};
    for (const level of ['A', 'B', 'C']) {
        counts[level] = { all: 0 };
        for (const type of TOCFL_WORD_TYPES) {
            if (type.id !== 'all') {
                counts[level][type.id] = 0;
            }
        }
    }

    for (const word of TOCFL_WORDS) {
        if (counts[word.level]) {
            counts[word.level].all++;
            if (counts[word.level][word.type] !== undefined) {
                counts[word.level][word.type]++;
            }
        }
    }

    return counts;
};
