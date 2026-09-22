import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    registerQuizScore,
    getUserQuizScores,
    getLeaderboardScores,
    saveScoreLocally,
    getLocalUserScores
} from './quizScoreService';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({ id: 'mock_doc_id_999' }),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    getDocs: vi.fn().mockResolvedValue({
        forEach: (cb) => {
            cb({
                id: 'mock_doc_1',
                data: () => ({
                    userId: 'user_1',
                    displayName: 'Cloud User',
                    score: 250,
                    accuracy: 98,
                    createdAt: new Date().toISOString()
                })
            });
        }
    }),
    serverTimestamp: vi.fn(() => ({ type: 'serverTimestamp' }))
}));

// Mock ./firebase
vi.mock('./firebase', () => ({
    db: {}
}));

describe('quizScoreService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('saves score locally and attempts Firestore registration', async () => {
        const scoreData = {
            userId: 'test_user_abc',
            userEmail: 'user@example.com',
            displayName: 'Alice',
            score: 180,
            accuracy: 95,
            maxStreak: 8,
            elapsedSeconds: 45,
            level: 'A',
            totalWords: 10
        };

        const result = await registerQuizScore(scoreData);

        expect(result.score).toBe(180);
        expect(result.accuracy).toBe(95);
        expect(result.userId).toBe('test_user_abc');
        expect(result.firestoreId).toBe('mock_doc_id_999');

        // Check local storage
        const localScores = getLocalUserScores('test_user_abc');
        expect(localScores.length).toBe(1);
        expect(localScores[0].score).toBe(180);
    });

    it('falls back gracefully to localStorage when offline or if Firestore throws', async () => {
        const { addDoc } = await import('firebase/firestore');
        addDoc.mockRejectedValueOnce(new Error('Network offline or permission-denied'));

        const result = await registerQuizScore({
            userId: 'offline_user',
            score: 120,
            accuracy: 90
        });

        expect(result.isLocalOnly).toBe(true);
        expect(result.score).toBe(120);

        const localScores = getLocalUserScores('offline_user');
        expect(localScores.length).toBe(1);
        expect(localScores[0].score).toBe(120);
    });

    it('retrieves user quiz scores', async () => {
        const scores = await getUserQuizScores('user_1');
        expect(scores.length).toBeGreaterThan(0);
        expect(scores[0].score).toBe(250);
    });

    it('retrieves leaderboard scores', async () => {
        const board = await getLeaderboardScores(10);
        expect(board.length).toBeGreaterThan(0);
        expect(board[0].score).toBe(250);
    });
});
