import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WeekNavigatorProps {
  offsetWeeks: number;
  formattedRange: string;
  weekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onResetToCurrent: () => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  offsetWeeks,
  formattedRange,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onResetToCurrent
}) => {
  const isCurrentWeek = offsetWeeks === 0;

  return (
    <div className="week-navigator-card">
      <button
        className="week-nav-btn"
        onClick={onPrevWeek}
        title="Previous Week"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="week-info-center">
        <div className="week-title">
          <span>{weekLabel}</span>
          {isCurrentWeek ? (
            <span className="current-week-tag">Active</span>
          ) : (
            <button
              onClick={onResetToCurrent}
              style={{
                fontSize: '0.65rem',
                color: 'var(--primary-light)',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              (Jump to Current)
            </button>
          )}
        </div>
        <div className="week-date-range" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Calendar size={12} />
          <span>{formattedRange}</span>
        </div>
      </div>

      <button
        className="week-nav-btn"
        onClick={onNextWeek}
        title="Next Week"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
