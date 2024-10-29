import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { API_ENDPOINTS, fetchAPI } from '../../constants/api';

const StoreForm = () => {
    const navigate = useNavigate();
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        openTime: '09:00',
        lastOrder: '20:00',
        closeTime: '21:00',
        turnover: '00:30',
        reservationTableCount: 3,
        tableCount: 10,
        phoneNumber: '',
        address: '',
        deposit: 0,
        latitude: '',
        longitude: ''
    });

    const handleComplete = (data) => {
        const { address } = data;

        // 주소로 좌표 검색
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function(result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = result[0];
                setFormData(prev => ({
                    ...prev,
                    address: address,
                    latitude: coords.y,
                    longitude: coords.x
                }));
            }
        });

        setIsAddressModalOpen(false);
    };

    const formatTime = (time) => {
        return `${time}:00`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                ...formData,
                openTime: formatTime(formData.openTime),
                lastOrder: formatTime(formData.lastOrder),
                closeTime: formatTime(formData.closeTime),
                turnover: formatTime(formData.turnover),
                reservationTableCount: parseInt(formData.reservationTableCount),
                tableCount: parseInt(formData.tableCount),
                deposit: parseInt(formData.deposit),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            const response = await fetchAPI(API_ENDPOINTS.store.create, {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (response.status === 200) {
                alert('매장이 성공적으로 등록되었습니다.');
                navigate('/owner/store');
            }
        } catch (error) {
            console.error('Store creation error:', error);
            alert('매장 등록에 실패했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">매장명</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">매장 설명</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* 영업 시간 관련 입력 필드들 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">오픈 시간</label>
                            <input
                                type="time"
                                name="openTime"
                                value={formData.openTime}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">마지막 주문</label>
                            <input
                                type="time"
                                name="lastOrder"
                                value={formData.lastOrder}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">닫는 시간</label>
                            <input
                                type="time"
                                name="closeTime"
                                value={formData.closeTime}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">평균 식사 시간</label>
                            <input
                                type="time"
                                name="turnover"
                                value={formData.turnover}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* 테이블 수 관련 입력 필드들 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">예약 가능 테이블</label>
                            <input
                                type="number"
                                name="reservationTableCount"
                                value={formData.reservationTableCount}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">전체 테이블</label>
                            <input
                                type="number"
                                name="tableCount"
                                value={formData.tableCount}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">전화번호</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="02-000-0000"
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
                                onClick={() => setIsAddressModalOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                주소 찾기
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">예약금</label>
                        <input
                            type="number"
                            name="deposit"
                            value={formData.deposit}
                            onChange={handleChange}
                            min="0"
                            step="1000"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

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
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        등록
                    </button>
                </div>
            </form>

            {/* 주소 검색 모달 */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
                        <div className="p-4">
                            <DaumPostcode
                                onComplete={handleComplete}
                                autoClose
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setIsAddressModalOpen(false)}
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