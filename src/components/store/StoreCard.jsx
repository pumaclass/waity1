import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
    // Early return if no store data
    if (!store) return null;

    // Destructure with default values
    const {
        id = '',
        image = '',
        title = '',
        description = '',
        rating = 0,
        reviewCount = 0,
        address = '',
        openTime = '09:00:00',
        closeTime = '22:00:00',
        isOpen = false,
        distance = null
    } = store;

    const formatTime = (time) => {
        try {
            return new Date(`2000-01-01T${time}`).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch {
            return '00:00';
        }
    };

    const formatRating = (value) => {
        const numericRating = Number(value) || 0;
        return numericRating.toFixed(1);
    };

    const formatDistance = (value) => {
        if (typeof value !== 'number') return null;
        return value < 1 ?
            `${(value * 1000).toFixed(0)}m` :
            `${value.toFixed(1)}km`;
    };

    return (
        <Link to={`/stores/${id}`} className="block">
            <div className="bg-white border-b last:border-b-0">
                <div className="relative aspect-video">
                    <img
                        src={image || '/placeholder-store.jpg'}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {distance !== null && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-60 rounded text-white text-xs">
                            {formatDistance(distance)}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{title}</h3>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                                {formatRating(rating)}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                                ({reviewCount})
                            </span>
                        </div>
                    </div>

                    {description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {description}
                        </p>
                    )}

                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                                {formatTime(openTime)} - {formatTime(closeTime)}
                            </span>
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                                isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {isOpen ? '영업중' : '영업종료'}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="line-clamp-1">{address}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;