import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';

export const useReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        hasNext: false
    });

    const fetchReviews = useCallback(async (menuId, page = 0) => {
        if (!menuId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_ENDPOINTS.review.list(menuId)}?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('리뷰 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            const reviewData = data.data || { content: [] };

            setReviews(prev => page === 0 ? reviewData.content : [...prev, ...reviewData.content]);
            setPagination({
                currentPage: reviewData.number || 0,
                totalPages: reviewData.totalPages || 0,
                hasNext: !reviewData.last
            });

        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createReview = useCallback(async (menuId, reviewData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.review.create(menuId), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                throw new Error('리뷰 작성에 실패했습니다.');
            }

            const data = await response.json();
            return data.data;
        } catch (err) {
            console.error('Failed to create review:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateReview = useCallback(async (reviewId, reviewData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.review.update(reviewId), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                throw new Error('리뷰 수정에 실패했습니다.');
            }

            const data = await response.json();
            return data.data;
        } catch (err) {
            console.error('Failed to update review:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const deleteReview = useCallback(async (reviewId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.review.delete(reviewId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('리뷰 삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('Failed to delete review:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        reviews,
        loading,
        error,
        pagination,
        fetchReviews,
        createReview,
        updateReview,
        deleteReview
    };
};