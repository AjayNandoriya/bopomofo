import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            },
            (err) => {
                console.error('Firebase auth state change error:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            return result.user;
        } catch (err) {
            console.error('Google sign-in error:', err);
            // Handle common popup closed by user or blocked popup
            if (err.code === 'auth/popup-closed-by-user') {
                setError('登入視窗已關閉 (Sign-in popup closed)');
            } else if (err.code === 'auth/popup-blocked') {
                setError('瀏覽器封鎖了彈出視窗，請允許彈出視窗後重試 (Popup blocked by browser)');
            } else {
                setError(err.message || 'Google 登入失敗 (Sign-in failed)');
            }
            throw err;
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
            setUser(null);
        } catch (err) {
            console.error('Sign-out error:', err);
            setError(err.message || '登出失敗 (Sign-out failed)');
            throw err;
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                loginWithGoogle,
                logout,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
