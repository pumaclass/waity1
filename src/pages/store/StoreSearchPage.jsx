import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../../../hooks/useStore';
import StoreCard from '../../../components/store/StoreCard';

const StoreSearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { searchStores, loading, error } = useUserStore();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        // 최근 검색어 로드
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }

        // URL의 검색어로 검색 실행
        if (searchParams.get('q')) {
            handleSearch(searchParams.get('q'));
        }
    }, [searchParams]);

    const handleSearch = async (term) => {
        if (!term.trim()) return;

        try {
            const results = await searchStores(term);
            setSearchResults(results);

            // 최근 검색어 저장
            const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
            setRecentSearches(newRecentSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/stores/search?q=${encodeURIComponent(searchTerm)}`);
            handleSearch(searchTerm);
        }
    };

    const removeRecentSearch = (term) => {
        const newRecentSearches = recentSearches.filter(s => s !== term);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 검색 헤더 */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
                <form onSubmit={handleSubmit} className="flex items-center p-2 gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="매장명 검색"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="pt-16 p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        {error}
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {/* 검색 결과 */}
                        <div className="text-sm text-gray-500 mb-2">
                            검색결과 {searchResults.length}개
                        </div>
                        {searchResults.map(store => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onClick={() => navigate(`/stores/${store.id}`)}
                            />
                        ))}
                    </div>
                ) : searchTerm ? (
                    <div className="text-center py-20 text-gray-500">
                        검색 결과가 없습니다
                    </div>
                ) : (
                    // 최근 검색어
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-700 font-medium">최근 검색어</h3>
                            {recentSearches.length > 0 && (
                                <button
                                    onClick={() => {
                                        setRecentSearches([]);
                                        localStorage.removeItem('recentSearches');
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    전체 삭제
                                </button>
                            )}
                        </div>
                        {recentSearches.length > 0 ? (
                            <div className="space-y-2">
                                {recentSearches.map((term, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                                    >
                                        <button
                                            onClick={() => {
                                                setSearchTerm(term);
                                                handleSearch(term);
                                            }}
                                            className="text-gray-700 hover:text-blue-500"
                                        >
                                            {term}
                                        </button>
                                        <button
                                            onClick={() => removeRecentSearch(term)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                최근 검색어가 없습니다
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreSearchPage;