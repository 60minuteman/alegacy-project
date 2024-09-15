const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false
});

// User model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  name: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  totalInvestment: { type: DataTypes.FLOAT, defaultValue: 0 },
  referrals: { type: DataTypes.INTEGER, defaultValue: 0 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
});

// Sync the model with the database
sequelize.sync();

const RAVEN_API_URL = 'https://integrations.getravenbank.com/v1';
const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

// Generate account endpoint
app.post('/api/generate-account', async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;
    const [first_name, ...lastNameParts] = name.split(' ');
    const last_name = lastNameParts.join(' ');

    const response = await axios.post(
      `${RAVEN_API_URL}/pwbt/generate_account`,
      { first_name, last_name, email, phone, amount: amount.toString() },
      {
        headers: {
          'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'success' && response.data.data) {
      const { account_number, bank, account_name } = response.data.data;
      res.json({ 
        success: true, 
        accountNumber: account_number,
        bankName: bank,
        accountName: account_name,
        amount: response.data.data.amount,
      });
    } else {
      throw new Error('Unexpected response from Raven API');
    }
  } catch (error) {
    console.error('Generate account error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Confirm payment endpoint
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { name, email, phoneNumber, amount, accountNumber } = req.body;

    // Verify payment with Raven Bank API
    const ravenResponse = await axios.get(`${RAVEN_API_URL}/collections`, {
      headers: { 'Authorization': `Bearer ${RAVEN_SECRET_KEY}` },
      params: { account_number: accountNumber }
    });

    if (ravenResponse.data.status === 'fail') {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    let user = await User.findOne({ where: { email } });
    
    if (user) {
      user = await user.update({
        name,
        phoneNumber,
        totalInvestment: user.totalInvestment + parseFloat(amount),
        balance: user.balance + parseFloat(amount),
      });
    } else {
      user = await User.create({
        name,
        email,
        phoneNumber,
        totalInvestment: parseFloat(amount),
        balance: parseFloat(amount),
      });
    }

    res.json({ success: true, user, message: 'Payment confirmed and user account updated' });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// User data endpoint
app.get('/api/user-data', async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json({
        name: user.name,
        phoneNumber: user.phoneNumber,
        totalInvestment: user.totalInvestment,
        referrals: user.referrals,
        balance: user.balance
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Fetch user data error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
