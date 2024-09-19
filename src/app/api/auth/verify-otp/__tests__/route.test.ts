const { NextRequest } = require('next/server');
const { POST } = require('../route');
const prisma = require('@/lib/prisma');
const { verifyPayment } = require('@/utils/ravenBank');

// Mock the otpStore module
jest.mock('../otpStore', () => ({
  getOTP: jest.fn(),
  deleteOTP: jest.fn(),
}));

jest.mock('@/lib/prisma');
jest.mock('@/utils/ravenBank');

// ... rest of your test file
