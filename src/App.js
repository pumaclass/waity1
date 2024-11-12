import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserStoreListPage from './pages/store/UserStoreListPage';
import UserStoreDetailPage from './pages/store/UserStoreDetailPage';
import StoreManagePage from './pages/store/StoreManagePage';
import StoreCreatePage from './pages/store/StoreCreatePage';
import MenuManagePage from './pages/menu/MenuManagePage';
import ReviewManagePage from './pages/review/ReviewManagePage';
import UserReviewPage from './pages/review/UserReviewPage';
import CreateReviewPage from './pages/review/CreateReviewPage';
import ReservationHistoryPage from './pages/reservation/ReservationHistoryPage';
import WaitingManagePage from './pages/waiting/WaitingManagePage';  // 추가
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AuthRoute } from './components/route/ProtectedRoutes';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* 인증 라우트 */}
                    <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
                    <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />

                    {/* 공개 라우트 (로그인 불필요) */}
                    <Route path="/" element={<Layout><UserStoreListPage /></Layout>} />
                    <Route path="/stores/:storeId" element={<Layout><UserStoreDetailPage /></Layout>} />

                    {/* 사용자 보호 라우트 */}
                    <Route element={<ProtectedRoute />}>
                        {/* 예약/웨이팅 */}
                        <Route path="/reservations" element={<Layout><ReservationHistoryPage /></Layout>} />
                        <Route path="/waiting" element={<Layout><ReservationHistoryPage type="WAIT" /></Layout>} />

                        {/* 리뷰 */}
                        <Route path="/user/reviews" element={<Layout><UserReviewPage /></Layout>} />
                        <Route path="/reviews/create/:storeId" element={<CreateReviewPage />} />
                    </Route>

                    {/* 점주 보호 라우트 */}
                    <Route element={<ProtectedRoute />}>
                        {/* 매장 관리 */}
                        <Route path="/owner/stores" element={<Layout><StoreManagePage /></Layout>} />
                        <Route path="/owner/stores/create" element={<Layout><StoreCreatePage /></Layout>} />

                        {/* 메뉴 관리 */}
                        <Route path="/owner/stores/:storeId/menus" element={<Layout><MenuManagePage /></Layout>} />
                        <Route path="/owner/stores/:storeId/menus/create" element={<Layout><MenuManagePage /></Layout>} />
                        <Route path="/owner/stores/:storeId/menus/:menuId/edit" element={<Layout><MenuManagePage /></Layout>} />

                        {/* 웨이팅 관리 */}
                        <Route path="/owner/stores/:storeId/waiting" element={<Layout><WaitingManagePage /></Layout>} />

                        {/* 리뷰 관리 */}
                        <Route path="/owner/reviews" element={<Layout><ReviewManagePage /></Layout>} />
                        <Route path="/owner/stores/:storeId/reviews" element={<Layout><ReviewManagePage /></Layout>} />
                    </Route>

                    {/* 404 페이지 */}
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600">페이지를 찾을 수 없습니다.</p>
                            </div>
                        </div>
                    }/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;