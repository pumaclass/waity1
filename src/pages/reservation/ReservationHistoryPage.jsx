import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import Header from '../../components/common/Header';
import { API_ENDPOINTS } from '../../constants/api';
import { useAuthContext } from '../../contexts/AuthContext';  // 이 줄을 추가해주세요


const ReservationType = {
    WAIT: 'WAIT',
    RESERVATION: 'RESERVATION'
};

const ReservationStatus = {
    RESERVATION: 'RESERVATION',
    CANCEL: 'CANCEL',
    APPLY: 'APPLY',
    COMPLETE: 'COMPLETE'
};

const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

const ReservationHistoryPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthContext();  // AuthContext 사용
    const [activeType, setActiveType] = useState(ReservationType.RESERVATION);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 토큰과 인증 상태 로깅
        console.log('Is Authenticated:', isAuthenticated);
        console.log('User:', user);
        console.log('Token:', localStorage.getItem('accessToken'));

        if (isAuthenticated) {
            fetchReservations();
        }
    }, [activeType, isAuthenticated]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('인증이 필요합니다.');
            }

            const params = new URLSearchParams({
                type: activeType,
                page: 1,  // 0 대신 1로 수정
                size: 10
            });

            const response = await fetch(`${API_ENDPOINTS.reservation.list}?${params}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || '예약 목록을 불러오는데 실패했습니다.');
            }

            // 응답 구조에 맞게 데이터 처리
            if (responseData.data && responseData.data.content) {
                setReservations(responseData.data.content);
            } else {
                setReservations([]);
            }

        } catch (error) {
            console.error('Failed to fetch reservations:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (storeId, reservationId) => {
        if (!window.confirm('예약을 취소하시겠습니까? 결제된 금액은 자동으로 환불됩니다.')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                API_ENDPOINTS.reservation.cancel(storeId, reservationId),
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cancelReason: '사용자 취소'
                    })
                }
            );

            if (!response.ok) {
                throw new Error('예약 취소에 실패했습니다.');
            }

            await fetchReservations();
            alert('예약이 취소되었습니다.');
        } catch (error) {
            console.error('Failed to cancel:', error);
            alert(error.message);
        }
    };

    const getPaymentText = (status, amount) => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return `${amount?.toLocaleString()}원 결제완료`;
            case PaymentStatus.PENDING:
                return '결제대기';
            case PaymentStatus.CANCELLED:
                return '결제취소';
            default:
                return '결제정보 없음';
        }
    };

    const getPaymentClass = (status) => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            case PaymentStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case PaymentStatus.CANCELLED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case ReservationStatus.RESERVATION:
                return '예약중';
            case ReservationStatus.APPLY:
                return '승인됨';
            case ReservationStatus.COMPLETE:
                return '방문완료';
            case ReservationStatus.CANCEL:
                return '취소됨';
            default:
                return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case ReservationStatus.RESERVATION:
                return 'bg-yellow-100 text-yellow-800';
            case ReservationStatus.APPLY:
                return 'bg-green-100 text-green-800';
            case ReservationStatus.COMPLETE:
                return 'bg-blue-100 text-blue-800';
            case ReservationStatus.CANCEL:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="예약/웨이팅 내역"
                leftButton={
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                }
            />

            <div className="pt-14">
                {/* 탭 버튼 */}
                <div className="bg-white border-b">
                    <div className="flex">
                        <button
                            onClick={() => setActiveType(ReservationType.RESERVATION)}
                            className={`flex-1 py-3 text-center font-medium border-b-2 ${
                                activeType === ReservationType.RESERVATION
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-transparent text-gray-500'
                            }`}
                        >
                            예약
                        </button>
                        <button
                            onClick={() => setActiveType(ReservationType.WAIT)}
                            className={`flex-1 py-3 text-center font-medium border-b-2 ${
                                activeType === ReservationType.WAIT
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-transparent text-gray-500'
                            }`}
                        >
                            웨이팅
                        </button>
                    </div>
                </div>

                {/* 예약/웨이팅 목록 */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-4">
                            {error}
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            {activeType === ReservationType.WAIT ? '웨이팅' : '예약'} 내역이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reservations.map((reservation) => (
                                <div key={reservation.reservationId} className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-medium text-lg">
                                                {reservation.storeName}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>
                                                    {new Date(reservation.reservationDate).toLocaleDateString()} {reservation.reservationTime}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reservation.numberPeople}명
                                            </div>
                                            {activeType === ReservationType.WAIT && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    대기번호: {reservation.reservationNo}번
                                                </div>
                                            )}
                                            {reservation.paymentAmount && (
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <CreditCard className="w-4 h-4 mr-1" />
                                                    <span className={getPaymentClass(reservation.paymentStatus)}>
                                                        {getPaymentText(reservation.paymentStatus, reservation.paymentAmount)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClass(reservation.status)}`}>
                                            {getStatusText(reservation.status)}
                                        </span>
                                    </div>

                                    {(reservation.status === ReservationStatus.RESERVATION ||
                                        reservation.status === ReservationStatus.APPLY) && (
                                        <button
                                            onClick={() => handleCancel(reservation.storeId, reservation.reservationId)}
                                            className="w-full mt-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                                        >
                                            예약 취소
                                        </button>
                                    )}

                                    {reservation.status === ReservationStatus.COMPLETE && !reservation.hasReview && (
                                        <button
                                            onClick={() => navigate(`/reviews/create/${reservation.storeId}`)}
                                            className="w-full mt-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                        >
                                            리뷰 작성
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationHistoryPage;