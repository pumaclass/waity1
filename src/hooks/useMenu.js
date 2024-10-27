import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';

export const useMenu = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchedStoreId, setLastFetchedStoreId] = useState(null);

    const fetchMenus = useCallback(async (storeId) => {
        // 이미 해당 storeId의 메뉴를 가져왔다면 스킵
        if (lastFetchedStoreId === storeId || !storeId || loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(API_ENDPOINTS.menu.list(storeId), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('메뉴 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setMenus(data.data || []);
            setLastFetchedStoreId(storeId);

        } catch (err) {
            console.error('Failed to fetch menus:', err);
            setError(err.message);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchOwnerMenus = useCallback(async (storeId) => {
        if (lastFetchedStoreId === storeId || !storeId || loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(API_ENDPOINTS.menu.ownerList(storeId), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('메뉴 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setMenus(data.data || []);
            setLastFetchedStoreId(storeId);

        } catch (err) {
            console.error('Failed to fetch owner menus:', err);
            setError(err.message);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        menus,
        loading,
        error,
        fetchMenus,
        fetchOwnerMenus
    };
};