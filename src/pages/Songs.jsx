import { useState, useMemo } from 'react';
import songs from '../data/songs';
import { toTraditional, annotateZhuyin } from '../utils/converter';
import { useFontSize, FontSizeControl } from '../context/FontSizeContext';

function Songs() {
    const [selectedSong, setSelectedSong] = useState(null);
    const [convertedSong, setConvertedSong] = useState([]);
    const [mode, setMode] = useState('zhuyin'); // 'zhuyin' | 'pinyin'
    const { fontSize, pinyinSize, zhuyinSize } = useFontSize();

    const handleSongClick = async (song) => {
        setSelectedSong(song);
        if (song.contentZh) {
            const traditional = await toTraditional(song.contentZh);
            const annotated = annotateZhuyin(traditional);
            setConvertedSong(annotated);
        }
    };

    // Group characters into lyric lines based on newlines
    const lines = useMemo(() => {
        const result = [];
        let currentLine = [];

        convertedSong.forEach(item => {
            if (item.char === '\n') {
                result.push(currentLine);
                currentLine = [];
            } else if (item.char !== '\r') {
                currentLine.push(item);
            }
        });
        if (currentLine.length > 0) {
            result.push(currentLine);
        }
        return result;
    }, [convertedSong]);

    return (
        <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden w-full max-w-full">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-neutral-800">Songs</h1>

            {!selectedSong ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {songs.map(song => (
                        <div
                            key={song.id}
                            onClick={() => handleSongClick(song)}
                            className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-neutral-200"
                        >
                            <h2 className="text-xl font-bold mb-2 text-neutral-800">{song.titleZh}</h2>
                            <p className="text-neutral-500 text-sm">{song.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-full w-full max-w-full">
                    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap w-full">
                        <button
                            onClick={() => setSelectedSong(null)}
                            className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-2 hover:bg-neutral-100 rounded-lg transition"
                        >
                            ← Back to Songs
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
                        <h2 className="text-2xl font-bold mb-1 text-center text-neutral-900">{selectedSong.titleZh}</h2>
                        <p className="text-center text-neutral-500 mb-8 text-sm">{selectedSong.title}</p>

                        <div className="space-y-4 max-w-3xl mx-auto">
                            {lines.map((line, lIdx) => (
                                <div
                                    key={lIdx}
                                    className={`flex flex-wrap items-start content-start gap-x-0.5 sm:gap-x-1 gap-y-2 text-left ${line.length === 0 ? 'h-6' : ''}`}
                                >
                                    {line.map((item, index) => {
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

export default Songs;
