import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useMenu } from '../../hooks/useMenu';
import MenuCard from './MenuCard';

const MenuList = ({ storeId, isOwner = false }) => {
    const { menus, loading, error, fetchMenus, fetchOwnerMenus } = useMenu();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 컴포넌트 마운트/storeId 변경 시에만 메뉴 목록 가져오기
    useEffect(() => {
        const fetchData = async () => {
            if (!storeId) return;

            try {
                if (isOwner) {
                    await fetchOwnerMenus(storeId);
                } else {
                    await fetchMenus(storeId);
                }
            } catch (err) {
                console.error('MenuList fetch error:', err);
            }
        };

        fetchData();
    }, [storeId, isOwner]); // fetchMenus와 fetchOwnerMenus 제거

    const handleEdit = (menu) => {
        console.log('Editing menu:', menu);
        setIsModalOpen(true);
    };

    const handleDelete = async (menuId) => {
        console.log('Attempting to delete menu:', menuId);
        if (window.confirm('메뉴를 삭제하시겠습니까?')) {
            try {
                // TODO: API 호출
                // 성공 후에 메뉴 목록 다시 가져오기
                if (isOwner) {
                    await fetchOwnerMenus(storeId);
                } else {
                    await fetchMenus(storeId);
                }
            } catch (error) {
                console.error('Failed to delete menu:', error);
            }
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
            {/* 메뉴 목록 */}
            <div className="divide-y divide-gray-200">
                {menus.length > 0 ? (
                    menus.map((menu) => (
                        <MenuCard
                            key={menu.id}
                            menu={menu}
                            isOwner={isOwner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        등록된 메뉴가 없습니다.
                    </div>
                )}
            </div>

            {/* 메뉴 추가 버튼 (관리자용) */}
            {isOwner && (
                <div className="fixed bottom-20 right-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* 메뉴 추가/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">메뉴 추가/수정</h2>
                        <form className="space-y-4">
                            {/* TODO: 폼 필드들 */}
                        </form>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                취소
                            </button>
                            <button
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;