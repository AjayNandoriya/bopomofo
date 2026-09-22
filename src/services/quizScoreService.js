import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const LOCAL_STORAGE_KEY_PREFIX = 'bopomofo_quiz_scores_';
const GLOBAL_LOCAL_STORAGE_KEY = 'bopomofo_recent_scores';

/**
 * Helper to get local scores for a user from localStorage
 */
export function getLocalUserScores(userId = 'guest') {
    try {
        const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn('Failed to read scores from localStorage:', e);
        return [];
    }
}

/**
 * Helper to save score item locally to localStorage
 */
export function saveScoreLocally(scoreItem, userId = 'guest') {
    try {
        const userKey = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
        const existingUserScores = getLocalUserScores(userId);
        const updatedUserScores = [scoreItem, ...existingUserScores].slice(0, 100);
        localStorage.setItem(userKey, JSON.stringify(updatedUserScores));

        // Also update recent global scores for offline leaderboard fallback
        const rawGlobal = localStorage.getItem(GLOBAL_LOCAL_STORAGE_KEY);
        const globalScores = rawGlobal ? JSON.parse(rawGlobal) : [];
        const updatedGlobalScores = [scoreItem, ...globalScores.filter(s => s.id !== scoreItem.id)].slice(0, 100);
        localStorage.setItem(GLOBAL_LOCAL_STORAGE_KEY, JSON.stringify(updatedGlobalScores));
    } catch (e) {
        console.warn('Failed to save score to localStorage:', e);
    }
}

/**
 * Registers a quiz score in Cloud Firestore and caches in localStorage.
 */
export async function registerQuizScore({
    userId,
    userEmail,
    displayName,
    photoURL,
    score,
    accuracy,
    maxStreak,
    elapsedSeconds,
    level,
    levelName,
    totalWords,
    skippedCount = 0
}) {
    const scoreItem = {
        id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: userId || 'anonymous',
        userEmail: userEmail || '',
        displayName: displayName || '匿名練習者 (Anonymous)',
        photoURL: photoURL || '',
        score: Number(score) || 0,
        accuracy: Number(accuracy) || 0,
        maxStreak: Number(maxStreak) || 0,
        elapsedSeconds: Number(elapsedSeconds) || 0,
        level: level || 'A',
        levelName: levelName || '基礎級 (Band A)',
        totalWords: Number(totalWords) || 0,
        skippedCount: Number(skippedCount) || 0,
        createdAt: new Date().toISOString(),
        isLocalOnly: false
    };

    // Always cache locally first so user data is never lost
    saveScoreLocally(scoreItem, userId);

    // If online & db is available, attempt to write to Firestore
    try {
        const docRef = await addDoc(collection(db, 'quiz_scores'), {
            ...scoreItem,
            serverTimestamp: serverTimestamp()
        });
        scoreItem.firestoreId = docRef.id;
        scoreItem.isSynced = true;
    } catch (error) {
        console.warn('Could not register score to Firestore (using local storage fallback):', error);
        scoreItem.isLocalOnly = true;
        scoreItem.syncError = error.message;
    }

    return scoreItem;
}

/**
 * Retrieves quiz scores for a specific user from Firestore, with localStorage fallback.
 */
export async function getUserQuizScores(userId) {
    if (!userId) return [];

    const localScores = getLocalUserScores(userId);

    try {
        const scoresRef = collection(db, 'quiz_scores');
        // Simple query by userId, sorting locally to avoid missing Firestore compound index requirements
        const q = query(
            scoresRef,
            where('userId', '==', userId),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        const firestoreScores = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            firestoreScores.push({
                ...data,
                id: doc.id,
                firestoreId: doc.id,
                isSynced: true
            });
        });

        if (firestoreScores.length > 0) {
            // Sort by createdAt descending
            firestoreScores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return firestoreScores;
        }
    } catch (error) {
        console.warn('Error fetching user scores from Firestore, using local fallback:', error);
    }

    // Return local cache if firestore had none or errored
    return localScores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Retrieves leaderboard scores (top scores across all players).
 */
export async function getLeaderboardScores(limitCount = 20) {
    try {
        const scoresRef = collection(db, 'quiz_scores');
        const q = query(
            scoresRef,
            orderBy('score', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboard = [];
        querySnapshot.forEach((doc) => {
            leaderboard.push({
                ...doc.data(),
                id: doc.id
            });
        });

        if (leaderboard.length > 0) {
            return leaderboard;
        }
    } catch (error) {
        console.warn('Error fetching leaderboard from Firestore, using local fallback:', error);
    }

    // Fallback to local recent scores sorted by score descending
    try {
        const rawGlobal = localStorage.getItem(GLOBAL_LOCAL_STORAGE_KEY);
        const list = rawGlobal ? JSON.parse(rawGlobal) : [];
        return list.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, limitCount);
    } catch (e) {
        return [];
    }
}
