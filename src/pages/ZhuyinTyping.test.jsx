import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZhuyinTyping from './ZhuyinTyping';
import { describe, it, expect } from 'vitest';

describe('ZhuyinTyping Component', () => {
    it('renders TOCFL level options and title', () => {
        render(<ZhuyinTyping />);
        expect(screen.getByText(/Zhuyin Typing Practice/i)).toBeDefined();
        expect(screen.getByText(/Band A \(A1-A2\)/i)).toBeDefined();
        expect(screen.getByText(/Band B \(B1-B2\)/i)).toBeDefined();
        expect(screen.getByText(/Band C \(C1-C2\)/i)).toBeDefined();
        expect(screen.getByText(/自訂練習 \(Custom Text\)/i)).toBeDefined();
    });

    it('switches levels and displays relevant paragraphs', () => {
        render(<ZhuyinTyping />);
        // Level A paragraphs
        expect(screen.getByText(/自我介紹與日常習慣/i)).toBeDefined();

        // Switch to Level B
        const levelBButton = screen.getByText(/Band B \(B1-B2\)/i);
        fireEvent.click(levelBButton);
        expect(screen.getByText(/搭乘台灣高鐵的便利生活/i)).toBeDefined();

        // Switch to Level C
        const levelCButton = screen.getByText(/Band C \(C1-C2\)/i);
        fireEvent.click(levelCButton);
        expect(screen.getByText(/數位時代的人工智慧與生活轉型/i)).toBeDefined();
    });

    it('can enter typing arena when clicking a paragraph card', async () => {
        render(<ZhuyinTyping />);
        const card = screen.getByText(/自我介紹與日常習慣/i);
        fireEvent.click(card);

        await waitFor(() => {
            expect(screen.getByText(/文章列表 \(Back\)/i)).toBeDefined();
            expect(screen.getByText(/台灣標準注音鍵盤/i)).toBeDefined();
            expect(screen.getByText(/當前目標字/i)).toBeDefined();
        });
    });

    it('simulates keyboard typing and advances character', async () => {
        render(<ZhuyinTyping />);
        const card = screen.getByText(/自我介紹與日常習慣/i);
        fireEvent.click(card);

        await waitFor(() => {
            expect(screen.getByText(/當前目標字/i)).toBeDefined();
        });

        // First character of "你好！" is '你' (ㄋㄧˇ -> 's', 'u', '3')
        // Type 's'
        fireEvent.keyDown(window, { key: 's' });
        // Type 'u'
        fireEvent.keyDown(window, { key: 'u' });
        // Type '3' (ˇ)
        fireEvent.keyDown(window, { key: '3' });

        // After completing '你', it advances to next character '好' (ㄏㄠˇ)
        await waitFor(() => {
            // Target should now display '好'
            expect(screen.getByText(/注音: ㄏㄠˇ/i)).toBeDefined();
        });
    });

    it('toggles pinyin and keyboard visibility', async () => {
        render(<ZhuyinTyping />);
        const card = screen.getByText(/自我介紹與日常習慣/i);
        fireEvent.click(card);

        await waitFor(() => {
            expect(screen.getByText(/文章列表 \(Back\)/i)).toBeDefined();
        });

        const pinyinToggle = screen.getByTitle(/Toggle Pinyin display/i);
        fireEvent.click(pinyinToggle);

        const keyboardToggle = screen.getByText(/鍵盤 \(收合\)/i);
        fireEvent.click(keyboardToggle);
        expect(screen.queryByText(/台灣標準注音鍵盤/i)).toBeNull();
    });
});

