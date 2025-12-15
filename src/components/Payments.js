import React, { useState, useEffect } from 'react';
import './Payments.css';
import { useLanguage } from '../context/LanguageContext';

function Payments({ user, onClose }) {
  const { t } = useLanguage();
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      // Load saved data from localStorage
      const savedMethods = localStorage.getItem(`paymentMethods_${user.email}`);
      const savedTransactions = localStorage.getItem(`transactions_${user.email}`);
      const savedWallet = localStorage.getItem(`wallet_${user.email}`);
      const savedPoints = localStorage.getItem(`points_${user.email}`);
      
      if (savedMethods) setPaymentMethods(JSON.parse(savedMethods));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedWallet) setWalletBalance(parseFloat(savedWallet));
      if (savedPoints) setPoints(parseInt(savedPoints));
    }
  }, [user]);

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    // Format expiry as MM/YY
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }
    
    setCardForm({ ...cardForm, [name]: value });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    
    if (!cardForm.cardNumber || !cardForm.cardName || !cardForm.expiry || !cardForm.cvv) {
      alert('Please fill all fields');
      return;
    }
    
    const lastFour = cardForm.cardNumber.replace(/\s/g, '').slice(-4);
    const cardType = cardForm.cardNumber.startsWith('4') ? 'Visa' : 
                     cardForm.cardNumber.startsWith('5') ? 'Mastercard' : 'Card';
    
    const newCard = {
      id: Date.now(),
      type: cardType,
      lastFour,
      name: cardForm.cardName,
      expiry: cardForm.expiry
    };
    
    const updatedMethods = [...paymentMethods, newCard];
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`paymentMethods_${user.email}`, JSON.stringify(updatedMethods));
    
    // Add transaction
    const transaction = {
      id: Date.now(),
      type: 'Card Added',
      description: `${cardType} •••• ${lastFour} added`,
      date: new Date().toISOString(),
      amount: 0
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updatedTransactions));
    
    setCardForm({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    setShowAddCard(false);
  };

  const handleDeleteCard = (cardId) => {
    const updatedMethods = paymentMethods.filter(m => m.id !== cardId);
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`paymentMethods_${user.email}`, JSON.stringify(updatedMethods));
  };

  const handleAddMoney = () => {
    const amount = prompt('Enter amount to add (₹):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const newBalance = walletBalance + parseFloat(amount);
      setWalletBalance(newBalance);
      localStorage.setItem(`wallet_${user.email}`, newBalance.toString());
      
      // Add points (1 point per ₹100)
      const earnedPoints = Math.floor(parseFloat(amount) / 100);
      const newPoints = points + earnedPoints;
      setPoints(newPoints);
      localStorage.setItem(`points_${user.email}`, newPoints.toString());
      
      // Add transaction
      const transaction = {
        id: Date.now(),
        type: 'Wallet Top-up',
        description: `Added ₹${amount} to wallet`,
        date: new Date().toISOString(),
        amount: parseFloat(amount)
      };
      const updatedTransactions = [transaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updatedTransactions));
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="payments-overlay" onClick={onClose}>
      <div className="payments-modal" onClick={e => e.stopPropagation()}>
        <button className="payments-close" onClick={onClose}>×</button>
        
        <div className="payments-header">
          <h2>💳 {t('payments') || 'Payments & Rewards'}</h2>
        </div>

        <div className="payments-content">
          {/* Wallet Balance */}
          <div className="wallet-section">
            <div className="wallet-card">
              <span className="wallet-label">{t('walletBalance') || 'Wallet Balance'}</span>
              <span className="wallet-amount">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <button className="add-money-btn" onClick={handleAddMoney}>+ {t('addMoney') || 'Add Money'}</button>
            </div>
          </div>

          {/* Rewards */}
          <div className="rewards-section">
            <h3>🎁 {t('rewards') || 'Rewards'}</h3>
            <div className="rewards-card">
              <div className="reward-item">
                <span className="reward-icon">⭐</span>
                <div className="reward-info">
                  <span className="reward-points">{points} Points</span>
                  <span className="reward-label">{t('totalPoints') || 'Total Points Earned'}</span>
                </div>
              </div>
              <div className="reward-item">
                <span className="reward-icon">🎫</span>
                <div className="reward-info">
                  <span className="reward-points">{Math.floor(points / 100)}</span>
                  <span className="reward-label">{t('coupons') || 'Available Coupons'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods-section">
            <h3>💳 {t('paymentMethods') || 'Payment Methods'}</h3>
            
            {paymentMethods.length > 0 ? (
              <div className="saved-cards">
                {paymentMethods.map(card => (
                  <div key={card.id} className="saved-card">
                    <div className="card-icon">{card.type === 'Visa' ? '💳' : '💳'}</div>
                    <div className="card-details">
                      <span className="card-type">{card.type} •••• {card.lastFour}</span>
                      <span className="card-expiry">Expires {card.expiry}</span>
                    </div>
                    <button className="delete-card-btn" onClick={() => handleDeleteCard(card.id)}>🗑️</button>
                  </div>
                ))}
              </div>
            ) : !showAddCard && (
              <div className="no-methods">
                <span className="no-methods-icon">🔒</span>
                <p>{t('noPaymentMethods') || 'No payment methods saved'}</p>
              </div>
            )}
            
            {showAddCard ? (
              <form className="add-card-form" onSubmit={handleAddCard}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.cardNumber}
                    onChange={handleCardInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text" 
                    name="cardName"
                    placeholder="John Doe"
                    value={cardForm.cardName}
                    onChange={handleCardInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input 
                      type="text" 
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={handleCardInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="password" 
                      name="cvv"
                      placeholder="•••"
                      value={cardForm.cvv}
                      onChange={handleCardInputChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddCard(false)}>Cancel</button>
                  <button type="submit" className="save-card-btn">Save Card</button>
                </div>
              </form>
            ) : (
              <button className="add-method-btn" onClick={() => setShowAddCard(true)}>
                + {t('addPaymentMethod') || 'Add Payment Method'}
              </button>
            )}
          </div>

          {/* Transaction History */}
          <div className="transactions-section">
            <h3>📜 {t('transactions') || 'Transaction History'}</h3>
            {transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div className="tx-icon">
                      {tx.type === 'Wallet Top-up' ? '💰' : tx.type === 'Card Added' ? '💳' : '📋'}
                    </div>
                    <div className="tx-details">
                      <span className="tx-type">{tx.type}</span>
                      <span className="tx-desc">{tx.description}</span>
                      <span className="tx-date">{formatDate(tx.date)}</span>
                    </div>
                    {tx.amount > 0 && (
                      <span className="tx-amount">+₹{tx.amount.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-transactions">
                <span className="no-transactions-icon">📋</span>
                <p>{t('noTransactions') || 'No transactions yet'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="payments-footer">
          <button className="payments-close-btn" onClick={onClose}>
            {t('close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payments;
