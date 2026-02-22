
import { pinyin } from 'pinyin-pro';

const text3 = "A\r\nB";
const res3 = pinyin(text3, { type: 'array', toneType: 'num', nonZh: 'boxed' });
console.log(JSON.stringify(res3));
