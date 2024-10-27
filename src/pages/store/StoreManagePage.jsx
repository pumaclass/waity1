import { useState, useEffect, useCallback } from 'react';
import { Settings, ChevronRight, Clock, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import { useStore } from '../../hooks/useStore';

const INITIAL_STATS = {
    reservations: 0,
    waiting: 0,
    completed: 0,
    canceled: 0
};

const ReservationCard = ({ reservation, onAccept, onReject }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-medium">{reservation.customerName}</h3>
                    <p className="text-sm text-gray-500">
                        {reservation.peopleCount}인 · {reservation.date} {reservation.time}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                    reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : reservation.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                }`}>
                    {reservation.status === 'pending' ? '대기중' :
                        reservation.status === 'accepted' ? '승인됨' : '거절됨'}
                </span>
            </div>

            {reservation.status === 'pending' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onReject(reservation.id)}
                        className="flex-1 py-2 text-sm border border-gray-300 rounded text-gray-700"
                    >
                        거절
                    </button>
                    <button
                        onClick={() => onAccept(reservation.id)}
                        className="flex-1 py-2 text-sm bg-blue-500 text-white rounded"
                    >
                        승인
                    </button>
                </div>
            )}
        </div>
    );
};

const WaitingCard = ({ waiting }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
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
    );
};

const StoreManagePage = () => {
    const [selectedTab, setSelectedTab] = useState('overview');
    const { store, fetchMyStore } = useStore();
    const [todayStats] = useState(INITIAL_STATS);

    useEffect(() => {
        fetchMyStore();
    }, [fetchMyStore]);

    const tabs = [
        { id: 'overview', label: '개요' },
        { id: 'reservations', label: '예약' },
        { id: 'waiting', label: '웨이팅' },
        { id: 'menu', label: '메뉴' }
    ];

    const handleAcceptReservation = useCallback(async (reservationId) => {
        try {
            // API 호출
            console.log('Accepting reservation:', reservationId);
        } catch (error) {
            console.error('Failed to accept reservation:', error);
        }
    }, []);

    const handleRejectReservation = useCallback(async (reservationId) => {
        try {
            // API 호출
            console.log('Rejecting reservation:', reservationId);
        } catch (error) {
            console.error('Failed to reject reservation:', error);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="매장 관리"
                showBack={false}
                rightButton={
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Settings className="w-6 h-6 text-gray-700" />
                    </button>
                }
            />

            <div className="pt-14 pb-safe">
                {/* 매장 기본 정보 */}
                <div className="bg-white p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-lg">{store?.title}</h2>
                            <p className="text-sm text-gray-600">{store?.address}</p>
                        </div>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
                            영업 중
                        </button>
                    </div>
                </div>

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
                <div className="p-4">
                    {selectedTab === 'overview' && (
                        <div className="space-y-4">
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
                                <button className="w-full flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>영업 시간 설정</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>테이블 관리</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'reservations' && store?.reservations?.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onAccept={handleAcceptReservation}
                            onReject={handleRejectReservation}
                        />
                    ))}

                    {selectedTab === 'waiting' && store?.waitingList?.map(waiting => (
                        <WaitingCard
                            key={waiting.id}
                            waiting={waiting}
                        />
                    ))}

                    {selectedTab === 'menu' && (
                        <div>
                            {/* 메뉴 관리 컴포넌트 */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreManagePage;