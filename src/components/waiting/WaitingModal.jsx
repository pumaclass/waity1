const WaitingModal = ({ isOpen, onClose, rank, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                <h2 className="text-xl font-bold text-center mb-6">웨이팅 현황</h2>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-lg font-medium text-center mb-2">현재 대기 순번</p>
                    <p className="text-blue-900 text-4xl font-bold text-center">{rank}번</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onCancel}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        웨이팅 취소하기
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};