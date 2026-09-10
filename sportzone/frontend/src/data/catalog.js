export const ALL_CATEGORIES = [
  { id: 1, name: 'Running', slug: 'running', icon: 'directions_run', itemCount: 342 },
  { id: 2, name: 'Football', slug: 'football', icon: 'sports_soccer', itemCount: 218 },
  { id: 3, name: 'Cricket', slug: 'cricket', icon: 'sports_cricket', itemCount: 164 },
  { id: 4, name: 'Badminton', slug: 'badminton', icon: 'sports_tennis', itemCount: 145 },
  { id: 5, name: 'Basketball', slug: 'basketball', icon: 'sports_basketball', itemCount: 129 },
  { id: 6, name: 'Tennis', slug: 'tennis', icon: 'sports_baseball', itemCount: 108 },
  { id: 7, name: 'Gym & Fitness', slug: 'gym-fitness', icon: 'fitness_center', itemCount: 195 },
  { id: 8, name: 'Cycling', slug: 'cycling', icon: 'pedal_bike', itemCount: 92 },
];

export const ALL_PRODUCTS = [
  {
    id: 1,
    title: 'CarbonVolt Strider Road Racing Shoes',
    slug: 'carbonvolt-strider-road-racing-shoes',
    sku: 'SZ-CV-88219',
    description:
      'Engineered for elite marathoners and road racers seeking maximum velocity and explosive energy return. Features a full-length 3K curved carbon fiber propulsion plate sandwiched between twin layers of ultra-resilient AeroFoam+ cushioning.',
    price: 199.99,
    msrp: 220.00,
    discountPercentage: 9,
    brand: 'Apex Athletic',
    categorySlug: 'running',
    categoryName: 'Running',
    inStock: true,
    rating: 4.95,
    reviewCount: 142,
    weightGrams: 215,
    midsoleTech: 'AeroFoam+ Max',
    propulsionUnit: '100% 3K Carbon',
    dropHeightMm: 8.0,
    primaryImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
    images: [
      {
        id: 1,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
        angleLabel: 'Lateral',
      },
      {
        id: 2,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDaqi-yAQlSfg6TLXnEBvTl_iv8IZDQgtEbtbghzsCWEzcsH7nffgTPakQmPxKQHaVTVEB0Xiah0S5NSoayRKDC6yHh8jxkoDe9gFpFVzJiwSphj_825to1Pt_-FAUBF-w0ogS6MdTH4uF8v4xWis4cEFsOOXS_DCwQdH-Rj7tL-jyi-_3EIUI6qJjgsVKZJPGKfZy9r0iCmZw6CKKYKlyEzFoWSMSCswk2IYAupzMjWTL-2b6Fvt7_',
        angleLabel: 'Medial',
      },
      {
        id: 3,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_ez5fMBgxDxnyNudMrAUkz-WVl75AV7uZyx0qm6Ty7hoUbRAJc07ZmmizKXODdcxCrUyGu3veaWoMXtwZkeYk9el81ICMj0zbOOB6WakDr-RkLGGGN25cuIru333YxN-f3FaNBeA01qjbDn-yhHekuRUe7iIMzHOMIcAp2Ym7gdn74ND2o0MWfcdnhaonQdufbLNlAmy6_vJiRUXyt6ZOIzWEgzdQiyapLhGiQBHptNcyj7tNRna',
        angleLabel: 'Toe-Box',
      },
    ],
    variants: [
      { id: 101, size: '7', color: 'Volt Neon / Obsidian', stockQuantity: 15 },
      { id: 102, size: '7.5', color: 'Volt Neon / Obsidian', stockQuantity: 12 },
      { id: 103, size: '8', color: 'Volt Neon / Obsidian', stockQuantity: 20 },
      { id: 104, size: '8.5', color: 'Volt Neon / Obsidian', stockQuantity: 18 },
      { id: 105, size: '9', color: 'Volt Neon / Obsidian', stockQuantity: 25 },
      { id: 106, size: '9.5', color: 'Volt Neon / Obsidian', stockQuantity: 14 },
      { id: 107, size: '10', color: 'Volt Neon / Obsidian', stockQuantity: 10 },
      { id: 108, size: '11', color: 'Volt Neon / Obsidian', stockQuantity: 8 },
    ],
  },
  {
    id: 2,
    title: 'Pro Match Thermal Bonded Football Size 5',
    slug: 'pro-match-thermal-bonded-football-size-5',
    sku: 'SZ-FB-55420',
    description:
      'FIFA Quality Pro certified match football. Advanced thermal bonding eliminates water absorption, ensuring true flight aerodynamic trajectory and balanced tactile touch in high-velocity match play.',
    price: 79.99,
    msrp: 99.99,
    discountPercentage: 20,
    brand: 'Apex Athletic',
    categorySlug: 'football',
    categoryName: 'Football',
    inStock: true,
    rating: 4.88,
    reviewCount: 94,
    weightGrams: 430,
    midsoleTech: 'Thermal Polyurethane',
    propulsionUnit: 'Butyl Air-Lock Bladder',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9',
    images: [
      {
        id: 201,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9',
        angleLabel: 'Main Match View',
      },
    ],
    variants: [
      { id: 201, size: 'Size 5 (Official)', color: 'Match White/Volt', stockQuantity: 35 },
      { id: 202, size: 'Size 4 (Training)', color: 'Match White/Volt', stockQuantity: 20 },
    ],
  },
  {
    id: 3,
    title: 'Masterstroke English Willow Pro Grade 1 Cricket Bat',
    slug: 'masterstroke-english-willow-cricket-bat',
    sku: 'SZ-CR-99101',
    description:
      'Handcrafted from unbleached Grade 1 English Willow. Huge 40mm contoured edges, massive mid-blade sweet spot, and semi-oval cane handle tuned for lightning pickup and boundary-clearing stroke play.',
    price: 319.99,
    msrp: 360.00,
    discountPercentage: 11,
    brand: 'Apex Athletic',
    categorySlug: 'cricket',
    categoryName: 'Cricket',
    inStock: true,
    rating: 4.96,
    reviewCount: 78,
    weightGrams: 1180,
    midsoleTech: 'Grade 1 English Willow',
    propulsionUnit: '12-Piece Cane Handle',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 301,
        imageUrl:
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Willow Profile',
      },
    ],
    variants: [
      { id: 301, size: 'Short Handle (SH)', color: 'Natural Willow / Volt Grip', stockQuantity: 18 },
      { id: 302, size: 'Long Handle (LH)', color: 'Natural Willow / Volt Grip', stockQuantity: 10 },
    ],
  },
  {
    id: 4,
    title: 'Apex Red Crown 4-Piece Leather Match Cricket Ball',
    slug: 'apex-red-crown-leather-cricket-ball',
    sku: 'SZ-CR-99205',
    description:
      'Tournament standard 4-piece leather match ball. Wax finished alum-tanned steer hide, pure Portuguese cork core, and 80 hand-stitched seams ensuring pronounced swing and shape retention over 80+ overs.',
    price: 29.99,
    msrp: 39.99,
    discountPercentage: 25,
    brand: 'Apex Athletic',
    categorySlug: 'cricket',
    categoryName: 'Cricket',
    inStock: true,
    rating: 4.91,
    reviewCount: 52,
    weightGrams: 156,
    midsoleTech: 'Portuguese Cork Center',
    propulsionUnit: '4-Piece Alum Tanned',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 401,
        imageUrl:
          'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Seam Telemetry',
      },
    ],
    variants: [
      { id: 401, size: 'Standard (156g)', color: 'Match Red', stockQuantity: 45 },
      { id: 402, size: 'Standard (156g)', color: 'Day-Night White', stockQuantity: 30 },
    ],
  },
  {
    id: 5,
    title: 'Apex VoltStrike Carbon 900 Pro Badminton Racket',
    slug: 'apex-voltstrike-carbon-900-badminton-racket',
    sku: 'SZ-BD-77101',
    description:
      'Ultra-light 4U (83g) High-Modulus Carbon Fiber Badminton Racket. Head-heavy balance and Aero-Hexagonal frame cut air resistance by 18%, accelerating smash velocities up to 410 km/h with pin-point shuttle placement.',
    price: 139.99,
    msrp: 169.99,
    discountPercentage: 17,
    brand: 'Apex Athletic',
    categorySlug: 'badminton',
    categoryName: 'Badminton',
    inStock: true,
    rating: 4.94,
    reviewCount: 86,
    weightGrams: 83,
    midsoleTech: 'High Modulus 40T Carbon',
    propulsionUnit: 'Aero-Hex Sonic Frame',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 501,
        imageUrl:
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Isometric Head View',
      },
    ],
    variants: [
      { id: 501, size: '4U (G5)', color: 'Volt Lime / Matte Black', stockQuantity: 25 },
      { id: 502, size: '3U (G4)', color: 'Electric Cyan / Obsidian', stockQuantity: 15 },
    ],
  },
  {
    id: 6,
    title: 'Apex AeroFlight Feather Shuttlecocks (Tube of 12)',
    slug: 'apex-aeroflight-feather-shuttlecocks',
    sku: 'SZ-BD-77202',
    description:
      'Tournament grade goose feather shuttlecocks with solid natural cork base. Tested for rotational trajectory and speed 77 calibration, delivering consistent parabolic drop and resistance to feather fraying.',
    price: 32.99,
    msrp: 42.00,
    discountPercentage: 21,
    brand: 'Apex Athletic',
    categorySlug: 'badminton',
    categoryName: 'Badminton',
    inStock: true,
    rating: 4.89,
    reviewCount: 64,
    weightGrams: 60,
    midsoleTech: 'Tier-1 Goose Feather',
    propulsionUnit: 'Natural Cork Dual Base',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 601,
        imageUrl:
          'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Feather Precision',
      },
    ],
    variants: [
      { id: 601, size: 'Speed 77 (Standard)', color: 'Championship White', stockQuantity: 50 },
      { id: 602, size: 'Speed 78 (Fast)', color: 'Championship White', stockQuantity: 30 },
    ],
  },
  {
    id: 7,
    title: 'CourtVelocity HyperGrip Basketball Shoes',
    slug: 'courtvelocity-hypergrip-basketball-shoes',
    sku: 'SZ-BB-33201',
    description:
      'High-top explosive court shoes featuring multi-directional herringbone traction and dual-density responsiveness for aggressive cuts, rebounds, and ankle stabilization.',
    price: 159.99,
    msrp: 180.00,
    discountPercentage: 11,
    brand: 'Apex Athletic',
    categorySlug: 'basketball',
    categoryName: 'Basketball',
    inStock: true,
    rating: 4.84,
    reviewCount: 81,
    weightGrams: 380,
    midsoleTech: 'HyperBounce Foam',
    propulsionUnit: 'Carbon Ankle Plate',
    dropHeightMm: 10.0,
    primaryImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdN4TwH3ZN4LFzRVxJt2v6JZvc9jWnbiIPvCI8BZ1eFBA61zg8QKa4csYdekFc95WzkMj7SdFhDRdYnRBih3eMwYPXUh6AupdrGxQD9-aINGiR2T80GPhVb_aSvGCgHGa89R6muY-bxE0UngYZnHS1e27eN_F66mfAE31CY_P9uOPA-Szk8qanUbtwiCmjmwSzmiU9n07Ay6CZLb7TN4rLrUPh0dXG_bZE8Ldh7u92D9Zy3jbFewPq',
    images: [
      {
        id: 701,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDdN4TwH3ZN4LFzRVxJt2v6JZvc9jWnbiIPvCI8BZ1eFBA61zg8QKa4csYdekFc95WzkMj7SdFhDRdYnRBih3eMwYPXUh6AupdrGxQD9-aINGiR2T80GPhVb_aSvGCgHGa89R6muY-bxE0UngYZnHS1e27eN_F66mfAE31CY_P9uOPA-Szk8qanUbtwiCmjmwSzmiU9n07Ay6CZLb7TN4rLrUPh0dXG_bZE8Ldh7u92D9Zy3jbFewPq',
        angleLabel: 'High-Top Lateral',
      },
    ],
    variants: [
      { id: 701, size: '8', color: 'Volt / Cyan Flash', stockQuantity: 14 },
      { id: 702, size: '9', color: 'Volt / Cyan Flash', stockQuantity: 20 },
      { id: 703, size: '10', color: 'Volt / Cyan Flash', stockQuantity: 16 },
      { id: 704, size: '11', color: 'Volt / Cyan Flash', stockQuantity: 10 },
    ],
  },
  {
    id: 8,
    title: 'Apex GripForce Official Game Basketball Size 7',
    slug: 'apex-gripforce-game-basketball-size-7',
    sku: 'SZ-BB-33215',
    description:
      'FIBA approved deep-channel composite leather game basketball. Micro-pebble surface texture ensures optimal moisture dissipation and fingertip touch across indoor hardwood and outdoor courts.',
    price: 54.99,
    msrp: 69.99,
    discountPercentage: 21,
    brand: 'Apex Athletic',
    categorySlug: 'basketball',
    categoryName: 'Basketball',
    inStock: true,
    rating: 4.87,
    reviewCount: 47,
    weightGrams: 620,
    midsoleTech: 'Cushion Core Carcass',
    propulsionUnit: '100% Butyl Bladder',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 801,
        imageUrl:
          'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Grip Channel View',
      },
    ],
    variants: [
      { id: 801, size: 'Size 7 (Official)', color: 'Classic Amber / Black Channels', stockQuantity: 30 },
      { id: 802, size: 'Size 6 (Youth)', color: 'Classic Amber / Black Channels', stockQuantity: 15 },
    ],
  },
  {
    id: 9,
    title: 'Aeroflex Court Pro 98 Tennis Racket',
    slug: 'aeroflex-court-pro-98-tennis-racket',
    sku: 'SZ-TN-44102',
    description:
      'Tour-level 98 sq inch head size racket built with braided graphite and Kevlar for surgical precision, heavy topspin, and torsional stability on high-power baseline rallies.',
    price: 219.99,
    msrp: 249.99,
    discountPercentage: 12,
    brand: 'Apex Athletic',
    categorySlug: 'tennis',
    categoryName: 'Tennis',
    inStock: true,
    rating: 4.90,
    reviewCount: 53,
    weightGrams: 305,
    midsoleTech: 'Braided Graphite + Kevlar',
    propulsionUnit: 'Sonic Core Infinergy',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ',
    images: [
      {
        id: 901,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ',
        angleLabel: 'Graphite Frame',
      },
    ],
    variants: [
      { id: 901, size: 'Grip 2 (4 1/4")', color: 'Matte Obsidian / Volt', stockQuantity: 12 },
      { id: 902, size: 'Grip 3 (4 3/8")', color: 'Matte Obsidian / Volt', stockQuantity: 20 },
      { id: 903, size: 'Grip 4 (4 1/2")', color: 'Matte Obsidian / Volt', stockQuantity: 8 },
    ],
  },
  {
    id: 10,
    title: 'Tour Championship Extra Duty Felt Tennis Balls (Can of 3)',
    slug: 'tour-championship-extra-duty-tennis-balls',
    sku: 'SZ-TN-44208',
    description:
      'ITF & USTA certified tournament pressurized tennis balls. Extra-duty woven interlocking felt resists fuzzing on hard court surfaces while the premium rubber core maintains lively bounce.',
    price: 18.99,
    msrp: 24.99,
    discountPercentage: 24,
    brand: 'Apex Athletic',
    categorySlug: 'tennis',
    categoryName: 'Tennis',
    inStock: true,
    rating: 4.88,
    reviewCount: 71,
    weightGrams: 175,
    midsoleTech: 'Extra Duty Interlocking Felt',
    propulsionUnit: 'Pressurized Core',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    images: [
      {
        id: 1001,
        imageUrl:
          'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
        angleLabel: 'Felt Telemetry',
      },
    ],
    variants: [
      { id: 1001, size: 'Can of 3 Balls', color: 'Optic High-Vis Yellow', stockQuantity: 60 },
      { id: 1002, size: 'Pack of 4 Cans (12 Balls)', color: 'Optic High-Vis Yellow', stockQuantity: 25 },
    ],
  },
  {
    id: 11,
    title: 'Kinetic Velocity 2-in-1 Compression Shorts',
    slug: 'kinetic-velocity-2-in-1-compression-shorts',
    sku: 'SZ-AP-11002',
    description:
      'Ultra-breathable 4-way stretch training shorts with built-in moisture-wicking compression liner, anti-chafing flatlock stitching, and secure internal phone holster.',
    price: 49.99,
    msrp: 60.00,
    discountPercentage: 17,
    brand: 'Apex Athletic',
    categorySlug: 'gym-fitness',
    categoryName: 'Gym & Fitness',
    inStock: true,
    rating: 4.79,
    reviewCount: 110,
    weightGrams: 160,
    midsoleTech: 'AeroDry Moisture-Wicking',
    propulsionUnit: '4-Way Stretch Elastic',
    dropHeightMm: 0,
    primaryImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTthylbmgq7TeXam-LqdYujXC8yXBMgp_I3TMRseslcs3uj1S7yJ_JA0iEkQfXWGeiH_JBWnXkN80PnQx-SSC9oqIe0LWE-nVCxa7qR8-GBZTdAPlkU0fgkmm7YaB4tUZWZAa-w3-1vCqW2a3Mx07yBw3m-zxFsKDUJ5FLuSQjD0pMwmy-JG14o_ukflaxo6BbBQphjoEAEUdE29wZuQBu3UIjg2Sk_iKq3MyYxTTfY6FxEeDbORR',
    images: [
      {
        id: 1101,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTthylbmgq7TeXam-LqdYujXC8yXBMgp_I3TMRseslcs3uj1S7yJ_JA0iEkQfXWGeiH_JBWnXkN80PnQx-SSC9oqIe0LWE-nVCxa7qR8-GBZTdAPlkU0fgkmm7YaB4tUZWZAa-w3-1vCqW2a3Mx07yBw3m-zxFsKDUJ5FLuSQjD0pMwmy-JG14o_ukflaxo6BbBQphjoEAEUdE29wZuQBu3UIjg2Sk_iKq3MyYxTTfY6FxEeDbORR',
        angleLabel: 'Front Profile',
      },
    ],
    variants: [
      { id: 1101, size: 'S', color: 'Stealth Black / Volt', stockQuantity: 20 },
      { id: 1102, size: 'M', color: 'Stealth Black / Volt', stockQuantity: 30 },
      { id: 1103, size: 'L', color: 'Stealth Black / Volt', stockQuantity: 25 },
      { id: 1104, size: 'XL', color: 'Stealth Black / Volt', stockQuantity: 15 },
    ],
  },
];

export const getCatalogProductById = (id) => {
  const numericId = Number(id);
  return ALL_PRODUCTS.find((p) => p.id === numericId) || ALL_PRODUCTS[0];
};
