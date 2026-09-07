import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { FontSizeProvider, useFontSize, FontSizeControl, FONT_SIZE_LEVELS } from './FontSizeContext';

function TestConsumer() {
    const { fontSize, pinyinSize, zhuyinSize, currentLevel, increase, decrease } = useFontSize();
    return (
        <div>
            <span data-testid="size">{fontSize}</span>
            <span data-testid="pinyin-size">{pinyinSize}</span>
            <span data-testid="zhuyin-size">{zhuyinSize}</span>
            <span data-testid="level-key">{currentLevel.key}</span>
            <button onClick={increase}>Inc</button>
            <button onClick={decrease}>Dec</button>
            <FontSizeControl />
        </div>
    );
}

describe('FontSizeContext & FontSizeControl', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('provides default medium font size (30px)', () => {
        render(
            <FontSizeProvider>
                <TestConsumer />
            </FontSizeProvider>
        );

        expect(screen.getByTestId('size').textContent).toBe('30');
        expect(screen.getByTestId('level-key').textContent).toBe('md');
    });

    it('increases and decreases font size via controls', () => {
        render(
            <FontSizeProvider>
                <TestConsumer />
            </FontSizeProvider>
        );

        const incButton = screen.getByRole('button', { name: /Increase font size/i });
        const decButton = screen.getByRole('button', { name: /Decrease font size/i });

        // Increase to 'lg' (38px)
        fireEvent.click(incButton);
        expect(screen.getByTestId('size').textContent).toBe('38');
        expect(screen.getByTestId('level-key').textContent).toBe('lg');

        // Increase to 'xl' (48px)
        fireEvent.click(incButton);
        expect(screen.getByTestId('size').textContent).toBe('48');

        // Decrease back to 'lg' (38px)
        fireEvent.click(decButton);
        expect(screen.getByTestId('size').textContent).toBe('38');
    });

    it('allows choosing preset from dropdown and persists to localStorage', () => {
        render(
            <FontSizeProvider>
                <TestConsumer />
            </FontSizeProvider>
        );

        const select = screen.getByRole('combobox', { name: /Font size preset/i });
        fireEvent.change(select, { target: { value: '2xl' } });

        expect(screen.getByTestId('size').textContent).toBe('58');
        expect(screen.getByTestId('level-key').textContent).toBe('2xl');
        expect(localStorage.getItem('bopomofo_font_size')).toBe('2xl');
    });

    it('compact control renders size text badge instead of select dropdown', () => {
        render(
            <FontSizeProvider>
                <FontSizeControl compact />
            </FontSizeProvider>
        );

        expect(screen.getByText('30px')).toBeDefined();
        expect(screen.queryByRole('combobox')).toBeNull();
    });
});
