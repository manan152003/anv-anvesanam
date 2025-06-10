import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileView } from '../context/MobileViewContext';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isMobileView } = useMobileView();

  const containerStyle = {
    minHeight: 'calc(100vh - 97px)',
    background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
    color: '#DFD0B8',
    fontFamily: 'Lora, serif',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const backgroundElement1Style = {
    position: 'fixed' as const,
    top: isMobileView ? '5%' : '10%',
    right: isMobileView ? '5%' : '10%',
    width: isMobileView ? '200px' : '300px',
    height: isMobileView ? '200px' : '300px',
    background: 'radial-gradient(circle, rgba(223, 208, 184, 0.03) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
    zIndex: 0
  };

  const backgroundElement2Style = {
    position: 'fixed' as const,
    bottom: isMobileView ? '10%' : '20%',
    left: isMobileView ? '2%' : '5%',
    width: isMobileView ? '150px' : '200px',
    height: isMobileView ? '150px' : '200px',
    background: 'radial-gradient(circle, rgba(223, 208, 184, 0.02) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 8s ease-in-out infinite reverse',
    zIndex: 0
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 97px)',
    padding: isMobileView ? '20px 16px' : '40px 20px',
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const heroSectionStyle = {
    textAlign: 'center' as const,
    marginBottom: isMobileView ? '40px' : '80px',
    animation: 'fadeInUp 0.8s ease-out',
    padding: isMobileView ? '0 16px' : '0',
  };

  const titleStyle = {
    fontFamily: 'Alfa Slab One, serif',
    fontSize: isMobileView ? 'clamp(40px, 15vw, 80px)' : 'clamp(60px, 10vw, 150px)',
    fontWeight: 'normal',
    color: '#DFD0B8',
    lineHeight: '1.1',
    letterSpacing: '0',
    margin: '0 0 20px 0',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  };

  const subtitleStyle = {
    fontFamily: 'Bellefair, serif',
    fontWeight: '400',
    fontSize: isMobileView ? 'clamp(18px, 4vw, 24px)' : 'clamp(24px, 3vw, 36px)',
    color: '#DFD0B8',
    opacity: '0.6',
    maxWidth: isMobileView ? '100%' : '800px',
    margin: '0 auto',
    padding: isMobileView ? '0 16px' : '0',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: isMobileView ? 'column' as const : 'row' as const,
    gap: isMobileView ? 16 : 24,
    justifyContent: 'center',
    marginTop: isMobileView ? 24 : 32,
    width: isMobileView ? '100%' : 'auto',
    padding: isMobileView ? '0 16px' : '0',
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
    color: '#141414',
    border: 'none',
    borderRadius: 16,
    padding: isMobileView ? '16px 32px' : '18px 48px',
    fontSize: isMobileView ? 20 : 24,
    fontWeight: 700,
    fontFamily: 'Lora, serif',
    cursor: 'pointer',
    margin: isMobileView ? '0' : '0 12px 0 0',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
    width: isMobileView ? '100%' : 'auto',
  };

  const secondaryButtonStyle = {
    background: 'rgba(223, 208, 184, 0.1)',
    color: '#DFD0B8',
    border: '1px solid rgba(223, 208, 184, 0.2)',
    borderRadius: 16,
    padding: isMobileView ? '16px 32px' : '18px 48px',
    fontSize: isMobileView ? 20 : 24,
    fontWeight: 700,
    fontFamily: 'Lora, serif',
    cursor: 'pointer',
    margin: isMobileView ? '0' : '0 0 0 12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    width: isMobileView ? '100%' : 'auto',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundElement1Style} />
      <div style={backgroundElement2Style} />
      <div style={mainContentStyle}>
        <div style={heroSectionStyle}>
          <h1 style={titleStyle}>
            Feeling Bored?
          </h1>
          <p style={subtitleStyle}>
            Discover videos worth your time, curated by real people.
          </p>
        </div>
        <div style={buttonContainerStyle}>
          <button
            style={primaryButtonStyle}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
          <button
            style={secondaryButtonStyle}
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