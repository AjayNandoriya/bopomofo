import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TOCFL_LEVELS, TOCFL_PARAGRAPHS } from '../data/tocflTyping';
import { toTraditional, annotateZhuyin } from '../utils/converter';
import { useFontSize, FontSizeControl } from '../context/FontSizeContext';
import {
    KEY_TO_ZHUYIN,
    ZHUYIN_TO_KEY,
    VIRTUAL_KEYBOARD_LAYOUT,
    MOBILE_KEYBOARD_LAYOUT,
    decomposeZhuyin,
    evaluateZhuyinInput,
    soundEffects
} from '../utils/zhuyinKeyboard';

function ZhuyinTyping() {
    // Font size state
    const { fontSize, pinyinSize, zhuyinSize } = useFontSize();

    // Selection state
    const [selectedLevel, setSelectedLevel] = useState('A'); // 'A' | 'B' | 'C' | 'custom'
    const [activeParagraph, setActiveParagraph] = useState(null);
    const [customInputText, setCustomInputText] = useState('');

    // Full screen focus mode (hides menus and extra banners)
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Device / Mobile responsiveness state
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [keyboardLayoutMode, setKeyboardLayoutMode] = useState('auto'); // 'auto' | 'mobile' | 'desktop'
    const hiddenInputRef = useRef(null);
    const isComposingRef = useRef(false);
    const readingBoxRef = useRef(null);
    const activeCharRef = useRef(null);

    // Prepared character stream for typing
    // Array of { char, zhuyin, pinyin, isPunctuation }
    const [charStream, setCharStream] = useState([]);

    // Typing progress state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputBuffer, setInputBuffer] = useState('');
    const [hasError, setHasError] = useState(false);

    // Metrics state
    const [startTime, setStartTime] = useState(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);

    // Visual / Helper settings
    const [showPinyin, setShowPinyin] = useState(false);
    const [showZhuyin, setShowZhuyin] = useState(true);
    const [showKeyboard, setShowKeyboard] = useState(!isMobile);
    const [enableKeyGuide, setEnableKeyGuide] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [activeKeyPressed, setActiveKeyPressed] = useState(null);

    // Resize listener for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filtered paragraphs by level
    const currentParagraphs = useMemo(() => {
        return TOCFL_PARAGRAPHS.filter(p => p.level === selectedLevel);
    }, [selectedLevel]);

    const activeChar = charStream[currentIndex] || null;

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (startTime && !isFinished) {
            interval = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
            }, 500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [startTime, isFinished]);

    // Sound toggle effect
    useEffect(() => {
        soundEffects.enabled = soundEnabled;
    }, [soundEnabled]);

    // Keep active typing character in view inside the reading box without shifting the screen
    useEffect(() => {
        if (activeCharRef.current && readingBoxRef.current) {
            const box = readingBoxRef.current;
            const charEl = activeCharRef.current;
            const boxRect = box.getBoundingClientRect();
            const charRect = charEl.getBoundingClientRect();

            if (charRect.bottom > boxRect.bottom - 24) {
                box.scrollTop += (charRect.bottom - boxRect.bottom) + 32;
            } else if (charRect.top < boxRect.top + 24) {
                box.scrollTop -= (boxRect.top - charRect.top) + 32;
            }
        }
    }, [currentIndex]);

    // Haptic feedback helper for mobile touch
    const triggerHaptic = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(10);
            } catch (e) {
                // Ignore vibration errors
            }
        }
    }, []);

    // Active keyboard layout: mobile-optimized or desktop
    const activeKeyboardLayout = useMemo(() => {
        if (keyboardLayoutMode === 'mobile') return MOBILE_KEYBOARD_LAYOUT;
        if (keyboardLayoutMode === 'desktop') return VIRTUAL_KEYBOARD_LAYOUT;
        return isMobile ? MOBILE_KEYBOARD_LAYOUT : VIRTUAL_KEYBOARD_LAYOUT;
    }, [keyboardLayoutMode, isMobile]);

    // Setup paragraph for practice
    const startPractice = useCallback(async (paragraphData, customText = null) => {
        const textToConvert = customText || paragraphData.contentZh;
        const traditional = await toTraditional(textToConvert);
        const annotated = annotateZhuyin(traditional);

        // Normalize character stream
        const stream = [];
        for (const item of annotated) {
            if (item.char === '\r') continue;
            const isPunc = !/[\u4e00-\u9fa5]/.test(item.char);
            stream.push({
                char: item.char,
                zhuyin: item.zhuyin || '',
                pinyin: item.pinyin || '',
                isPunctuation: isPunc
            });
        }

        setCharStream(stream);
        setActiveParagraph(paragraphData || {
            title: 'Custom Practice Text',
            titleZh: '自訂練習文章',
            description: '自行輸入或貼上的練習文章',
            targetVocab: []
        });
        setCurrentIndex(0);
        setInputBuffer('');
        setHasError(false);
        setStartTime(null);
        setElapsedSeconds(0);
        setIsFinished(false);
        setCorrectCount(0);
        setTotalKeystrokes(0);
        setStreak(0);
        setMaxStreak(0);

        // Focus hidden input for mobile/desktop direct typing without scrolling the viewport
        setTimeout(() => {
            if (hiddenInputRef.current) {
                hiddenInputRef.current.focus({ preventScroll: true });
            }
        }, 50);
    }, []);

    // Helper to evaluate next key to highlight on virtual keyboard
    const nextKeyToPress = useMemo(() => {
        if (!activeChar || activeChar.isPunctuation || !enableKeyGuide) return null;
        const evalResult = evaluateZhuyinInput(inputBuffer, activeChar.zhuyin);
        if (evalResult.nextKey) {
            return evalResult.nextKey.toLowerCase();
        }
        if (!inputBuffer) {
            const { expectedSequence } = decomposeZhuyin(activeChar.zhuyin);
            const firstSymbol = expectedSequence[0];
            if (firstSymbol) {
                return (ZHUYIN_TO_KEY[firstSymbol] || '').toLowerCase();
            }
        }
        return null;
    }, [activeChar, inputBuffer, enableKeyGuide]);

    // Character advance logic
    const advanceToNext = useCallback((updatedIndex, isSuccess = true) => {
        if (isSuccess) {
            soundEffects.playCharSuccess();
            setCorrectCount(prev => prev + 1);
            setStreak(prev => {
                const next = prev + 1;
                setMaxStreak(m => Math.max(m, next));
                return next;
            });
        }

        setInputBuffer('');
        setHasError(false);

        let nextIdx = updatedIndex + 1;
        // Skip through consecutive whitespace or punctuation automatically
        while (nextIdx < charStream.length && charStream[nextIdx].char === ' ') {
            nextIdx++;
        }

        if (nextIdx >= charStream.length) {
            setIsFinished(true);
            soundEffects.playComplete();
            setCurrentIndex(charStream.length);
        } else {
            setCurrentIndex(nextIdx);
        }
    }, [charStream]);

    // Core input processing: handles direct Chinese characters, Zhuyin symbols, punctuation, and multi-char strings
    const processInputText = useCallback((text) => {
        if (!text || isFinished || !charStream.length) return;

        // Initialize timer on first input
        if (!startTime) {
            setStartTime(Date.now());
        }

        let currIdx = currentIndex;
        let currBuffer = inputBuffer;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (currIdx >= charStream.length) break;
            const target = charStream[currIdx];

            setTotalKeystrokes(prev => prev + 1);

            // 1. Direct character match (Chinese character or identical symbol)
            if (char === target.char) {
                soundEffects.playCharSuccess();
                setCorrectCount(prev => prev + 1);
                setStreak(prev => {
                    const next = prev + 1;
                    setMaxStreak(m => Math.max(m, next));
                    return next;
                });
                currBuffer = '';
                setHasError(false);
                currIdx++;
                while (currIdx < charStream.length && charStream[currIdx].char === ' ') {
                    currIdx++;
                }
                continue;
            }

            // 2. Target is punctuation or newline
            if (target.isPunctuation) {
                const isPuncMatch = (
                    char === target.char ||
                    char === ' ' ||
                    char === '\n' ||
                    char === 'Enter' ||
                    (target.char === '，' && char === ',') ||
                    (target.char === '。' && char === '.') ||
                    (target.char === '！' && char === '!') ||
                    (target.char === '？' && char === '?') ||
                    (target.char === '：' && char === ':') ||
                    (target.char === '；' && char === ';') ||
                    (target.char === '「' && (char === '"' || char === "'")) ||
                    (target.char === '」' && (char === '"' || char === "'")) ||
                    (target.char === '（' && char === '(') ||
                    (target.char === '）' && char === ')')
                );

                if (isPuncMatch) {
                    soundEffects.playCharSuccess();
                    currBuffer = '';
                    setHasError(false);
                    currIdx++;
                    while (currIdx < charStream.length && charStream[currIdx].char === ' ') {
                        currIdx++;
                    }
                } else {
                    soundEffects.playError();
                    setHasError(true);
                    setStreak(0);
                    currBuffer = char;
                }
                continue;
            }

            // 3. If user typed a Chinese character that does NOT match target
            const isChineseChar = /[\u4e00-\u9fa5]/.test(char);
            if (isChineseChar) {
                soundEffects.playError();
                setHasError(true);
                setStreak(0);
                currBuffer = char;
                continue;
            }

            // 4. Zhuyin symbol or mapped key
            let zhuyinInputChar = char;
            if (KEY_TO_ZHUYIN[char]) {
                zhuyinInputChar = KEY_TO_ZHUYIN[char];
            }

            soundEffects.playKeypress();
            const newInputBuffer = currBuffer + zhuyinInputChar;
            const evalResult = evaluateZhuyinInput(newInputBuffer, target.zhuyin);

            if (evalResult.matched) {
                soundEffects.playCharSuccess();
                setCorrectCount(prev => prev + 1);
                setStreak(prev => {
                    const next = prev + 1;
                    setMaxStreak(m => Math.max(m, next));
                    return next;
                });
                currBuffer = '';
                setHasError(false);
                currIdx++;
                while (currIdx < charStream.length && charStream[currIdx].char === ' ') {
                    currIdx++;
                }
            } else if (evalResult.isPrefix) {
                currBuffer = newInputBuffer;
                setHasError(false);
            } else {
                soundEffects.playError();
                setHasError(true);
                setStreak(0);
                currBuffer = newInputBuffer;
            }
        }

        setInputBuffer(currBuffer);
        if (currIdx >= charStream.length) {
            setIsFinished(true);
            soundEffects.playComplete();
            setCurrentIndex(charStream.length);
        } else {
            setCurrentIndex(currIdx);
        }
    }, [isFinished, charStream, startTime, currentIndex, inputBuffer]);

    // Handle physical key, virtual key, or backspace
    const handleInput = useCallback((symbolOrKey) => {
        if (isFinished || !activeChar) return;

        // Animate key visual
        setActiveKeyPressed(symbolOrKey);
        setTimeout(() => setActiveKeyPressed(null), 150);

        // Handle Backspace
        if (symbolOrKey === 'Backspace' || symbolOrKey === 'Del') {
            soundEffects.playKeypress();
            setInputBuffer(prev => prev.slice(0, -1));
            setHasError(false);
            return;
        }

        processInputText(symbolOrKey);
    }, [isFinished, activeChar, processInputText]);

    // Handle touch / click on virtual keys
    const handleVirtualKeyPress = useCallback((e, key) => {
        e.preventDefault();
        triggerHaptic();
        handleInput(key);
    }, [triggerHaptic, handleInput]);

    // Listen to physical keyboard events
    useEffect(() => {
        if (!activeParagraph || isFinished) return;

        const handleKeyDown = (e) => {
            // Ignore browser shortcuts with Meta or Ctrl
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            // If focused on hidden input, let the input events handle it
            if (e.target === hiddenInputRef.current) return;

            // Prevent scroll on spacebar
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                handleInput(' ');
                return;
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                handleInput('Backspace');
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                handleInput('Enter');
                return;
            }

            // Normal key
            if (e.key && e.key.length === 1) {
                handleInput(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeParagraph, isFinished, handleInput]);

    // Calculate stats
    const accuracy = totalKeystrokes > 0
        ? Math.max(0, Math.round((correctCount / Math.max(correctCount, totalKeystrokes - correctCount * 0.5)) * 100))
        : 100;
    const cpm = elapsedSeconds > 0
        ? Math.round((correctCount / elapsedSeconds) * 60)
        : 0;
    const wpm = Math.round(cpm / 2); // Average 2 chars per Chinese word
    const progressPercent = charStream.length > 0
        ? Math.min(100, Math.round((currentIndex / charStream.length) * 100))
        : 0;

    // Active character target info
    const activeTargetInfo = useMemo(() => {
        if (!activeChar || activeChar.isPunctuation) return null;
        const decomp = decomposeZhuyin(activeChar.zhuyin);
        const nextKey = nextKeyToPress;
        return {
            zhuyin: activeChar.zhuyin,
            pinyin: activeChar.pinyin,
            symbols: decomp.symbols,
            tone: decomp.tone || '一聲 (Space)',
            nextKey
        };
    }, [activeChar, nextKeyToPress]);

    // Render Paragraph Selector View
    if (!activeParagraph) {
        return (
            <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden bg-neutral-50 p-3 sm:p-6 md:p-8 w-full max-w-full">
                {/* Header */}
                <div className="max-w-6xl mx-auto w-full mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                                ⌨️ 台灣標準注音打字練習
                            </div>
                            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                                Zhuyin Typing Practice
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Select a TOCFL vocabulary level to practice reading and typing in standard Taiwanese Bopomofo.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 font-medium">字體:</span>
                            <FontSizeControl />
                        </div>
                    </div>

                    {/* Level Tabs */}
                    <div className="mt-8 flex flex-wrap gap-3 border-b border-neutral-200 pb-4">
                        {TOCFL_LEVELS.map(level => {
                            const isSelected = selectedLevel === level.id;
                            return (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${isSelected
                                        ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/20 scale-[1.02]'
                                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                                        }`}
                                >
                                    <span className="font-bold">{level.badge}</span>
                                    <span>{level.name}</span>
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setSelectedLevel('custom')}
                            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${selectedLevel === 'custom'
                                ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/20 scale-[1.02]'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                                }`}
                        >
                            <span>✍️ 自訂練習 (Custom Text)</span>
                        </button>
                    </div>

                    {/* Level Description Banner */}
                    {selectedLevel !== 'custom' && (
                        <div className="mt-4 p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between">
                            <div className="text-sm text-neutral-700">
                                <span className="font-semibold text-neutral-900">
                                    {TOCFL_LEVELS.find(l => l.id === selectedLevel)?.name}:
                                </span>{' '}
                                {TOCFL_LEVELS.find(l => l.id === selectedLevel)?.description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Paragraphs Grid / Custom Input Form */}
                <div className="max-w-6xl mx-auto w-full pb-12">
                    {selectedLevel === 'custom' ? (
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
                            <h2 className="text-xl font-bold text-neutral-800 mb-2">Enter Custom Chinese Text</h2>
                            <p className="text-sm text-neutral-500 mb-4">
                                Paste or type any Chinese text below. It will automatically be converted to Traditional Chinese with Zhuyin phonetic guides.
                            </p>
                            <textarea
                                value={customInputText}
                                onChange={(e) => setCustomInputText(e.target.value)}
                                rows={6}
                                placeholder="例如：台灣的小吃非常有名，珍珠奶茶和牛肉麵都很好吃..."
                                className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-neutral-800 font-sans text-base mb-4"
                            />
                            <button
                                disabled={!customInputText.trim()}
                                onClick={() => startPractice(null, customInputText.trim())}
                                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-medium transition cursor-pointer shadow-sm"
                            >
                                開始練習 (Start Practice) →
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {currentParagraphs.map(paragraph => (
                                <div
                                    key={paragraph.id}
                                    onClick={() => startPractice(paragraph)}
                                    className="group bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-700 group-hover:h-1.5 transition-all"></div>

                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                TOCFL Band {paragraph.level}
                                            </span>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                {paragraph.contentZh.length} 字
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                            {paragraph.titleZh}
                                        </h3>
                                        <p className="text-sm font-medium text-neutral-500 mb-3">
                                            {paragraph.title}
                                        </p>
                                        <p className="text-xs text-neutral-600 line-clamp-2 mb-4">
                                            {paragraph.description}
                                        </p>

                                        {/* Vocabulary Tags */}
                                        <div className="mb-4">
                                            <span className="text-[11px] font-semibold text-neutral-400 block mb-1.5 uppercase tracking-wider">
                                                重點詞彙 (Key Vocabulary):
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {paragraph.targetVocab.map((vocab, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md font-medium border border-neutral-200/60"
                                                        title={`${vocab.zhuyin} (${vocab.meaning})`}
                                                    >
                                                        {vocab.word}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-sm font-semibold text-neutral-800 group-hover:text-blue-600">
                                        <span>開始打字練習</span>
                                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Render Active Practice Arena
    return (
        <div className={`h-full flex flex-col bg-neutral-100/70 select-none w-full max-w-full ${isFullScreen
            ? 'fixed inset-0 z-50 overflow-hidden bg-neutral-100'
            : 'overflow-y-auto md:overflow-hidden overflow-x-hidden'
            }`}>
            {/* Native Input for Direct Keyboard & IME Support - Fixed offscreen to prevent mobile viewport shift */}
            <input
                ref={hiddenInputRef}
                type="text"
                className="opacity-0 pointer-events-none -z-50"
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1px',
                    height: '1px',
                    fontSize: '16px', // 16px font prevents iOS Safari auto-zoom and viewport jumping
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: 'transparent',
                    clipPath: 'inset(50%)'
                }}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                tabIndex={-1}
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
                        if (inputBuffer.length > 0 || hasError) {
                            e.preventDefault();
                            soundEffects.playKeypress();
                            setInputBuffer(prev => prev.slice(0, -1));
                            setHasError(false);
                        }
                    } else if (e.key === 'Enter') {
                        if (activeChar && activeChar.isPunctuation) {
                            e.preventDefault();
                            processInputText('\n');
                        }
                    }
                }}
            />

            {/* Top Navigation & Settings Bar */}
            <header className={`flex-none bg-white border-b border-neutral-200 px-3 md:px-6 py-2 z-20 shadow-xs max-w-full overflow-x-hidden ${isFullScreen ? 'flex items-center justify-between gap-2' : 'flex flex-col sm:flex-row sm:items-center justify-between gap-2'
                }`}>
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <button
                            onClick={() => {
                                setIsFullScreen(false);
                                setActiveParagraph(null);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center gap-1 transition cursor-pointer shrink-0"
                        >
                            <span>← 文章列表 (Back)</span>
                        </button>
                        <div className="h-4 w-px bg-neutral-200 shrink-0"></div>
                        <div className="truncate max-w-[160px] sm:max-w-xs">
                            <h2 className="text-xs sm:text-sm md:text-base font-bold text-neutral-800 leading-tight truncate">
                                {activeParagraph.titleZh}
                            </h2>
                            {!isFullScreen && (
                                <p className="text-[11px] text-neutral-400 hidden sm:block truncate">
                                    {activeParagraph.title}
                                </p>
                            )}
                        </div>
                    </div>

                    {!isFullScreen && (
                        <button
                            onClick={() => startPractice(activeParagraph)}
                            className="sm:hidden p-1.5 text-xs rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 cursor-pointer shrink-0"
                            title="Restart paragraph"
                        >
                            🔄
                        </button>
                    )}
                </div>

                {/* Controls (Scrollable on small mobile screens) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 no-scrollbar max-w-full">
                    <FontSizeControl compact />

                    <button
                        onClick={() => setShowPinyin(p => !p)}
                        className={`px-2 py-1 text-xs rounded-md font-medium transition border cursor-pointer whitespace-nowrap shrink-0 ${showPinyin
                            ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                            : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                        title="Toggle Pinyin display"
                    >
                        拼音 (Pinyin)
                    </button>

                    <button
                        onClick={() => setShowZhuyin(z => !z)}
                        className={`px-2 py-1 text-xs rounded-md font-medium transition border cursor-pointer whitespace-nowrap shrink-0 ${showZhuyin
                            ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                            : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                        title="Toggle Zhuyin display"
                    >
                        注音 (Zhuyin)
                    </button>

                    {/* Full screen toggle button */}
                    <button
                        onClick={() => {
                            setIsFullScreen(f => !f);
                            setTimeout(() => {
                                hiddenInputRef.current?.focus({ preventScroll: true });
                            }, 50);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition border cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs ${isFullScreen
                            ? 'bg-purple-600 text-white border-purple-600 font-bold hover:bg-purple-700'
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            }`}
                        title={isFullScreen ? 'Exit full screen' : 'Hide menus and expand full screen for typing'}
                    >
                        {isFullScreen ? '✕ 退出全螢幕' : '⛶ 全螢幕 (Full Screen)'}
                    </button>

                    {!isFullScreen && (
                        <>
                            <button
                                onClick={() => setEnableKeyGuide(g => !g)}
                                className={`px-2 py-1 text-xs rounded-md font-medium transition border cursor-pointer whitespace-nowrap shrink-0 ${enableKeyGuide
                                    ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold'
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                                    }`}
                                title="Highlight next key on virtual keyboard"
                            >
                                💡 導引
                            </button>

                            <button
                                onClick={() => setSoundEnabled(s => !s)}
                                className={`p-1.5 text-xs rounded-md transition border cursor-pointer shrink-0 ${soundEnabled
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-white text-neutral-400 border-neutral-200'
                                    }`}
                                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                            >
                                {soundEnabled ? '🔊' : '🔇'}
                            </button>

                            {!isMobile && (
                                <button
                                    onClick={() => setShowKeyboard(k => !k)}
                                    className={`px-2 py-1 text-xs rounded-md font-medium transition border cursor-pointer whitespace-nowrap shrink-0 ${showKeyboard
                                        ? 'bg-neutral-900 text-white border-neutral-900'
                                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                        }`}
                                >
                                    ⌨️ 鍵盤 ({showKeyboard ? '收合' : '展開'})
                                </button>
                            )}

                            {isMobile && (
                                <div className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium whitespace-nowrap shrink-0 flex items-center gap-1">
                                    <span>📱 手機注音模式</span>
                                </div>
                            )}

                            <button
                                onClick={() => startPractice(activeParagraph)}
                                className="hidden sm:block p-1.5 text-xs rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 cursor-pointer shrink-0"
                                title="Restart paragraph"
                            >
                                🔄
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Performance Stats HUD Bar (Hidden in full screen to maximize reading & typing space) */}
            {!isFullScreen && (
                <div className="flex-none bg-neutral-900 text-white px-3 md:px-6 py-2 flex items-center justify-between shadow-inner max-w-full overflow-x-hidden">
                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs md:text-sm min-w-0">
                        <div className="flex items-baseline gap-1">
                            <span className="text-neutral-400 text-[11px] font-semibold">CPM:</span>
                            <span className="text-base md:text-xl font-mono font-bold text-amber-400">{cpm}</span>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-neutral-400 text-[11px] font-semibold">WPM:</span>
                            <span className="text-sm md:text-lg font-mono font-bold text-white">{wpm}</span>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-neutral-400 text-[11px] font-semibold">準確率:</span>
                            <span className={`text-sm md:text-lg font-mono font-bold ${accuracy >= 90 ? 'text-emerald-400' : accuracy >= 75 ? 'text-yellow-400' : 'text-rose-400'}`}>
                                {accuracy}%
                            </span>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-neutral-400 text-[11px] font-semibold">進度:</span>
                            <span className="text-xs md:text-sm font-mono text-neutral-200">
                                {currentIndex}/{charStream.length}
                            </span>
                        </div>

                        {streak > 2 && (
                            <div className="hidden xs:flex items-center gap-1 text-[11px] text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-700/50">
                                <span>🔥 {streak}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <div className="text-xs md:text-sm font-mono text-neutral-300">
                            ⏱️ {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 h-1">
                <div
                    className="bg-emerald-500 h-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Main Reading & Practice Area */}
            <div className="flex-1 flex flex-col md:overflow-hidden overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 w-full max-w-full">
                {/* Active Target Character Hint Overlay */}
                {activeTargetInfo && (
                    <div className="flex-none mb-2 bg-white border border-neutral-200/90 rounded-xl px-3 py-2 shadow-xs flex flex-wrap items-center justify-between gap-2 max-w-full">
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-neutral-400">
                                當前目標字:
                            </span>
                            <span className="text-xl md:text-2xl font-serif font-bold text-neutral-900">
                                {activeChar.char}
                            </span>
                            <span className="text-xs md:text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                注音: {activeTargetInfo.zhuyin}
                            </span>
                            {showPinyin && (
                                <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                                    {activeTargetInfo.pinyin}
                                </span>
                            )}
                        </div>

                        {/* Input buffer display & Next key prompt */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-neutral-500">已輸入:</span>
                                <span className={`px-2 py-0.5 rounded font-mono text-xs md:text-sm font-bold min-w-[2.5rem] text-center ${hasError
                                    ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                                    : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                                    }`}>
                                    {inputBuffer || '＿'}
                                </span>
                            </div>

                            {enableKeyGuide && activeTargetInfo.nextKey && (
                                <div className="flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                                    <span>按:</span>
                                    <kbd className="px-1 py-0.2 bg-white border border-amber-300 rounded font-mono font-bold text-amber-900">
                                        {activeTargetInfo.nextKey.toUpperCase()}
                                    </kbd>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reading & Characters Flow Box */}
                <div
                    ref={readingBoxRef}
                    onClick={() => {
                        hiddenInputRef.current?.focus({ preventScroll: true });
                    }}
                    className="flex-1 min-h-[140px] bg-white rounded-xl md:rounded-2xl border border-neutral-200 shadow-xs p-3 md:p-6 overflow-y-auto overflow-x-hidden relative cursor-text max-w-full"
                >
                    <div className="flex flex-wrap gap-x-0.5 sm:gap-x-1 gap-y-2 md:gap-y-3 items-center leading-loose">
                        {charStream.map((item, idx) => {
                            const isCompleted = idx < currentIndex;
                            const isCurrent = idx === currentIndex;

                            if (item.char === '\n') {
                                return <div key={idx} className="basis-full h-2" />;
                            }

                            return (
                                <div
                                    key={idx}
                                    ref={isCurrent ? activeCharRef : null}
                                    className={`relative flex flex-col items-center justify-center px-1 py-0.5 md:px-1.5 md:py-1 rounded-md transition-all ${isCurrent
                                        ? 'bg-blue-50 ring-2 ring-blue-500 shadow-sm scale-105 z-10'
                                        : isCompleted
                                            ? 'bg-emerald-50/60 text-emerald-900'
                                            : 'text-neutral-800 hover:bg-neutral-50'
                                        }`}
                                >
                                    {/* Pinyin (Top) */}
                                    <div
                                        className={`flex items-end justify-center font-mono leading-none ${showPinyin && !item.isPunctuation
                                            ? isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-600 font-bold' : 'text-neutral-400'
                                            : 'invisible'
                                        }`}
                                        style={{ height: `${pinyinSize + 3}px`, fontSize: `${pinyinSize}px` }}
                                    >
                                        {item.pinyin || ''}
                                    </div>

                                    {/* Character + Zhuyin annotation */}
                                    <div className="flex items-center gap-0.5">
                                        <span
                                            className={`font-serif leading-none whitespace-pre ${isCompleted
                                                ? 'text-emerald-700 font-bold'
                                                : isCurrent
                                                    ? 'text-neutral-900 font-bold'
                                                    : 'text-neutral-700'
                                            }`}
                                            style={{ fontSize: `${fontSize}px` }}
                                        >
                                            {item.char}
                                        </span>

                                        {/* Zhuyin (Vertical Right) */}
                                        {showZhuyin && !item.isPunctuation && item.zhuyin && (
                                            <div
                                                className={`flex flex-col items-center justify-center font-mono leading-tight ml-0.5 ${isCompleted
                                                    ? 'text-emerald-600 font-medium'
                                                    : isCurrent
                                                        ? 'text-blue-700 font-bold'
                                                        : 'text-neutral-400'
                                                }`}
                                                style={{
                                                    fontSize: `${zhuyinSize}px`,
                                                    width: `${Math.round(zhuyinSize * 1.2)}px`
                                                }}
                                            >
                                                {item.zhuyin.split('').map((z, zi) => (
                                                    <span key={zi} className="block transform scale-105 origin-center leading-none">{z}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Active cursor bottom dot */}
                                    {isCurrent && (
                                        <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile direct input guide banner (hidden in full screen) */}
                {!isFullScreen && isMobile && (
                    <div
                        onClick={() => hiddenInputRef.current?.focus({ preventScroll: true })}
                        className="flex-none mt-2 p-3 bg-white rounded-xl border border-purple-100 shadow-xs flex items-center justify-between cursor-pointer active:bg-purple-50/70 transition"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">📱</span>
                            <div className="text-left">
                                <div className="text-xs font-bold text-neutral-800">
                                    手機注音鍵盤直接輸入模式
                                </div>
                                <div className="text-[11px] text-neutral-500">
                                    點擊此處或上方文章開啟鍵盤，直接輸入漢字或注音
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 pointer-events-none shrink-0">
                            開啟鍵盤
                        </span>
                    </div>
                )}

                {/* Virtual Keyboard (Only shown on Desktop, Collapsible) */}
                {!isMobile && showKeyboard && (
                    <div className="flex-none mt-2 bg-neutral-900 text-neutral-200 p-2 sm:p-3 rounded-xl md:rounded-2xl shadow-lg border border-neutral-800 touch-manipulation select-none">
                        {/* Keyboard Header & Layout Switcher */}
                        <div className="flex items-center justify-between text-[10px] md:text-[11px] text-neutral-400 mb-1.5 px-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-neutral-300">
                                    台灣標準注音鍵盤 {isMobile ? '(手機版)' : ''}
                                </span>
                                {isMobile && (
                                    <button
                                        onClick={() => setKeyboardLayoutMode(m => (m === 'desktop' ? 'mobile' : 'desktop'))}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 cursor-pointer"
                                    >
                                        切換: {keyboardLayoutMode === 'desktop' ? '💻 電腦' : '📱 簡潔'}
                                    </button>
                                )}
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span> 聲母
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> 介音
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 韻母
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-rose-400"></span> 聲調
                                </span>
                            </div>
                        </div>

                        {/* Keyboard Rows */}
                        <div className="flex flex-col gap-1 items-center w-full">
                            {activeKeyboardLayout.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex gap-1 justify-center w-full">
                                    {row.map((k, kIdx) => {
                                        const isNextRecommended = enableKeyGuide && nextKeyToPress && (
                                            (k.key.toLowerCase() === nextKeyToPress) ||
                                            (k.zhuyin === nextKeyToPress) ||
                                            (k.key === ' ' && nextKeyToPress === 'space')
                                        );

                                        const isPhysicallyPressed = activeKeyPressed && (
                                            activeKeyPressed.toLowerCase() === k.key.toLowerCase() ||
                                            (activeKeyPressed === ' ' && k.key === ' ')
                                        );

                                        // Key type colors
                                        let bgClass = 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 active:bg-neutral-600';
                                        let borderClass = 'border-neutral-700';

                                        if (k.type === 'initial') {
                                            bgClass = 'bg-neutral-800 text-indigo-200 hover:bg-indigo-950/70 active:bg-indigo-900';
                                        } else if (k.type === 'medial') {
                                            bgClass = 'bg-neutral-800 text-amber-200 hover:bg-amber-950/70 active:bg-amber-900';
                                        } else if (k.type === 'final') {
                                            bgClass = 'bg-neutral-800 text-emerald-200 hover:bg-emerald-950/70 active:bg-emerald-900';
                                        } else if (k.type === 'tone') {
                                            bgClass = 'bg-neutral-800 text-rose-200 hover:bg-rose-950/70 active:bg-rose-900';
                                        }

                                        if (isNextRecommended) {
                                            bgClass = 'bg-amber-500 text-black font-extrabold ring-2 ring-amber-300 shadow-md animate-pulse';
                                            borderClass = 'border-amber-400';
                                        } else if (isPhysicallyPressed) {
                                            bgClass = 'bg-blue-500 text-white font-bold scale-95';
                                        }

                                        return (
                                            <button
                                                key={kIdx}
                                                type="button"
                                                onPointerDown={(e) => handleVirtualKeyPress(e, k.key)}
                                                className={`h-11 sm:h-10 ${k.width || 'flex-1 min-w-[1.7rem] sm:min-w-[2.2rem]'} px-0.5 sm:px-1 rounded-md sm:rounded-lg border ${borderClass} ${bgClass} transition-all duration-75 flex flex-col items-center justify-center cursor-pointer shadow-xs active:scale-95 touch-manipulation`}
                                            >
                                                <div className="flex flex-col items-center justify-center w-full leading-none">
                                                    <span className={`text-sm sm:text-base font-bold ${isNextRecommended ? 'text-black' : ''}`}>
                                                        {k.label}
                                                    </span>
                                                    {k.sub && k.sub !== k.label && (
                                                        <span className={`text-[8px] sm:text-[9px] mt-0.5 opacity-60 ${isNextRecommended ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                                                            {k.sub}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Finished Celebration Modal */}
            {isFinished && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            🎉
                        </div>
                        <h3 className="text-2xl font-black text-neutral-900 mb-1">
                            恭喜完成！(Congratulations!)
                        </h3>
                        <p className="text-sm text-neutral-500 mb-6">
                            You completed typing: <span className="font-semibold text-neutral-800">{activeParagraph.titleZh}</span>
                        </p>

                        {/* Stats Card Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                                <div className="text-2xl font-extrabold text-neutral-900 font-mono">{cpm}</div>
                                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">CPM (字/分)</div>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                                <div className="text-2xl font-extrabold text-blue-600 font-mono">{wpm}</div>
                                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">WPM (詞/分)</div>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                                <div className="text-2xl font-extrabold text-emerald-600 font-mono">{accuracy}%</div>
                                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">準確率 (Accuracy)</div>
                            </div>
                        </div>

                        <div className="text-xs text-neutral-500 mb-6 flex justify-around border-t border-b border-neutral-100 py-3">
                            <div>耗時: <span className="font-bold text-neutral-700">{Math.floor(elapsedSeconds / 60)}分 {elapsedSeconds % 60}秒</span></div>
                            <div>最高連續: <span className="font-bold text-orange-600">{maxStreak} 字</span></div>
                            <div>總按鍵數: <span className="font-bold text-neutral-700">{totalKeystrokes} 次</span></div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => startPractice(activeParagraph)}
                                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition cursor-pointer"
                            >
                                再試一次 (Retry)
                            </button>
                            <button
                                onClick={() => setActiveParagraph(null)}
                                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition cursor-pointer shadow-md"
                            >
                                選其他文章 (More)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ZhuyinTyping;
