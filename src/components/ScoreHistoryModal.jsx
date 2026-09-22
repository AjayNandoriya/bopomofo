import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserQuizScores, getLeaderboardScores } from '../services/quizScoreService';
import { GoogleIcon } from './AuthButton';

export default function ScoreHistoryModal({ isOpen, onClose }) {
    const { user, loginWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('myScores'); // 'myScores' | 'leaderboard'
    const [userScores, setUserScores] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'myScores') {
                const scores = await getUserQuizScores(user ? user.uid : 'guest');
                setUserScores(scores);
            } else {
                const board = await getLeaderboardScores(25);
                setLeaderboard(board);
            }
        } catch (e) {
            console.error('Failed to load score records:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, activeTab, user]);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setIsLoggingIn(true);
        try {
            await loginWithGoogle();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Calculate quick stats for user
    const totalQuizzes = userScores.length;
    const highestScore = userScores.reduce((max, s) => Math.max(max, s.score || 0), 0);
    const avgAccuracy = totalQuizzes > 0
        ? Math.round(userScores.reduce((acc, s) => acc + (s.accuracy || 0), 0) / totalQuizzes)
        : 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-neutral-900/60 backdrop-blur-xs animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="score-history-title"
            >
                {/* Header */}
                <div className="flex-none px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        <div>
                            <h2 id="score-history-title" className="text-base md:text-lg font-bold text-neutral-900 leading-tight">
                                測驗紀錄與排行榜 (Quiz Scores & Leaderboard)
                            </h2>
                            <p className="text-xs text-neutral-500">
                                透過 Google 帳號雲端同步紀錄你的學習歷程
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition cursor-pointer text-sm"
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex-none px-5 pt-3 pb-0 border-b border-neutral-200 bg-white flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('myScores')}
                            className={`pb-2.5 px-3 text-xs md:text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'myScores'
                                ? 'border-neutral-900 text-neutral-900'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800'
                                }`}
                        >
                            📊 我的成績 ({userScores.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('leaderboard')}
                            className={`pb-2.5 px-3 text-xs md:text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'leaderboard'
                                ? 'border-neutral-900 text-neutral-900'
                                : 'border-transparent text-neutral-500 hover:text-neutral-800'
                                }`}
                        >
                            🏆 全域排行榜 (Leaderboard)
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="text-xs text-neutral-500 hover:text-neutral-900 pb-2 flex items-center gap-1 cursor-pointer"
                        title="重新整理"
                    >
                        <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
                        <span className="hidden sm:inline">重新整理</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
                    {/* Guest notification if unauthenticated */}
                    {!user && (
                        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-blue-900">
                                <span className="font-bold block sm:inline">💡 尚未登入 Google 帳號</span>
                                <span className="text-blue-700 sm:ml-1.5">
                                    登入後可將成績保存至雲端，並登錄至全域排行榜！
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoggingIn}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-neutral-800 hover:bg-neutral-50 border border-blue-200 shadow-2xs transition shrink-0 cursor-pointer self-start sm:self-auto"
                            >
                                <GoogleIcon className="w-3.5 h-3.5" />
                                <span>{isLoggingIn ? '登入中...' : '使用 Google 登入'}</span>
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-2">
                            <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
                            <span className="text-xs">載入紀錄中...</span>
                        </div>
                    ) : activeTab === 'myScores' ? (
                        <>
                            {/* Summary Metrics */}
                            {userScores.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center">
                                        <div className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase">測驗次數</div>
                                        <div className="text-lg sm:text-2xl font-black text-neutral-900">{totalQuizzes}</div>
                                    </div>
                                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center">
                                        <div className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase">最高得分</div>
                                        <div className="text-lg sm:text-2xl font-black text-amber-500">🏆 {highestScore}</div>
                                    </div>
                                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center">
                                        <div className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase">平均準確率</div>
                                        <div className="text-lg sm:text-2xl font-black text-emerald-600">{avgAccuracy}%</div>
                                    </div>
                                </div>
                            )}

                            {/* Score List */}
                            {userScores.length === 0 ? (
                                <div className="text-center py-10 text-neutral-400">
                                    <span className="text-3xl block mb-2">📝</span>
                                    <p className="text-sm font-semibold text-neutral-600">尚無測驗紀錄</p>
                                    <p className="text-xs mt-1">完成 TOCFL 詞彙測驗後，成績將會記錄在這裡！</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {userScores.map((item, idx) => {
                                        const dateStr = item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '剛剛';

                                        return (
                                            <div
                                                key={item.id || idx}
                                                className="p-3 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-2 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                                                        {item.level || 'A'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-neutral-900">
                                                                {item.score} 分
                                                            </span>
                                                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                                {item.accuracy}% 準確率
                                                            </span>
                                                            {item.maxStreak > 0 && (
                                                                <span className="text-[11px] font-semibold text-amber-600">
                                                                    🔥 {item.maxStreak}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-neutral-400 mt-0.5">
                                                            {dateStr} • 用時 {Math.floor(item.elapsedSeconds / 60)}:{(item.elapsedSeconds % 60).toString().padStart(2, '0')}
                                                            {item.skippedCount > 0 && ` • 跳過 ${item.skippedCount} 題`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    {item.isSynced || item.firestoreId ? (
                                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1" title="雲端已同步">
                                                            ☁️ 雲端同步
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1" title="本地儲存">
                                                            💾 本地紀錄
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        /* Leaderboard View */
                        <div>
                            {leaderboard.length === 0 ? (
                                <div className="text-center py-10 text-neutral-400">
                                    <span className="text-3xl block mb-2">🏆</span>
                                    <p className="text-sm font-semibold text-neutral-600">尚無排行榜資料</p>
                                    <p className="text-xs mt-1">登入 Google 帳號完成測驗，成為排行榜第一名！</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {leaderboard.map((entry, idx) => {
                                        const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                                        const isCurrentUser = user && entry.userId === user.uid;

                                        return (
                                            <div
                                                key={entry.id || idx}
                                                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${isCurrentUser
                                                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                                                    : 'bg-white hover:bg-neutral-50 border-neutral-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-base font-bold w-7 text-center shrink-0">
                                                        {rankMedal}
                                                    </span>

                                                    {entry.photoURL ? (
                                                        <img
                                                            src={entry.photoURL}
                                                            alt={entry.displayName}
                                                            referrerPolicy="no-referrer"
                                                            className="w-7 h-7 rounded-full object-cover border border-neutral-200 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                            {(entry.displayName || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 truncate">
                                                        <div className="text-xs sm:text-sm font-bold text-neutral-900 truncate flex items-center gap-1.5">
                                                            <span className="truncate">{entry.displayName || '匿名練習者'}</span>
                                                            {isCurrentUser && (
                                                                <span className="text-[10px] bg-neutral-900 text-white font-semibold px-1.5 py-0.2 rounded-full shrink-0">
                                                                    你 (You)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                                                            <span>級別 {entry.level || 'A'}</span>
                                                            <span>•</span>
                                                            <span>{entry.accuracy}% 準率</span>
                                                            {entry.maxStreak > 0 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>🔥 {entry.maxStreak}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className="text-base sm:text-lg font-black text-neutral-900">
                                                        {entry.score} 分
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-none px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs md:text-sm font-bold rounded-xl transition cursor-pointer"
                    >
                        關閉 (Close)
                    </button>
                </div>
            </div>
        </div>
    );
}
