import { useState, useEffect } from 'react'
import { toTraditional, annotateZhuyin } from '../utils/converter'

function Translation() {
    const [inputText, setInputText] = useState('')
    const [convertedData, setConvertedData] = useState([])
    const [mode, setMode] = useState('zhuyin') // 'zhuyin' | 'pinyin'
    const [splitPos, setSplitPos] = useState(50) // Percentage
    const [isDragging, setIsDragging] = useState(false)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleMouseDown = (e) => {
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
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header - Compact */}
            <div className="flex-none p-4 flex items-center justify-between bg-white border-b border-neutral-200 z-10">
                <h1 className="text-xl font-bold text-neutral-800 tracking-tight flex items-center gap-2">
                    Zhuyin Converter
                </h1>

                <button
                    onClick={() => setMode(mode === 'zhuyin' ? 'pinyin' : 'zhuyin')}
                    className="px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-300"
                >
                    Switch to {mode === 'zhuyin' ? 'Pinyin' : 'Zhuyin'} View
                </button>
            </div>

            {/* Split Container */}
            <div className="flex-1 flex flex-col md:flex-row w-full relative overflow-hidden">
                {/* Input Section (Left) */}
                <div
                    style={{ width: isDesktop ? `${splitPos}%` : '100%' }}
                    className="flex flex-col min-w-[200px] h-1/2 md:h-full transition-[width] duration-75 ease-out"
                >
                    <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Source (Simplified)
                        </label>
                    </div>
                    <textarea
                        className="flex-1 w-full text-lg p-6 bg-white border-none resize-none outline-none focus:bg-blue-50/10 transition-colors"
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
                <div className="md:hidden h-2 w-full bg-neutral-200 border-t border-b border-neutral-300"></div>

                {/* Output Section (Right) */}
                <div
                    style={{ width: isDesktop ? `${100 - splitPos}%` : '100%' }}
                    className="flex flex-col min-w-[200px] bg-white h-1/2 md:h-full"
                >
                    <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Result (Traditional + {mode === 'zhuyin' ? 'Zhuyin' : 'Pinyin'})
                        </label>
                    </div>

                    <div className="flex-1 overflow-auto p-8 relative">
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
                                        <div key={lineIndex} className={`flex flex-wrap gap-4 items-start content-start ${line.length === 0 ? 'h-8' : ''}`}>
                                            {line.map((item, index) => (
                                                <div key={index} className="flex flex-col items-center gap-0">
                                                    {/* Pinyin (Top) */}
                                                    <div className={`h-[1.25rem] mb-1 flex items-end justify-center ${mode === 'pinyin' ? '' : 'invisible'}`}>
                                                        <span className="text-sm font-medium text-neutral-500 leading-none whitespace-nowrap">
                                                            {item.pinyin || ''}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-1">
                                                        <span className="text-3xl font-serif text-neutral-800 leading-none whitespace-pre">
                                                            {item.char}
                                                        </span>

                                                        {/* Zhuyin (Right) */}
                                                        <div className={`w-[1em] flex flex-col text-[10px] items-center justify-center -mt-1 font-mono text-neutral-500 ${mode === 'zhuyin' ? '' : 'invisible'}`}>
                                                            {item.zhuyin ? item.zhuyin.split('').map((z, i) => (
                                                                <span key={i} className="block transform scale-125 origin-center">{z}</span>
                                                            )) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
