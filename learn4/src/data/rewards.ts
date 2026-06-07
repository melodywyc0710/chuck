export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'furniture' | 'pet' | 'decoration' | 'window';
  description: string;
  position: { x: number; y: number }; // percentage for room grid
  unlocked?: boolean;
  placed?: boolean;
}

export const ROOM_ITEMS: RoomItem[] = [
  // Starter items (free)
  { id: 'bed', name: 'Cosy Bed', emoji: '🛏️', cost: 0, category: 'furniture', description: 'A comfy place to sleep', position: { x: 10, y: 50 } },
  { id: 'rug', name: 'Fluffy Rug', emoji: '🟫', cost: 0, category: 'decoration', description: 'Warm and soft underfoot', position: { x: 40, y: 70 } },
  // Furniture
  { id: 'desk', name: 'Study Desk', emoji: '🪑', cost: 3, category: 'furniture', description: 'Perfect for homework!', position: { x: 70, y: 30 } },
  { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', cost: 4, category: 'furniture', description: 'Fill it with stories', position: { x: 85, y: 20 } },
  { id: 'lamp', name: 'Reading Lamp', emoji: '🪔', cost: 2, category: 'decoration', description: 'Glow up your room', position: { x: 75, y: 40 } },
  { id: 'beanbag', name: 'Bean Bag', emoji: '🪑', cost: 5, category: 'furniture', description: 'Ultra comfy reading spot', position: { x: 25, y: 60 } },
  { id: 'wardrobe', name: 'Wardrobe', emoji: '🗄️', cost: 6, category: 'furniture', description: 'Maybe Narnia is in there?', position: { x: 90, y: 45 } },
  { id: 'telescope', name: 'Telescope', emoji: '🔭', cost: 8, category: 'decoration', description: 'Explore the night sky', position: { x: 60, y: 20 } },
  // Pets
  { id: 'cat', name: 'Tabby Cat', emoji: '🐱', cost: 6, category: 'pet', description: 'Purrs while you study', position: { x: 30, y: 55 } },
  { id: 'dog', name: 'Puppy', emoji: '🐶', cost: 6, category: 'pet', description: 'Always happy to see you', position: { x: 50, y: 65 } },
  { id: 'bunny', name: 'Bunny', emoji: '🐰', cost: 5, category: 'pet', description: 'Hops around your room', position: { x: 20, y: 70 } },
  { id: 'fish', name: 'Fish Tank', emoji: '🐠', cost: 7, category: 'pet', description: 'Calming to watch', position: { x: 80, y: 30 } },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', cost: 10, category: 'pet', description: 'Repeats your vocabulary words!', position: { x: 65, y: 25 } },
  { id: 'dragon', name: 'Mini Dragon', emoji: '🐲', cost: 15, category: 'pet', description: 'Rare! Only for top students', position: { x: 55, y: 45 } },
  // Windows / views
  { id: 'window-beach', name: 'Beach View', emoji: '🏖️', cost: 5, category: 'window', description: 'Waves outside your window', position: { x: 45, y: 10 } },
  { id: 'window-forest', name: 'Forest View', emoji: '🌲', cost: 5, category: 'window', description: 'Trees and birdsong', position: { x: 45, y: 10 } },
  { id: 'window-space', name: 'Space View', emoji: '🌌', cost: 8, category: 'window', description: 'Stars and galaxies!', position: { x: 45, y: 10 } },
  // Decorations
  { id: 'trophy', name: 'Trophy Cabinet', emoji: '🏆', cost: 4, category: 'decoration', description: 'Show off your achievements', position: { x: 15, y: 25 } },
  { id: 'globe', name: 'Globe', emoji: '🌍', cost: 3, category: 'decoration', description: 'Explore the world', position: { x: 35, y: 30 } },
  { id: 'piano', name: 'Mini Piano', emoji: '🎹', cost: 10, category: 'furniture', description: 'Make some music', position: { x: 10, y: 35 } },
  { id: 'plant', name: 'Potted Plant', emoji: '🌿', cost: 2, category: 'decoration', description: 'Brings life to the room', position: { x: 78, y: 55 } },
  { id: 'posters', name: 'Cool Posters', emoji: '🖼️', cost: 3, category: 'decoration', description: 'Your favourite things', position: { x: 50, y: 15 } },
  { id: 'treehouse-upgrade', name: '🌳 Treehouse Upgrade!', emoji: '🌳', cost: 20, category: 'decoration', description: 'Transform your bedroom into a treehouse', position: { x: 50, y: 5 } },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', cost: 8, category: 'pet', description: 'Earns 2 stars per hour on the farm', unlocked: false, placed: false, position: { x: 20, y: 60 } },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', cost: 20, category: 'pet', description: 'Earns 5 stars per hour on the farm', unlocked: false, placed: false, position: { x: 40, y: 60 } },
  { id: 'cow', name: 'Cow', emoji: '🐄', cost: 45, category: 'pet', description: 'Earns 10 stars per hour on the farm', unlocked: false, placed: false, position: { x: 60, y: 60 } },
  { id: 'horse', name: 'Horse', emoji: '🐴', cost: 80, category: 'pet', description: 'Earns 20 stars per hour on the farm', unlocked: false, placed: false, position: { x: 80, y: 60 } },
];
