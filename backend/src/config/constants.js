// ─────────────────────────────────────────────────────────────────────────────
// ArenaX Constants — India's Gaming Ecosystem Database Enums
// ─────────────────────────────────────────────────────────────────────────────

// ── Supported Devices ────────────────────────────────────────────────────────
const DEVICES = [
  'Mobile (Android)',
  'Mobile (iOS)',
  'PC (Windows)',
  'PC (Mac)',
  'Console (PlayStation)',
  'Console (Xbox)',
  'Console (Nintendo Switch)',
  'Emulator (BlueStacks)',
  'Emulator (LDPlayer)',
  'Emulator (MuMu)',
  'Emulator (GameLoop)',
  'Cloud Gaming (GeForce NOW)',
  'Cloud Gaming (Xbox Cloud)',
];

// ── Games with their platforms and rank tiers ─────────────────────────────────
const GAMES = [
  {
    id: 'bgmi',
    name: 'Battlegrounds Mobile India (BGMI)',
    shortName: 'BGMI',
    developer: 'Krafton',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'Emulator (BlueStacks)', 'Emulator (GameLoop)'],
    genre: 'Battle Royale',
    tiers: [
      'Bronze I', 'Bronze II', 'Bronze III', 'Bronze IV', 'Bronze V',
      'Silver I', 'Silver II', 'Silver III', 'Silver IV', 'Silver V',
      'Gold I', 'Gold II', 'Gold III', 'Gold IV', 'Gold V',
      'Platinum I', 'Platinum II', 'Platinum III', 'Platinum IV', 'Platinum V',
      'Diamond I', 'Diamond II', 'Diamond III', 'Diamond IV', 'Diamond V',
      'Crown I', 'Crown II', 'Crown III', 'Crown IV', 'Crown V',
      'Ace', 'Ace Master', 'Ace Dominator', 'Conqueror',
    ],
    roles: ['IGL', 'Assaulter', 'Rusher', 'Sniper', 'Support', 'Fragger', 'Entry Fragger', 'Lurker'],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'VAL',
    developer: 'Riot Games',
    devices: ['PC (Windows)'],
    genre: 'Tactical Shooter',
    tiers: [
      'Iron 1', 'Iron 2', 'Iron 3',
      'Bronze 1', 'Bronze 2', 'Bronze 3',
      'Silver 1', 'Silver 2', 'Silver 3',
      'Gold 1', 'Gold 2', 'Gold 3',
      'Platinum 1', 'Platinum 2', 'Platinum 3',
      'Diamond 1', 'Diamond 2', 'Diamond 3',
      'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
      'Immortal 1', 'Immortal 2', 'Immortal 3',
      'Radiant',
    ],
    roles: ['IGL', 'Duelist', 'Controller', 'Initiator', 'Sentinel', 'Entry Fragger', 'Support', 'Lurker', 'Flex'],
  },
  {
    id: 'freefire',
    name: 'Free Fire MAX',
    shortName: 'FF',
    developer: 'Garena',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'Emulator (BlueStacks)', 'Emulator (LDPlayer)'],
    genre: 'Battle Royale',
    tiers: [
      'Bronze', 'Silver', 'Gold I', 'Gold II', 'Gold III',
      'Platinum I', 'Platinum II', 'Platinum III',
      'Diamond I', 'Diamond II', 'Diamond III',
      'Heroic', 'Grandmaster',
    ],
    roles: ['IGL', 'Rusher', 'Sniper', 'Support', 'Fragger'],
  },
  {
    id: 'codm',
    name: 'Call of Duty Mobile',
    shortName: 'CODM',
    developer: 'Activision / TiMi Studio',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'Emulator (GameLoop)'],
    genre: 'FPS / Battle Royale',
    tiers: [
      'Rookie I', 'Rookie II', 'Rookie III',
      'Veteran I', 'Veteran II', 'Veteran III',
      'Elite I', 'Elite II', 'Elite III',
      'Pro I', 'Pro II', 'Pro III',
      'Master I', 'Master II', 'Master III',
      'Grandmaster I', 'Grandmaster II', 'Grandmaster III',
      'Legendary',
    ],
    roles: ['IGL', 'Assaulter', 'Sniper', 'Support', 'Scout', 'Fragger', 'SMG Rusher'],
  },
  {
    id: 'pokemon_unite',
    name: 'Pokémon UNITE',
    shortName: 'PKMN',
    developer: 'TiMi Studio / Nintendo',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'Console (Nintendo Switch)'],
    genre: 'MOBA',
    tiers: [
      'Beginner 1-10',
      'Great 1-5', 'Expert 1-5', 'Veteran 1-5',
      'Ultra 1-5', 'Master',
    ],
    roles: ['Attacker', 'Defender', 'Supporter', 'Speedster', 'All-Rounder', 'Jungler', 'Lane (Top)', 'Lane (Bottom)'],
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    shortName: 'MC',
    developer: 'Mojang / Microsoft',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'PC (Windows)', 'PC (Mac)', 'Console (PlayStation)', 'Console (Xbox)', 'Console (Nintendo Switch)'],
    genre: 'Sandbox / Survival',
    tiers: ['Casual', 'Builder', 'Redstone Engineer', 'PvP Ranked', 'Content Creator Level'],
    roles: ['Builder', 'Redstone Engineer', 'PvP Fighter', 'Speedrunner', 'Content Creator'],
  },
  {
    id: 'chess',
    name: 'Chess (Online)',
    shortName: 'CHESS',
    developer: 'Chess.com / Lichess',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'PC (Windows)', 'PC (Mac)'],
    genre: 'Strategy',
    tiers: ['1000-1200 ELO', '1200-1400 ELO', '1400-1600 ELO', '1600-1800 ELO', '1800-2000 ELO', '2000-2200 ELO', 'Grandmaster (2500+ ELO)'],
    roles: ['Player', 'Streamer', 'Analyst', 'Coach'],
  },
  {
    id: 'efootball',
    name: 'eFootball',
    shortName: 'EF',
    developer: 'Konami',
    devices: ['Mobile (Android)', 'Mobile (iOS)', 'PC (Windows)', 'Console (PlayStation)', 'Console (Xbox)'],
    genre: 'Sports (Football)',
    tiers: ['Beginner', 'Amateur', 'Professional', 'Top Rated', 'Legend'],
    roles: ['Player', 'Coach', 'Analyst'],
  },
];

// ── Professional Gaming Roles (Platform-wide) ─────────────────────────────────
const PROFESSIONAL_ROLES = {
  // In-Game Roles
  COMPETITIVE: [
    'IGL (In-Game Leader)',
    'Entry Fragger',
    'Assaulter',
    'Rusher',
    'Sniper / AWPer',
    'Support Player',
    'Lurker',
    'Flex Player',
    'Jungler',
    'Duelist',
    'Controller',
    'Initiator',
    'Sentinel',
    'All-Rounder',
    'Fragger',
    'Scout',
  ],

  // Content & Media
  CONTENT: [
    'Content Creator',
    'YouTube Gaming Creator',
    'Twitch Streamer',
    'YouTube Shorts Creator',
    'Instagram Gaming Creator',
    'Podcast Host',
    'Gaming Blogger / Writer',
    'Lore Writer',
    'Script Writer',
  ],

  // Media Production
  PRODUCTION: [
    'Video Editor',
    'Montage Editor',
    'GFX Artist (Thumbnail Designer)',
    'Motion Graphics Designer',
    '3D Animator',
    '2D Animator',
    'Highlight Editor',
    'Cinematics Editor',
    'Sound Designer',
    'Music Composer',
    'Voice Over Artist',
  ],

  // Esports Operations
  OPERATIONS: [
    'Team Manager',
    'Bootcamp Manager',
    'Esports Coach',
    'Analyst / Statistician',
    'Caster (Commentator)',
    'Observer',
    'Host / MC',
    'Talent Manager',
    'Social Media Manager',
    'Brand Manager',
    'Sponsorship Executive',
    'PR Manager',
    'Scrim Coordinator',
    'Performance Psychologist',
    'Nutritionist / Fitness Coach',
    'Equipment Manager',
    'IT / Network Admin',
    'Event Coordinator',
    'Tournament Organizer',
  ],

  // Business & Support
  BUSINESS: [
    'Esports Entrepreneur',
    'Gaming Cafe Owner',
    'Gaming Organization Founder',
    'Game Developer',
    'Mobile Game UI/UX Designer',
    'Gaming Community Manager',
    'Talent Scout',
    'Gaming Lawyer',
    'Gaming Accountant',
    'Chef (Gaming House)',
  ],
};

// ── Organization Types ────────────────────────────────────────────────────────
const ORG_TYPES = [
  'Esports Organization',
  'Content Studio',
  'Gaming Cafe Chain',
  'Event Management Company',
  'Esports Talent Agency',
  'Game Publisher / Developer',
  'Gaming Hardware Brand',
  'Gaming Peripheral Brand',
  'Esports Tournament Organizer',
  'Gaming Media / News',
  'Streaming Platform',
  'Gaming Academy / Training Center',
  'University Esports Club',
  'Gaming Bootcamp Facility',
  'Sponsorship Agency',
];

// ── Indian States ─────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

// ── Job Post Schema Fields ────────────────────────────────────────────────────
const JOB_FIELDS = {
  WORK_TYPE: ['Full-Time', 'Part-Time', 'Contract', 'Trial / Tryout', 'Internship', 'Volunteer'],
  LOCATION_TYPE: ['Bootcamp (Onsite)', 'Work From Home', 'Hybrid', 'Travel Required', 'Gaming House'],
  LANGUAGE: ['Hindi', 'English', 'Hindi + English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Malayalam', 'Other'],
  SALARY_TYPE: ['Monthly Stipend', 'Revenue Share', 'Prize Pool %', 'Hourly Rate', 'Project Based', 'Unpaid (Exposure)', 'Negotiable'],
  EXPERIENCE_LEVEL: ['Fresher (0-1 yr)', 'Junior (1-2 yrs)', 'Mid (2-4 yrs)', 'Senior (4+ yrs)', 'Professional Player', 'National Level+'],
};

module.exports = {
  DEVICES,
  GAMES,
  PROFESSIONAL_ROLES,
  ORG_TYPES,
  INDIAN_STATES,
  JOB_FIELDS,
};
