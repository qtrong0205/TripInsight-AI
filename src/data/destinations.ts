export interface Review {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
}

export interface Destination {
    id: string;
    slug: string;
    name: string;
    location: string;
    image: string;
    price: number;
    rating: number;
    reviews: number;
    lat: number;
    lon: number;
    categories: string[];
    description: string;
    duration: string;
    reviewsList: Review[];
    embed_map_url: string
}

export const destinations: Destination[] = [
    {
        id: '1',
        slug: 'bali-indonesia',
        name: 'Bali, Indonesia',
        location: 'Indonesia',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 1200,
        rating: 4.8,
        reviews: 342,
        categories: ['Beach', 'Cultural', 'Nature'],
        description: 'Experience the magic of Bali with its stunning beaches, ancient temples, and vibrant culture. From the rice terraces of Ubud to the beaches of Seminyak, Bali offers a perfect blend of relaxation and adventure. Discover traditional Balinese ceremonies, world-class surfing, and unforgettable sunsets.',
        duration: '7 days',
        reviewsList: [
            {
                id: 'r1',
                userName: 'Sarah Johnson',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'March 15, 2024',
                comment: 'Absolutely breathtaking! The beaches are pristine and the culture is so rich. Our guide was knowledgeable and friendly. Highly recommend!',
            },
            {
                id: 'r2',
                userName: 'Michael Chen',
                avatar: 'https://placehold.co/100x100',
                rating: 4,
                date: 'March 10, 2024',
                comment: 'Great experience overall. The temples were magnificent and the food was amazing. Would love to return!',
            },
        ],
    },
    {
        id: '2',
        slug: 'santorini-greece',
        name: 'Santorini, Greece',
        location: 'Greece',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 2100,
        rating: 4.9,
        reviews: 528,
        categories: ['Beach', 'Cultural', 'City'],
        description: 'Discover the iconic white-washed buildings and blue-domed churches of Santorini. This stunning Greek island offers breathtaking sunsets, volcanic beaches, and world-renowned cuisine. Explore ancient ruins, sample local wines, and immerse yourself in Mediterranean charm.',
        duration: '5 days',
        reviewsList: [
            {
                id: 'r3',
                userName: 'Emma Wilson',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'March 20, 2024',
                comment: 'A dream destination! The sunset in Oia is something everyone should experience at least once. The food and wine were exceptional.',
            },
        ],
    },
    {
        id: '3',
        slug: 'swiss-alps',
        name: 'Swiss Alps',
        location: 'Switzerland',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 2800,
        rating: 4.7,
        reviews: 412,
        categories: ['Mountain', 'Adventure', 'Nature'],
        description: 'Experience the majestic beauty of the Swiss Alps with pristine mountain peaks, crystal-clear lakes, and charming alpine villages. Perfect for skiing in winter or hiking in summer, the Swiss Alps offer year-round adventure and stunning natural beauty.',
        duration: '6 days',
        reviewsList: [
            {
                id: 'r4',
                userName: 'David Schmidt',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'February 28, 2024',
                comment: 'The skiing was fantastic and the scenery is unmatched. The Swiss hospitality made our trip even more special.',
            },
        ],
    },
    {
        id: '4',
        slug: 'tokyo-japan',
        name: 'Tokyo, Japan',
        location: 'Japan',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 1800,
        rating: 4.8,
        reviews: 687,
        categories: ['City', 'Cultural'],
        description: 'Immerse yourself in the vibrant energy of Tokyo, where ancient traditions meet cutting-edge technology. From serene temples to bustling streets, world-class cuisine to unique shopping experiences, Tokyo offers an unforgettable journey through Japanese culture.',
        duration: '8 days',
        reviewsList: [
            {
                id: 'r5',
                userName: 'Lisa Park',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'March 18, 2024',
                comment: 'Tokyo exceeded all expectations! The food scene is incredible and there is so much to see and do. Can not wait to go back!',
            },
        ],
    },
    {
        id: '5',
        slug: 'machu-picchu-peru',
        name: 'Machu Picchu, Peru',
        location: 'Peru',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 1600,
        rating: 4.9,
        reviews: 445,
        categories: ['Mountain', 'Cultural', 'Adventure'],
        description: 'Journey to the ancient Incan citadel of Machu Picchu, one of the New Seven Wonders of the World. Trek through the Andes, explore mysterious ruins, and witness breathtaking mountain vistas in this once-in-a-lifetime adventure.',
        duration: '5 days',
        reviewsList: [
            {
                id: 'r6',
                userName: 'Carlos Rodriguez',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'March 12, 2024',
                comment: 'An absolutely incredible experience. The trek was challenging but so rewarding. The ruins are even more impressive in person!',
            },
        ],
    },
    {
        id: '6',
        slug: 'maldives',
        name: 'Maldives',
        location: 'Maldives',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 3200,
        rating: 4.9,
        reviews: 612,
        categories: ['Beach', 'Nature'],
        description: 'Escape to paradise in the Maldives, where crystal-clear turquoise waters meet pristine white sand beaches. Stay in luxurious overwater bungalows, snorkel with tropical fish, and experience ultimate relaxation in this tropical haven.',
        duration: '7 days',
        reviewsList: [
            {
                id: 'r7',
                userName: 'Jennifer Lee',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'March 22, 2024',
                comment: 'Pure paradise! The water is so clear and the marine life is amazing. Our overwater villa was stunning. Perfect honeymoon destination!',
            },
        ],
    },
    {
        id: '7',
        slug: 'new-york-city',
        name: 'New York City',
        location: 'USA',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 1400,
        rating: 4.6,
        reviews: 892,
        categories: ['City', 'Cultural'],
        description: 'Experience the city that never sleeps! From iconic landmarks like the Statue of Liberty and Times Square to world-class museums and Broadway shows, New York City offers endless entertainment and cultural experiences.',
        duration: '5 days',
        reviewsList: [
            {
                id: 'r8',
                userName: 'Robert Taylor',
                avatar: 'https://placehold.co/100x100',
                rating: 4,
                date: 'March 8, 2024',
                comment: 'So much to see and do! The energy of the city is contagious. Great food, amazing shows, and iconic sights everywhere.',
            },
        ],
    },
    {
        id: '8',
        slug: 'patagonia-argentina',
        name: 'Patagonia, Argentina',
        location: 'Argentina',
        image: 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png',
        price: 2200,
        rating: 4.8,
        reviews: 324,
        categories: ['Mountain', 'Nature', 'Adventure'],
        description: 'Explore the wild beauty of Patagonia with its dramatic glaciers, towering mountains, and pristine wilderness. Perfect for adventurers seeking hiking, wildlife watching, and breathtaking natural landscapes at the end of the world.',
        duration: '10 days',
        reviewsList: [
            {
                id: 'r9',
                userName: 'Maria Gonzalez',
                avatar: 'https://placehold.co/100x100',
                rating: 5,
                date: 'February 25, 2024',
                comment: 'Absolutely stunning landscapes! The glaciers are magnificent and the hiking trails are incredible. A must-visit for nature lovers!',
            },
        ],
    },
];
