import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: 'calc(100vh - 97px)',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
      color: '#DFD0B8',
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '5%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />
      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 97px)',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h1 style={{
            fontFamily: 'Alfa Slab One, serif',
            fontSize: 'clamp(60px, 10vw, 150px)',
            fontWeight: 'normal',
            color: '#DFD0B8',
            lineHeight: '1.1',
            letterSpacing: '0',
            margin: '0 0 20px 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            Feeling Bored?
          </h1>
          <p style={{
            fontFamily: 'Bellefair, serif',
            fontWeight: '400',
            fontSize: 'clamp(24px, 3vw, 36px)',
            color: '#DFD0B8',
            opacity: '0.6',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Discover videos worth your time, curated by real people.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
              color: '#141414',
              border: 'none',
              borderRadius: 16,
              padding: '18px 48px',
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'Lora, serif',
              cursor: 'pointer',
              marginRight: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
            }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
          <button
            style={{
              background: 'rgba(223, 208, 184, 0.1)',
              color: '#DFD0B8',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: 16,
              padding: '18px 48px',
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'Lora, serif',
              cursor: 'pointer',
              marginLeft: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
            onClick={() => navigate('/discover')}
          >
            Discover
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Landing; 