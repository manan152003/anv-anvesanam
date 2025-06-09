import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Neumorphic About Page for Anv
// Fonts: Playfair Display (headings), Lora (body)

interface FAQItem {
  question: string;
  answer: string;
}

const About: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Base colors from new mockups
  const pageBackgroundColor = '#1A1A1A'; // Main dark background
  const elementBackgroundColor = '#252525'; // Slightly lighter for neumorphic elements
  const textColor = '#D1C6B3'; // Off-white/beige text
  const subtleBorderColor = 'rgba(209, 198, 179, 0.1)'; // Subtle border for elements

  // Neumorphic shadow styles for an extruded look on a dark theme
  // A lighter shadow (top-left) and a darker shadow (bottom-right)
  const neumorphicExtrudedShadow = `
    -4px -4px 8px rgba(40, 40, 40, 0.4), 
     4px  4px 8px rgba(0, 0, 0, 0.3)
  `;
  const neumorphicInsetShadow = `
    inset -3px -3px 6px rgba(40, 40, 40, 0.4), 
    inset  3px  3px 6px rgba(0, 0, 0, 0.3)
  `;


  useEffect(() => {
    const style = document.createElement('style');
    // Import Google Fonts
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');

      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      .neumorphic-element {
        background: ${elementBackgroundColor};
        color: ${textColor};
        border-radius: 20px; /* Softer radius for neumorphism */
        box-shadow: ${neumorphicExtrudedShadow};
        border: 1px solid ${subtleBorderColor};
        transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
      }
      
      .neumorphic-element:hover {
        /* Subtle hover effect, maybe slightly adjust shadows or lift */
        /* transform: translateY(-2px); */
        /* box-shadow: -6px -6px 12px rgba(40, 40, 40, 0.5), 6px 6px 12px rgba(0, 0, 0, 0.4); */
      }

      .neumorphic-button {
        background: ${elementBackgroundColor};
        color: ${textColor};
        border: 1px solid ${subtleBorderColor};
        border-radius: 12px;
        padding: 1rem 2.5rem;
        font-family: 'Lora', serif;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: ${neumorphicExtrudedShadow};
        transition: all 0.2s ease-in-out;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .neumorphic-button:hover {
        box-shadow: ${neumorphicInsetShadow}; /* Pressed effect on hover */
        /* Or slightly lift if preferred */
        /* transform: translateY(-2px); */
        /* box-shadow: -5px -5px 10px rgba(40, 40, 40, 0.5), 5px 5px 10px rgba(0, 0, 0, 0.4); */
      }
      
      .neumorphic-button:active {
        box-shadow: ${neumorphicInsetShadow};
        transform: translateY(1px); /* Slight press down */
      }
      
      .faq-item-header:hover {
         background: rgba(209, 198, 179, 0.05); /* Subtle hover for FAQ header */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [elementBackgroundColor, textColor, neumorphicExtrudedShadow, neumorphicInsetShadow, subtleBorderColor]);

  // Content based on new mockups and existing FAQ data
  const faqs: FAQItem[] = [ // Retained from original
    {
      question: "What is Anv?",
      answer: "Anv (अन्वेषण - anveSaNa) means 'to seek' in Sanskrit. We're a social video discovery platform that helps you break free from algorithmic recommendations. Instead of AI deciding what you watch, discover videos through the recommendations of like-minded peers and curators."
    },
    {
      question: "How is Anv different from platforms like YouTube?",
      answer: "While YouTube relies heavily on algorithms to suggest content, Anv takes a more human approach. We believe in the power of peer recommendations and community curation. Think of it as discovering videos through friends with great taste, rather than through an algorithm."
    },
    {
      question: "What kind of content can I find on Anv?",
      answer: "You'll find videos shared by our community members - from thought-provoking documentaries to hidden gems of entertainment. The content is diverse, but what sets it apart is that each video is recommended by real people, not algorithms."
    },
    {
      question: "How exactly does 'social discovery' work on Anv?",
      answer: "Connect with people whose taste you trust, see what they're watching, create and share collections, and engage in meaningful discussions about the content. It's about building connections through shared interests in video content."
    },
    // New FAQ from mockup example
    {
      question: "How does Anv approach content quality and moderation?",
      answer: "Content quality is fostered through community flagging and review processes. We aim for a respectful environment where diverse, high-quality content can thrive. Moderation policies are in place to address violations of community guidelines."
    },
    {
      question: "Can I contribute to the Anv community?",
      answer: "Absolutely! Create an account to start sharing your favorite videos, build collections, write reviews, and connect with others. Your recommendations help others discover great content, making our community stronger."
    }
  ];

  const features = [
    {
      title: "Human-Powered Discovery",
      desc: "Navigate a world of videos curated by real people. Follow users whose taste aligns with yours, explore what your friends are watching, and dive into themed collections crafted by passionate individuals.",
      icon: "💛" // Using emoji from mockup
    },
    {
      title: "Trusted Recommendations",
      desc: "Move beyond opaque algorithms. At Anv, every recommendation comes with a human touch. Discover content vouched for by others, often with their insights and ratings, fostering a transparent discovery experience.",
      icon: "💡" // Using emoji from mockup
    },
    {
      title: "Community & Connection",
      desc: "Anv is more than a platform; it's a space to connect. Engage in discussions, share perspectives on videos, and find others who share your passions, forging connections built on a shared appreciation for compelling content.",
      icon: "💬" // Using emoji from mockup
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: pageBackgroundColor,
      color: textColor,
      fontFamily: "'Lora', serif", // Default body font
      paddingTop: '80px', // Assuming a fixed header of approx this height
      paddingBottom: '4rem',
      overflowX: 'hidden', // Prevent horizontal scroll
    }}>
      <main style={{
        maxWidth: '800px', // Slightly narrower for better readability
        margin: '0 auto',
        padding: '2rem',
      }}>

        {/* Introduction */}
        <section style={{
          marginBottom: '4rem',
          textAlign: 'center',
          animation: 'fadeInUp 0.7s ease-out'
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.8rem, 6vw, 3.8rem)', // Responsive font size
            fontWeight: 700,
            color: textColor,
            marginBottom: '1rem',
          }}>
            About Anv
          </h1>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
            color: 'rgba(209, 198, 179, 0.8)',
            marginBottom: '2.5rem',
          }}>
            अन्वेषण (anveṣaṇa)
          </p>
          <div
            className="neumorphic-element"
            style={{
              padding: '2rem',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              animation: 'fadeInUp 0.7s ease-out 0.2s both'
            }}
          >
            The name 'Anv' is derived from the Sanskrit word 'अन्वेषण' (anveṣaṇa), meaning "to seek, search, or explore." It reflects our core mission: to empower you to actively seek out and discover video content that resonates deeply, guided by the authentic recommendations of a trusted community rather than the passive feed of an algorithm.
          </div>
        </section>

        {/* Our Philosophy */}
        <section style={{
          marginBottom: '4rem',
          animation: 'fadeInUp 0.7s ease-out 0.4s both'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 600,
            color: textColor,
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            Our Philosophy: Beyond the Algorithm
          </h2>
          <div
            className="neumorphic-element"
            style={{
              padding: '2rem',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            In an era of information overload, finding truly 'worth your time' content can feel like navigating an ever-shifting digital landscape shaped by opaque algorithms. At Anv, we champion a different path. We believe the most enriching discoveries often stem from trusted human sources – a friend's enthusiastic recommendation, a passionate curator's meticulously crafted list, or a community's collective endorsement. Our philosophy is simple: empower human connection to drive content discovery, leading you to videos that inspire, entertain, and provoke thought in more meaningful ways.
          </div>
        </section>

        {/* Why Anv? The Core Experience */}
        <section style={{
          marginBottom: '4rem',
          animation: 'fadeInUp 0.7s ease-out 0.6s both'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 600,
            color: textColor,
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            Why Anv? The Core Experience
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
            gap: '2rem',
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="neumorphic-element"
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  animation: `fadeInUp 0.7s ease-out ${0.7 + index * 0.15}s both`
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: textColor,
                  marginBottom: '0.75rem',
                }}>{feature.title}</h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(209, 198, 179, 0.85)',
                  lineHeight: 1.7,
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* The Spark: Our Story */}
        <section style={{
          marginBottom: '4rem',
          animation: 'fadeInUp 0.7s ease-out 0.8s both'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 600,
            color: textColor,
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            The Spark: Our Story
          </h2>
          <div
            className="neumorphic-element"
            style={{
              padding: '2rem',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            Anv was born from a simple frustration: the feeling of being adrift in a sea of algorithmically-generated content, yearning for more genuine and intentional discovery.
            <br /><br />
            As a passionate video enthusiast, I found that some of the best videos I'd ever seen came from direct recommendations from friends or trusted online communities – not from an automated feed. I missed the serendipity of stumbling upon something great because someone I respected shared it.
            <br /><br />
            The vision for Anv is to recreate that feeling on a larger scale: a dedicated space where the primary way to find new videos is through the lens of human experience, curation, and shared enthusiasm. It's a project driven by the belief that our peers can be our best guides to content that truly matters.
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{
          marginBottom: '4rem',
          animation: 'fadeInUp 0.7s ease-out 1s both'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 600,
            color: textColor,
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="neumorphic-element" // Main container is neumorphic
                style={{
                  overflow: 'hidden', // Important for smooth animation of content
                  animation: `fadeInUp 0.6s ease-out ${1.1 + index * 0.1}s both`
                }}
              >
                <div
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="faq-item-header" // Class for hover
                  style={{
                    padding: '1.5rem', // Consistent padding
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none',
                    borderBottom: expandedFAQ === index ? `1px solid ${subtleBorderColor}` : 'none', // Separator when open
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <h3 style={{
                    fontFamily: "'Lora', serif",
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: textColor,
                  }}>{faq.question}</h3>
                  <span style={{
                    fontSize: '1.2rem', // Adjusted size
                    color: 'rgba(209, 198, 179, 0.7)',
                    transition: 'transform 0.3s ease-in-out',
                    transform: `rotate(${expandedFAQ === index ? '180deg' : '0deg'})`, // Rotates arrow
                    display: 'inline-block'
                  }}>▼</span> {/* Changed arrow for better visual */}
                </div>
                <div style={{ // Answer container
                  padding: expandedFAQ === index ? '1.5rem' : '0 1.5rem',
                  fontSize: '1rem',
                  color: 'rgba(209, 198, 179, 0.85)',
                  lineHeight: 1.7,
                  maxHeight: expandedFAQ === index ? '500px' : '0', // Increased max-height
                  opacity: expandedFAQ === index ? 1 : 0,
                  transition: 'max-height 0.4s ease-in-out, padding 0.4s ease-in-out, opacity 0.3s ease-in-out 0.1s',
                  overflow: 'hidden',
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
          marginTop: '3rem', // Reduced margin
          padding: '2.5rem', // Reduced padding
          animation: 'fadeInUp 0.7s ease-out 1.6s both'
        }}
        className="neumorphic-element" // Make CTA section itself neumorphic
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
            fontWeight: 600, // Slightly bolder
            marginBottom: '2rem',
            color: textColor,
          }}>
            Join the Anv Journey
          </h2>
          <p style={{
             fontSize: '1rem',
             color: 'rgba(209, 198, 179, 0.85)',
             lineHeight: 1.7,
             marginBottom: '2.5rem',
             maxWidth: '600px',
             margin: '0 auto 2.5rem auto',
          }}>
            Ready to reshape your video discovery experience and connect with a community of discerning viewers? Your next favorite video might just be a peer's recommendation away.
          </p>
          <button
            onClick={() => navigate('/discover')} // Assuming /discover is the route
            className="neumorphic-button"
          >
            Start Exploring Anv
          </button>
        </section>
      </main>
    </div>
  );
};

export default About;