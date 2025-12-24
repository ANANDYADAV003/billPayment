const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let bills = [
    { id: 1, userId: 'user1', type: 'Electricity', provider: 'City Power', amount: 120.50, dueDate: '2025-12-30', status: 'DUE', icon: 'zap' },
    { id: 2, userId: 'user1', type: 'Water', provider: 'Clean Water Co.', amount: 45.00, dueDate: '2025-12-28', status: 'DUE', icon: 'droplet' },
    { id: 3, userId: 'user1', type: 'Internet', provider: 'FiberNet', amount: 89.99, dueDate: '2026-01-05', status: 'PAID', icon: 'wifi' },
    { id: 4, userId: 'user2', type: 'Mobile', provider: 'Global Tel', amount: 29.99, dueDate: '2026-01-10', status: 'DUE', icon: 'smartphone' }
];

let transactions = [
    { id: 101, userId: 'user1', billId: 3, date: '2025-12-01', amount: 89.99, status: 'Success' }
];

// Routes
app.get('/api/bills', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        res.json(bills.filter(b => b.userId === userId));
    } else {
        res.json(bills);
    }
});

app.post('/api/bills', (req, res) => {
    const { userId, type, provider, amount, dueDate, icon } = req.body;
    const newBill = {
        id: Date.now(),
        userId,
        type,
        provider,
        amount: parseFloat(amount),
        dueDate,
        status: 'DUE',
        icon: icon || 'zap'
    };
    bills.push(newBill);
    res.json(newBill);
});

app.get('/api/history', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        res.json(transactions.filter(t => t.userId === userId));
    } else {
        res.json(transactions);
    }
});

app.post('/api/pay', (req, res) => {
    const { billId, paymentAmount } = req.body;
    const billIndex = bills.findIndex(b => b.id === billId);

    if (billIndex === -1) {
        return res.status(404).json({ error: 'Bill not found' });
    }

    const bill = bills[billIndex];
    if (bill.status === 'PAID') {
        return res.status(400).json({ error: 'Bill already paid' });
    }

    const payAmount = parseFloat(paymentAmount);
    if (isNaN(payAmount) || payAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    // Simulate payment processing delay
    setTimeout(() => {
        // Logic: specific amount payment
        bill.amount -= payAmount;

        let status = 'Success';

        // If amount paid is enough to clear the bill (or floating point close enough)
        if (bill.amount <= 0.01) {
            bill.amount = 0;
            bill.status = 'PAID';
        }

        const transaction = {
            id: Date.now(),
            userId: bill.userId,
            billId,
            date: new Date().toISOString().split('T')[0],
            amount: payAmount,
            status: status
        };
        transactions.unshift(transaction);
        res.json({ success: true, transaction, updatedBill: bill });
    }, 1500);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
