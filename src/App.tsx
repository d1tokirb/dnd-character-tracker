import { useState, useEffect } from 'react';
import type { Character, AbilityScores, InventoryItem, Feature, Weapon } from './types';
import { Stats } from './components/Stats';
import { Combat } from './components/Combat';
import { Skills } from './components/Skills';
import { SavingThrows } from './components/SavingThrows';
import { Inventory } from './components/Inventory';
import { Weapons } from './components/Weapons';
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
  weapons: [],
  spellcastingAbility: 'int',
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



import { CharacterSelection } from './components/CharacterSelection';

// ... (imports)

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Multiple characters state
  const [charactersList, setCharactersList] = useState<{ id: string; name: string; level: number; class: string; race: string }[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
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

  // Load ALL characters for the user
  useEffect(() => {
    if (!session) return;

    const loadCharactersList = async () => {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('id, name, data')
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (data) {
          const list = data.map(row => ({
            id: row.id,
            name: row.data.name || 'Unknown',
            level: row.data.level || 1,
            class: row.data.class || 'Unknown',
            race: row.data.race || 'Unknown'
          }));
          setCharactersList(list);
          setSelectedCharacterId(null); // Explicitly reset selection to force screen
        }
      } catch (err) {
        console.error('Error loading characters list:', err);
      }
    };

    loadCharactersList();
  }, [session]);

  // Load SELECTED character data
  useEffect(() => {
    if (!session || !selectedCharacterId) return;

    const loadSelectedCharacter = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('id', selectedCharacterId)
          .single();

        if (error) throw error;

        if (data) {
          const loadedData = data.data || {};
          // Robust merge (same as before)
          const mergedChar: Character = {
            ...INITIAL_CHARACTER,
            ...loadedData,
            abilities: { ...INITIAL_CHARACTER.abilities, ...(loadedData.abilities || {}) },
            hp: { ...INITIAL_CHARACTER.hp, ...(loadedData.hp || {}) },
            details: { ...INITIAL_CHARACTER.details, ...(loadedData.details || {}) },
            spells: {
              slots: { ...INITIAL_CHARACTER.spells.slots, ...(loadedData.spells?.slots || {}) },
              list: loadedData.spells?.list || INITIAL_CHARACTER.spells.list,
            },
            skills: loadedData.skills || INITIAL_CHARACTER.skills,
            savingThrows: loadedData.savingThrows || INITIAL_CHARACTER.savingThrows,
            inventory: loadedData.inventory || INITIAL_CHARACTER.inventory,
            weapons: loadedData.weapons || INITIAL_CHARACTER.weapons,
            features: loadedData.features || INITIAL_CHARACTER.features,
            spellcastingAbility: loadedData.spellcastingAbility || INITIAL_CHARACTER.spellcastingAbility,
          };
          setCharacter(mergedChar);
        }
      } catch (err) {
        console.error('Error loading selected character:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadSelectedCharacter();
  }, [selectedCharacterId, session]);

  // Create New Character
  const handleCreateCharacter = async (name: string) => {
    if (!session) return;

    const newCharData = { ...INITIAL_CHARACTER, name };

    try {
      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            user_id: session.user.id,
            name: name,
            data: newCharData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Add to list and select it
        setCharactersList(prev => [...prev, {
          id: data.id,
          name: data.data.name,
          level: data.data.level,
          class: data.data.class,
          race: data.data.race
        }]);
        setSelectedCharacterId(data.id);
      }
    } catch (err) {
      console.error('Error creating character:', err);
    }
  };

  // Delete Character
  const handleDeleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCharactersList(prev => prev.filter(c => c.id !== id));
      if (selectedCharacterId === id) {
        setSelectedCharacterId(null);
      }
    } catch (err) {
      console.error('Error deleting character:', err);
    }
  };

  // Save character data (debounced) - UPDATED to use selectedCharacterId
  useEffect(() => {
    if (!session || isInitialLoad || !selectedCharacterId) return;

    const timer = setTimeout(async () => {
      try {
        await supabase
          .from('characters')
          .update({
            name: character.name,
            data: character,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCharacterId); // Update by ID, not user_id

        // Update list preview data if name/level/class/race changed
        setCharactersList(prev => prev.map(c =>
          c.id === selectedCharacterId
            ? { ...c, name: character.name, level: character.level, class: character.class, race: character.race }
            : c
        ));
      } catch (err) {
        console.error('Error saving character:', err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [character, session, isInitialLoad, selectedCharacterId]);

  // Level Calculation Helper
  const calculateLevel = (xp: number) => {
    if (xp < 300) return 1;
    if (xp < 900) return 2;
    if (xp < 2700) return 3;
    if (xp < 6500) return 4;
    if (xp < 14000) return 5;
    if (xp < 23000) return 6;
    if (xp < 34000) return 7;
    if (xp < 48000) return 8;
    if (xp < 64000) return 9;
    if (xp < 85000) return 10;
    if (xp < 100000) return 11;
    if (xp < 120000) return 12;
    if (xp < 140000) return 13;
    if (xp < 165000) return 14;
    if (xp < 195000) return 15;
    if (xp < 225000) return 16;
    if (xp < 265000) return 17;
    if (xp < 305000) return 18;
    if (xp < 355000) return 19;
    return 20; // Cap at 20
  };

  // Auto-level up effect
  useEffect(() => {
    const newLevel = calculateLevel(character.details.xp);
    if (newLevel !== character.level) {
      setCharacter(prev => ({ ...prev, level: newLevel }));
    }
  }, [character.details.xp]);

  if (!session) {
    return <Auth />;
  }

  // Render Selection Screen if no character selected
  if (!selectedCharacterId) {
    return (
      <CharacterSelection
        characters={charactersList}
        onCreateCharacter={handleCreateCharacter}
        onSelectCharacter={setSelectedCharacterId}
        onDeleteCharacter={handleDeleteCharacter}
        onSignOut={() => supabase.auth.signOut()}
      />
    );
  }

  if (loading) {
    return <div className="loading">Loading Character...</div>;
  }



  const proficiencyBonus = Math.ceil(character.level / 4) + 1;

  // Spell Stats Calculation
  const spellAbilityScore = character.abilities[character.spellcastingAbility];
  const spellModifier = Math.floor((spellAbilityScore - 10) / 2);
  const spellSaveDC = 8 + proficiencyBonus + spellModifier;
  const spellAttackBonus = proficiencyBonus + spellModifier;

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

  // Weapons Handlers
  const handleAddWeapon = (weapon: Omit<Weapon, 'id'>) => {
    const newWeapon: Weapon = {
      ...weapon,
      id: crypto.randomUUID()
    };
    setCharacter(prev => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon]
    }));
  };

  const handleRemoveWeapon = (id: string) => {
    setCharacter(prev => ({
      ...prev,
      weapons: prev.weapons.filter(w => w.id !== id)
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

  const handleSpellAbilityChange = (ability: keyof AbilityScores) => {
    setCharacter(prev => ({ ...prev, spellcastingAbility: ability }));
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
            <div className="header-actions">
              <button className="switch-char-btn" onClick={() => setSelectedCharacterId(null)}>
                Switch Character
              </button>
              <button className="sign-out-btn" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </button>
            </div>
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

            <section className="weapons-section">
              <Weapons
                weapons={character.weapons || []}
                onAddWeapon={handleAddWeapon}
                onRemoveWeapon={handleRemoveWeapon}
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
                spellcastingAbility={character.spellcastingAbility}
                onAbilityChange={handleSpellAbilityChange}
                saveDC={spellSaveDC}
                attackBonus={spellAttackBonus}
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
        .header-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        .sign-out-btn, .switch-char-btn {
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
        .switch-char-btn:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
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
