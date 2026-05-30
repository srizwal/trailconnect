require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trek = require('./src/models/Trek');
const Guide = require('./src/models/Guide');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trailconnect';

const sampleUsers = [
  { name: 'Alex Rivera', email: 'alex@trailconnect.com', password: 'password123', role: 'user', experienceLevel: 'advanced', location: 'Denver, CO', bio: 'Summit chaser. 50+ peaks conquered.', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Priya Sharma', email: 'priya@trailconnect.com', password: 'password123', role: 'guide', experienceLevel: 'expert', location: 'Kathmandu, Nepal', bio: 'Certified Himalayan guide with 12 years experience.', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Marcus Chen', email: 'admin@trailconnect.com', password: 'password123', role: 'admin', experienceLevel: 'expert', location: 'San Francisco, CA', bio: 'TrailConnect founder and adventure enthusiast.', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Sofia Müller', email: 'sofia@trailconnect.com', password: 'password123', role: 'user', experienceLevel: 'intermediate', location: 'Munich, Germany', bio: 'Alpine hiker. Coffee addict.', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'James Okafor', email: 'james@trailconnect.com', password: 'password123', role: 'user', experienceLevel: 'beginner', location: 'Lagos, Nigeria', bio: 'Just starting my hiking journey!', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const sampleTreks = [
  {
    title: 'Everest Base Camp Classic',
    description: 'The iconic trek through the heart of the Himalayas. Witness breathtaking views of the world\'s highest peak and experience Sherpa culture.',
    destination: 'Everest Base Camp, Nepal',
    meetingLocation: 'Lukla Airport, Nepal',
    difficulty: 'hard',
    duration: '14 days',
    totalSeats: 12,
    costPerPerson: 1800,
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    requiredEquipment: ['Trekking poles', 'Sleeping bag (-20°C)', 'Down jacket', 'Crampons', 'Headlamp'],
    tags: ['himalaya', 'nepal', 'iconic', 'altitude'],
    elevation: { gain: 4000, maxAlt: 5364 },
    distance: 130,
    isFeatured: true,
    isPublic: true,
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'],
  },
  {
    title: 'Patagonia Torres del Paine W Trek',
    description: 'Explore the dramatic landscapes of Chilean Patagonia – granite towers, turquoise lakes, and wild condors overhead.',
    destination: 'Torres del Paine, Chile',
    meetingLocation: 'Puerto Natales Bus Terminal',
    difficulty: 'moderate',
    duration: '5 days',
    totalSeats: 8,
    costPerPerson: 650,
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    requiredEquipment: ['Rain gear', 'Trekking boots', 'Wind jacket', 'Trekking poles'],
    tags: ['patagonia', 'chile', 'towers', 'scenic'],
    elevation: { gain: 2500, maxAlt: 2850 },
    distance: 80,
    isFeatured: true,
    isPublic: true,
    coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'],
  },
  {
    title: 'Rocky Mountain Sunrise Summit',
    description: 'A beginner-friendly dawn hike to catch the most spectacular sunrise in Colorado. Perfect for first-timers and families.',
    destination: 'Rocky Mountain NP, Colorado',
    meetingLocation: 'Bear Lake Trailhead Parking',
    difficulty: 'easy',
    duration: '1 day',
    totalSeats: 15,
    costPerPerson: 45,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    requiredEquipment: ['Hiking shoes', 'Water bottle', 'Snacks', 'Layers'],
    tags: ['colorado', 'sunrise', 'beginner', 'family'],
    elevation: { gain: 400, maxAlt: 3800 },
    distance: 8,
    isFeatured: false,
    isPublic: true,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
  },
  {
    title: 'Kilimanjaro Machame Route',
    description: 'Conquer Africa\'s highest peak via the scenic Machame Route – the "Whiskey Route". Diverse landscapes from rainforest to arctic summit.',
    destination: 'Mount Kilimanjaro, Tanzania',
    meetingLocation: 'Moshi Town Centre Hotel',
    difficulty: 'extreme',
    duration: '7 days',
    totalSeats: 10,
    costPerPerson: 2200,
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    requiredEquipment: ['Summit suit', 'Glacier glasses', 'Gaiters', 'High altitude gear', 'Trekking poles'],
    tags: ['kilimanjaro', 'africa', 'summit', 'bucket-list'],
    elevation: { gain: 4895, maxAlt: 5895 },
    distance: 62,
    isFeatured: true,
    isPublic: true,
    coverImage: 'https://images.unsplash.com/photo-1521150932951-303a95503ed3?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521150932951-303a95503ed3?w=800&q=80'],
  },
  {
    title: 'Swiss Alps Haute Route',
    description: 'The classic traverse from Chamonix to Zermatt through stunning Alpine scenery, glaciers, and charming mountain villages.',
    destination: 'Chamonix to Zermatt, Switzerland',
    meetingLocation: 'Chamonix Mont-Blanc Train Station',
    difficulty: 'hard',
    duration: '12 days',
    totalSeats: 8,
    costPerPerson: 1400,
    date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    requiredEquipment: ['Crampons', 'Ice axe', 'Helmet', 'Harness', 'Alpine boots'],
    tags: ['alps', 'switzerland', 'glacier', 'traverse'],
    elevation: { gain: 12000, maxAlt: 3300 },
    distance: 180,
    isFeatured: false,
    isPublic: true,
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Trek.deleteMany({});
    await Guide.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create guide profile for Priya
    const guideUser = users.find(u => u.role === 'guide');
    const guide = await Guide.create({
      user: guideUser._id,
      certifications: [{ name: 'UIAGM/IFMGA Mountain Guide', issuedBy: 'Nepal Mountaineering Association', year: 2018 }],
      yearsExperience: 12,
      languages: ['English', 'Nepali', 'Hindi', 'Tibetan'],
      specializations: ['High Altitude Trekking', 'Glacier Travel', 'Rock Climbing'],
      basePricePerDay: 120,
      location: 'Kathmandu, Nepal',
      serviceAreas: ['Nepal', 'India', 'Tibet'],
      difficultyHandled: ['easy', 'moderate', 'hard', 'extreme'],
      emergencyTraining: ['Wilderness First Responder', 'High Altitude Medicine', 'Crevasse Rescue'],
      bio: 'I have guided over 200 expeditions across the Himalayas. My passion is helping people safely experience the world\'s most breathtaking landscapes.',
      rating: 4.9,
      reviewCount: 87,
      totalBookings: 200,
      isVerified: true,
      customTripAvailable: true,
      coverPhoto: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'
      ],
    });
    console.log('Created guide profile');

    // Create treks with organizer
    const adminUser = users.find(u => u.role === 'admin');
    const trekData = sampleTreks.map(t => ({ ...t, organizer: adminUser._id }));
    const treks = await Trek.create(trekData);
    console.log(`Created ${treks.length} treks`);

    console.log('\n✅ Database seeded successfully!');
    console.log('---');
    console.log('Test accounts:');
    sampleUsers.forEach(u => console.log(`  ${u.role}: ${u.email} / password123`));
    console.log('---\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
