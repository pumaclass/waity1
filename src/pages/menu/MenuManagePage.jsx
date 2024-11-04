// src/pages/menu/MenuManagePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ImageUpload from '../../components/common/ImageUpload';
import { useMenu } from '../../hooks/useMenu';
import { useStore } from '../../hooks/useStore';

const MenuManagePage = () => {
    const navigate = useNavigate();
    const { stores, fetchStores, loading: storeLoading, error: storeError } = useStore();
    const { loading: menuLoading, createMenu } = useMenu();

    const [initialized, setInitialized] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        allergies: '',
        category: '메인',
        images: [],
        isAvailable: true
    });

    const categories = ['메인', '사이드', '음료', '디저트'];

    // 초기 데이터 로드
    useEffect(() => {
        const initializePage = async () => {
            if (!initialized) {
                await fetchStores();
                setInitialized(true);
            }
        };
        initializePage();
    }, [initialized, fetchStores]);

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStore) {
            alert('매장을 선택해주세요.');
            return;
        }

        try {
            const menuData = {
                ...formData,
                price: Number(formData.price)
            };

            await createMenu(selectedStore.id, menuData);
            navigate('/store/manage');
        } catch (error) {
            console.error('메뉴 처리 중 오류 발생:', error);
            alert(error.message);
        }
    };

    // 매장 선택 화면
    if (!selectedStore) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <Header title="매장 선택" />
                <div className="pt-14">
                    <h2 className="text-lg font-medium mb-4">메뉴를 등록할 매장을 선택해주세요</h2>
                    {storeLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : storeError ? (
                        <div className="p-4 text-center text-red-500">
                            {storeError}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stores.map(store => (
                                <div
                                    key={store.id}
                                    onClick={() => handleStoreSelect(store)}
                                    className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                                >
                                    <h3 className="font-medium">{store.title}</h3>
                                    <p className="text-sm text-gray-500">{store.address}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 메뉴 등록 폼
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="새 메뉴 추가"
                subtitle={selectedStore.title}
            />
            <div className="pt-14 p-4">
                <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                    {/* 이미지 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            메뉴 이미지
                        </label>
                        <ImageUpload
                            images={formData.images}
                            onChange={(images) => setFormData({ ...formData, images })}
                            maxImages={1}
                            aspectRatio="4:3"
                        />
                    </div>

                    {/* 메뉴 정보 입력 필드들... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            메뉴 이름
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="메뉴 이름을 입력하세요"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            가격
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="가격을 입력하세요"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            메뉴 설명
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="메뉴에 대한 설명을 입력하세요"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            알레르기 정보
                        </label>
                        <input
                            type="text"
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="알레르기 정보를 입력하세요 (예: 땅콩, 우유)"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mr-4">
                            판매 가능 여부
                        </label>
                        <input
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            판매 중
                        </span>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={menuLoading || storeLoading}
                        >
                            {menuLoading ? '저장 중...' : '메뉴 추가'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuManagePage;