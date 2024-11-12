// pages/store/UserStoreListPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../../components/common/Header';
import StoreCard from '../../components/store/StoreCard';
import { useUserStore } from '../../hooks/useStore';

const UserStoreListPage = () => {
    const navigate = useNavigate();
    const { stores, loading, error, fetchStores } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [initialized, setInitialized] = useState(false);

    // 초기 데이터 로드 - 한 번만 실행
    useEffect(() => {
        if (!initialized) {
            fetchStores();
            setInitialized(true);
        }
    }, [initialized]); // fetchStores 제거

    const filterStores = useCallback((storeList) => {
        if (!Array.isArray(storeList)) return [];

        return storeList.filter(store => {
            if (!store || store.isDeleted) return false;
            return store.title?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/stores/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="웨이티"
                showBack={false}
                showMenu={true}
            />

            <div className="pt-14">
                {/* 검색 영역 */}
                <div className="sticky top-14 bg-white border-b z-10">
                    <form onSubmit={handleSearch} className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="맛집을 검색해보세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </div>

                {/* 매장 목록 */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">
                            {error}
                        </div>
                    ) : filterStores(stores).length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            표시할 매장이 없습니다
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filterStores(stores).map(store => (
                                <StoreCard
                                    key={store.id}
                                    store={store}
                                    onClick={() => navigate(`/stores/${store.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStoreListPage;