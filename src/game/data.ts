export type Item = {
  id: string;
  kind: 'key' | 'note' | 'prop' | 'exit' | 'power';
  label: string;
  x: number;
  z: number;
  description: string;
  hint?: string;
};

// All coordinates are invented for the dream-house game, not taken from any real home.
export const ITEMS: Item[] = [
  { id: 'key1', kind: 'key', label: 'Amber Key', x: -8.7, z: 2.8, description: 'A key warm as an autumn afternoon.', hint: 'A quiet corner where paper dreams are written.' },
  { id: 'key2', kind: 'key', label: 'Ivory Key', x: -8.3, z: -5.1, description: 'The library shelves hum as you take it.', hint: 'Some stories keep more than their endings.' },
  { id: 'key3', kind: 'key', label: 'Azure Key', x: -0.5, z: -5.5, description: 'The clock stops. For one second, so does the house.', hint: 'Time is hiding what it cannot remember.' },
  { id: 'key4', kind: 'key', label: 'Violet Key', x: 6.8, z: -4.1, description: 'Its reflection is older than the house.', hint: 'Beside the lamp that glows with no electricity.' },
  { id: 'key5', kind: 'key', label: 'Moss Key', x: 8.1, z: 4.2, description: 'You hear distant rain falling upward.', hint: 'Under glass, a forgotten garden grows.' },
  { id: 'key6', kind: 'key', label: 'Silver Key', x: -0.8, z: 4.7, description: 'The final key sings in a voice you almost recognize.', hint: 'Where everyone gathers, but nobody stays.' },
  { id: 'note1', kind: 'note', label: 'Crumpled Letter', x: -6.4, z: 6.5, description: '“The house changes when the last light goes out. Remember who you are.”' },
  { id: 'note2', kind: 'note', label: 'A Page from a Diary', x: 2.2, z: 4.3, description: '“The Keeper is bound to the clock. Every rewind makes its shadow longer.”' },
  { id: 'note3', kind: 'note', label: 'A Drawing', x: 4.7, z: -5.8, description: 'Three doors, six keys, and a person standing in the sunlight.' },
  { id: 'clock', kind: 'prop', label: 'Grandfather Clock', x: 0.5, z: -7.1, description: 'The hands refuse to move past midnight.' },
  { id: 'radio', kind: 'prop', label: 'Old Radio', x: 0.8, z: 4.7, description: 'The radio crackles. Somewhere, someone is humming.' },
  { id: 'phone', kind: 'power', label: 'Charging Desk', x: -8.0, z: 5.2, description: 'Your phone battery is replenished.' },
  { id: 'exit_hall', kind: 'exit', label: 'Moonlit Hall', x: 0, z: -8.0, description: 'You push through the moonlit door and wake into a new morning.' },
  { id: 'exit_mirror', kind: 'exit', label: 'Memory Mirror', x: -10.8, z: -6.9, description: 'Isaiah steps through his reflection and finds the courage to speak.' },
  { id: 'exit_garden', kind: 'exit', label: 'Glass Garden', x: 10.8, z: 5.6, description: 'Beyond the glass is sunrise and a world that finally feels open.' }
];

export const START = { x: -6.2, z: 7.3 };
export const LIMITS = { x: 11.2, z: 8.2 };
export const KEY_COUNT = ITEMS.filter(i => i.kind === 'key').length;
export type Phase = 'menu' | 'playing' | 'caught' | 'won' | 'loop';
export type StoryChoice = 0 | 1 | 2;
export const STORY_CHOICES = ['Ask what this place is', 'Promise to solve the mystery', 'Stay quiet and watch the clock'] as const;
