export type ScheduleCategory = 'stage' | 'sports' | 'creative' | 'dining';

export interface ScheduleItem {
  id: string;
  time: string;
  duration: string;
  title: string;
  location: string;
  category: ScheduleCategory;
  categoryLabel: string;
  description: string;
  lead?: string;
}

export type ActivityCategory =
  | 'All'
  | 'Sports'
  | 'Cultural'
  | 'Creative'
  | 'Gaming & Intellect';

export interface ActivityItem {
  id: string;
  slNo: number;
  title: string;
  category: 'Sports' | 'Cultural' | 'Creative' | 'Gaming & Intellect';
  coordinatorName: string;
  contactNumber: string;
  contactRaw: string;
  venue: string;
  timing: string;
  teamType: string;
  description: string;
  rules: string[];
  tag: string;
}

export interface SongRequest {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  votes: number;
}

export type TalentCategory =
  | 'Ramp Walk (Mr. & Ms. Synora)'
  | 'Solo / Duet Dance'
  | 'Mono Act / Dramatics'
  | '3 Stage Showdown'
  | 'Acoustic / Stage Music';

export interface TalentEntry {
  id: string;
  name: string;
  rollNumber: string;
  category: TalentCategory;
  pitch: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface EventConfigType {
  brandName: string;
  brandTagline: string;
  collegeName: string;
  department: string;
  batchLabel: string;
  seniorsBatchLabel: string;
  dateDisplay: string;
  timeDisplay: string;
  venueShort: string;
  venueFull: string;
  dressCodeShort: string;
  googleFormUrl: string;
  eventStartIso: string;
}

export const EVENT_CONFIG: EventConfigType = {
  brandName: 'Synora 2K26',
  brandTagline: "AIML Department Freshers' Fest",
  collegeName: 'Kishkinda University',
  department: 'Department of AI & Machine Learning',
  batchLabel: 'Batch of 2026–2030 (26–30 Batch)',
  seniorsBatchLabel: 'Organized by 2nd Year Batch (2025–2029)',
  dateDisplay: 'Friday, Dec 4, 2026',
  timeDisplay: '9:30 AM – 4:30 PM (Daytime Fest)',
  venueShort: 'Auditorium',
  venueFull: 'Main Auditorium, Kishkinda University Campus',
  dressCodeShort: 'Smart Casuals & Traditional / Ethnic Wear',
  // Official Google Form placeholder (can be customized or opened directly)
  googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_synora_2k26_aiml_freshers/viewform',
  // December 4, 2026 09:30 AM local IST offset
  eventStartIso: '2026-12-04T09:30:00+05:30',
};

export const EVENT_IMAGES = {
  heroGala: '/src/assets/images/hero_daytime_fest.jpg',
  djAfterparty: '/src/assets/images/highlight_dj_afterparty_1795272547484.jpg',
  stageSpotlight: '/src/assets/images/highlight_stage_spotlight_1795272547185.jpg',
  dressCodeLookbook: '/src/assets/images/lookbook_daytime_ethnic.jpg',
} as const;

/**
 * All 13 official activities for Synora 2K26 (AIML Department, Kishkinda University).
 * Note: All section identifiers have been cleanly removed as instructed.
 */
export const ACTIVITIES: ActivityItem[] = [
  {
    id: 'box-cricket',
    slNo: 1,
    title: 'Box Cricket',
    category: 'Sports',
    coordinatorName: 'TN Basavaraj',
    contactNumber: '73538 73799',
    contactRaw: '917353873799',
    venue: 'Campus Turf & Sports Arena',
    timing: '10:15 AM – 12:45 PM',
    teamType: 'Squad (6–8 Players)',
    tag: 'High Energy',
    description:
      'Fast-paced box cricket tournament with tennis ball, tactical overs, and boundary thrills designed for inter-section fresher squads.',
    rules: [
      '6 overs per match with standard box cricket turf rules.',
      '1 powerplay over per innings (max 2 fielders outside the inner circle).',
      'Direct wall hitting outside boundary marks constitutes an out.',
      'All team members must belong to 1st Year AIML (Batch 2026–2030).',
    ],
  },
  {
    id: 'tug-of-war',
    slNo: 2,
    title: 'Tug of War',
    category: 'Sports',
    coordinatorName: 'Vinay',
    contactNumber: '82172 68731',
    contactRaw: '918217268731',
    venue: 'University Central Lawn (Adjacent to Auditorium)',
    timing: '11:00 AM – 12:30 PM',
    teamType: 'Team (8 Players)',
    tag: 'Pure Power',
    description:
      'The ultimate battle of raw power, grip, and department camaraderie in a best-of-three rope pull knockout bracket.',
    rules: [
      '8 players per team (inter-section teams permitted).',
      'Best of 3 pulls determines the winning squad for each round.',
      'No gloves or cleats permitted; standard sports sneakers only.',
      'Referee whistle signals start and cessation of pull.',
    ],
  },
  {
    id: 'photography',
    slNo: 3,
    title: 'Photography',
    category: 'Creative',
    coordinatorName: 'Shashank B',
    contactNumber: '88848 50277',
    contactRaw: '918884850277',
    venue: 'Campus Wide & Auditorium Gallery',
    timing: '10:00 AM – 02:00 PM',
    teamType: 'Solo',
    tag: 'Visual Storytelling',
    description:
      'Capture the most vibrant, candid, and high-spirited daytime moments of Synora 2K26 through your mobile or DSLR lens.',
    rules: [
      'Both smartphone and DSLR categories evaluated separately.',
      'Photos must be taken during fest hours on campus grounds.',
      'Basic color grading allowed; heavy AI manipulation or composite filters prohibited.',
      'Submit your top 2 frames to the coordinator before 02:30 PM.',
    ],
  },
  {
    id: 'hidden-chapters',
    slNo: 4,
    title: 'Hidden Chapters',
    category: 'Gaming & Intellect',
    coordinatorName: 'Mythri',
    contactNumber: '83411 00569',
    contactRaw: '918341100569',
    venue: 'Library Quad & Auditorium Corridors',
    timing: '10:30 AM – 12:00 PM',
    teamType: 'Pairs (2 Players)',
    tag: 'Mystery Quest',
    description:
      'An immersive campus treasure hunt. Decrypt cryptic algorithmic clues, uncover hidden bookmarks, and piece together the secret narrative.',
    rules: [
      'Teams receive the first clue card from the coordinator at 10:30 AM.',
      'Total of 4 checkpoints scattered across the auditorium zone.',
      'No tampering with clue markers or asking non-participants.',
      'Fastest team to assemble the complete chapter wins the trophy.',
    ],
  },
  {
    id: 'carrom',
    slNo: 5,
    title: 'Carrom',
    category: 'Sports',
    coordinatorName: 'Prashant K',
    contactNumber: '99721 38543',
    contactRaw: '919972138543',
    venue: 'Indoor Activity Hall',
    timing: '10:15 AM – 12:45 PM',
    teamType: 'Doubles / Solo',
    tag: 'Board Precision',
    description:
      'Boardroom precision, striker finesse, and thrilling queen covers in this classic indoor championship tournament.',
    rules: [
      'Standard carrom board rules apply: Black = 10 pts, White = 20 pts, Queen = 50 pts.',
      'Queen must be covered immediately on the subsequent shot.',
      'Direct knockout format (first to reach 25 points or highest score after 20 mins).',
      'Players must bring college ID cards for verification.',
    ],
  },
  {
    id: 'dance',
    slNo: 6,
    title: 'Dance',
    category: 'Cultural',
    coordinatorName: 'Nageshwari P',
    contactNumber: '80959 82881',
    contactRaw: '918095982881',
    venue: 'Main Auditorium Stage',
    timing: '02:15 PM – 03:15 PM',
    teamType: 'Solo / Duet / Group',
    tag: 'Auditorium Spotlight',
    description:
      'Take over the grand auditorium stage with rhythm, grace, hip-hop energy, or classical elegance in front of your peers and faculty.',
    rules: [
      'Performance duration: Solo (2–3 mins), Duet/Group (3–5 mins).',
      'Audio track must be submitted in MP3 format to coordinator by 11:30 AM.',
      'Props allowed with prior approval; no dangerous elements (fire/fluids).',
      'Judging criteria: Choreography, stage presence, musicality, and crowd engagement.',
    ],
  },
  {
    id: 'three-stage-showdown',
    slNo: 7,
    title: '3 Stage Showdown',
    category: 'Cultural',
    coordinatorName: 'Shashank A',
    contactNumber: '90197 59515',
    contactRaw: '919019759515',
    venue: 'Main Auditorium Stage & Arena',
    timing: '02:00 PM – 03:00 PM',
    teamType: 'Pairs (2 Players)',
    tag: 'Flagship Battle',
    description:
      'The signature multi-round challenge testing agility, wit, and quick synchronization across three high-pressure stages.',
    rules: [
      'Stage 1: Rapid Relay & Coordination obstacle test.',
      'Stage 2: Tech Charades & algorithmic riddle buzzer round.',
      'Stage 3: Spontaneous Stage Finale judged live by senior mentors.',
      'Pairs advance based on cumulative points across rounds.',
    ],
  },
  {
    id: 'ramp-walk',
    slNo: 8,
    title: 'Ramp Walk',
    category: 'Cultural',
    coordinatorName: 'Sai Sree',
    contactNumber: '76609 44609',
    contactRaw: '917660944609',
    venue: 'Main Auditorium Runway',
    timing: '03:00 PM – 03:45 PM',
    teamType: 'Solo (Mr. & Ms. Synora)',
    tag: 'Runway Royalty',
    description:
      'Walk with charisma, poise, and ethnic or smart elegance on the spotlight runway. Crowned Mr. & Ms. Synora 2K26!',
    rules: [
      'Round 1: Ethnic / Smart Casual Ramp Walk with personal intro.',
      'Round 2: Talent Prop showcase (45 seconds).',
      'Round 3: Spontaneous wit & question round judged by faculty & seniors.',
      'Winners awarded the official Synora 2K26 Sash and Trophy.',
    ],
  },
  {
    id: 'mono-act',
    slNo: 9,
    title: 'Mono Act',
    category: 'Cultural',
    coordinatorName: 'Lahari',
    contactNumber: '76765 82264',
    contactRaw: '917676582264',
    venue: 'Main Auditorium Stage',
    timing: '02:00 PM – 02:45 PM',
    teamType: 'Solo',
    tag: 'Theatrical Art',
    description:
      'A solo theatrical performance where voice modulation, expressive intensity, and character transformation grip the entire audience.',
    rules: [
      'Time limit: 3 to 4 minutes max.',
      'Languages permitted: English, Kannada, Hindi.',
      'Original scripts or iconic theatrical adaptations are welcomed.',
      'Judged on vocal range, emotional depth, and audience impact.',
    ],
  },
  {
    id: 'reel-making',
    slNo: 10,
    title: 'Reel Making',
    category: 'Creative',
    coordinatorName: 'Amanath Ali Khan',
    contactNumber: '73377 99633',
    contactRaw: '917337799633',
    venue: 'Campus Wide & Online Submission',
    timing: 'Daytime (Submissions by 03:15 PM)',
    teamType: 'Solo / Duet',
    tag: 'Viral Creator',
    description:
      'Create an aesthetic, viral 30–60 second Instagram reel capturing the daytime energy, joy, and friendships of Synora 2K26.',
    rules: [
      'Reel length must be between 30 and 60 seconds.',
      'Must incorporate official event hashtags and tag @aiml_kishkinda.',
      'Content must be captured live on campus during fest daytime hours.',
      'Submit video file or draft link to the coordinator before 03:15 PM.',
    ],
  },
  {
    id: 'drawing-painting',
    slNo: 11,
    title: 'Drawing & Painting',
    category: 'Creative',
    coordinatorName: 'Navya Sree',
    contactNumber: '93816 27033',
    contactRaw: '919381627033',
    venue: 'Seminar Hall 101 / Foyer Gallery',
    timing: '10:30 AM – 12:30 PM',
    teamType: 'Solo',
    tag: 'Fine Arts',
    description:
      'Splash your imagination onto paper! Express futuristic AI visions, campus life, or vibrant fest colors with your artistic flair.',
    rules: [
      'Drawing sheets will be provided by the department.',
      'Participants must bring their own art supplies (acrylics, watercolors, pencils, etc.).',
      'Theme will be disclosed at 10:30 AM before the start.',
      'Time limit is 2 hours; judging criteria includes originality and technique.',
    ],
  },
  {
    id: 'mind-games',
    slNo: 12,
    title: 'Mind Games',
    category: 'Gaming & Intellect',
    coordinatorName: 'Charan Tej',
    contactNumber: '91087 71828',
    contactRaw: '919108771828',
    venue: 'Auditorium Seminar Hall',
    timing: '11:15 AM – 12:45 PM',
    teamType: 'Solo / Pairs',
    tag: 'Brainpower',
    description:
      'Logic riddles, rapid pattern decryption, mathematical paradoxes, and tech brainteasers designed to test sharp AIML minds.',
    rules: [
      'Round 1: Rapid-fire written puzzle paper (20 mins).',
      'Round 2: Live buzzer riddle round for top qualifying teams.',
      'No smartphones, calculators, or smartwatches permitted.',
      'Tiebreakers resolved with rapid algorithmic puzzles.',
    ],
  },
  {
    id: 'free-fire',
    slNo: 13,
    title: 'Free Fire',
    category: 'Gaming & Intellect',
    coordinatorName: 'Pritam',
    contactNumber: '83106 46670',
    contactRaw: '918310646670',
    venue: 'Esports Lounge / Smart Room 203',
    timing: '10:30 AM – 12:45 PM',
    teamType: 'Squad (4 Players)',
    tag: 'Esports Arena',
    description:
      'Battle royale mobile esports clash. Custom room squad matches, tactical rotations, and the ultimate hunt for the Booyah!',
    rules: [
      'Squad of 4 players (must bring own smartphones & headphones).',
      'Mobile phones only; tablets, emulators, and triggers strictly prohibited.',
      'Custom room ID and password shared with captains 10 minutes before match.',
      'Any form of third-party software/hacks results in immediate disqualification.',
    ],
  },
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 'inauguration',
    time: '09:30',
    duration: '45 min',
    title: 'Inaugural Ceremony & Lamp Lighting',
    location: 'Main Auditorium',
    category: 'stage',
    categoryLabel: 'Stage',
    description:
      'Welcome address by the Dean & HOD of AIML, ceremonial lamp lighting, student council opening remarks, and batch montage reveal.',
    lead: 'AIML Faculty & Senior Student Council',
  },
  {
    id: 'morning-sports',
    time: '10:15',
    duration: '150 min',
    title: 'Outdoor & Arena Tournaments (Cricket, Tug of War, Carrom)',
    location: 'Campus Turf & Sports Arena',
    category: 'sports',
    categoryLabel: 'Sports',
    description:
      'Simultaneous knockout action across Box Cricket turf, Tug of War lawn arena, and Indoor Carrom hall. Support your section!',
    lead: 'TN Basavaraj, Vinay & Prashant K',
  },
  {
    id: 'creative-intellect',
    time: '10:30',
    duration: '135 min',
    title: 'Creative Labs & Esports (Drawing, Free Fire, Mind Games & Hidden Chapters)',
    location: 'Seminar Halls & Gallery',
    category: 'creative',
    categoryLabel: 'Creative',
    description:
      'Intense Free Fire squad custom matches, Drawing & Painting canvas session, Mind Games buzzer rounds, and Hidden Chapters mystery trail.',
    lead: 'Navya Sree, Pritam, Charan Tej & Mythri',
  },
  {
    id: 'festive-lunch',
    time: '13:00',
    duration: '60 min',
    title: 'Grand Festive Lunch & Networking Feast',
    location: 'Auditorium Courtyard & Dining Hall',
    category: 'dining',
    categoryLabel: 'Dining',
    description:
      'Delicious multi-cuisine lunch feast featuring hot biryani, paneer specialties, desserts, and welcome mocktails with music.',
    lead: 'Dedicated Veg, Non-Veg & Jain Food Counters',
  },
  {
    id: 'stage-showcase',
    time: '14:00',
    duration: '105 min',
    title: 'Auditorium Stage Showcase: Dance, Mono Act, 3 Stage Showdown & Ramp Walk',
    location: 'Main Auditorium Stage',
    category: 'stage',
    categoryLabel: 'Stage',
    description:
      'Electrifying dance routines, poignant mono acts, the thrilling 3 Stage Showdown, followed by the crowning of Mr. & Ms. Synora 2K26 on the runway.',
    lead: 'Nageshwari P, Lahari, Shashank A & Sai Sree',
  },
  {
    id: 'valedictory',
    time: '15:45',
    duration: '45 min',
    title: 'Awards Presentation, Valedictory & Freshers Anthem',
    location: 'Main Auditorium Stage',
    category: 'stage',
    categoryLabel: 'Stage',
    description:
      'Distribution of trophies and certificates for all 13 activities, special recognitions, vote of thanks, and official 26–30 freshers batch photo.',
    lead: 'AIML HOD & Core Organizing Committee (Batch 2025–2029)',
  },
];

export const INITIAL_SONGS: SongRequest[] = [
  {
    id: 'song-1',
    title: 'Tauba Tauba',
    artist: 'Karan Aujla',
    requestedBy: 'AIML 1st Year',
    votes: 38,
  },
  {
    id: 'song-2',
    title: 'Illuminati',
    artist: 'Sushin Shyam',
    requestedBy: 'Fresher Crew',
    votes: 32,
  },
  {
    id: 'song-3',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    requestedBy: 'AIML Section A',
    votes: 27,
  },
  {
    id: 'song-4',
    title: 'Kesariya (Dance Mix)',
    artist: 'Pritam & Arijit Singh',
    requestedBy: 'AIML Section B',
    votes: 21,
  },
  {
    id: 'song-5',
    title: 'Believer',
    artist: 'Imagine Dragons',
    requestedBy: 'AIML Section C',
    votes: 18,
  },
];

export const INITIAL_TALENT_ENTRIES: TalentEntry[] = [
  {
    id: 'talent-1',
    name: 'Sai Sree',
    rollNumber: '26AIML012',
    category: 'Ramp Walk (Mr. & Ms. Synora)',
    pitch: 'Ethnic fusion runway styling & spontaneous stage presence.',
  },
  {
    id: 'talent-2',
    name: 'Nageshwari P',
    rollNumber: '26AIML045',
    category: 'Solo / Duet Dance',
    pitch: 'High-octane classical contemporary fusion routine.',
  },
  {
    id: 'talent-3',
    name: 'Lahari',
    rollNumber: '26AIML078',
    category: 'Mono Act / Dramatics',
    pitch: 'Dramatic monologue on student life and AI evolution.',
  },
];

export const DRESS_CODE_GUIDELINES = [
  {
    heading: 'Daytime Festive Theme',
    detail:
      'Vibrant festive wear, traditional kurtas, sarees, ethnic suits, or sharp smart casuals suited for an energetic daytime celebration.',
  },
  {
    heading: 'Colors',
    detail:
      'Bright celebratory palettes—warm ochre gold, royal blue, emerald green, sunset orange, ivory, or elegant pastel combinations.',
  },
  {
    heading: 'Footwear',
    detail:
      'Comfortable loafers, formal shoes, juttis, or stylish sneakers suitable for both indoor auditorium seating and sports/outdoor activities.',
  },
  {
    heading: 'General Etiquette',
    detail:
      'Wear your Kishkinda University ID card or admission slip at all times for easy gate access and event participation.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-register',
    question: 'How do 1st-year students register for activities?',
    answer:
      'You can register for any of the 13 activities via the official Google Form link on this website. Simply tap "Register via Google Form", fill in your name, roll number, and select the activities you wish to compete in.',
  },
  {
    id: 'faq-coordinators',
    question: 'Can I contact event coordinators directly?',
    answer:
      'Yes! All 13 activities have assigned student coordinators with direct Call and WhatsApp links listed in the Activities section. Feel free to contact them for rules, team formations, or questions.',
  },
  {
    id: 'faq-timing',
    question: 'What are the fest timings and venue?',
    answer:
      'Synora 2K26 is a daytime festival taking place on Friday, 4th December 2026 from 9:30 AM to 4:30 PM at the Main Auditorium, Kishkinda University campus.',
  },
  {
    id: 'faq-food',
    question: 'Is lunch provided for all freshers?',
    answer:
      'Yes! A grand festive lunch feast with dedicated Vegetarian, Non-Vegetarian, and Jain food counters is organized for all registered 1st-year AIML students at 1:00 PM.',
  },
  {
    id: 'faq-multiple',
    question: 'Can I participate in multiple activities?',
    answer:
      'Yes, as long as the timings do not overlap. For instance, you can take part in a morning sports or creative event and also participate in afternoon stage events like Ramp Walk or Dance.',
  },
];

/**
 * All 13 event coordinators for direct listing in the portal.
 * Section designations have been removed.
 */
export const COORDINATORS = [
  {
    event: 'Box Cricket',
    name: 'TN Basavaraj',
    contact: '73538 73799',
    rawPhone: '917353873799',
    role: 'Event Coordinator · Box Cricket',
  },
  {
    event: 'Tug of War',
    name: 'Vinay',
    contact: '82172 68731',
    rawPhone: '918217268731',
    role: 'Event Coordinator · Tug of War',
  },
  {
    event: 'Photography',
    name: 'Shashank B',
    contact: '88848 50277',
    rawPhone: '918884850277',
    role: 'Event Coordinator · Photography',
  },
  {
    event: 'Hidden Chapters',
    name: 'Mythri',
    contact: '83411 00569',
    rawPhone: '918341100569',
    role: 'Event Coordinator · Hidden Chapters',
  },
  {
    event: 'Carrom',
    name: 'Prashant K',
    contact: '99721 38543',
    rawPhone: '919972138543',
    role: 'Event Coordinator · Carrom',
  },
  {
    event: 'Dance',
    name: 'Nageshwari P',
    contact: '80959 82881',
    rawPhone: '918095982881',
    role: 'Event Coordinator · Dance',
  },
  {
    event: '3 Stage Showdown',
    name: 'Shashank A',
    contact: '90197 59515',
    rawPhone: '919019759515',
    role: 'Event Coordinator · 3 Stage Showdown',
  },
  {
    event: 'Ramp Walk',
    name: 'Sai Sree',
    contact: '76609 44609',
    rawPhone: '917660944609',
    role: 'Event Coordinator · Ramp Walk',
  },
  {
    event: 'Mono Act',
    name: 'Lahari',
    contact: '76765 82264',
    rawPhone: '917676582264',
    role: 'Event Coordinator · Mono Act',
  },
  {
    event: 'Reel Making',
    name: 'Amanath Ali Khan',
    contact: '73377 99633',
    rawPhone: '917337799633',
    role: 'Event Coordinator · Reel Making',
  },
  {
    event: 'Drawing & Painting',
    name: 'Navya Sree',
    contact: '93816 27033',
    rawPhone: '919381627033',
    role: 'Event Coordinator · Drawing & Painting',
  },
  {
    event: 'Mind Games',
    name: 'Charan Tej',
    contact: '91087 71828',
    rawPhone: '919108771828',
    role: 'Event Coordinator · Mind Games',
  },
  {
    event: 'Free Fire',
    name: 'Pritam',
    contact: '83106 46670',
    rawPhone: '918310646670',
    role: 'Event Coordinator · Free Fire',
  },
];
