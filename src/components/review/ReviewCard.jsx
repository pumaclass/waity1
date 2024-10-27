import { useState } from 'react';
import { Star, ThumbsUp, MoreVertical, X } from 'lucide-react';
import { useReview } from '../../hooks/useReview';

const ImageViewer = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* 헤더 */}
            <div className="p-4 flex justify-between items-center text-white">
                <span className="text-sm">
                    {currentIndex + 1} / {images.length}
                </span>
                <button onClick={onClose} className="p-2">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* 이미지 */}
            <div className="flex-1 flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    alt={`리뷰 이미지 ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            {/* 네비게이션 */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-500'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

const ReviewCard = ({ review, isOwner = false }) => {
    const { toggleLike } = useReview();
    const [showOptions, setShowOptions] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [isLiked, setIsLiked] = useState(review.isLiked);
    const [likeCount, setLikeCount] = useState(review.likeCount);

    const handleLike = async () => {
        try {
            await toggleLike(review.id);
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const reviewDate = new Date(date);
        const diffTime = Math.abs(now - reviewDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;

        return reviewDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white p-4">
            {/* 유저 정보 및 평점 */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img
                            src={review.user.profileImage || '/default-profile.jpg'}
                            alt={review.user.nickname}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-900">
                            {review.user.nickname}
                        </h3>
                        <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {showOptions && (
                            <div
                                className="fixed inset-0 z-50"
                                onClick={() => setShowOptions(false)}
                            >
                                <div className="absolute right-4 top-12 w-36 bg-white rounded-lg shadow-lg overflow-hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle edit
                                            setShowOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle delete
                                            setShowOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 리뷰 내용 */}
            <div className="mb-3">
                {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">
                        {review.title}
                    </h4>
                )}
                <p className="text-gray-700 whitespace-pre-line">
                    {review.content}
                </p>
            </div>

            {/* 리뷰 이미지 */}
            {review.images && review.images.length > 0 && (
                <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                        {review.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setShowImageViewer(true)}
                                className="flex-none w-20 h-20 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={image}
                                    alt={`리뷰 이미지 ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 좋아요 버튼 */}
            <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                    isLiked
                        ? 'text-blue-500 bg-blue-50'
                        : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                도움돼요 {likeCount > 0 && `${likeCount}`}
            </button>

            {/* 이미지 뷰어 */}
            {showImageViewer && (
                <ImageViewer
                    images={review.images}
                    onClose={() => setShowImageViewer(false)}
                />
            )}
        </div>
    );
};

export default ReviewCard;