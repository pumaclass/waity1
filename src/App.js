import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import StoreListPage from './pages/store/StoreListPage';
import StoreDetailPage from './pages/store/StoreDetailPage';
import StoreManagePage from './pages/store/StoreManagePage';
import StoreCreatePage from './pages/store/StoreCreatePage';
import MenuManagePage from './pages/menu/MenuManagePage';
import ReviewManagePage from './pages/review/ReviewManagePage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AuthRoute } from './components/route/ProtectedRoutes';
import WaitingManagePage from './pages/owner/WaitingManagePage';



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

                    {/* 매장 등록 라우트 */}
                    <Route
                        path="/owner/stores/create"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <StoreCreatePage />
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

                    <Route
                        path="/owner/waiting"  // 경로 수정
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <WaitingManagePage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/menu/manage/:storeId" element={<MenuManagePage />} />
                    <Route path="/menu/manage/:storeId/:menuId" element={<MenuManagePage />} />
                    <Route path="/stores/:storeId/menus/create" element={<MenuManagePage />} />
                    <Route path="/stores/:storeId/menus/:menuId/edit" element={<MenuManagePage />} />

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