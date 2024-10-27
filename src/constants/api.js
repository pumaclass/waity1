const API_BASE = 'http://localhost:8080';

export const API_ENDPOINTS = {
    auth: {
        signup: `${API_BASE}/api/v1/auth/signup`,
        login: `${API_BASE}/api/v1/auth/login`,
        logout: `${API_BASE}/api/v1/auth/logout`,
        reissue: `${API_BASE}/api/v1/auth/reissue`,
        checkEmail: `${API_BASE}/api/v1/auth/email/check`,
        checkNickname: `${API_BASE}/api/v1/auth/nickname/check`,
    },
    store: {
        list: `${API_BASE}/api/v1/user/stores`,
        detail: (id) => `${API_BASE}/api/v1/user/stores/${id}`,
        myStore: `${API_BASE}/api/v1/owner/stores/my`,
        create: `${API_BASE}/api/v1/owner/stores`,
        update: (id) => `${API_BASE}/api/v1/owner/stores/${id}`,
        delete: (id) => `${API_BASE}/api/v1/owner/stores/${id}`,
    },
    menu: {
        list: (storeId) => `${API_BASE}/api/v1/user/stores/${storeId}/menus`,
        ownerList: (storeId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus`,
        detail: (storeId, menuId) => `${API_BASE}/api/v1/user/stores/${storeId}/menus/${menuId}`,
        create: (storeId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus`,
        update: (storeId, menuId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus/${menuId}`,
        delete: (storeId, menuId) => `${API_BASE}/api/v1/owner/stores/${storeId}/menus/${menuId}`
    },
    review: {
        list: (menuId) => `${API_BASE}/api/v1/reviews/${menuId}`,
        create: (menuId) => `${API_BASE}/api/v1/reviews/${menuId}`,
        update: (reviewId) => `${API_BASE}/api/v1/reviews/${reviewId}`,
        delete: (reviewId) => `${API_BASE}/api/v1/reviews/${reviewId}`
    }
};

// API 요청을 위한 헬퍼 함수
export const fetchAPI = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });

    // 403 에러 처리
    if (response.status === 403) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('인증이 필요합니다.');
    }

    if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
    }

    return response.json();
};