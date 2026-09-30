import React from 'react';
import { getTone, getToneColor } from '../utils/toneColors';

/**
 * Renders Chinese text where each Chinese character is colored according to its tone:
 * 1st tone -> Blue (#2563eb)
 * 2nd tone -> Green (#16a34a)
 * 3rd tone -> Orange (#ea580c)
 * 4th tone -> Red (#dc2626)
 * Neutral tone -> Gray (#6b7280)
 * Punctuation/non-Chinese -> inherit
 *
 * Includes an accessible sr-only text node for screen readers and RTL testing.
 */
export default function ToneText({ text = '', className = '', style = {} }) {
    if (!text) return null;

    const chars = Array.from(text);

    return (
        <span className={className} style={style}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {chars.map((c, i) => {
                    const isChinese = /[\u4e00-\u9fa5]/.test(c);
                    if (!isChinese) {
                        return <React.Fragment key={i}>{c}</React.Fragment>;
                    }

                    const tone = getTone(c);
                    const color = getToneColor(tone);

                    return (
                        <span
                            key={i}
                            style={{ color }}
                            data-tone={tone}
                        >
                            {c}
                        </span>
                    );
                })}
            </span>
        </span>
    );
}
