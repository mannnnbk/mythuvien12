
import React, { useState } from 'react';
import { StudentView } from './components/StudentView';
import { AdminView } from './components/AdminView';

const Login: React.FC<{ onLogin: (password: string) => void, error: string }> = ({ onLogin, error }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Chào mừng đến với Thư Viện</h1>
                <p className="text-center text-gray-600 dark:text-gray-400">Chọn vai trò của bạn để tiếp tục</p>
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">Đăng nhập quản trị</h2>
                     <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg dark:text-white dark:bg-gray-700 focus:outline-none focus:border-primary-500"
                                placeholder="Mật khẩu"
                            />
                        </div>
                         {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
                 <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">hoặc</p>
                    <button
                        onClick={() => onLogin('student_access')}
                        className="mt-2 w-full px-4 py-2 font-semibold text-primary-600 bg-primary-100 rounded-lg dark:text-primary-300 dark:bg-primary-900/50 hover:bg-primary-200 dark:hover:bg-primary-900"
                    >
                        Tiếp tục với tư cách học sinh
                    </button>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
    const [loginError, setLoginError] = useState('');

    const handleLogin = (password: string) => {
        if (password === 'loan1987') {
            setUserRole('admin');
            setLoginError('');
        } else if (password === 'student_access') {
            setUserRole('student');
            setLoginError('');
        }
        else {
            setLoginError('Mật khẩu không chính xác!');
        }
    };
    
    const handleLogout = () => {
        setUserRole(null);
    }

    if (!userRole) {
        return <Login onLogin={handleLogin} error={loginError} />;
    }

    if (userRole === 'admin') {
        return <AdminView onLogout={handleLogout} />;
    }

    return <StudentView onLogout={handleLogout} />;
}

export default App;
