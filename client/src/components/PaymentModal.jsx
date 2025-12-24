import React, { useState } from 'react';

const PaymentModal = ({ bill, onClose, onPay }) => {
    const [processing, setProcessing] = useState(false);
    const [amount, setAmount] = useState(bill.amount);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        // Simulate API call with custom amount
        onPay(bill.id, amount);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div
                className="glass glass-card"
                style={{ width: '100%', maxWidth: '400px', margin: '20px' }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ marginBottom: '1.5rem' }}>Pay {bill.type} Bill</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>Total Due</p>
                    <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>${bill.amount}</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Payment Amount</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'white' }}>$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 30px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                }}
                                max={bill.amount}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Card Number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={processing}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={processing}>
                            {processing ? 'Processing...' : `Pay $${amount}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
