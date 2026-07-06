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
  weekUnlock?: number;    // 0 or undefined = always available; 1+ = unlocks after that many weeks
  levelRequired?: number; // player level required to purchase; undefined = level 1
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
  { id: 'mini-dragon', name: 'Mini Dragon', emoji: '🐲', cost: 15, category: 'pet', description: 'Rare! Only for top students', position: { x: 55, y: 45 } },
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
  // ── FARM ANIMALS (earn stars while you study) ─────────────────────────────
  { id: 'chicken',  name: 'Chicken',  emoji: '🐔', cost: 8,    category: 'pet', description: '1 ⭐/hr · 12% baby chance',  unlocked: false, placed: false, position: { x: 20, y: 60 } },
  { id: 'sheep',    name: 'Sheep',    emoji: '🐑', cost: 20,   category: 'pet', description: '2 ⭐/hr · 10% baby chance',  unlocked: false, placed: false, position: { x: 40, y: 60 } },
  { id: 'cow',      name: 'Cow',      emoji: '🐄', cost: 45,   category: 'pet', description: '4 ⭐/hr · 8% baby chance',   unlocked: false, placed: false, position: { x: 60, y: 60 } },
  { id: 'horse',    name: 'Horse',    emoji: '🐴', cost: 80,   category: 'pet', description: '6 ⭐/hr · 6% baby chance',   unlocked: false, placed: false, position: { x: 80, y: 60 } },
  { id: 'peacock',  name: 'Peacock',  emoji: '🦚', cost: 150,  category: 'pet', description: '8 ⭐/hr · 5% baby chance',   unlocked: false, placed: false, position: { x: 20, y: 60 }, levelRequired: 3 },
  { id: 'llama',    name: 'Llama',    emoji: '🦙', cost: 300,  category: 'pet', description: '12 ⭐/hr · 4% baby chance',  unlocked: false, placed: false, position: { x: 40, y: 60 }, levelRequired: 5 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', cost: 600,  category: 'pet', description: '18 ⭐/hr · 3% baby chance',  unlocked: false, placed: false, position: { x: 60, y: 60 }, levelRequired: 7 },
  { id: 'tiger',    name: 'Tiger',    emoji: '🐯', cost: 1200, category: 'pet', description: '25 ⭐/hr · 2% baby chance',  unlocked: false, placed: false, position: { x: 80, y: 60 }, levelRequired: 10 },
  { id: 'dragon',   name: 'Dragon',   emoji: '🐉', cost: 2500, category: 'pet', description: '35 ⭐/hr · 1.5% baby chance', unlocked: false, placed: false, position: { x: 30, y: 60 }, levelRequired: 15 },
  { id: 'unicorn',  name: 'Unicorn',  emoji: '🦄', cost: 5000, category: 'pet', description: '50 ⭐/hr · 1% baby chance',  unlocked: false, placed: false, position: { x: 70, y: 60 }, levelRequired: 20 },

  // ── WEEK 1 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'gaming-chair', name: 'Gaming Chair', emoji: '🎮', cost: 12, category: 'furniture', description: 'The ultimate study setup!', position: { x: 70, y: 45 }, weekUnlock: 1 },
  { id: 'moon-lamp', name: 'Moon Lamp', emoji: '🌙', cost: 7, category: 'decoration', description: 'A glowing moon on your shelf', position: { x: 82, y: 35 }, weekUnlock: 1 },
  { id: 'gecko', name: 'Gecko', emoji: '🦎', cost: 8, category: 'pet', description: 'Tiny and very cool!', position: { x: 30, y: 50 }, weekUnlock: 1 },
  { id: 'cherry-blossom', name: 'Cherry Blossom View', emoji: '🌸', cost: 9, category: 'window', description: 'Petals drift past your window', position: { x: 45, y: 10 }, weekUnlock: 1 },
  { id: 'cactus', name: 'Cactus Collection', emoji: '🌵', cost: 4, category: 'decoration', description: 'Low-maintenance and stylish', position: { x: 75, y: 60 }, weekUnlock: 1 },

  // ── WEEK 2 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'velvet-sofa', name: 'Velvet Sofa', emoji: '🛋️', cost: 15, category: 'furniture', description: 'Incredibly comfy reading couch', position: { x: 25, y: 55 }, weekUnlock: 2 },
  { id: 'ocean-poster', name: 'Ocean Poster', emoji: '🌊', cost: 5, category: 'decoration', description: 'Feel the waves on your wall', position: { x: 50, y: 15 }, weekUnlock: 2 },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', cost: 10, category: 'pet', description: 'Stands on one leg in the corner', position: { x: 60, y: 65 }, weekUnlock: 2 },
  { id: 'mountain-view', name: 'Mountain View', emoji: '🏔️', cost: 10, category: 'window', description: 'Snowy peaks outside your window', position: { x: 45, y: 10 }, weekUnlock: 2 },
  { id: 'lava-lamp', name: 'Lava Lamp', emoji: '💡', cost: 6, category: 'decoration', description: 'Groovy blobs of colour', position: { x: 20, y: 30 }, weekUnlock: 2 },

  // ── WEEK 3 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'hammock', name: 'Hammock', emoji: '🪢', cost: 14, category: 'furniture', description: 'Swing while you read!', position: { x: 40, y: 50 }, weekUnlock: 3 },
  { id: 'crystal-ball', name: 'Crystal Ball', emoji: '🔮', cost: 9, category: 'decoration', description: 'See the future of your grades!', position: { x: 65, y: 35 }, weekUnlock: 3 },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', cost: 9, category: 'pet', description: 'Snuffles around your room', position: { x: 35, y: 65 }, weekUnlock: 3 },
  { id: 'city-view', name: 'City Lights View', emoji: '🌃', cost: 11, category: 'window', description: 'Twinkling city at night', position: { x: 45, y: 10 }, weekUnlock: 3 },
  { id: 'magic-carpet', name: 'Magic Carpet', emoji: '🪄', cost: 7, category: 'decoration', description: 'Ready to fly you anywhere', position: { x: 45, y: 72 }, weekUnlock: 3 },

  // ── WEEK 4 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'bunk-bed', name: 'Bunk Bed', emoji: '🛏️', cost: 18, category: 'furniture', description: 'Top bunk for the ultimate view', position: { x: 12, y: 42 }, weekUnlock: 4 },
  { id: 'star-map', name: 'Star Map', emoji: '🗺️', cost: 8, category: 'decoration', description: 'Map of the night sky', position: { x: 55, y: 18 }, weekUnlock: 4 },
  { id: 'sloth', name: 'Sloth', emoji: '🦥', cost: 12, category: 'pet', description: 'Hangs around doing almost nothing', position: { x: 70, y: 55 }, weekUnlock: 4 },
  { id: 'jungle-view', name: 'Jungle View', emoji: '🌴', cost: 10, category: 'window', description: 'Exotic jungle just outside', position: { x: 45, y: 10 }, weekUnlock: 4 },
  { id: 'lego-set', name: 'LEGO Set', emoji: '🧱', cost: 11, category: 'decoration', description: 'Build something amazing!', position: { x: 30, y: 22 }, weekUnlock: 4 },

  // ── WEEK 5 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'cloud-bed', name: 'Cloud Bed', emoji: '☁️', cost: 25, category: 'furniture', description: 'Sleep on actual clouds!', position: { x: 10, y: 48 }, weekUnlock: 5 },
  { id: 'neon-sign', name: 'Neon Sign', emoji: '✨', cost: 13, category: 'decoration', description: 'Your name in glowing neon', position: { x: 50, y: 12 }, weekUnlock: 5 },
  { id: 'capybara', name: 'Capybara', emoji: '🦫', cost: 14, category: 'pet', description: 'The chillest animal in the room', position: { x: 40, y: 62 }, weekUnlock: 5 },
  { id: 'aurora-view', name: 'Aurora Borealis', emoji: '🌌', cost: 15, category: 'window', description: 'Northern lights dance outside', position: { x: 45, y: 10 }, weekUnlock: 5 },
  { id: 'drum-kit', name: 'Drum Kit', emoji: '🥁', cost: 16, category: 'furniture', description: 'Rock out after study time', position: { x: 18, y: 38 }, weekUnlock: 5 },

  // ── WEEK 6 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'robot-friend', name: 'Robot Friend', emoji: '🤖', cost: 20, category: 'decoration', description: 'Your AI study companion', position: { x: 62, y: 52 }, weekUnlock: 6 },
  { id: 'vintage-clock', name: 'Grandfather Clock', emoji: '🕰️', cost: 12, category: 'furniture', description: 'Tick tock, time to study!', position: { x: 88, y: 38 }, weekUnlock: 6 },
  { id: 'axolotl', name: 'Axolotl Tank', emoji: '🦎', cost: 16, category: 'pet', description: 'The rarest tank in school!', position: { x: 78, y: 32 }, weekUnlock: 6 },
  { id: 'volcano-view', name: 'Volcano View', emoji: '🌋', cost: 13, category: 'window', description: 'Dramatic lava outside your window', position: { x: 45, y: 10 }, weekUnlock: 6 },
  { id: 'zen-garden', name: 'Zen Garden', emoji: '🪨', cost: 10, category: 'decoration', description: 'Rake sand patterns when stressed', position: { x: 35, y: 68 }, weekUnlock: 6 },

  // ── WEEK 7 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'race-car-bed', name: 'Race Car Bed', emoji: '🏎️', cost: 30, category: 'furniture', description: 'Vroom vroom to dreamland', position: { x: 12, y: 52 }, weekUnlock: 7 },
  { id: 'potion-shelf', name: 'Potion Shelf', emoji: '⚗️', cost: 14, category: 'decoration', description: 'Mysterious glowing potions', position: { x: 86, y: 22 }, weekUnlock: 7 },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', cost: 15, category: 'pet', description: 'Waddles around looking formal', position: { x: 50, y: 60 }, weekUnlock: 7 },
  { id: 'underwater-view', name: 'Underwater View', emoji: '🐠', cost: 18, category: 'window', description: 'Fish swim past your window!', position: { x: 45, y: 10 }, weekUnlock: 7 },
  { id: 'skateboard-ramp', name: 'Skateboard Ramp', emoji: '🛹', cost: 17, category: 'decoration', description: 'Mini ramp in the corner', position: { x: 22, y: 62 }, weekUnlock: 7 },

  // ── WEEK 8 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'trampoline', name: 'Trampoline', emoji: '🤸', cost: 22, category: 'furniture', description: 'Bounce your energy out!', position: { x: 55, y: 65 }, weekUnlock: 8 },
  { id: 'art-easel', name: 'Art Easel', emoji: '🎨', cost: 11, category: 'decoration', description: 'Paint masterpieces after school', position: { x: 72, y: 40 }, weekUnlock: 8 },
  { id: 'red-panda', name: 'Red Panda', emoji: '🐾', cost: 18, category: 'pet', description: 'Absolutely adorable fluffball', position: { x: 28, y: 55 }, weekUnlock: 8 },
  { id: 'snow-globe-view', name: 'Snowy Village View', emoji: '❄️', cost: 16, category: 'window', description: 'A cosy snowy village outside', position: { x: 45, y: 10 }, weekUnlock: 8 },
  { id: 'science-lab', name: 'Science Lab Corner', emoji: '🧪', cost: 19, category: 'decoration', description: 'Beakers, flasks and experiments!', position: { x: 85, y: 55 }, weekUnlock: 8 },

  // ── WEEK 9 UNLOCK ──────────────────────────────────────────────────────────
  { id: 'royal-throne', name: 'Royal Throne', emoji: '👑', cost: 35, category: 'furniture', description: 'Study like royalty!', position: { x: 40, y: 40 }, weekUnlock: 9, levelRequired: 8 },
  { id: 'hologram-table', name: 'Hologram Table', emoji: '🌐', cost: 25, category: 'decoration', description: 'Futuristic hologram displays', position: { x: 58, y: 38 }, weekUnlock: 9, levelRequired: 8 },
  { id: 'baby-elephant', name: 'Baby Elephant', emoji: '🐘', cost: 22, category: 'pet', description: 'A gentle giant in your room', position: { x: 42, y: 65 }, weekUnlock: 9 },
  { id: 'rainbow-view', name: 'Rainbow Valley View', emoji: '🌈', cost: 20, category: 'window', description: 'A permanent rainbow outside!', position: { x: 45, y: 10 }, weekUnlock: 9 },
  { id: 'aquarium-wall', name: 'Aquarium Wall', emoji: '🪸', cost: 28, category: 'decoration', description: 'Entire wall is a fish tank!', position: { x: 48, y: 30 }, weekUnlock: 9 },

  // ── WEEK 10 UNLOCK ─────────────────────────────────────────────────────────
  { id: 'space-capsule', name: 'Space Capsule Bed', emoji: '🚀', cost: 50, category: 'furniture', description: 'Sleep like an astronaut!', position: { x: 15, y: 45 }, weekUnlock: 10, levelRequired: 10 },
  { id: 'time-machine', name: 'Time Machine', emoji: '⏰', cost: 40, category: 'decoration', description: 'Travel through history!', position: { x: 68, y: 50 }, weekUnlock: 10, levelRequired: 10 },
  { id: 'galaxy-view', name: 'Galaxy Portal View', emoji: '🌌', cost: 30, category: 'window', description: 'A swirling galaxy right outside!', position: { x: 45, y: 10 }, weekUnlock: 10, levelRequired: 10 },
  { id: 'gold-trophy-wall', name: 'Gold Trophy Wall', emoji: '🥇', cost: 45, category: 'decoration', description: 'Wall of legendary achievements', position: { x: 50, y: 20 }, weekUnlock: 10, levelRequired: 10 },

  // ── ALWAYS AVAILABLE ───────────────────────────────────────────────────────
  { id: 'mug', name: 'Hot Cocoa Mug', emoji: '☕', cost: 2, category: 'decoration', description: 'Perfect study fuel', position: { x: 68, y: 28 } },
  { id: 'pillow', name: 'Throw Pillow', emoji: '🛋️', cost: 2, category: 'decoration', description: 'Extra cosy for reading', position: { x: 22, y: 65 } },
  { id: 'candle', name: 'Scented Candle', emoji: '🕯️', cost: 3, category: 'decoration', description: 'Calming lavender scent', position: { x: 76, y: 42 } },
  { id: 'sunflower', name: 'Sunflower Pot', emoji: '🌻', cost: 3, category: 'decoration', description: 'Bright and cheerful', position: { x: 84, y: 58 } },
  { id: 'alarm-clock', name: 'Alarm Clock', emoji: '⏰', cost: 3, category: 'decoration', description: 'Never miss study time!', position: { x: 72, y: 25 } },
  { id: 'notebook', name: 'Notebook Stack', emoji: '📓', cost: 4, category: 'decoration', description: 'Filled with great ideas', position: { x: 62, y: 30 } },
  { id: 'headphones', name: 'Headphones', emoji: '🎧', cost: 5, category: 'decoration', description: 'Focus mode activated', position: { x: 55, y: 25 } },
  { id: 'hamster', name: 'Hamster Wheel', emoji: '🐹', cost: 5, category: 'pet', description: 'Runs all night on the wheel', position: { x: 18, y: 58 } },
  { id: 'snail', name: 'Garden Snail', emoji: '🐌', cost: 4, category: 'pet', description: 'Slow and steady wins the race', position: { x: 38, y: 72 } },
  { id: 'frog', name: 'Frog in a Jar', emoji: '🐸', cost: 5, category: 'pet', description: 'Ribbit ribbit all day long', position: { x: 25, y: 45 } },

  // ── WEEK 1 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'pinboard', name: 'Pin Board', emoji: '📌', cost: 4, category: 'decoration', description: 'Pin your best work up!', position: { x: 48, y: 18 }, weekUnlock: 1 },
  { id: 'fairy-lights', name: 'Fairy Lights', emoji: '🌟', cost: 6, category: 'decoration', description: 'Twinkly lights everywhere', position: { x: 50, y: 8 }, weekUnlock: 1 },
  { id: 'turtle', name: 'Sea Turtle', emoji: '🐢', cost: 7, category: 'pet', description: 'Ancient and wise', position: { x: 42, y: 68 }, weekUnlock: 1 },
  { id: 'sunrise-view', name: 'Sunrise View', emoji: '🌅', cost: 7, category: 'window', description: 'Golden sunrise every morning', position: { x: 45, y: 10 }, weekUnlock: 1 },

  // ── WEEK 2 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'basketball-hoop', name: 'Basketball Hoop', emoji: '🏀', cost: 9, category: 'decoration', description: 'Shoot hoops during breaks', position: { x: 88, y: 32 }, weekUnlock: 2 },
  { id: 'dartboard', name: 'Dart Board', emoji: '🎯', cost: 7, category: 'decoration', description: 'Focus target practice!', position: { x: 15, y: 20 }, weekUnlock: 2 },
  { id: 'butterfly', name: 'Butterfly Garden', emoji: '🦋', cost: 8, category: 'pet', description: 'Colourful butterflies flutter past', position: { x: 55, y: 55 }, weekUnlock: 2 },
  { id: 'waterfall-view', name: 'Waterfall View', emoji: '💧', cost: 9, category: 'window', description: 'Peaceful waterfall sounds', position: { x: 45, y: 10 }, weekUnlock: 2 },

  // ── WEEK 3 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'chessboard', name: 'Chess Set', emoji: '♟️', cost: 9, category: 'decoration', description: 'Train your strategic mind', position: { x: 62, y: 42 }, weekUnlock: 3 },
  { id: 'terrarium', name: 'Terrarium', emoji: '🌿', cost: 10, category: 'decoration', description: 'Tiny ecosystem on your desk', position: { x: 72, y: 32 }, weekUnlock: 3 },
  { id: 'fox-kit', name: 'Fox Kit', emoji: '🦊', cost: 11, category: 'pet', description: 'Curious and playful', position: { x: 32, y: 60 }, weekUnlock: 3 },
  { id: 'desert-view', name: 'Desert Dunes View', emoji: '🏜️', cost: 10, category: 'window', description: 'Sandy dunes stretch to the horizon', position: { x: 45, y: 10 }, weekUnlock: 3 },

  // ── WEEK 4 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'telescope-2', name: 'Giant Telescope', emoji: '🔭', cost: 13, category: 'decoration', description: 'See galaxies from your room', position: { x: 78, y: 22 }, weekUnlock: 4 },
  { id: 'record-player', name: 'Record Player', emoji: '🎵', cost: 12, category: 'furniture', description: 'Study to vinyl beats', position: { x: 22, y: 35 }, weekUnlock: 4 },
  { id: 'owl-pet', name: 'Wise Owl', emoji: '🦉', cost: 13, category: 'pet', description: 'Hoo hoo from the bookshelf', position: { x: 85, y: 28 }, weekUnlock: 4 },
  { id: 'tundra-view', name: 'Arctic Tundra View', emoji: '🌨️', cost: 12, category: 'window', description: 'Polar bears wander outside', position: { x: 45, y: 10 }, weekUnlock: 4 },

  // ── WEEK 5 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'foosball', name: 'Foosball Table', emoji: '⚽', cost: 18, category: 'furniture', description: 'Quick game after homework!', position: { x: 35, y: 55 }, weekUnlock: 5 },
  { id: 'map-wall', name: 'World Map Wall', emoji: '🗺️', cost: 14, category: 'decoration', description: 'Pin all the places you\'ll go', position: { x: 50, y: 12 }, weekUnlock: 5 },
  { id: 'koala', name: 'Koala', emoji: '🐨', cost: 15, category: 'pet', description: 'Sleeping on your eucalyptus branch', position: { x: 62, y: 58 }, weekUnlock: 5 },
  { id: 'storm-view', name: 'Lightning Storm View', emoji: '⛈️', cost: 14, category: 'window', description: 'Dramatic storm rolls in outside', position: { x: 45, y: 10 }, weekUnlock: 5 },

  // ── WEEK 6 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'projector', name: 'Movie Projector', emoji: '📽️', cost: 20, category: 'decoration', description: 'Movie nights in your room!', position: { x: 68, y: 45 }, weekUnlock: 6 },
  { id: 'bookcase-big', name: 'Giant Library Wall', emoji: '📖', cost: 18, category: 'furniture', description: 'Hundreds of books floor-to-ceiling', position: { x: 88, y: 25 }, weekUnlock: 6 },
  { id: 'lynx', name: 'Snow Leopard', emoji: '🐆', cost: 20, category: 'pet', description: 'Majestic and mysterious', position: { x: 48, y: 62 }, weekUnlock: 6 },
  { id: 'sakura-view', name: 'Sakura Garden View', emoji: '🌸', cost: 16, category: 'window', description: 'Japanese cherry blossom garden', position: { x: 45, y: 10 }, weekUnlock: 6 },

  // ── WEEK 7 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'climbing-wall', name: 'Climbing Wall', emoji: '🧗', cost: 22, category: 'decoration', description: 'Indoor bouldering corner!', position: { x: 5, y: 40 }, weekUnlock: 7 },
  { id: 'vintage-globe', name: 'Antique Globe Bar', emoji: '🌍', cost: 16, category: 'furniture', description: 'Spin the world on your desk', position: { x: 38, y: 30 }, weekUnlock: 7 },
  { id: 'narwhal', name: 'Narwhal Tank', emoji: '🦭', cost: 22, category: 'pet', description: 'The unicorn of the sea', position: { x: 72, y: 65 }, weekUnlock: 7 },
  { id: 'savannah-view', name: 'African Savannah View', emoji: '🦁', cost: 19, category: 'window', description: 'Lions roam outside your window', position: { x: 45, y: 10 }, weekUnlock: 7 },

  // ── WEEK 8 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'indoor-pool', name: 'Mini Indoor Pool', emoji: '🏊', cost: 28, category: 'furniture', description: 'Swim laps between lessons', position: { x: 45, y: 70 }, weekUnlock: 8 },
  { id: 'arcade-machine', name: 'Arcade Machine', emoji: '🕹️', cost: 24, category: 'decoration', description: '80s arcade cabinet in the corner', position: { x: 15, y: 42 }, weekUnlock: 8 },
  { id: 'panda-cub', name: 'Panda Cub', emoji: '🐼', cost: 24, category: 'pet', description: 'Munches bamboo on your rug', position: { x: 35, y: 62 }, weekUnlock: 8 },
  { id: 'cosmos-view', name: 'Deep Space View', emoji: '🚀', cost: 22, category: 'window', description: 'Asteroids float past your window', position: { x: 45, y: 10 }, weekUnlock: 8 },

  // ── WEEK 9 ADDITIONS ──────────────────────────────────────────────────────
  { id: 'grand-piano', name: 'Grand Piano', emoji: '🎹', cost: 35, category: 'furniture', description: 'A full concert grand piano!', position: { x: 18, y: 48 }, weekUnlock: 9 },
  { id: 'knight-armour', name: 'Knight\'s Armour', emoji: '⚔️', cost: 28, category: 'decoration', description: 'Full suit of armour stands guard', position: { x: 8, y: 28 }, weekUnlock: 9 },
  { id: 'tiger-cub', name: 'Tiger Cub', emoji: '🐯', cost: 28, category: 'pet', description: 'Playful and fierce', position: { x: 58, y: 65 }, weekUnlock: 9 },
  { id: 'northern-lights', name: 'Northern Lights Live', emoji: '🌠', cost: 26, category: 'window', description: 'Real-time aurora borealis outside', position: { x: 45, y: 10 }, weekUnlock: 9 },

  // ── WEEK 10 ADDITIONS ─────────────────────────────────────────────────────
  { id: 'dragon-egg', name: 'Dragon Egg', emoji: '🥚', cost: 40, category: 'decoration', description: 'What\'s hatching inside?!', position: { x: 65, y: 55 }, weekUnlock: 10 },
  { id: 'portal-door', name: 'Portal Door', emoji: '🚪', cost: 45, category: 'decoration', description: 'Opens to another dimension', position: { x: 90, y: 50 }, weekUnlock: 10 },
  { id: 'phoenix', name: 'Phoenix', emoji: '🔥', cost: 50, category: 'pet', description: 'The legendary fire bird! Rarest of all', position: { x: 52, y: 52 }, weekUnlock: 10 },
  { id: 'floating-island', name: 'Floating Island View', emoji: '🏝️', cost: 38, category: 'window', description: 'Sky islands float past your window', position: { x: 45, y: 10 }, weekUnlock: 10 },
  { id: 'diamond-chandelier', name: 'Diamond Chandelier', emoji: '💎', cost: 55, category: 'decoration', description: 'Legendary sparkle overhead', position: { x: 50, y: 5 }, weekUnlock: 10 },
];
