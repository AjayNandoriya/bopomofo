
import { pinyin } from 'pinyin-pro';

const text = "A\nB";
const res = pinyin(text, { type: 'array', toneType: 'num', nonZh: 'boxed' });
console.log(JSON.stringify(res));

const text2 = "你好\n世界";
const res2 = pinyin(text2, { type: 'array', toneType: 'num', nonZh: 'boxed' });
console.log(JSON.stringify(res2));
