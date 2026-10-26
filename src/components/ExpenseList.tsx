import React, { useState } from 'react';
import type { Expense, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, formatDateISO } from '../utils/dateHelpers';
import { Edit2, Trash2, Search, Filter, Layers, CreditCard } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  onOpenAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const todayStr = formatDateISO(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateISO(yesterday);

  // Filter expenses
  const filtered = expenses.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      CATEGORIES[item.category].name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Group by date in descending order
  const groupedByDate: { [date: string]: Expense[] } = {};
  filtered.forEach((exp) => {
    if (!groupedByDate[exp.date]) {
      groupedByDate[exp.date] = [];
    }
    groupedByDate[exp.date].push(exp);
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const getDateLabel = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    const d = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Section Header */}
      <div className="section-header">
        <h3 className="section-title">
          <Layers size={18} style={{ color: 'var(--primary-light)' }} />
          <span>Expense Activity</span>
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {filtered.length} entries
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Search notes or categories..."
            className="form-input"
            style={{ width: '100%', paddingLeft: 34, fontSize: '0.8rem', height: 38 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="form-input"
          style={{ width: 110, fontSize: '0.75rem', height: 38, padding: '0 8px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
        >
          <option value="all">All Categories</option>
          {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => (
            <option key={catId} value={catId}>
              {CATEGORIES[catId].icon} {CATEGORIES[catId].name.split(' ')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Expense Groups */}
      {sortedDates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Filter size={24} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
            No expenses found
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            {searchTerm || selectedCategory !== 'all'
              ? 'Try clearing your filters'
              : 'Add your first expense for this week!'}
          </p>
          <button className="btn-primary-action" style={{ margin: '0 auto' }} onClick={onOpenAddModal}>
            + Add Expense
          </button>
        </div>
      ) : (
        <div className="expense-group">
          {sortedDates.map((dateKey) => {
            const dateExpenses = groupedByDate[dateKey];
            const dailyTotal = dateExpenses.reduce((sum, item) => sum + item.amount, 0);

            return (
              <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Date separator with daily total */}
                <div className="date-divider">
                  <span>{getDateLabel(dateKey)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Total: {formatCurrency(dailyTotal)}
                  </span>
                </div>

                {/* Individual cards */}
                {dateExpenses.map((expense) => {
                  const cat = CATEGORIES[expense.category] || CATEGORIES.other;

                  return (
                    <div key={expense.id} className="expense-card">
                      <div className="expense-card-left">
                        <div
                          className="category-icon-box"
                          style={{ backgroundColor: cat.bg, color: cat.color }}
                        >
                          {cat.icon}
                        </div>

                        <div className="expense-meta">
                          <span className="expense-desc">{expense.description}</span>
                          <div className="expense-tags-row">
                            <span className="tag-badge">{cat.name}</span>
                            <span className="tag-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <CreditCard size={10} />
                              {expense.paymentMethod}
                            </span>
                            {expense.createdBy && expense.createdBy !== 'You' && (
                              <span
                                className="tag-badge"
                                style={{
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  color: '#60a5fa'
                                }}
                              >
                                {expense.createdBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="expense-card-right">
                        <div className="expense-amount-display">
                          <div className="expense-amount">
                            {formatCurrency(expense.amount)}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 2 }}>
                          <button
                            className="expense-actions-btn"
                            onClick={() => onEdit(expense)}
                            title="Edit expense"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="expense-actions-btn"
                            onClick={() => {
                              if (window.confirm(`Delete "${expense.description}" (Rs. ${expense.amount})?`)) {
                                onDelete(expense.id);
                              }
                            }}
                            title="Delete expense"
                            style={{ color: 'rgba(239, 68, 68, 0.7)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
