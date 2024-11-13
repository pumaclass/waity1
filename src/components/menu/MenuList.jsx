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
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;