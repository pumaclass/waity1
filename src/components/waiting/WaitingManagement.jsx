import React, { useState, useEffect } from 'react';
import { useWaiting } from '../../hooks/useWaiting';

const WaitingManagement = ({ storeId }) => {
    const [waitingList, setWaitingList] = useState([]);
    const { getWaitingList, completeFirstWaiting, clearWaitingFromRank, loading } = useWaiting();
    const [cutline, setCutline] = useState(0);

    // 웨이팅 목록 조회
    const fetchWaitingList = async () => {
        try {
            const response = await getWaitingList(storeId);
            setWaitingList(response);
        } catch (error) {
            console.error('Failed to fetch waiting list:', error);
        }
    };

    // 첫번째 손님 입장 처리
    const handleComplete = async () => {
        try {
            await completeFirstWaiting(storeId);
            await fetchWaitingList();
        } catch (error) {
            console.error('Failed to complete waiting:', error);
            alert('처리에 실패했습니다.');
        }
    };

    // 특정 순번 이후 마감 처리
    const handleClear = async () => {
        if (window.confirm(`${cutline}번 이후의 모든 웨이팅을 마감하시겠습니까?`)) {
            try {
                await clearWaitingFromRank(storeId, cutline);
                await fetchWaitingList();
            } catch (error) {
                console.error('Failed to clear waiting list:', error);
                alert('마감 처리에 실패했습니다.');
            }
        }
    };

    // 주기적으로 목록 갱신
    useEffect(() => {
        fetchWaitingList();
        const interval = setInterval(fetchWaitingList, 10000); // 10초마다 갱신

        return () => clearInterval(interval);
    }, [storeId]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">웨이팅 관리</h2>
                <div className="text-sm text-gray-500">
                    총 {waitingList.totalWaitingNumber}팀 대기 중
                </div>
            </div>

            {/* 웨이팅 목록 */}
            <div className="space-y-4 mb-6">
                {waitingList.userIds?.map((waiting) => (
                    <div
                        key={waiting.userId}
                        className="bg-white p-4 rounded-lg border shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-lg font-medium">
                                    {waiting.rank}번
                                </span>
                                <span className="ml-2 text-gray-500">
                                    #{waiting.userId}
                                </span>
                            </div>
                            {waiting.rank === 1 && (
                                <button
                                    onClick={handleComplete}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    입장
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 마감 처리 */}
            <div className="bg-white p-4 rounded-lg border">
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={cutline}
                        onChange={(e) => setCutline(Number(e.target.value))}
                        min="0"
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="마감할 순번 입력"
                    />
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        마감처리
                    </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    입력한 번호 이후의 모든 웨이팅이 마감됩니다.
                </p>
            </div>
        </div>
    );
};

export default WaitingManagement;