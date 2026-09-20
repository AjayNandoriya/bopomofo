import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    TOCFL_LEVEL_META,
    TOCFL_WORD_TYPES,
    TOCFL_WORDS,
    getFilteredTOCFLWords,
    getWordCountsByLevelAndType
} from '../data/tocflWords';
import {
    KEY_TO_ZHUYIN,
    ZHUYIN_TO_KEY,
    decomposeZhuyin,
    evaluateZhuyinInput,
    MOBILE_KEYBOARD_LAYOUT,
    VIRTUAL_KEYBOARD_LAYOUT,
    soundEffects
} from '../utils/zhuyinKeyboard';
import { useFontSize, FontSizeControl } from '../context/FontSizeContext';

export default function WordQuiz() {
    // --- Configuration & Selection State ---
    const [selectedLevel, setSelectedLevel] = useState('A');
    const [selectedType, setSelectedType] = useState('all');
    const [quizLength, setQuizLength] = useState(10);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // --- Quiz Running State ---
    const [wordQueue, setWordQueue] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [inputBuffer, setInputBuffer] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isWordCompleted, setIsWordCompleted] = useState(false);

    // --- Stats & Scoring State ---
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [quizHistory, setQuizHistory] = useState([]);

    // --- Preferences & Accessibility ---
    const [showZhuyinGuide, setShowZhuyinGuide] = useState(true);
    const [enableKeyGuide, setEnableKeyGuide] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [autoSpeakWord, setAutoSpeakWord] = useState(false);
    const [showExampleSentence, setShowExampleSentence] = useState(false);
    const [mobileInputMode, setMobileInputMode] = useState('phone'); // 'phone' | 'onscreen'
    const [activeKeyPressed, setActiveKeyPressed] = useState(null);

    const { fontSize, zhuyinSize } = useFontSize();

    // DOM & IME Refs
    const nativeInputRef = useRef(null);
    const isComposingRef = useRef(false);
    const timerRef = useRef(null);

    // Filtered words and counts
    const wordCounts = useMemo(() => getWordCountsByLevelAndType(), []);
    const availableFilteredWords = useMemo(
        () => getFilteredTOCFLWords(selectedLevel, selectedType),
        [selectedLevel, selectedType]
    );

    const currentWord = wordQueue[currentWordIndex] || null;
    const currentChar = currentWord?.chars?.[currentCharIndex] || null;

    // Active level metadata
    const activeLevelMeta = useMemo(
        () => TOCFL_LEVEL_META.find(l => l.id === selectedLevel) || TOCFL_LEVEL_META[0],
        [selectedLevel]
    );

    // Timer effect when quiz is active
    useEffect(() => {
        if (isQuizActive && !isQuizFinished && startTime) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isQuizActive, isQuizFinished, startTime]);

    // Sound toggle effect
    useEffect(() => {
        soundEffects.enabled = soundEnabled;
    }, [soundEnabled]);

    // Haptic feedback helper
    const triggerHaptic = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(10);
            } catch (e) {
                // Ignore vibration errors
            }
        }
    }, []);

    // Text-to-Speech Pronunciation Helper
    const speakWord = useCallback((text) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel();
            if (typeof SpeechSynthesisUtterance !== 'undefined') {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'zh-TW';
                utterance.rate = 0.85;
                window.speechSynthesis.speak(utterance);
            }
        } catch (e) {
            // Speech synthesis non-blocking error
        }
    }, []);

    // Start a new Quiz Session
    const startQuiz = useCallback((wordsList = null) => {
        const pool = wordsList || [...availableFilteredWords];
        if (!pool.length) return;

        // Shuffle pool
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = quizLength === 'all' ? shuffled : shuffled.slice(0, Number(quizLength));

        setWordQueue(selected);
        setCurrentWordIndex(0);
        setCurrentCharIndex(0);
        setInputBuffer('');
        setHasError(false);
        setIsWordCompleted(false);

        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setTotalAttempts(0);
        setCorrectKeystrokes(0);
        setQuizHistory([]);
        setStartTime(Date.now());
        setElapsedSeconds(0);

        setIsQuizActive(true);
        setIsQuizFinished(false);

        if (autoSpeakWord && selected[0]?.word) {
            setTimeout(() => speakWord(selected[0].word), 400);
        }

        // Focus native input for direct mobile/desktop typing
        setTimeout(() => {
            nativeInputRef.current?.focus({ preventScroll: true });
        }, 100);
    }, [availableFilteredWords, quizLength, autoSpeakWord, speakWord]);

    // Advance to the next word
    const advanceToNextWord = useCallback(() => {
        const nextWordIdx = currentWordIndex + 1;
        if (nextWordIdx >= wordQueue.length) {
            setIsQuizFinished(true);
            soundEffects.playComplete();
        } else {
            setCurrentWordIndex(nextWordIdx);
            setCurrentCharIndex(0);
            setInputBuffer('');
            setHasError(false);
            setIsWordCompleted(false);

            if (autoSpeakWord && wordQueue[nextWordIdx]?.word) {
                speakWord(wordQueue[nextWordIdx].word);
            }

            setTimeout(() => {
                nativeInputRef.current?.focus({ preventScroll: true });
            }, 50);
        }
    }, [currentWordIndex, wordQueue, autoSpeakWord, speakWord]);

    // Handle Word Completed
    const handleWordCompleted = useCallback((completedWord) => {
        setIsWordCompleted(true);
        soundEffects.playCharSuccess();
        setScore(prev => prev + 10 + Math.min(streak * 2, 20));
        setStreak(prev => {
            const next = prev + 1;
            setMaxStreak(m => Math.max(m, next));
            return next;
        });

        setQuizHistory(prev => [
            ...prev,
            {
                word: completedWord.word,
                zhuyin: completedWord.zhuyin,
                pinyin: completedWord.pinyin,
                meaning: completedWord.meaning,
                level: completedWord.level,
                type: completedWord.type,
                skipped: false
            }
        ]);

        // Auto advance after short celebratory pause
        setTimeout(() => {
            advanceToNextWord();
        }, 600);
    }, [streak, advanceToNextWord]);

    // Handle Skip Current Word
    const handleSkipWord = useCallback(() => {
        if (!isQuizActive || isQuizFinished || !currentWord) return;

        soundEffects.playKeypress();
        setStreak(0);

        setQuizHistory(prev => [
            ...prev,
            {
                word: currentWord.word,
                zhuyin: currentWord.zhuyin,
                pinyin: currentWord.pinyin,
                meaning: currentWord.meaning,
                level: currentWord.level,
                type: currentWord.type,
                skipped: true
            }
        ]);

        advanceToNextWord();
    }, [isQuizActive, isQuizFinished, currentWord, advanceToNextWord]);

    // Process Text / Keystroke input
    const processInputText = useCallback((text) => {
        if (!text || isQuizFinished || !currentWord || !currentChar) return;

        setTotalAttempts(prev => prev + text.length);

        // 1. Direct Chinese Character Input (Mobile Chinese Keyboard / IME)
        // Check if the user typed the exact character, or even the entire word
        const isChineseInput = /[\u4e00-\u9fa5]/.test(text);

        if (isChineseInput) {
            // Case A: User typed or selected the entire current word directly
            if (text === currentWord.word) {
                soundEffects.playCharSuccess();
                setCorrectKeystrokes(prev => prev + text.length);
                setCurrentCharIndex(currentWord.chars.length);
                setInputBuffer('');
                setHasError(false);
                handleWordCompleted(currentWord);
                return;
            }

            // Case B: User typed the exact active character
            if (text === currentChar.char) {
                soundEffects.playCharSuccess();
                setCorrectKeystrokes(prev => prev + 1);
                setInputBuffer('');
                setHasError(false);

                const nextCharIdx = currentCharIndex + 1;
                if (nextCharIdx >= currentWord.chars.length) {
                    handleWordCompleted(currentWord);
                } else {
                    setCurrentCharIndex(nextCharIdx);
                }
                return;
            }

            // Case C: User typed an incorrect Chinese character
            soundEffects.playError();
            setHasError(true);
            setStreak(0);
            return;
        }

        // 2. Zhuyin Symbol or DaChien Key input
        let currBuffer = inputBuffer;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let zhuyinSymbol = char;
            if (KEY_TO_ZHUYIN[char]) {
                zhuyinSymbol = KEY_TO_ZHUYIN[char];
            }

            soundEffects.playKeypress();
            const candidateBuffer = currBuffer + zhuyinSymbol;
            const evalResult = evaluateZhuyinInput(candidateBuffer, currentChar.zhuyin);

            if (evalResult.matched) {
                soundEffects.playCharSuccess();
                setCorrectKeystrokes(prev => prev + 1);
                currBuffer = '';
                setHasError(false);

                const nextCharIdx = currentCharIndex + 1;
                if (nextCharIdx >= currentWord.chars.length) {
                    handleWordCompleted(currentWord);
                    return;
                } else {
                    setCurrentCharIndex(nextCharIdx);
                }
            } else if (evalResult.isPrefix) {
                currBuffer = candidateBuffer;
                setHasError(false);
                setCorrectKeystrokes(prev => prev + 1);
            } else {
                soundEffects.playError();
                setHasError(true);
                setStreak(0);
                currBuffer = candidateBuffer;
            }
        }

        setInputBuffer(currBuffer);
    }, [isQuizFinished, currentWord, currentChar, currentCharIndex, inputBuffer, handleWordCompleted]);

    // Handle physical key or virtual key tap
    const handleKeyAction = useCallback((symbolOrKey) => {
        if (!isQuizActive || isQuizFinished) return;

        setActiveKeyPressed(symbolOrKey);
        setTimeout(() => setActiveKeyPressed(null), 120);

        if (symbolOrKey === 'Backspace' || symbolOrKey === 'Del') {
            soundEffects.playKeypress();
            setInputBuffer(prev => prev.slice(0, -1));
            setHasError(false);
            return;
        }

        processInputText(symbolOrKey);
    }, [isQuizActive, isQuizFinished, processInputText]);

    // Physical Keyboard Listener
    useEffect(() => {
        if (!isQuizActive || isQuizFinished) return;

        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.target === nativeInputRef.current) return;

            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                handleKeyAction(' ');
                return;
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                handleKeyAction('Backspace');
                return;
            }

            if (e.key.length === 1) {
                handleKeyAction(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isQuizActive, isQuizFinished, handleKeyAction]);

    // Accuracy calculation
    const accuracy = useMemo(() => {
        if (totalAttempts === 0) return 100;
        return Math.min(100, Math.round((correctKeystrokes / totalAttempts) * 100));
    }, [correctKeystrokes, totalAttempts]);

    // Highlight next expected key on virtual keyboard
    const nextExpectedKey = useMemo(() => {
        if (!currentChar || !enableKeyGuide) return null;
        const evalResult = evaluateZhuyinInput(inputBuffer, currentChar.zhuyin);
        if (evalResult.nextKey) {
            return evalResult.nextKey.toLowerCase();
        }
        if (!inputBuffer) {
            const { expectedSequence } = decomposeZhuyin(currentChar.zhuyin);
            const first = expectedSequence[0];
            return first ? (ZHUYIN_TO_KEY[first] || '').toLowerCase() : null;
        }
        return null;
    }, [currentChar, inputBuffer, enableKeyGuide]);

    // =========================================================================
    // VIEW 1: QUIZ SELECTION / SETUP SCREEN
    // =========================================================================
    if (!isQuizActive) {
        return (
            <div className="flex-1 w-full max-w-full overflow-y-auto p-4 md:p-8 bg-neutral-50" data-testid="word-quiz-setup">
                <div className="max-w-4xl mx-auto">
                    {/* Header Banner */}
                    <div className="mb-8 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
                            <span>🎯 TOCFL 單字隨堂測驗</span>
                            <span>•</span>
                            <span>Word Quiz</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
                            TOCFL 詞彙測驗 (Word Quiz)
                        </h1>
                        <p className="text-sm md:text-base text-neutral-600">
                            依據 TOCFL 等級 (Band A/B/C) 與詞性 (名詞、動詞、形容詞等) 進行注音打字測驗。
                            支援電腦注音鍵盤與手機中文直接輸入！
                        </p>
                    </div>

                    {/* Step 1: Select TOCFL Level */}
                    <div className="bg-white rounded-2xl border border-neutral-200 p-5 md:p-6 shadow-xs mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base md:text-lg font-bold text-neutral-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                                選擇測驗級別 (Choose TOCFL Level)
                            </h2>
                            <span className="text-xs text-neutral-400 font-medium">
                                共 {TOCFL_WORDS.length} 個實用詞彙
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {TOCFL_LEVEL_META.map(level => {
                                const isSelected = selectedLevel === level.id;
                                const count = wordCounts[level.id]?.all || 0;

                                return (
                                    <button
                                        key={level.id}
                                        type="button"
                                        data-testid={`level-btn-${level.id}`}
                                        onClick={() => setSelectedLevel(level.id)}
                                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${isSelected
                                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900 ring-offset-2'
                                            : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                                                    {level.badge}
                                                </span>
                                                <span className={`text-xs font-semibold ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                                    {count} 詞
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold mb-1">{level.name}</h3>
                                            <p className={`text-xs mb-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                                {level.subName}
                                            </p>
                                        </div>
                                        <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                                            {level.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Select Part of Speech (Word Type) */}
                    <div className="bg-white rounded-2xl border border-neutral-200 p-5 md:p-6 shadow-xs mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base md:text-lg font-bold text-neutral-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                                選擇詞性類別 (Choose Word Type)
                            </h2>
                            <span className="text-xs text-neutral-500">
                                當前篩選: {availableFilteredWords.length} 詞
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                            {TOCFL_WORD_TYPES.map(type => {
                                const isSelected = selectedType === type.id;
                                const count = type.id === 'all'
                                    ? (wordCounts[selectedLevel]?.all || 0)
                                    : (wordCounts[selectedLevel]?.[type.id] || 0);

                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        data-testid={`type-btn-${type.id}`}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${isSelected
                                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                            : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                                            }`}
                                    >
                                        <span className="text-xl">{type.icon}</span>
                                        <span className="text-xs font-bold">{type.labelZh}</span>
                                        <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                            {type.labelEn}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 3: Quiz Options & Launch */}
                    <div className="bg-white rounded-2xl border border-neutral-200 p-5 md:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                題數設定 (Quiz Length)
                            </span>
                            <div className="flex gap-2">
                                {[5, 10, 15, 'all'].map(len => (
                                    <button
                                        key={len}
                                        type="button"
                                        onClick={() => setQuizLength(len)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${quizLength === len
                                            ? 'bg-neutral-900 text-white border-neutral-900'
                                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                            }`}
                                    >
                                        {len === 'all' ? '全部 (All)' : `${len} 題`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            data-testid="start-quiz-button"
                            disabled={availableFilteredWords.length === 0}
                            onClick={() => startQuiz()}
                            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-base transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>開始測驗 (Start Quiz)</span>
                            <span>→</span>
                        </button>
                    </div>

                    {/* Preview of words in selected group */}
                    {availableFilteredWords.length > 0 && (
                        <div className="mt-6 p-4 rounded-xl bg-neutral-100/70 border border-neutral-200/80">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                                本類別單字預覽 (Vocabulary Preview):
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {availableFilteredWords.slice(0, 12).map((w) => (
                                    <span
                                        key={w.id}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 shadow-2xs"
                                    >
                                        <span className="font-bold">{w.word}</span>
                                        <span className="text-[11px] text-neutral-400 font-mono">({w.zhuyin})</span>
                                    </span>
                                ))}
                                {availableFilteredWords.length > 12 && (
                                    <span className="px-2 py-1 text-xs text-neutral-400">
                                        + 還有 {availableFilteredWords.length - 12} 個詞彙
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: QUIZ FINISHED / SUMMARY SCREEN
    // =========================================================================
    if (isQuizFinished) {
        return (
            <div className="flex-1 w-full max-w-full overflow-y-auto p-4 md:p-8 bg-neutral-50 flex items-center justify-center" data-testid="word-quiz-results">
                <div className="max-w-2xl w-full bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                        🎉
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-1">
                        測驗完成！ (Quiz Completed!)
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        你完成了 {wordQueue.length} 個 {activeLevelMeta.name} 詞彙練習
                        {quizHistory.some(item => item.skipped) && (
                            <span className="text-amber-600 font-semibold ml-1.5">
                                (跳過 {quizHistory.filter(i => i.skipped).length} 題)
                            </span>
                        )}
                    </p>

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            <span className="text-[11px] font-bold text-neutral-400 block uppercase">得分 (Score)</span>
                            <span className="text-2xl font-black text-neutral-900" data-testid="final-score">{score}</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            <span className="text-[11px] font-bold text-neutral-400 block uppercase">準確率 (Accuracy)</span>
                            <span className="text-2xl font-black text-emerald-600" data-testid="final-accuracy">{accuracy}%</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            <span className="text-[11px] font-bold text-neutral-400 block uppercase">最高連擊 (Max Streak)</span>
                            <span className="text-2xl font-black text-amber-500">🔥 {maxStreak}</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            <span className="text-[11px] font-bold text-neutral-400 block uppercase">用時 (Time)</span>
                            <span className="text-2xl font-black text-neutral-700">
                                {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    {/* List of practiced words with audio review */}
                    <div className="text-left mb-8">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>練習詞彙回顧 (Reviewed Vocabulary):</span>
                            {quizHistory.some(item => item.skipped) && (
                                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                                    跳過 {quizHistory.filter(i => i.skipped).length} 題
                                </span>
                            )}
                        </h3>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                            {quizHistory.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-2.5 rounded-lg border text-sm ${item.skipped ? 'bg-amber-50/50 border-amber-200/80' : 'bg-neutral-50 border-neutral-200'}`}
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => speakWord(item.word)}
                                            className="text-neutral-400 hover:text-neutral-800 transition cursor-pointer"
                                            title="Listen to pronunciation"
                                        >
                                            🔊
                                        </button>
                                        <span className="font-bold text-neutral-900 text-base">{item.word}</span>
                                        <span className="text-neutral-500 font-mono text-xs">{item.zhuyin}</span>
                                        <span className="text-neutral-400 text-xs hidden sm:inline">[{item.pinyin}]</span>
                                        {item.skipped && (
                                            <span data-testid="skipped-badge" className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                                已跳過 (Skipped)
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-neutral-600 text-xs font-medium truncate max-w-[200px]">
                                        {item.meaning}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => startQuiz()}
                            className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition cursor-pointer shadow-md"
                        >
                            🔄 再測驗一次 (Practice Again)
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsQuizActive(false);
                                setIsQuizFinished(false);
                            }}
                            className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition cursor-pointer border border-neutral-300"
                        >
                            ← 重新選擇等級與詞性 (Change Setup)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 3: ACTIVE QUIZ VIEW
    // =========================================================================
    const progressPercent = Math.round(((currentWordIndex + (isWordCompleted ? 1 : 0)) / wordQueue.length) * 100);

    return (
        <div className="flex-1 w-full max-w-full flex flex-col bg-neutral-100 overflow-hidden relative" data-testid="word-quiz-active">
            {/* Top Navigation & Status HUD */}
            <header className="flex-none bg-white border-b border-neutral-200 px-3 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('確定要退出當前測驗嗎？(Quit quiz?)')) {
                                setIsQuizActive(false);
                            }
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition border border-neutral-200 cursor-pointer"
                    >
                        ← 退出
                    </button>

                    <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                            {activeLevelMeta.badge}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-700">
                            {currentWord?.typeZh || '詞彙'} ({currentWord?.type})
                        </span>
                    </div>
                </div>

                {/* Score & HUD Counters */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs">
                    <div className="flex items-baseline gap-1">
                        <span className="text-neutral-400 font-semibold">題數:</span>
                        <span className="font-mono font-bold text-neutral-800" data-testid="word-counter">
                            {currentWordIndex + 1} / {wordQueue.length}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-neutral-400 font-semibold">得分:</span>
                        <span className="font-mono font-bold text-emerald-600 text-sm md:text-base">
                            {score}
                        </span>
                    </div>

                    {streak > 1 && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                            <span>🔥 {streak} 連擊</span>
                        </div>
                    )}

                    <button
                        type="button"
                        data-testid="header-skip-button"
                        onClick={() => handleSkipWord()}
                        className="px-2 py-1 text-xs rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95"
                        title="跳過當前題目 (Skip current word)"
                    >
                        <span>⏭️ 跳過</span>
                    </button>
                </div>

                {/* Controls (Sound, Guide, Mobile Mode, Font) */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowZhuyinGuide(g => !g)}
                        className={`px-2 py-1 text-xs rounded-md font-medium transition border cursor-pointer ${showZhuyinGuide
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-white text-neutral-400 border-neutral-200'
                            }`}
                        title="Toggle Zhuyin Guide"
                    >
                        {showZhuyinGuide ? '注音顯' : '注音隱'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSoundEnabled(s => !s)}
                        className={`p-1.5 text-xs rounded-md transition border cursor-pointer ${soundEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white text-neutral-400 border-neutral-200'
                            }`}
                        title={soundEnabled ? 'Mute' : 'Unmute'}
                    >
                        {soundEnabled ? '🔊' : '🔇'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setMobileInputMode(m => m === 'phone' ? 'onscreen' : 'phone')}
                        className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium transition cursor-pointer flex items-center gap-1"
                        title="Switch between mobile Chinese keyboard and on-screen Zhuyin touch keys"
                    >
                        <span>{mobileInputMode === 'phone' ? '📱 手機鍵盤' : '⌨️ 螢幕鍵盤'}</span>
                    </button>

                    <FontSizeControl compact />
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 h-1.5">
                <div
                    className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Main Interactive Quiz Card Container */}
            <div
                className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 overflow-y-auto w-full max-w-full"
                onClick={() => {
                    // Tap anywhere on card to refocus phone input
                    nativeInputRef.current?.focus({ preventScroll: true });
                }}
            >
                <div className="max-w-2xl w-full bg-white rounded-2xl md:rounded-3xl border border-neutral-200/90 shadow-lg p-5 md:p-8 flex flex-col items-center relative overflow-hidden">
                    {/* Level & Part of Speech Badge */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                            {activeLevelMeta.name}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {currentWord?.typeZh} ({currentWord?.type})
                        </span>
                    </div>

                    {/* Word Character Displays with Ruby Zhuyin */}
                    <div className="flex items-center justify-center gap-3 sm:gap-5 my-4 sm:my-6 select-none" data-testid="quiz-target-word">
                        {currentWord?.chars?.map((charObj, idx) => {
                            const isCompleted = idx < currentCharIndex || isWordCompleted;
                            const isActive = idx === currentCharIndex && !isWordCompleted;

                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all ${isActive
                                        ? 'bg-blue-50/80 ring-2 ring-blue-500 shadow-md scale-105'
                                        : isCompleted
                                            ? 'bg-emerald-50/80 border border-emerald-200'
                                            : 'bg-neutral-50/60 border border-neutral-200/60 opacity-80'
                                        }`}
                                >
                                    {/* Zhuyin phonetic guide above or beside character */}
                                    <div
                                        className={`font-mono text-xs sm:text-sm font-semibold mb-1 transition-opacity ${showZhuyinGuide ? 'opacity-100' : 'opacity-20'
                                            } ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-neutral-400'}`}
                                    >
                                        {showZhuyinGuide ? charObj.zhuyin : '•••'}
                                    </div>

                                    {/* Chinese Character */}
                                    <div
                                        className={`font-serif font-bold leading-none tracking-normal ${isActive
                                            ? 'text-neutral-900'
                                            : isCompleted
                                                ? 'text-emerald-700'
                                                : 'text-neutral-400'
                                            }`}
                                        style={{ fontSize: `${Math.max(fontSize, 42)}px` }}
                                    >
                                        {charObj.char}
                                    </div>

                                    {/* Pinyin subtitle */}
                                    <div className="text-[11px] font-mono text-neutral-400 mt-1">
                                        {charObj.pinyin}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* English Meaning (Core Quiz Requirement) */}
                    <div className="text-center my-2 max-w-lg">
                        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                            英文涵義 (English Meaning):
                        </div>
                        <div className="text-lg md:text-xl font-bold text-neutral-800" data-testid="english-meaning">
                            {currentWord?.meaning}
                        </div>
                    </div>

                    {/* Action Buttons: Audio, Example Toggle & Skip Option */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                speakWord(currentWord?.word);
                            }}
                            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            title="Listen to native Taiwanese Mandarin pronunciation"
                        >
                            <span>🔊 聽發音 (Listen)</span>
                        </button>

                        {currentWord?.exampleZh && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExampleSentence(s => !s)}
                                }
                                className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                                <span>📖 {showExampleSentence ? '收合例句' : '查看例句'}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            data-testid="skip-word-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSkipWord();
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                            title="跳過當前題目 (Skip to next word)"
                        >
                            <span>⏭️ 跳過 (Skip)</span>
                        </button>
                    </div>

                    {/* Expandable Example Sentence */}
                    {showExampleSentence && currentWord?.exampleZh && (
                        <div className="mt-4 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center w-full max-w-lg animate-fadeIn">
                            <p className="font-serif text-sm font-semibold text-neutral-900 mb-1">
                                {currentWord.exampleZh}
                            </p>
                            <p className="text-xs text-neutral-500 italic">
                                {currentWord.exampleEn}
                            </p>
                        </div>
                    )}

                    {/* Active Input Status Display & Mobile Hint */}
                    <div className="w-full max-w-md mt-6 pt-4 border-t border-neutral-100 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-neutral-500 font-medium">當前輸入注音:</span>
                            <span
                                data-testid="input-buffer"
                                className={`px-3 py-1 rounded-lg font-mono text-sm md:text-base font-bold min-w-[3.5rem] text-center transition-all ${hasError
                                    ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                                    : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                                    }`}
                            >
                                {inputBuffer || '＿'}
                            </span>

                            {currentChar && enableKeyGuide && (
                                <span className="text-[11px] text-neutral-400 font-mono">
                                    目標: {currentChar.zhuyin}
                                </span>
                            )}
                        </div>

                        {/* Input Prompt Helper */}
                        <p className="text-[11px] text-neutral-400 text-center">
                            {mobileInputMode === 'phone'
                                ? '📱 點擊此處喚起手機中文鍵盤，可直接選字或打注音'
                                : '⌨️ 請使用下方螢幕注音鍵盤或實體鍵盤輸入'}
                        </p>

                        {/* Native Hidden/Transparent Input - Captures Mobile Chinese Keyboard & IME Composition Events */}
                        <input
                            ref={nativeInputRef}
                            data-testid="native-quiz-input"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            autoComplete="off"
                            spellCheck="false"
                            className="opacity-0 w-full h-8 cursor-pointer -mt-6"
                            style={{
                                fontSize: '16px', // 16px avoids iOS Safari automatic zoom-in
                                caretColor: 'transparent',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none'
                            }}
                            onCompositionStart={() => {
                                isComposingRef.current = true;
                            }}
                            onCompositionUpdate={(e) => {
                                if (e.data) {
                                    setInputBuffer(e.data);
                                }
                            }}
                            onCompositionEnd={(e) => {
                                isComposingRef.current = false;
                                const text = e.data || e.target.value;
                                if (text) {
                                    processInputText(text);
                                }
                                e.target.value = '';
                            }}
                            onInput={(e) => {
                                if (isComposingRef.current) return;
                                const val = e.target.value;
                                if (val) {
                                    processInputText(val);
                                    e.target.value = '';
                                }
                            }}
                            onChange={(e) => {
                                if (isComposingRef.current) return;
                                const val = e.target.value;
                                if (val) {
                                    processInputText(val);
                                    e.target.value = '';
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                    handleKeyAction('Backspace');
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom On-Screen Zhuyin Keyboard (Shown when in 'onscreen' mode) */}
            {mobileInputMode === 'onscreen' && (
                <footer className="flex-none bg-neutral-900 border-t border-neutral-800 p-2 md:p-3 select-none z-20">
                    <div className="max-w-3xl mx-auto flex flex-col gap-1.5">
                        {MOBILE_KEYBOARD_LAYOUT.map((row, rowIdx) => (
                            <div key={rowIdx} className="flex justify-center gap-1 md:gap-1.5 w-full">
                                {row.map((k) => {
                                    const isTargetNext = nextExpectedKey && (
                                        (k.zhuyin && k.zhuyin === nextExpectedKey) ||
                                        (k.key && k.key.toLowerCase() === nextExpectedKey)
                                    );
                                    const isPressed = activeKeyPressed === k.key || activeKeyPressed === k.zhuyin;

                                    return (
                                        <button
                                            key={k.key}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                triggerHaptic();
                                                handleKeyAction(k.key);
                                            }}
                                            className={`py-2 px-1 md:py-2.5 rounded-lg flex flex-col items-center justify-center transition active:scale-95 cursor-pointer touch-manipulation ${k.width || 'flex-1 min-w-[28px]'
                                                } ${isTargetNext
                                                    ? 'bg-amber-400 text-neutral-950 font-bold ring-2 ring-amber-300'
                                                    : isPressed
                                                        ? 'bg-neutral-600 text-white'
                                                        : k.type === 'tone'
                                                            ? 'bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50'
                                                            : k.type === 'action'
                                                                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                                                                : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60'
                                                }`}
                                        >
                                            <span className="text-sm md:text-base font-bold leading-none">
                                                {k.label}
                                            </span>
                                            {k.sub && (
                                                <span className="text-[9px] text-neutral-400 leading-none mt-0.5">
                                                    {k.sub}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </footer>
            )}
        </div>
    );
}
