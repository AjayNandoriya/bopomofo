import React, { useState } from 'react';
import { TONE_META } from '../utils/toneColors';

/**
 * Tone color legend displaying the tone-to-color mapping:
 * 1st tone -> Blue, 2nd -> Green, 3rd -> Orange, 4th -> Red
 */
export default function ToneLegend({ compact = false, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);

    if (compact) {
        return (
            <div className={`relative inline-flex items-center ${className}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white hover:bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 transition cursor-pointer shadow-2xs"
                    title="聲調顏色對照 (Tone Color Guide)"
                >
                    <span className="text-[11px] font-bold text-neutral-500">聲調:</span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="1聲 藍" />
                        <span className="w-2 h-2 rounded-full bg-green-600 inline-block" title="2聲 綠" />
                        <span className="w-2 h-2 rounded-full bg-orange-600 inline-block" title="3聲 橘" />
                        <span className="w-2 h-2 rounded-full bg-red-600 inline-block" title="4聲 紅" />
                    </span>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-lg border border-neutral-200 p-3 min-w-[200px] text-xs animate-fadeIn">
                            <div className="font-bold text-neutral-800 mb-2 pb-1 border-b border-neutral-100 flex items-center justify-between">
                                <span>聲調顏色 (Tone Colors)</span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-neutral-400 hover:text-neutral-600 p-0.5"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-1.5">
                                {TONE_META.map(item => (
                                    <div key={item.tone} className="flex items-center justify-between gap-3 py-0.5">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="font-medium text-neutral-800">{item.name}</span>
                                            <span className="font-mono text-neutral-400">({item.mark || '無'})</span>
                                        </div>
                                        <span className="font-semibold text-[11px]" style={{ color: item.color }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
            <span className="font-bold text-neutral-500 text-[11px] uppercase tracking-wider">聲調:</span>
            {TONE_META.slice(0, 4).map(item => (
                <div
                    key={item.tone}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
                    style={{
                        backgroundColor: `${item.color}10`,
                        borderColor: `${item.color}35`,
                        color: item.color
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold">{item.name}</span>
                    <span className="opacity-80 font-mono">{item.mark}</span>
                </div>
            ))}
        </div>
    );
}
