import React from 'react';

const Navbar = ({ activeTab, setActiveTab, currentUser, onSwitchUser, users }) => {
    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            marginBottom: '2rem',
            borderRadius: '0 0 16px 16px',
            borderTop: 'none'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '8px'
                    }}></div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BillPay</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={currentUser.id}
                        onChange={(e) => onSwitchUser(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '8px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id} style={{ background: '#1e293b' }}>{u.name}</option>
                        ))}
                    </select>

                    <button
                        className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
