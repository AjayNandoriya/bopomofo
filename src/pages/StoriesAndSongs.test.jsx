import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Stories from './Stories';
import Songs from './Songs';
import { FontSizeProvider } from '../context/FontSizeContext';

vi.mock('../utils/converter', () => ({
    toTraditional: vi.fn((text) => Promise.resolve(text)),
    annotateZhuyin: vi.fn((text) => {
        return text.split('').map(char => ({
            char,
            zhuyin: char === '好' ? 'ㄏㄠˇ' : '',
            pinyin: char === '好' ? 'hǎo' : ''
        }));
    })
}));

describe('Stories Page', () => {
    it('renders stories list and opens selected story', async () => {
        render(
            <FontSizeProvider>
                <Stories />
            </FontSizeProvider>
        );

        expect(screen.getByText('完美的弓')).toBeDefined();
        fireEvent.click(screen.getByText('完美的弓'));

        await waitFor(() => {
            expect(screen.getByText('← Back to Stories')).toBeDefined();
            expect(screen.getByRole('button', { name: /Switch to Pinyin View/i })).toBeDefined();
        });
    });

    it('has font size controls and toggles pinyin view', async () => {
        render(
            <FontSizeProvider>
                <Stories />
            </FontSizeProvider>
        );

        fireEvent.click(screen.getByText('完美的弓'));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Increase font size/i })).toBeDefined();
        });

        const toggleBtn = screen.getByRole('button', { name: /Switch to Pinyin View/i });
        fireEvent.click(toggleBtn);
        expect(screen.getByRole('button', { name: /Switch to Zhuyin View/i })).toBeDefined();
    });
});

describe('Songs Page', () => {
    it('renders songs list and opens selected song', async () => {
        render(
            <FontSizeProvider>
                <Songs />
            </FontSizeProvider>
        );

        expect(screen.getByText('月亮代表我的心')).toBeDefined();
        fireEvent.click(screen.getByText('月亮代表我的心'));

        await waitFor(() => {
            expect(screen.getByText('← Back to Songs')).toBeDefined();
            expect(screen.getByRole('button', { name: /Increase font size/i })).toBeDefined();
        });
    });
});
