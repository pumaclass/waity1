import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import ImageUpload from '../../components/common/ImageUpload';
import { useMenu } from '../../hooks/useMenu';

const MenuManagePage = () => {
    const { storeId, menuId } = useParams();
    const isEditing = Boolean(menuId);
    const { createMenu, updateMenu, loading } = useMenu();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            price: Number(formData.price)
        };

        try {
            if (isEditing) {
                await updateMenu(storeId, menuId, data);
            } else {
                await createMenu(storeId, data);
            }
            // 성공 후 뒤로가기
        } catch (error) {
            // 에러 처리
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title={isEditing ? "메뉴 수정" : "새 메뉴 추가"} />

            <div className="pt-14 p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    {/* 메뉴 정보 입력 */}
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
                            rows={4}
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
                            placeholder="알레르기 유발 성분을 입력하세요"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                            현재 주문 가능
                        </label>
                    </div>

                    {/* 저장 버튼 */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
                        >
                            {loading ? "저장 중..." : (isEditing ? "메뉴 수정하기" : "메뉴 추가하기")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuManagePage;