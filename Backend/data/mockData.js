const mockDestinations = [
  // ── KOLKATA HIDDEN GEMS & LANDMARKS ──
  {
    id: "dest_kol_1",
    name: "Victoria Memorial",
    city: "Kolkata",
    location: "Queens Way, Maidan, Kolkata, India",
    rating: 4.8,
    description: "Grand white marble palace built between 1906 and 1921, surrounded by lush manicured gardens and reflecting pools.",
    bestTimeToVisit: "October to March (4 PM - 7 PM)",
    estimatedCost: 50,
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: false,
    coordinates: { lat: 22.5448, lng: 88.3426 }
  },
  {
    id: "dest_kol_2",
    name: "Howrah Bridge (Rabindra Setu)",
    city: "Kolkata",
    location: "River Hooghly, Kolkata, India",
    rating: 4.7,
    description: "Iconic balanced cantilever bridge without a single nut or bolt, connecting Kolkata and Howrah over the Hooghly River.",
    bestTimeToVisit: "Sunrise or Evening illuminated view",
    estimatedCost: 0,
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: false,
    coordinates: { lat: 22.5851, lng: 88.3468 }
  },
  {
    id: "dest_kol_3",
    name: "Kumartuli Potter's Quarter",
    city: "Kolkata",
    location: "North Kolkata, India",
    rating: 4.9,
    description: "Traditional potters' quarter where generations of artisans craft clay idols for Durga Puja and festivals using Ganges clay.",
    bestTimeToVisit: "August to October (Morning)",
    estimatedCost: 0,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "Witness raw artistic creation of towering clay deities using 300-year-old traditional techniques.",
    localStory: "Centuries-old lineage of potters migrated from Krishnanagar in the 1700s to build idols for aristocrats.",
    crowdLevel: "Moderate",
    safetyLevel: "Safe",
    nearbyAttractions: ["Shobhabazar Rajbari", "Ahiritola Ghat"],
    whyRecommended: "Authentic cultural immersion away from commercialized tourist spots.",
    coordinates: { lat: 22.5976, lng: 88.3619 }
  },
  {
    id: "dest_kol_4",
    name: "Marble Palace Mansion",
    city: "Kolkata",
    location: "Muktaram Babu Street, Jorasanko, Kolkata, India",
    rating: 4.8,
    description: "A breathtaking 1835 neoclassical marble mansion filled with Italian marble statues, Victorian paintings by Rubens, and free-roaming peacocks.",
    bestTimeToVisit: "10 AM - 4 PM (Requires WB Tourism pass)",
    estimatedCost: 0,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "Private heritage museum with 90 types of imported Italian marble floors and rare artwork.",
    localStory: "Built by wealthy merchant Raja Rajendra Mullick in 1835, who maintained a private zoo and daily feeding program for the poor.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Jorasanko Thakur Bari", "College Street"],
    whyRecommended: "Stunning 19th-century royal grandeur tucked away inside crowded old Kolkata alleys.",
    coordinates: { lat: 22.5819, lng: 88.3601 }
  },
  {
    id: "dest_kol_5",
    name: "South Park Street Cemetery",
    city: "Kolkata",
    location: "Park Street, Kolkata, India",
    rating: 4.7,
    description: "Atmospheric 18th-century gothic cemetery opened in 1767, filled with moss-covered obelisks, mausoleums, and towering banyan trees.",
    bestTimeToVisit: "4 PM - 6 PM (Golden Hour)",
    estimatedCost: 20,
    category: "Hidden Gem",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/South_Park_Street_Cemetery_Kolkata.jpg/800px-South_Park_Street_Cemetery_Kolkata.jpg",
    isHiddenGem: true,
    whySpecial: "One of the earliest non-churchyard cemeteries in the world with stunning gothic architecture.",
    localStory: "Contains tombs of pioneer orientalists like Sir William Jones (Asiatic Society founder) and Derozio.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Park Street Restaurants", "Asiatic Society"],
    whyRecommended: "Hauntingly beautiful serene walk amid 250-year-old mossy monuments.",
    coordinates: { lat: 22.5489, lng: 88.3621 }
  },

  // ── PARIS HIDDEN GEMS & LANDMARKS ──
  {
    id: "dest_par_1",
    name: "Eiffel Tower",
    city: "Paris",
    location: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
    rating: 4.9,
    description: "The iconic 330-meter wrought-iron lattice tower offering panoramic views of Paris.",
    bestTimeToVisit: "6 PM - 10 PM",
    estimatedCost: 2400,
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: false,
    coordinates: { lat: 48.8584, lng: 2.2945 }
  },
  {
    id: "dest_par_3",
    name: "Promenade Plantée (Coulée Verte)",
    city: "Paris",
    location: "12th Arrondissement, Paris, France",
    rating: 4.8,
    description: "An elevated tree-lined park built atop a 19th-century railway viaduct, winding through rose gardens high above Paris city streets.",
    bestTimeToVisit: "10 AM - 4 PM",
    estimatedCost: 0,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "The world's first elevated park walkway, inspiring New York's High Line.",
    localStory: "Built along the abandoned Vincennes railway line in 1993, creating a lush green elevated oasis.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Place de la Bastille", "Viaduc des Arts"],
    whyRecommended: "Tranquil romantic garden stroll far away from noisy tourist crowds.",
    coordinates: { lat: 48.8465, lng: 2.3789 }
  },

  // ── TOKYO HIDDEN GEMS ──
  {
    id: "dest_tok_1",
    name: "Senso-ji Temple",
    city: "Tokyo",
    location: "Asakusa, Tokyo, Japan",
    rating: 4.9,
    description: "Tokyo's oldest Buddhist temple founded in 645 AD, entered through the giant Kaminarimon Red Lantern gate.",
    bestTimeToVisit: "8 AM - 10 AM",
    estimatedCost: 0,
    category: "Culture",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: false,
    coordinates: { lat: 35.7148, lng: 139.7967 }
  },
  {
    id: "dest_tok_3",
    name: "Todoroki Valley",
    city: "Tokyo",
    location: "Setagaya City, Tokyo, Japan",
    rating: 4.9,
    description: "A natural wooded ravine and secret jungle stream hidden inside urban Tokyo, featuring bamboo groves and a secluded Buddhist temple.",
    bestTimeToVisit: "10 AM - 3 PM",
    estimatedCost: 0,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "The only natural valley in Tokyo's 23 special wards.",
    localStory: "A tranquil sanctuary where monks meditated near the Todoroki Fudo Temple waterfall.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Todoroki Fudo Temple", "Setsugekka Tea House"],
    whyRecommended: "Unbelievable natural green escape hidden beneath Tokyo's concrete metropolis.",
    coordinates: { lat: 35.6047, lng: 139.6461 }
  },

  // ── DARJEELING HIDDEN GEMS ──
  {
    id: "dest_dar_1",
    name: "Tinchuley Ridge Village",
    city: "Darjeeling",
    location: "Tinchuley, Takdah, Darjeeling, West Bengal, India",
    rating: 4.9,
    description: "A tranquil eco-tourism ridge village surrounded by pine forests, tea gardens, and unobstructed 360-degree views of Mt. Kanchenjunga.",
    bestTimeToVisit: "October to April (Sunrise)",
    estimatedCost: 0,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "Meaning 'Three Ovens', named after three hilltop peaks that resemble clay ovens.",
    localStory: "Transformed by WWFN initiative into a model organic village producing fresh tea and oranges.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Lamahatta Eco Park", "Peshok Tea Garden Viewpoint"],
    whyRecommended: "Breathtaking Himalayan mountain views without Mall Road crowds.",
    coordinates: { lat: 27.0289, lng: 88.3342 }
  },

  // ── GOA HIDDEN GEMS ──
  {
    id: "dest_goa_1",
    name: "Butterfly Beach",
    city: "Goa",
    location: "Palolem, South Goa, India",
    rating: 4.9,
    description: "Secluded semi-circular cove surrounded by dense forests, accessible by boat or jungle hike.",
    bestTimeToVisit: "Sunset",
    estimatedCost: 300,
    category: "Hidden Gem",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    isHiddenGem: true,
    whySpecial: "Pristine white sand, dolphin sightings, and butterfly swarms.",
    localStory: "Remained undiscovered by mass tourism due to its natural forest barricade.",
    crowdLevel: "Low",
    safetyLevel: "Safe",
    nearbyAttractions: ["Palolem Beach", "Agonda Beach"],
    whyRecommended: "Unspoiled natural beach paradise away from noisy commercial shacks.",
    coordinates: { lat: 15.0069, lng: 74.0298 }
  }
];

