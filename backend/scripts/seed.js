require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

const INTEREST_POOL = [
  'Coffee',
  'Hiking',
  'Photography',
  'Music',
  'Travel',
  'Cooking',
  'Yoga',
  'Reading',
  'Movies',
  'Dancing',
  'Art',
  'Fitness',
  'Gaming',
  'Startups',
  'Football',
  'Cricket',
  'Poetry',
  'Design',
  'Baking',
  'Running',
  'Podcasts',
  'Board Games',
  'Astrology',
  'Fashion',
  'Dogs',
  'Cats',
  'Volunteering',
  'Stand-up',
  'Surfing',
  'Climbing',
];

const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi University',
  'IIT Bombay',
  'Pune',
  'Hyderabad',
  'Chennai',
  'NIT Trichy',
  'BITS Pilani',
  'Goa',
  'Kolkata',
  'Manipal',
  'Christ University',
  'IIM Ahmedabad',
  'Jaipur',
];

const FIRST_NAMES = [
  'Aanya',
  'Rohan',
  'Meera',
  'Kabir',
  'Isha',
  'Arjun',
  'Diya',
  'Vivaan',
  'Ananya',
  'Dev',
  'Saanvi',
  'Aarav',
  'Kiara',
  'Reyansh',
  'Myra',
  'Aditya',
  'Pari',
  'Kunal',
  'Nisha',
  'Yash',
  'Tara',
  'Ishaan',
  'Riya',
  'Shaurya',
  'Aisha',
  'Veer',
  'Navya',
  'Dhruv',
  'Zara',
  'Krish',
  'Sara',
  'Om',
  'Lavanya',
  'Neil',
  'Ira',
];

const BIOS = [
  'Weekend brunches and spontaneous road trips.',
  'Looking for someone who laughs at my dad jokes.',
  'Part-time poet, full-time coffee enthusiast.',
  'Training for a half marathon — join me?',
  'Design by day, indie films by night.',
  'I cook better than I text. Prove me wrong.',
  'Always up for a chai and a deep conversation.',
  'Dog parent seeking hiking buddy.',
  'Currently obsessed with pottery and podcasts.',
  'If you love sunsets, we will get along.',
  'Building something cool and looking for balance.',
  'Playlist curator. Ask me for song recs.',
  'Fluent in sarcasm and late-night walks.',
  'Here for genuine connections, not small talk only.',
  'Amateur photographer with a soft spot for street food.',
  'Bookworm who somehow still has unread shelves.',
  'Let us explore the city one café at a time.',
  'Gym in the morning, live music in the evening.',
  'I will beat you at Mario Kart — gently.',
  'Soft launch energy only.',
];

const pickInterests = () => {
  const shuffled = [...INTEREST_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
};

const photoFor = (index, gender = 'women') =>
  `https://randomuser.me/api/portraits/${gender}/${index % 90}.jpg`;

const buildPeople = () => {
  const demo = {
    name: 'Alex Rivera',
    age: 24,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Product-curious engineer who loves good design, long walks, and discovering new cafés.',
    city: 'Bangalore',
    interests: ['Coffee', 'Design', 'Hiking', 'Music', 'Startups'],
    isDemo: true,
  };

  const others = Array.from({ length: 32 }, (_, i) => {
    const female = i % 2 === 0;
    return {
      name: FIRST_NAMES[i % FIRST_NAMES.length],
      age: 18 + ((i * 3) % 12),
      photo: photoFor(i + 10, female ? 'women' : 'men'),
      bio: BIOS[i % BIOS.length],
      city: CITIES[i % CITIES.length],
      interests: pickInterests(),
      isDemo: false,
    };
  });

  return { demo, others };
};

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    // Drop collections so stale indexes (e.g. old Match.users unique) are removed
    const collections = await mongoose.connection.db.listCollections().toArray();
    const names = collections.map((c) => c.name);
    await Promise.all(
      ['matches', 'swipes', 'profiles', 'users']
        .filter((name) => names.includes(name))
        .map((name) => mongoose.connection.db.dropCollection(name))
    );

    const { demo, others } = buildPeople();

    console.log('Creating demo user...');
    const demoUser = await User.create(demo);
    const demoProfile = await Profile.create({
      userId: demoUser._id,
      name: demoUser.name,
      age: demoUser.age,
      photo: demoUser.photo,
      bio: demoUser.bio,
      city: demoUser.city,
      interests: demoUser.interests,
    });

    console.log('Creating 32 discoverable profiles...');
    const otherUsers = await User.insertMany(others);
    const otherProfiles = await Profile.insertMany(
      otherUsers.map((user) => ({
        userId: user._id,
        name: user.name,
        age: user.age,
        photo: user.photo,
        bio: user.bio,
        city: user.city,
        interests: user.interests,
      }))
    );

    // Several profiles have already liked the demo user (incoming likes — never exposed via API)
    const preLikeCount = 8;
    const preLikers = otherProfiles.slice(0, preLikeCount);

    console.log(`Seeding ${preLikeCount} incoming likes toward the demo user...`);
    await Swipe.insertMany(
      preLikers.map((profile) => ({
        userId: profile.userId,
        profileId: demoProfile._id,
        action: 'like',
      }))
    );

    console.log('\nSeed completed successfully.');
    console.log('----------------------------------------');
    console.log(`Demo user:     ${demoUser.name} (${demoUser._id})`);
    console.log(`Demo profile:  ${demoProfile._id}`);
    console.log(`Total profiles:${otherProfiles.length + 1}`);
    console.log(`Pre-likes:     ${preLikeCount} profiles already liked the demo user`);
    console.log('Tip: like one of the first 8 profiles in the feed to trigger a match.');
    console.log('----------------------------------------');

    // Persist demo user id into .env for convenience
    const fs = require('fs');
    const envPath = require('path').join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('DEMO_USER_ID=')) {
        envContent = envContent.replace(/DEMO_USER_ID=.*/g, `DEMO_USER_ID=${demoUser._id}`);
      } else {
        envContent += `\nDEMO_USER_ID=${demoUser._id}\n`;
      }
      fs.writeFileSync(envPath, envContent);
      console.log('Updated DEMO_USER_ID in backend/.env');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
