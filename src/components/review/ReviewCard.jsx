// src/components/review/ReviewCard.js
import React from 'react';
import Rating from '../common/Rating';
import LikeButton from '../common/LikeButton';
import { PLACEHOLDER_IMAGE } from '../../constants/images';

const ReviewCard = ({ review, onLikeClick }) => {
    const {
        id,
        title,
        content,
        imageUrls = [],
        rating,
        nickname,
        storeName,
        menuName,
        likeCount = 0,
        liked = false,
        reservationDate,
        createdAt
    } = review;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLikeClick = () => {
        onLikeClick?.(id);
    };

    return (
        <div className="p-4 border-b">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-medium">{nickname}</div>
                    <div className="flex items-center mt-1 space-x-2">
                        <Rating value={rating} readonly size="sm" />
                        <span className="text-sm text-gray-600">
                            {formatDate(createdAt)}
                        </span>
                    </div>
                    {reservationDate && (
                        <div className="text-xs text-gray-500 mt-1">
                            방문일: {formatDate(reservationDate)}
                        </div>
                    )}
                </div>
                <LikeButton
                    liked={liked}
                    likeCount={likeCount}
                    onClick={handleLikeClick}
                    size="sm"
                />
            </div>

            {title && <h3 className="font-medium mb-2">{title}</h3>}
            <p className="text-gray-600 mb-3 whitespace-pre-line">{content}</p>

            {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={url}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = PLACEHOLDER_IMAGE;
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="text-sm text-gray-500 space-y-1">
                {menuName && <div>메뉴: {menuName}</div>}
                {storeName && <div>매장: {storeName}</div>}
            </div>
        </div>
    );
};

export default ReviewCard;