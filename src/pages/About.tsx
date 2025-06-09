import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Critique: This About page goes all out with modern web design trends: glassmorphism, gradients, animated SVGs, bold fonts, and a tech stack grid. All styles are inline for now for rapid iteration, but should be moved to CSS-in-JS or modules for maintainability.

const GITHUB_URL = 'https://github.com/manan152003/anv';

interface FAQItem {
  question: string;
  answer: string;
}

const About: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-40px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(223, 208, 184, 0.3); }
        50% { box-shadow: 0 0 30px rgba(223, 208, 184, 0.5); }
      }
      
      .feature-card {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .feature-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
      
      .faq-item {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .faq-item:hover {
        transform: translateX(8px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const faqs: FAQItem[] = [
    {
      question: "What is Anv?",
      answer: "Anv (अन्वेषण - anveSaNa) means 'to seek' in Sanskrit. We're a social video discovery platform that helps you break free from algorithmic recommendations. Instead of AI deciding what you watch, discover videos through the recommendations of like-minded peers and curators."
    },
    {
      question: "How is this different from YouTube?",
      answer: "While YouTube relies heavily on algorithms to suggest content, Anv takes a more human approach. We believe in the power of peer recommendations and community curation. Think of it as discovering videos through friends with great taste, rather than through an algorithm."
    },
    {
      question: "What kind of content can I find here?",
      answer: "You'll find videos shared by our community members - from thought-provoking documentaries to hidden gems of entertainment. The content is diverse, but what sets it apart is that each video is recommended by real people, not algorithms."
    },
    {
      question: "How does social discovery work?",
      answer: "Connect with people whose taste you trust, see what they're watching, create and share collections, and engage in meaningful discussions about the content. It's about building connections through shared interests in video content."
    },
    {
      question: "Can I contribute?",
      answer: "Absolutely! Create an account to start sharing your favorite videos, build collections, write reviews, and connect with others. Your recommendations help others discover great content, making our community stronger."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: '#DFD0B8',
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(223, 208, 184, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(223, 208, 184, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Introduction */}
        <section style={{
          marginBottom: '5rem',
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Bellefair, serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(135deg, #DFD0B8, #C9B896)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            About Anv
          </h1>
          <div style={{
            fontSize: '1.8rem',
            color: 'rgba(223, 208, 184, 0.8)',
            marginBottom: '2.5rem',
            fontFamily: 'Bellefair, serif',
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            अन्वेषण (anveSaNa)
          </div>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(223, 208, 184, 0.9)',
            lineHeight: 1.7,
            maxWidth: '700px',
            margin: '0 auto',
            background: 'rgba(223, 208, 184, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(223, 208, 184, 0.1)',
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}>
            Seeking meaningful content through human connection. 
            Break free from algorithms, discover videos through your peers.
          </p>
        </section>

        {/* Key Features */}
        <section style={{
          marginBottom: '5rem',
          animation: 'fadeInUp 0.8s ease-out 0.6s both'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 400,
            marginBottom: '3rem',
            color: '#DFD0B8',
            textAlign: 'center',
            fontFamily: 'Bellefair, serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Why Anv?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              {
                title: "Social Discovery",
                desc: "Find videos through people, not algorithms",
                icon: "🤝"
              },
              {
                title: "Peer Recommendations",
                desc: "Trust in human curation and genuine sharing",
                icon: "💡"
              },
              {
                title: "Meaningful Connections",
                desc: "Connect with others through shared video interests",
                icon: "❤️"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{
                  padding: '2.5rem',
                  background: 'rgba(223, 208, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(223, 208, 184, 0.1)',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  animation: `fadeInUp 0.8s ease-out ${0.8 + index * 0.1}s both`
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem',
                  animation: 'glow 2s ease-in-out infinite'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: '#DFD0B8',
                  fontFamily: 'Bellefair, serif'
                }}>{feature.title}</h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: 'rgba(223, 208, 184, 0.8)',
                  lineHeight: 1.6,
                  fontFamily: 'Lora, serif'
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{
          marginBottom: '5rem',
          animation: 'fadeInUp 0.8s ease-out 1.2s both'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 400,
            marginBottom: '3rem',
            color: '#DFD0B8',
            textAlign: 'center',
            fontFamily: 'Bellefair, serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
                style={{
                  background: 'rgba(223, 208, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(223, 208, 184, 0.1)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  animation: `fadeInUp 0.6s ease-out ${1.4 + index * 0.1}s both`
                }}
              >
                <div
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  style={{
                    padding: '2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#DFD0B8',
                    fontFamily: 'Lora, serif'
                  }}>{faq.question}</h3>
                  <span style={{
                    fontSize: '1.5rem',
                    color: 'rgba(223, 208, 184, 0.7)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transform: `rotate(${expandedFAQ === index ? '180deg' : '0deg'})`,
                    display: 'inline-block'
                  }}>↓</span>
                </div>
                <div style={{
                  padding: expandedFAQ === index ? '0 2rem 2rem' : '0 2rem',
                  fontSize: '1.1rem',
                  color: 'rgba(223, 208, 184, 0.8)',
                  lineHeight: 1.7,
                  maxHeight: expandedFAQ === index ? '300px' : '0',
                  opacity: expandedFAQ === index ? 1 : 0,
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  overflow: 'hidden',
                  fontFamily: 'Lora, serif'
                }}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section style={{
          textAlign: 'center',
          marginTop: '5rem',
          padding: '4rem',
          background: 'rgba(223, 208, 184, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(223, 208, 184, 0.1)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          animation: 'fadeInUp 0.8s ease-out 2s both'
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 400,
            marginBottom: '2rem',
            color: '#DFD0B8',
            fontFamily: 'Bellefair, serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Ready to discover videos through human connection?
          </h2>
          <button
            onClick={() => navigate('/discover')}
            style={{
              background: 'rgba(223, 208, 184, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(223, 208, 184, 0.3)',
              color: '#DFD0B8',
              padding: '1.2rem 3rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              borderRadius: '16px',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fontFamily: 'Lora, serif',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(223, 208, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(223, 208, 184, 0.3)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Start Exploring
          </button>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default About; 