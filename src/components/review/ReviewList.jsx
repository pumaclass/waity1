import { useState, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { useReview } from '../../hooks/useReview';
import ReviewCard from './ReviewCard';

const ReviewList = ({ storeId }) => {
    const { reviews, loading, error, fetchReviews, pagination } = useReview();
    const [filter, setFilter] = useState('recent'); // recent, highRating, lowRating

    useEffect(() => {
        if (storeId) {
            fetchReviews(storeId);
        }
    }, [storeId, fetchReviews]);

    const filterButtons = [
        { id: 'recent', label: '최신순' },
        { id: 'highRating', label: '높은 평점순' },
        { id: 'lowRating', label: '낮은 평점순' }
    ];

    const getFilteredReviews = () => {
        if (!Array.isArray(reviews)) return [];

        let filtered = [...reviews];
        switch (filter) {
            case 'highRating':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'lowRating':
                return filtered.sort((a, b) => a.rating - b.rating);
            case 'recent':
            default:
                return filtered.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="pb-safe">
            {/* 리뷰 요약 */}
            <div className="bg-white p-4 border-b">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-gray-900">
                                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0).toFixed(1)}
                            </span>
                            <div className="flex ml-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            총 {reviews.length}개의 리뷰
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                        리뷰 작성하기
                    </button>
                </div>

                {/* 평점 분포 */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                        const percentage = (count / reviews.length) * 100 || 0;

                        return (
                            <div key={rating} className="flex items-center">
                                <span className="w-12 text-sm text-gray-600">
                                    {rating}점
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-12 text-right text-sm text-gray-500">
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 리뷰 필터 */}
            <div className="bg-white border-b">
                <div className="flex overflow-x-auto hide-scrollbar p-2">
                    {filterButtons.map((filterBtn) => (
                        <button
                            key={filterBtn.id}
                            onClick={() => setFilter(filterBtn.id)}
                            className={`flex-none px-4 py-2 rounded-full text-sm mr-2 last:mr-0 ${
                                filter === filterBtn.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {filterBtn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="divide-y divide-gray-200">
                {getFilteredReviews().map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {/* 더보기 버튼 */}
            {pagination?.hasNext && (
                <div className="p-4 text-center">
                    <button
                        onClick={() => fetchReviews(storeId, pagination.currentPage + 1)}
                        className="flex items-center justify-center w-full py-3 text-gray-600 hover:text-gray-900"
                    >
                        더보기
                        <ChevronDown className="w-5 h-5 ml-1" />
                    </button>
                </div>
            )}

            {/* 리뷰가 없는 경우 */}
            {reviews.length === 0 && (
                <div className="p-8 text-center">
                    <p className="text-gray-500">아직 작성된 리뷰가 없습니다</p>
                    <p className="text-sm text-gray-400 mt-2">첫 리뷰를 작성해보세요!</p>
                </div>
            )}
        </div>
    );
};

export default ReviewList;