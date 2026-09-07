import { describe, it, expect } from 'vitest';
import {
    KEY_TO_ZHUYIN,
    ZHUYIN_TO_KEY,
    decomposeZhuyin,
    evaluateZhuyinInput
} from './zhuyinKeyboard';

describe('Zhuyin Keyboard Utils', () => {
    describe('Keyboard Mapping', () => {
        it('should map standard keys to correct Zhuyin symbols', () => {
            expect(KEY_TO_ZHUYIN['1']).toBe('ㄅ');
            expect(KEY_TO_ZHUYIN['q']).toBe('ㄆ');
            expect(KEY_TO_ZHUYIN['a']).toBe('ㄇ');
            expect(KEY_TO_ZHUYIN['z']).toBe('ㄈ');
            expect(KEY_TO_ZHUYIN['s']).toBe('ㄋ');
            expect(KEY_TO_ZHUYIN['u']).toBe('ㄧ');
            expect(KEY_TO_ZHUYIN['3']).toBe('ˇ');
            expect(KEY_TO_ZHUYIN['6']).toBe('ˊ');
            expect(KEY_TO_ZHUYIN['4']).toBe('ˋ');
            expect(KEY_TO_ZHUYIN['7']).toBe('˙');
        });

        it('should support reverse lookup from Zhuyin to key', () => {
            expect(ZHUYIN_TO_KEY['ㄋ']).toBe('s');
            expect(ZHUYIN_TO_KEY['ㄧ']).toBe('u');
            expect(ZHUYIN_TO_KEY['ˇ']).toBe('3');
            expect(ZHUYIN_TO_KEY['ˊ']).toBe('6');
            expect(ZHUYIN_TO_KEY['ˋ']).toBe('4');
            expect(ZHUYIN_TO_KEY['˙']).toBe('7');
        });
    });

    describe('decomposeZhuyin', () => {
        it('should decompose multi-symbol Zhuyin with 3rd tone', () => {
            const result = decomposeZhuyin('ㄋㄧˇ');
            expect(result.symbols).toEqual(['ㄋ', 'ㄧ']);
            expect(result.tone).toBe('ˇ');
            expect(result.toneNum).toBe(3);
            expect(result.expectedSequence).toEqual(['ㄋ', 'ㄧ', 'ˇ']);
        });

        it('should decompose 1st tone (no mark)', () => {
            const result = decomposeZhuyin('ㄊㄧㄢ');
            expect(result.symbols).toEqual(['ㄊ', 'ㄧ', 'ㄢ']);
            expect(result.tone).toBe('');
            expect(result.toneNum).toBe(1);
            expect(result.expectedSequence).toEqual(['ㄊ', 'ㄧ', 'ㄢ']);
        });

        it('should decompose neutral tone with prefix dot', () => {
            const result = decomposeZhuyin('˙ㄉㄜ');
            expect(result.symbols).toEqual(['ㄉ', 'ㄜ']);
            expect(result.tone).toBe('˙');
            expect(result.toneNum).toBe(5);
            expect(result.expectedSequence).toEqual(['ㄉ', 'ㄜ', '˙']);
        });
    });

    describe('evaluateZhuyinInput', () => {
        it('should match exact sequence for tone with mark', () => {
            const res1 = evaluateZhuyinInput('ㄋ', 'ㄋㄧˇ');
            expect(res1.isPrefix).toBe(true);
            expect(res1.matched).toBe(false);
            expect(res1.nextExpected).toBe('ㄧ');
            expect(res1.nextKey).toBe('u');

            const res2 = evaluateZhuyinInput('ㄋㄧ', 'ㄋㄧˇ');
            expect(res2.isPrefix).toBe(true);
            expect(res2.matched).toBe(false);
            expect(res2.nextExpected).toBe('ˇ');
            expect(res2.nextKey).toBe('3');

            const res3 = evaluateZhuyinInput('ㄋㄧˇ', 'ㄋㄧˇ');
            expect(res3.matched).toBe(true);
            expect(res3.isPrefix).toBe(true);
        });

        it('should match tone 1 with or without trailing space', () => {
            const matchWithoutSpace = evaluateZhuyinInput('ㄊㄧㄢ', 'ㄊㄧㄢ');
            expect(matchWithoutSpace.matched).toBe(true);

            const matchWithSpace = evaluateZhuyinInput('ㄊㄧㄢ ', 'ㄊㄧㄢ');
            expect(matchWithSpace.matched).toBe(true);
        });

        it('should report non-prefix for wrong inputs', () => {
            const res = evaluateZhuyinInput('ㄅ', 'ㄋㄧˇ');
            expect(res.isPrefix).toBe(false);
            expect(res.matched).toBe(false);
        });
    });
});
