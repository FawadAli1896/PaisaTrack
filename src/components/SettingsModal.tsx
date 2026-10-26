import React, { useState } from 'react';
import type { ReminderConfig } from '../types';
import { Bell, Moon, Sun, Smartphone, Download, Upload, RotateCcw, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderConfig;
  onUpdateReminder: (updated: Partial<ReminderConfig>) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  reminder,
  onUpdateReminder,
  theme,
  onToggleTheme,
  isFullWidth,
  onToggleFullWidth,
  onExportData,
  onImportData,
  onResetData
}) => {
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateReminder({ enabled: true, permissionGranted: true });
        new Notification('PaisaTrack Smart Reminder Enabled', {
          body: 'We will remind you at ' + reminder.time + ' if you haven’t entered your daily expenses!',
          icon: '/favicon.svg'
        });
      } else {
        alert('Notification permission was not granted by your browser.');
        onUpdateReminder({ enabled: false, permissionGranted: false });
      }
    } else {
      alert('Your browser does not support the Web Notification API.');
    }
  };

  const handleSendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ PaisaTrack Daily Reminder', {
        body: 'Did you spend any money today? Take 30 seconds to update your budget.',
        icon: '/favicon.svg'
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    } else {
      handleEnableNotifications();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" />

        <div className="modal-header">
          <h3 className="modal-title">Preferences & Settings</h3>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Smart Reminder Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Smart Evening Reminders</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Only notifies you if zero expenses entered today
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={reminder.enabled}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleEnableNotifications();
                  } else {
                    onUpdateReminder({ enabled: false });
                  }
                }}
              />
            </div>

            {reminder.enabled && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Scheduled Time:
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: 110 }}
                    value={reminder.time}
                    onChange={(e) => onUpdateReminder({ time: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ width: '100%', marginTop: 10, padding: '8px 12px', fontSize: '0.75rem' }}
                  onClick={handleSendTestNotification}
                >
                  <Bell size={14} />
                  <span>{testNotificationSent ? 'Notification Sent!' : 'Trigger Test Reminder Now'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme & Display Options */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>App Theme</span>
              </div>
              <button
                className="btn-secondary-action"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={onToggleTheme}
              >
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Smartphone size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Display Layout</span>
              </div>
              <button
                className="btn-secondary-action"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={onToggleFullWidth}
              >
                {isFullWidth ? 'Mobile Chassis' : 'Full Width'}
              </button>
            </div>
          </div>

          {/* Backup & Data Management */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Cloud & Local Backup (Offline Safe)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                className="btn-secondary-action"
                style={{ padding: '8px 10px', fontSize: '0.75rem' }}
                onClick={onExportData}
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <label
                className="btn-secondary-action"
                style={{ padding: '8px 10px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <Upload size={14} />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={onImportData}
                />
              </label>
            </div>

            <button
              className="btn-secondary-action"
              style={{
                color: 'rgba(239, 68, 68, 0.8)',
                padding: '8px 10px',
                fontSize: '0.75rem',
                marginTop: 4
              }}
              onClick={() => {
                if (window.confirm('Reset all expenses and budgets back to initial sample values?')) {
                  onResetData();
                  onClose();
                }
              }}
            >
              <RotateCcw size={14} />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
