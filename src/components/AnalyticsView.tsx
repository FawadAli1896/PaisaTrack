import React from 'react';
import type { Expense, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/dateHelpers';
import { PieChart, Wallet } from 'lucide-react';

interface AnalyticsViewProps {
  expenses: Expense[];
  budgetLimit: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  expenses,
  budgetLimit
}) => {
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Category Aggregation
  const catTotals: { [key in CategoryId]?: number } = {};
  expenses.forEach((exp) => {
    catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
  });

  const sortedCategories = (Object.keys(catTotals) as CategoryId[]).sort(
    (a, b) => (catTotals[b] || 0) - (catTotals[a] || 0)
  );

  // Payment method aggregation
  const paymentTotals: { [method: string]: number } = {};
  expenses.forEach((exp) => {
    paymentTotals[exp.paymentMethod] = (paymentTotals[exp.paymentMethod] || 0) + exp.amount;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Top Summary Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Total Outflow
          </span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 4
            }}
          >
            {formatCurrency(totalSpent)}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--primary-light)', marginTop: 2 }}>
            Limit: {formatCurrency(budgetLimit)}
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-card)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Daily Average
          </span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 4
            }}
          >
            {formatCurrency(totalSpent / 7)}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Per day this week
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: 'var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px'
        }}
      >
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h3 className="section-title">
            <PieChart size={18} style={{ color: 'var(--primary-light)' }} />
            <span>Spending by Category</span>
          </h3>
        </div>

        {sortedCategories.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            No expenses recorded for this week.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sortedCategories.map((catId) => {
              const amount = catTotals[catId] || 0;
              const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              const cat = CATEGORIES[catId];

              return (
                <div key={catId} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {formatCurrency(amount)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                        ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  <div className="progress-track" style={{ height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Methods Distribution */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: 'var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px'
        }}
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h3 className="section-title">
            <Wallet size={18} style={{ color: '#8b5cf6' }} />
            <span>Payment Channels</span>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {Object.entries(paymentTotals).map(([method, amt]) => {
            const pct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
            return (
              <div
                key={method}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{method}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>
                  {formatCurrency(amt)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--primary-light)', marginTop: 2 }}>
                  {pct.toFixed(0)}% of total
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
