import { useState } from 'react';
import { API_ENDPOINTS, fetchAPI } from '../constants/api';
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
export const useWaiting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const connectWaiting = async (storeId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }

        const EventSource = EventSourcePolyfill || NativeEventSource;
        const eventSource = new EventSource(
            `${API_ENDPOINTS.waiting.connect(storeId)}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': token
                },
                heartbeatTimeout: 300000,    // 5분으로 증가
                connectionTimeout: 60000,     // 1분
                retries: 3,                   // 재시도 횟수
                reconnectInterval: 3000       // 재연결 간격 3초
            }
        );

        return eventSource;
    };
    const addWaiting = async (storeId) => {
        setLoading(true);
        try {
            const response = await fetchAPI(API_ENDPOINTS.waiting.add(storeId), {
                method: 'POST'
            });
            return response.data;
        } catch (err) {
            throw new Error('웨이팅 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const checkWaitingStatus = async (storeId) => {
        setLoading(true);
        try {
            const response = await fetchAPI(API_ENDPOINTS.waiting.check(storeId), {
                method: 'GET'  // GET으로 변경
            });
            return response.data.isWaiting;
        } catch (err) {
            throw new Error('웨이팅 상태 확인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const cancelWaiting = async (storeId) => {
        setLoading(true);
        try {
            await fetchAPI(API_ENDPOINTS.waiting.cancel(storeId), {
                method: 'DELETE'
            });
        } catch (err) {
            throw new Error('웨이팅 취소에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };
    return {
        loading,
        error,
        connectWaiting,
        addWaiting,
        cancelWaiting,
        checkWaitingStatus
    };
};