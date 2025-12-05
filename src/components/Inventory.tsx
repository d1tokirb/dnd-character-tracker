import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface InventoryProps {
  items: InventoryItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof InventoryItem, value: string | number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onAddItem, onRemoveItem, onUpdateItem }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="inventory-card card">
      <div className="inventory-header">
        <h3>Inventory</h3>
        <span className="total-weight">Total Weight: {totalWeight} lbs</span>
      </div>

      <div className="inventory-list">
        <div className="inventory-header-row">
          <span className="col-name">Item</span>
          <span className="col-qty">Qty</span>
          <span className="col-weight">Lbs</span>
          <span className="col-actions"></span>
        </div>

        {items.map((item) => (
          <div key={item.id} className={`inventory-item-container ${expandedId === item.id ? 'expanded' : ''}`}>
            <div className="inventory-row">
              <div className="col-name">
                <input
                  value={item.name}
                  onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                  placeholder="Item Name"
                  className="item-name-input"
                />
                <button
                  className="expand-btn"
                  onClick={() => toggleExpand(item.id)}
                  title="Toggle Details"
                >
                  {expandedId === item.id ? '▼' : '▶'}
                </button>
              </div>
              <div className="col-qty">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="item-qty-input"
                />
              </div>
              <div className="col-weight">
                <input
                  type="number"
                  value={item.weight}
                  onChange={(e) => onUpdateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                  className="item-weight-input"
                />
              </div>
              <div className="col-actions">
                <button
                  className="remove-btn"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            </div>

            {expandedId === item.id && (
              <div className="item-details">
                <textarea
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Description..."
                  className="item-desc-input"
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="add-item-btn" onClick={onAddItem}>
        + Add Item
      </button>

      <style>{`
                .inventory-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }
                .inventory-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    padding-bottom: var(--spacing-xs);
                    border-bottom: 1px solid var(--border-color);
                }
                .total-weight {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .inventory-list {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-height: 400px;
                }
                .inventory-header-row {
                    display: flex;
                    padding: 0 var(--spacing-xs);
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                }
                .col-name { flex: 1; display: flex; align-items: center; gap: 4px; }
                .col-qty { width: 40px; text-align: center; }
                .col-weight { width: 40px; text-align: center; }
                .col-actions { width: 24px; text-align: center; }

                .inventory-item-container {
                    background-color: var(--bg-tertiary);
                    border-radius: 4px;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .inventory-item-container.expanded {
                    border-color: var(--accent-gold);
                    background-color: var(--bg-secondary);
                }
                
                .inventory-row {
                    display: flex;
                    align-items: center;
                    padding: 4px var(--spacing-xs);
                    min-height: 32px;
                }

                input {
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-family: inherit;
                    width: 100%;
                }
                input:focus {
                    outline: none;
                    background-color: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }
                
                .item-name-input {
                    font-weight: 500;
                }
                .item-qty-input, .item-weight-input {
                    text-align: center;
                    color: var(--text-secondary);
                }

                .expand-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.6rem;
                    padding: 4px;
                    cursor: pointer;
                    opacity: 0.5;
                }
                .expand-btn:hover { opacity: 1; color: var(--accent-gold); }

                .remove-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.2rem;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0.5;
                }
                .remove-btn:hover { opacity: 1; color: var(--accent-red); }

                .item-details {
                    padding: 0 var(--spacing-xs) var(--spacing-xs);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .item-desc-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 40px;
                    margin-top: 4px;
                }
                .item-desc-input:focus {
                    outline: none;
                }

                .add-item-btn {
                    background-color: var(--bg-tertiary);
                    border: 1px dashed var(--border-color);
                    color: var(--text-secondary);
                    padding: var(--spacing-xs);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .add-item-btn:hover {
                    border-color: var(--accent-gold);
                    color: var(--accent-gold);
                    background-color: rgba(212, 175, 55, 0.1);
                }
            `}</style>
    </div>
  );
};
