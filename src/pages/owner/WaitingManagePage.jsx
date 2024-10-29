import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';
import Header from '../../components/common/Header';

const WaitingManagePage = () => {
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cutline, setCutline] = useState('');  // cutline state 추가
    const { user } = useAuthContext();

    // 웨이팅 목록 조회
    const fetchWaitingList = async () => {
        try {
            const response = await fetchAPI(API_ENDPOINTS.waiting.ownerList);
            setWaitingList(response.data);
        } catch (error) {
            console.error('Failed to fetch waiting list:', error);
        } finally {
            setLoading(false);
        }
    };

    // 첫 번째 대기 손님 입장 처리
    const handlePollFirst = async () => {
        try {
            await fetchAPI(API_ENDPOINTS.waiting.poll, {
                method: 'POST'
            });
            fetchWaitingList(); // 목록 새로고침
        } catch (error) {
            console.error('Failed to poll first user:', error);
            alert('처리에 실패했습니다.');
        }
    };

    // 특정 순번 이후 마감 처리
    const handleClearFromRank = async (cutline) => {
        if (!window.confirm(`${cutline}번 이후의 웨이팅을 모두 마감하시겠습니까?`)) return;

        try {
            await fetchAPI(API_ENDPOINTS.waiting.clear, {
                method: 'DELETE',
                params: { cutline }
            });
            fetchWaitingList(); // 목록 새로고침
            alert('마감 처리되었습니다.');
        } catch (error) {
            console.error('Failed to clear waiting list:', error);
            alert('마감 처리에 실패했습니다.');
        }
    };

    // 페이지 로드 시 및 주기적으로 목록 갱신
    useEffect(() => {
        fetchWaitingList();
        const interval = setInterval(fetchWaitingList, 10000); // 10초마다 갱신

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="웨이팅 관리" />

            <div className="p-4 max-w-md mx-auto">
                {/* 웨이팅 통계 */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <h2 className="text-lg font-medium mb-2">현재 웨이팅</h2>
                    <p className="text-2xl font-bold text-blue-600">
                        {waitingList.totalWaitingNumber || 0}팀
                    </p>
                </div>

                {/* 웨이팅 리스트 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                        </div>
                    ) : waitingList.userIds?.length > 0 ? (
                        waitingList.userIds.map((waiting, index) => (
                            <div key={waiting.userId} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-lg font-medium">
                                            {waiting.rank}번
                                        </span>
                                        <span className="ml-2 text-gray-500">
                                            #{waiting.userId}
                                        </span>
                                    </div>
                                    {index === 0 && (
                                        <button
                                            onClick={handlePollFirst}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            입장
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            대기 중인 손님이 없습니다.
                        </div>
                    )}
                </div>

                {/* 마감 처리 */}
                {waitingList.totalWaitingNumber > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-medium mb-4">웨이팅 마감</h3>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0"
                                className="flex-1 px-3 py-2 border rounded-lg"
                                placeholder="마감할 순번 입력"
                                onChange={(e) => setCutline(e.target.value)}
                            />
                            <button
                                onClick={() => handleClearFromRank(cutline)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                마감처리
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            입력한 번호 이후의 모든 웨이팅이 마감됩니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingManagePage;