
import React, { useState, useMemo, ChangeEvent, useRef } from 'react';
import { Book, Student, Loan, Equipment } from '../types';
import { MOCK_BOOKS, MOCK_LOANS, MOCK_STUDENTS, MOCK_EQUIPMENT } from '../constants';
import { HomeIcon, BookIcon, UsersIcon, LaptopIcon, UploadCloudIcon } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseDataWithGemini } from '../services/geminiService';

declare var XLSX: any;

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; onLogout: () => void; }> = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Trang chủ', icon: <HomeIcon className="w-5 h-5" /> },
        { id: 'books', label: 'Quản lý sách', icon: <BookIcon className="w-5 h-5" /> },
        { id: 'students', label: 'Quản lý học sinh', icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'equipment', label: 'Quản lý thiết bị', icon: <LaptopIcon className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col h-screen fixed">
            <div className="p-6 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
                <BookIcon className="w-8 h-8 text-primary-500"/>
                <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeTab === item.id 
                            ? 'bg-primary-500 text-white shadow-md' 
                            : 'hover:bg-primary-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onLogout} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; onClick?: () => void; }> = ({ title, value, icon, onClick }) => (
    <div 
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);

const OverdueDetailModal: React.FC<{ loans: Loan[], students: Student[], books: Book[], onClose: () => void }> = ({ loans, students, books, onClose }) => {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const overdueStudents = useMemo(() => {
        const studentLoanMap: { [key: string]: { student: Student, books: Book[] } } = {};
        loans.forEach(loan => {
            if (!studentLoanMap[loan.studentId]) {
                 const student = students.find(s => s.id === loan.studentId);
                 if (student) {
                    studentLoanMap[loan.studentId] = { student, books: [] };
                 }
            }
             const book = books.find(b => b.id === loan.bookId);
             if (book) {
                studentLoanMap[loan.studentId].books.push(book);
             }
        });
        return Object.values(studentLoanMap);
    }, [loans, students, books]);
    
    const selectedStudentDetails = selectedStudentId ? overdueStudents.find(s => s.student.id === selectedStudentId) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Chi tiết mượn quá hạn</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {selectedStudentDetails ? (
                        <div>
                            <button onClick={() => setSelectedStudentId(null)} className="mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">&larr; Quay lại danh sách</button>
                            <h3 className="text-2xl font-bold mb-2">{selectedStudentDetails.student.name}</h3>
                            <p><strong>Lớp:</strong> {selectedStudentDetails.student.class}</p>
                            <p><strong>Email:</strong> {selectedStudentDetails.student.email}</p>
                            <p><strong>SĐT:</strong> {selectedStudentDetails.student.phone}</p>
                            <h4 className="text-lg font-semibold mt-4 mb-2">Sách mượn quá hạn:</h4>
                            <ul className="list-disc list-inside">
                                {selectedStudentDetails.books.map(book => <li key={book.id}>{book.title}</li>)}
                            </ul>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="p-3">Họ Tên</th>
                                    <th className="p-3">Lớp</th>
                                    <th className="p-3">Số sách quá hạn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overdueStudents.map(({ student, books }) => (
                                    <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>
                                        <td className="p-3 font-medium text-primary-600 dark:text-primary-400">{student.name}</td>
                                        <td className="p-3">{student.class}</td>
                                        <td className="p-3">{books.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const [showOverdueModal, setShowOverdueModal] = useState(false);

    const stats = useMemo(() => {
        const onLoan = MOCK_LOANS.filter(l => !l.returnDate).length;
        const overdue = MOCK_LOANS.filter(l => !l.returnDate && new Date(l.dueDate) < new Date()).length;
        return {
            totalBooks: MOCK_BOOKS.reduce((sum, book) => sum + book.total, 0),
            totalStudents: MOCK_STUDENTS.length,
            onLoan,
            overdue,
        };
    }, []);
    
    const overdueLoans = useMemo(() => MOCK_LOANS.filter(l => !l.returnDate && new Date(l.dueDate) < new Date()), []);

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
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng số sách" value={stats.totalBooks} icon={<BookIcon className="w-6 h-6 text-blue-500" />} />
                <StatCard title="Tổng số học sinh" value={stats.totalStudents} icon={<UsersIcon className="w-6 h-6 text-green-500" />} />
                <StatCard title="Sách đang mượn" value={stats.onLoan} icon={<BookIcon className="w-6 h-6 text-yellow-500" />} />
                <StatCard title="Mượn quá hạn" value={stats.overdue} icon={<BookIcon className="w-6 h-6 text-red-500" />} onClick={() => setShowOverdueModal(true)}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Top 5 học sinh mượn nhiều nhất</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topBorrowers}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Lượt mượn" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Top 5 sách được mượn nhiều nhất</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topBooks}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Lượt mượn" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {showOverdueModal && <OverdueDetailModal loans={overdueLoans} students={MOCK_STUDENTS} books={MOCK_BOOKS} onClose={() => setShowOverdueModal(false)} />}
        </div>
    );
};

const ManageGeneric: React.FC<{
  title: string;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  columns: { key: string; label: string }[];
  dataType: 'student' | 'book';
}> = ({ title, data, setData, columns, dataType }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const csvData = XLSX.utils.sheet_to_csv(worksheet);
            
            const parsedData = await parseDataWithGemini<any>(csvData, dataType);
            if (parsedData) {
                // simple merge, replace existing or add new
                setData(prevData => {
                    const existingIds = new Set(prevData.map(item => item.id));
                    const newData = parsedData.filter(item => !existingIds.has(item.id));
                    return [...prevData, ...newData];
                });

                alert(`Đã thêm thành công ${parsedData.length} mục mới từ file.`);
            }
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };
    
    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold">{title}</h1>
                 <div className="flex space-x-2">
                     <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">Thêm thủ công</button>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls, .csv" className="hidden" />
                     <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isLoading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 disabled:bg-gray-400"
                    >
                         {isLoading ? 'Đang xử lý...' : <><UploadCloudIcon className="w-5 h-5" /><span>Nhập từ Excel</span></>}
                     </button>
                 </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            {columns.map(col => <th key={col.key} className="p-4 font-semibold">{col.label}</th>)}
                            <th className="p-4 font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900">
                                {columns.map(col => <td key={col.key} className="p-4">{item[col.key]}</td>)}
                                <td className="p-4 space-x-2">
                                    <button className="text-blue-500 hover:underline">Sửa</button>
                                    <button className="text-red-500 hover:underline">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AdminView: React.FC<{ onLogout: () => void; }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
    const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'students':
                return <ManageGeneric 
                    title="Quản lý học sinh"
                    data={students}
                    setData={setStudents}
                    columns={[
                        { key: 'id', label: 'MHS' },
                        { key: 'name', label: 'Họ Tên' },
                        { key: 'class', label: 'Lớp' },
                        { key: 'email', label: 'Email' },
                        { key: 'phone', label: 'SĐT' },
                    ]}
                    dataType="student"
                />;
            case 'books':
                 return <ManageGeneric 
                    title="Quản lý sách"
                    data={books}
                    setData={setBooks}
                    columns={[
                        { key: 'id', label: 'Mã sách' },
                        { key: 'title', label: 'Tên sách' },
                        { key: 'author', label: 'Tác giả' },
                        { key: 'total', label: 'Tổng số' },
                        { key: 'available', label: 'Có sẵn' },
                    ]}
                    dataType="book"
                />;
            case 'equipment':
                return <ManageGeneric 
                    title="Quản lý thiết bị"
                    data={equipment}
                    setData={setEquipment}
                    columns={[
                        { key: 'id', label: 'ID' },
                        { key: 'name', label: 'Tên thiết bị' },
                        { key: 'quantity', label: 'Số lượng' },
                        { key: 'status', label: 'Tình trạng' },
                    ]}
                    dataType="student" // Using student as a placeholder, not enabling AI for this
                />;
            default:
                return <Dashboard />;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            <main className="flex-grow ml-64">
                {renderContent()}
            </main>
        </div>
    );
};
