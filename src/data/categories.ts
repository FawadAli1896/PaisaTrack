import type { CategoryInfo, CategoryId } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  food: {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍔',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)'
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)'
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)'
  },
  bills: {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.15)'
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)'
  },
  health: {
    id: 'health',
    name: 'Health & Medical',
    icon: '💊',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)'
  },
  education: {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)'
  },
  other: {
    id: 'other',
    name: 'General / Other',
    icon: '📦',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.15)'
  }
};
