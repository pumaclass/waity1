import React, { useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useWaiting } from '../../hooks/useWaiting';
import { useAuthContext } from '../../contexts/AuthContext';

const WaitingModal = ({ isOpen, onClose, rank, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                <h2 className="text-xl font-bold text-center mb-6">웨이팅 현황</h2>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-lg font-medium text-center mb-2">현재 대기 순번</p>
                    <p className="text-blue-900 text-4xl font-bold text-center">{rank}번</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onCancel}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        웨이팅 취소하기
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

const WaitingButton = ({ storeId }) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rank, setRank] = useState(null);
    const [eventSource, setEventSource] = useState(null);
    const { addWaiting, cancelWaiting, connectWaiting, checkWaitingStatus } = useWaiting();
    const { user } = useAuthContext();

    const connectToWaitingQueue = async () => {
        if (eventSource) {
            eventSource.close();
        }

        try {
            const es = await connectWaiting(storeId);
            console.log('EventSource connected');

            es.onmessage = (event) => {
                try {
                    console.log('Raw event data:', event.data);
                    const data = JSON.parse(event.data);
                    console.log('Parsed waiting data:', data);

                    if (data === 'closed' || data === '대기열 마감') {
                        setIsWaiting(false);
                        setShowModal(false);
                        es.close();
                        alert('웨이팅이 마감되었습니다.');
                        return;
                    }
                    setRank(data);
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            };

            es.onopen = () => {
                console.log('EventSource opened');
            };

            es.onerror = (error) => {
                console.error('EventSource error:', error);
                if (es.readyState === EventSourcePolyfill.CLOSED) {
                    es.close();
                    setTimeout(() => {
                        connectToWaitingQueue();
                    }, 3000);
                }
            };

            setEventSource(es);
        } catch (error) {
            console.error('Connection failed:', error);
            if (!user) {
                alert('웨이팅 확인을 위해 로그인이 필요합니다.');
            }
        }
    };

    const handleWaitingJoin = async () => {
        if (!user) {
            alert('웨이팅 신청을 위해 로그인이 필요합니다.');
            return;
        }

        try {
            const result = await addWaiting(storeId);
            console.log('Waiting join result:', result);

            setIsWaiting(true);
            setRank(result.rank);
            setShowModal(true);

            // SSE 연결은 상태 업데이트 후에 시도
            setTimeout(() => {
                connectToWaitingQueue();
            }, 100);
        } catch (error) {
            console.error('Failed to join waiting queue:', error);
            alert(error.message);
        }
    };

    const handleWaitingCancel = async () => {
        try {
            await cancelWaiting(storeId);
            setIsWaiting(false);
            setRank(null);
            setShowModal(false);
            if (eventSource) {
                eventSource.close();
                setEventSource(null);
            }
        } catch (error) {
            console.error('Failed to cancel waiting:', error);
            alert(error.message);
        }
    };

    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return;
            try {
                const isWaitingStatus = await checkWaitingStatus(storeId);
                setIsWaiting(isWaitingStatus);
                if (isWaitingStatus) {
                    connectToWaitingQueue();
                }
            } catch (error) {
                console.error('Failed to check waiting status:', error);
            }
        };

        checkStatus();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [user, storeId]);

    return (
        <>
            <button
                onClick={isWaiting ? () => setShowModal(true) : handleWaitingJoin}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
                {isWaiting ? '웨이팅 현황 확인하기' : '웨이팅 신청'}
            </button>

            <WaitingModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                rank={rank}
                onCancel={handleWaitingCancel}
            />
        </>
    );
};

export default WaitingButton;