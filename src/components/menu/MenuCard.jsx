import { Edit2, Trash2 } from 'lucide-react';

// 기본 이미지를 상수로 정의
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNnB4IiBmaWxsPSIjOWNhM2FmIj7snbTrr7jsp4Ag7JeQ7IaNPC90ZXh0Pjwvc3ZnPg==';

const MenuCard = ({ menu, isOwner, onEdit, onDelete }) => {
    if (!menu) return null;

    const {
        id,
        name = '메뉴명 없음',
        price = 0,
        allergies = null,
        image = null // 이미지가 없을 경우 null
    } = menu;

    return (
        <div className="bg-white border-b last:border-b-0">
            <div className="p-4 flex items-start gap-4">
                {/* 메뉴 이미지 */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                        src={image || PLACEHOLDER_IMAGE}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                        }}
                    />
                </div>

                {/* 메뉴 정보 */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 break-words">{name}</h3>
                            {allergies && (
                                <p className="mt-1 text-xs text-red-500">
                                    알레르기: {allergies}
                                </p>
                            )}
                            <p className="mt-2 text-lg font-bold text-blue-600">
                                {Number(price).toLocaleString()}원
                            </p>
                        </div>

                        {/* 관리자 버튼 */}
                        {isOwner && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(menu);
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    title="메뉴 수정"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                    title="메뉴 삭제"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;