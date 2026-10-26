import type { Expense, SavingsGoal, Achievement, SharedMember } from '../types';
import { getWeekRange, formatDateISO } from '../utils/dateHelpers';

export const DEFAULT_WEEKLY_LIMIT = 5000;

export function getInitialExpenses(): Expense[] {
  const currentWeek = getWeekRange(0);
  const monday = new Date(currentWeek.startDate);

  const addDays = (d: Date, days: number): string => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return formatDateISO(copy);
  };

  return [
    {
      id: 'exp-1',
      amount: 200,
      category: 'transport',
      description: 'Morning Ride & Fuel',
      date: addDays(monday, 0), // Monday
      paymentMethod: 'Cash',
      createdBy: 'You',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp-2',
      amount: 350,
      category: 'food',
      description: 'Lunch Biryani',
      date: addDays(monday, 1), // Tuesday
      paymentMethod: 'Wallet',
      createdBy: 'You',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp-3',
      amount: 800,
      category: 'shopping',
      description: 'Grocery & Snacks',
      date: addDays(monday, 2), // Wednesday
      paymentMethod: 'Card',
      createdBy: 'You',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp-4',
      amount: 250,
      category: 'food',
      description: 'Dinner wrap',
      date: addDays(monday, 3), // Thursday
      paymentMethod: 'Cash',
      createdBy: 'You',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp-5',
      amount: 200,
      category: 'transport',
      description: 'Careem Bike',
      date: addDays(monday, 4), // Friday
      paymentMethod: 'Wallet',
      createdBy: 'Ali (Brother)',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp-6',
      amount: 1400,
      category: 'bills',
      description: 'Internet Bill split',
      date: addDays(monday, 4), // Friday
      paymentMethod: 'Bank',
      createdBy: 'You',
      createdAt: new Date().toISOString()
    }
  ];
}

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmount: 25000,
    currentAmount: 14500,
    icon: '🛡️',
    category: 'Safety'
  },
  {
    id: 'goal-2',
    title: 'New Smartphone',
    targetAmount: 40000,
    currentAmount: 18000,
    icon: '📱',
    category: 'Tech'
  },
  {
    id: 'goal-3',
    title: 'Weekend Getaway',
    targetAmount: 15000,
    currentAmount: 11200,
    icon: '🏔️',
    category: 'Travel'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    code: 'first_step',
    title: 'First Step',
    description: 'Recorded your very first expense',
    icon: '🎯',
    earnedAt: '2026-10-20'
  },
  {
    id: 'ach-2',
    code: 'budget_keeper',
    title: 'Budget Keeper',
    description: 'Finished a week without exceeding your limit',
    icon: '🏆',
    earnedAt: '2026-10-24'
  },
  {
    id: 'ach-3',
    code: 'streak_7',
    title: 'Consistent Tracker',
    description: 'Recorded expenses on 7 consecutive days',
    icon: '🔥',
    earnedAt: null
  },
  {
    id: 'ach-4',
    code: 'savings_goal',
    title: 'Savings Champion',
    description: 'Deliberately transferred funds into your savings goal',
    icon: '💰',
    earnedAt: '2026-10-22'
  },
  {
    id: 'ach-5',
    code: 'under_half',
    title: 'Frugal Master',
    description: 'Stayed below 50% budget utilization across 5 days',
    icon: '⚡',
    earnedAt: null
  }
];

export const INITIAL_MEMBERS: SharedMember[] = [
  {
    id: 'mem-1',
    name: 'You',
    email: 'you@paisatrack.app',
    role: 'owner',
    avatar: 'ME',
    isCurrentUser: true
  },
  {
    id: 'mem-2',
    name: 'Ali (Brother)',
    email: 'ali@paisatrack.app',
    role: 'editor',
    avatar: 'AL',
    isCurrentUser: false
  }
];
