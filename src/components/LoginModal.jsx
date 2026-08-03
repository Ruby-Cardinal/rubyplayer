import React, { useState } from 'react';
import { X, User, Lock, LogIn, Key, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginUser, setInitialPassword } from '../services/mediaService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mustReset, setMustReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUserData, setCurrentUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await loginUser(username.trim(), password);

      if (res.mustResetPassword) {
        setMustReset(true);
        setCurrentUserData(res.user);
        setError(null);
      } else {
        onLoginSuccess(res.user);
        resetState();
        onClose();
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await setInitialPassword(newPassword);
      onLoginSuccess(currentUserData);
      resetState();
      onClose();
    } catch (err) {
      setError('Failed to set password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setUsername('');
    setPassword('');
    setMustReset(false);
    setNewPassword('');
    setConfirmPassword('');
    setCurrentUserData(null);
    setError(null);
  };

  const handleCloseModal = () => {
    resetState();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', width: '90%' }}
      >
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {mustReset ? (
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
            ) : (
              <User size={20} style={{ color: 'var(--accent-ruby)' }} />
            )}
            <span>{mustReset ? 'Set Account Password' : 'User Authentication'}</span>
          </div>
          <button className="modal-close-btn" onClick={handleCloseModal} title="Close">
            <X size={18} />
          </button>
        </div>

        {mustReset ? (
          <form onSubmit={handlePasswordSetSubmit} style={{ marginTop: '0.5rem' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: 'var(--radius-sm, 6px)',
                padding: '0.75rem 0.9rem',
                color: '#6ee7b7',
                fontSize: '0.82rem',
                lineHeight: '1.45',
                marginBottom: '1.25rem',
              }}
            >
              Welcome <strong>{currentUserData?.username}</strong>! This is your first time logging in. Please create a password for your account.
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1.3rem',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <ShieldCheck size={16} />
                <span>{isSubmitting ? 'Saving Password...' : 'Save Password & Log In'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Unlock playlists and enable downloads by logging in!
            </p>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (leave blank for new users)"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-icon"
                onClick={handleCloseModal}
                style={{ width: 'auto', padding: '0 1.1rem', borderRadius: 'var(--radius-md)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--accent-ruby)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1.3rem',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-ruby)',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <LogIn size={16} />
                <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
