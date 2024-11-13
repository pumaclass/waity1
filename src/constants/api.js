const API_BASE = 'http://localhost:8080';

export const API_ENDPOINTS = {
    auth: {
        signup: `${API_BASE}/api/v2/auth/signup`,
        login: `${API_BASE}/api/v2/auth/login`,
        logout: `${API_BASE}/api/v2/auth/logout`,
        reissue: `${API_BASE}/api/v2/auth/reissue`,
        checkEmail: `${API_BASE}/api/v2/auth/email/check`,
        checkNickname: `${API_BASE}/api/v2/auth/nickname/check`,
    },
    categories: `${API_BASE}/api/categories`,
    store: {
        list: `${API_BASE}/api/v1/user/stores`,
        detail: (id) => `${API_BASE}/api/v1/user/stores/${id}`,
        myStore: `${API_BASE}/api/v1/owner/stores/my`,
        create: `${API_BASE}/api/v1/owner/stores`,
        update: (id) => `${API_BASE}/api/v1/owner/stores/${id}`,
        delete: (id) => `${API_BASE}/api/v1/owner/stores/${id}`,
    },
    menu: {
        list: (storeId) => `${API_BASE}/api/v2/stores/${storeId}/menus`,
        ownerList: (storeId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus`,
        create: (storeId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus`,
        detail: (storeId, menuId) => `${API_BASE}/api/v2/stores/${storeId}/menus/${menuId}`,
        update: (storeId, menuId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus/${menuId}`,
        delete: (storeId, menuId) => `${API_BASE}/api/v2/owner/stores/${storeId}/menus/${menuId}`
    },
    search: {
        autocomplete: `${API_BASE}/api/search/autocomplete`,
        search: `${API_BASE}/api/search`
    },
    waiting: {
        connect: (storeId) => `${API_BASE}/api/v2/user/stores/${storeId}/waitings/connection`,
        add: (storeId) => `${API_BASE}/api/v2/user/stores/${storeId}/waitings`,
        cancel: (storeId) => `${API_BASE}/api/v2/user/stores/${storeId}/waitings`,
        list: (storeId) => `${API_BASE}/api/v2/owner/stores/${storeId}/waitings/list`,
        check: (storeId) => `${API_BASE}/api/v2/user/stores/${storeId}/waitings`,
        ownerList: (storeId) => `${API_BASE}/api/v2/owner/stores/${storeId}/waitings/list`,
        poll: (storeId) => `${API_BASE}/api/v2/owner/stores/${storeId}/waitings/poll`,
        completed: `${API_BASE}/api/v2/user/waitings/completed`,
        clear: (storeId) => `${API_BASE}/api/v2/owner/stores/${storeId}/waitings/clear`,
    },
    review: {
        list: (menuId) => `${API_BASE}/api/v1/reviews/${menuId}`,
        create: (menuId) => `${API_BASE}/api/v1/reviews/${menuId}`,
        update: (reviewId) => `${API_BASE}/api/v1/reviews/${reviewId}`,
        delete: (reviewId) => `${API_BASE}/api/v1/reviews/${reviewId}`,
        userReviews: `${API_BASE}/api/v1/reviews/my`  // 사용자 리뷰 엔드포인트 추가
    },
    crawler: {
        blog: `${API_BASE}/api/v1/crawler/blog`,
        news: `${API_BASE}/api/v1/crawler/news`,
        keywords: `${API_BASE}/api/v1/crawler/keywords` // 키워드 생성 엔드포인트 추가
    },
    reservation: {
        // 사용자 예약 조회
        list: `${API_BASE}/api/v2/reservations`,
        // 예약 취소
        cancel: (storeId, reservationId) =>
            `${API_BASE}/api/v2/store/${storeId}/reservation/${reservationId}`,
        // 사장님 예약 관리
        ownerList: `${API_BASE}/api/v2/reservation-management`,
        refuse: (reservationId) =>
            `${API_BASE}/api/v2/reservation-management/${reservationId}/refusal`,
        apply: (reservationId) =>
            `${API_BASE}/api/v2/reservation-management/${reservationId}/apply`,
        complete: (reservationId) =>
            `${API_BASE}/api/v2/reservation-management/${reservationId}/complete`
    },
    cart: {
        add: (storeId) => `${API_BASE}/api/v2/store/${storeId}/cart`,
        list: (storeId) => `${API_BASE}/api/v2/store/${storeId}/cart`
    },
    payment: {
        prepare: `${API_BASE}/api/v2/payment/prepare`,
        success: `${API_BASE}/api/v2/payment/success`,
        fail: `${API_BASE}/api/v2/payment/fail`
    },
    settlement: {
        summary: (storeId) => `${API_BASE}/api/v2/store/${storeId}/settlement/summary`
    }
};

// API 요청을 위한 헬퍼 함수
export const fetchAPI = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...(!(options.body instanceof FormData) && {
                    'Content-Type': 'application/json'
                }),
                ...(token && { 'Authorization': `${token}` }),
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Server Error:', errorData);
            throw new Error(errorData.message || 'API 요청에 실패했습니다.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// GET 요청을 위한 헬퍼 함수
export const fetchGET = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');

    // 쿼리 파라미터 처리
    const params = options.params ? new URLSearchParams(options.params).toString() : '';
    const finalUrl = params ? `${url}?${params}` : url;

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                ...(token && { 'Authorization': `${token}` }),
                ...options.headers
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};



    // 403 에러 처리
    // if (response.status === 403) {
    //     // 토큰이 만료되었거나 유효하지 않은 경우
    //     localStorage.removeItem('accessToken');
    //     localStorage.removeItem('refreshToken');
    //     window.location.href = '/login';
    //     throw new Error('인증이 필요합니다.');
    // }

