import { useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { auth } from '../lib/auth';
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUser, setIsAuthenticated } = useAuthContext();

    const signup = async (userData) => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.auth.signup, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        console.log("login");
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.auth.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            // "Bearer "를 제거한 후 토큰 저장
            const accessToken = data.data.accessToken;
            const refreshToken = data.data.refreshToken;

            auth.setTokens(accessToken, refreshToken);
            setUser({ id: data.data.id, email: data.data.email, userNickname: data.data.userNickname });
            setIsAuthenticated(true);

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        console.log("logout");
        setIsLoading(true);
        try {
            await fetch(API_ENDPOINTS.auth.logout, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.getAccessToken()}`,
                },
            });

            auth.clearTokens();
            setUser(null);
            setIsAuthenticated(false);

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        signup,
        login,
        logout,
    };
};