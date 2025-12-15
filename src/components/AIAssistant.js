import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';
import { useLanguage } from '../context/LanguageContext';

function AIAssistant({ tours, onSelectTour }) {
  // eslint-disable-next-line no-unused-vars
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! 👋 I'm your AI Travel Assistant. I can help you find the perfect tour, answer travel questions, or give recommendations. What would you like to explore today?",
      suggestions: ['Find a beach destination', 'Budget-friendly tours', 'Adventure trips', 'Honeymoon packages']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Tour recommendations based on keywords
    if (msg.includes('beach') || msg.includes('sea') || msg.includes('ocean')) {
      const beachTours = tours.filter(t => 
        t.name.toLowerCase().includes('beach') || 
        t.name.toLowerCase().includes('island') ||
        t.location.toLowerCase().includes('maldives') ||
        t.location.toLowerCase().includes('bali') ||
        t.location.toLowerCase().includes('phuket') ||
        t.location.toLowerCase().includes('goa')
      ).slice(0, 3);
      
      return {
        text: "🏖️ Here are some amazing beach destinations for you:",
        tours: beachTours,
        suggestions: ['Show more beaches', 'What about mountains?', 'Budget options']
      };
    }

    if (msg.includes('adventure') || msg.includes('trek') || msg.includes('hiking') || msg.includes('thrill')) {
      const adventureTours = tours.filter(t => 
        t.name.toLowerCase().includes('adventure') || 
        t.name.toLowerCase().includes('trek') ||
        t.name.toLowerCase().includes('safari') ||
        t.location.toLowerCase().includes('nepal') ||
        t.location.toLowerCase().includes('new zealand')
      ).slice(0, 3);
      
      return {
        text: "🏔️ Ready for an adventure? Check these out:",
        tours: adventureTours,
        suggestions: ['Extreme sports', 'Wildlife safaris', 'Mountain treks']
      };
    }

    if (msg.includes('honeymoon') || msg.includes('romantic') || msg.includes('couple')) {
      const honeymoonTours = tours.filter(t => 
        t.location.toLowerCase().includes('maldives') ||
        t.location.toLowerCase().includes('bali') ||
        t.location.toLowerCase().includes('paris') ||
        t.location.toLowerCase().includes('santorini') ||
        t.location.toLowerCase().includes('venice')
      ).slice(0, 3);
      
      return {
        text: "💕 Perfect romantic getaways for couples:",
        tours: honeymoonTours,
        suggestions: ['Private villas', 'Beach resorts', 'European romance']
      };
    }

    if (msg.includes('budget') || msg.includes('cheap') || msg.includes('affordable')) {
      const budgetTours = tours.filter(t => t.price < 400).slice(0, 3);
      
      return {
        text: "💰 Great value tours under $400:",
        tours: budgetTours,
        suggestions: ['Show more budget options', 'Mid-range tours', 'Luxury experiences']
      };
    }

    if (msg.includes('luxury') || msg.includes('premium') || msg.includes('expensive')) {
      const luxuryTours = tours.filter(t => t.price > 800).slice(0, 3);
      
      return {
        text: "✨ Luxury experiences for the discerning traveler:",
        tours: luxuryTours,
        suggestions: ['5-star resorts', 'Private tours', 'Exclusive experiences']
      };
    }

    if (msg.includes('europe') || msg.includes('european')) {
      const europeTours = tours.filter(t => 
        t.location.toLowerCase().includes('france') ||
        t.location.toLowerCase().includes('italy') ||
        t.location.toLowerCase().includes('spain') ||
        t.location.toLowerCase().includes('germany') ||
        t.location.toLowerCase().includes('uk')
      ).slice(0, 3);
      
      return {
        text: "🏰 Discover the beauty of Europe:",
        tours: europeTours,
        suggestions: ['Paris tours', 'Italian adventures', 'Greek islands']
      };
    }

    if (msg.includes('asia') || msg.includes('asian')) {
      const asiaTours = tours.filter(t => 
        t.location.toLowerCase().includes('japan') ||
        t.location.toLowerCase().includes('thailand') ||
        t.location.toLowerCase().includes('bali') ||
        t.location.toLowerCase().includes('singapore') ||
        t.location.toLowerCase().includes('vietnam')
      ).slice(0, 3);
      
      return {
        text: "🏯 Explore the wonders of Asia:",
        tours: asiaTours,
        suggestions: ['Japan tours', 'Southeast Asia', 'Indian adventures']
      };
    }

    if (msg.includes('india') || msg.includes('indian')) {
      const indiaTours = tours.filter(t => 
        t.location.toLowerCase().includes('india')
      ).slice(0, 3);
      
      return {
        text: "🇮🇳 Incredible India awaits you:",
        tours: indiaTours,
        suggestions: ['Taj Mahal', 'Kerala backwaters', 'Rajasthan palaces']
      };
    }

    if (msg.includes('family') || msg.includes('kids') || msg.includes('children')) {
      const familyTours = tours.filter(t => 
        t.maxGroupSize >= 15 && t.rating >= 4.5
      ).slice(0, 3);
      
      return {
        text: "👨‍👩‍👧‍👦 Family-friendly destinations:",
        tours: familyTours,
        suggestions: ['Theme parks', 'Beach resorts', 'Wildlife tours']
      };
    }

    if (msg.includes('best') || msg.includes('top') || msg.includes('popular') || msg.includes('recommend')) {
      const topTours = tours.filter(t => t.rating >= 4.8).slice(0, 3);
      
      return {
        text: "⭐ Our top-rated tours:",
        tours: topTours,
        suggestions: ['By destination', 'By price', 'By duration']
      };
    }

    if (msg.includes('short') || msg.includes('weekend') || msg.includes('3 day') || msg.includes('4 day')) {
      const shortTours = tours.filter(t => 
        t.duration.includes('3') || t.duration.includes('4')
      ).slice(0, 3);
      
      return {
        text: "⏱️ Perfect for a quick getaway:",
        tours: shortTours,
        suggestions: ['Weekend trips', 'City breaks', 'Nearby destinations']
      };
    }

    if (msg.includes('long') || msg.includes('week') || msg.includes('7 day') || msg.includes('10 day')) {
      const longTours = tours.filter(t => 
        parseInt(t.duration) >= 7
      ).slice(0, 3);
      
      return {
        text: "🗓️ Extended vacation packages:",
        tours: longTours,
        suggestions: ['Multi-country tours', 'Cruise packages', 'Road trips']
      };
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return {
        text: "Hello! 👋 How can I help you plan your perfect trip today?",
        suggestions: ['Find tours', 'Get recommendations', 'Travel tips', 'Best deals']
      };
    }

    if (msg.includes('thank')) {
      return {
        text: "You're welcome! 😊 Is there anything else I can help you with?",
        suggestions: ['Find more tours', 'Contact support', 'View bookings']
      };
    }

    if (msg.includes('help')) {
      return {
        text: "I can help you with:\n• Finding tours by destination\n• Budget-friendly options\n• Adventure or relaxation trips\n• Honeymoon packages\n• Family vacations\n\nJust tell me what you're looking for!",
        suggestions: ['Beach vacation', 'City tours', 'Nature trips', 'Cultural experiences']
      };
    }

    // Default response with random tour suggestions
    const randomTours = tours.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    return {
      text: "I'd love to help you find the perfect tour! Here are some popular options, or tell me more about what you're looking for:",
      tours: randomTours,
      suggestions: ['Beach destinations', 'Adventure tours', 'Budget options', 'Luxury trips']
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', ...response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'user', text: suggestion }]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = getAIResponse(suggestion);
        setMessages(prev => [...prev, { type: 'bot', ...response }]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`ai-chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-header-info">
              <h4>AI Travel Assistant</h4>
              <span className="ai-status">● Online</span>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message ${msg.type}`}>
                {msg.type === 'bot' && <span className="ai-msg-avatar">🤖</span>}
                <div className="ai-msg-content">
                  <p>{msg.text}</p>
                  
                  {/* Tour Cards */}
                  {msg.tours && msg.tours.length > 0 && (
                    <div className="ai-tour-cards">
                      {msg.tours.map((tour, i) => (
                        <div 
                          key={i} 
                          className="ai-tour-card"
                          onClick={() => onSelectTour && onSelectTour(tour)}
                        >
                          <img src={tour.image} alt={tour.name} />
                          <div className="ai-tour-info">
                            <h5>{tour.name}</h5>
                            <p>📍 {tour.location}</p>
                            <div className="ai-tour-meta">
                              <span>⭐ {tour.rating}</span>
                              <span className="ai-tour-price">${tour.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {msg.suggestions && (
                    <div className="ai-suggestions">
                      {msg.suggestions.map((sug, i) => (
                        <button 
                          key={i} 
                          className="ai-suggestion-btn"
                          onClick={() => handleSuggestionClick(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="ai-message bot">
                <span className="ai-msg-avatar">🤖</span>
                <div className="ai-msg-content">
                  <div className="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about travel..."
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
