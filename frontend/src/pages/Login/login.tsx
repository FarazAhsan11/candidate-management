import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (authLoading) return;

        if (user) {
            const from = location.state?.from?.pathname || '/';
            
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [user, navigate, location, authLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({ email, password });
            toast.success('Login successful!');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
             <div className="min-h-screen bg-gray-50 w-full flex items-start justify-center pt-20">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Test Credentials:</p>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                            <span className="font-medium">Admin:</span> admin@example.com / password123
                        </p>
                        <p className="text-xs text-gray-600">
                            <span className="font-medium">interviewer:</span> sara@example.com / sara123
                        </p>
                        <p className="text-xs text-gray-600">
                            <span className="font-medium">hr:</span> adil@example.com / adil123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
