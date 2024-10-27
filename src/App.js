import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/common/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import StoreListPage from './pages/store/StoreListPage';
import StoreDetailPage from './pages/store/StoreDetailPage';
import StoreManagePage from './pages/store/StoreManagePage';
import MenuManagePage from './pages/menu/MenuManagePage';
import ReviewManagePage from './pages/review/ReviewManagePage';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// 공개 라우트 컴포넌트 (로그인한 사용자는 접근 제한)
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // 앱 초기화 로직
        const initializeApp = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    // 토큰 유효성 검사 또는 사용자 정보 가져오기
                    // const response = await fetch(...);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setInitialized(true);
        };

        initializeApp();
    }, []);

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 인증 라우트 */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <SignupPage />
                        </PublicRoute>
                    }
                />

                {/* 보호된 라우트 */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StoreListPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stores/:storeId"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StoreDetailPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* 매장 관리자 라우트 */}
                <Route
                    path="/owner/store"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StoreManagePage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/store/menu"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <MenuManagePage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/store/menu/:menuId"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <MenuManagePage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/store/reviews"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ReviewManagePage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 페이지 */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600">페이지를 찾을 수 없습니다.</p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;