const mockCultureStories = [
  {
    destination: "Kolkata",
    title: "The Legacy of Adda, Coffee House & Durga Puja",
    period: "19th Century to Present",
    story: "In Kolkata, 'Adda' is a sacred intellectual ritual. At the Indian Coffee House on College Street, Nobel laureates like Rabindranath Tagore and filmmakers like Satyajit Ray debated politics and cinema over coffee. Every autumn, Durga Puja transforms the city into the world's largest open-air art festival with 40,000+ Pandals.",
    tradition: "Evening adda at local tea stalls with kulhad chai, Mishti Doi, and Kathi Rolls.",
    etiquette: "Always greet elders with respect ('Pranam'), remove footwear when entering homes, and accept prasad with your right hand."
  },
  {
    destination: "Delhi",
    title: "Mughal Culinary Heritage & Sufi Qawwali",
    period: "12th Century to Present",
    story: "Delhi's cultural soul lives inside Old Delhi's narrow 400-year-old alleys. From Shah Jahan's Chandni Chowk to Nizamuddin Dargah, Thursday evenings echo with soul-stirring Sufi Qawwali music. Royal Mughlai recipes like Nihari and Biryani have been preserved by royal chef descendants for generations.",
    tradition: "Attending Thursday night Qawwali at Hazrat Nizamuddin and eating Parathewali Gali parathas.",
    etiquette: "Dress modestly when visiting dargahs and religious shrines; cover your head with a scarf or handkerchief."
  },
  {
    destination: "Mumbai",
    title: "Dabbawalas, Koli Fisherfolk & Bollywood Dreams",
    period: "1890s to Present",
    story: "Mumbai's 5,000 Dabbawalas deliver over 200,000 home-cooked lunchboxes daily with Six Sigma precision without using digital technology. Originally a fishing village of the indigenous Koli community, Mumbai evolved into India's financial hub and the world's largest film producing city.",
    tradition: "Evening strolls along Marine Drive (Queen's Necklace) with Vada Pav and cutting chai.",
    etiquette: "Board local trains swiftly; respect local street vendors and avoid photographing people without consent."
  },
  {
    destination: "Jaipur",
    title: "Rajput Royal Splendor & Pink City Block Printing",
    period: "1727 to Present",
    story: "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was painted terracotta pink in 1876 to welcome the Prince of Wales. The city is renowned for royal Rajput palaces, symmetrical stepwells, hand-block printing, and 150-year-old blue pottery crafts.",
    tradition: "Sipping Masala Chai while watching peacocks at Amber Fort and exploring Johari Bazaar.",
    etiquette: "Remove shoes before entering heritage temple sanctums; bow gently when greeted with 'Khamma Ghani'."
  },
  {
    destination: "Goa",
    title: "Indo-Portuguese Fontainhas & Susegad Lifestyle",
    period: "1510 to Present",
    story: "Goa's unique identity springs from 450 years of Portuguese rule. Fontainhas in Panaji features pastel-colored Latin Quarter mansions with tiled roofs. 'Susegad' defines the relaxed, contented Goan way of life centered around seafood, brass bands, and cashew Feni.",
    tradition: "Sunday family feasts featuring Goan Fish Curry, Bebinca dessert, and fado acoustic music.",
    etiquette: "Greet locals warmly with 'Deu Boro Dis Divum' (May God give you a good day); respect beach cleanliness."
  },
  {
    destination: "Darjeeling",
    title: "Himalayan Orthodox Tea Gardens & Toy Train Heritage",
    period: "1840s to Present",
    story: "Perched at 6,700 feet, Darjeeling produces the 'Champagne of Teas'. Built in 1881, the UNESCO World Heritage Darjeeling Himalayan Railway (Toy Train) still chugs through pine forests driven by original steam engines under Mount Kanchenjunga.",
    tradition: "Morning black tea tasting at Glenary's and buying handmade Tibetan prayer flags.",
    etiquette: "Spin Buddhist prayer wheels clockwise; dress warmly in layers as mountain mist descends quickly."
  },
  {
    destination: "Varanasi",
    title: "The 3,000-Year-Old Eternal City & Ganga Aarti",
    period: "1200 BC to Present",
    story: "One of the world's oldest continually inhabited cities, Varanasi is the spiritual heart of Hinduism. Every evening at Dashashwamedh Ghat, priests perform the spectacular Ganga Aarti ritual with brass lamps, incense, and Vedic chants along the sacred river.",
    tradition: "Dawn boat ride along 84 ancient ghats and tasting Malaiyyo milk foam sweet.",
    etiquette: "Maintain silence during cremation rituals at Manikarnika Ghat; photography at burning ghats is strictly prohibited."
  },
  {
    destination: "Agra",
    title: "Mughal Marble Parchin Kari & Taj Mahal Romance",
    period: "16th Century to Present",
    story: "Home to the Taj Mahal built by Emperor Shah Jahan in memory of Mumtaz Mahal, Agra preserves the intricate art of 'Parchin Kari' — inlaying semi-precious stones into white marble. Old Agra streets still produce traditional Agra Petha sweets using 350-year-old royal recipes.",
    tradition: "Watching sunrise over the Taj Mahal from Mehtab Bagh and savoring fresh Angoori Petha.",
    etiquette: "Remove footwear when stepping onto the white marble mausoleum platform."
  },
  {
    destination: "Paris",
    title: "Montmartre Bohemian Artists & Seine Bouquinistes",
    period: "Late 19th Century to Present",
    story: "Montmartre was the cradle of Modern Art where Picasso, Van Gogh, and Toulouse-Lautrec gathered in cobblestone cafes. Along the Seine, green wooden stalls of 'Bouquinistes' have sold vintage books and prints for over 300 years.",
    tradition: "Morning espresso with a fresh butter croissant at sidewalk bistros; Sunday strolls along Seine banks.",
    etiquette: "Always greet shopkeepers with 'Bonjour Madame/Monsieur' upon entering; dining is slow and unhurried."
  },
  {
    destination: "London",
    title: "Afternoon High Tea, West End & Historic Pubs",
    period: "17th Century to Present",
    story: "London's culture blends centuries of royal pageantry with vibrant West End theatre and historic pub traditions. Dating back to 1667, London pubs serve as neighborhood living rooms where locals gather for real ale, roast dinners, and pub quizzes.",
    tradition: "Enjoying traditional 4 PM Afternoon High Tea with scones and clotted cream near Covent Garden.",
    etiquette: "Order at the bar in pubs (table service is rare); stand on the right side of tube escalators."
  },
  {
    destination: "Rome",
    title: "La Dolce Vita & Eternal City Trattoria Culture",
    period: "753 BC to Present",
    story: "Rome's 2,700-year history is carved into every cobblestone. From the Colosseum to Trastevere, Roman culture celebrates 'La Dolce Vita' (The Sweet Life) — leisurely multi-course meals, espresso at the bar, and golden hour piazza walks.",
    tradition: "Sipping espresso standing at a cafe bar and tossing a coin into Trevi Fountain over your left shoulder.",
    etiquette: "Never order a cappuccino after 11 AM; cover shoulders and knees when visiting churches."
  },
  {
    destination: "Barcelona",
    title: "Gaudí Modernisme, Tapas & Catalan Culture",
    period: "19th Century to Present",
    story: "Barcelona's identity is shaped by Antoni Gaudí's fantastical surrealist architecture like Sagrada Família and Park Güell. Catalan culture values 'Seny i Rauxa' (sanity and passion), reflected in lively tapas crawls along the Gothic Quarter.",
    tradition: "Late-night tapas and sangria crawls along El Born and watching Castellers human towers.",
    etiquette: "Dinner starts late in Spain (after 9:00 PM); greet locals with 'Bon dia' in Catalan."
  },
  {
    destination: "Amsterdam",
    title: "Canal House Architecture & Cycling Freedom",
    period: "Dutch Golden Age to Present",
    story: "Built around 165 km of Golden Age canals, Amsterdam is the world's cycling capital with over 800,000 bicycles. Dutch culture celebrates 'Gezelligheid' — cozy, warm atmosphere shared with friends in historic brown cafes.",
    tradition: "Riding a bicycle along Prinsengracht canal and eating warm stroopwafels at Albert Cuyp Market.",
    etiquette: "Always stay clear of red bicycle lanes; ring your bike bell gently when navigating footpaths."
  },
  {
    destination: "Tokyo",
    title: "Omotenashi Hospitality & Shinto Temple Rituals",
    period: "Edo Period to Present",
    story: "Japanese culture balances cutting-edge modernism with centuries-old 'Omotenashi' (selfless hospitality). At Asakusa's Senso-ji, pilgrims cleanse hands at purification fountains before bowing to ancient Shinto deities.",
    tradition: "Enjoying evening Yakitori skewers at an alleyway Izakaya pub and bowing when exchanging business cards.",
    etiquette: "Never tip in Japan (it can be seen as disrespectful); avoid talking loudly on public trains."
  },
  {
    destination: "Kyoto",
    title: "Geisha Gion Heritage & Zen Rock Gardens",
    period: "794 AD to Present",
    story: "Japan's ancient imperial capital for over 1,000 years, Kyoto is the spiritual heart of traditional Japanese arts — from tea ceremony (Chado) and flower arranging (Ikebana) to Gion Geiko and Maiko dance performances.",
    tradition: "Attending a traditional matcha tea ceremony and meditating in Ryoan-ji Zen rock garden.",
    etiquette: "Never touch or block the path of Maiko or Geiko in Gion; remove shoes on tatami mat floors."
  },
  {
    destination: "Bangkok",
    title: "Wai Greetings, Floating Markets & Muay Thai",
    period: "1782 to Present",
    story: "Bangkok ('Krung Thep') is a city of gilded Buddhist spires, bustling canal floating markets, and world-class street food. Thai culture is guided by 'Mai Pen Rai' (don't worry, be happy) and deep reverence for the monarchy and Monks.",
    tradition: "Giving a gentle 'Wai' palm press greeting and savoring Pad Thai from night market wok masters.",
    etiquette: "Never point feet at people or sacred Buddha statues; touch no one on the top of the head."
  },
  {
    destination: "Singapore",
    title: "Hawker Culture & Peranakan Heritage",
    period: "1819 to Present",
    story: "Singapore's UNESCO-recognized Hawker Culture brings together Chinese, Malay, Indian, and Eurasian flavors in open-air food courts. Katong preserves colorful Peranakan shophouses created by early Chinese-Malay intermarriage.",
    tradition: "Feasting on Hainanese Chicken Rice at Maxwell Hawker Centre and strolling Gardens by the Bay.",
    etiquette: "Reserve seats at hawker centres using tissue packets ('Chope'); chewing gum sale is prohibited."
  },
  {
    destination: "Bali",
    title: "Tri Hita Karana Philosophy & Canang Sari Offerings",
    period: "9th Century to Present",
    story: "Balinese culture is rooted in 'Tri Hita Karana' — harmony between humans, nature, and God. Every morning, women place woven palm-leaf baskets ('Canang Sari') filled with fresh flowers and incense outside doorways and temples.",
    tradition: "Watching Sunset Kecak Fire Dances atop Uluwatu cliffs and walking through Subak rice terraces.",
    etiquette: "Never step on Canang Sari offerings on sidewalk floors; wear a sarong and sash when entering temples."
  },
  {
    destination: "Dubai",
    title: "Bedouin Desert Traditions & Spice Souk Heritage",
    period: "1830s to Present",
    story: "Before modern skyscrapers, Dubai was a quiet pearl-diving community. In Al Fahidi Historical Neighbourhood, wind-tower coral houses preserve Bedouin hospitality, falconry, and aromatic spice trading along Dubai Creek.",
    tradition: "Sipping Arabic Gahwa coffee with fresh dates and riding traditional wooden Abra boats across the creek.",
    etiquette: "Use your right hand for eating and drinking; dress respectfully in public places outside beach resorts."
  },
  {
    destination: "Istanbul",
    title: "Byzantine-Ottoman Crossroads & Turkish Bath Hammams",
    period: "660 BC to Present",
    story: "Straddling Europe and Asia across the Bosphorus Strait, Istanbul was the capital of both Byzantine and Ottoman Empires. The 500-year-old Grand Bazaar houses 4,000 shops selling Turkish carpets, spices, and glass lanterns.",
    tradition: "Sipping strong Turkish tea in tulip glasses and relaxing in a 16th-century historic Hammam bathhouse.",
    etiquette: "Accept tea offers warmly from shopkeepers; cover head and shoulders in mosques like Hagia Sophia."
  },
  {
    destination: "Cairo",
    title: "Pharaonic Pyramids & Khan el-Khalili Bazaar",
    period: "3100 BC to Present",
    story: "Cairo is the 'Mother of the World', home to the Giza Pyramids and 1,000-year-old Islamic architecture. Khan el-Khalili market has operated since 1382, where brass artisans craft lamps amidst sounds of traditional Oud music.",
    tradition: "Sailing on a wooden Felucca boat down the River Nile at sunset and drinking hibiscus Karkadeh tea.",
    etiquette: "Dress modestly covering shoulders and knees; haggle politely with market merchants."
  },
  {
    destination: "New York",
    title: "Harlem Renaissance Jazz & Broadway Theatre",
    period: "1920s to Present",
    story: "New York City's cultural tapestry is shaped by wave after wave of global immigration. From Harlem's Jazz revolution at the Apollo Theater to Broadway's musical lights, every NYC neighborhood retains distinct culinary and artistic roots.",
    tradition: "Grabbing an authentic New York bagel with cream cheese and attending a night Broadway show.",
    etiquette: "Walk purposefully on sidewalks (don't block the walking flow); tipping 18-20% at restaurants is customary."
  }
];

