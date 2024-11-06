import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';

export default function StoreBlogNewsModal({ store, onClose }) {
    const [activeTab, setActiveTab] = useState('blog');
    const [blogResults, setBlogResults] = useState([]);
    const [newsResults, setNewsResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKeywordsAndResults = async () => {
            if (!store?.id) return;

            setLoading(true);
            setError(null);

            try {
                // 1. 키워드 생성
                let generatedKeywords;
                try {
                    const keywordsResponse = await fetchAPI(`${API_ENDPOINTS.crawler.keywords}/${store.id}`);
                    generatedKeywords = keywordsResponse.data;
                    setKeywords(generatedKeywords);
                } catch (error) {
                    console.error('키워드 생성 실패:', error);
                    generatedKeywords = [store.title];
                    setKeywords(generatedKeywords);
                }

                // 2. 키워드로 검색
                const allBlogResults = [];
                const allNewsResults = [];

                for (const keyword of generatedKeywords) {
                    try {
                        // URL 파라미터 인코딩 처리
                        const encodedKeyword = encodeURIComponent(keyword);
                        const blogUrl = `${API_ENDPOINTS.crawler.blog}?keyword=${encodedKeyword}&page=1`;
                        const newsUrl = `${API_ENDPOINTS.crawler.news}?keyword=${encodedKeyword}&page=1`;

                        console.log('Fetching blog:', blogUrl); // 디버깅용
                        console.log('Fetching news:', newsUrl); // 디버깅용

                        const [blogRes, newsRes] = await Promise.all([
                            fetchAPI(blogUrl),
                            fetchAPI(newsUrl)
                        ]);

                        if (blogRes?.data) {
                            console.log(`Blog results for ${keyword}:`, blogRes.data); // 디버깅용
                            allBlogResults.push(...blogRes.data);
                        }
                        if (newsRes?.data) {
                            console.log(`News results for ${keyword}:`, newsRes.data); // 디버깅용
                            allNewsResults.push(...newsRes.data);
                        }
                    } catch (error) {
                        console.error(`'${keyword}' 검색 실패:`, error);
                        // 개별 키워드 검색 실패 시 계속 진행
                        continue;
                    }
                }

                // 3. 중복 제거 및 정렬
                const uniqueBlogResults = Array.from(
                    new Map(allBlogResults.map(item => [item.link, item])).values()
                ).sort((a, b) => new Date(b.date) - new Date(a.date));

                const uniqueNewsResults = Array.from(
                    new Map(allNewsResults.map(item => [item.link, item])).values()
                ).sort((a, b) => new Date(b.date) - new Date(a.date));

                setBlogResults(uniqueBlogResults);
                setNewsResults(uniqueNewsResults);

            } catch (error) {
                console.error('데이터 조회 실패:', error);
                setError('데이터를 불러오는 중 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchKeywordsAndResults();
    }, [store?.id, store?.title]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderItem = (item) => (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border-b hover:bg-gray-50 transition-colors"
        >
            <div className="flex gap-4">
                {item.thumbnail && (
                    <div className="w-20 h-20 flex-shrink-0">
                        <img
                            src={item.thumbnail}
                            alt=""
                            className="w-full h-full object-cover rounded"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {item.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 gap-2">
                        <span>{item.date}</span>
                        <ExternalLink className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </a>
    );

    if (!store) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-lg font-medium">{store.title} 관련 정보</h2>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {keywords.map((keyword, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                >
                                    #{keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="닫기"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 탭 */}
                <div className="flex border-b">
                    <button
                        onClick={() => handleTabChange('blog')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'blog'
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent'
                        }`}
                    >
                        블로그 ({blogResults.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('news')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'news'
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent'
                        }`}
                    >
                        뉴스 ({newsResults.length})
                    </button>
                </div>

                {/* 컨텐츠 */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 text-sm text-blue-500 hover:underline"
                            >
                                다시 시도하기
                            </button>
                        </div>
                    ) : activeTab === 'blog' ? (
                        blogResults.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {blogResults.map((item, index) => (
                                    <div key={index}>{renderItem(item)}</div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                블로그 검색 결과가 없습니다.
                            </div>
                        )
                    ) : (
                        newsResults.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {newsResults.map((item, index) => (
                                    <div key={index}>{renderItem(item)}</div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                뉴스 검색 결과가 없습니다.
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}