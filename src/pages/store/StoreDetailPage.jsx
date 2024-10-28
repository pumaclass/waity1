import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StoreDetail from '../../components/store/StoreDetail';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';

const StoreDetailPage = () => {
    const { storeId } = useParams();
    const [store, setStore] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        const fetchStoreDetail = async () => {
            if (!storeId) return;

            setLoading(true);
            try {
                const response = await fetchAPI(API_ENDPOINTS.store.detail(storeId));
                console.log('Store detail response:', response); // 디버깅용
                setStore(response.data);
            } catch (err) {
                console.error('Failed to fetch store detail:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetail();
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-4 text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <StoreDetail
            store={store}
            isOwner={false} // 필요한 경우 권한 체크 로직 추가
        />
    );
};

export default StoreDetailPage;