import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

// SideMenu 컴포넌트
const SideMenu = ({ isOpen, onClose }) => {
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
        { label: '메뉴 관리', path: '/owner/store/menu' },
        { label: '예약 관리', path: '/owner/reservations' },
    ];

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
            <div className={`fixed top-0 right-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
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
                                <p className="font-bold text-lg">{user.nickname}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
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

                {/* 메뉴 아이템 */}
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

                    {user?.isOwner && (
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

                {/* 로그아웃 */}
                {user && (
                    <div className="border-t absolute bottom-0 left-0 right-0">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50"
                        >
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Header 컴포넌트
const Header = ({
                    title,
                    showBack = true,
                    showMenu = true,
                    rightButton = null,
                    transparent = false,
                    className = ''
                }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuthContext();

    return (
        <div className="relative">
            <header className={`fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-40 ${
                transparent ? 'bg-transparent' : 'bg-white border-b'
            } ${className}`}>
                {/* 왼쪽: 뒤로가기 버튼 */}
                <div className="w-10">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100/50"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* 중앙: 타이틀 */}
                <h1 className="font-medium text-lg flex-1 text-center truncate px-4">
                    {title}
                </h1>

                {/* 오른쪽: 메뉴 버튼 또는 커스텀 버튼 */}
                <div className="w-10 flex justify-end">
                    {rightButton || (showMenu && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -mr-2 rounded-full hover:bg-gray-100/50"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    ))}
                </div>
            </header>

            {/* 사이드 메뉴 */}
            {isMenuOpen && (
                <SideMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Header;