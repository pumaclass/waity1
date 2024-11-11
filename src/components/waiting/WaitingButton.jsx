import { useState, useEffect, useCallback, useRef } from 'react';
import { useWaiting } from '../../hooks/useWaiting';
import { useAuthContext } from '../../contexts/AuthContext';
import WaitingModal from './WaitingModal';

const WaitingButton = ({ storeId }) => {
    const { user } = useAuthContext();
    const { addWaiting, cancelWaiting, connectWaiting, checkWaitingStatus } = useWaiting();

    const [isWaiting, setIsWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rank, setRank] = useState(null);
    const eventSourceRef = useRef(null);
    const initialCheckDoneRef = useRef(false);

    // EventSource 메시지 핸들러
    const handleEventSourceMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.data);

            if (data === 'closed' || data === '대기열 마감') {
                setIsWaiting(false);
                setShowModal(false);
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                }
                alert('웨이팅이 마감되었습니다.');
                return;
            }

            if (data.userIds?.length > 0) {
                const userInfo = data.userIds.find(u => u.userId === user?.id);
                if (userInfo) {
                    setRank(userInfo.rank);
                }
            }
        } catch (error) {
            console.error('Failed to parse SSE message:', error);
        }
    }, [user?.id]);

    // EventSource 연결 함수
    const initEventSource = useCallback(() => {
        try {
            // 이전 연결 정리
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const es = connectWaiting(storeId);
            es.onmessage = handleEventSourceMessage;
            es.onerror = () => {
                es.close();
            };
            eventSourceRef.current = es;
        } catch (error) {
            console.error('Failed to connect EventSource:', error);
        }
    }, [storeId, connectWaiting, handleEventSourceMessage]);

    // 초기 상태 체크 - 한 번만 실행
    useEffect(() => {
        if (!user || !storeId || initialCheckDoneRef.current) return;

        const checkInitialStatus = async () => {
            try {
                const status = await checkWaitingStatus(storeId);
                setIsWaiting(status.isWaiting);
                if (status.isWaiting) {
                    setRank(status.rank);
                    initEventSource();
                }
                initialCheckDoneRef.current = true;
            } catch (error) {
                console.error('Failed to check status:', error);
            }
        };

        checkInitialStatus();

        // cleanup
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [user, storeId, checkWaitingStatus, initEventSource]);

    const handleWaitingJoin = async () => {
        if (!user) {
            alert('웨이팅 신청을 위해 로그인이 필요합니다.');
            return;
        }

        try {
            await addWaiting(storeId);
            setIsWaiting(true);
            setShowModal(true);
            initEventSource();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleWaitingCancel = async () => {
        try {
            await cancelWaiting(storeId);
            setIsWaiting(false);
            setRank(null);
            setShowModal(false);

            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="w-full p-4 pb-safe">
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
        </div>
    );
};

export default WaitingButton;