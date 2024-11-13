import React, {useEffect, useState} from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {formatDate} from '../../common/common'
import {SUMMARY_DATE} from '../../constants/const';

// 필요한 스케일 및 요소 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const Dashboard = () => {
    const [timeFrame, setTimeFrame] = useState(SUMMARY_DATE.DAY);
    const [startDate, setStartDate] = useState(formatDate(new Date() , 'yyyy-mm-dd'));
    const [endDate, setEndDate] = useState(formatDate(new Date() , 'yyyy-mm-dd'));

    useEffect(() => {

    } , [startDate , endDate])

    const data = {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [
            {
                type: 'line',
                label: '예약 건수',
                data: [12, 19, 3, 5, 2, 3, 15],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
            {
                type: 'bar',
                label: '웨이팅 건수',
                data: [5, 10, 6, 8, 3, 7, 12],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                type: 'category',
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mx-auto p-6">
            {/* 개요 섹션 */}
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800">개요</h1>
            </header>

            {/* 오늘 예약 건수 및 현재 웨이팅 건수 섹션 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700">오늘 예약 건수</h2>
                    <p className="text-4xl font-bold text-blue-600">10</p> {/* 예시 숫자 */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700">현재 웨이팅 건수</h2>
                    <p className="text-4xl font-bold text-blue-600">5</p> {/* 예시 숫자 */}
                </div>
            </div>

            {/* 차트 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">예약 추세</h2>
                <div className="flex items-center mb-4 space-x-4">
                    <select
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value={SUMMARY_DATE.DAY}>일</option>
                        <option value={SUMMARY_DATE.WEEK}>주</option>
                        <option value={SUMMARY_DATE.MONTH}>월</option>
                    </select>
                    <div className="flex space-x-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <span className="self-center">~</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">선택된 날짜: {startDate} ~ {endDate}</p>
                </div>
                {/* 차트 영역 */}
                <div className="h-64">
                    <Line data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
