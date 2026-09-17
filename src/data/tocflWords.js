/**
 * TOCFL Vocabulary Dataset categorized by Level (Band A, B, C) and Part of Speech
 * Taiwan Standard Traditional Chinese with Zhuyin (Bopomofo) and English definitions
 */

export const TOCFL_LEVEL_META = [
    {
        id: 'A',
        name: 'TOCFL Level A',
        subName: '入門 / 基礎級 (Band A: A1-A2)',
        badge: 'Band A',
        description: '日常生活必備實用詞彙，包括購物、問候、交通與生活習慣。',
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
        description: '社交、職場工作、社會文化與生活深入交流常用詞彙。',
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
        description: '深度學術、新聞論述、科技發展與精準文化表達高級詞彙。',
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
    { id: 'phrase', labelEn: 'Phrase / Idiom', labelZh: '片語 / 成語', icon: '📜' }
];

export const TOCFL_WORDS = [
    // ==========================================
    // LEVEL A - NOUNS (名詞)
    // ==========================================
    {
        id: 'a-n-1',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '朋友',
        zhuyin: 'ㄆㄥˊ ㄧㄡˇ',
        pinyin: 'péng yǒu',
        meaning: 'friend',
        chars: [
            { char: '朋', zhuyin: 'ㄆㄥˊ', pinyin: 'péng' },
            { char: '友', zhuyin: 'ㄧㄡˇ', pinyin: 'yǒu' }
        ],
        exampleZh: '他在台灣交了許多好朋友。',
        exampleEn: 'He made many good friends in Taiwan.'
    },
    {
        id: 'a-n-2',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '天氣',
        zhuyin: 'ㄊㄧㄢ ㄑㄧˋ',
        pinyin: 'tiān qì',
        meaning: 'weather',
        chars: [
            { char: '天', zhuyin: 'ㄊㄧㄢ', pinyin: 'tiān' },
            { char: '氣', zhuyin: 'ㄑㄧˋ', pinyin: 'qì' }
        ],
        exampleZh: '今天的天氣非常晴朗舒服。',
        exampleEn: 'The weather today is very sunny and pleasant.'
    },
    {
        id: 'a-n-3',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '捷運',
        zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ',
        pinyin: 'jié yùn',
        meaning: 'MRT / subway / rapid transit',
        chars: [
            { char: '捷', zhuyin: 'ㄐㄧㄝˊ', pinyin: 'jié' },
            { char: '運', zhuyin: 'ㄩㄣˋ', pinyin: 'yùn' }
        ],
        exampleZh: '台北的捷運乾淨又準時。',
        exampleEn: 'Taipei MRT is clean and punctual.'
    },
    {
        id: 'a-n-4',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '時間',
        zhuyin: 'ㄕˊ ㄐㄧㄢ',
        pinyin: 'shí jiān',
        meaning: 'time',
        chars: [
            { char: '時', zhuyin: 'ㄕˊ', pinyin: 'shí' },
            { char: '間', zhuyin: 'ㄐㄧㄢ', pinyin: 'jiān' }
        ],
        exampleZh: '我們什麼時間在車站見面？',
        exampleEn: 'What time shall we meet at the station?'
    },
    {
        id: 'a-n-5',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '小吃',
        zhuyin: 'ㄒㄧㄠˇ ㄔ',
        pinyin: 'xiǎo chī',
        meaning: 'street food / local snack',
        chars: [
            { char: '小', zhuyin: 'ㄒㄧㄠˇ', pinyin: 'xiǎo' },
            { char: '吃', zhuyin: 'ㄔ', pinyin: 'chī' }
        ],
        exampleZh: '夜市裡有各式各樣的美味小吃。',
        exampleEn: 'There are various delicious snacks in the night market.'
    },
    {
        id: 'a-n-6',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '機場',
        zhuyin: 'ㄐㄧ ㄔㄤˇ',
        pinyin: 'jī chǎng',
        meaning: 'airport',
        chars: [
            { char: '機', zhuyin: 'ㄐㄧ', pinyin: 'jī' },
            { char: '場', zhuyin: 'ㄔㄤˇ', pinyin: 'chǎng' }
        ],
        exampleZh: '我搭計程車去桃園機場。',
        exampleEn: 'I take a taxi to Taoyuan Airport.'
    },
    {
        id: 'a-n-7',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '咖啡',
        zhuyin: 'ㄎㄚ ㄈㄟ',
        pinyin: 'kā fēi',
        meaning: 'coffee',
        chars: [
            { char: '咖', zhuyin: 'ㄎㄚ', pinyin: 'kā' },
            { char: '啡', zhuyin: 'ㄈㄟ', pinyin: 'fēi' }
        ],
        exampleZh: '早上喝一杯熱咖啡精神很好。',
        exampleEn: 'Drinking a cup of hot coffee in the morning feels refreshing.'
    },
    {
        id: 'a-n-8',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '電影',
        zhuyin: 'ㄉㄧㄢˋ ㄧㄥˇ',
        pinyin: 'diàn yǐng',
        meaning: 'movie / film',
        chars: [
            { char: '電', zhuyin: 'ㄉㄧㄢˋ', pinyin: 'diàn' },
            { char: '影', zhuyin: 'ㄧㄥˇ', pinyin: 'yǐng' }
        ],
        exampleZh: '這部台灣電影非常感人。',
        exampleEn: 'This Taiwanese movie is very touching.'
    },
    {
        id: 'a-n-9',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '禮物',
        zhuyin: 'ㄌㄧˇ ㄨˋ',
        pinyin: 'lǐ wù',
        meaning: 'gift / present',
        chars: [
            { char: '禮', zhuyin: 'ㄌㄧˇ', pinyin: 'lǐ' },
            { char: '物', zhuyin: 'ㄨˋ', pinyin: 'wù' }
        ],
        exampleZh: '這是送給你的生日禮物。',
        exampleEn: 'This is a birthday present for you.'
    },
    {
        id: 'a-n-10',
        level: 'A',
        type: 'noun',
        typeZh: '名詞',
        word: '習慣',
        zhuyin: 'ㄒㄧˊ ㄍㄨㄢˋ',
        pinyin: 'xí guàn',
        meaning: 'habit / custom',
        chars: [
            { char: '習', zhuyin: 'ㄒㄧˊ', pinyin: 'xí' },
            { char: '慣', zhuyin: 'ㄍㄨㄢˋ', pinyin: 'guàn' }
        ],
        exampleZh: '養成早睡早起的好習慣很重要。',
        exampleEn: 'It is important to build a good habit of sleeping early and waking up early.'
    },

    // ==========================================
    // LEVEL A - VERBS (動詞)
    // ==========================================
    {
        id: 'a-v-1',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '學習',
        zhuyin: 'ㄒㄩㄝˊ ㄒㄧˊ',
        pinyin: 'xué xí',
        meaning: 'to study / to learn',
        chars: [
            { char: '學', zhuyin: 'ㄒㄩㄝˊ', pinyin: 'xué' },
            { char: '習', zhuyin: 'ㄒㄧˊ', pinyin: 'xí' }
        ],
        exampleZh: '每天堅持學習中文三十分鐘。',
        exampleEn: 'Persist in studying Chinese for thirty minutes every day.'
    },
    {
        id: 'a-v-2',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '介紹',
        zhuyin: 'ㄐㄧㄝˋ ㄕㄠˋ',
        pinyin: 'jiè shào',
        meaning: 'to introduce / introduction',
        chars: [
            { char: '介', zhuyin: 'ㄐㄧㄝˋ', pinyin: 'jiè' },
            { char: '紹', zhuyin: 'ㄕㄠˋ', pinyin: 'shào' }
        ],
        exampleZh: '請先跟新同學自我介紹一下。',
        exampleEn: 'Please introduce yourself to the new classmates first.'
    },
    {
        id: 'a-v-3',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '準備',
        zhuyin: 'ㄓㄨㄣˇ ㄅㄟˋ',
        pinyin: 'zhǔn bèi',
        meaning: 'to prepare / get ready',
        chars: [
            { char: '準', zhuyin: 'ㄓㄨㄣˇ', pinyin: 'zhǔn' },
            { char: '備', zhuyin: 'ㄅㄟˋ', pinyin: 'bèi' }
        ],
        exampleZh: '我們已經準備好出發去爬山了。',
        exampleEn: 'We are already prepared to set off for hiking.'
    },
    {
        id: 'a-v-4',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '出發',
        zhuyin: 'ㄔㄨ ㄈㄚ',
        pinyin: 'chū fā',
        meaning: 'to set off / depart',
        chars: [
            { char: '出', zhuyin: 'ㄔㄨ', pinyin: 'chū' },
            { char: '發', zhuyin: 'ㄈㄚ', pinyin: 'fā' }
        ],
        exampleZh: '明天早上八點在門口集合出發。',
        exampleEn: 'Meet at the gate tomorrow at 8 AM to depart.'
    },
    {
        id: 'a-v-5',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '練習',
        zhuyin: 'ㄌㄧㄢˋ ㄒㄧˊ',
        pinyin: 'liàn xí',
        meaning: 'to practice',
        chars: [
            { char: '練', zhuyin: 'ㄌㄧㄢˋ', pinyin: 'liàn' },
            { char: '習', zhuyin: 'ㄒㄧˊ', pinyin: 'xí' }
        ],
        exampleZh: '多練習注音輸入法打字速度會變快。',
        exampleEn: 'Practicing Zhuyin typing will make your speed faster.'
    },
    {
        id: 'a-v-6',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '推薦',
        zhuyin: 'ㄊㄨㄟ ㄐㄧㄢˋ',
        pinyin: 'tuī jiàn',
        meaning: 'to recommend',
        chars: [
            { char: '推', zhuyin: 'ㄊㄨㄟ', pinyin: 'tuī' },
            { char: '薦', zhuyin: 'ㄐㄧㄢˋ', pinyin: 'jiàn' }
        ],
        exampleZh: '老闆推薦我們點小籠包。',
        exampleEn: 'The store owner recommended that we order soup dumplings.'
    },
    {
        id: 'a-v-7',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '散步',
        zhuyin: 'ㄙㄢˋ ㄅㄨˋ',
        pinyin: 'sàn bù',
        meaning: 'to take a walk / stroll',
        chars: [
            { char: '散', zhuyin: 'ㄙㄢˋ', pinyin: 'sàn' },
            { char: '步', zhuyin: 'ㄅㄨˋ', pinyin: 'bù' }
        ],
        exampleZh: '吃完晚餐後，我們喜歡去公園散步。',
        exampleEn: 'After dinner, we like taking a stroll in the park.'
    },
    {
        id: 'a-v-8',
        level: 'A',
        type: 'verb',
        typeZh: '動詞',
        word: '照顧',
        zhuyin: 'ㄓㄠˋ ㄍㄨˋ',
        pinyin: 'zhào gù',
        meaning: 'to look after / take care of',
        chars: [
            { char: '照', zhuyin: 'ㄓㄠˋ', pinyin: 'zhào' },
            { char: '顧', zhuyin: 'ㄍㄨˋ', pinyin: 'gù' }
        ],
        exampleZh: '生病時家人總是細心照顧我。',
        exampleEn: 'When I am sick, my family always takes care of me attentively.'
    },

    // ==========================================
    // LEVEL A - ADJECTIVES (形容詞)
    // ==========================================
    {
        id: 'a-adj-1',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '熱鬧',
        zhuyin: 'ㄖㄜˋ ㄋㄠˋ',
        pinyin: 'rè nào',
        meaning: 'lively / bustling',
        chars: [
            { char: '熱', zhuyin: 'ㄖㄜˋ', pinyin: 'rè' },
            { char: '鬧', zhuyin: 'ㄋㄠˋ', pinyin: 'nào' }
        ],
        exampleZh: '逢甲夜市每逢週末都特別熱鬧。',
        exampleEn: 'Fengjia Night Market is especially bustling every weekend.'
    },
    {
        id: 'a-adj-2',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '方便',
        zhuyin: 'ㄈㄤ ㄅㄧㄢˋ',
        pinyin: 'fāng biàn',
        meaning: 'convenient',
        chars: [
            { char: '方', zhuyin: 'ㄈㄤ', pinyin: 'fāng' },
            { char: '便', zhuyin: 'ㄅㄧㄢˋ', pinyin: 'biàn' }
        ],
        exampleZh: '台灣的便利商店買東西非常方便。',
        exampleEn: 'Shopping at Taiwan convenience stores is very convenient.'
    },
    {
        id: 'a-adj-3',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '美麗',
        zhuyin: 'ㄇㄟˇ ㄌㄧˋ',
        pinyin: 'měi lì',
        meaning: 'beautiful',
        chars: [
            { char: '美', zhuyin: 'ㄇㄟˇ', pinyin: 'měi' },
            { char: '麗', zhuyin: 'ㄌㄧˋ', pinyin: 'lì' }
        ],
        exampleZh: '日月潭湖畔的日落十分美麗。',
        exampleEn: 'The sunset by Sun Moon Lake is very beautiful.'
    },
    {
        id: 'a-adj-4',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '健康',
        zhuyin: 'ㄐㄧㄢˋ ㄎㄤ',
        pinyin: 'jiàn kāng',
        meaning: 'healthy',
        chars: [
            { char: '健', zhuyin: 'ㄐㄧㄢˋ', pinyin: 'jiàn' },
            { char: '康', zhuyin: 'ㄎㄤ', pinyin: 'kāng' }
        ],
        exampleZh: '均衡飲食有助於維持身體健康。',
        exampleEn: 'A balanced diet helps maintain good health.'
    },
    {
        id: 'a-adj-5',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '乾淨',
        zhuyin: 'ㄍㄢ ㄐㄧㄥˋ',
        pinyin: 'gān jìng',
        meaning: 'clean',
        chars: [
            { char: '乾', zhuyin: 'ㄍㄢ', pinyin: 'gān' },
            { char: '淨', zhuyin: 'ㄐㄧㄥˋ', pinyin: 'jìng' }
        ],
        exampleZh: '房間整理得乾淨整齊。',
        exampleEn: 'The room is arranged cleanly and neatly.'
    },
    {
        id: 'a-adj-6',
        level: 'A',
        type: 'adjective',
        typeZh: '形容詞',
        word: '客氣',
        zhuyin: 'ㄎㄜˋ ㄑㄧˋ',
        pinyin: 'kè qì',
        meaning: 'polite / courteous',
        chars: [
            { char: '客', zhuyin: 'ㄎㄜˋ', pinyin: 'kè' },
            { char: '氣', zhuyin: 'ㄑㄧˋ', pinyin: 'qì' }
        ],
        exampleZh: '店員對待顧客總是親切又客氣。',
        exampleEn: 'The shop clerk is always friendly and courteous to customers.'
    },

    // ==========================================
    // LEVEL A - ADVERBS (副詞)
    // ==========================================
    {
        id: 'a-adv-1',
        level: 'A',
        type: 'adverb',
        typeZh: '副詞',
        word: '非常',
        zhuyin: 'ㄈㄟ ㄔㄤˊ',
        pinyin: 'fēi cháng',
        meaning: 'very / extremely',
        chars: [
            { char: '非', zhuyin: 'ㄈㄟ', pinyin: 'fēi' },
            { char: '常', zhuyin: 'ㄔㄤˊ', pinyin: 'cháng' }
        ],
        exampleZh: '這家餐廳的牛肉麵非常美味。',
        exampleEn: 'The beef noodles at this restaurant are extremely delicious.'
    },
    {
        id: 'a-adv-2',
        level: 'A',
        type: 'adverb',
        typeZh: '副詞',
        word: '常常',
        zhuyin: 'ㄔㄤˊ ㄔㄤˊ',
        pinyin: 'cháng cháng',
        meaning: 'often / frequently',
        chars: [
            { char: '常', zhuyin: 'ㄔㄤˊ', pinyin: 'cháng' },
            { char: '常', zhuyin: 'ㄔㄤˊ', pinyin: 'cháng' }
        ],
        exampleZh: '放學後他常常去圖書館看書。',
        exampleEn: 'After school he often goes to the library to read.'
    },
    {
        id: 'a-adv-3',
        level: 'A',
        type: 'adverb',
        typeZh: '副詞',
        word: '特別',
        zhuyin: 'ㄊㄜˋ ㄅㄧㄝˊ',
        pinyin: 'tè bié',
        meaning: 'especially / particularly',
        chars: [
            { char: '特', zhuyin: 'ㄊㄜˋ', pinyin: 'tè' },
            { char: '別', zhuyin: 'ㄅㄧㄝˊ', pinyin: 'bié' }
        ],
        exampleZh: '冬天的火鍋吃起來特別溫暖。',
        exampleEn: 'Hot pot in winter feels especially warm.'
    },
    {
        id: 'a-adv-4',
        level: 'A',
        type: 'adverb',
        typeZh: '副詞',
        word: '互相',
        zhuyin: 'ㄏㄨˋ ㄒㄧㄤ',
        pinyin: 'hù xiāng',
        meaning: 'mutually / each other',
        chars: [
            { char: '互', zhuyin: 'ㄏㄨˋ', pinyin: 'hù' },
            { char: '相', zhuyin: 'ㄒㄧㄤ', pinyin: 'xiāng' }
        ],
        exampleZh: '同學之間應當互相幫助。',
        exampleEn: 'Classmates should help each other.'
    },

    // ==========================================
    // LEVEL A - PHRASES (片語)
    // ==========================================
    {
        id: 'a-ph-1',
        level: 'A',
        type: 'phrase',
        typeZh: '片語',
        word: '一路順風',
        zhuyin: 'ㄧ ㄌㄨˋ ㄕㄨㄣˋ ㄈㄥ',
        pinyin: 'yí lù shùn fēng',
        meaning: 'have a pleasant journey / bon voyage',
        chars: [
            { char: '一', zhuyin: 'ㄧ', pinyin: 'yī' },
            { char: '路', zhuyin: 'ㄌㄨˋ', pinyin: 'lù' },
            { char: '順', zhuyin: 'ㄕㄨㄣˋ', pinyin: 'shùn' },
            { char: '風', zhuyin: 'ㄈㄥ', pinyin: 'fēng' }
        ],
        exampleZh: '祝你回國一路順風！',
        exampleEn: 'Wish you a pleasant trip back to your country!'
    },
    {
        id: 'a-ph-2',
        level: 'A',
        type: 'phrase',
        typeZh: '片語',
        word: '心滿意足',
        zhuyin: 'ㄒㄧㄣ ㄇㄢˇ ㄧˋ ㄗㄨˊ',
        pinyin: 'xīn mǎn yì zú',
        meaning: 'fully satisfied / contented',
        chars: [
            { char: '心', zhuyin: 'ㄒㄧㄣ', pinyin: 'xīn' },
            { char: '滿', zhuyin: 'ㄇㄢˇ', pinyin: 'mǎn' },
            { char: '意', zhuyin: 'ㄧˋ', pinyin: 'yì' },
            { char: '足', zhuyin: 'ㄗㄨˊ', pinyin: 'zú' }
        ],
        exampleZh: '享用完道地小吃後讓人心滿意足。',
        exampleEn: 'After enjoying the authentic snacks, one feels completely satisfied.'
    },

    // ==========================================
    // LEVEL B - NOUNS (名詞)
    // ==========================================
    {
        id: 'b-n-1',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '經驗',
        zhuyin: 'ㄐㄧㄥ ㄧㄢˋ',
        pinyin: 'jīng yàn',
        meaning: 'experience',
        chars: [
            { char: '經', zhuyin: 'ㄐㄧㄥ', pinyin: 'jīng' },
            { char: '驗', zhuyin: 'ㄧㄢˋ', pinyin: 'yàn' }
        ],
        exampleZh: '豐富的實習經驗對找工作很有幫助。',
        exampleEn: 'Rich internship experience is very helpful for job hunting.'
    },
    {
        id: 'b-n-2',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '責任',
        zhuyin: 'ㄗㄜˊ ㄖㄣˋ',
        pinyin: 'zé rèn',
        meaning: 'responsibility / duty',
        chars: [
            { char: '責', zhuyin: 'ㄗㄜˊ', pinyin: 'zé' },
            { char: '任', zhuyin: 'ㄖㄣˋ', pinyin: 'rèn' }
        ],
        exampleZh: '作為專案經理，他承擔了許多重要責任。',
        exampleEn: 'As the project manager, he shoulders many key responsibilities.'
    },
    {
        id: 'b-n-3',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '效率',
        zhuyin: 'ㄒㄧㄠˋ ㄌㄩˋ',
        pinyin: 'xiào lǜ',
        meaning: 'efficiency',
        chars: [
            { char: '效', zhuyin: 'ㄒㄧㄠˋ', pinyin: 'xiào' },
            { char: '率', zhuyin: 'ㄌㄩˋ', pinyin: 'lǜ' }
        ],
        exampleZh: '善用科技工具可以顯著提升工作效率。',
        exampleEn: 'Leveraging tech tools can significantly improve work efficiency.'
    },
    {
        id: 'b-n-4',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '環境',
        zhuyin: 'ㄏㄨㄢˊ ㄐㄧㄥˋ',
        pinyin: 'huán jìng',
        meaning: 'environment / surroundings',
        chars: [
            { char: '環', zhuyin: 'ㄏㄨㄢˊ', pinyin: 'huán' },
            { char: '境', zhuyin: 'ㄐㄧㄥˋ', pinyin: 'jìng' }
        ],
        exampleZh: '我們應該共同維護綠色的生活環境。',
        exampleEn: 'We should work together to maintain a green living environment.'
    },
    {
        id: 'b-n-5',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '態度',
        zhuyin: 'ㄊㄞˋ ㄉㄨˋ',
        pinyin: 'tài dù',
        meaning: 'attitude / manner',
        chars: [
            { char: '態', zhuyin: 'ㄊㄞˋ', pinyin: 'tài' },
            { char: '度', zhuyin: 'ㄉㄨˋ', pinyin: 'dù' }
        ],
        exampleZh: '積極正面的態度是克服困難的關鍵。',
        exampleEn: 'A positive attitude is the key to overcoming difficulties.'
    },
    {
        id: 'b-n-6',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '趨勢',
        zhuyin: 'ㄑㄩ ㄕˋ',
        pinyin: 'qū shì',
        meaning: 'trend / tendency',
        chars: [
            { char: '趨', zhuyin: 'ㄑㄩ', pinyin: 'qū' },
            { char: '勢', zhuyin: 'ㄕˋ', pinyin: 'shì' }
        ],
        exampleZh: '遠端工作已經成為全球職場的新趨勢。',
        exampleEn: 'Remote work has become a new trend in the global workplace.'
    },
    {
        id: 'b-n-7',
        level: 'B',
        type: 'noun',
        typeZh: '名詞',
        word: '挑戰',
        zhuyin: 'ㄊㄧㄠˇ ㄓㄢˋ',
        pinyin: 'tiǎo zhàn',
        meaning: 'challenge',
        chars: [
            { char: '挑', zhuyin: 'ㄊㄧㄠˇ', pinyin: 'tiǎo' },
            { char: '戰', zhuyin: 'ㄓㄢˋ', pinyin: 'zhàn' }
        ],
        exampleZh: '面對未知的挑戰，需要勇氣與毅力。',
        exampleEn: 'Facing unknown challenges requires courage and perseverance.'
    },

    // ==========================================
    // LEVEL B - VERBS (動詞)
    // ==========================================
    {
        id: 'b-v-1',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '改善',
        zhuyin: 'ㄍㄞˇ ㄕㄢˋ',
        pinyin: 'gǎi shàn',
        meaning: 'to improve / ameliorate',
        chars: [
            { char: '改', zhuyin: 'ㄍㄞˇ', pinyin: 'gǎi' },
            { char: '善', zhuyin: 'ㄕㄢˋ', pinyin: 'shàn' }
        ],
        exampleZh: '新政策旨在改善弱勢群體的生活條件。',
        exampleEn: 'The new policy aims to improve the living conditions of disadvantaged groups.'
    },
    {
        id: 'b-v-2',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '討論',
        zhuyin: 'ㄊㄠˇ ㄌㄨㄣˋ',
        pinyin: 'tǎo lùn',
        meaning: 'to discuss / discussion',
        chars: [
            { char: '討', zhuyin: 'ㄊㄠˇ', pinyin: 'tǎo' },
            { char: '論', zhuyin: 'ㄌㄨㄣˋ', pinyin: 'lùn' }
        ],
        exampleZh: '團隊下午將深入討論下季度的行銷企劃。',
        exampleEn: 'The team will discuss next quarter\'s marketing proposal in depth this afternoon.'
    },
    {
        id: 'b-v-3',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '解決',
        zhuyin: 'ㄐㄧㄝˇ ㄐㄩㄝˊ',
        pinyin: 'jiě jué',
        meaning: 'to solve / resolve',
        chars: [
            { char: '解', zhuyin: 'ㄐㄧㄝˇ', pinyin: 'jiě' },
            { char: '決', zhuyin: 'ㄐㄩㄝˊ', pinyin: 'jué' }
        ],
        exampleZh: '透過協商可以和平解決爭議。',
        exampleEn: 'Disputes can be resolved peacefully through consultation.'
    },
    {
        id: 'b-v-4',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '堅持',
        zhuyin: 'ㄐㄧㄢ ㄔˊ',
        pinyin: 'jiān chí',
        meaning: 'to persist / insist on',
        chars: [
            { char: '堅', zhuyin: 'ㄐㄧㄢ', pinyin: 'jiān' },
            { char: '持', zhuyin: 'ㄔˊ', pinyin: 'chí' }
        ],
        exampleZh: '只要堅持夢想，終究會看見希望。',
        exampleEn: 'As long as you persist in your dream, you will eventually see hope.'
    },
    {
        id: 'b-v-5',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '探索',
        zhuyin: 'ㄊㄢˋ ㄙㄨㄛˇ',
        pinyin: 'tàn suǒ',
        meaning: 'to explore / probe',
        chars: [
            { char: '探', zhuyin: 'ㄊㄢˋ', pinyin: 'tàn' },
            { char: '索', zhuyin: 'ㄙㄨㄛˇ', pinyin: 'suǒ' }
        ],
        exampleZh: '青年應該勇於探索未知的領域。',
        exampleEn: 'Youth should be brave enough to explore uncharted domains.'
    },
    {
        id: 'b-v-6',
        level: 'B',
        type: 'verb',
        typeZh: '動詞',
        word: '追求',
        zhuyin: 'ㄓㄨㄟ ㄑㄧㄡˊ',
        pinyin: 'zhuī qiú',
        meaning: 'to pursue / seek after',
        chars: [
            { char: '追', zhuyin: 'ㄓㄨㄟ', pinyin: 'zhuī' },
            { char: '求', zhuyin: 'ㄑㄧㄡˊ', pinyin: 'qiú' }
        ],
        exampleZh: '他全力追求藝術創作上的卓越。',
        exampleEn: 'He puts his all into pursuing excellence in artistic creation.'
    },

    // ==========================================
    // LEVEL B - ADJECTIVES (形容詞)
    // ==========================================
    {
        id: 'b-adj-1',
        level: 'B',
        type: 'adjective',
        typeZh: '形容詞',
        word: '積極',
        zhuyin: 'ㄐㄧ ㄐㄧˊ',
        pinyin: 'jī jí',
        meaning: 'positive / proactive',
        chars: [
            { char: '積', zhuyin: 'ㄐㄧ', pinyin: 'jī' },
            { char: '極', zhuyin: 'ㄐㄧˊ', pinyin: 'jí' }
        ],
        exampleZh: '他在課堂上總是積極回答問題。',
        exampleEn: 'He is always proactive in answering questions in class.'
    },
    {
        id: 'b-adj-2',
        level: 'B',
        type: 'adjective',
        typeZh: '形容詞',
        word: '豐富',
        zhuyin: 'ㄈㄥ ㄈㄨˋ',
        pinyin: 'fēng fù',
        meaning: 'rich / abundant',
        chars: [
            { char: '豐', zhuyin: 'ㄈㄥ', pinyin: 'fēng' },
            { char: '富', zhuyin: 'ㄈㄨˋ', pinyin: 'fù' }
        ],
        exampleZh: '這座圖書館收藏了豐富的歷史文獻。',
        exampleEn: 'This library houses rich collections of historical documents.'
    },
    {
        id: 'b-adj-3',
        level: 'B',
        type: 'adjective',
        typeZh: '形容詞',
        word: '複雜',
        zhuyin: 'ㄈㄨˋ ㄗㄚˊ',
        pinyin: 'fù zá',
        meaning: 'complicated / complex',
        chars: [
            { char: '複', zhuyin: 'ㄈㄨˋ', pinyin: 'fù' },
            { char: '雜', zhuyin: 'ㄗㄚˊ', pinyin: 'zá' }
        ],
        exampleZh: '這個問題牽涉許多層面，情況相當複雜。',
        exampleEn: 'This issue involves many dimensions, and the situation is quite complex.'
    },
    {
        id: 'b-adj-4',
        level: 'B',
        type: 'adjective',
        typeZh: '形容詞',
        word: '嚴肅',
        zhuyin: 'ㄧㄢˊ ㄙㄨˋ',
        pinyin: 'yán sù',
        meaning: 'serious / solemn',
        chars: [
            { char: '嚴', zhuyin: 'ㄧㄢˊ', pinyin: 'yán' },
            { char: '肅', zhuyin: 'ㄙㄨˋ', pinyin: 'sù' }
        ],
        exampleZh: '討論重大議案時大家表情都相當嚴肅。',
        exampleEn: 'Everyone looked quite solemn while discussing major proposals.'
    },

    // ==========================================
    // LEVEL B - ADVERBS (副詞)
    // ==========================================
    {
        id: 'b-adv-1',
        level: 'B',
        type: 'adverb',
        typeZh: '副詞',
        word: '逐漸',
        zhuyin: 'ㄓㄨˊ ㄐㄧㄢˋ',
        pinyin: 'zhú jiàn',
        meaning: 'gradually / step by step',
        chars: [
            { char: '逐', zhuyin: 'ㄓㄨˊ', pinyin: 'zhú' },
            { char: '漸', zhuyin: 'ㄐㄧㄢˋ', pinyin: 'jiàn' }
        ],
        exampleZh: '隨著秋天到來，天氣逐漸轉涼。',
        exampleEn: 'As autumn arrives, the weather gradually turns cool.'
    },
    {
        id: 'b-adv-2',
        level: 'B',
        type: 'adverb',
        typeZh: '副詞',
        word: '確實',
        zhuyin: 'ㄑㄩㄝˋ ㄕˊ',
        pinyin: 'què shí',
        meaning: 'indeed / truly / reliably',
        chars: [
            { char: '確', zhuyin: 'ㄑㄩㄝˋ', pinyin: 'què' },
            { char: '實', zhuyin: 'ㄕˊ', pinyin: 'shí' }
        ],
        exampleZh: '這份報告確實反映了市場現況。',
        exampleEn: 'This report indeed reflects current market conditions.'
    },
    {
        id: 'b-adv-3',
        level: 'B',
        type: 'adverb',
        typeZh: '副詞',
        word: '究竟',
        zhuyin: 'ㄐㄧㄡˋ ㄐㄧㄥˋ',
        pinyin: 'jiù jìng',
        meaning: 'after all / when all is said and done',
        chars: [
            { char: '究', zhuyin: 'ㄐㄧㄡˋ', pinyin: 'jiù' },
            { char: '竟', zhuyin: 'ㄐㄧㄥˋ', pinyin: 'jìng' }
        ],
        exampleZh: '事情的真相究竟如何，還有待調查。',
        exampleEn: 'What the truth of the matter actually is remains to be investigated.'
    },

    // ==========================================
    // LEVEL B - PHRASES (片語)
    // ==========================================
    {
        id: 'b-ph-1',
        level: 'B',
        type: 'phrase',
        typeZh: '片語',
        word: '腳踏實地',
        zhuyin: 'ㄐㄧㄠˇ ㄊㄚˋ ㄕˊ ㄉㄧˋ',
        pinyin: 'jiǎo tà shí dì',
        meaning: 'down-to-earth / earnest and pragmatic',
        chars: [
            { char: '腳', zhuyin: 'ㄐㄧㄠˇ', pinyin: 'jiǎo' },
            { char: '踏', zhuyin: 'ㄊㄚˋ', pinyin: 'tà' },
            { char: '實', zhuyin: 'ㄕˊ', pinyin: 'shí' },
            { char: '地', zhuyin: 'ㄉㄧˋ', pinyin: 'dì' }
        ],
        exampleZh: '創業需要腳踏實地，不能光靠運氣。',
        exampleEn: 'Starting a business requires staying grounded and pragmatic, not relying purely on luck.'
    },
    {
        id: 'b-ph-2',
        level: 'B',
        type: 'phrase',
        typeZh: '片語',
        word: '循序漸進',
        zhuyin: 'ㄒㄩㄣˊ ㄒㄩˋ ㄐㄧㄢˋ ㄐㄧㄣˋ',
        pinyin: 'xún xù jiàn jìn',
        meaning: 'step-by-step progress / methodical',
        chars: [
            { char: '循', zhuyin: 'ㄒㄩㄣˊ', pinyin: 'xún' },
            { char: '序', zhuyin: 'ㄒㄩˋ', pinyin: 'xù' },
            { char: '漸', zhuyin: 'ㄐㄧㄢˋ', pinyin: 'jiàn' },
            { char: '進', zhuyin: 'ㄐㄧㄣˋ', pinyin: 'jìn' }
        ],
        exampleZh: '學習語言要循序漸進，切忌急躁。',
        exampleEn: 'Language learning should proceed step-by-step; avoid being impatient.'
    },

    // ==========================================
    // LEVEL C - NOUNS (名詞)
    // ==========================================
    {
        id: 'c-n-1',
        level: 'C',
        type: 'noun',
        typeZh: '名詞',
        word: '策略',
        zhuyin: 'ㄘㄜˋ ㄌㄩㄝˋ',
        pinyin: 'cè lüè',
        meaning: 'strategy / tactic',
        chars: [
            { char: '策', zhuyin: 'ㄘㄜˋ', pinyin: 'cè' },
            { char: '略', zhuyin: 'ㄌㄩㄝˋ', pinyin: 'lüè' }
        ],
        exampleZh: '這家企業制定了靈活多元的全球擴張策略。',
        exampleEn: 'This enterprise formulated a flexible and diversified global expansion strategy.'
    },
    {
        id: 'c-n-2',
        level: 'C',
        type: 'noun',
        typeZh: '名詞',
        word: '永續',
        zhuyin: 'ㄩㄥˇ ㄒㄩˋ',
        pinyin: 'yǒng xù',
        meaning: 'sustainability / sustainable',
        chars: [
            { char: '永', zhuyin: 'ㄩㄥˇ', pinyin: 'yǒng' },
            { char: '續', zhuyin: 'ㄒㄩˋ', pinyin: 'xù' }
        ],
        exampleZh: '環境永續與經濟發展必須取得良好平衡。',
        exampleEn: 'Environmental sustainability and economic development must achieve a sound balance.'
    },
    {
        id: 'c-n-3',
        level: 'C',
        type: 'noun',
        typeZh: '名詞',
        word: '典範',
        zhuyin: 'ㄉㄧㄢˇ ㄈㄢˋ',
        pinyin: 'diǎn fàn',
        meaning: 'paradigm / role model / exemplar',
        chars: [
            { char: '典', zhuyin: 'ㄉㄧㄢˇ', pinyin: 'diǎn' },
            { char: '範', zhuyin: 'ㄈㄢˋ', pinyin: 'fàn' }
        ],
        exampleZh: '該公司的綠能轉型堪稱同業之典範。',
        exampleEn: 'The company\'s green energy transformation is an exemplar for the industry.'
    },
    {
        id: 'c-n-4',
        level: 'C',
        type: 'noun',
        typeZh: '名詞',
        word: '視野',
        zhuyin: 'ㄕˋ ㄧㄝˇ',
        pinyin: 'shì yě',
        meaning: 'vision / horizon / perspective',
        chars: [
            { char: '視', zhuyin: 'ㄕˋ', pinyin: 'shì' },
            { char: '野', zhuyin: 'ㄧㄝˇ', pinyin: 'yě' }
        ],
        exampleZh: '國際交流有助於拓展青年學子的文化視野。',
        exampleEn: 'International exchanges help broaden students\' cultural perspectives.'
    },
    {
        id: 'c-n-5',
        level: 'C',
        type: 'noun',
        typeZh: '名詞',
        word: '凝聚力',
        zhuyin: 'ㄋㄧㄥˊ ㄐㄩˋ ㄌㄧˋ',
        pinyin: 'níng jù lì',
        meaning: 'cohesion / bonding force',
        chars: [
            { char: '凝', zhuyin: 'ㄋㄧㄥˊ', pinyin: 'níng' },
            { char: '聚', zhuyin: 'ㄐㄩˋ', pinyin: 'jù' },
            { char: '力', zhuyin: 'ㄌㄧˋ', pinyin: 'lì' }
        ],
        exampleZh: '強大的團隊凝聚力促成了專案圓滿成功。',
        exampleEn: 'Strong team cohesion led to the complete success of the project.'
    },

    // ==========================================
    // LEVEL C - VERBS (動詞)
    // ==========================================
    {
        id: 'c-v-1',
        level: 'C',
        type: 'verb',
        typeZh: '動詞',
        word: '拓展',
        zhuyin: 'ㄊㄨㄛˋ ㄓㄢˇ',
        pinyin: 'tuò zhǎn',
        meaning: 'to expand / extend',
        chars: [
            { char: '拓', zhuyin: 'ㄊㄨㄛˋ', pinyin: 'tuò' },
            { char: '展', zhuyin: 'ㄓㄢˇ', pinyin: 'zhǎn' }
        ],
        exampleZh: '公司正積極拓展海外新興市場。',
        exampleEn: 'The company is actively expanding into overseas emerging markets.'
    },
    {
        id: 'c-v-2',
        level: 'C',
        type: 'verb',
        typeZh: '動詞',
        word: '突破',
        zhuyin: 'ㄊㄨˊ ㄆㄛˋ',
        pinyin: 'tú pò',
        meaning: 'to break through / breakthrough',
        chars: [
            { char: '突', zhuyin: 'ㄊㄨˊ', pinyin: 'tú' },
            { char: '破', zhuyin: 'ㄆㄛˋ', pinyin: 'pò' }
        ],
        exampleZh: '科研團隊在量子運算領域取得了歷史性突破。',
        exampleEn: 'The scientific research team achieved a historic breakthrough in quantum computing.'
    },
    {
        id: 'c-v-3',
        level: 'C',
        type: 'verb',
        typeZh: '動詞',
        word: '傳承',
        zhuyin: 'ㄔㄨㄢˊ ㄔㄥˊ',
        pinyin: 'chuán chéng',
        meaning: 'to pass down / inherit / heritage',
        chars: [
            { char: '傳', zhuyin: 'ㄔㄨㄢˊ', pinyin: 'chuán' },
            { char: '承', zhuyin: 'ㄔㄥˊ', pinyin: 'chéng' }
        ],
        exampleZh: '如何傳承非物質文化遺產是當代重要課題。',
        exampleEn: 'How to pass down intangible cultural heritage is an important contemporary subject.'
    },
    {
        id: 'c-v-4',
        level: 'C',
        type: 'verb',
        typeZh: '動詞',
        word: '顛覆',
        zhuyin: 'ㄉㄧㄢ ㄈㄨˋ',
        pinyin: 'diān fù',
        meaning: 'to overturn / disrupt / subvert',
        chars: [
            { char: '顛', zhuyin: 'ㄉㄧㄢ', pinyin: 'diān' },
            { char: '覆', zhuyin: 'ㄈㄨˋ', pinyin: 'fù' }
        ],
        exampleZh: '生成式人工智慧徹底顛覆了內容創作模式。',
        exampleEn: 'Generative AI completely revolutionized content creation models.'
    },

    // ==========================================
    // LEVEL C - ADJECTIVES (形容詞)
    // ==========================================
    {
        id: 'c-adj-1',
        level: 'C',
        type: 'adjective',
        typeZh: '形容詞',
        word: '卓越',
        zhuyin: 'ㄓㄨㄛˊ ㄩㄝˋ',
        pinyin: 'zhuó yuè',
        meaning: 'outstanding / distinguished',
        chars: [
            { char: '卓', zhuyin: 'ㄓㄨㄛˊ', pinyin: 'zhuó' },
            { char: '越', zhuyin: 'ㄩㄝˋ', pinyin: 'yuè' }
        ],
        exampleZh: '她在生物醫學領域有著卓越的學術貢獻。',
        exampleEn: 'She has made outstanding academic contributions in biomedicine.'
    },
    {
        id: 'c-adj-2',
        level: 'C',
        type: 'adjective',
        typeZh: '形容詞',
        word: '敏銳',
        zhuyin: 'ㄇㄧㄣˇ ㄖㄨㄟˋ',
        pinyin: 'mǐn ruì',
        meaning: 'sharp / acute / keen',
        chars: [
            { char: '敏', zhuyin: 'ㄇㄧㄣˇ', pinyin: 'mǐn' },
            { char: '銳', zhuyin: 'ㄖㄨㄟˋ', pinyin: 'ruì' }
        ],
        exampleZh: '他擁有極為敏銳的市場洞察力。',
        exampleEn: 'He possesses exceptionally keen market insight.'
    },
    {
        id: 'c-adj-3',
        level: 'C',
        type: 'adjective',
        typeZh: '形容詞',
        word: '深刻',
        zhuyin: 'ㄕㄣ ㄎㄜˋ',
        pinyin: 'shēn kè',
        meaning: 'profound / deep',
        chars: [
            { char: '深', zhuyin: 'ㄕㄣ', pinyin: 'shēn' },
            { char: '刻', zhuyin: 'ㄎㄜˋ', pinyin: 'kè' }
        ],
        exampleZh: '這次旅行為他帶來了深刻的人生啟發。',
        exampleEn: 'This journey brought him profound life inspirations.'
    },

    // ==========================================
    // LEVEL C - ADVERBS (副詞)
    // ==========================================
    {
        id: 'c-adv-1',
        level: 'C',
        type: 'adverb',
        typeZh: '副詞',
        word: '始終',
        zhuyin: 'ㄕˇ ㄓㄨㄥ',
        pinyin: 'shǐ zhōng',
        meaning: 'from start to finish / all along',
        chars: [
            { char: '始', zhuyin: 'ㄕˇ', pinyin: 'shǐ' },
            { char: '終', zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng' }
        ],
        exampleZh: '無論順逆，他始終保持著謙遜與敬業。',
        exampleEn: 'Through ups and downs, he all along maintained humility and professionalism.'
    },
    {
        id: 'c-adv-2',
        level: 'C',
        type: 'adverb',
        typeZh: '副詞',
        word: '毫不',
        zhuyin: 'ㄏㄠˊ ㄅㄨˋ',
        pinyin: 'háo bù',
        meaning: 'not in the least / not at all',
        chars: [
            { char: '毫', zhuyin: 'ㄏㄠˊ', pinyin: 'háo' },
            { char: '不', zhuyin: 'ㄅㄨˋ', pinyin: 'bù' }
        ],
        exampleZh: '面對挑戰，他毫不猶豫地挺身而出。',
        exampleEn: 'Facing challenges, he stepped forward without the slightest hesitation.'
    },

    // ==========================================
    // LEVEL C - PHRASES (片語)
    // ==========================================
    {
        id: 'c-ph-1',
        level: 'C',
        type: 'phrase',
        typeZh: '片語',
        word: '望塵莫及',
        zhuyin: 'ㄨㄤˋ ㄔㄣˊ ㄇㄛˋ ㄐㄧˊ',
        pinyin: 'wàng chén mò jí',
        meaning: 'far behind / unable to catch up',
        chars: [
            { char: '望', zhuyin: 'ㄨㄤˋ', pinyin: 'wàng' },
            { char: '塵', zhuyin: 'ㄔㄣˊ', pinyin: 'chén' },
            { char: '莫', zhuyin: 'ㄇㄛˋ', pinyin: 'mò' },
            { char: '及', zhuyin: 'ㄐㄧˊ', pinyin: 'jí' }
        ],
        exampleZh: '他在程式競賽上的驚人速度令其他人望塵莫及。',
        exampleEn: 'His amazing speed in programming competitions left everyone else far behind.'
    }
];

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
