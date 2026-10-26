import React, { useState } from 'react';
import { formatCurrency } from '../utils/dateHelpers';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Edit3 } from 'lucide-react';

interface BudgetHeroCardProps {
  budgetLimit: number;
  totalSpent: number;
  daysRemaining: number;
  onUpdateBudget: (newLimit: number) => void;
  onOpenSavingsTransfer?: () => void;
}

export const BudgetHeroCard: React.FC<BudgetHeroCardProps> = ({
  budgetLimit,
  totalSpent,
  daysRemaining,
  onUpdateBudget,
  onOpenSavingsTransfer
}) => {
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState(budgetLimit.toString());

  const remaining = budgetLimit - totalSpent;
  const utilization = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  const isOverBudget = remaining < 0;
  const isWarning = utilization >= 75 && !isOverBudget;

  let statusClass = 'status-good';
  let statusText = 'Within budget';
  let statusIcon = <CheckCircle2 size={14} />;

  if (isOverBudget) {
    statusClass = 'status-danger';
    statusText = `Over budget by ${formatCurrency(Math.abs(remaining))}`;
    statusIcon = <AlertTriangle size={14} />;
  } else if (isWarning) {
    statusClass = 'status-warning';
    statusText = 'Approaching limit';
    statusIcon = <TrendingUp size={14} />;
  }

  // Visual width capped at 100% for the main bar, but percentage displays real value
  const progressWidth = Math.min(100, Math.max(0, utilization));

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
      setIsEditingLimit(false);
    }
  };

  return (
    <div className={`budget-hero-card ${isOverBudget ? 'is-overbudget' : ''}`}>
      {/* Top row: Header & Status pill */}
      <div className="hero-header-row">
        <span className="hero-label">Weekly Budget Overview</span>
        <div className={`status-pill ${statusClass}`}>
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      {/* Main Stat: Remaining Money */}
      <div className="hero-main-stat">
        <span className="remaining-label">
          {isOverBudget ? 'Deficit (Overspent)' : 'Money Remaining'}
        </span>
        <div className="remaining-amount-wrap">
          <span className={`remaining-amount ${isOverBudget ? 'negative' : ''}`}>
            {formatCurrency(remaining)}
          </span>
          <span className="days-left-badge">
            {daysRemaining === 0 ? 'Last day of week' : `${daysRemaining} days left`}
          </span>
        </div>
      </div>

      {/* Progress Bar & Utilization */}
      <div className="progress-section">
        <div className="progress-labels">
          <span style={{ color: 'var(--text-secondary)' }}>Budget consumed</span>
          <span style={{ fontWeight: 700, color: isOverBudget ? 'var(--status-danger)' : 'var(--text-primary)' }}>
            {utilization.toFixed(0)}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${statusClass}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* Quick 2-Column Breakdown: Budget vs Spent */}
      <div className="hero-stats-grid">
        <div className="hero-mini-stat">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mini-stat-label">Weekly Budget</span>
            <button
              onClick={() => {
                setLimitInput(budgetLimit.toString());
                setIsEditingLimit(true);
              }}
              style={{ color: 'var(--text-muted)', display: 'flex' }}
              title="Edit weekly budget"
            >
              <Edit3 size={12} />
            </button>
          </div>
          <span className="mini-stat-value">{formatCurrency(budgetLimit)}</span>
        </div>

        <div className="hero-mini-stat">
          <span className="mini-stat-label">Total Spent</span>
          <span
            className="mini-stat-value"
            style={{ color: isOverBudget ? 'var(--status-danger)' : 'var(--text-primary)' }}
          >
            {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>

      {/* Encouraging Context Message */}
      <div className="encouraging-banner" style={{ cursor: onOpenSavingsTransfer ? 'pointer' : 'default' }} onClick={onOpenSavingsTransfer}>
        <Sparkles size={16} style={{ color: isOverBudget ? '#ef4444' : '#10b981', flexShrink: 0 }} />
        <span>
          {isOverBudget
            ? `You've exceeded your limit by ${formatCurrency(Math.abs(remaining))}. Try curbing non-essential expenses for the rest of the week.`
            : `You've kept ${formatCurrency(remaining)} safe inside your budget. Great discipline!`}
        </span>
      </div>

      {/* Edit Budget Limit Modal Overlay */}
      {isEditingLimit && (
        <div className="modal-overlay" onClick={() => setIsEditingLimit(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-drag-handle" />
            <div className="modal-header">
              <h3 className="modal-title">Edit Weekly Budget</h3>
              <button className="icon-button" onClick={() => setIsEditingLimit(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveLimit}>
              <div className="form-group">
                <label className="form-label">Weekly Limit (Rs.)</label>
                <div className="amount-input-wrap">
                  <span className="amount-currency">Rs.</span>
                  <input
                    type="number"
                    autoFocus
                    className="amount-field"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="quick-chip-row" style={{ marginBottom: 16 }}>
                {[3000, 5000, 7000, 10000, 15000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="quick-chip"
                    onClick={() => setLimitInput(amt.toString())}
                  >
                    Rs. {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-primary-action" style={{ width: '100%' }}>
                Save New Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
