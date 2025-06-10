import React from 'react';
import { useMobileView } from '../context/MobileViewContext';

const socials = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/manangupta.15/',
    svg: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="6" stroke="#DFD0B8" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke="#DFD0B8" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="#DFD0B8"/></svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/am_naanroti',
    svg: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4L20 20M20 4L4 20" stroke="#DFD0B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/manan152003',
    svg: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" stroke="#DFD0B8" strokeWidth="1.5"/><path d="M7 10V17" stroke="#DFD0B8" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="7" r="1" fill="#DFD0B8"/><path d="M11 13V17M11 13c0-1.1.9-2 2-2s2 .9 2 2v4" stroke="#DFD0B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  },
];

const Footer: React.FC = () => {
  const { isMobileView, toggleMobileView } = useMobileView();

  // Critique: Use sticky footer pattern, not fixed, for proper page flow
  // Use flex layout for three sections
  const footerStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(223, 208, 184, 0.1)',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Lora, serif',
    color: '#DFD0B8',
    fontSize: 15,
    zIndex: 100,
    minHeight: 60,
    boxSizing: 'border-box',
  };

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    flexBasis: 0,
  };
  const centerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
  };
  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
  };
  const linkStyle: React.CSSProperties = {
    color: '#DFD0B8',
    textDecoration: 'underline',
    fontWeight: 600,
    marginLeft: 4,
    marginRight: 4,
    transition: 'color 0.2s',
  };
  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.2s',
    opacity: 0.85,
  };
  const buttonStyle: React.CSSProperties = {
    padding: '8px 18px',
    fontSize: 15,
    fontWeight: 600,
    color: '#DFD0B8',
    backgroundColor: 'rgba(223, 208, 184, 0.08)',
    border: '1px solid rgba(223, 208, 184, 0.18)',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Lora, serif',
    minWidth: 160,
    textAlign: 'center' as const,
    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
  };

  // Responsive: adjust layout for mobile
  const isMobile = window.innerWidth <= 600;

  const mobileFooterStyle: React.CSSProperties = isMobile
    ? {
        flexDirection: 'column',
        gap: 10,
        textAlign: 'center',
        alignItems: 'center',
        padding: '16px 8px',
      }
    : {};

  const mobileSectionStyle: React.CSSProperties = isMobile
    ? { justifyContent: 'center', width: '100%', margin: '2px 0' }
    : {};

  const mobileButtonStyle: React.CSSProperties = isMobile
    ? { fontSize: 14, minWidth: 120, padding: '7px 10px' }
    : {};

  const mobileIconStyle: React.CSSProperties = isMobile
    ? { width: 22, height: 22 }
    : {};

  return (
    <footer style={{ ...footerStyle, ...mobileFooterStyle }}>
      <div style={{ ...leftStyle, ...mobileSectionStyle }}>
        <span>&copy; {new Date().getFullYear()} Anv-Anvesanam. </span>
        <span>
          Made by{' '}
          <a
            href="https://github.com/manan152003/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Manan
          </a>
        </span>
      </div>
      <div style={{ ...centerStyle, ...mobileSectionStyle }}>
        <button
          onClick={toggleMobileView}
          style={{ ...buttonStyle, ...mobileButtonStyle }}
          aria-label={isMobileView ? 'Switch to Desktop Site' : 'Switch to Mobile Site'}
        >
          {isMobileView ? 'Desktop site' : 'Mobile site'}
        </button>
      </div>
      <div style={{ ...rightStyle, ...mobileSectionStyle }}>
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            style={iconButtonStyle}
          >
            {React.cloneElement(social.svg, { style: mobileIconStyle })}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer; 