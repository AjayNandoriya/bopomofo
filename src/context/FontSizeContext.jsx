import { createContext, useContext, useState, useEffect } from 'react';

export const FONT_SIZE_LEVELS = [
    { key: 'sm', label: '小 S', size: 22, pinyinSize: 11, zhuyinSize: 8.5 },
    { key: 'md', label: '中 M', size: 30, pinyinSize: 13, zhuyinSize: 10 },
    { key: 'lg', label: '大 L', size: 38, pinyinSize: 15, zhuyinSize: 12 },
    { key: 'xl', label: '特大 XL', size: 48, pinyinSize: 18, zhuyinSize: 14.5 },
    { key: '2xl', label: '超大 2XL', size: 58, pinyinSize: 22, zhuyinSize: 17 }
];

const STORAGE_KEY = 'bopomofo_font_size';

const FontSizeContext = createContext(null);

export function FontSizeProvider({ children }) {
    const [levelIndex, setLevelIndex] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const idx = FONT_SIZE_LEVELS.findIndex(l => l.key === saved || l.size === Number(saved));
                if (idx !== -1) return idx;
            }
        } catch (e) {
            // ignore localStorage error
        }
        return 1; // Default to 'md' (index 1)
    });

    const currentLevel = FONT_SIZE_LEVELS[levelIndex] || FONT_SIZE_LEVELS[1];

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, currentLevel.key);
        } catch (e) {
            // ignore
        }
    }, [currentLevel]);

    const increase = () => {
        setLevelIndex(prev => Math.min(FONT_SIZE_LEVELS.length - 1, prev + 1));
    };

    const decrease = () => {
        setLevelIndex(prev => Math.max(0, prev - 1));
    };

    const setLevel = (indexOrKey) => {
        if (typeof indexOrKey === 'number') {
            setLevelIndex(Math.max(0, Math.min(FONT_SIZE_LEVELS.length - 1, indexOrKey)));
        } else {
            const idx = FONT_SIZE_LEVELS.findIndex(l => l.key === indexOrKey);
            if (idx !== -1) setLevelIndex(idx);
        }
    };

    const value = {
        levelIndex,
        currentLevel,
        fontSize: currentLevel.size,
        pinyinSize: currentLevel.pinyinSize,
        zhuyinSize: currentLevel.zhuyinSize,
        levels: FONT_SIZE_LEVELS,
        increase,
        decrease,
        setLevel,
        canIncrease: levelIndex < FONT_SIZE_LEVELS.length - 1,
        canDecrease: levelIndex > 0
    };

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
}

export function useFontSize() {
    const context = useContext(FontSizeContext);
    if (!context) {
        // Fallback default if rendered outside provider
        return {
            levelIndex: 1,
            currentLevel: FONT_SIZE_LEVELS[1],
            fontSize: 30,
            pinyinSize: 13,
            zhuyinSize: 10,
            levels: FONT_SIZE_LEVELS,
            increase: () => {},
            decrease: () => {},
            setLevel: () => {},
            canIncrease: true,
            canDecrease: true
        };
    }
    return context;
}

/**
 * Reusable sleek Font Size Control Component
 */
export function FontSizeControl({ compact = false, className = '' }) {
    const { currentLevel, levels, increase, decrease, setLevel, canIncrease, canDecrease } = useFontSize();

    return (
        <div
            className={`inline-flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-0.5 shadow-2xs ${className}`}
            role="group"
            aria-label="Font size controls"
        >
            <button
                type="button"
                onClick={decrease}
                disabled={!canDecrease}
                className="px-2 py-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-35 disabled:hover:bg-transparent rounded transition cursor-pointer disabled:cursor-not-allowed"
                title="Decrease font size (A-)"
                aria-label="Decrease font size"
            >
                A-
            </button>

            {compact ? (
                <span className="px-1 text-xs font-mono font-medium text-neutral-600 min-w-[2.2rem] text-center select-none">
                    {currentLevel.size}px
                </span>
            ) : (
                <select
                    value={currentLevel.key}
                    onChange={(e) => setLevel(e.target.value)}
                    className="text-xs bg-transparent font-medium text-neutral-700 py-0.5 px-1 border-none outline-none cursor-pointer hover:text-neutral-900"
                    title="Choose font size preset"
                    aria-label="Font size preset"
                >
                    {levels.map((lvl) => (
                        <option key={lvl.key} value={lvl.key}>
                            {lvl.label} ({lvl.size}px)
                        </option>
                    ))}
                </select>
            )}

            <button
                type="button"
                onClick={increase}
                disabled={!canIncrease}
                className="px-2 py-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-35 disabled:hover:bg-transparent rounded transition cursor-pointer disabled:cursor-not-allowed"
                title="Increase font size (A+)"
                aria-label="Increase font size"
            >
                A+
            </button>
        </div>
    );
}
