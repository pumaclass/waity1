import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Phone, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import MenuList from '../../components/menu/MenuList';
import ReviewList from '../../components/review/ReviewList';
import { useStore } from '../../hooks/useStore';

const StoreDetailPage = () => {
    const { storeId } = useParams();
    const { store, loading, error, fetchStoreDetail } = useStore();
    const [activeTab, setActiveTab] = useState('menu');
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [showWaitingModal, setShowWaitingModal] = useState(false);

    useEffect(() => {
        if (storeId) {
            fetchStoreDetail(storeId);
        }
    }, [storeId]); // fetchStoreDetail 의존성 제거

    const handleReservation = () => {
        setShowReservationModal(true);
    };

    const handleWaiting = () => {
        setShowWaitingModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
            </div>
        );
    }

    if (!store) {
        return (
            <div className="p-4 text-center text-gray-500">
                매장 정보를 찾을 수 없습니다.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={store.title}
                showBack={true}
            />

            <div className="pt-14">
                {/* 매장 정보 영역 */}
                <div className="bg-white p-4">
                    <h1 className="text-xl font-bold">{store.title}</h1>
                    <p className="text-gray-600 mt-1">{store.description}</p>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>{store.openTime} - {store.closeTime}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{store.address}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-5 h-5 mr-2" />
                            <a href={`tel:${store.phoneNumber}`} className="text-blue-500">
                                {store.phoneNumber}
                            </a>
                        </div>
                    </div>

                    {/* 예약/웨이팅 버튼 */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleReservation}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium"
                        >
                            예약하기
                        </button>
                        <button
                            onClick={handleWaiting}
                            className="flex-1 py-3 bg-white border border-blue-500 text-blue-500 rounded-lg font-medium"
                        >
                            웨이팅
                        </button>
                    </div>
                </div>

                {/* 탭 메뉴 */}
                <div className="flex bg-white border-b mt-2">
                    <button
                        className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 ${
                            activeTab === 'menu'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-500'
                        }`}
                        onClick={() => setActiveTab('menu')}
                    >
                        메뉴
                    </button>
                    <button
                        className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 ${
                            activeTab === 'reviews'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-500'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        리뷰
                    </button>
                </div>

                {/* 탭 컨텐츠 */}
                <div className="bg-white">
                    {activeTab === 'menu' && <MenuList storeId={storeId} />}
                    {activeTab === 'reviews' && <ReviewList storeId={storeId} />}
                </div>
            </div>

            {/* 예약 모달 */}
            {showReservationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold">예약하기</h2>
                        {/* 예약 폼 내용 추가 예정 */}
                        <button
                            onClick={() => setShowReservationModal(false)}
                            className="w-full mt-4 py-2 bg-gray-100 rounded-lg"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 웨이팅 모달 */}
            {showWaitingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold">웨이팅</h2>
                        {/* 웨이팅 폼 내용 추가 예정 */}
                        <button
                            onClick={() => setShowWaitingModal(false)}
                            className="w-full mt-4 py-2 bg-gray-100 rounded-lg"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreDetailPage;