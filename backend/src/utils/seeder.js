/**
 * ArenaX Database Seeder
 * Populates the database with realistic Indian esports sample data
 * Run: node src/utils/seeder.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User         = require('../models/User');
const Organization = require('../models/Organization');
const Job          = require('../models/Job');
const Post         = require('../models/Post');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arenax';

// ── Sample Data ───────────────────────────────────────────────────────────────

const SAMPLE_ORGS = [
  {
    email: 'recruit@s8ul-demo.gg',
    password: 'Demo@1234',
    orgName: 'S8UL Demo',
    slug: 's8ul-demo',
    orgType: 'Esports Organization',
    description: 'India\'s leading esports and gaming content organization. Home to 25+ India\'s top gaming creators and championship-winning competitive teams.',
    state: 'Maharashtra',
    city: 'Mumbai',
    activeGames: ['bgmi', 'valorant', 'codm', 'pokemon_unite'],
    foundedYear: 2020,
    tagline: 'Onto the global map 🌏',
    isVerifiedOrg: true,
    achievements: [
      { title: 'Esports Content Group of the Year', tournament: 'Esports Awards', year: 2023, placement: '1st', game: 'Multiple' },
      { title: 'EWC 2025 Participant', tournament: 'Esports World Cup', year: 2025, placement: 'Participant' },
      { title: 'BGIS Season Champions', tournament: 'BGMI India Series', year: 2024, placement: '1st', game: 'BGMI' },
    ],
  },
  {
    email: 'hr@godlike-demo.gg',
    password: 'Demo@1234',
    orgName: 'GodLike Demo',
    slug: 'godlike-demo',
    orgType: 'Esports Organization',
    description: 'One of India\'s most iconic esports organisations, with a legacy built on competitive dominance in mobile esports and one of the largest fanbases in the country.',
    state: 'Maharashtra',
    city: 'Pune',
    activeGames: ['bgmi', 'freefire'],
    foundedYear: 2019,
    tagline: 'Dominate. Inspire. Repeat.',
    isVerifiedOrg: true,
    achievements: [
      { title: 'EWC 2026 Club Partner', tournament: 'Esports World Cup', year: 2026, placement: 'Partner' },
      { title: 'BGMI National Champions', tournament: 'BGMI Pro Series', year: 2024, placement: '1st', game: 'BGMI' },
    ],
  },
  {
    email: 'talent@globalgg-demo.gg',
    password: 'Demo@1234',
    orgName: 'Global Esports Demo',
    slug: 'global-esports-demo',
    orgType: 'Esports Organization',
    description: 'India\'s premiere PC esports organization competing in Valorant Champions Tour and other top-tier global competitions.',
    state: 'Maharashtra',
    city: 'Mumbai',
    activeGames: ['valorant', 'bgmi'],
    foundedYear: 2017,
    tagline: 'Competing at the highest level globally.',
    isVerifiedOrg: true,
    achievements: [
      { title: 'VCT Pacific League', tournament: 'Valorant Champions Tour', year: 2024, placement: 'Participant', game: 'Valorant' },
    ],
  },
  {
    email: 'hire@8bitmedia-demo.in',
    password: 'Demo@1234',
    orgName: '8Bit Media Demo',
    slug: '8bit-media-demo',
    orgType: 'Content Studio',
    description: 'Premier gaming content creation studio specializing in mobile gaming. We produce, edit, and manage content for India\'s top gaming creators.',
    state: 'Delhi',
    city: 'New Delhi',
    activeGames: ['bgmi', 'freefire', 'codm'],
    foundedYear: 2019,
    tagline: 'Creating India\'s gaming culture, one video at a time.',
  },
];

const SAMPLE_USERS = [
  {
    email: 'jonathan.india@demo.gg',
    password: 'Demo@1234',
    username: 'jonathan_demo',
    displayName: 'Jonathan Demo',
    bio: 'Professional BGMI player. Former Fnatic India. Looking for new org. Conqueror every season since 2022. Specializing in sniping and IGL.',
    tagline: 'Conqueror | BGMI Pro | Ex-Fnatic India',
    state: 'Goa',
    city: 'Panaji',
    primaryRole: 'IGL (In-Game Leader)',
    primaryGame: 'bgmi',
    openToWork: true,
    lookingFor: ['Team', 'Org', 'Sponsor'],
    availability: 'Full-Time',
    profileScore: 88,
    gameProfiles: [{
      gameId: 'bgmi', gameName: 'BGMI',
      gameUsername: 'Jonathan_g', currentTier: 'Conqueror', peakTier: 'Conqueror',
      inGameRoles: ['IGL (In-Game Leader)', 'Sniper / AWPer'],
      device: 'Mobile (iOS)',
      hoursPerWeek: 60,
      tournamentExp: 'BGIS 2024 Quarter Finals, PMCO 2023 Finals',
      stats: { kd: 4.2, winRate: 68, matches: 1240 },
    }],
    achievements: [
      { title: 'BGIS 2023 Top 4', description: 'Reached BGIS Quarter Finals with Team XO', date: new Date('2023-11-01') },
      { title: '4x Conqueror', description: 'Achieved Conqueror rank 4 consecutive seasons', date: new Date('2024-03-01') },
    ],
    social: { youtube: 'https://youtube.com/@jonathan_demo', instagram: 'https://instagram.com/jonathan_demo', twitter: 'https://twitter.com/jonathan_demo', discord: 'jonathan#1234' },
  },
  {
    email: 'mortal.creator@demo.gg',
    password: 'Demo@1234',
    username: 'mortal_creator_demo',
    displayName: 'Mortal Creator Demo',
    bio: 'Gaming content creator and streamer. 2M+ subscribers on YouTube. Creating BGMI and variety content since 2018. Open to brand deals and org collabs.',
    tagline: 'Content Creator | 2M Subs | BGMI Variety',
    state: 'Maharashtra',
    city: 'Mumbai',
    primaryRole: 'Content Creator',
    primaryGame: 'bgmi',
    openToWork: false,
    lookingFor: ['Sponsor', 'Collab'],
    availability: 'Part-Time',
    profileScore: 92,
    gameProfiles: [{
      gameId: 'bgmi', gameName: 'BGMI',
      gameUsername: 'MortalDemo', currentTier: 'Ace Master', peakTier: 'Conqueror',
      inGameRoles: ['Content Creator', 'Fragger'],
      device: 'Mobile (iOS)',
      hoursPerWeek: 30,
      stats: { kd: 3.1, winRate: 52, matches: 3200 },
    }],
    social: { youtube: 'https://youtube.com/@mortal_demo', instagram: 'https://instagram.com/mortal_demo', discord: 'mortal#0001' },
  },
  {
    email: 'raveena.gfx@demo.in',
    password: 'Demo@1234',
    username: 'raveena_gfx_demo',
    displayName: 'Raveena GFX Demo',
    bio: 'GFX Artist & Thumbnail Designer specializing in gaming. 3 years experience. Have worked with 15+ gaming orgs. Adobe Photoshop, Illustrator, After Effects.',
    tagline: 'GFX Artist | Thumbnail Designer | 3 YOE',
    state: 'Karnataka',
    city: 'Bangalore',
    primaryRole: 'GFX Artist (Thumbnail Designer)',
    primaryGame: 'bgmi',
    openToWork: true,
    lookingFor: ['Org', 'Collab'],
    availability: 'WFH Only',
    profileScore: 75,
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'After Effects', 'Canva', 'Figma'],
    social: { instagram: 'https://instagram.com/raveena_gfx_demo', twitter: 'https://twitter.com/raveena_gfx' },
  },
  {
    email: 'vikram.caster@demo.gg',
    password: 'Demo@1234',
    username: 'vikram_caster_demo',
    displayName: 'Vikram Caster Demo',
    bio: 'Professional esports caster & host. Casting BGMI, Valorant & Free Fire events since 2021. Hindi-English bilingual. Have hosted 30+ LAN events across India.',
    tagline: 'Esports Caster | LAN Host | Hindi/English',
    state: 'Delhi',
    city: 'New Delhi',
    primaryRole: 'Caster (Commentator)',
    primaryGame: 'bgmi',
    openToWork: true,
    lookingFor: ['Org', 'Team'],
    availability: 'Full-Time',
    profileScore: 82,
    social: { youtube: 'https://youtube.com/@vikram_caster_demo', twitter: 'https://twitter.com/vikram_caster', discord: 'vikram#5678' },
  },
  {
    email: 'priya.editor@demo.in',
    password: 'Demo@1234',
    username: 'priya_editor_demo',
    displayName: 'Priya Editor Demo',
    bio: 'Video Editor & Montage Creator for gaming content. Premiere Pro, DaVinci Resolve. Specializing in fast-paced gaming montages and YouTube long-form edits.',
    tagline: 'Video Editor | Montage Creator | 2YOE',
    state: 'Tamil Nadu',
    city: 'Chennai',
    primaryRole: 'Montage Editor',
    primaryGame: 'bgmi',
    openToWork: true,
    lookingFor: ['Org', 'Collab'],
    availability: 'WFH Only',
    profileScore: 68,
    skills: ['Adobe Premiere Pro', 'DaVinci Resolve', 'After Effects', 'OBS'],
    social: { instagram: 'https://instagram.com/priya_editor_demo' },
  },
];

const SAMPLE_JOBS = (orgId, orgName) => [
  {
    title: 'BGMI IGL Wanted — Full Time Contract',
    description: `We are looking for an experienced In-Game Leader (IGL) for our BGMI competitive roster. The ideal candidate has deep game knowledge, strong communication skills, and experience leading a team through high-pressure tournament situations.\n\nYou will be responsible for calling strategies in real-time, leading scrimmages, analyzing opponent play styles, and working closely with the coaching staff.\n\nThis is a bootcamp-based role at our Mumbai gaming house. Accommodation and meals provided.`,
    roleCategory: 'COMPETITIVE',
    specificRole: 'IGL (In-Game Leader)',
    gameId: 'bgmi',
    gameName: 'BGMI',
    minTier: 'Ace Dominator',
    workType: 'Full-Time',
    locationType: 'Bootcamp (Onsite)',
    location: { state: 'Maharashtra', city: 'Mumbai', country: 'India' },
    language: 'Hindi + English',
    deviceRequirements: {
      requiredDevice: 'Must have iPhone 13+ or Android with Snapdragon 8 Gen 1+',
      minRAM: '8GB minimum',
      internetSpeed: '50 Mbps+ stable, fiber preferred',
    },
    requirements: {
      experienceLevel: 'Senior (4+ yrs)',
      minAge: 18,
      maxAge: 26,
      statRequirements: { kd: '>3.5', winRate: '>60%' },
      synergyExp: 'Must have experience leading a team in structured scrimmages',
      portfolioRequired: true,
    },
    mustHaves: [
      'Minimum Ace Dominator rank (Conqueror preferred)',
      'Full-time availability for bootcamp (6 days/week)',
      'Strong Hindi communication skills',
      'Experience in at least one offline BGMI tournament',
      'Willingness to relocate to Mumbai (accommodation provided)',
    ],
    niceToHaves: [
      'Previous org experience',
      'Personal YouTube/Instagram with gaming content',
      'Coach/analyst experience as secondary',
    ],
    applicationProcess: {
      steps: ['Submit application with highlight clips', 'Online scrimmage trial (3 matches)', 'Video call with team manager', 'Bootcamp trial (2 weeks)', 'Contract offer'],
      portfolioLink: true,
      videoIntro: false,
      trialMatch: true,
    },
    salary: { type: 'Monthly Stipend', min: 15000, max: 40000, currency: 'INR', isNegotiable: true },
    perks: ['Gaming house accommodation', 'Meals provided', 'Equipment provided', 'Tournament prize pool share', 'Travel covered for events'],
    openSlots: 1,
    tags: ['BGMI', 'IGL', 'Bootcamp', 'Mumbai', 'Competitive'],
    isFeatured: true,
    postedBy: { type: 'organization', orgId, orgName, orgLogo: '' },
  },
  {
    title: 'GFX Artist / Thumbnail Designer — WFH',
    description: `Looking for a talented GFX Artist to create YouTube thumbnails, social media graphics, team jerseys, event posters, and brand assets for our org and creator roster.\n\nYou'll work directly with our content team to deliver 10-15 assets per month. Must have a strong portfolio showing gaming-themed design work.`,
    roleCategory: 'PRODUCTION',
    specificRole: 'GFX Artist (Thumbnail Designer)',
    gameId: '',
    gameName: '',
    workType: 'Part-Time',
    locationType: 'Work From Home',
    location: { state: '', country: 'India' },
    language: 'Hindi + English',
    deviceRequirements: {
      softwareTools: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva Pro'],
      customNote: 'Must have access to licensed Adobe CC',
    },
    requirements: {
      experienceLevel: 'Junior (1-2 yrs)',
      portfolioRequired: true,
      socialFollowing: 'Portfolio required (no follower minimum)',
    },
    mustHaves: [
      'Strong portfolio of gaming-themed designs (min 10 pieces)',
      'Proficient in Adobe Photoshop (Illustrator is a plus)',
      '24-48 hour turnaround on standard assets',
      'Ability to follow brand guidelines',
    ],
    niceToHaves: [
      'Motion graphics / animated thumbnails',
      'Experience working with gaming orgs or YouTubers',
      'Jersey / merchandise design experience',
    ],
    applicationProcess: {
      steps: ['Submit application with portfolio link', 'Design test (create 1 thumbnail with brief)', 'Short call with creative director', 'Offer'],
      portfolioLink: true,
      videoIntro: false,
      trialMatch: false,
    },
    salary: { type: 'Project Based', min: 500, max: 2000, currency: 'INR', isNegotiable: true },
    perks: ['Flexible hours', 'Credit on all published assets', 'Opportunity for full-time role'],
    openSlots: 2,
    tags: ['GFX', 'Design', 'WFH', 'Thumbnail', 'Remote'],
    postedBy: { type: 'organization', orgId, orgName, orgLogo: '' },
  },
  {
    title: 'Valorant Duelist — Trial Tryout',
    description: `We are conducting trials for a Duelist player for our Valorant roster competing in VCT Challengers India. Must be Immortal+ rank. Trials will be held over 3 days at our Mumbai bootcamp facility.\n\nAgent pool expected: Jett, Neon, Reyna, Raze. Willingness to play Yoru as secondary.`,
    roleCategory: 'COMPETITIVE',
    specificRole: 'Duelist',
    gameId: 'valorant',
    gameName: 'Valorant',
    minTier: 'Immortal 1',
    workType: 'Trial / Tryout',
    locationType: 'Bootcamp (Onsite)',
    location: { state: 'Maharashtra', city: 'Mumbai', country: 'India' },
    language: 'English',
    deviceRequirements: {
      requiredDevice: 'Gaming PC — minimum RTX 2060 or equivalent',
      minRAM: '16GB',
      internetSpeed: '100 Mbps+ for bootcamp (provided at facility)',
      peripherals: ['Gaming mouse (400-800 DPI)', '144hz+ monitor'],
    },
    requirements: {
      experienceLevel: 'Mid (2-4 yrs)',
      minAge: 17,
      maxAge: 25,
      statRequirements: { 'ACS (Average Combat Score)': '>220', 'HS%': '>22%' },
    },
    mustHaves: [
      'Immortal 1 or above on Indian server',
      'Available for 3-day bootcamp trial in Mumbai (travel + stay covered)',
      'PC specs minimum RTX 2060 / Ryzen 5 5600 equivalent',
      'Strong English communication',
    ],
    applicationProcess: {
      steps: ['Apply with Tracker.gg link', 'Discord server jam (5 matches)', '3-day Mumbai bootcamp trial', 'Final decision'],
      portfolioLink: false,
      videoIntro: false,
      trialMatch: true,
    },
    salary: { type: 'Monthly Stipend', min: 20000, max: 60000, currency: 'INR', isNegotiable: false },
    perks: ['Travel covered for trial', 'Bootcamp stay covered', 'Equipment allowance if signed'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    openSlots: 1,
    tags: ['Valorant', 'Duelist', 'VCT', 'Trial', 'PC'],
    isFeatured: true,
    postedBy: { type: 'organization', orgId, orgName, orgLogo: '' },
  },
  {
    title: 'Gaming Content Video Editor — Full Time WFH',
    description: `We need a dedicated Video Editor to handle editing for our gaming creator roster. You'll edit 15-20 YouTube videos per month across gaming content, vlogs, and montages. Must be comfortable with fast-paced editing style popular in Indian gaming YouTube.`,
    roleCategory: 'PRODUCTION',
    specificRole: 'Video Editor',
    workType: 'Full-Time',
    locationType: 'Work From Home',
    location: { country: 'India' },
    language: 'Hindi + English',
    deviceRequirements: {
      minRAM: '16GB (32GB preferred for 4K editing)',
      softwareTools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
      customNote: 'Must have a capable editing PC. Laptop with dedicated GPU acceptable.',
    },
    requirements: {
      experienceLevel: 'Junior (1-2 yrs)',
      portfolioRequired: true,
    },
    mustHaves: [
      'Portfolio of at least 5 gaming YouTube edits',
      'Proficient in Adobe Premiere Pro or DaVinci Resolve',
      'Can handle 4-5 minute YouTube-style edits in 24-48 hours',
      'Understanding of Indian gaming audience and trends',
    ],
    niceToHaves: [
      'Experience with After Effects motion graphics',
      'YouTube channel of your own (even small)',
      'Knowledge of BGMI / Free Fire content style',
    ],
    applicationProcess: {
      steps: ['Submit portfolio', 'Edit test with raw footage provided', 'Shortlisting call', 'Trial month (paid)', 'Full-time offer'],
      portfolioLink: true,
      videoIntro: false,
      trialMatch: false,
    },
    salary: { type: 'Monthly Stipend', min: 12000, max: 25000, currency: 'INR', isNegotiable: true },
    perks: ['Fully remote', 'Flexible timing', 'Creative freedom', 'Learning from top creators'],
    openSlots: 2,
    tags: ['Video Editor', 'WFH', 'Gaming', 'YouTube', 'Premiere Pro'],
    postedBy: { type: 'organization', orgId, orgName, orgLogo: '' },
  },
];

// ── Seeder Logic ──────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Job.deleteMany({}),
      Post.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed organizations
    const createdOrgs = [];
    for (const orgData of SAMPLE_ORGS) {
      const org = await Organization.create(orgData);
      createdOrgs.push(org);
      console.log(`🏢 Created org: ${org.orgName}`);
    }

    // Seed jobs (posted by first org)
    const primaryOrg = createdOrgs[0];
    const jobDefs = SAMPLE_JOBS(primaryOrg._id, primaryOrg.orgName);
    for (const jobData of jobDefs) {
      const job = await Job.create(jobData);
      console.log(`💼 Created job: ${job.title.substring(0, 50)}...`);
    }
    await Organization.findByIdAndUpdate(primaryOrg._id, { totalJobs: jobDefs.length, activeJobs: jobDefs.length });

    // Seed users
    const createdUsers = [];
    for (const userData of SAMPLE_USERS) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`🎮 Created user: ${user.displayName} (@${user.username})`);
    }

    // Seed sample posts
    const samplePosts = [
      {
        author: { id: createdUsers[0]._id, type: 'User', displayName: createdUsers[0].displayName, username: createdUsers[0].username, primaryRole: createdUsers[0].primaryRole },
        content: 'Finally hit Conqueror this season! 🏆 The grind was real — 60 hours this week alone. Looking for a new org to compete with. If any team manager is reading this, check my profile! #BGMI #Conqueror #OpenToWork',
        postType: 'achievement',
        tags: ['BGMI', 'Conqueror', 'OpenToWork'],
        gameTag: 'bgmi',
        likesCount: 234,
        commentsCount: 18,
      },
      {
        author: { id: createdUsers[1]._id, type: 'User', displayName: createdUsers[1].displayName, username: createdUsers[1].username, primaryRole: createdUsers[1].primaryRole },
        content: 'Just crossed 2 MILLION subscribers! 🎉 Thank you to every single one of you. Started this journey with zero — now we\'re a whole community. New video dropping tomorrow! #Gaming #ContentCreator #2Mil',
        postType: 'announcement',
        tags: ['Milestone', 'ContentCreator', 'YouTube'],
        likesCount: 1842,
        commentsCount: 156,
        isFeatured: true,
      },
      {
        author: { id: createdOrgs[0]._id, type: 'Organization', displayName: createdOrgs[0].orgName, username: createdOrgs[0].slug, isVerified: true },
        content: '🔥 We\'re looking for India\'s next BGMI IGL! If you have what it takes to lead a Tier-1 roster, apply now through ArenaX. Tryouts this month. Link in bio. #Hiring #BGMI #Esports #IGL',
        postType: 'announcement',
        tags: ['Hiring', 'BGMI', 'IGL', 'Esports'],
        gameTag: 'bgmi',
        likesCount: 892,
        commentsCount: 43,
        isFeatured: true,
      },
      {
        author: { id: createdUsers[2]._id, type: 'User', displayName: createdUsers[2].displayName, username: createdUsers[2].username, primaryRole: createdUsers[2].primaryRole },
        content: 'Just finished this BGMI thumbnail for a client! 🎨 Took 4 hours in Photoshop — neon cyber style with motion blur. Love how it came out. Open to freelance work! DM or apply on my ArenaX profile. #GFXArtist #Thumbnail #Design',
        postType: 'image',
        tags: ['GFX', 'Design', 'Thumbnail', 'Freelance'],
        likesCount: 312,
        commentsCount: 27,
      },
    ];

    for (const postData of samplePosts) {
      await Post.create(postData);
    }
    console.log(`📣 Created ${samplePosts.length} sample posts`);

    console.log('\n✅ ===== SEED COMPLETE =====');
    console.log('\n🔑 Demo Login Credentials:');
    console.log('\n👤 USERS (accountType: user):');
    SAMPLE_USERS.forEach(u => console.log(`   ${u.email} / Demo@1234`));
    console.log('\n🏢 ORGANIZATIONS (accountType: organization):');
    SAMPLE_ORGS.forEach(o => console.log(`   ${o.email} / Demo@1234`));
    console.log('\n📌 Visit http://localhost:3000 to explore the platform');

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
