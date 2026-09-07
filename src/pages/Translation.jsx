import { useState, useEffect } from 'react'
import { toTraditional, annotateZhuyin } from '../utils/converter'
import { useFontSize, FontSizeControl } from '../context/FontSizeContext'

function Translation() {
    const [inputText, setInputText] = useState('')
    const [convertedData, setConvertedData] = useState([])
    const [mode, setMode] = useState('zhuyin') // 'zhuyin' | 'pinyin'
    const [splitPos, setSplitPos] = useState(50) // Percentage
    const [isDragging, setIsDragging] = useState(false)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
    const { fontSize, pinyinSize, zhuyinSize } = useFontSize()

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleMouseDown = () => {
        if (!isDesktop) return
        setIsDragging(true)
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
    }

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false)
            document.body.style.cursor = 'default'
            document.body.style.userSelect = 'auto'
        }

        const handleMouseMove = (e) => {
            if (isDragging) {
                const newPos = (e.clientX / window.innerWidth) * 100
                if (newPos > 20 && newPos < 80) { // Limit between 20% and 80%
                    setSplitPos(newPos)
                }
            }
        }

        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isDragging])

    useEffect(() => {
        const convert = async () => {
            if (!inputText) {
                setConvertedData([]);
                return;
            }
            const traditional = await toTraditional(inputText);
            const annotated = annotateZhuyin(traditional);
            setConvertedData(annotated);
        };
        convert();
    }, [inputText]);

    return (
        <div className="h-full flex flex-col overflow-x-hidden md:overflow-hidden w-full max-w-full">
            {/* Header - Compact */}
            <div className="flex-none p-3 md:p-4 flex items-center justify-between bg-white border-b border-neutral-200 z-10 gap-2 flex-wrap max-w-full overflow-x-hidden">
                <h1 className="text-lg md:text-xl font-bold text-neutral-800 tracking-tight flex items-center gap-2">
                    Zhuyin Converter
                </h1>

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

            {/* Split Container */}
            <div className="flex-1 flex flex-col md:flex-row w-full max-w-full relative overflow-y-auto md:overflow-hidden overflow-x-hidden">
                {/* Input Section (Left) */}
                <div
                    style={{ width: isDesktop ? `${splitPos}%` : '100%' }}
                    className="flex flex-col min-w-0 md:min-w-[200px] min-h-[160px] md:h-full transition-[width] duration-75 ease-out max-w-full"
                >
                    <div className="p-3 md:p-4 bg-neutral-50 border-b border-neutral-200">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Source (Simplified)
                        </label>
                    </div>
                    <textarea
                        className="flex-1 w-full min-h-[120px] text-base md:text-lg p-4 md:p-6 bg-white border-none resize-none outline-none focus:bg-blue-50/10 transition-colors"
                        placeholder="Type or paste Simplified Chinese text here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                {/* Resizer Handle */}
                <div
                    className="hidden md:flex w-2 bg-neutral-100 border-l border-r border-neutral-200 cursor-col-resize hover:bg-blue-100 transition-colors flex-col items-center justify-center gap-1 z-20 group active:bg-blue-500 active:border-blue-500"
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-1 rounded-full bg-neutral-300 group-hover:bg-blue-400 group-active:bg-white"></div>
                    <div className="w-1 h-1 rounded-full bg-neutral-300 group-hover:bg-blue-400 group-active:bg-white"></div>
                    <div className="w-1 h-1 rounded-full bg-neutral-300 group-hover:bg-blue-400 group-active:bg-white"></div>
                </div>

                {/* Mobile Spacer/Divider */}
                <div className="md:hidden h-2 w-full bg-neutral-200 border-t border-b border-neutral-300 flex-none"></div>

                {/* Output Section (Right) */}
                <div
                    style={{ width: isDesktop ? `${100 - splitPos}%` : '100%' }}
                    className="flex flex-col min-w-0 md:min-w-[200px] bg-white flex-1 md:h-full min-h-[200px] max-w-full"
                >
                    <div className="p-3 md:p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Result (Traditional + {mode === 'zhuyin' ? 'Zhuyin' : 'Pinyin'})
                        </label>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative max-w-full">
                        {convertedData.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-neutral-300 pointer-events-none select-none">
                                <span className="text-lg">Output will appear here</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {(() => {
                                    const lines = [];
                                    let currentLine = [];

                                    convertedData.forEach((item) => {
                                        if (item.char === '\n') {
                                            lines.push(currentLine);
                                            currentLine = [];
                                        } else if (item.char === '\r') {
                                            // Ignore CR
                                        } else {
                                            currentLine.push(item);
                                        }
                                    });
                                    lines.push(currentLine);

                                    return lines.map((line, lineIndex) => (
                                        <div
                                            key={lineIndex}
                                            className={`flex flex-wrap items-start content-start gap-x-0.5 sm:gap-x-1 gap-y-3 ${line.length === 0 ? 'h-8' : ''}`}
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
                                    ));
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Translation

