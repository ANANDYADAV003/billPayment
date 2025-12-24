import React, { useState } from 'react';

const AddBillModal = ({ userId, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        type: 'Electricity',
        provider: '',
        amount: '',
        dueDate: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Determine icon based on type
        let icon = 'zap';
        if (formData.type === 'Water') icon = 'droplet';
        if (formData.type === 'Internet') icon = 'wifi';
        if (formData.type === 'Mobile') icon = 'smartphone';

        const newBill = {
            ...formData,
            userId,
            icon
        };

        onAdd(newBill)
            .then(() => {
                setLoading(false);
                onClose();
            })
            .catch(() => {
                setLoading(false);
                alert('Failed to add bill');
            });
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
                <h2 style={{ marginBottom: '1.5rem' }}>Add New Bill</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bill Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="Electricity">Electricity</option>
                            <option value="Water">Water</option>
                            <option value="Internet">Internet</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Otjer">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Provider Name</label>
                        <input
                            type="text"
                            name="provider"
                            placeholder="e.g. City Power"
                            value={formData.provider}
                            onChange={handleChange}
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

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount Due</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
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

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
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

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Adding...' : 'Add Bill'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBillModal;
