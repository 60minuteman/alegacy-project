'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { fraunces, dmSans } from '../fonts';
import Image from 'next/image';
import * as Tooltip from '@radix-ui/react-tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import '../GradientAnimation.css';
import { useRouter } from 'next/navigation';
import UpgradeInvestment from './UpgradeInvestment';
import UserDashboard from '@/components/UserDashboard';

export default function UserDashboardPage() {
  return <UserDashboard />;
}




