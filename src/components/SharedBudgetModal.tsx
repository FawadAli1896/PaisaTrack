import React, { useState } from 'react';
import type { SharedMember } from '../types';
import { Users, UserPlus, Check, Copy, X } from 'lucide-react';

interface SharedBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: SharedMember[];
  currentUserId: string;
  onSwitchUser: (userId: string) => void;
  onAddMember: (name: string, role: 'owner' | 'editor') => void;
}

export const SharedBudgetModal: React.FC<SharedBudgetModalProps> = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  onSwitchUser,
  onAddMember
}) => {
  const [inviteCode] = useState('PAISA-7749-BUDGET');
  const [copied, setCopied] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole] = useState<'owner' | 'editor'>('editor');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://paisatrack.app/join/${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim(), newMemberRole);
      setNewMemberName('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.1rem' }}>Shared Family Budget</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Collaborate with someone you trust
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Invite Code Generator Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Budget Invitation Link / Code
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--primary-light)',
                letterSpacing: '0.05em'
              }}
            >
              {inviteCode}
            </code>
            <button
              className="btn-secondary-action"
              style={{ padding: '8px 12px', fontSize: '0.75rem' }}
              onClick={handleCopy}
            >
              {copied ? <Check size={14} style={{ color: 'var(--primary-light)' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Member List with Simulation Switch */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>
            Active Budget Members (Tap to switch who's spending)
          </div>

          <div className="member-list">
            {members.map((member) => {
              const isSelected = member.id === currentUserId;

              return (
                <div
                  key={member.id}
                  className="member-row"
                  style={{
                    border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSwitchUser(member.id)}
                >
                  <div className="member-info">
                    <div className="member-avatar">{member.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {member.name} {member.isCurrentUser && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`role-tag ${member.role}`}>
                      {member.role}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permissions Table Guide */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginBottom: 16
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Role Permissions Overview:
          </div>
          <div>• <strong>Owner:</strong> View/Add expenses, change weekly limit, manage invites</div>
          <div>• <strong>Editor:</strong> View/Add/Edit own daily expenses only</div>
        </div>

        {/* Add Member Quick Form */}
        <form onSubmit={handleAdd}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Add family member (e.g. Fatima)"
              className="form-input"
              style={{ flex: 1, fontSize: '0.8rem', height: 40 }}
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary-action"
              style={{ padding: '0 16px', fontSize: '0.8rem' }}
            >
              <UserPlus size={16} />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
