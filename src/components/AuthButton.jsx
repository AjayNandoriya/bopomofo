import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function GoogleIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.26 21.4 7.33 24 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
            />
        </svg>
    );
}

export default function AuthButton({ onOpenScoreHistory }) {
    const { user, loading, error, loginWithGoogle, logout, clearError } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            // Error is handled in AuthContext state
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        setMenuOpen(false);
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center px-2 py-1 text-xs text-neutral-400 font-medium">
                <span className="inline-block w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mr-1.5" />
                載入中...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="relative flex items-center">
                <button
                    type="button"
                    data-testid="google-login-button"
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-400 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                    title="以 Google 帳號登入記錄測驗成績"
                >
                    <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                        {isLoggingIn ? '登入中...' : 'Google 登入'}
                    </span>
                </button>

                {error && (
                    <div
                        data-testid="auth-error-tooltip"
                        className="absolute right-0 top-full mt-1.5 w-64 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg shadow-lg z-50 flex items-start justify-between"
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={clearError}
                            className="ml-1 text-rose-500 hover:text-rose-800 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                data-testid="user-profile-button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 md:px-2 md:py-1 rounded-full md:rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition cursor-pointer shadow-2xs"
                title={`${user.displayName || user.email} (點擊查看選單)`}
            >
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                    />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                )}

                <span className="hidden md:inline text-xs font-semibold text-neutral-700 max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="hidden md:inline text-[10px] text-neutral-400">▾</span>
            </button>

            {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 text-neutral-800 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                            {user.displayName || 'Google 使用者'}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                            {user.email}
                        </p>
                    </div>

                    {onOpenScoreHistory && (
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                onOpenScoreHistory();
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer transition"
                        >
                            <span>📊</span>
                            <span>我的測驗紀錄與排行</span>
                        </button>
                    )}

                    <button
                        type="button"
                        data-testid="logout-button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition"
                    >
                        <span>🚪</span>
                        <span>登出 (Sign Out)</span>
                    </button>
                </div>
            )}
        </div>
    );
}
