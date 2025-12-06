export interface AbilityScores {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface Skill {
    name: string;
    ability: keyof AbilityScores;
    proficient: boolean;
}

export interface Weapon {
    id: string;
    name: string;
    atkBonus: string;
    damage: string;
    type: string;
}

export interface Character {
    name: string;
    race: string;
    class: string;
    level: number;
    abilities: AbilityScores;
    hp: {
        current: number;
        max: number;
        temp: number;
    };
    ac: number;
    speed: number;
    initiative: number;
    skills: Skill[];
    savingThrows: Skill[];
    inventory: InventoryItem[];
    weapons: Weapon[];
    features: Feature[];
    spellcastingAbility: keyof AbilityScores;
    spells: {
        slots: { [level: number]: { total: number; used: number } };
        list: { name: string; level: number; prepared: boolean; description: string }[];
    };
    details: {
        background: string;
        alignment: string;
        xp: number;
        traits: string;
        ideals: string;
        bonds: string;
        flaws: string;
    };
    notes: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    weight: number;
    description: string;
}

export interface Feature {
    id: string;
    name: string;
    source: string;
    description: string;
}
