import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { annotateZhuyin } from '../src/utils/converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSV(text) {
    const lines = text.split('\n');
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            currentRow.push(currentField);
            currentField = '';
            if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

// Map TOCFL POS tags to user-friendly categories
function mapPOS(posTag, word) {
    if (!posTag) {
        if (word.length >= 4) return { type: 'phrase', typeZh: '成語/片語' };
        return { type: 'other', typeZh: '其他' };
    }

    const tag = posTag.trim();

    // Check phrases/idioms
    if (word.length >= 4 || tag.includes('Id') || tag.includes('Ph')) {
        return { type: 'phrase', typeZh: '片語' };
    }

    // Adverbs
    if (tag.startsWith('Adv') || tag.includes('/Adv')) {
        return { type: 'adverb', typeZh: '副詞' };
    }

    // Adjectives / Stative Verbs (Vs)
    if (tag === 'Vs' || tag.startsWith('Vs-') || tag === 'A' || tag.includes('/Vs')) {
        return { type: 'adjective', typeZh: '形容詞' };
    }

    // Verbs
    if (tag.startsWith('V') || tag.includes('/V')) {
        return { type: 'verb', typeZh: '動詞' };
    }

    // Nouns
    if (tag.startsWith('N') || tag.includes('/N')) {
        return { type: 'noun', typeZh: '名詞' };
    }

    return { type: 'other', typeZh: '其他' };
}

// Clean English definition
function cleanMeaning(meaningRaw, word) {
    if (!meaningRaw) return word;

    let text = meaningRaw;
    // Replace <br> with ;
    text = text.replace(/<br\s*\/?>/gi, '; ');

    // If text contains variant descriptions like "word [pinyin] definition", extract definitions
    const parts = text.split(';');
    const cleanedParts = [];

    for (let part of parts) {
        part = part.trim();
        if (!part) continue;

        // Remove prefix like "你 [ni3] "
        part = part.replace(/^.+?\[.+?\]\s*/, '');
        // Remove CL:... (classifier annotations)
        part = part.replace(/\/CL:.*$/, '');
        part = part.replace(/CL:.*$/, '');
        // Remove "(Note: ...)"
        part = part.replace(/\(Note:.*?\)/gi, '');
        // Replace slashes with comma
        part = part.replace(/\//g, ', ');

        part = part.trim();
        if (part && !cleanedParts.includes(part)) {
            cleanedParts.push(part);
        }
    }

    let result = cleanedParts.slice(0, 3).join('; ').trim();
    if (!result) result = meaningRaw.replace(/<[^>]+>/g, '').trim();
    return result;
}

// Map TOCFL ID to Band A, B, C
function getBand(id) {
    if (id.startsWith('L0') || id.startsWith('L1') || id.startsWith('L2')) {
        return 'A';
    }
    if (id.startsWith('L3') || id.startsWith('L4')) {
        return 'B';
    }
    if (id.startsWith('L5')) {
        return 'C';
    }
    return 'A';
}

async function main() {
    console.log('Fetching official TOCFL dataset...');
    const url = 'https://raw.githubusercontent.com/ivankra/tocfl/master/tocfl-cedict.csv';
    const response = await fetch(url);
    const csvText = await response.text();

    console.log('Parsing CSV...');
    const allRows = parseCSV(csvText);
    const header = allRows[0];
    const dataRows = allRows.slice(1);

    console.log(`Found ${dataRows.length} words in official list.`);

    const outputWords = [];
    const seenWords = new Set();

    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const id = (row[0] || '').trim();
        let traditional = (row[1] || '').trim();
        const pinyinRaw = (row[3] || '').trim();
        const posRaw = (row[4] || '').trim();
        const meaningRaw = (row[6] || '').trim();

        if (!id || !traditional) continue;

        // If word has variants separated by slash e.g. "你/妳", take the primary first one
        let primaryWord = traditional.split('/')[0].trim();
        // Remove parenthesis if any
        primaryWord = primaryWord.replace(/[（()）]/g, '');

        if (!primaryWord || seenWords.has(primaryWord)) continue;
        seenWords.add(primaryWord);

        const level = getBand(id);
        const { type, typeZh } = mapPOS(posRaw, primaryWord);
        const meaning = cleanMeaning(meaningRaw, primaryWord);

        // Character breakdown with Zhuyin
        const charAnnotated = annotateZhuyin(primaryWord);
        const chars = [];
        const zhuyinParts = [];
        const pinyinParts = [];

        for (const c of charAnnotated) {
            chars.push({
                char: c.char,
                zhuyin: c.zhuyin || '',
                pinyin: c.pinyin || ''
            });
            if (c.zhuyin) zhuyinParts.push(c.zhuyin);
            if (c.pinyin) pinyinParts.push(c.pinyin);
        }

        outputWords.push({
            id: id.toLowerCase(),
            level,
            subLevel: id.split('-')[0],
            word: primaryWord,
            zhuyin: zhuyinParts.join(' '),
            pinyin: pinyinParts.join(' '),
            type,
            typeZh,
            meaning: meaning || primaryWord,
            chars
        });
    }

    console.log(`Successfully parsed ${outputWords.length} unique words.`);

    // Write to src/data/tocflWordsAll.js
    const outJsPath = path.resolve(__dirname, '../src/data/tocflWordsAll.js');
    fs.writeFileSync(outJsPath, `export default ${JSON.stringify(outputWords)};\n`, 'utf8');
    console.log(`Saved JS module dataset to ${outJsPath} (${(fs.statSync(outJsPath).size / 1024).toFixed(1)} KB)`);

    // Write to src/data/tocflWordsAll.json
    const outPath = path.resolve(__dirname, '../src/data/tocflWordsAll.json');
    fs.writeFileSync(outPath, JSON.stringify(outputWords), 'utf8');
    console.log(`Saved JSON dataset to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

    // Level breakdown
    const levels = { A: 0, B: 0, C: 0 };
    const types = {};
    for (const w of outputWords) {
        levels[w.level] = (levels[w.level] || 0) + 1;
        types[w.type] = (types[w.type] || 0) + 1;
    }
    console.log('Breakdown by Level:', levels);
    console.log('Breakdown by Type:', types);
}

main().catch(console.error);
