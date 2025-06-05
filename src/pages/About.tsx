import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#DFD0B8', fontFamily: 'Lora, serif' }}>
      {/* Header/Nav */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{ position: 'absolute', left: 19, top: 21, width: 'auto', height: 60, zIndex: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')} />
      <div style={{ width: '100%', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 97 }}>
        <div style={{ display: 'flex', gap: 15, fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 700, marginLeft: 983 }}>
          <span style={{ opacity: 0.6, cursor: 'pointer' }} onClick={() => navigate('/home')}>HOME</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/discover')}>DISCOVER</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/profile')}>PROFILE</span>
          <span style={{ opacity: 1, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/about')}>ABOUT</span>
        </div>
      </div>
      {/* About Content */}
      <div style={{ maxWidth: 800, margin: '120px auto 0 auto', padding: 32, background: 'rgba(33,15,55,0.7)', borderRadius: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
        <h1 style={{ fontFamily: 'Bellefair, serif', fontSize: 64, fontWeight: 400, marginBottom: 24 }}>About Feel Bored</h1>
        <p style={{ fontSize: 22, lineHeight: 1.5, marginBottom: 24 }}>
          <b>Feel Bored</b> is a curated video discovery platform inspired by the best of Letterboxd and YouTube. Our mission is to help you find videos worth your time, recommended by a thoughtful community. Discover, share, and discuss videos in a premium, minimalist, and distraction-free environment.
        </p>
        <p style={{ fontSize: 20, color: '#FFD700', marginBottom: 16 }}>
          Built with React, TypeScript, and a custom backend. Designed with love and a focus on content, not noise.
        </p>
        <p style={{ fontSize: 18, color: '#A0A0A0', marginBottom: 16 }}>
          Inspired by Letterboxd, Are.na, and the golden age of YouTube.
        </p>
        <a href="https://github.com/naanroti/anv" target="_blank" rel="noopener noreferrer" style={{ color: '#DFD0B8', fontWeight: 700, fontSize: 20, textDecoration: 'underline' }}>View on GitHub</a>
      </div>
    </div>
  );
};

export default About; 