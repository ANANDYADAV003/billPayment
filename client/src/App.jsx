import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PaymentModal from './components/PaymentModal';
import AddBillModal from './components/AddBillModal';

const USERS = [
  { id: 'user1', name: 'User 1' },
  { id: 'user2', name: 'User 2' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [bills, setBills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showAddBill, setShowAddBill] = useState(false);

  // Fetch bills whenever currentUser changes
  useEffect(() => {
    fetchBills();
  }, [currentUser]);

  // Fetch history when tab changes or user changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetch(`http://localhost:5000/api/history?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [activeTab, currentUser]);

  const fetchBills = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/bills?userId=${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        setBills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch bills:", err);
        setLoading(false);
      });
  };

  const handlePay = (billId, amount) => {
    fetch('http://localhost:5000/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billId, paymentAmount: amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchBills();
          // Also refresh history if that tab is active, or just let it refresh next click
          if (activeTab === 'history') {
            // simple re-fetch
            fetch(`http://localhost:5000/api/history?userId=${currentUser.id}`)
              .then(res => res.json())
              .then(h => setHistory(h));
          }
          setSelectedBill(null);
          alert('Payment Successful!');
        } else {
          alert(data.error || 'Payment Failed');
        }
      })
      .catch(err => {
        console.error("Payment failed", err);
        alert('Payment Failed');
      });
  };

  const handleAddBill = (newBill) => {
    return fetch('http://localhost:5000/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill)
    })
      .then(res => res.json())
      .then(data => {
        fetchBills();
        return data;
      });
  };

  const handleSwitchUser = (userId) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        users={USERS}
      />

      <main className="container animate-fade-in">
        {activeTab === 'dashboard' && (
          <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Welcome, {currentUser.name}</h1>
                <p>Manage and pay your bills in one place.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddBill(true)}>
                + Add Bill
              </button>
            </header>

            {loading ? (
              <p>Loading your bills...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {bills.length === 0 && <p>No bills found for this user.</p>}
                {bills.map(bill => (
                  <div key={bill.id} className="glass glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '10px',
                        borderRadius: '12px',
                        fontSize: '1.5rem'
                      }}>
                        {bill.icon === 'zap' ? '⚡' : bill.icon === 'droplet' ? '💧' : bill.icon === 'wifi' ? '📶' : '📱'}
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: bill.status === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: bill.status === 'PAID' ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {bill.status}
                      </span>
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{bill.type}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{bill.provider}</p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>${bill.amount.toFixed(2)}</span>
                      <button
                        className="btn btn-primary"
                        disabled={bill.status === 'PAID'}
                        onClick={() => setSelectedBill(bill)}
                      >
                        {bill.status === 'PAID' ? 'Paid' : 'Pay Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <header style={{ marginBottom: '2rem' }}>
              <h1>Transaction History</h1>
              <p>View your past payments.</p>
            </header>
            <div className="glass glass-card">
              {history.length === 0 ? (
                <p>No recent transactions.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Bill ID</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(tx => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{tx.date}</td>
                        <td style={{ padding: '1rem' }}>#{tx.billId}</td>
                        <td style={{ padding: '1rem' }}>${tx.amount}</td>
                        <td style={{ padding: '1rem', color: 'var(--success)' }}>{tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {selectedBill && (
          <PaymentModal
            bill={selectedBill}
            onClose={() => setSelectedBill(null)}
            onPay={handlePay}
          />
        )}

        {showAddBill && (
          <AddBillModal
            userId={currentUser.id}
            onClose={() => setShowAddBill(false)}
            onAdd={handleAddBill}
          />
        )}
      </main>
    </div>
  );
}

export default App;
