import React, { useState } from 'react';
import type { SavingsGoal, Achievement } from '../types';
import { formatCurrency } from '../utils/dateHelpers';
import confetti from 'canvas-confetti';
import { PiggyBank, Award, Plus, ArrowUpRight, Sparkles, HelpCircle } from 'lucide-react';

interface SavingsViewProps {
  goals: SavingsGoal[];
  achievements: Achievement[];
  unspentBudget: number;
  onDepositToGoal: (goalId: string, amount: number) => void;
  onAddGoal: (newGoal: Omit<SavingsGoal, 'id'>) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  goals,
  achievements,
  unspentBudget,
  onDepositToGoal,
  onAddGoal
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalIcon, setNewGoalIcon] = useState('🎯');

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (selectedGoalId && !isNaN(val) && val > 0) {
      onDepositToGoal(selectedGoalId, val);
      triggerCelebration();
      setSelectedGoalId(null);
      setDepositAmount('');
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoalTarget);
    if (newGoalTitle.trim() && !isNaN(target) && target > 0) {
      onAddGoal({
        title: newGoalTitle.trim(),
        targetAmount: target,
        currentAmount: 0,
        icon: newGoalIcon,
        category: 'Personal'
      });
      setIsAddingGoal(false);
      setNewGoalTitle('');
      setNewGoalTarget('');
    }
  };

  const totalSavedAcrossGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Educational Banner: Unspent vs Real Savings */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          fontSize: '0.78rem'
        }}
      >
        <HelpCircle size={18} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong style={{ color: '#93c5fd', display: 'block', marginBottom: 2 }}>
            Smart Financial Rule: Unspent Budget ≠ Actual Savings
          </strong>
          <span style={{ color: 'var(--text-secondary)' }}>
            Having {formatCurrency(Math.max(0, unspentBudget))} unspent this week is great, but until you intentionally transfer it into a dedicated savings reserve or bank account, it can easily leak into next week.
          </span>
        </div>
      </div>

      {/* Savings Summary Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Total Dedicated Savings
          </span>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--primary-light)'
            }}
          >
            {formatCurrency(totalSavedAcrossGoals)}
          </div>
        </div>

        <button
          className="btn-primary-action"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          onClick={() => setIsAddingGoal(true)}
        >
          <Plus size={14} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div>
        <div className="section-header">
          <h3 className="section-title">
            <PiggyBank size={18} style={{ color: 'var(--primary-light)' }} />
            <span>Target Savings Goals</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {goals.length} active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {goals.map((goal) => {
            const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className="savings-goal-card">
                <div className="savings-header">
                  <div className="savings-title-wrap">
                    <span className="savings-icon">{goal.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{goal.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Target: {formatCurrency(goal.targetAmount)}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-secondary-action"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setDepositAmount(unspentBudget > 0 ? unspentBudget.toString() : '500');
                    }}
                  >
                    <ArrowUpRight size={14} />
                    <span>Deposit</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Saved: <strong>{formatCurrency(goal.currentAmount)}</strong>
                    </span>
                    <span style={{ color: isCompleted ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: 700 }}>
                      {pct.toFixed(0)}% {isCompleted && '🎉 Completed!'}
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div style={{ marginTop: 10 }}>
        <div className="section-header">
          <h3 className="section-title">
            <Award size={18} style={{ color: '#fbbf24' }} />
            <span>Badges & Habits</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {achievements.filter((a) => a.earnedAt !== null).length}/{achievements.length} Unlocked
          </span>
        </div>

        <div className="achievements-grid">
          {achievements.map((ach) => {
            const isEarned = ach.earnedAt !== null;
            return (
              <div
                key={ach.id}
                className={`achievement-card ${isEarned ? 'is-unlocked' : 'is-locked'}`}
                onClick={() => {
                  if (isEarned) triggerCelebration();
                }}
                style={{ cursor: isEarned ? 'pointer' : 'default' }}
              >
                <div className="achievement-badge-icon">{ach.icon}</div>
                <div className="achievement-name">{ach.title}</div>
                <div className="achievement-desc">{ach.description}</div>
                {isEarned && (
                  <div
                    style={{
                      fontSize: '0.6rem',
                      color: '#fbbf24',
                      fontWeight: 700,
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2
                    }}
                  >
                    <Sparkles size={10} />
                    <span>Unlocked</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit to Goal Modal */}
      {selectedGoalId && (
        <div className="modal-overlay" onClick={() => setSelectedGoalId(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-drag-handle" />
            <div className="modal-header">
              <h3 className="modal-title">Deposit to Savings</h3>
              <button className="icon-button" onClick={() => setSelectedGoalId(null)}>✕</button>
            </div>
            <form onSubmit={handleDepositSubmit}>
              <div className="form-group">
                <label className="form-label">Deposit Amount (Rs.)</label>
                <div className="amount-input-wrap">
                  <span className="amount-currency">Rs.</span>
                  <input
                    type="number"
                    autoFocus
                    required
                    className="amount-field"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>

              {unspentBudget > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className="quick-chip"
                    onClick={() => setDepositAmount(unspentBudget.toString())}
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary-light)' }}
                  >
                    Use Full Remaining Budget ({formatCurrency(unspentBudget)})
                  </button>
                </div>
              )}

              <button type="submit" className="btn-primary-action" style={{ width: '100%' }}>
                Confirm Savings Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Goal Modal */}
      {isAddingGoal && (
        <div className="modal-overlay" onClick={() => setIsAddingGoal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-drag-handle" />
            <div className="modal-header">
              <h3 className="modal-title">Create Savings Goal</h3>
              <button className="icon-button" onClick={() => setIsAddingGoal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bike Repair, New Laptop, Hajj Fund"
                  required
                  className="form-input"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Amount (Rs.)</label>
                <div className="amount-input-wrap">
                  <span className="amount-currency">Rs.</span>
                  <input
                    type="number"
                    placeholder="10000"
                    required
                    className="amount-field"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Choose Icon</label>
                <div style={{ display: 'flex', gap: 10, fontSize: '1.4rem' }}>
                  {['🎯', '🛡️', '📱', '✈️', '🏡', '🏍️', '🎓', '💍'].map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setNewGoalIcon(ico)}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        background: newGoalIcon === ico ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                        border: newGoalIcon === ico ? '1px solid var(--primary)' : '1px solid transparent'
                      }}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary-action" style={{ width: '100%', marginTop: 12 }}>
                Save Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
