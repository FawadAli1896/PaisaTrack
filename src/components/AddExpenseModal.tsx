import React, { useState, useEffect } from 'react';
import type { Expense, CategoryId, PaymentMethod } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatDateISO } from '../utils/dateHelpers';
import { PlusCircle, Check, X, Calendar, FileText } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id' | 'createdAt'>, editingId?: string) => void;
  editingExpense?: Expense | null;
  currentUserName: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  currentUserName
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateISO(new Date()));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod);
    } else {
      setAmount('');
      setCategory('food');
      setDescription('');
      setDate(formatDateISO(new Date()));
      setPaymentMethod('Cash');
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSave(
      {
        amount: parsedAmount,
        category,
        description: description.trim() || `${CATEGORIES[category].name} expense`,
        date,
        paymentMethod,
        createdBy: editingExpense ? editingExpense.createdBy : currentUserName
      },
      editingExpense?.id
    );

    onClose();
  };

  const handleQuickAdd = (added: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + added).toString());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" />

        <div className="modal-header">
          <h3 className="modal-title">
            {editingExpense ? 'Edit Expense' : 'Quick Add Expense'}
          </h3>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input with big numeric font */}
          <div className="form-group">
            <label className="form-label">Expense Amount</label>
            <div className="amount-input-wrap">
              <span className="amount-currency">Rs.</span>
              <input
                type="number"
                step="any"
                autoFocus
                placeholder="0"
                required
                className="amount-field"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Quick increment chips */}
            <div className="quick-chip-row">
              {[50, 100, 250, 500, 1000].map((addVal) => (
                <button
                  key={addVal}
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAdd(addVal)}
                >
                  +{addVal}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-picker-grid">
              {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
                const cat = CATEGORIES[catId];
                const isSelected = category === catId;
                return (
                  <div
                    key={catId}
                    className={`category-choice ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategory(catId)}
                  >
                    <span className="category-choice-icon">{cat.icon}</span>
                    <span className="category-choice-name">{cat.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Note</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Lunch Biryani, Fuel, Milk..."
                className="form-input"
                style={{ width: '100%', paddingLeft: 34 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FileText
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          {/* Date Picker (defaults to Today, supports past entries) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Date of Expense</label>
              {date !== formatDateISO(new Date()) && (
                <button
                  type="button"
                  onClick={() => setDate(formatDateISO(new Date()))}
                  style={{ fontSize: '0.7rem', color: 'var(--primary-light)' }}
                >
                  Set to Today
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: 34 }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Calendar
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          {/* Payment Method Segmented Control */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="segmented-control">
              {(['Cash', 'Wallet', 'Card', 'Bank'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`segmented-btn ${paymentMethod === method ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="btn-primary-action"
              style={{ width: '100%', padding: '16px 20px', fontSize: '1rem' }}
            >
              {editingExpense ? <Check size={18} /> : <PlusCircle size={18} />}
              <span>{editingExpense ? 'Save Changes' : 'Record Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
