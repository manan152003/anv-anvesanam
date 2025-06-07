import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updatedUser = await updateProfile({
        name: name !== user?.name ? name : undefined,
        bio: bio !== user?.bio ? bio : undefined,
        avatarUrl: avatarUrl !== user?.avatarUrl ? avatarUrl : undefined,
      });

      setUser(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1A1A1A',
        borderRadius: 32,
        padding: 32,
        width: '100%',
        maxWidth: 480,
        border: '2px solid #DFD0B8',
      }}>
        <h2 style={{
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
          fontSize: 32,
          marginBottom: 24,
        }}>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: 8,
              fontFamily: 'Lora, serif',
            }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: 8,
              fontFamily: 'Lora, serif',
            }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                minHeight: 100,
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: 8,
              fontFamily: 'Lora, serif',
            }}>Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#ff4d4f',
              marginBottom: 16,
              fontFamily: 'Lora, serif',
            }}>{error}</div>
          )}

          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                border: '2px solid #DFD0B8',
                background: 'transparent',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#DFD0B8',
                color: '#141414',
                fontFamily: 'Lora, serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 