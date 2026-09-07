export const TOCFL_LEVELS = [
    {
        id: 'A',
        name: 'TOCFL Level A (入門/基礎級)',
        badge: 'Band A (A1-A2)',
        description: '適合初學者，涵蓋日常問候、夜市點餐、週末出遊等生活實用詞彙與句型。',
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
    },
    {
        id: 'B',
        name: 'TOCFL Level B (進階/高階級)',
        badge: 'Band B (B1-B2)',
        description: '適合中級學習者，深入台灣生活文化、高鐵旅遊、手搖飲與工作生活平衡。',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        id: 'C',
        name: 'TOCFL Level C (流利/精通級)',
        badge: 'Band C (C1-C2)',
        description: '適合高級學習者，涵蓋人工智慧、環境永續與文化遺產等深度議題。',
        color: 'from-purple-500 to-rose-600',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    }
];

export const TOCFL_PARAGRAPHS = [
    // ----------------------------------------------------
    // LEVEL A: Band A (Novice / Basic)
    // ----------------------------------------------------
    {
        id: 'a-1',
        level: 'A',
        title: 'Self-Introduction and Daily Life',
        titleZh: '自我介紹與日常習慣',
        description: '練習基礎日常生活常見詞彙：早上、習慣、學習、朋友。',
        targetVocab: [
            { word: '介紹', zhuyin: 'ㄐㄧㄝˋ ㄕㄠˋ', pinyin: 'jiè shào', meaning: 'introduce' },
            { word: '習慣', zhuyin: 'ㄒㄧˊ ㄍㄨㄢˋ', pinyin: 'xí guàn', meaning: 'habit' },
            { word: '健康', zhuyin: 'ㄐㄧㄢˋ ㄎㄤ', pinyin: 'jiàn kāng', meaning: 'healthy' },
            { word: '練習', zhuyin: 'ㄌㄧㄢˋ ㄒㄧˊ', pinyin: 'liàn xí', meaning: 'practice' }
        ],
        contentZh: '你好！我是李明。我每天早上七點起床，先喝一杯溫開水，然後到公園散步。我喜歡在台灣學習中文，這裡的人都很熱情有禮貌。下課後，我常跟同學一起練習說話，分享彼此的生活經驗。養成良好的習慣，讓身心更健康。'
    },
    {
        id: 'a-2',
        level: 'A',
        title: 'Ordering at a Night Market',
        titleZh: '在台灣夜市點小吃',
        description: '體驗台灣夜市經典美食：小籠包、珍珠奶茶、美味、老闆。',
        targetVocab: [
            { word: '熱鬧', zhuyin: 'ㄖㄜˋ ㄋㄠˋ', pinyin: 'rè nào', meaning: 'lively / bustling' },
            { word: '味道', zhuyin: 'ㄨㄟˋ ㄉㄠˋ', pinyin: 'wèi dào', meaning: 'flavor / taste' },
            { word: '小吃', zhuyin: 'ㄒㄧㄠˇ ㄔ', pinyin: 'xiǎo chī', meaning: 'street food / snacks' },
            { word: '推薦', zhuyin: 'ㄊㄨㄟ ㄐㄧㄢˋ', pinyin: 'tuī jiàn', meaning: 'recommend' }
        ],
        contentZh: '台灣的夜市非常熱鬧，到處都有好吃的特色小吃。今天晚上，我和朋友來到著名的夜市。老闆推薦我們品嚐剛出爐的小籠包和香酥雞排，味道真是美味極了！吃飽之後，我們還買了半糖少冰的珍珠奶茶，讓人心滿意足。'
    },
    {
        id: 'a-3',
        level: 'A',
        title: 'Weekend Travel with Friends',
        titleZh: '週末相約去旅行',
        description: '休閒與旅行基礎字詞：天氣、出發、風景、拍照。',
        targetVocab: [
            { word: '天氣', zhuyin: 'ㄊㄧㄢ ㄑㄧˋ', pinyin: 'tiān qì', meaning: 'weather' },
            { word: '出發', zhuyin: 'ㄔㄨ ㄈㄚ', pinyin: 'chū fā', meaning: 'set off / depart' },
            { word: '美麗', zhuyin: 'ㄇㄟˇ ㄌㄧˋ', pinyin: 'měi lì', meaning: 'beautiful' },
            { word: '愉快', zhuyin: 'ㄩˊ ㄎㄨㄞˋ', pinyin: 'yú kuài', meaning: 'pleasant / cheerful' }
        ],
        contentZh: '這個週末天氣晴朗，適合外出踏青。我們一早搭乘捷運出發，前往市郊的山區步道健行。一路上微風徐徐，綠樹成蔭，山頂的風景十分美麗。我們拍了許多照片留念，度過了一個充實又愉快的美好週末。'
    },

    // ----------------------------------------------------
    // LEVEL B: Band B (Intermediate)
    // ----------------------------------------------------
    {
        id: 'b-1',
        level: 'B',
        title: 'High-Speed Rail & Travel Mobility',
        titleZh: '搭乘台灣高鐵的便利生活',
        description: '探討交通建設、行程安排與城鄉生活連結。',
        targetVocab: [
            { word: '便利', zhuyin: 'ㄅㄧㄢˋ ㄌㄧˋ', pinyin: 'biàn lì', meaning: 'convenient' },
            { word: '快捷', zhuyin: 'ㄎㄨㄞˋ ㄐㄧㄝˊ', pinyin: 'kuài jié', meaning: 'fast / efficient' },
            { word: '行程', zhuyin: 'ㄒㄧㄥˊ ㄔㄥˊ', pinyin: 'xíng chéng', meaning: 'itinerary' },
            { word: '縮短', zhuyin: 'ㄙㄨㄛ ㄉㄨㄢˇ', pinyin: 'suō duǎn', meaning: 'shorten' }
        ],
        contentZh: '台灣高鐵的開通，徹底改變了南北往返的交通方式。從台北到高雄僅需一個半小時，大幅縮短了城際距離。現代人不僅能輕鬆實現一日生活圈，也能利用假日探索各地人文景致。高鐵的準點與舒適，為旅客帶來了極大的便利與安全感。'
    },
    {
        id: 'b-2',
        level: 'B',
        title: 'Taiwan Beverage Shop Culture',
        titleZh: '珍珠奶茶與手搖飲文化',
        description: '掌握飲食文化、客製化選項與社會生活習慣。',
        targetVocab: [
            { word: '特色', zhuyin: 'ㄊㄜˋ ㄙㄜˋ', pinyin: 'tè sè', meaning: 'characteristic' },
            { word: '風靡', zhuyin: 'ㄈㄥ ㄇㄧˇ', pinyin: 'fēng mǐ', meaning: 'fashionable / popular' },
            { word: '客製化', zhuyin: 'ㄎㄜˋ ㄓˋ ㄏㄨㄚˋ', pinyin: 'kè zhì huà', meaning: 'customized' },
            { word: '選擇', zhuyin: 'ㄒㄩㄢˇ ㄗㄜˊ', pinyin: 'xuǎn zé', meaning: 'selection / choose' }
        ],
        contentZh: '源自台灣的珍珠奶茶如今已風靡全球，成為享譽國際的代表性飲品。台灣手搖飲料店隨處可見，最吸引人的是其高度客製化的服務。顧客可以依照個人喜好調整甜度與冰塊比例，並挑選各式各樣的配料。這項特色充分展現了台灣飲食文化的包容與多元。'
    },
    {
        id: 'b-3',
        level: 'B',
        title: 'Work-Life Balance in the City',
        titleZh: '都市生活的步調與工作平衡',
        description: '職場、生活壓力調適與身心平衡相關詞彙。',
        targetVocab: [
            { word: '步調', zhuyin: 'ㄅㄨˋ ㄉㄧㄠˋ', pinyin: 'bù diào', meaning: 'pace' },
            { word: '競爭', zhuyin: 'ㄐㄧㄥˋ ㄓㄥ', pinyin: 'jìng zhēng', meaning: 'competition' },
            { word: '舒緩', zhuyin: 'ㄕㄨ ㄏㄨㄢˇ', pinyin: 'shū huǎn', meaning: 'ease / relieve' },
            { word: '平衡', zhuyin: 'ㄆㄧㄥˊ ㄏㄥˊ', pinyin: 'píng héng', meaning: 'balance' }
        ],
        contentZh: '現代都會節奏緊湊，面對激烈的職場競爭，許多人常感到身心俱疲。如何在忙碌的工作與休閒生活之間取得平衡，成為不可忽視的課題。透過規律運動、閱讀以及親近自然，能有效舒緩壓力，讓思緒重新沈澱，迎接新一天的各項挑戰。'
    },

    // ----------------------------------------------------
    // LEVEL C: Band C (Advanced)
    // ----------------------------------------------------
    {
        id: 'c-1',
        level: 'C',
        title: 'AI and Societal Transformation',
        titleZh: '數位時代的人工智慧與生活轉型',
        description: '高階科技與社會思辨：演算法、自動化、倫理挑戰。',
        targetVocab: [
            { word: '變革', zhuyin: 'ㄅㄧㄢˋ ㄍㄜˊ', pinyin: 'biàn gé', meaning: 'transformation / revolution' },
            { word: '演算法', zhuyin: 'ㄧㄢˇ ㄙㄨㄢˋ ㄈㄚˇ', pinyin: 'yǎn suàn fǎ', meaning: 'algorithm' },
            { word: '倫理', zhuyin: 'ㄌㄨㄣˊ ㄌㄧˇ', pinyin: 'lún lǐ', meaning: 'ethics' },
            { word: '前瞻', zhuyin: 'ㄑㄧㄢˊ ㄓㄢ', pinyin: 'qián zhān', meaning: 'forward-looking / visionary' }
        ],
        contentZh: '人工智慧的迅速崛起，正在為全球各產業帶來前所未有的深刻變革。從巨量資料的演算分析到自主決策系統的建構，自動化技術大幅提升了生產效能。然而，伴隨而來的勞動市場結構轉型、隱私權保護以及科技倫理挑戰，更需要具備前瞻視野的宏觀思維與健全法制予以因應。'
    },
    {
        id: 'c-2',
        level: 'C',
        title: 'Reflections on Environmental Sustainability',
        titleZh: '環境保護與永續發展的省思',
        description: '生態保育、循環經濟與永續治理等高階論述。',
        targetVocab: [
            { word: '永續', zhuyin: 'ㄩㄥˇ ㄒㄩˋ', pinyin: 'yǒng xù', meaning: 'sustainable' },
            { word: '生態', zhuyin: 'ㄕㄥ ㄊㄞˋ', pinyin: 'shēng tài', meaning: 'ecological' },
            { word: '資源', zhuyin: 'ㄗ ㄩㄢˊ', pinyin: 'zī yuán', meaning: 'resources' },
            { word: '承諾', zhuyin: 'ㄔㄥˊ ㄋㄨㄛˋ', pinyin: 'chéng nuò', meaning: 'commitment' }
        ],
        contentZh: '面對極端氣候事件頻仍的嚴峻挑戰，推動永續發展與資源循環已是國際社會不可推卸的共同承諾。傳統線型經濟模式過度耗損自然資源，唯有積極導入綠色能源、推動減碳政策與生態保育，方能在追求經濟發展的同時，替下一代守護珍貴的生態資產。'
    },
    {
        id: 'c-3',
        level: 'C',
        title: 'Traditional Crafts & Modern Values',
        titleZh: '傳統工藝與文化遺產的當代價值',
        description: '探討歷史文化底蘊、精湛工藝與現代創新融合。',
        targetVocab: [
            { word: '傳承', zhuyin: 'ㄔㄨㄢˊ ㄔㄥˊ', pinyin: 'chuán chéng', meaning: 'inheritance / lineage' },
            { word: '精湛', zhuyin: 'ㄐㄧㄥ ㄓㄢˋ', pinyin: 'jīng zhàn', meaning: 'exquisite / consummate' },
            { word: '淬鍊', zhuyin: 'ㄘㄨㄟˋ ㄌㄧㄢˋ', pinyin: 'cuì liàn', meaning: 'temper / refine' },
            { word: '底蘊', zhuyin: 'ㄉㄧˇ ㄩㄣˋ', pinyin: 'dǐ yùn', meaning: 'cultural depth / heritage' }
        ],
        contentZh: '每一項代代相傳的傳統工藝，都凝聚著歷代匠人的深厚智慧與精湛技藝。歷經歲月淬鍊的文化遺產，不僅是民族歷史底蘊的具象呈現，更能為當代設計提供豐富的靈感泉源。在現代化潮流中賦予傳統新生命，是文化生生不息的重要契機。'
    }
];
