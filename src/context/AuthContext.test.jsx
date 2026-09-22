import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Mock firebase/auth
vi.mock('firebase/auth', () => {
    return {
        getAuth: vi.fn(() => ({})),
        GoogleAuthProvider: vi.fn().mockImplementation(() => ({
            setCustomParameters: vi.fn()
        })),
        onAuthStateChanged: vi.fn((auth, callback) => {
            // Immediately simulate unauthenticated user
            callback(null);
            return vi.fn(); // unsubscribe function
        }),
        signInWithPopup: vi.fn().mockResolvedValue({
            user: {
                uid: 'test_uid_123',
                displayName: 'Test User',
                email: 'test@example.com',
                photoURL: 'https://example.com/avatar.jpg'
            }
        }),
        signOut: vi.fn().mockResolvedValue()
    };
});

// Mock ../services/firebase
vi.mock('../services/firebase', () => ({
    auth: {},
    googleProvider: {},
    db: {}
}));

function TestConsumer() {
    const { user, loading, error, loginWithGoogle, logout } = useAuth();

    return (
        <div>
            <div data-testid="loading-state">{loading ? 'loading' : 'ready'}</div>
            <div data-testid="user-email">{user ? user.email : 'no-user'}</div>
            {error && <div data-testid="auth-error">{error}</div>}
            <button data-testid="btn-login" onClick={() => loginWithGoogle()}>
                Login
            </button>
            <button data-testid="btn-logout" onClick={() => logout()}>
                Logout
            </button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('provides authentication status and initial unauthenticated state', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading-state').textContent).toBe('ready');
        expect(screen.getByTestId('user-email').textContent).toBe('no-user');
    });

    it('logs in with Google and updates user state', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const loginBtn = screen.getByTestId('btn-login');
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
        });
    });

    it('logs out and clears user state', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const loginBtn = screen.getByTestId('btn-login');
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
        });

        const logoutBtn = screen.getByTestId('btn-logout');
        fireEvent.click(logoutBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-email').textContent).toBe('no-user');
        });
    });
});
