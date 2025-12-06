import React, { useState } from 'react';
import type { Weapon } from '../types';

interface WeaponsProps {
    weapons: Weapon[];
    onAddWeapon: (weapon: Omit<Weapon, 'id'>) => void;
    onRemoveWeapon: (id: string) => void;
}

export const Weapons: React.FC<WeaponsProps> = ({ weapons, onAddWeapon, onRemoveWeapon }) => {
    const [newWeapon, setNewWeapon] = useState<Omit<Weapon, 'id'>>({
        name: '',
        atkBonus: '',
        damage: '',
        type: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWeapon.name) {
            onAddWeapon(newWeapon);
            setNewWeapon({ name: '', atkBonus: '', damage: '', type: '' });
        }
    };

    return (
        <div className="weapons-container card">
            <h3>Weapons & Attacks</h3>

            <form onSubmit={handleAdd} className="add-weapon-form">
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Weapon Name"
                        value={newWeapon.name}
                        onChange={e => setNewWeapon({ ...newWeapon, name: e.target.value })}
                        className="name-input"
                    />
                    <input
                        type="text"
                        placeholder="Atk Bonus"
                        value={newWeapon.atkBonus}
                        onChange={e => setNewWeapon({ ...newWeapon, atkBonus: e.target.value })}
                        className="bonus-input"
                    />
                    <input
                        type="text"
                        placeholder="Damage"
                        value={newWeapon.damage}
                        onChange={e => setNewWeapon({ ...newWeapon, damage: e.target.value })}
                        className="damage-input"
                    />
                    <button type="submit">Add</button>
                </div>
            </form>

            <div className="weapons-list">
                <div className="weapons-header">
                    <span className="col-name">Name</span>
                    <span className="col-atk">Atk Bonus</span>
                    <span className="col-dmg">Damage</span>
                    <span className="col-action"></span>
                </div>
                {weapons.map(weapon => (
                    <div key={weapon.id} className="weapon-item">
                        <span className="col-name">{weapon.name}</span>
                        <span className="col-atk">{weapon.atkBonus}</span>
                        <span className="col-dmg">{weapon.damage}</span>
                        <span className="col-action">
                            <button onClick={() => onRemoveWeapon(weapon.id)} className="remove-btn">×</button>
                        </span>
                    </div>
                ))}
                {weapons.length === 0 && <div className="empty-msg">No weapons equipped</div>}
            </div>

            <style>{`
        .weapons-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .add-weapon-form {
          background: var(--bg-tertiary);
          padding: var(--spacing-sm);
          border-radius: 4px;
        }
        .form-row {
          display: flex;
          gap: var(--spacing-sm);
        }
        .name-input { flex: 3; }
        .bonus-input { flex: 1; }
        .damage-input { flex: 2; }
        
        .add-weapon-form button {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          border: none;
          padding: 0 var(--spacing-md);
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        .weapons-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .weapons-header, .weapon-item {
          display: flex;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .weapons-header {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .col-name { flex: 3; font-weight: bold; color: var(--text-primary); }
        .col-atk { flex: 1; text-align: center; color: var(--accent-gold); }
        .col-dmg { flex: 2; text-align: center; }
        .col-action { flex: 0 0 30px; text-align: right; }

        .remove-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .remove-btn:hover {
          opacity: 1;
          color: var(--accent-red);
        }
        .empty-msg {
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
          padding: var(--spacing-md);
        }
      `}</style>
        </div>
    );
};
