import { pinyin } from 'pinyin-pro';
import * as OpenCC from 'opencc-js';
import bopomofo from 'bopomofo';

// Test OpenCC
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const simplified = '汉字';
const traditional = converter(simplified);
console.log(`Simplified: ${simplified} -> Traditional: ${traditional}`);

// Test pinyin-pro for Zhuyin
// pinyin-pro might not output zhuyin directly, let's check.
// If not, we might need a mapping or use 'bopomofo' lib.

// Let's try to see what 'bopomofo' lib does.
// Note: 'bopomofo' package on npm might be different things.
// The user has "bopomofo": "^4.1.0" in package.json.

console.log('Testing pinyin-pro...');
try {
    const py = pinyin(traditional);
    console.log(`Pinyin: ${py}`);
} catch (e) {
    console.error('pinyin-pro error:', e);
}

// Check if pinyin-pro supports 'zhuyin' format?
// According to docs (if I recall correctly), proper zhuyin support might need a specific option or another lib.

// Let's check 'bopomofo' library if it can just convert Pinyin to Zhuyin or Hanzi to Zhuyin.
console.log('Testing bopomofo lib...');
try {
    // Assuming bopomofo might have a function to convert
    console.log('bopomofo:', bopomofo);
} catch (e) {
    console.error('bopomofo error:', e);
}
