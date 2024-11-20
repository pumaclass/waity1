// hooks/useStore.js
import { useState, useCallback } from 'react';
import { API_ENDPOINTS, fetchAPI } from '../constants/api';
import { STORE_PLACEHOLDER } from '../constants/images';

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

const processStoreData = (store) => ({
    ...store,
    rating: store.rating || 0,
    reviewCount: store.reviewCount || 0,
    isOpen: isStoreOpen(store.openTime, store.closeTime),
    image: store.image || STORE_PLACEHOLDER,  // 이미지 기본값 처리
    user: store.userOneResponseDto,
    districtCategory: store.districtCategory || null
});

export const useOwnerStore = () => {
    const [stores, setStores] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStores = useCallback(async () => {
        if (loading) return;

        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.list);
            const storeList = response.data?.content || [];

            // 각 스토어의 좋아요 수를 가져오기
            const storesWithLikes = await Promise.all(
                storeList.map(async store => {
                    try {
                        const likeResponse = await fetchAPI(API_ENDPOINTS.store.getLikeCount(store.id));
                        return {
                            ...processStoreData(store),
                            distance: store.distance || null,
                            likeCount: likeResponse.data.storeLikeCount
                        };
                    } catch (error) {
                        console.error(`Failed to fetch like count for store ${store.id}:`, error);
                        return {
                            ...processStoreData(store),
                            distance: store.distance || null,
                            likeCount: 0
                        };
                    }
                })
            );

            setStores(storesWithLikes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const fetchStoreDetail = async (storeId) => {
        if (!storeId) return;

        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
            setStore(processStoreData(response.data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createStore = async (storeData) => {
        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.create, {
                method: 'POST',
                body: JSON.stringify(storeData)
            });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateStore = async (storeId, storeData) => {
        if (!storeId) return;

        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.update(storeId), {
                method: 'PUT',
                body: JSON.stringify(storeData)
            });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteStore = async (storeId) => {
        if (!storeId) return;

        try {
            setLoading(true);
            await fetchAPI(API_ENDPOINTS.store.delete(storeId), {
                method: 'DELETE'
            });
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

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

export const useUserStore = () => {
    const [stores, setStores] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState([]);

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

        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.list);
            const storeList = response.data?.content || [];
            setStores(storeList.map(store => ({
                ...processStoreData(store),
                distance: store.distance || null
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const fetchStoreDetail = async (storeId) => {
        if (!storeId) return;

        try {
            setLoading(true);
            const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
            setStore(processStoreData(response.data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleStoreLike = async (storeId) => {
        try {
            console.log('toggleStoreLike 호출:', storeId);

            // 좋아요 토글
            const toggleResponse = await fetchAPI(API_ENDPOINTS.store.toggleLike(storeId), {
                method: 'PATCH',
            });
            console.log('좋아요 토글 응답:', toggleResponse);

            // 좋아요 수 조회
            const countResponse = await fetchAPI(API_ENDPOINTS.store.getLikeCount(storeId));
            console.log('좋아요 수 응답:', countResponse);

            // 상태 업데이트
            setStores(prev => prev.map(store => {
                if (store.id === storeId) {
                    return {
                        ...store,
                        liked: toggleResponse.data.storeLike,
                        likeCount: countResponse.data.storeLikeCount
                    };
                }
                return store;
            }));

            return {
                isLiked: toggleResponse.data.storeLike,
                likeCount: countResponse.data.storeLikeCount
            };
        } catch (error) {
            console.error('toggleStoreLike 에러:', error);
            throw error;
        }
    };

    const fetchLikedStores = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetchAPI(
                `${API_ENDPOINTS.store.getLikedStores}?page=${page}&size=10`
            );
            setLikes(response.data.content);
            return response.data;
        } catch (error) {
            setError('좋아요 목록을 불러오는데 실패했습니다.');
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getStoreLikeCount = async (storeId) => {
        try {
            const response = await fetchAPI(API_ENDPOINTS.store.getLikeCount(storeId));
            return response.data.storeLikeCount;
        } catch (error) {
            console.error('좋아요 수 조회 중 오류가 발생했습니다:', error);
            throw error;
        }
    };

    return {
        stores,
        store,
        likes,
        loading,
        error,
        searchStores,
        fetchStores,
        fetchStoreDetail,
        setStore,
        toggleStoreLike,
        fetchLikedStores,
        getStoreLikeCount
    };
};