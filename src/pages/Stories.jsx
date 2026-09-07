import { useState, useMemo } from 'react';
import stories from '../data/stories';
import { toTraditional, annotateZhuyin } from '../utils/converter';
import { useFontSize, FontSizeControl } from '../context/FontSizeContext';

function Stories() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [convertedStory, setConvertedStory] = useState([]);
    const [mode, setMode] = useState('zhuyin'); // 'zhuyin' | 'pinyin'
    const { fontSize, pinyinSize, zhuyinSize } = useFontSize();

    const handleStoryClick = async (story) => {
        setSelectedStory(story);
        if (story.contentZh) {
            const traditional = await toTraditional(story.contentZh);
            const annotated = annotateZhuyin(traditional);
            setConvertedStory(annotated);
        }
    };

    // Group characters into paragraphs based on newlines
    const paragraphs = useMemo(() => {
        const result = [];
        let currentPara = [];

        convertedStory.forEach(item => {
            if (item.char === '\n') {
                if (currentPara.length > 0) {
                    result.push(currentPara);
                    currentPara = [];
                }
            } else if (item.char !== '\r') {
                currentPara.push(item);
            }
        });
        if (currentPara.length > 0) {
            result.push(currentPara);
        }
        return result;
    }, [convertedStory]);

    return (
        <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden w-full max-w-full">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-neutral-800">Stories</h1>

            {!selectedStory ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {stories.map(story => (
                        <div
                            key={story.id}
                            onClick={() => handleStoryClick(story)}
                            className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-neutral-200"
                        >
                            <h2 className="text-xl font-bold mb-2 text-neutral-800">{story.titleZh}</h2>
                            <p className="text-neutral-500 text-sm">{story.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-full w-full max-w-full">
                    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap w-full">
                        <button
                            onClick={() => setSelectedStory(null)}
                            className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-2 hover:bg-neutral-100 rounded-lg transition"
                        >
                            ← Back to Stories
                        </button>

                        <div className="flex items-center gap-2 flex-wrap">
                            <FontSizeControl compact />
                            <button
                                onClick={() => setMode(mode === 'zhuyin' ? 'pinyin' : 'zhuyin')}
                                className="px-3 md:px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-md text-xs md:text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-300 whitespace-nowrap"
                            >
                                Switch to {mode === 'zhuyin' ? 'Pinyin' : 'Zhuyin'} View
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-sm border border-neutral-200 flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
                        <h2 className="text-2xl font-bold mb-1 text-center text-neutral-900">{selectedStory.titleZh}</h2>
                        <p className="text-center text-neutral-500 mb-8 text-sm">{selectedStory.title}</p>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            {paragraphs.map((para, pIdx) => (
                                <div
                                    key={pIdx}
                                    className="flex flex-wrap items-start content-start gap-x-0.5 sm:gap-x-1 gap-y-3 leading-relaxed text-left"
                                >
                                    {para.map((item, index) => {
                                        const hasZhuyin = mode === 'zhuyin' && Boolean(item.zhuyin);
                                        const hasPinyin = mode === 'pinyin' && Boolean(item.pinyin);

                                        return (
                                            <div key={index} className="flex flex-col items-center gap-0">
                                                {/* Pinyin (Top) */}
                                                {mode === 'pinyin' && (
                                                    <div
                                                        className="h-[1.25em] mb-0.5 flex items-end justify-center"
                                                        style={{ fontSize: `${pinyinSize}px` }}
                                                    >
                                                        <span className="font-medium text-neutral-500 leading-none whitespace-nowrap">
                                                            {hasPinyin ? item.pinyin : ''}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex flex-row items-center">
                                                    <span
                                                        className="font-serif text-neutral-800 leading-none whitespace-pre"
                                                        style={{ fontSize: `${fontSize}px` }}
                                                    >
                                                        {item.char}
                                                    </span>

                                                    {/* Zhuyin (Right) */}
                                                    {hasZhuyin && (
                                                        <div
                                                            className="flex flex-col items-center justify-center -mt-0.5 ml-0.5 font-mono text-neutral-500 leading-none"
                                                            style={{
                                                                fontSize: `${zhuyinSize}px`,
                                                                width: `${Math.round(zhuyinSize * 1.2)}px`
                                                            }}
                                                        >
                                                            {item.zhuyin.split('').map((z, i) => (
                                                                <span key={i} className="block transform scale-110 origin-center leading-none">
                                                                    {z}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;
