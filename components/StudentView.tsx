
import React, { useState, useEffect, useMemo } from 'react';
import { Book, Student, Loan } from '../types';
import { MOCK_BOOKS, MOCK_LOANS, MOCK_STUDENTS } from '../constants';
import { SunIcon, MoonIcon, BookOpenIcon, HomeIcon } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Lunar calendar conversion - simplified
const convertToLunar = (date: Date) => {
    const J2000 = 2451545.0;
    const JD = date.getTime() / 86400000.0 + 2440587.5;
    const day = JD - J2000;
    const newMoon = 2.55979 * Math.pow(10, -3) * Math.pow(day, 2) + 0.20904 * day - 1.9449;
    const moonPhase = newMoon - Math.floor(newMoon);
    const lunarDay = Math.floor(moonPhase * 30) + 1;
    let lunarMonth = new Date(date.getFullYear(), 0, 1).getTime() < new Date(date).getTime()
        ? new Date(date).getMonth() + 1
        : new Date(date).getMonth();
    if (lunarDay > 20) lunarMonth++;
    if (lunarMonth > 12) lunarMonth = 1;

    return { day: lunarDay, month: lunarMonth };
};

const Header: React.FC<{ onLogout: () => void; }> = ({ onLogout }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-8 h-8 text-primary-500"/>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Thư Viện Genz</h1>
            </div>
            <div className="flex items-center space-x-4">
                 <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isDarkMode ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
                </button>
                <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    Đăng xuất
                </button>
            </div>
        </header>
    );
};

const DateTimeWeather: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        
        const fetchWeather = async () => {
            try {
                // Phú Thượng, Võ Nhai, Thái Nguyên coordinates
                const lat = 21.7589;
                const lon = 105.8333;
                // NOTE: Replace with your actual OpenWeatherMap API key
                const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
                if(apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
                    console.warn("Using mock weather data. Please replace 'YOUR_OPENWEATHERMAP_API_KEY' with a real key.");
                    setWeather({
                        main: { temp: 28 },
                        weather: [{ description: 'mây rải rác', icon: '03d' }],
                    });
                    return;
                }
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`);
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
                 setWeather({
                    main: { temp: 28 },
                    weather: [{ description: 'mây rải rác', icon: '03d' }],
                });
            }
        };

        fetchWeather();
        const weatherIntervalId = setInterval(fetchWeather, 10 * 60 * 1000); // 10 minutes

        return () => {
            clearInterval(timerId);
            clearInterval(weatherIntervalId);
        };
    }, []);

    const gregorianDate = time.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentTime = time.toLocaleTimeString('vi-VN');
    const lunarDate = convertToLunar(time);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
                <p className="text-lg text-gray-500 dark:text-gray-400">Dương lịch: {gregorianDate}</p>
                <p className="text-lg text-gray-500 dark:text-gray-400">Âm lịch: Ngày {lunarDate.day} tháng {lunarDate.month}</p>
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 tracking-wider">{currentTime}</p>
            </div>
            {weather ? (
                <div className="text-right">
                    <p className="text-lg font-semibold">Phú Thượng, Võ Nhai, Thái Nguyên</p>
                    <div className="flex items-center justify-end space-x-2">
                        <span className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</span>
                         <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" className="w-16 h-16"/>
                    </div>
                    <p className="capitalize">{weather.weather[0].description}</p>
                </div>
            ) : <p>Đang tải thời tiết...</p>}
        </div>
    );
};

const HomePage: React.FC = () => {
    const topBorrowers = useMemo(() => {
        const counts: { [key: string]: number } = {};
        MOCK_LOANS.forEach(loan => {
            counts[loan.studentId] = (counts[loan.studentId] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([studentId, count]) => ({
                name: MOCK_STUDENTS.find(s => s.id === studentId)?.name || 'N/A',
                count,
            }));
    }, []);

    const topBooks = useMemo(() => {
        const counts: { [key: string]: number } = {};
        MOCK_LOANS.forEach(loan => {
            counts[loan.bookId] = (counts[loan.bookId] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([bookId, count]) => ({
                name: MOCK_BOOKS.find(b => b.id === bookId)?.title || 'N/A',
                count,
            }));
    }, []);

    return (
        <div className="space-y-8 p-4 md:p-8">
            <DateTimeWeather />
            <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg">
                <iframe
                    className="w-full h-full border-0"
                    src="https://embed.windy.com/embed.html?type=map&location=true&metricWind=km%2Fh&metricTemp=%C2%B0C&metricRain=mm&zoom=10&lat=21.759&lon=105.833&product=rain&level=surface&overlay=rain"
                    allowFullScreen
                    title="Windy Map"
                ></iframe>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Top 5 người mượn nhiều nhất tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topBorrowers} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                            <Legend />
                            <Bar dataKey="count" name="Số lượt mượn" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Top 5 sách được mượn nhiều nhất tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topBooks} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                            <Legend />
                            <Bar dataKey="count" name="Số lượt mượn" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const BorrowReturnPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [studentName, setStudentName] = useState('');
    const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState('');

    const filteredBooks = MOCK_BOOKS.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (borrowDate) {
            const date = new Date(borrowDate);
            date.setDate(date.getDate() + 15); // Default 15 days loan
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            setReturnDate(`${day}/${month}`);
        }
    }, [borrowDate]);

    const maxBorrowDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 45);
        return date.toISOString().split('T')[0];
    }, []);

    const handleBorrow = (bookTitle: string) => {
        if (!studentName) {
            alert("Vui lòng nhập tên học sinh!");
            return;
        }
        alert(`Học sinh ${studentName} đã mượn sách "${bookTitle}" thành công. Ngày trả dự kiến: ${returnDate}.`);
        setStudentName('');
        setSearchTerm('');
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Mượn sách</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input
                        type="text"
                        placeholder="Nhập tên học sinh..."
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-500 focus:outline-none"
                    />
                    <input
                        type="date"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        max={maxBorrowDate}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-500 focus:outline-none"
                    />
                </div>
                {borrowDate && <p className="mb-4 text-lg">Ngày trả dự kiến: <span className="font-bold text-primary-500">{returnDate}</span></p>}
                <input
                    type="text"
                    placeholder="Tìm kiếm sách cần mượn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-500 focus:outline-none"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                    <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="font-bold text-lg truncate">{book.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                            <p className={`text-sm mt-2 ${book.available > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {book.available > 0 ? `Có sẵn: ${book.available}` : 'Đã hết'}
                            </p>
                            <button 
                                onClick={() => handleBorrow(book.title)}
                                disabled={book.available === 0}
                                className="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Mượn sách
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StudentView: React.FC<{ onLogout: () => void; }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header onLogout={onLogout} />
            <nav className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16">
                        <div className="flex items-center space-x-8">
                             <button
                                onClick={() => setActiveTab('home')}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'home' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <HomeIcon className="w-5 h-5 mr-2" />
                                Trang chủ
                            </button>
                             <button
                                onClick={() => setActiveTab('borrow')}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'borrow' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <BookOpenIcon className="w-5 h-5 mr-2" />
                                Mượn / Trả sách
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                {activeTab === 'home' && <HomePage />}
                {activeTab === 'borrow' && <BorrowReturnPage />}
            </main>
        </div>
    );
};
