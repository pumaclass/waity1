import { useState, useCallback } from 'react';
import { API_ENDPOINTS, fetchAPI } from '../constants/api';

export const useStore = () => {
    const [stores, setStores] = useState([]); // 빈 배열로 초기화
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isStoreOpen = (openTime, closeTime) => {
        if (!openTime || !closeTime) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        const openMinutes = openHour * 60 + openMinute;
        const closeMinutes = closeHour * 60 + closeMinute;

        return currentTime >= openMinutes && currentTime <= closeMinutes;
    };

    const fetchStores = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.list);
            console.log('Store API Response:', response);

            // response.data.content에서 매장 목록 가져오기
            const storeList = response?.data?.content || [];

            const enhancedStores = storeList.map(store => ({
                ...store,
                rating: store.rating || 0,
                reviewCount: store.reviewCount || 0,
                distance: store.distance || null,
                isOpen: isStoreOpen(store.openTime, store.closeTime),
                image: store.image || '/placeholder-store.jpg'
            }));

            setStores(enhancedStores);

            // 매장이 있고 아직 선택된 매장이 없으면 첫 번째 매장 선택
            if (enhancedStores.length > 0 && !store) {
                setStore(enhancedStores[0]);
            }
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(err.message);
            setStores([]); // 에러 시 빈 배열로 설정
        } finally {
            setLoading(false);
        }
    }, [loading, store]);

    const fetchStoreDetail = useCallback(async (storeId) => {
        if (!storeId || loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
            console.log('Store Detail Response:', response);

            const storeData = response.data || response;
            const enhancedStore = {
                ...storeData,
                rating: storeData.rating || 0,
                reviewCount: storeData.reviewCount || 0,
                isOpen: isStoreOpen(storeData.openTime, storeData.closeTime),
                image: storeData.image || '/placeholder-store.jpg'
            };

            setStore(enhancedStore);
        } catch (err) {
            console.error('Failed to fetch store detail:', err);
            setError(err.message);
            setStore(null);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return {
        stores,
        store,
        loading,
        error,
        fetchStores,
        fetchStoreDetail,
        setStore
    };
};