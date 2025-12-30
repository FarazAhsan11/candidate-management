import { useAuth } from '../../context/authContext';
import { Button } from '../../components/ui/button';
import { LogOut, Users, FileText, Clock, UserPlus, KeyRound, MoreVertical, User, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AddUserModal from './Actions/addUser';
import ChangePasswordModal from '../../components/changePassword';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface AdminStats {
    totalUsers: number;
    totalCandidates: number;
    pendingReviews: number;
}

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalCandidates: 0,
        pendingReviews: 0
    });
    const [loading, setLoading] = useState(true);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully!');
        navigate('/login', { replace: true });
    };

    const handleUserAdded = () => {
        fetchStats();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome back, {user?.name}
                            </p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {user?.name || user?.email}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded">
                                        Admin
                                    </span>
                                    <MoreVertical className="w-4 h-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => setIsChangePasswordModalOpen(true)}>
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? '-' : stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Candidates</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? '-' : stats.totalCandidates}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? '-' : stats.pendingReviews}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Admin Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            className="justify-start"
                            variant="outline"
                            onClick={() => setIsAddUserModalOpen(true)}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                        <Button
                            className="justify-start"
                            variant="outline"
                            onClick={() => navigate('/admin/manage-users')}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Manage Users
                        </Button>
                        <Button className="justify-start" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            View All Candidates
                        </Button>
                        <Button className="justify-start" variant="outline">
                            <BarChart className="w-4 h-4 mr-2" />
                            View Analytics
                        </Button>
                    </div>
                </div>
            </div>

            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onUserAdded={handleUserAdded}
            />

            <ChangePasswordModal
                open={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />
        </div>
    );
};

export default AdminDashboard;
