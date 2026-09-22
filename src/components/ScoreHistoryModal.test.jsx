import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScoreHistoryModal from './ScoreHistoryModal';
import { useAuth } from '../context/AuthContext';
import * as quizScoreService from '../services/quizScoreService';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

vi.mock('../services/quizScoreService', () => ({
    getUserQuizScores: vi.fn(),
    getLeaderboardScores: vi.fn()
}));

describe('ScoreHistoryModal Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not render when isOpen is false', () => {
        useAuth.mockReturnValue({ user: null, loginWithGoogle: vi.fn() });
        const { container } = render(<ScoreHistoryModal isOpen={false} onClose={vi.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders user scores and tabs when open', async () => {
        useAuth.mockReturnValue({
            user: { uid: 'u1', displayName: 'Player 1' },
            loginWithGoogle: vi.fn()
        });

        quizScoreService.getUserQuizScores.mockResolvedValue([
            {
                id: 'score_1',
                level: 'A',
                score: 150,
                accuracy: 95,
                maxStreak: 6,
                elapsedSeconds: 40,
                createdAt: new Date().toISOString()
            }
        ]);

        quizScoreService.getLeaderboardScores.mockResolvedValue([
            {
                id: 'board_1',
                userId: 'u1',
                displayName: 'Player 1',
                level: 'A',
                score: 150,
                accuracy: 95
            }
        ]);

        const onClose = vi.fn();
        render(<ScoreHistoryModal isOpen={true} onClose={onClose} />);

        expect(screen.getByText(/測驗紀錄與排行榜/i)).toBeDefined();

        await waitFor(() => {
            expect(screen.getByText(/150 分/)).toBeDefined();
            expect(screen.getByText(/95% 準確率/)).toBeDefined();
        });

        // Switch to Leaderboard tab
        const leaderboardTab = screen.getByText(/全域排行榜/);
        fireEvent.click(leaderboardTab);

        await waitFor(() => {
            expect(quizScoreService.getLeaderboardScores).toHaveBeenCalled();
        });
    });
});
