import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { useMobileView } from '../context/MobileViewContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const isMobileView = useMobileView();
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
      padding: isMobileView ? '20px' : '0'
    }}>
      <div style={{
        background: '#1A1A1A',
        borderRadius: isMobileView ? '24px' : '32px',
        padding: isMobileView ? '24px' : '32px',
        width: '100%',
        maxWidth: isMobileView ? '100%' : '480px',
        border: '2px solid #DFD0B8',
        maxHeight: isMobileView ? '90vh' : 'auto',
        overflowY: 'auto'
      }}>
        <h2 style={{
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
          fontSize: isMobileView ? '24px' : '32px',
          marginBottom: isMobileView ? '20px' : '24px',
        }}>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: isMobileView ? '12px' : '16px' }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: isMobileView ? '6px' : '8px',
              fontFamily: 'Lora, serif',
              fontSize: isMobileView ? '14px' : '16px'
            }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: isMobileView ? '10px' : '12px',
                borderRadius: isMobileView ? '6px' : '8px',
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: isMobileView ? '14px' : '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: isMobileView ? '12px' : '16px' }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: isMobileView ? '6px' : '8px',
              fontFamily: 'Lora, serif',
              fontSize: isMobileView ? '14px' : '16px'
            }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: '100%',
                padding: isMobileView ? '10px' : '12px',
                borderRadius: isMobileView ? '6px' : '8px',
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                minHeight: isMobileView ? '80px' : '100px',
                resize: 'vertical',
                fontSize: isMobileView ? '14px' : '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: isMobileView ? '20px' : '24px' }}>
            <label style={{
              display: 'block',
              color: '#DFD0B8',
              marginBottom: isMobileView ? '6px' : '8px',
              fontFamily: 'Lora, serif',
              fontSize: isMobileView ? '14px' : '16px'
            }}>Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              style={{
                width: '100%',
                padding: isMobileView ? '10px' : '12px',
                borderRadius: isMobileView ? '6px' : '8px',
                border: '2px solid #DFD0B8',
                background: '#141414',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: isMobileView ? '14px' : '16px'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#ff4d4f',
              marginBottom: isMobileView ? '12px' : '16px',
              fontFamily: 'Lora, serif',
              fontSize: isMobileView ? '14px' : '16px'
            }}>{error}</div>
          )}

          <div style={{
            display: 'flex',
            gap: isMobileView ? '12px' : '16px',
            justifyContent: 'flex-end',
            flexDirection: isMobileView ? 'column' : 'row'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: isMobileView ? '10px 20px' : '8px 24px',
                borderRadius: isMobileView ? '6px' : '8px',
                border: '2px solid #DFD0B8',
                background: 'transparent',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                cursor: 'pointer',
                fontSize: isMobileView ? '14px' : '16px',
                width: isMobileView ? '100%' : 'auto'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: isMobileView ? '10px 20px' : '8px 24px',
                borderRadius: isMobileView ? '6px' : '8px',
                border: 'none',
                background: '#DFD0B8',
                color: '#141414',
                fontFamily: 'Lora, serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontSize: isMobileView ? '14px' : '16px',
                width: isMobileView ? '100%' : 'auto'
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