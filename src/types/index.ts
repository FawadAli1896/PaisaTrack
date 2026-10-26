export type PaymentMethod = 'Cash' | 'Card' | 'Bank' | 'Wallet';

export type CategoryId = 
  | 'food' 
  | 'transport' 
  | 'shopping' 
  | 'bills' 
  | 'entertainment' 
  | 'health' 
  | 'education' 
  | 'other';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  createdBy: string;
  createdAt: string;
}

export interface BudgetWeek {
  weekKey: string; // e.g. "2026-W44"
  weekNumber: number;
  monthName: string;
  year: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  budgetLimit: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  category: string;
}

export interface Achievement {
  id: string;
  code: 'first_step' | 'budget_keeper' | 'streak_7' | 'savings_goal' | 'under_half';
  title: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

export interface SharedMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor';
  avatar: string;
  isCurrentUser: boolean;
}

export interface ReminderConfig {
  enabled: boolean;
  time: string; // "21:00"
  hasRecordedToday: boolean;
  permissionGranted: boolean;
}
