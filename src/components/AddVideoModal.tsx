import React, { useState } from 'react';
import { useMobileView } from '../context/MobileViewContext';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

// Updated regex to support both standard and shortened YouTube URLs
const YOUTUBE_REGEX = /^(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+|https:\/\/youtu\.be\/[\w-]+)/;

const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const { isMobileView } = useMobileView();

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!YOUTUBE_REGEX.test(url.trim())) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    // Convert shortened URL to standard format if needed
    let cleanUrl = url.trim();
    if (cleanUrl.includes('youtu.be')) {
      const videoId = cleanUrl.split('/').pop()?.split('?')[0];
      cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      cleanUrl = cleanUrl.split('&')[0];
    }
    onSubmit(cleanUrl);
    setUrl('');
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(20,20,20,0.7)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobileView ? '16px' : '0',
  };

  const modalContentStyle = {
    background: 'rgba(20, 20, 20, 0.95)',
    borderRadius: isMobileView ? '16px' : '24px',
    padding: isMobileView ? '24px' : '40px',
    width: isMobileView ? '100%' : '600px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: isMobileView ? '12px' : '16px',
    right: isMobileView ? '12px' : '16px',
    background: 'none',
    border: 'none',
    color: '#DFD0B8',
    fontSize: isMobileView ? '24px' : '28px',
    cursor: 'pointer',
    padding: isMobileView ? '8px' : '0',
  };

  const titleStyle = {
    fontFamily: 'Lora, serif',
    fontSize: isMobileView ? '24px' : '32px',
    color: '#DFD0B8',
    marginBottom: isMobileView ? '16px' : '24px',
    textAlign: 'center' as const,
  };

  const inputStyle = {
    width: '100%',
    height: isMobileView ? '40px' : '48px',
    borderRadius: isMobileView ? '8px' : '12px',
    border: '1px solid rgba(223, 208, 184, 0.2)',
    backgroundColor: 'rgba(223, 208, 184, 0.05)',
    color: '#DFD0B8',
    fontSize: isMobileView ? '16px' : '18px',
    fontFamily: 'Lora, serif',
    padding: '0 16px',
    outline: 'none',
    marginBottom: '16px',
  };

  const errorStyle = {
    color: '#ff4d4f',
    fontFamily: 'Lora, serif',
    fontSize: isMobileView ? '12px' : '14px',
    marginBottom: '16px',
    padding: isMobileView ? '6px' : '8px',
    background: 'rgba(255, 77, 79, 0.1)',
    borderRadius: isMobileView ? '6px' : '8px',
    border: '1px solid rgba(255, 77, 79, 0.2)',
    textAlign: 'center' as const,
    width: '100%',
  };

  const submitButtonStyle = {
    width: '100%',
    height: isMobileView ? '40px' : '48px',
    borderRadius: isMobileView ? '8px' : '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
    color: '#141414',
    fontSize: isMobileView ? '16px' : '20px',
    fontFamily: 'Lora, serif',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          aria-label="Close"
        >
          ×
        </button>
        <h2 style={titleStyle}>Add a YouTube Video</h2>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={inputStyle}
        />
        {error && (
          <div style={errorStyle}>{error}</div>
        )}
        <button
          onClick={handleAdd}
          style={submitButtonStyle}
        >
          Add Video
        </button>
      </div>
    </div>
  );
};

export default AddVideoModal; 