import { Navigate } from 'react-router-dom';

// 보호된 라우트 컴포넌트
export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// 로그인 전용 라우트 컴포넌트 (로그인했으면 홈으로)
export const AuthRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};