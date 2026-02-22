import { pinyin } from 'pinyin-pro';

const text = '汉字';

console.log('Default:', pinyin(text));
console.log('Zhuyin ToneType?:', pinyin(text, { toneType: 'zhuyin' })); // Guess
console.log('Zhuyin Pattern?:', pinyin(text, { pattern: 'zhuyin' })); // Guess
console.log('Zhuyin Type?:', pinyin(text, { type: 'zhuyin' })); // Guess

// helper to print if options work
import { customPinyin } from 'pinyin-pro';
// console.log(customPinyin);
