import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthButton from './AuthButton';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('AuthButton Component', () => {
    it('renders Google sign in button when user is not logged in', () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
            error: null,
            loginWithGoogle: vi.fn(),
            logout: vi.fn(),
            clearError: vi.fn()
        });

        render(<AuthButton onOpenScoreHistory={vi.fn()} />);

        expect(screen.getByTestId('google-login-button')).toBeDefined();
        expect(screen.getByText('Google 登入')).toBeDefined();
    });

    it('renders user profile button when logged in and opens dropdown', () => {
        const mockLogout = vi.fn();
        const mockOpenHistory = vi.fn();

        useAuth.mockReturnValue({
            user: {
                uid: 'user_456',
                displayName: 'Alice Wang',
                email: 'alice@example.com',
                photoURL: 'https://example.com/photo.jpg'
            },
            loading: false,
            error: null,
            loginWithGoogle: vi.fn(),
            logout: mockLogout,
            clearError: vi.fn()
        });

        render(<AuthButton onOpenScoreHistory={mockOpenHistory} />);

        const profileBtn = screen.getByTestId('user-profile-button');
        expect(profileBtn).toBeDefined();

        // Click to open dropdown
        fireEvent.click(profileBtn);

        expect(screen.getAllByText(/Alice Wang/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/我的測驗紀錄與排行/)).toBeDefined();

        // Click history
        fireEvent.click(screen.getByText(/我的測驗紀錄與排行/));
        expect(mockOpenHistory).toHaveBeenCalledTimes(1);

        // Open again and click logout
        fireEvent.click(profileBtn);
        const logoutBtn = screen.getByTestId('logout-button');
        fireEvent.click(logoutBtn);
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});
