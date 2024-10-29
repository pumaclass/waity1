import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export const SideMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, setUser, setIsAuthenticated } = useAuthContext();

    const menuItems = [
        { label: '홈', path: '/' },
        { label: '내 정보', path: '/profile' },
        { label: '예약 내역', path: '/reservations' },
        { label: '리뷰 관리', path: '/reviews' },
        { label: '설정', path: '/settings' },
    ];

    const ownerMenuItems = [
        { label: '매장 관리', path: '/owner/store' },
        { label: '매장 등록', path: '/owner/stores/create' },
        { label: '메뉴 등록', path: '/owner/store/menu' },
        { label: '예약 관리', path: '/owner/reservations' },
    ];

    useEffect(() => {
        if (!user) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            }
        }
    }, [user, setUser, setIsAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
        onClose();
    };

    return (
        <div className="relative z-50">
            {/* 오버레이 */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* 사이드 메뉴 */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* 메뉴 헤더 */}
                <div className="p-4 border-b">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 absolute right-2 top-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="mt-6">
                        {user ? (
                            <div>
                                <p className="font-bold text-lg">{user.email}</p>
                                <p className="text-sm text-gray-500">{user.userNickname}</p>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-blue-500 font-medium"
                                onClick={onClose}
                            >
                                로그인하기
                            </Link>
                        )}
                    </div>
                </div>

                {/* 메뉴 아이템과 로그아웃 버튼 */}
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                        <div className="py-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex px-4 py-3 text-gray-700 hover:bg-gray-100"
                                    onClick={onClose}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* 사장님 메뉴 */}
                            {user?.userRole === 'ROLE_OWNER' && (
                                <>
                                    <div className="my-2 border-t border-gray-200" />
                                    <p className="px-4 py-2 text-sm text-gray-500">사장님 메뉴</p>
                                    {ownerMenuItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="flex px-4 py-3 text-gray-700 hover:bg-gray-100"
                                            onClick={onClose}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* 로그아웃 버튼 위치 */}
                        {user && (
                            <div className="my-2 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-4 text-left text-red-500 hover:bg-red-50 font-medium"
                                >
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