const mockEvents = [
  {
    id: "evt_1",
    city: "Kolkata",
    title: "Durga Puja Carnival & Street Parade",
    location: "Red Road & Park Street, Kolkata",
    venue: "Red Road & Park Street",
    date: "Oct 2026",
    category: "Festival",
    estimatedCost: 0,
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80",
    description: "Grand procession featuring top award-winning Durga Puja idols with traditional Dhak drummers and dancers."
  },
  {
    id: "evt_2",
    city: "Paris",
    title: "Nuit Blanche Night Art Festival",
    location: "Le Marais & Seine Riverbanks, Paris",
    venue: "Le Marais & Seine Riverbanks",
    date: "Oct 2026",
    category: "Cultural",
    estimatedCost: 0,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "All-night contemporary art festival turning Paris museums, streets, and bridges into light installations."
  },
  {
    id: "evt_3",
    city: "Tokyo",
    title: "Sumida River Fireworks Festival",
    location: "Sumida River, Asakusa, Tokyo",
    venue: "Sumida River Bank",
    date: "Jul 2026",
    category: "Festival",
    estimatedCost: 0,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Japan's oldest traditional pyrotechnic show featuring 20,000 fireworks over the Tokyo skyline."
  },
  {
    id: "evt_4",
    city: "Delhi",
    title: "International Mango Festival",
    location: "Dilli Haat, Janakpuri, Delhi",
    venue: "Dilli Haat",
    date: "Jul 2026",
    category: "Cultural",
    estimatedCost: 100,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    description: "Feast on 500+ varieties of rare Indian mangoes, culinary competitions, and folk dances."
  },
  {
    id: "evt_5",
    city: "Jaipur",
    title: "Jaipur Literature Festival (JLF)",
    location: "Hotel Clarks Amer, Jaipur",
    venue: "Hotel Clarks Amer",
    date: "Jan 2027",
    category: "Literary",
    estimatedCost: 0,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    description: "The world's largest free literary festival bringing together Nobel laureates, novelists, and thinkers."
  },
  {
    id: "evt_6",
    city: "Goa",
    title: "Sunburn Music Festival Goa",
    location: "Vagator Beach, North Goa",
    venue: "Vagator Beach",
    date: "Dec 2026",
    category: "Music",
    estimatedCost: 3500,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    description: "Asia's largest Electronic Dance Music (EDM) beach festival featuring international DJs and light shows."
  },
  {
    id: "evt_7",
    city: "Rome",
    title: "Rome International Film Festival",
    location: "Auditorium Parco della Musica, Rome",
    venue: "Parco della Musica",
    date: "Oct 2026",
    category: "Cultural",
    estimatedCost: 1200,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "A major international film festival celebrating red carpet premieres, Italian cinema, and masterclasses."
  },
  {
    id: "evt_8",
    city: "Bali",
    title: "Bali Arts Festival (Pesta Kesenian Bali)",
    location: "Taman Werdhi Budaya Art Centre, Denpasar, Bali",
    venue: "Denpasar Art Centre",
    date: "Jun 2026",
    category: "Cultural",
    estimatedCost: 0,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Month-long celebration of Balinese gamelan music, traditional Kecak dance, and handicraft exhibitions."
  }
];

