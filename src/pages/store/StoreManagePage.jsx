import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Clock, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import StoreSelector from '../../components/store/StoreSelector';
import MenuTabContent from '../../components/menu/MenuTabContent';
import { useStore } from '../../hooks/useStore';

const StoreManagePage = () => {
    const navigate = useNavigate();
    const { stores, fetchStores, loading: storeLoading, error: storeError } = useStore();

    const [selectedTab, setSelectedTab] = useState('overview');
    const [selectedStore, setSelectedStore] = useState(null);
    const [todayStats] = useState({
        reservations: 0,
        waiting: 0,
        completed: 0,
        canceled: 0
    });

    useEffect(() => {
        if (!stores.length) {
            fetchStores();
        }
    }, []);

    const tabs = [
        { id: 'overview', label: '개요' },
        { id: 'reservations', label: '예약' },
        { id: 'waiting', label: '웨이팅' },
        { id: 'menu', label: '메뉴' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="매장 관리"
                subtitle={selectedStore?.title}
                rightButton={
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <Settings className="w-6 h-6 text-gray-700" />
                    </button>
                }
            />
            <div className="pt-14 pb-safe">
                {/* 매장 선택 */}
                <div className="p-4 border-b">
                    <StoreSelector
                        stores={stores}
                        selectedStore={selectedStore}
                        onSelect={setSelectedStore}
                        loading={storeLoading}
                        error={storeError}
                    />
                </div>

                {selectedStore && (
                    <>
                        {/* 탭 메뉴 */}
                        <div className="bg-white border-b">
                            <div className="flex">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`flex-1 py-4 text-sm font-medium border-b-2 ${
                                            selectedTab === tab.id
                                                ? 'text-blue-600 border-blue-600'
                                                : 'text-gray-500 border-transparent'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 탭 콘텐츠 */}
                        <div>
                            {selectedTab === 'overview' && (
                                <div className="p-4 space-y-4">
                                    {/* 오늘의 통계 */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <h3 className="text-sm text-gray-500 mb-2">예약</h3>
                                            <p className="text-2xl font-bold">{todayStats.reservations}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h3 className="text-sm text-gray-500 mb-2">웨이팅</h3>
                                            <p className="text-2xl font-bold">{todayStats.waiting}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h3 className="text-sm text-gray-500 mb-2">완료</h3>
                                            <p className="text-2xl font-bold text-green-600">
                                                {todayStats.completed}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h3 className="text-sm text-gray-500 mb-2">취소</h3>
                                            <p className="text-2xl font-bold text-red-600">
                                                {todayStats.canceled}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 빠른 링크 */}
                                    <div className="bg-white rounded-lg divide-y">
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                                <span>영업 시간 설정</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 text-gray-400 mr-3" />
                                                <span>테이블 관리</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'menu' && selectedStore && (
                                <MenuTabContent
                                    storeId={selectedStore.id}
                                    key={selectedStore.id}  // key 추가하여 store 변경 시 컴포넌트 리마운트
                                />
                            )}

                            {selectedTab === 'reservations' && (
                                <div className="p-4 space-y-4">
                                    {selectedStore?.reservations?.length > 0 ? (
                                        selectedStore.reservations.map(reservation => (
                                            <div key={reservation.id} className="bg-white p-4 rounded-lg shadow-sm">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{reservation.customerName}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {reservation.peopleCount}인 · {reservation.date} {reservation.time}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        reservation.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {reservation.status === 'pending' ? '대기중' : '확정'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            예약 내역이 없습니다.
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedTab === 'waiting' && (
                                <div className="p-4 space-y-4">
                                    {selectedStore?.waitingList?.length > 0 ? (
                                        selectedStore.waitingList.map(waiting => (
                                            <div key={waiting.id} className="bg-white p-4 rounded-lg shadow-sm">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{waiting.customerName}</h3>
                                                        <p className="text-sm text-gray-500">{waiting.peopleCount}인</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-lg font-bold text-blue-600">
                                                            {waiting.number}번
                                                        </span>
                                                        <p className="text-xs text-gray-500">
                                                            {waiting.waitingSince} 대기
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            대기 중인 고객이 없습니다.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreManagePage;