import React, { useState } from 'react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

const YOUTUBE_REGEX = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/;

const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!YOUTUBE_REGEX.test(url.trim())) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    const cleanUrl = url.trim().split('&')[0];
    onSubmit(cleanUrl);
    setUrl('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(20,20,20,0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(20, 20, 20, 0.95)',
        borderRadius: 24,
        padding: 40,
        minWidth: 400,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#DFD0B8',
            fontSize: 28,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 style={{
          fontFamily: 'Alfa Slab One, serif',
          fontSize: 32,
          color: '#DFD0B8',
          marginBottom: 24,
        }}>Add a YouTube Video</h2>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: '1px solid rgba(223, 208, 184, 0.2)',
            backgroundColor: 'rgba(223, 208, 184, 0.05)',
            color: '#DFD0B8',
            fontSize: 18,
            fontFamily: 'Lora, serif',
            padding: '0 16px',
            outline: 'none',
            marginBottom: 16,
          }}
        />
        {error && (
          <div style={{
            color: '#ff4d4f',
            fontFamily: 'Lora, serif',
            fontSize: 14,
            marginBottom: 16,
            padding: 8,
            background: 'rgba(255, 77, 79, 0.1)',
            borderRadius: 8,
            border: '1px solid rgba(255, 77, 79, 0.2)',
            textAlign: 'center',
            width: '100%',
          }}>{error}</div>
        )}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
            color: '#141414',
            fontSize: 20,
            fontFamily: 'Lora, serif',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Add Video
        </button>
      </div>
    </div>
  );
};

export default AddVideoModal; 