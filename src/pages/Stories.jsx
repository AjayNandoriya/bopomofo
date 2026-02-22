import { useState } from 'react';
import stories from '../data/stories';
import { toTraditional, annotateZhuyin } from '../utils/converter';

function Stories() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [convertedStory, setConvertedStory] = useState([]);
    const [mode, setMode] = useState('zhuyin'); // 'zhuyin' | 'pinyin'

    const handleStoryClick = async (story) => {
        setSelectedStory(story);
        if (story.contentZh) {
            const traditional = await toTraditional(story.contentZh);
            const annotated = annotateZhuyin(traditional);
            setConvertedStory(annotated);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6 text-neutral-800">Stories</h1>

            {!selectedStory ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stories.map(story => (
                        <div
                            key={story.id}
                            onClick={() => handleStoryClick(story)}
                            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-neutral-200"
                        >
                            <h2 className="text-xl font-bold mb-2 text-neutral-800">{story.titleZh}</h2>
                            <p className="text-neutral-500">{story.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setSelectedStory(null)}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
                        >
                            ← Back to Stories
                        </button>

                        <button
                            onClick={() => setMode(mode === 'zhuyin' ? 'pinyin' : 'zhuyin')}
                            className="px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-300"
                        >
                            Switch to {mode === 'zhuyin' ? 'Pinyin' : 'Zhuyin'} View
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 flex-1 overflow-auto">
                        <h2 className="text-2xl font-bold mb-2 text-center">{selectedStory.titleZh}</h2>
                        <p className="text-center text-neutral-500 mb-8">{selectedStory.title}</p>

                        <div className="flex flex-wrap gap-4 leading-loose justify-center">
                            {convertedStory.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-0">
                                    {/* Pinyin (Top) */}
                                    <div className={`h-[1.25rem] mb-1 flex items-end justify-center ${mode === 'pinyin' ? '' : 'invisible'}`}>
                                        <span className="text-sm font-medium text-neutral-500 leading-none whitespace-nowrap">
                                            {item.pinyin || ''}
                                        </span>
                                    </div>

                                    <div className="flex flex-row items-center gap-1">
                                        <span className="text-3xl font-serif text-neutral-800 leading-none">
                                            {item.char}
                                        </span>

                                        {/* Zhuyin (Right) */}
                                        <div className={`w-[1em] flex flex-col text-[10px] items-center justify-center -mt-1 font-mono text-neutral-500 ${mode === 'zhuyin' ? '' : 'invisible'}`}>
                                            {item.zhuyin ? item.zhuyin.split('').map((z, i) => (
                                                <span key={i} className="block transform scale-125 origin-center">{z}</span>
                                            )) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;
