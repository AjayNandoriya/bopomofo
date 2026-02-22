import { describe, it, expect } from 'vitest';
import { toTraditional, annotateZhuyin } from './converter';

describe('Converter Utils', () => {
    describe('toTraditional', () => {
        it('should convert simplified to traditional Chinese', async () => {
            const input = '汉字';
            const expected = '漢字';
            const result = await toTraditional(input);
            expect(result).toBe(expected);
        });

        it('should handle non-Chinese text', async () => {
            const input = 'Hello';
            const result = await toTraditional(input);
            expect(result).toBe('Hello');
        });
    });

    describe('annotateZhuyin', () => {
        it('should annotate Chinese characters with Zhuyin and Pinyin', () => {
            const input = '漢字';
            // Expected: 漢 -> hàn, ㄏㄢˋ; 字 -> zì, ㄗˋ
            const result = annotateZhuyin(input);

            expect(result).toHaveLength(2);

            expect(result[0].char).toBe('漢');
            expect(result[0].pinyin).toBe('hàn');
            expect(result[0].zhuyin).toBe('ㄏㄢˋ');

            expect(result[1].char).toBe('字');
            expect(result[1].pinyin).toBe('zì');
            expect(result[1].zhuyin).toBe('ㄗˋ');
        });

        it('should handle mixed content', () => {
            const input = 'Hi你';
            const result = annotateZhuyin(input);

            expect(result).toHaveLength(3);

            expect(result[0].char).toBe('H');
            expect(result[0].zhuyin).toBe('');

            expect(result[1].char).toBe('i');
            expect(result[1].zhuyin).toBe('');

            expect(result[2].char).toBe('你');
            expect(result[2].zhuyin).toBeTruthy(); // Should have zhuyin
        });

        // Testing specific tone placement or output format if needed
        it('should handle neutral tone', () => {
            // e.g. 的 de -> ˙ㄉㄜ
            const input = '的';
            const result = annotateZhuyin(input);

            expect(result[0].pinyin).toContain('de');
            expect(result[0].zhuyin).toBeTruthy();
        });
    });
});
