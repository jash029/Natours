// In-Memory Data Store simulating MongoDB for Vanguard Travel Enterprise Admin Backend
exports.JWT_SECRET = 'travel-enterprise-secret-jwt-key-2026';

exports.staffMembers = [
  {
    id: 'usr_001',
    email: 'superadmin@vanguardtravel.com',
    password: 'password123',
    name: 'Eleanor Vance',
    role: 'Super Admin',
    department: 'Executive Management',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Active',
    created_at: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr_002',
    email: 'ops@vanguardtravel.com',
    password: 'password123',
    name: 'Marcus Holloway',
    role: 'Operations Admin',
    department: 'Tour Operations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Active',
    created_at: '2025-02-15T09:30:00Z'
  },
  {
    id: 'usr_003',
    email: 'support@vanguardtravel.com',
    password: 'password123',
    name: 'Sophia Chen',
    role: 'Support Admin',
    department: 'Customer Success',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    status: 'Active',
    created_at: '2025-03-01T10:15:00Z'
  }
];

exports.tours = [
  {
    id: 'tur_101',
    title: 'Swiss Alps Luxury Alpine Expedition',
    category: 'Adventure & Luxury',
    destination: 'Interlaken & Zermatt, Switzerland',
    country: 'Switzerland',
    duration_days: 10,
    price_usd: 4850,
    discount_price_usd: 4500,
    rating: 4.95,
    reviews_count: 128,
    status: 'Active',
    featured: true,
    cover_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
    ],
    description: 'Experience breathtaking alpine views, five-star glacier resorts, private helicopter tours around Mount Matterhorn, and fondue tasting in St. Moritz.',
    itinerary: [
      { day: 1, title: 'Arrival in Zurich & Private Glacier Express Transfer', details: 'Check-in at The Dolder Grand, evening welcome dinner with panoramic lake views.' },
      { day: 2, title: 'Interlaken & Jungfraujoch Top of Europe', details: 'Private cogwheel train ascension and ice palace exploration.' },
      { day: 3, title: 'Zermatt Helicopter Tour & Matterhorn Hike', details: 'Scenic flight around Matterhorn peak followed by guided alpine trekking.' }
    ],
    availability: { max_capacity: 16, booked_slots: 12, start_date: '2026-08-15', end_date: '2026-08-25' },
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 'tur_102',
    title: 'Kyoto Imperial Heritage & Ryokan Sanctuary',
    category: 'Cultural & Wellness',
    destination: 'Kyoto & Nara, Japan',
    country: 'Japan',
    duration_days: 8,
    price_usd: 3900,
    discount_price_usd: 3650,
    rating: 4.98,
    reviews_count: 210,
    status: 'Active',
    featured: true,
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'
    ],
    description: 'Immerse in ancient tea ceremonies, private zen temple gardens, Michelin-starred Kaiseki dining, and traditional luxury Ryokan hot springs.',
    itinerary: [
      { day: 1, title: 'Kyoto Sanctuary Arrival', details: 'Check in at Four Seasons Kyoto, welcome tea ceremony by Grand Master.' },
      { day: 2, title: 'Fushimi Inari Sunset & Arashiyama Bamboo Grove', details: 'Private early morning walkthrough before public access.' }
    ],
    availability: { max_capacity: 12, booked_slots: 10, start_date: '2026-09-01', end_date: '2026-09-09' },
    created_at: '2025-11-10T12:00:00Z'
  },
  {
    id: 'tur_103',
    title: 'Amalfi Coast Yacht & cliffside Odyssey',
    category: 'Coastal & Cruise',
    destination: 'Positano, Capri & Ravello, Italy',
    country: 'Italy',
    duration_days: 7,
    price_usd: 5200,
    discount_price_usd: 4900,
    rating: 4.89,
    reviews_count: 94,
    status: 'Active',
    featured: true,
    cover_image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'
    ],
    description: 'Chartered private yachts around the Capri Grottoes, cliffside dining in Positano, wine tasting in Campania vineyards.',
    itinerary: [
      { day: 1, title: 'Naples to Positano Villa Transfer', details: 'Helicopter transfer to cliffside villa.' }
    ],
    availability: { max_capacity: 10, booked_slots: 6, start_date: '2026-08-20', end_date: '2026-08-27' },
    created_at: '2025-12-01T15:00:00Z'
  },
  {
    id: 'tur_104',
    title: 'Serengeti Migration & Zanzibar Private Island',
    category: 'Wildlife & Safari',
    destination: 'Serengeti & Zanzibar, Tanzania',
    country: 'Tanzania',
    duration_days: 12,
    price_usd: 6800,
    discount_price_usd: 6400,
    rating: 4.97,
    reviews_count: 82,
    status: 'Active',
    featured: false,
    cover_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    gallery: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'],
    description: 'Witness the Great Migration via hot air balloon safari, luxury tented camps, and unwind at private villa in Zanzibar.',
    itinerary: [{ day: 1, title: 'Kilimanjaro arrival', details: 'Bush plane to luxury tented camp.' }],
    availability: { max_capacity: 10, booked_slots: 9, start_date: '2026-09-10', end_date: '2026-09-22' },
    created_at: '2025-12-15T11:00:00Z'
  },
  {
    id: 'tur_105',
    title: 'Santorini Sunset Caldera & Oia Retreat',
    category: 'Romantic & Island',
    destination: 'Santorini & Mykonos, Greece',
    country: 'Greece',
    duration_days: 6,
    price_usd: 3200,
    discount_price_usd: 2990,
    rating: 4.88,
    reviews_count: 140,
    status: 'Active',
    featured: false,
    cover_image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    gallery: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'],
    description: 'Cliffside infinity pool suites, sunset catamaran cruises, private wine tours in volcanic vineyards.',
    itinerary: [{ day: 1, title: 'Arrival in Oia', details: 'Private check-in at Canaves Oia Suites.' }],
    availability: { max_capacity: 14, booked_slots: 14, start_date: '2026-08-10', end_date: '2026-08-16' },
    created_at: '2026-01-05T09:00:00Z'
  }
];

