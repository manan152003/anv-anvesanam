import React from 'react'

const Home: React.FC = () => {
  return (
    <div 
      style={{ 
        width: '100vw',
        height: '100vh',
        background: '#141414',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 20px',
        maxWidth: '1440px',
        maxHeight: '1024px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden'
      }}
    >
      {/* Background blur effect - bottom right ellipse */}
      <div
        style={{
          position: 'absolute',
          width: '840px',
          height: '772px',
          background: '#7C6B6B',
          borderRadius: '50%',
          filter: 'blur(900px)', // Reduced from 1205.8px for better browser support
          right: '-600px', // Extend beyond edge
          bottom: '-650px', // Extend beyond edge
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{
          position: 'absolute',
          left: '32px',
          top: '32px',
          width: 'auto',
          height: '30px',
          zIndex: 10
        }}
      />

      {/* Main headline */}
      <h1
        style={{
          fontFamily: '"Alfa Slab One", serif',
          fontSize: '96px',
          fontWeight: 'normal',
          color: '#DFD0B8',
          lineHeight: '1.1',
          letterSpacing: '0',
          margin: '0 0 0 0',
          textAlign: 'left',
          alignSelf: 'flex-start',
          paddingLeft: '178px',
          zIndex: 10
        }}
      >
        Feeling Bored
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '24px',
          fontWeight: 'normal',
          color: '#DFD0B8',
          opacity: '0.8',
          margin: '0 0 0 0',
          textAlign: 'left',
          alignSelf: 'flex-start',
          paddingLeft: '178px',
          zIndex: 10
        }}
      >
        Discover videos worth your time
      </p>

      {/* Input label */}
      <label
        htmlFor="youtube-url"
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '16px',
          fontWeight: '500',
          color: '#DFD0B8',
          opacity: '0.7',
          marginTop: '108px',
          marginBottom: '13px',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        Paste YouTube URL here...
      </label>

      {/* Input field */}
      <input
        id="youtube-url"
        type="text"
        style={{
          width: '480px',
          height: '44px',
          borderRadius: '28px',
          border: '2px solid #DFD0B8',
          backgroundColor: '#1A1A1A',
          color: '#DFD0B8',
          fontSize: '18px',
          fontFamily: 'Lora, serif',
          padding: '0 24px',
          marginBottom: '34px',
          outline: 'none',
          zIndex: 10
        }}
        placeholder=""
      />

      {/* Add Video button */}
      <button
        type="button"
        style={{
          width: '140px',
          height: '44px',
          borderRadius: '28px',
          border: 'none',
          backgroundColor: '#DFD0B8',
          color: '#141414',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Lora, serif',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        Add Video
      </button>
    </div>
  )
}

export default Home 