const mockPhrases = [
  { id: "phrase_1", category: "Greetings", english: "Hello / Greetings", bengali: "নমস্কার (Namaskar) / হ্যালো", hindi: "नमस्ते (Namaste)", french: "Bonjour", spanish: "Hola", japanese: "Konnichiwa (こんにちは)" },
  { id: "phrase_2", category: "Courtesy", english: "Thank you very much", bengali: "ধন্যবাদ (Dhanyabad)", hindi: "बहुत धन्यवाद (Bahut Dhanyavad)", french: "Merci beaucoup", spanish: "Muchas gracias", japanese: "Arigatou gozaimasu (ありがとうございます)" },
  { id: "phrase_3", category: "Shopping", english: "How much does this cost?", bengali: "এটার দাম কত? (Etar dam koto?)", hindi: "यह कितने का है? (Yeh kitne ka hai?)", french: "Combien ça coûte ?", spanish: "¿Cuánto cuesta esto?", japanese: "Kore wa ikura desu ka?" },
  { id: "phrase_4", category: "Direction", english: "Where is the bathroom?", bengali: "বাথরুম কোথায়? (Bathroom kothay?)", hindi: "शौचालय कहाँ है? (Shouchalay kahan hai?)", french: "Où sont les toilettes ?", spanish: "¿Dónde está el baño?", japanese: "Toire wa doko desu ka?" },
  { id: "phrase_5", category: "Dining", english: "Is this food spicy?", bengali: "খাবারটা কি ঝাল? (Khabarta ki jhal?)", hindi: "क्या यह खाना तीखा है? (Kya yeh khana teekha hai?)", french: "Est-ce épicé ?", spanish: "¿Es picante?", japanese: "Kore wa karai desu ka?" },
  { id: "phrase_6", category: "Emergency", english: "Can you help me please?", bengali: "আমাকে একটু সাহায্য করবেন? (Amake sahajyo korben?)", hindi: "कृपया मेरी मदद करें (Kripya meri madad karein)", french: "Pouvez-vous m'aider s'il vous plaît ?", spanish: "¿Puede ayudarme por favor?", japanese: "Tasukete kurasai" },
  { id: "phrase_7", category: "Compliments", english: "The food is delicious!", bengali: "খাবার খুব সুস্বাদু! (Khabar khub suswadu!)", hindi: "खाना बहुत स्वादिष्ट है! (Khana bahut swadisht hai!)", french: "C'est délicieux !", spanish: "¡La comida está deliciosa!", japanese: "Oishii desu!" },
  { id: "phrase_8", category: "Transit", english: "Where is the train station?", bengali: "ট্রেন স্টেশন কোথায়? (Train station kothay?)", hindi: "रेलवे स्टेशन कहाँ है? (Railway station kahan hai?)", french: "Où est la gare ?", spanish: "¿Dónde está la estación de tren?", japanese: "Eki wa doko desu ka?" },
];

module.exports = { mockDestinations, mockCultureStories, mockEvents, mockPhrases };

