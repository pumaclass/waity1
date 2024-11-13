import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MenuCard from './MenuCard';
import { PLACEHOLDER_IMAGE } from '../../constants/images';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';
import { auth } from '../../lib/auth';

const MenuList = ({ storeId, isOwner = false }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [quantity, setQuantity] = useState(1); // 메뉴 개수를 관리할 상태 추가

    useEffect(() => {
        const fetchMenus = async () => {
            if (!storeId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const endpoint = isOwner
                    ? API_ENDPOINTS.menu.ownerList(storeId)
                    : API_ENDPOINTS.menu.list(storeId);

                const response = await fetchAPI(endpoint);
                console.log('Received menu data:', response);

                const menuData = response.data || [];
                setMenus(menuData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch menus:', err);
                setError(err.message || '메뉴를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [storeId, isOwner]);

    const handleMenuClick = (menu) => {
        const userRole = auth.getUserRole();
        if (userRole === "ROLE_USER") {
            setQuantity(1);
            setSelectedMenu(menu);
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

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1)); // 최소 1로 제한
    };

    // 장바구니에 추가하는 함수 예시
    const addToCart = async (menu, quantity) => {
        console.log(`Added ${quantity} of ${menu.id} to cart.`);

        try {
            setLoading(true);

            const data = {
                "menus" : [
                    {
                        "menuId" : menu.id,
                        "menuCnt" : quantity
                    }
                ]
            };

            const url = API_ENDPOINTS.cart.add(storeId);
            const response = await fetchAPI(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : auth.getAccessToken()
                },
                body: JSON.stringify(data)
            });

            if (response.status === 200) {
                console.log(response.message);
                setSelectedMenu(null);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to fetch menus:', err);
            setError(err.message || '메뉴를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-safe">
            <div className="divide-y divide-gray-200">
                {menus.length > 0 ? (
                    menus.map((menu) => (
                        <div onClick={() => {handleMenuClick(menu)}}>
                            <MenuCard
                                key={menu.id}
                                menu={menu}
                                isOwner={isOwner}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        등록된 메뉴가 없습니다.
                    </div>
                )}
            </div>

            {selectedMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{selectedMenu.name}</h2>
                            <button
                                onClick={() => setSelectedMenu(null)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                                <img
                                    src={selectedMenu.imageUrl || PLACEHOLDER_IMAGE}
                                    alt={selectedMenu.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = PLACEHOLDER_IMAGE;
                                    }}
                                />
                            </div>
                            <div className="space-y-4">
                                <p className="text-2xl font-bold text-blue-600">
                                    {Number(selectedMenu.price).toLocaleString()}원
                                </p>
                                {selectedMenu.description && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">설명</h3>
                                        <p className="text-gray-600">{selectedMenu.description}</p>
                                    </div>
                                )}
                                {selectedMenu.allergies && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">알레르기 정보</h3>
                                        <p className="text-red-500">{selectedMenu.allergies.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* 메뉴 개수 선택 및 장바구니 담기 버튼 추가 */}
                        <div className="p-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <label className="font-medium text-gray-900">개수:</label>
                                <div className="flex items-center">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="p-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly // 직접 입력 방지
                                        className="w-16 p-2 border-t border-b border-gray-300 text-center"
                                    />
                                    <button
                                        onClick={increaseQuantity}
                                        className="p-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => addToCart(selectedMenu, quantity)} // 장바구니에 추가하는 함수 호출
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                장바구니에 담기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;