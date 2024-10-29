import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Phone, Users, Share2 } from 'lucide-react';
import Header from '../../components/common/Header';
import MenuList from '../../components/menu/MenuList';
import ReviewList from '../../components/review/ReviewList';
import NearbyStores from '../../components/store/NearbyStores';
import Rating from '../../components/common/Rating';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';
import { STORE_PLACEHOLDER } from '../../constants/images';
import WaitingButton from '../../components/waiting/WaitingButton';


const StoreDetailPage = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [showReservationModal, setShowReservationModal] = useState(false);

    useEffect(() => {
        const fetchStoreDetail = async () => {
            if (!storeId) return;

            setLoading(true);
            try {
                const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
                console.log('Store Detail Response:', response);

                if (response.data) {
                    setStore(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch store detail:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetail();
    }, [storeId]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: store?.title,
                text: store?.description,
                url: window.location.href
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-4 text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    if (!store) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={store.title}
                rightButton={
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full">
                        <Share2 className="w-6 h-6 text-gray-700" />
                    </button>
                }
            />

            <div className="pb-safe">
                {/* 매장 이미지 */}
                <div className="relative aspect-video">
                    <img
                        src={store.image || STORE_PLACEHOLDER}
                        alt={store.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 매장 정보 */}
                <div className="bg-white px-4 py-5">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-xl font-bold text-gray-900">{store.title}</h1>
                        <div className="flex items-center">
                            <Rating value={store.rating} readonly size="sm" showCount count={store.reviewCount} />
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{store.description}</p>

                    <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">영업 시간</p>
                                <p className="text-sm">
                                    {store.openTime} - {store.closeTime}
                                    {store.lastOrder && (
                                        <span className="text-red-500">
                                            <br />라스트오더 {store.lastOrder}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">테이블</p>
                                <p className="text-sm">
                                    총 {store.tableCount}개 / 예약 가능 {store.reservationTableCount}개
                                    {store.turnover && (
                                        <span className="text-gray-500">
                                            <br />평균 {store.turnover} 소요
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">주소</p>
                                <p className="text-sm">{store.address}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">전화번호</p>
                                <a href={`tel:${store.phoneNumber}`} className="text-sm text-blue-500">
                                    {store.phoneNumber}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 웨이팅 버튼 추가 */}
                <div className="flex items-center text-gray-600">
                    <div className="w-full">
                        <WaitingButton storeId={storeId} />
                    </div>
                </div>

                {/* 탭 메뉴 */}
                <div className="sticky top-14 bg-white border-b z-40">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'menu'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent'
                            }`}
                        >
                            메뉴
                        </button>
                        <button
                            onClick={() => setActiveTab('review')}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'review'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent'
                            }`}
                        >
                            리뷰
                        </button>
                        <button
                            onClick={() => setActiveTab('nearby')}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'nearby'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent'
                            }`}
                        >
                            주변맛집
                        </button>
                    </div>
                </div>

                {/* 탭 컨텐츠 */}
                <div>
                    {activeTab === 'menu' ? (
                        <MenuList storeId={storeId} isOwner={false} />
                    ) : activeTab === 'review' ? (
                        <ReviewList storeId={storeId} />
                    ) : (
                        <NearbyStores store={store} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreDetailPage;