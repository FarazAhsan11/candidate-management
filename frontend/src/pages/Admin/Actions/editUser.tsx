import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';
import { adminService } from '../../../services/adminService';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'hr' | 'interviewer';
}

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
    user: User | null;
}

const EditUserModal = ({ open, onClose, onUserUpdated, user }: EditUserModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user' as 'user' | 'admin' | 'hr' | 'interviewer',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!formData.name || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await adminService.updateUser(user._id, updateData);
            toast.success('User updated successfully!');
            onUserUpdated();
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update user';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', role: 'user', password: '' });
        onClose();
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter user's full name"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@example.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password (leave blank to keep current)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter new password (optional)"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500">
                            Only fill this if you want to change the password
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="interviewer">Interviewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;
