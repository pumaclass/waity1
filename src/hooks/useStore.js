// hooks/useStore.js
import { useState, useCallback } from 'react';
import { API_ENDPOINTS, fetchAPI } from '../constants/api';

// 공통으로 사용할 유틸리티 함수
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

// 점주용 Store Hook
export const useOwnerStore = () => {
    const [stores, setStores] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStores = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.myStore);
            const storeList = response?.data?.content || [];

            const enhancedStores = storeList.map(store => ({
                ...store,
                rating: store.rating || 0,
                reviewCount: store.reviewCount || 0,
                isOpen: isStoreOpen(store.openTime, store.closeTime),
                image: store.image || '/placeholder-store.jpg',
                user: store.userOneResponseDto,
                districtCategory: store.districtCategory || null
            }));

            setStores(enhancedStores);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(err.message);
            setStores([]);
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
            const storeData = response.data;
            const enhancedStore = {
                ...storeData,
                rating: storeData.rating || 0,
                reviewCount: storeData.reviewCount || 0,
                isOpen: isStoreOpen(storeData.openTime, storeData.closeTime),
                image: storeData.image || '/placeholder-store.jpg',
                user: storeData.userOneResponseDto,
                districtCategory: storeData.districtCategory || null
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

    const createStore = useCallback(async (storeData) => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.create, {
                method: 'POST',
                body: JSON.stringify(storeData)
            });
            return response.data;
        } catch (err) {
            console.error('Failed to create store:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const updateStore = useCallback(async (storeId, storeData) => {
        if (!storeId || loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.update(storeId), {
                method: 'PUT',
                body: JSON.stringify(storeData)
            });
            return response.data;
        } catch (err) {
            console.error('Failed to update store:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const deleteStore = useCallback(async (storeId) => {
        if (!storeId || loading) return;
        setLoading(true);
        setError(null);

        try {
            await fetchAPI(API_ENDPOINTS.store.delete(storeId), {
                method: 'DELETE'
            });
            return true;
        } catch (err) {
            console.error('Failed to delete store:', err);
            setError(err.message);
            throw err;
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
        createStore,
        updateStore,
        deleteStore,
        setStore
    };
};

// 사용자용 Store Hook
export const useUserStore = () => {
    const [stores, setStores] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const searchStores = async (keyword, filters = {}) => {
        try {
            console.log(API_ENDPOINTS.search.search)
            // POST 요청으로 keyword와 filters를 RequestBody로 전송
            const response = await fetchAPI(API_ENDPOINTS.search.search, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    keyword,
                    filters: {
                        districtCategories: filters.districtCategories || [],
                        cuisineCategories: filters.cuisineCategories || []
                    },
                    size: 10 // 검색 결과 수 제한
                })
            });
            return response.data.stores;
        } catch (error) {
            console.error('Search API Error:', error);
            throw error;
        }
    };
    

    const fetchStores = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI(API_ENDPOINTS.store.list);
            const storeList = response?.data?.content || [];

            const enhancedStores = storeList.map(store => ({
                ...store,
                rating: store.rating || 0,
                reviewCount: store.reviewCount || 0,
                distance: store.distance || null,
                isOpen: isStoreOpen(store.openTime, store.closeTime),
                image: store.image || '/placeholder-store.jpg',
                user: store.userOneResponseDto,
                districtCategory: store.districtCategory || null
            }));

            setStores(enhancedStores);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(err.message);
            setStores([]);
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
            const storeData = response.data;
            const enhancedStore = {
                ...storeData,
                rating: storeData.rating || 0,
                reviewCount: storeData.reviewCount || 0,
                isOpen: isStoreOpen(storeData.openTime, storeData.closeTime),
                image: storeData.image || '/placeholder-store.jpg',
                user: storeData.userOneResponseDto,
                districtCategory: storeData.districtCategory || null
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
        searchStores,
        fetchStores,
        fetchStoreDetail,
        setStore
    };
};