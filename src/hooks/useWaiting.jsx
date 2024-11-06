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
                heartbeatTimeout: 300000,
                connectionTimeout: 60000,
                retries: 3,
                reconnectInterval: 3000
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
                method: 'GET'
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

    const getWaitingList = async (storeId) => {
        setLoading(true);
        try {
            const response = await fetchAPI(API_ENDPOINTS.waiting.ownerList(storeId), {
                method: 'GET'
            });
            return response.data;
        } catch (err) {
            throw new Error('웨이팅 목록 조회에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const completeFirstWaiting = async (storeId) => {
        setLoading(true);
        try {
            await fetchAPI(API_ENDPOINTS.waiting.poll(storeId), {
                method: 'POST'
            });
        } catch (err) {
            throw new Error('웨이팅 처리에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const clearWaitingFromRank = async (storeId, cutline) => {
        setLoading(true);
        try {
            await fetchAPI(`${API_ENDPOINTS.waiting.clear(storeId)}?cutline=${cutline}`, {
                method: 'DELETE'
            });
        } catch (err) {
            throw new Error('웨이팅 마감 처리에 실패했습니다.');
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
        checkWaitingStatus,
        getWaitingList,
        completeFirstWaiting,
        clearWaitingFromRank
    };
};