exports.customers = [
  {
    id: 'cus_501',
    name: 'Dr. Arthur Pendelton',
    email: 'arthur.pendelton@harvard.edu',
    phone: '+1 (617) 555-0192',
    nationality: 'United States',
    passport_number: 'US982341029',
    passport_status: 'Approved',
    visa_status: 'Approved',
    total_bookings: 4,
    total_spent: 18400,
    emergency_contact: { name: 'Clara Pendelton', relationship: 'Spouse', phone: '+1 (617) 555-0193' },
    documents: [
      { id: 'doc_1', type: 'Passport', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', status: 'Approved', uploaded_at: '2026-05-10' },
      { id: 'doc_2', type: 'Schengen Visa', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', status: 'Approved', uploaded_at: '2026-05-12' }
    ],
    status: 'Active',
    joined_date: '2024-03-15'
  },
  {
    id: 'cus_502',
    name: 'Amara Okafor',
    email: 'amara.okafor@techcorp.io',
    phone: '+44 20 7946 0912',
    nationality: 'United Kingdom',
    passport_number: 'UK772109844',
    passport_status: 'Pending',
    visa_status: 'Pending',
    total_bookings: 2,
    total_spent: 8750,
    emergency_contact: { name: 'Chidubem Okafor', relationship: 'Brother', phone: '+44 20 7946 0999' },
    documents: [
      { id: 'doc_3', type: 'Passport', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', status: 'Pending', uploaded_at: '2026-07-28' },
      { id: 'doc_4', type: 'Japan e-Visa', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', status: 'Pending', uploaded_at: '2026-07-28' }
    ],
    status: 'Active',
    joined_date: '2025-06-20'
  },
  {
    id: 'cus_503',
    name: 'Hiroshi Tanaka',
    email: 'h.tanaka@tokyogroup.jp',
    phone: '+81 3 5555 0143',
    nationality: 'Japan',
    passport_number: 'JP102938475',
    passport_status: 'Approved',
    visa_status: 'Approved',
    total_bookings: 3,
    total_spent: 12900,
    emergency_contact: { name: 'Yumi Tanaka', relationship: 'Wife', phone: '+81 3 5555 0199' },
    documents: [
      { id: 'doc_5', type: 'Passport', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', status: 'Approved', uploaded_at: '2026-02-14' }
    ],
    status: 'Active',
    joined_date: '2024-11-01'
  },
  {
    id: 'cus_504',
    name: 'Charlotte Dubois',
    email: 'charlotte.dubois@luxemag.fr',
    phone: '+33 1 42 68 55 00',
    nationality: 'France',
    passport_number: 'FR449102931',
    passport_status: 'Need Resubmission',
    visa_status: 'Pending',
    total_bookings: 1,
    total_spent: 4500,
    emergency_contact: { name: 'Antoine Dubois', relationship: 'Father', phone: '+33 1 42 68 55 01' },
    documents: [
      { id: 'doc_6', type: 'Passport', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', status: 'Need Resubmission', uploaded_at: '2026-07-25', remarks: 'Passport photo corner blurs expiration date. Please upload high resolution scan.' }
    ],
    status: 'Active',
    joined_date: '2026-01-18'
  }
];

exports.bookings = [
  {
    id: 'bk_9001',
    booking_reference: 'VG-2026-8801',
    customer_id: 'cus_501',
    customer_name: 'Dr. Arthur Pendelton',
    customer_email: 'arthur.pendelton@harvard.edu',
    tour_id: 'tur_101',
    tour_title: 'Swiss Alps Luxury Alpine Expedition',
    country: 'Switzerland',
    travellers_count: 2,
    travellers: [
      { name: 'Dr. Arthur Pendelton', age: 48, passport: 'US982341029' },
      { name: 'Clara Pendelton', age: 46, passport: 'US982341030' }
    ],
    total_amount_usd: 9000,
    payment_status: 'Paid',
    payment_method: 'American Express Centurion',
    booking_status: 'Confirmed',
    booking_date: '2026-07-20T14:30:00Z',
    travel_date: '2026-08-15',
    timeline: [
      { time: '2026-07-20T14:30:00Z', event: 'Booking created by customer' },
      { time: '2026-07-20T14:32:00Z', event: 'Payment $9,000 processed via AMEX' },
      { time: '2026-07-22T09:10:00Z', event: 'Passports verified & approved' },
      { time: '2026-07-22T10:00:00Z', event: 'Booking status set to Confirmed' }
    ]
  },
  {
    id: 'bk_9002',
    booking_reference: 'VG-2026-8802',
    customer_id: 'cus_502',
    customer_name: 'Amara Okafor',
    customer_email: 'amara.okafor@techcorp.io',
    tour_id: 'tur_102',
    tour_title: 'Kyoto Imperial Heritage & Ryokan Sanctuary',
    country: 'Japan',
    travellers_count: 2,
    travellers: [
      { name: 'Amara Okafor', age: 34, passport: 'UK772109844' },
      { name: 'David Smith', age: 36, passport: 'UK772109845' }
    ],
    total_amount_usd: 7300,
    payment_status: 'Paid',
    payment_method: 'Visa Infinite',
    booking_status: 'Pending',
    booking_date: '2026-07-28T10:15:00Z',
    travel_date: '2026-09-01',
    timeline: [
      { time: '2026-07-28T10:15:00Z', event: 'Booking created' },
      { time: '2026-07-28T10:16:00Z', event: 'Payment $7,300 authorized' },
      { time: '2026-07-28T10:20:00Z', event: 'Passport documents submitted - pending verification' }
    ]
  },
  {
    id: 'bk_9003',
    booking_reference: 'VG-2026-8803',
    customer_id: 'cus_503',
    customer_name: 'Hiroshi Tanaka',
    customer_email: 'h.tanaka@tokyogroup.jp',
    tour_id: 'tur_103',
    tour_title: 'Amalfi Coast Yacht & cliffside Odyssey',
    country: 'Italy',
    travellers_count: 2,
    travellers: [
      { name: 'Hiroshi Tanaka', age: 52, passport: 'JP102938475' },
      { name: 'Yumi Tanaka', age: 50, passport: 'JP102938476' }
    ],
    total_amount_usd: 9800,
    payment_status: 'Paid',
    payment_method: 'Mastercard Black',
    booking_status: 'Confirmed',
    booking_date: '2026-07-15T08:00:00Z',
    travel_date: '2026-08-20',
    timeline: [
      { time: '2026-07-15T08:00:00Z', event: 'Booking created' },
      { time: '2026-07-15T08:05:00Z', event: 'Payment $9,800 confirmed' },
      { time: '2026-07-16T11:00:00Z', event: 'Passports verified by Support Admin' }
    ]
  },
  {
    id: 'bk_9004',
    booking_reference: 'VG-2026-8804',
    customer_id: 'cus_504',
    customer_name: 'Charlotte Dubois',
    customer_email: 'charlotte.dubois@luxemag.fr',
    tour_id: 'tur_101',
    tour_title: 'Swiss Alps Luxury Alpine Expedition',
    country: 'Switzerland',
    travellers_count: 1,
    travellers: [
      { name: 'Charlotte Dubois', age: 29, passport: 'FR449102931' }
    ],
    total_amount_usd: 4500,
    payment_status: 'Paid',
    payment_method: 'Wire Transfer',
    booking_status: 'Pending Verification',
    booking_date: '2026-07-25T16:20:00Z',
    travel_date: '2026-08-15',
    timeline: [
      { time: '2026-07-25T16:20:00Z', event: 'Booking requested' },
      { time: '2026-07-26T12:00:00Z', event: 'Passport rejected due to blurry expiration date' }
    ]
  }
];

exports.verifications = [
  {
    id: 'ver_301',
    customer_id: 'cus_502',
    customer_name: 'Amara Okafor',
    document_type: 'Passport',
    document_number: 'UK772109844',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    status: 'Pending',
    submitted_at: '2026-07-28T10:20:00Z',
    verified_by: null,
    verified_at: null,
    remarks: ''
  },
  {
    id: 'ver_302',
    customer_id: 'cus_504',
    customer_name: 'Charlotte Dubois',
    document_type: 'Passport',
    document_number: 'FR449102931',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    status: 'Need Resubmission',
    submitted_at: '2026-07-25T16:20:00Z',
    verified_by: 'Sophia Chen',
    verified_at: '2026-07-26T12:00:00Z',
    remarks: 'Passport photo corner blurs expiration date. Please upload high resolution scan.'
  },
  {
    id: 'ver_303',
    customer_id: 'cus_501',
    customer_name: 'Dr. Arthur Pendelton',
    document_type: 'Passport',
    document_number: 'US982341029',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    status: 'Approved',
    submitted_at: '2026-07-21T09:00:00Z',
    verified_by: 'Sophia Chen',
    verified_at: '2026-07-22T09:10:00Z',
    remarks: 'Valid US passport expiring 2031.'
  }
];

exports.notifications = [
  {
    id: 'notif_1',
    type: 'verification',
    title: 'New Passport Verification Request',
    message: 'Amara Okafor uploaded UK Passport UK772109844 for tour VG-2026-8802.',
    read: false,
    created_at: '2026-07-28T10:20:00Z'
  },
  {
    id: 'notif_2',
    type: 'booking',
    title: 'New High Value Booking ($9,800)',
    message: 'Hiroshi Tanaka booked Amalfi Coast Yacht Odyssey for 2 guests.',
    read: false,
    created_at: '2026-07-15T08:00:00Z'
  },
  {
    id: 'notif_3',
    type: 'system',
    title: 'System Security Audit Completed',
    message: 'Automated RBAC & SSL session audit completed with zero vulnerabilities.',
    read: true,
    created_at: '2026-07-10T12:00:00Z'
  }
];

exports.companySettings = {
  company_name: 'Vanguard Luxury Travel Group Enterprise',
  logo_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200',
  support_email: 'enterprise-support@vanguardtravel.com',
  phone_number: '+1 (800) 555-8274',
  social_links: {
    linkedin: 'https://linkedin.com/company/vanguardtravel',
    twitter: 'https://twitter.com/vanguardtravel',
    instagram: 'https://instagram.com/vanguardtravel'
  },
  currency: 'USD ($)',
  timezone: 'UTC - EST (Eastern Standard Time)'
};

// Helper methods to modify store arrays safely
exports.setTours= function (newTours) {
  tours = newTours;
}

exports.setCompanySettings= function (newSettings) {
  companySettings = newSettings;
}
