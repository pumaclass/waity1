import { useState, useCallback } from 'react';
import { API_ENDPOINTS, fetchAPI } from '../constants/api';

export const useStore = () => {
    const [stores, setStores] = useState([]);
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

            const enhancedStores = response.data.map(store => ({
                ...store,
                rating: 0,
                reviewCount: 0,
                distance: null,
                isOpen: isStoreOpen(store.openTime, store.closeTime),
                image: store.image || '/placeholder-store.jpg'
            }));

            setStores(enhancedStores);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const fetchStoreDetail = useCallback(async (storeId) => {
        if (!storeId || loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
            console.log('Store Detail Response:', response);

            const enhancedStore = {
                ...response.data,
                rating: 0,
                reviewCount: 0,
                isOpen: isStoreOpen(response.data.openTime, response.data.closeTime),
                image: response.data.image || '/placeholder-store.jpg'
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

    const fetchMyStore = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.myStore);
            const enhancedStore = {
                ...response.data,
                rating: 0,
                reviewCount: 0,
                isOpen: isStoreOpen(response.data.openTime, response.data.closeTime),
                image: response.data.image || '/placeholder-store.jpg'
            };

            setStore(enhancedStore);
        } catch (err) {
            console.error('Failed to fetch my store:', err);
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
        fetchMyStore
    };
};