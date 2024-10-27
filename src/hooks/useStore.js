import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';

export const useStore = () => {
    const [stores, setStores] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStores = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.store.list, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('매장 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setStores(data.data || []);

        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchStoreDetail = useCallback(async (storeId) => {
        if (!storeId) return;
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Fetching store detail for ID:', storeId); // 디버깅용
            const response = await fetch(API_ENDPOINTS.store.detail(storeId), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('매장 정보를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            console.log('Store detail data:', data); // 디버깅용

            setStore(data.data || null);
            setError(null);

        } catch (err) {
            console.error('Failed to fetch store detail:', err);
            setError(err.message);
            setStore(null);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        stores,
        store,
        loading,
        error,
        fetchStores,
        fetchStoreDetail,
    };
};