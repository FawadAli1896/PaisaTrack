import React, { useState, useEffect } from 'react';
import type { Expense, SavingsGoal, Achievement, SharedMember, ReminderConfig } from './types';
import {
  DEFAULT_WEEKLY_LIMIT,
  getInitialExpenses,
  INITIAL_SAVINGS_GOALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MEMBERS
} from './data/initialData';
import { getWeekRange, formatDateISO } from './utils/dateHelpers';
import { BudgetHeroCard } from './components/BudgetHeroCard';
import { WeekNavigator } from './components/WeekNavigator';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ExpenseList } from './components/ExpenseList';
import { AnalyticsView } from './components/AnalyticsView';
import { SavingsView } from './components/SavingsView';
import { SharedBudgetModal } from './components/SharedBudgetModal';
import { SettingsModal } from './components/SettingsModal';
import {
  Wallet,
  Home,
  Clock,
  PieChart,
  PiggyBank,
  Plus,
  Users,
  Settings,
  BellRing,
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
  Download
} from 'lucide-react';

export const App: React.FC = () => {
  // Persistence Keys
  const STORAGE_KEY = 'paisatrack_app_v1';

  // Load Initial State from LocalStorage
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : getInitialExpenses();
  });

  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget_limit`);
    return saved ? parseFloat(saved) : DEFAULT_WEEKLY_LIMIT;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [members, setMembers] = useState<SharedMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('mem-1');

  const [reminder, setReminder] = useState<ReminderConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reminder`);
    return saved
      ? JSON.parse(saved)
      : {
          enabled: true,
          time: '21:00',
          hasRecordedToday: false,
          permissionGranted: false
        };
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Listen to PWA install and network status
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('To install on Android: Open in Chrome, tap the 3 dots menu at top right, and select "Install app" or "Add to Home screen".');
    }
  };

  // Active View & Modals
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'analytics' | 'savings'>('dashboard');
  const [offsetWeeks, setOffsetWeeks] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Persist Changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_budget_limit`, budgetLimit.toString());
  }, [budgetLimit]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reminder`, JSON.stringify(reminder));
  }, [reminder]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Current Active User
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];

  // Week Boundaries & Filter
  const currentWeekInfo = getWeekRange(offsetWeeks);
  const weekExpenses = expenses.filter(
    (item) => item.date >= currentWeekInfo.startDate && item.date <= currentWeekInfo.endDate
  );
  const totalSpent = weekExpenses.reduce((sum, item) => sum + item.amount, 0);
  const unspentBudget = budgetLimit - totalSpent;

  // Check if user recorded an expense today
  const todayStr = formatDateISO(new Date());
  const hasExpensesToday = expenses.some((e) => e.date === todayStr);

  // Check achievement unlocks
  useEffect(() => {
    let changed = false;
    const updated = achievements.map((ach) => {
      if (ach.code === 'first_step' && !ach.earnedAt && expenses.length > 0) {
        changed = true;
        return { ...ach, earnedAt: todayStr };
      }
      return ach;
    });

    if (changed) {
      setAchievements(updated);
    }
  }, [expenses, achievements, todayStr]);

  // Handlers
  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...expenseData }
            : item
        )
      );
    } else {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDepositToSavings = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g
      )
    );

    // Also award savings achievement if not earned
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.code === 'savings_goal' && !ach.earnedAt
          ? { ...ach, earnedAt: todayStr }
          : ach
      )
    );
  };

  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`
    };
    setGoals((prev) => [...prev, goal]);
  };

  const handleAddMember = (name: string, role: 'owner' | 'editor') => {
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMem: SharedMember = {
      id: `mem-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@paisatrack.app`,
      role,
      avatar: initials || 'MB',
      isCurrentUser: false
    };
    setMembers((prev) => [...prev, newMem]);
  };

  const handleExportData = () => {
    const data = {
      expenses,
      budgetLimit,
      goals,
      achievements,
      members,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paisatrack_backup_${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.budgetLimit) setBudgetLimit(parsed.budgetLimit);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.achievements) setAchievements(parsed.achievements);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setExpenses(getInitialExpenses());
    setBudgetLimit(DEFAULT_WEEKLY_LIMIT);
    setGoals(INITIAL_SAVINGS_GOALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setMembers(INITIAL_MEMBERS);
    setOffsetWeeks(0);
  };

  return (
    <div className={`app-wrapper ${isFullWidth ? 'fullscreen-mode' : ''}`}>
      <div className={`device-frame ${isFullWidth ? 'is-full-width' : ''}`}>
        {/* Smartphone Status Bar Simulator (in mobile bezel mode) */}
        {!isFullWidth && (
          <div className="phone-status-bar">
            <span>9:41</span>
            <div className="status-bar-notch" />
            <div className="status-bar-icons">
              <Wifi size={13} />
              <Battery size={15} />
            </div>
          </div>
        )}

        {/* Top App Bar */}
        <header className="top-nav-bar">
          <div className="brand-badge">
            <div className="brand-icon">
              <Wallet size={20} />
            </div>
            <div>
              <span className="brand-title">PaisaTrack</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="brand-tag">Weekly Focus</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PKR</span>
              </div>
            </div>
          </div>

          <div className="top-actions">
            {/* Offline status indicator */}
            {!isOnline && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '3px 8px',
                  borderRadius: 12,
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                Offline Safe
              </span>
            )}

            {/* Install to Phone Button */}
            <button
              className="icon-button"
              style={{
                width: 'auto',
                padding: '0 8px',
                borderRadius: 16,
                gap: 4,
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary-light)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
              onClick={handleInstallApp}
              title="Install PaisaTrack App on Phone"
            >
              <Download size={13} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Install</span>
            </button>

            {/* Active User Switcher Pill */}
            <button
              className="icon-button"
              style={{ width: 'auto', padding: '0 8px', borderRadius: 16, gap: 4 }}
              onClick={() => setIsSharedModalOpen(true)}
              title="Collaborative budget members"
            >
              <Users size={14} style={{ color: 'var(--primary-light)' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
            </button>

            {/* Toggle Fullscreen / Chassis button */}
            <button
              className="icon-button"
              onClick={() => setIsFullWidth(!isFullWidth)}
              title={isFullWidth ? 'Switch to Smartphone chassis view' : 'Expand full width'}
            >
              {isFullWidth ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Settings button */}
            <button
              className="icon-button"
              onClick={() => setIsSettingsModalOpen(true)}
              title="Settings & Reminders"
            >
              <Settings size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable Main View Area */}
        <main className="app-content">
          {/* Smart Reminder Alert (If user hasn't added expenses today) */}
          {!hasExpensesToday && reminder.enabled && (
            <div className="reminder-banner">
              <div className="reminder-icon-box">
                <BellRing size={16} />
              </div>
              <div className="reminder-content">
                <div className="reminder-title">Daily Reminder: Time to update expenses</div>
                <div className="reminder-text">
                  Did you spend any money today? Take 30 seconds to record it so you don’t forget!
                </div>
                <span
                  className="reminder-action-btn"
                  onClick={() => {
                    setEditingExpense(null);
                    setIsAddModalOpen(true);
                  }}
                >
                  + Add Today's Expense Now
                </span>
              </div>
            </div>
          )}

          {/* Week Navigation Header */}
          <WeekNavigator
            offsetWeeks={offsetWeeks}
            formattedRange={currentWeekInfo.formattedRange}
            weekLabel={currentWeekInfo.weekLabel}
            onPrevWeek={() => setOffsetWeeks((w) => w - 1)}
            onNextWeek={() => setOffsetWeeks((w) => w + 1)}
            onResetToCurrent={() => setOffsetWeeks(0)}
          />

          {/* Tab 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* Primary Budget Hero Card */}
              <BudgetHeroCard
                budgetLimit={budgetLimit}
                totalSpent={totalSpent}
                daysRemaining={currentWeekInfo.daysRemaining}
                onUpdateBudget={(newLimit) => setBudgetLimit(newLimit)}
                onOpenSavingsTransfer={() => setActiveTab('savings')}
              />

              {/* Quick Actions Row */}
              <div className="quick-action-row">
                <button
                  className="btn-primary-action"
                  onClick={() => {
                    setEditingExpense(null);
                    setIsAddModalOpen(true);
                  }}
                >
                  <Plus size={18} />
                  <span>Add Expense</span>
                </button>

                <button
                  className="btn-secondary-action"
                  onClick={() => setActiveTab('savings')}
                >
                  <PiggyBank size={16} />
                  <span>Savings</span>
                </button>
              </div>

              {/* Recent Activity Mini List */}
              <ExpenseList
                expenses={weekExpenses}
                onEdit={(exp) => {
                  setEditingExpense(exp);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeleteExpense}
                onOpenAddModal={() => {
                  setEditingExpense(null);
                  setIsAddModalOpen(true);
                }}
              />
            </>
          )}

          {/* Tab 2: Full Activity History */}
          {activeTab === 'history' && (
            <ExpenseList
              expenses={weekExpenses}
              onEdit={(exp) => {
                setEditingExpense(exp);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteExpense}
              onOpenAddModal={() => {
                setEditingExpense(null);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {/* Tab 3: Analytics & Breakdown */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              expenses={weekExpenses}
              budgetLimit={budgetLimit}
            />
          )}

          {/* Tab 4: Savings & Achievements */}
          {activeTab === 'savings' && (
            <SavingsView
              goals={goals}
              achievements={achievements}
              unspentBudget={unspentBudget}
              onDepositToGoal={handleDepositToSavings}
              onAddGoal={handleAddGoal}
            />
          )}
        </main>

        {/* Bottom App Navigation Dock */}
        <nav className="bottom-dock">
          <button
            className={`dock-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className={`dock-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={19} />
            <span>Activity</span>
          </button>

          {/* Prominent Center Add Button */}
          <button
            className="dock-center-fab"
            onClick={() => {
              setEditingExpense(null);
              setIsAddModalOpen(true);
            }}
            title="Add Expense"
          >
            <Plus size={24} />
          </button>

          <button
            className={`dock-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <PieChart size={19} />
            <span>Analytics</span>
          </button>

          <button
            className={`dock-item ${activeTab === 'savings' ? 'active' : ''}`}
            onClick={() => setActiveTab('savings')}
          >
            <PiggyBank size={19} />
            <span>Savings</span>
          </button>
        </nav>

        {/* Modals & Dialogs */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
          currentUserName={currentUser.name}
        />

        <SharedBudgetModal
          isOpen={isSharedModalOpen}
          onClose={() => setIsSharedModalOpen(false)}
          members={members}
          currentUserId={currentUserId}
          onSwitchUser={(id) => setCurrentUserId(id)}
          onAddMember={handleAddMember}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          reminder={reminder}
          onUpdateReminder={(updated) => setReminder((r) => ({ ...r, ...updated }))}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          isFullWidth={isFullWidth}
          onToggleFullWidth={() => setIsFullWidth(!isFullWidth)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetData={handleResetData}
        />
      </div>
    </div>
  );
};

export default App;
