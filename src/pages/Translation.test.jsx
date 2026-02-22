
import { render, screen, waitFor } from '@testing-library/react';
import Translation from './Translation';
import * as converter from '../utils/converter';
import { vi, describe, it, expect } from 'vitest';

// Mock the converter to avoid calling external libs and to have predictable output
vi.mock('../utils/converter', async () => {
    return {
        toTraditional: vi.fn((text) => Promise.resolve(text)),
        annotateZhuyin: vi.fn((text) => {
            // Simple mock implementation that preserves newlines
            // Returns array of items
            return text.split('').map(char => ({
                char: char,
                zhuyin: '',
                pinyin: ''
            }));
        })
    };
});

// Mock hooks if necessary (Hooks are inside component so standard render works)
// But we might want to mock the ResizeObserver because of the layout logic
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('Translation Component', () => {
    it('renders separate line containers for text with newlines', async () => {
        const { container } = render(<Translation />);

        // Simulate input
        const textarea = screen.getByPlaceholderText(/Type or paste/i);
        // React testing: fireEvent.change(textarea, { target: { value: 'A\nB' } });
        // But we need to use 'act' if updating state.
        // Let's just create a quick test that verifies the rendering logic given a mocked hook or just integration test.

        // Since input triggers async `toTraditional`, we wait.

        // Let's modify the component to accept initial props for easier testing? 
        // No, I can't change component signature just for test easily.

        // We can simulate user typing.
        const { fireEvent } = await import('@testing-library/react');

        // Input: "A\nB"
        fireEvent.change(textarea, { target: { value: 'A\nB' } });

        // Wait for conversion
        await waitFor(() => {
            expect(converter.toTraditional).toHaveBeenCalled();
        });

        // Check DOM structure
        // We expect the output section to contain a flex-col container
        // And inside it, multiple flex-wrap containers.

        // The simplified test:
        // Look for text 'A' and 'B'.
        // Check their parent elements. They should be in DIFFERENT row containers.

        const charA = await screen.findByText('A');
        const charB = await screen.findByText('B');

        // Identify row containers.
        // The row containers have class 'flex flex-wrap gap-4 ...'
        // We can query by class or structure.

        // charA is inside:
        // div(flex-col items-center) (Character Block)
        //   -> div(flex flex-wrap) (Line Container)

        const blockA = charA.closest('.flex-col.items-center');
        const lineA = blockA.parentElement;

        const blockB = charB.closest('.flex-col.items-center');
        const lineB = blockB.parentElement;

        expect(lineA).not.toBe(lineB);

        // Verify lineB follows lineA?
        // They are siblings in the main container.
        // main container: flex-col gap-4
        const mainContainer = lineA.parentElement;
        expect(mainContainer.className).toContain('flex-col');
        expect(mainContainer.className).toContain('gap-4');
    });

    it('renders empty line for double newline', async () => {
        const { fireEvent } = await import('@testing-library/react');
        const { container } = render(<Translation />);
        const textarea = screen.getByPlaceholderText(/Type or paste/i);

        // Input: "A\n\nB"
        fireEvent.change(textarea, { target: { value: 'A\n\nB' } });

        await waitFor(() => {
            expect(converter.toTraditional).toHaveBeenCalledTimes(2); // Initial (empty) + 1 change?
            // Actually 1 change.
        });

        // We expect 3 lines.
        // Line 1: A
        // Line 2: Empty
        // Line 3: B

        // Find all line containers?
        // We can assume the lines are direct children of the container that has .flex-col.
        // But finding that specific container is tricky without testid.
        // Let's find 'A' and traverse up.

        const charA = await screen.findByText('A');
        const lineContainer = charA.closest('.flex-col.gap-4'); // The outer container

        expect(lineContainer).toBeTruthy();
        expect(lineContainer.children).toHaveLength(3);

        const line1 = lineContainer.children[0];
        const line2 = lineContainer.children[1];
        const line3 = lineContainer.children[2];

        expect(line1).toHaveTextContent('A');
        expect(line2).toHaveTextContent(''); // Empty
        expect(line2.className).toContain('h-8'); // Check for the empty line height class
        expect(line3).toHaveTextContent('B');
    });
});
