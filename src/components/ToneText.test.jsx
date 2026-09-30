import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ToneText from './ToneText';

describe('ToneText Component', () => {
    it('renders Chinese characters with corresponding tone colors', () => {
        // 天(1): blue, 白(2): green, 好(3): orange, 大(4): red
        const { container } = render(<ToneText text="天白好大" />);
        const spans = container.querySelectorAll('[data-tone]');

        expect(spans).toHaveLength(4);
        expect(spans[0].textContent).toBe('天');
        expect(spans[0].style.color).toBe('rgb(37, 99, 235)'); // #2563eb (Blue)
        expect(spans[0].getAttribute('data-tone')).toBe('1');

        expect(spans[1].textContent).toBe('白');
        expect(spans[1].style.color).toBe('rgb(22, 163, 74)'); // #16a34a (Green)
        expect(spans[1].getAttribute('data-tone')).toBe('2');

        expect(spans[2].textContent).toBe('好');
        expect(spans[2].style.color).toBe('rgb(234, 88, 12)'); // #ea580c (Orange)
        expect(spans[2].getAttribute('data-tone')).toBe('3');

        expect(spans[3].textContent).toBe('大');
        expect(spans[3].style.color).toBe('rgb(220, 38, 38)'); // #dc2626 (Red)
        expect(spans[3].getAttribute('data-tone')).toBe('4');
    });

    it('preserves non-Chinese characters and punctuation without tone coloring', () => {
        const { container } = render(<ToneText text="Hi，好！" />);
        const coloredSpans = container.querySelectorAll('[data-tone]');
        expect(coloredSpans).toHaveLength(1);
        expect(coloredSpans[0].textContent).toBe('好');
    });

    it('supports screen reader and RTL getByText querying seamlessly', () => {
        render(<ToneText text="完美的弓" />);
        expect(screen.getByText('完美的弓')).toBeDefined();
    });
});
