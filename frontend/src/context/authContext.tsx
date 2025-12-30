import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, verifyToken, type User, type LoginCredentials, type RegisterData } from '../services/authService';

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.token) {
                try {
                    const freshUserData = await verifyToken();
                    setUser({ ...freshUserData, token: currentUser.token });
                } catch (error) {
                    console.error('Token verification failed:', error);
                    logoutService();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const userData = await loginService(credentials);
        setUser(userData);
    };

    const register = async (data: RegisterData) => {
        const userData = await registerService(data);
        setUser(userData);
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.token) {
                const freshUserData = await verifyToken();
                setUser({ ...freshUserData, token: currentUser.token });
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            logout();
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
