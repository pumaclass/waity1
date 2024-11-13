import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';

const StoreForm = ({ initialData }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        districtCategoryCode: initialData?.districtCategoryCode || '',
        description: initialData?.description || '',
        openTime: initialData?.openTime || '09:00',
        lastOrder: initialData?.lastOrder || '20:00',
        closeTime: initialData?.closeTime || '21:00',
        turnover: initialData?.turnover || '01:00',
        reservationTableCount: initialData?.reservationTableCount || 3,
        tableCount: initialData?.tableCount || 10,
        phoneNumber: initialData?.phoneNumber || '',
        address: initialData?.address || '',
        deposit: initialData?.deposit || 10000,
        latitude: initialData?.latitude || null,
        longitude: initialData?.longitude || null
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddressComplete = (data) => {
        const { address } = data;
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = result[0];
                setFormData(prev => ({
                    ...prev,
                    address: address,
                    latitude: parseFloat(coords.y),
                    longitude: parseFloat(coords.x)
                }));
            }
        });

        setShowAddressModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            const storeRequestDto = {
                title: formData.title,
                districtCategoryCode: formData.districtCategoryCode || "",
                description: formData.description,
                openTime: formData.openTime,
                lastOrder: formData.lastOrder,
                closeTime: formData.closeTime,
                turnover: formData.turnover,
                reservationTableCount: parseInt(formData.reservationTableCount),
                tableCount: parseInt(formData.tableCount),
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                deposit: parseInt(formData.deposit),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            const storeRequestDtoBlob = new Blob(
                [JSON.stringify(storeRequestDto)],
                { type: 'application/json' }
            );

            formDataToSend.append('storeRequestDto', storeRequestDtoBlob);

            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            const response = await fetchAPI(
                initialData ? API_ENDPOINTS.store.update(initialData.id) : API_ENDPOINTS.store.create,
                {
                    method: initialData ? 'PUT' : 'POST',
                    body: formDataToSend
                }
            );

            if (response.success) {
                alert('매장이 등록되었습니다.');
                navigate('/');  // 메인 화면으로 이동
            }
        } catch (error) {
            console.error('Store submission error:', error);
            alert('매장 등록에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            alert('매장명을 입력해주세요.');
            return false;
        }
        if (!formData.address || !formData.latitude || !formData.longitude) {
            alert('주소를 선택해주세요.');
            return false;
        }
        if (formData.tableCount < formData.reservationTableCount) {
            alert('예약 가능 테이블 수는 총 테이블 수를 초과할 수 없습니다.');
            return false;
        }
        return true;
    };

    return (
        <div className="relative">
            <div className="max-w-2xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 이미지 업로드 */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            매장 이미지
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="cursor-pointer">
                                            <span className="text-blue-600 hover:text-blue-500">이미지 업로드</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (최대 10MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <h3 className="text-lg font-medium">기본 정보</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">매장명</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                지역
                            </label>
                            <select
                                value={formData.districtCategoryCode}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    districtCategoryCode: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">지역 선택</option>
                                {/* 서울 */}
                                <option value="R123">강남구</option>
                                <option value="R122">서초구</option>
                                <option value="R114">마포구</option>
                                <option value="R113">서대문구</option>
                                {/* 경기 */}
                                <option value="R023">고양시</option>
                                <option value="R024">용인시</option>
                                <option value="R021">성남시</option>
                                <option value="R025">부천시</option>
                                {/* 인천 */}
                                <option value="R043">미추홀구</option>
                                <option value="R046">부평구</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">설명</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* 영업 정보 */}
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <h3 className="text-lg font-medium">영업 정보</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    오픈 시간
                                </label>
                                <input
                                    type="time"
                                    value={formData.openTime}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        openTime: e.target.value
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    마감 시간
                                </label>
                                <input
                                    type="time"
                                    value={formData.closeTime}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        closeTime: e.target.value
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    라스트 오더
                                </label>
                                <input
                                    type="time"
                                    value={formData.lastOrder}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        lastOrder: e.target.value
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    평균 식사 시간
                                </label>
                                <input
                                    type="time"
                                    value={formData.turnover}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        turnover: e.target.value
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    총 테이블 수
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={formData.tableCount}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        tableCount: parseInt(e.target.value)
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    예약 가능 테이블
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={formData.tableCount}
                                    value={formData.reservationTableCount}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        reservationTableCount: parseInt(e.target.value)
                                    }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                예약금
                            </label>
                            <input
                                type="number"
                                min={0}
                                step={1000}
                                value={formData.deposit}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    deposit: parseInt(e.target.value)
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* 연락처 정보 */}
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <h3 className="text-lg font-medium">연락처 정보</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                전화번호
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    phoneNumber: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">주소</label>
                            <div className="mt-1 flex gap-2">
                                <input
                                    type="text"
                                    value={formData.address}
                                    readOnly
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                    placeholder="주소 찾기를 클릭하세요"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    주소 찾기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded-md ${
                                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    처리중...
                                </div>
                            ) : initialData ? '수정하기' : '등록하기'}
                        </button>
                    </div>
                </form>
            </div>

            {/* 주소 검색 모달 */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddressModal(false)} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg">
                        <div className="p-4">
                            <DaumPostcode
                                onComplete={handleAddressComplete}
                                autoClose
                                style={{ height: 400 }}
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreForm;
