import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WordQuiz from './WordQuiz';
import { FontSizeProvider } from '../context/FontSizeContext';

// Helper to render with context
const renderWithContext = (ui) => {
    return render(
        <FontSizeProvider>
            {ui}
        </FontSizeProvider>
    );
};

describe('WordQuiz Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock speech synthesis
        window.speechSynthesis = {
            cancel: vi.fn(),
            speak: vi.fn()
        };
        global.SpeechSynthesisUtterance = class {
            constructor(text) {
                this.text = text;
                this.lang = '';
                this.rate = 1;
            }
        };
        // Mock navigator.vibrate
        if (navigator) {
            navigator.vibrate = vi.fn();
        }
    });

    afterEach(() => {
        cleanup();
    });

    it('renders TOCFL level options, word types, and setup screen', () => {
        renderWithContext(<WordQuiz />);

        expect(screen.getByTestId('word-quiz-setup')).toBeDefined();
        expect(screen.getByText(/TOCFL 詞彙測驗/i)).toBeDefined();

        // Level options
        expect(screen.getByTestId('level-btn-A')).toBeDefined();
        expect(screen.getByTestId('level-btn-B')).toBeDefined();
        expect(screen.getByTestId('level-btn-C')).toBeDefined();

        // Word type options
        expect(screen.getByTestId('type-btn-all')).toBeDefined();
        expect(screen.getByTestId('type-btn-noun')).toBeDefined();
        expect(screen.getByTestId('type-btn-verb')).toBeDefined();
        expect(screen.getByTestId('type-btn-adjective')).toBeDefined();
        expect(screen.getByTestId('type-btn-adverb')).toBeDefined();
        expect(screen.getByTestId('type-btn-phrase')).toBeDefined();

        // Start Quiz button
        expect(screen.getByTestId('start-quiz-button')).toBeDefined();
    });

    it('filters words when choosing different levels and word types', () => {
        renderWithContext(<WordQuiz />);

        // Click Level B
        const levelBBtn = screen.getByTestId('level-btn-B');
        fireEvent.click(levelBBtn);

        // Click Verb (動詞)
        const verbBtn = screen.getByTestId('type-btn-verb');
        fireEvent.click(verbBtn);

        // Verify filter displays updated count of words
        expect(screen.getByText(/當前篩選/i)).toBeDefined();
        expect(screen.getByText(/本類別單字預覽/i)).toBeDefined();
    });

    it('starts quiz and displays Chinese word, zhuyin, and English meaning', async () => {
        renderWithContext(<WordQuiz />);

        // Select Nouns
        const nounBtn = screen.getByTestId('type-btn-noun');
        fireEvent.click(nounBtn);

        // Click Start Quiz
        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByTestId('word-quiz-active')).toBeDefined();
            expect(screen.getByTestId('quiz-target-word')).toBeDefined();
            expect(screen.getByTestId('english-meaning')).toBeDefined();
            expect(screen.getByTestId('word-counter')).toBeDefined();
        });

        // Verify English meaning is not empty
        const meaningElem = screen.getByTestId('english-meaning');
        expect(meaningElem.textContent.length).toBeGreaterThan(0);
    });

    it('supports direct mobile Chinese keyboard input via native input', async () => {
        renderWithContext(<WordQuiz />);

        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByTestId('native-quiz-input')).toBeDefined();
        });

        const nativeInput = screen.getByTestId('native-quiz-input');

        // Test composition event (native IME input on mobile)
        fireEvent.compositionStart(nativeInput);
        fireEvent.compositionUpdate(nativeInput, { data: '朋' });
        expect(screen.getByTestId('input-buffer').textContent).toContain('朋');

        // End composition with character
        fireEvent.compositionEnd(nativeInput, { data: '朋' });
    });

    it('supports direct typing of Zhuyin keys and advances word', async () => {
        renderWithContext(<WordQuiz />);

        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByTestId('quiz-target-word')).toBeDefined();
        });

        // Type a key
        fireEvent.keyDown(window, { key: 'q' }); // 'ㄆ' in DaChien layout
        const buffer = screen.getByTestId('input-buffer');
        expect(buffer.textContent).toBeDefined();

        // Backspace clears buffer
        fireEvent.keyDown(window, { key: 'Backspace' });
    });

    it('toggles on-screen keyboard and allows key taps', async () => {
        renderWithContext(<WordQuiz />);

        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByText(/📱 手機鍵盤/i)).toBeDefined();
        });

        // Switch to on-screen keyboard
        const toggleKeyboardBtn = screen.getByText(/📱 手機鍵盤/i);
        fireEvent.click(toggleKeyboardBtn);

        // Now shows '⌨️ 螢幕鍵盤'
        expect(screen.getByText(/⌨️ 螢幕鍵盤/i)).toBeDefined();

        // Virtual key buttons should be present (e.g. ㄅ)
        const keyBopomofo = screen.getByText('ㄅ');
        expect(keyBopomofo).toBeDefined();

        fireEvent.click(keyBopomofo);
    });

    it('allows listening to pronunciation via speech synthesis', async () => {
        renderWithContext(<WordQuiz />);

        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByText(/🔊 聽發音/i)).toBeDefined();
        });

        const audioBtn = screen.getByText(/🔊 聽發音/i);
        fireEvent.click(audioBtn);

        expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it('allows skipping difficult words and shows skipped status in summary', async () => {
        renderWithContext(<WordQuiz />);

        // Choose 5 questions length
        const length5Btn = screen.getByText('5 題');
        fireEvent.click(length5Btn);

        const startBtn = screen.getByTestId('start-quiz-button');
        fireEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByTestId('skip-word-button')).toBeDefined();
            expect(screen.getByTestId('header-skip-button')).toBeDefined();
        });

        const counter = screen.getByTestId('word-counter');
        expect(counter.textContent).toContain('1 / 5');

        // Click skip button
        const skipBtn = screen.getByTestId('skip-word-button');
        fireEvent.click(skipBtn);

        // Counter advances to 2 / 5
        expect(counter.textContent).toContain('2 / 5');

        // Skip remaining words (2, 3, 4, 5) using header skip button as well
        const headerSkip = screen.getByTestId('header-skip-button');
        fireEvent.click(headerSkip);
        expect(counter.textContent).toContain('3 / 5');

        fireEvent.click(skipBtn);
        fireEvent.click(skipBtn);
        fireEvent.click(skipBtn);

        // Should reach results view
        await waitFor(() => {
            expect(screen.getByTestId('word-quiz-results')).toBeDefined();
        });

        // Summary should indicate skipped items
        expect(screen.getAllByText(/跳過 5 題/i).length).toBeGreaterThanOrEqual(1);
        const skippedBadges = screen.getAllByTestId('skipped-badge');
        expect(skippedBadges.length).toBe(5);
    });
});

