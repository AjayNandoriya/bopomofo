import { describe, it, expect } from 'vitest';
import { getTone, getToneColor, getToneClass, TONE_COLORS } from './toneColors';

describe('Tone Colors Utility', () => {
    describe('Tone color mappings', () => {
        it('maps 1st tone to blue', () => {
            expect(getToneColor(1)).toBe('#2563eb');
            expect(getToneClass(1)).toBe('text-blue-600');
        });

        it('maps 2nd tone to green', () => {
            expect(getToneColor(2)).toBe('#16a34a');
            expect(getToneClass(2)).toBe('text-green-600');
        });

        it('maps 3rd tone to orange', () => {
            expect(getToneColor(3)).toBe('#ea580c');
            expect(getToneClass(3)).toBe('text-orange-600');
        });

        it('maps 4th tone to red', () => {
            expect(getToneColor(4)).toBe('#dc2626');
            expect(getToneClass(4)).toBe('text-red-600');
        });

        it('maps 5th (neutral) tone to gray/neutral', () => {
            expect(getToneColor(5)).toBe('#6b7280');
            expect(getToneClass(5)).toBe('text-gray-500');
        });
    });

    describe('getTone detection', () => {
        it('detects tones from Zhuyin symbols accurately', () => {
            // 1st tone (no mark)
            expect(getTone('媽', 'ㄇㄚ')).toBe(1);
            expect(getTone('他', 'ㄊㄚ')).toBe(1);
            expect(getTone('一', 'ㄧ')).toBe(1);

            // 2nd tone (ˊ)
            expect(getTone('麻', 'ㄇㄚˊ')).toBe(2);
            expect(getTone('人', 'ㄖㄣˊ')).toBe(2);
            expect(getTone('國', 'ㄍㄨㄛˊ')).toBe(2);

            // 3rd tone (ˇ)
            expect(getTone('馬', 'ㄇㄚˇ')).toBe(3);
            expect(getTone('我', 'ㄨㄛˇ')).toBe(3);
            expect(getTone('好', 'ㄏㄠˇ')).toBe(3);

            // 4th tone (ˋ)
            expect(getTone('罵', 'ㄇㄚˋ')).toBe(4);
            expect(getTone('看', 'ㄎㄢˋ')).toBe(4);
            expect(getTone('是', 'ㄕˋ')).toBe(4);

            // Neutral tone (˙)
            expect(getTone('爸', '˙ㄅㄚ')).toBe(5);
            expect(getTone('的', '˙ㄉㄜ')).toBe(5);
        });

        it('detects tones from Pinyin string with number or diacritic', () => {
            expect(getTone(null, null, 'ma1')).toBe(1);
            expect(getTone(null, null, 'mā')).toBe(1);

            expect(getTone(null, null, 'ma2')).toBe(2);
            expect(getTone(null, null, 'má')).toBe(2);

            expect(getTone(null, null, 'ma3')).toBe(3);
            expect(getTone(null, null, 'mǎ')).toBe(3);

            expect(getTone(null, null, 'ma4')).toBe(4);
            expect(getTone(null, null, 'mà')).toBe(4);

            expect(getTone(null, null, 'ma5')).toBe(5);
            expect(getTone(null, null, 'ma0')).toBe(5);
            expect(getTone(null, null, 'ba')).toBe(5);
        });

        it('detects tone from standalone Chinese character', () => {
            expect(getTone('天')).toBe(1);
            expect(getTone('白')).toBe(2);
            expect(getTone('好')).toBe(3);
            expect(getTone('大')).toBe(4);
        });

        it('returns 0 for punctuation and non-Chinese', () => {
            expect(getTone('，')).toBe(0);
            expect(getTone('。')).toBe(0);
            expect(getTone('A')).toBe(0);
            expect(getTone(' ')).toBe(0);
        });
    });
});
