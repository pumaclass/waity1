// src/components/waiting/WaitingButton.jsx
import React, { useState, useEffect } from 'react';
import { useWaiting } from '../../hooks/useWaiting';
import { useAuthContext } from '../../contexts/AuthContext';

const WaitingButton = ({ storeId }) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [rank, setRank] = useState(null);
    const [eventSource, setEventSource] = useState(null);
    const { addWaiting, cancelWaiting, connectWaiting } = useWaiting();
    const { user } = useAuthContext();

    const connectToWaitingQueue = async () => {
        try {
            const es = await connectWaiting(storeId);

            es.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Received waiting data:', data);

                    if (data === 'closed' || data === '대기열 마감') {
                        setIsWaiting(false);
                        es.close();
                        alert('웨이팅이 마감되었습니다.');
                        return;
                    }
                    setRank(data);
                    setIsWaiting(true);
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            };

            es.onerror = (error) => {
                console.error('EventSource error:', error);
                es.close();
                setIsWaiting(false);
                setEventSource(null);
            };

            setEventSource(es);
        } catch (error) {
            console.error('Connection failed:', error);
            setIsWaiting(false);
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
            await addWaiting(storeId);
            await connectToWaitingQueue();
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
        if (user) {
            connectToWaitingQueue();
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [user, storeId]);

    if (isWaiting) {
        return (
            <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-center">
                    <p className="text-blue-800 text-lg font-medium mb-2">현재 대기 순번</p>
                    <p className="text-blue-900 text-3xl font-bold mb-4">{rank}번</p>
                    <button
                        onClick={handleWaitingCancel}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        웨이팅 취소
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleWaitingJoin}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
            웨이팅 신청
        </button>
    );
};

export default WaitingButton;