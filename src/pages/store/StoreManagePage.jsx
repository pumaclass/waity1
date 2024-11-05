import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Clock, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import StoreSelector from '../../components/store/StoreSelector';
import MenuTabContent from '../../components/menu/MenuTabContent';
import WaitingManagement from '../../components/waiting/WaitingManagement';
import { useStore } from '../../hooks/useStore';
import { useWaiting } from '../../hooks/useWaiting';

const StoreManagePage = () => {
    const navigate = useNavigate();
    const { stores, fetchStores, loading: storeLoading, error: storeError } = useStore();
    const { getWaitingList } = useWaiting();

    const [selectedTab, setSelectedTab] = useState('overview');
    const [selectedStore, setSelectedStore] = useState(null);
    const [todayStats, setTodayStats] = useState({
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

    // 웨이팅 통계 조회
    useEffect(() => {
        const fetchWaitingStats = async () => {
            if (!selectedStore) return;

            try {
                const waitingData = await getWaitingList(selectedStore.id);
                setTodayStats(prev => ({
                    ...prev,
                    waiting: waitingData.totalWaitingNumber || 0
                }));
            } catch (error) {
                console.error('Failed to fetch waiting stats:', error);
            }
        };

        fetchWaitingStats();
        const interval = setInterval(fetchWaitingStats, 10000);

        return () => clearInterval(interval);
    }, [selectedStore]);

    const tabs = [
        { id: 'overview', label: '개요' },
        { id: 'reservations', label: '예약' },
        { id: 'waiting', label: '웨이팅' },
        { id: 'menu', label: '메뉴' }
    ];

    // 매장이 선택되지 않았을 때 보여줄 컴포넌트
    if (!selectedStore) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="매장 관리"
                    rightButton={
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <Settings className="w-6 h-6 text-gray-700" />
                        </button>
                    }
                />
                <div className="pt-14 p-4">
                    <StoreSelector
                        stores={stores}
                        selectedStore={selectedStore}
                        onSelect={setSelectedStore}
                        loading={storeLoading}
                        error={storeError}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="매장 관리"
                subtitle={selectedStore.name}
                rightButton={
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <Settings className="w-6 h-6 text-gray-700" />
                    </button>
                }
            />
            <div className="pt-14">
                {/* 탭 메뉴 */}
                <div className="bg-white border-b sticky top-14 z-10">
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
                                {tab.id === 'waiting' && todayStats.waiting > 0 && (
                                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                                        {todayStats.waiting}
                                    </span>
                                )}
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
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm text-gray-500 mb-2">예약</h3>
                                    <p className="text-2xl font-bold">{todayStats.reservations}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm text-gray-500 mb-2">웨이팅</h3>
                                    <p className="text-2xl font-bold text-blue-600">{todayStats.waiting}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm text-gray-500 mb-2">완료</h3>
                                    <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm text-gray-500 mb-2">취소</h3>
                                    <p className="text-2xl font-bold text-red-600">{todayStats.canceled}</p>
                                </div>
                            </div>

                            {/* 빠른 링크 */}
                            <div className="bg-white rounded-lg divide-y shadow-sm">
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

                    {selectedTab === 'menu' && (
                        <MenuTabContent
                            storeId={selectedStore.id}
                            key={selectedStore.id}
                        />
                    )}

                    {selectedTab === 'waiting' && (
                        <WaitingManagement
                            storeId={selectedStore.id}
                            onStatsUpdate={(total) => setTodayStats(prev => ({
                                ...prev,
                                waiting: total
                            }))}
                        />
                    )}

                    {selectedTab === 'reservations' && (
                        <div className="p-4 text-center text-gray-500">
                            준비 중입니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreManagePage;