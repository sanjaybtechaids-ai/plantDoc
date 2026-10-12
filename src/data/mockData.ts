import {
  Plant,
  Diagnosis,
  MonitoringEntry,
  AlertItem,
  ChatMessage,
  Product,
  UserSettings
} from '@/types';

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-tomato-01',
    name: 'Roma Tomato',
    species: 'Solanum lycopersicum',
    type: 'Vegetable / Solanaceae',
    plantingDate: '2026-08-15',
    location: 'South Greenhouse & Balcony',
    potSize: '12-inch Terracotta',
    sunlight: 'Full Sun',
    wateringFrequency: 'Every 2 days (Morning)',
    soilType: 'Loamy compost mix with perlite',
    notes: 'Pruned lower foliage last week. Suspected early blight lesions observed on 3 lower leaves.',
    image: '/images/plants/tomato-blight.jpg',
    healthScore: 72,
    status: 'attention',
    lastScanDate: 'Today, 09:30 AM',
    streakDays: 14,
    currentIssue: 'Early Blight (Alternaria solani)'
  },
  {
    id: 'plant-monstera-02',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    type: 'Indoor Foliage',
    plantingDate: '2026-03-10',
    location: 'Living Room West Window',
    potSize: '14-inch Ceramic Planter',
    sunlight: 'Bright Indirect',
    wateringFrequency: 'Weekly (when top 2" dry)',
    soilType: 'Chunky aroid mix (orchid bark, perlite, peat)',
    notes: 'Produces new fenestrated leaves monthly. Strong root system, recently wiped down.',
    image: '/images/plants/monstera-healthy.jpg',
    healthScore: 96,
    status: 'healthy',
    lastScanDate: 'Yesterday',
    streakDays: 28,
  },
  {
    id: 'plant-rose-03',
    name: 'English Garden Rose',
    species: 'Rosa gallica',
    type: 'Flowering Shrub',
    plantingDate: '2026-05-20',
    location: 'Front Garden Bed',
    potSize: 'In-ground garden bed',
    sunlight: 'Full Sun',
    wateringFrequency: 'Twice weekly at base',
    soilType: 'Rich clay loam with bone meal',
    notes: 'Severe white powdery fungal layer spreading on young shoots and upper leaf surfaces.',
    image: '/images/plants/rose-mildew.jpg',
    healthScore: 48,
    status: 'critical',
    lastScanDate: '2 days ago',
    streakDays: 6,
    currentIssue: 'Powdery Mildew (Podosphaera pannosa)'
  },
  {
    id: 'plant-pepper-04',
    name: 'Sweet Bell Pepper',
    species: 'Capsicum annuum',
    type: 'Vegetable',
    plantingDate: '2026-08-01',
    location: 'Rooftop Raised Bed',
    potSize: '10-gallon fabric pot',
    sunlight: 'Full Sun',
    wateringFrequency: 'Every 2 days',
    soilType: 'Organic compost blend',
    notes: 'Flowering vigorously. 4 fruits set. No pests observed.',
    image: '/images/plants/monstera-healthy.jpg',
    healthScore: 88,
    status: 'healthy',
    lastScanDate: '3 days ago',
    streakDays: 12,
  },
  {
    id: 'plant-citrus-05',
    name: 'Meyer Dwarf Lemon',
    species: 'Citrus x meyeri',
    type: 'Fruit Tree',
    plantingDate: '2026-02-14',
    location: 'Sunny Patio Deck',
    potSize: '16-inch glazed pot',
    sunlight: 'Full Sun',
    wateringFrequency: 'Every 3 days',
    soilType: 'Citrus well-draining sandy loam',
    notes: 'Curled young leaves detected with serpentine silvery trails.',
    image: '/images/plants/tomato-blight.jpg',
    healthScore: 78,
    status: 'attention',
    lastScanDate: '4 days ago',
    streakDays: 9,
    currentIssue: 'Citrus Leafminer Infestation'
  },
  {
    id: 'plant-peacelily-06',
    name: 'Symphony Peace Lily',
    species: 'Spathiphyllum wallisii',
    type: 'Indoor Foliage',
    plantingDate: '2026-06-12',
    location: 'Bedroom Table',
    potSize: '8-inch self-watering pot',
    sunlight: 'Low Light',
    wateringFrequency: 'Weekly',
    soilType: 'Standard potting soil with coco coir',
    notes: 'Lush dark green leaves, flower spathe opening.',
    image: '/images/plants/monstera-healthy.jpg',
    healthScore: 92,
    status: 'healthy',
    lastScanDate: '5 days ago',
    streakDays: 18,
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Root & Leaf Cold-Pressed Neem Oil (473ml)',
    category: 'Organic Pesticide',
    rating: 4.8,
    reviewsCount: 1420,
    price: 299,
    originalPrice: 399,
    whyRecommended: 'Natural botanical fungicide & insecticide. Disrupts fungal spore germination and repels chewing insects.',
    demoUrl: 'https://example.com/products/organic-neem-oil',
    image: '/images/products/neem-oil.jpg',
    inStock: true
  },
  {
    id: 'prod-02',
    name: 'Organic Harvest Bio-Active Compost & NPK (20kg)',
    category: 'Fertilizer',
    rating: 4.9,
    reviewsCount: 890,
    price: 449,
    originalPrice: 599,
    whyRecommended: 'Rich in organic carbon, mycorrhizae, and balanced micronutrients to rebuild root immune defenses.',
    demoUrl: 'https://example.com/products/bio-fertilizer',
    image: '/images/products/organic-fertilizer.jpg',
    inStock: true
  },
  {
    id: 'prod-03',
    name: 'Copper Shield Bio-Fungicide Wettable Powder (250g)',
    category: 'Fungicide',
    rating: 4.6,
    reviewsCount: 610,
    price: 380,
    originalPrice: 450,
    whyRecommended: 'Broad spectrum preventative copper treatment for early blight, late blight, and anthracnose.',
    demoUrl: 'https://example.com/products/copper-fungicide',
    image: '/images/products/neem-oil.jpg',
    inStock: true
  },
  {
    id: 'prod-04',
    name: 'Precision Bypass Pruning Shears (SK-5 Steel)',
    category: 'Equipment',
    rating: 4.9,
    reviewsCount: 2310,
    price: 349,
    originalPrice: 499,
    whyRecommended: 'Essential for sanitizing and removing infected diseased foliage cleanly without tearing plant stems.',
    demoUrl: 'https://example.com/products/pruning-shears',
    image: '/images/products/organic-fertilizer.jpg',
    inStock: true
  },
  {
    id: 'prod-05',
    name: 'Trichoderma Harzianum Bio-Inoculant Powder (500g)',
    category: 'Soil & Care',
    rating: 4.7,
    reviewsCount: 430,
    price: 320,
    originalPrice: 420,
    whyRecommended: 'Beneficial antagonistic fungus that outcompetes pathogenic Alternaria and Fusarium in the root rhizosphere.',
    demoUrl: 'https://example.com/products/trichoderma-bio-fungus',
    image: '/images/products/neem-oil.jpg',
    inStock: true
  },
  {
    id: 'prod-06',
    name: 'Plant Doctor 3-in-1 Soil pH, Moisture & Lux Meter',
    category: 'Equipment',
    rating: 4.5,
    reviewsCount: 780,
    price: 520,
    originalPrice: 699,
    whyRecommended: 'Monitors soil moisture levels to prevent waterlogged conditions that encourage fungal leaf blight.',
    demoUrl: 'https://example.com/products/soil-meter-sensor',
    image: '/images/products/organic-fertilizer.jpg',
    inStock: true
  }
];

export const TOMATO_DIAGNOSIS: Diagnosis = {
  id: 'diag-tomato-early-blight-01',
  plantId: 'plant-tomato-01',
  plantName: 'Roma Tomato',
  date: 'Today, 09:30 AM',
  imageUrl: '/images/plants/tomato-blight.jpg',
  plantIdentified: 'Tomato (Solanum lycopersicum)',
  identificationConfidence: 94,
  healthScore: 72,
  disease: {
    id: 'disease-early-blight',
    name: 'Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    confidence: 89,
    description: 'A prevalent fungal disease caused by Alternaria solani that starts on older lower foliage before progressing upward, creating necrotic target-shaped spots.',
    symptoms: [
      'Circular brown spots with concentric ring "target board" pattern',
      'Yellow chlorotic halos surrounding necrotic leaf lesions',
      'Lower foliage and mature leaves affected first',
      'Stem cankers and accelerated leaf senescence if untreated'
    ],
    causes: [
      'Prolonged leaf wetness exceeding 6 hours from overhead watering',
      'High ambient relative humidity (>80%) paired with warm temperatures (24-29°C)',
      'Soil splash transporting fungal spores onto lower leaves',
      'Poor canopy air circulation and dense vegetative growth'
    ],
    prevention: [
      'Drip irrigation or bottom watering exclusively at the soil base',
      'Mulch heavily around the stem base to eliminate soil splash back',
      'Prune lower 10-12 inches of suckers and foliage for air movement',
      'Rotate solanaceous crops on a 3-year minimum cycle'
    ],
    affectedPlantTypes: ['Tomato', 'Potato', 'Eggplant', 'Pepper']
  },
  treatment: {
    immediateActions: [
      'Prune and sanitize: Snip off all leaves with circular spots using clean shears dipped in 70% alcohol.',
      'Immediately isolate cuttings in a sealed bag; do NOT compost infected plant debris.',
      'Transition to bottom or soil-level drip watering; ensure leaves remain completely dry.',
      'Increase spacing and ventilate greenhouse/balcony to lower ambient humidity.'
    ],
    naturalTreatments: [
      {
        id: 'nat-01',
        name: 'Cold-Pressed Organic Neem Oil Spray (0.5% Solution)',
        purpose: 'Foliar bio-fungicide barrier to prevent spore germination on healthy leaves.',
        howToUse: 'Mix 5ml pure neem oil + 2ml mild organic dish soap per 1 liter of lukewarm water. Spray tops and undersides of leaves early in the morning or at dusk.',
        frequency: 'Every 5 to 7 days until symptoms subside, then bi-weekly.',
        safetyNote: 'Do not spray under harsh direct afternoon sunlight to prevent leaf scorch.',
        productLink: 'https://example.com/products/organic-neem-oil',
        price: 299,
        image: '/images/products/neem-oil.jpg'
      },
      {
        id: 'nat-02',
        name: 'Trichoderma Harzianum Bio-Fungicide Drench',
        purpose: 'Beneficial microbial shield that outcompetes fungal pathogens in rootzone.',
        howToUse: 'Dissolve 10g bio-inoculant in 5 liters of water and drench the soil around roots.',
        frequency: 'Apply once every 14 days.',
        safetyNote: 'Biological agent; non-toxic to pollinators, pets, and beneficial garden earthworms.',
        productLink: 'https://example.com/products/trichoderma-bio-fungus',
        price: 320,
        image: '/images/products/neem-oil.jpg'
      },
      {
        id: 'nat-03',
        name: 'Baking Soda & Potassium Bicarbonate Spray',
        purpose: 'Alkalizes leaf surface pH to inhibit fungal spore development.',
        howToUse: 'Mix 1 teaspoon potassium bicarbonate + 1 drop horticultural oil in 1 liter of water.',
        frequency: 'Once weekly following rain or heavy humidity.',
        safetyNote: 'Test spray on one single leaf first to verify tolerance before full application.',
        productLink: 'https://example.com/products/bio-fertilizer',
        price: 180
      }
    ],
    chemicalTreatments: [
      {
        id: 'chem-01',
        name: 'Copper Octanoate / Fixed Copper Liquid Fungicide',
        activeIngredient: 'Copper Octanoate (Copper Soap) 10.0%',
        purpose: 'Contact preventative fungicide that binds to fungal protein enzymes.',
        application: 'Dilute 10ml in 1L clean water. Thoroughly coat foliage before forecast rain periods.',
        precautions: 'Wear protective eye goggles and nitrile gloves. Observe 24-hour pre-harvest interval before consuming ripe tomatoes.',
        productLink: 'https://example.com/products/copper-fungicide',
        price: 380
      },
      {
        id: 'chem-02',
        name: 'Chlorothalonil 75% WP Broad Spectrum Fungicide',
        activeIngredient: 'Chlorothalonil 75% Wettable Powder',
        purpose: 'Multi-site non-systemic preventative fungicide with strong rainfastness.',
        application: 'Foliar mist at 1.5g per liter. Avoid applying during active bloom to protect bees.',
        precautions: 'Do not apply more than 3 times per season. Always follow local agricultural environmental guidance.',
        productLink: 'https://example.com/products/copper-fungicide',
        price: 420
      }
    ]
  },
  fertilizer: {
    nutrientLevels: {
      nitrogen: 'deficient',
      phosphorus: 'adequate',
      potassium: 'deficient',
      micronutrients: 'balanced'
    },
    recommendedFertilizer: {
      name: 'NPK 10-10-10 Balanced Slow-Release Organic Feed',
      type: 'Balanced Soluble & Organic Blend',
      npk: '10-10-10 + Trace Calcium & Magnesium',
      purpose: 'Re-establishes cellular membrane strength and potassium tissue turgor to fight off fungal cell penetration.',
      applicationRate: '1 tablespoon per gallon of soil every 14 days during vegetative growth.',
      productLink: 'https://example.com/products/bio-fertilizer',
      price: 449,
      image: '/images/products/organic-fertilizer.jpg'
    }
  },
  products: MOCK_PRODUCTS.slice(0, 4),
  affectedAreas: [
    { id: 'area-1', x: 55, y: 26, radius: 10, severity: 'severe', label: 'Primary concentric ring lesion' },
    { id: 'area-2', x: 63, y: 34, radius: 8, severity: 'moderate', label: 'Secondary fungal necrosis' },
    { id: 'area-3', x: 45, y: 44, radius: 9, severity: 'severe', label: 'Spreading blight target lesion' },
    { id: 'area-4', x: 35, y: 55, radius: 7, severity: 'mild', label: 'Early chlorotic yellow halo' },
    { id: 'area-5', x: 48, y: 58, radius: 8, severity: 'moderate', label: 'Leaf margin necrosis' }
  ],
  userNotes: 'Noticed first signs 3 days ago after heavy rainfall and high humidity.',
  symptomsObserved: 'Leaves have developed concentric brown spots with yellow halos during the last 3 days.'
};

export const TOMATO_MONITORING_HISTORY: MonitoringEntry[] = [
  {
    id: 'mon-01',
    plantId: 'plant-tomato-01',
    dayLabel: 'Day 1',
    date: 'Oct 7, 2026',
    imageUrl: '/images/plants/tomato-blight.jpg',
    healthScore: 54,
    previousScore: 54,
    change: 0,
    status: 'declining',
    symptoms: ['Spreading dark necrotic spots', 'Yellowing of 5 lower leaves', 'Early stem flecks'],
    treatmentUsed: 'Initial diagnosis recorded. Infected bottom 3 leaves pruned.',
    aiNotes: 'Severe fungal spore coverage detected. High humidity risk flagged.'
  },
  {
    id: 'mon-02',
    plantId: 'plant-tomato-01',
    dayLabel: 'Day 2',
    date: 'Oct 8, 2026',
    imageUrl: '/images/plants/tomato-blight.jpg',
    healthScore: 59,
    previousScore: 54,
    change: 5,
    status: 'improving',
    symptoms: ['Remaining spots stabilized', 'Yellow halos less diffuse'],
    treatmentUsed: 'Applied cold-pressed neem oil 0.5% foliar spray at dawn.',
    aiNotes: 'Removal of bottom foliage improved lower canopy airflow.'
  },
  {
    id: 'mon-03',
    plantId: 'plant-tomato-01',
    dayLabel: 'Day 3',
    date: 'Oct 9, 2026',
    imageUrl: '/images/plants/tomato-blight.jpg',
    healthScore: 61,
    previousScore: 59,
    change: 2,
    status: 'improving',
    symptoms: ['No new lesions on upper new shoots', 'Leaf margins drying out'],
    treatmentUsed: 'Added straw mulch around soil base to suppress spore splash.',
    aiNotes: 'Spore expansion rate slowed by 68%. Soil moisture optimal.'
  },
  {
    id: 'mon-04',
    plantId: 'plant-tomato-01',
    dayLabel: 'Day 4',
    date: 'Oct 10, 2026',
    imageUrl: '/images/plants/tomato-blight.jpg',
    healthScore: 68,
    previousScore: 61,
    change: 7,
    status: 'improving',
    symptoms: ['Healthy vigorous green top growth', 'Old lesions dried into crust'],
    treatmentUsed: 'Soil drench with Trichoderma Harzianum + balanced organic NPK.',
    aiNotes: 'Strong cellular turgor recovery. Plant immune response positive.'
  },
  {
    id: 'mon-05',
    plantId: 'plant-tomato-01',
    dayLabel: 'Day 5 (Today)',
    date: 'Oct 11, 2026',
    imageUrl: '/images/plants/tomato-blight.jpg',
    healthScore: 74,
    previousScore: 68,
    change: 6,
    status: 'improving',
    symptoms: ['Lesions completely arrested', 'Upper foliage completely disease-free'],
    treatmentUsed: 'Continuous daily photo tracking + scheduled second neem maintenance spray.',
    aiNotes: 'Your plant is showing remarkable recovery (+20 points over 5 days). Continue dry foliage management.'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-01',
    plantId: 'plant-tomato-01',
    plantName: 'Roma Tomato',
    type: 'improvement',
    title: 'Health score improved by +6 points',
    message: 'Your Roma Tomato health score climbed from 68 to 74 today. Early blight lesions have stabilized.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/monitoring'
  },
  {
    id: 'alert-02',
    plantId: 'plant-rose-03',
    plantName: 'English Garden Rose',
    type: 'critical',
    title: 'Severe fungal risk on Rose bush',
    message: 'Powdery mildew coverage has spread over 40% of upper shoot foliage. Immediate sulfur/fungicide action recommended.',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/plants/plant-rose-03'
  },
  {
    id: 'alert-03',
    plantId: 'plant-tomato-01',
    plantName: 'Roma Tomato',
    type: 'reminder',
    title: 'Daily photo check-in scheduled',
    message: 'Time for today’s angle-matched photo check-in to verify early blight recovery trend.',
    timestamp: 'Today, 08:00 AM',
    read: false,
    actionUrl: '/monitoring'
  },
  {
    id: 'alert-04',
    plantId: 'plant-citrus-05',
    plantName: 'Meyer Dwarf Lemon',
    type: 'warning',
    title: 'Nutrient check: Nitrogen & Zinc',
    message: 'Leafminer activity detected on fresh flushes. Apply yellow sticky traps and horticultural oil.',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/plants/plant-citrus-05'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'assistant',
    text: "Hello! I'm Plant Doctor AI, your personal botanical health specialist. 🌿\n\nYou can upload or capture a photo of any plant leaf, ask about symptoms, or consult me on pest management and fertilizer schedules. How can I help your garden today?",
    timestamp: '10:00 AM',
    suggestedActions: [
      'My tomato leaves have brown spots',
      'How often should I spray neem oil?',
      'Identify powdery mildew on roses',
      'What fertilizer does my plant need?'
    ]
  },
  {
    id: 'msg-02',
    sender: 'user',
    text: 'My tomato plant lower leaves are turning yellow with dark target-like concentric spots. Is it fungal?',
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-03',
    sender: 'assistant',
    text: "Based on the description of lower foliage developing dark circular lesions with concentric rings and yellow halos, your tomato plant is exhibiting classic symptoms of **Early Blight (Alternaria solani)**.\n\nHere is a structured assessment based on your symptoms:",
    timestamp: '10:03 AM',
    diagnosisCard: {
      diseaseName: 'Early Blight (Alternaria solani)',
      confidence: 89,
      severity: 'moderate',
      symptoms: [
        'Brown concentric ring "target board" spots',
        'Yellow chlorotic halos around lesions',
        'Starting on oldest lower leaves'
      ],
      immediateActions: [
        'Prune and discard infected lower leaves immediately (do not compost).',
        'Water solely at soil level to prevent moisture on leaves.',
        'Increase air circulation between plants.'
      ],
      naturalTreatment: 'Spray 0.5% cold-pressed neem oil emulsion every 5-7 days at dawn.',
      chemicalTreatment: 'Apply copper-based fungicide spray (Copper Octanoate) if weather remains wet.',
      nextCheck: 'Upload a clear follow-up photo in 24 hours to monitor lesion arrest.'
    },
    suggestedActions: [
      'Open Full Scanner for this photo',
      'Show recommended neem oil products',
      'How do I prune safely?'
    ]
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Dr. Sarah Lin',
  email: 'sarah.lin@plantdoctor.ai',
  notificationsEnabled: true,
  dailyReminder: true,
  reminderTime: '08:30',
  units: 'metric',
  aiSensitivity: 'standard',
  organicFirst: true,
  cameraResolution: '1080p',
  autoSaveScans: true
};
