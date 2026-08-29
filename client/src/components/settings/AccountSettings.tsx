import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { apiRequest } from '../../services/api';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Button } from '../ui/Button';

interface MeResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function AccountSettings() {
  const navigate = useNavigate();
  const { user, accessToken, updateUser } = useAuthStore();
  const clearAuth = useAuthStore((s) => s.logout);

  // ── Profile ──────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    if (!accessToken) return;
    setSavingProfile(true);
    try {
      const res = await apiRequest<MeResponse>('/auth/me', {
        method: 'PATCH',
        token: accessToken,
        body: JSON.stringify({ name: displayName.trim() }),
      });
      updateUser(res.user as never);
      toast.success('Profile updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change Password ───────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword]   = useState(false);

  const handleChangePassword = async () => {
    if (!accessToken) return;
    if (newPassword.length < 12) {
      toast.error('New password must be at least 12 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        token: accessToken,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Delete Account ────────────────────────────────────────────
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!accessToken) return;
    setDeleting(true);
    try {
      await apiRequest('/auth/me', {
        method: 'DELETE',
        token: accessToken,
      });
      await clearAuth();
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete account';
      toast.error(msg);
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── Profile ── */}
      <section>
        <h2 className="mb-1 text-base font-semibold text-[#111827]">Profile</h2>
        <p className="mb-4 text-sm text-[#6b7280]">Update your public display name.</p>

        <div className="space-y-4">
          <div>
            <label className="label mb-1 block">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="input-base w-full max-w-sm opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="display-name" className="label mb-1 block">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="input-base w-full max-w-sm"
            />
          </div>

          <div>
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile || displayName.trim() === (user?.name ?? '')}
            >
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-[#e5e7eb]" />

      {/* ── Change Password ── */}
      <section>
        <h2 className="mb-1 text-base font-semibold text-[#111827]">Change Password</h2>
        <p className="mb-4 text-sm text-[#6b7280]">Choose a strong password of at least 8 characters.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="label mb-1 block">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input-base w-full max-w-sm"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="label mb-1 block">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              className="input-base w-full max-w-sm"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="label mb-1 block">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              className="input-base w-full max-w-sm"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1.5 text-xs text-[#dc2626]">Passwords do not match</p>
            )}
          </div>

          <div>
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {savingPassword ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-[#e5e7eb]" />

      {/* ── Danger Zone ── */}
      <section>
        <h2 className="mb-1 text-base font-semibold text-[#111827]">Danger Zone</h2>
        <p className="mb-4 text-sm text-[#6b7280]">Irreversible and destructive actions.</p>

        <div className="danger-zone">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#111827]">Delete Account</p>
              <p className="mt-0.5 text-sm text-[#6b7280]">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleting}
              className="shrink-0"
            >
              {deleting ? 'Deleting…' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? All your opportunities and settings will be lost. This action cannot be undone."
        confirmLabel="Yes, Delete My Account"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
