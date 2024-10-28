import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import StoreList from '../../components/store/StoreList';
import Header from '../../components/common/Header';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';

const StoreListPage = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const categories = ['전체', '한식', '중식', '일식', '양식', '카페'];

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const response = await fetchAPI(API_ENDPOINTS.store.list);
                console.log('Store API Response:', response); // 디버깅용

                if (!response.data.empty) {
                    setStores(response.data.content);
                }
            } catch (err) {
                console.error('Failed to fetch stores:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const filterStores = (stores) => {
        if (!Array.isArray(stores)) return [];

        return stores.filter(store => {
            if (!store) return false;

            const matchesSearch = store.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === '전체' || store.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="웨이티" showBack={false} />

            <div className="pt-14">
                {/* 검색 영역 */}
                <div className="sticky top-14 bg-white border-b z-10">
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="맛집을 검색해보세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
                        <div className="flex space-x-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                                        selectedCategory === category
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 매장 목록 */}
                <StoreList
                    stores={filterStores(stores)}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default StoreListPage;