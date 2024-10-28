const setTokens = (accessToken, refreshToken) => {
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

const getAccessToken = () => {
    // 로컬 스토리지에서 accessToken 가져오기
    return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
    // 로컬 스토리지에서 refreshToken 가져오기
    return localStorage.getItem('refreshToken');
};

export const auth = {
    setTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
};