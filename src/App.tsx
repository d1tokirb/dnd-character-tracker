import { useState, useEffect } from 'react';
import type { Character, AbilityScores, InventoryItem, Feature } from './types';
import { Stats } from './components/Stats';
import { Combat } from './components/Combat';
import { Skills } from './components/Skills';
import { SavingThrows } from './components/SavingThrows';
import { Inventory } from './components/Inventory';
import { Features } from './components/Features';
import { Spells } from './components/Spells';
import { DiceRoller } from './components/DiceRoller';
import { CharacterDetails } from './components/CharacterDetails';
import { XPBar } from './components/XPBar';
import { supabase } from './supabase';
import { Auth } from './components/Auth';
import type { Session } from '@supabase/supabase-js';
import './index.css';

const INITIAL_CHARACTER: Character = {
  name: 'Valeros',
  race: 'Human',
  class: 'Fighter',
  level: 1,
  abilities: {
    str: 16,
    dex: 14,
    con: 15,
    int: 10,
    wis: 12,
    cha: 8,
  },
  hp: {
    current: 12,
    max: 12,
    temp: 0,
  },
  ac: 16,
  speed: 30,
  initiative: 2,
  skills: [
    { name: 'Athletics', ability: 'str', proficient: true },
    { name: 'Intimidation', ability: 'cha', proficient: true },
  ],
  savingThrows: [
    { name: 'Strength', ability: 'str', proficient: true },
    { name: 'Constitution', ability: 'con', proficient: true },
  ],
  inventory: [
    { id: '1', name: 'Longsword', quantity: 1, weight: 3, description: 'Versatile (1d10)' },
    { id: '2', name: 'Chain Mail', quantity: 1, weight: 55, description: 'AC 16, Str 13, Disadvantage on Stealth' },
    { id: '3', name: 'Shield', quantity: 1, weight: 6, description: '+2 AC' },
    { id: '4', name: 'Explorer\'s Pack', quantity: 1, weight: 59, description: 'Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.' },
  ],
  features: [
    { id: '1', name: 'Second Wind', source: 'Fighter 1', description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.' },
    { id: '2', name: 'Fighting Style (Defense)', source: 'Fighter 1', description: 'While you are wearing armor, you gain a +1 bonus to AC.' }
  ],
  spells: {
    slots: { 1: { total: 0, used: 0 } },
    list: [],
  },
  details: {
    background: 'Soldier',
    alignment: 'Neutral Good',
    xp: 0,
    traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
  },
  notes: '',
};

// XP Table for level calculation
const XP_TABLE: { [level: number]: number } = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load character data
  useEffect(() => {
    if (!session) return;

    const loadCharacter = async () => {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading character:', error);
        }

        if (data) {
          const loadedData = data.data || {};

          // Robust merge to handle missing/null nested objects
          const mergedChar: Character = {
            ...INITIAL_CHARACTER,
            ...loadedData,
            // Deep merge objects that might be null/undefined in loadedData
            abilities: { ...INITIAL_CHARACTER.abilities, ...(loadedData.abilities || {}) },
            hp: { ...INITIAL_CHARACTER.hp, ...(loadedData.hp || {}) },
            details: { ...INITIAL_CHARACTER.details, ...(loadedData.details || {}) },
            spells: {
              slots: { ...INITIAL_CHARACTER.spells.slots, ...(loadedData.spells?.slots || {}) },
              list: loadedData.spells?.list || INITIAL_CHARACTER.spells.list,
            },
            // Arrays can just fallback to initial if missing
            skills: loadedData.skills || INITIAL_CHARACTER.skills,
            savingThrows: loadedData.savingThrows || INITIAL_CHARACTER.savingThrows,
            inventory: loadedData.inventory || INITIAL_CHARACTER.inventory,
            features: loadedData.features || INITIAL_CHARACTER.features,
          };

          setCharacter(mergedChar);
        } else {
          // Create initial character if none exists
          const { error: insertError } = await supabase
            .from('characters')
            .insert([
              {
                user_id: session.user.id,
                name: INITIAL_CHARACTER.name,
                data: INITIAL_CHARACTER
              }
            ]);

          if (insertError) {
            console.error('Error creating character:', insertError);
          }
        }
      } catch (err) {
        console.error('Unexpected error loading character:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadCharacter();
  }, [session]);

  // Save character data (debounced)
  useEffect(() => {
    if (!session || isInitialLoad) return;

    const timer = setTimeout(async () => {
      try {
        // Check if character exists first
        const { data: existing } = await supabase
          .from('characters')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (existing) {
          await supabase
            .from('characters')
            .update({
              name: character.name,
              data: character,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', session.user.id);
        }
      } catch (err) {
        console.error('Error saving character:', err);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [character, session, isInitialLoad]);

  // Auto-level up based on XP
  useEffect(() => {
    let newLevel = 1;
    for (let lvl = 20; lvl >= 1; lvl--) {
      if (character.details.xp >= XP_TABLE[lvl]) {
        newLevel = lvl;
        break;
      }
    }

    if (newLevel !== character.level) {
      setCharacter(prev => ({ ...prev, level: newLevel }));
    }
  }, [character.details.xp]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }



  const proficiencyBonus = Math.ceil(character.level / 4) + 1;

  const handleHeaderChange = (field: 'name' | 'race' | 'class', value: string) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const handleAbilityChange = (ability: keyof AbilityScores, value: number) => {
    setCharacter((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: value,
      },
    }));
  };

  const handleHpChange = (type: 'current' | 'max' | 'temp', value: number) => {
    setCharacter((prev) => ({
      ...prev,
      hp: {
        ...prev.hp,
        [type]: value,
      },
    }));
  };

  // Revised handleToggleProficiency
  const handleToggleProficiency = (skillName: string) => {
    setCharacter((prev) => {
      const exists = prev.skills.find(s => s.name === skillName);
      if (exists) {
        return {
          ...prev,
          skills: prev.skills.map(s => s.name === skillName ? { ...s, proficient: !s.proficient } : s)
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, { name: skillName, ability: 'str', proficient: true }] // ability is dummy
        };
      }
    });
  };

  const handleToggleSave = (saveName: string) => {
    setCharacter((prev) => {
      const exists = prev.savingThrows.find(s => s.name === saveName);
      if (exists) {
        return {
          ...prev,
          savingThrows: prev.savingThrows.map(s => s.name === saveName ? { ...s, proficient: !s.proficient } : s)
        };
      } else {
        return {
          ...prev,
          savingThrows: [...prev.savingThrows, { name: saveName, ability: 'str', proficient: true }] // ability is dummy
        };
      }
    });
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: 'New Item',
      quantity: 1,
      weight: 0,
      description: ''
    };
    setCharacter((prev) => ({
      ...prev,
      inventory: [...prev.inventory, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((item) => item.id !== id),
    }));
  };

  const handleUpdateItem = (id: string, field: keyof InventoryItem, value: string | number) => {
    setCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Features Handlers
  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: crypto.randomUUID(),
      name: 'New Feature',
      source: '',
      description: ''
    };
    setCharacter((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
  };

  const handleRemoveFeature = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const handleUpdateFeature = (id: string, field: keyof Feature, value: string) => {
    setCharacter((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    }));
  };

  // Spells Handlers
  const handleSlotChange = (level: number, type: 'total' | 'used', value: number) => {
    setCharacter(prev => ({
      ...prev,
      spells: {
        ...prev.spells,
        slots: {
          ...prev.spells.slots,
          [level]: {
            ...prev.spells.slots[level],
            [type]: value
          }
        }
      }
    }));
  };

  const handleAddSpell = (name: string, level: number, description: string) => {
    setCharacter(prev => ({
      ...prev,
      spells: {
        ...prev.spells,
        list: [...prev.spells.list, { name, level, description, prepared: false }]
      }
    }));
  };

  const handleTogglePrepared = (name: string) => {
    setCharacter(prev => ({
      ...prev,
      spells: {
        ...prev.spells,
        list: prev.spells.list.map(s => s.name === name ? { ...s, prepared: !s.prepared } : s)
      }
    }));
  };

  const handleRemoveSpell = (name: string) => {
    setCharacter(prev => ({
      ...prev,
      spells: {
        ...prev.spells,
        list: prev.spells.list.filter(s => s.name !== name)
      }
    }));
  };

  // Details Handler
  const handleDetailChange = (field: string, value: string | number) => {
    setCharacter(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  const handleCombatChange = (field: 'ac' | 'speed' | 'initiative', value: number) => {
    setCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">
          <div className="header-inputs">
            <input
              className="char-name-input"
              value={character.name}
              onChange={(e) => handleHeaderChange('name', e.target.value)}
              placeholder="Character Name"
            />
            <div className="char-meta-inputs">
              <input
                className="char-race-input"
                value={character.race}
                onChange={(e) => handleHeaderChange('race', e.target.value)}
                placeholder="Race"
              />
              <input
                className="char-class-input"
                value={character.class}
                onChange={(e) => handleHeaderChange('class', e.target.value)}
                placeholder="Class"
              />
              <span className="char-level">Level {character.level}</span>
            </div>
          </div>
          <div className="app-title">
            <h1>D&D 5e</h1>
            <button className="sign-out-btn" onClick={() => supabase.auth.signOut()}>
              Sign Out
            </button>
          </div>
        </div>
        <div className="container">
          <XPBar currentXP={character.details.xp} level={character.level} />
        </div>
      </header>

      <main className="container main-content">
        <section className="stats-section">
          <Stats abilities={character.abilities} onChange={handleAbilityChange} />
        </section>

        <div className="grid-layout">
          <div className="left-column">
            <section className="combat-section">
              <Combat
                hp={character.hp}
                ac={character.ac}
                speed={character.speed}
                initiative={character.initiative}
                onHpChange={handleHpChange}
                onStatChange={handleCombatChange}
              />
            </section>

            <section className="saves-section">
              <SavingThrows
                saves={character.savingThrows || []}
                abilities={character.abilities}
                onToggleProficiency={handleToggleSave}
                proficiencyBonus={proficiencyBonus}
              />
            </section>

            <section className="skills-section">
              <Skills
                skills={character.skills || []}
                abilities={character.abilities}
                onToggleProficiency={handleToggleProficiency}
                proficiencyBonus={proficiencyBonus}
              />
            </section>
          </div>

          <div className="middle-column">
            <section className="details-section">
              <CharacterDetails
                details={character.details}
                onChange={handleDetailChange}
              />
            </section>

            <section className="inventory-section">
              <Inventory
                items={character.inventory || []}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
              />
            </section>
          </div>

          <div className="right-column">
            <section className="dice-section">
              <DiceRoller />
            </section>

            <section className="features-section">
              <Features
                features={character.features || []}
                onAddFeature={handleAddFeature}
                onRemoveFeature={handleRemoveFeature}
                onUpdateFeature={handleUpdateFeature}
              />
            </section>

            <section className="spells-section">
              <Spells
                slots={character.spells?.slots || { 1: { total: 0, used: 0 } }}
                list={character.spells?.list || []}
                onSlotChange={handleSlotChange}
                onAddSpell={handleAddSpell}
                onTogglePrepared={handleTogglePrepared}
                onRemoveSpell={handleRemoveSpell}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 D&D Character Tracker</p>
        </div>
      </footer>
      <style>{`
        .app-header {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: var(--spacing-md) 0 0 0;
          margin-bottom: var(--spacing-lg);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .header-inputs {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .char-name-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          color: var(--text-primary);
          font-size: 2rem;
          font-weight: 700;
          width: 300px;
          padding: 0;
        }
        .char-name-input:focus {
          outline: none;
          border-bottom: 1px solid var(--accent-gold);
        }
        .char-meta-inputs {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
          color: var(--text-secondary);
        }
        .char-race-input, .char-class-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 1rem;
          width: 100px;
        }
        .char-race-input:focus, .char-class-input:focus {
          outline: none;
          border-bottom: 1px solid var(--accent-gold);
          color: var(--text-primary);
        }
        .char-level {
          font-weight: bold;
          color: var(--accent-gold);
        }
        .app-title {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-xs);
        }
        .app-title h1 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text-secondary);
          opacity: 0.5;
        }
        .sign-out-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .sign-out-btn:hover {
          border-color: var(--accent-red);
          color: var(--accent-red);
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: var(--text-secondary);
          font-family: var(--font-heading);
        }
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-md);
          align-items: start;
        }
        .left-column, .middle-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .app-footer {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-md) 0;
          text-align: center;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}

export default App;
