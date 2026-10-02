import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { getApiErrorMessage } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    city: user?.city ?? '',
    phone: user?.phone ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    return errs;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await userApi.updateUser({
        id: user.id,
        name: form.name,
        email: form.email,
        city: form.city,
        phone: form.phone,
      });
      // Preserve JWT from current auth
      updateUser({ ...res.data, jwt: user.jwt });
      toast.success('Profile updated successfully');
      setEditOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userApi.deleteUser(user.id);
      toast.success('Account deleted');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Profile</h1>

      <div className="glass p-8 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <div className="mt-1.5">
              {user.role === 'ADMIN' ? (
                <Badge variant="admin"><ShieldCheck size={10} className="mr-1" /> Admin</Badge>
              ) : (
                <Badge variant="info">Customer</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'User ID', value: `#${user.id}` },
            { label: 'Role', value: user.role },
            { label: 'City', value: user.city },
            { label: 'Phone', value: user.phone },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="text-sm font-medium text-slate-200">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={() => setEditOpen(true)} variant="outline" className="flex items-center gap-2">
            <Edit3 size={15} /> Edit Profile
          </Button>
          <Button onClick={() => setDeleteOpen(true)} variant="danger" className="flex items-center gap-2">
            <Trash2 size={15} /> Delete Account
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="md">
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} id="prof-name" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} id="prof-email" />
          <Input label="City" value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} error={errors.city} id="prof-city" />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} id="prof-phone" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setEditOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" loading={loading}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmLabel="Delete Account"
        loading={deleting}
      />
    </div>
  );
}
