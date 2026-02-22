try {
    const bopomofo = require('bopomofo');
    console.log('Loaded bopomofo:', bopomofo);
    if (typeof bopomofo === 'function') {
        console.log('Result:', bopomofo('汉字'));
    }
    if (bopomofo.zhuyin) {
        console.log('Zhuyin:', bopomofo.zhuyin('汉字'));
    }
} catch (e) {
    console.error('Error:', e);
}
