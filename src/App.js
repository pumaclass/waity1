import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import StoreListPage from './pages/store/StoreListPage';
import StoreDetailPage from './pages/store/StoreDetailPage';
import StoreManagePage from './pages/store/StoreManagePage';
import MenuManagePage from './pages/menu/MenuManagePage';
import ReviewManagePage from './pages/review/ReviewManagePage';
import { AuthProvider } from './contexts/AuthContext';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// 로그인 전용 라우트 컴포넌트 (로그인했으면 홈으로)
const AuthRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* 인증 라우트 */}
                    <Route
                        path="/login"
                        element={
                            <AuthRoute>
                                <LoginPage />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <AuthRoute>
                                <SignupPage />
                            </AuthRoute>
                        }
                    />

                    {/* 공개 라우트 (로그인 불필요) */}
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <StoreListPage />
                            </Layout>
                        }
                    />

                    <Route
                        path="/stores/:storeId"
                        element={
                            <Layout>
                                <StoreDetailPage />
                            </Layout>
                        }
                    />

                    {/* 보호된 라우트 (로그인 필요) */}
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
        </AuthProvider>
    );
}

export default App;