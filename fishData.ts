/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  iucnStatus: 'Critically Endangered' | 'Endangered' | 'Vulnerable' | 'Near Threatened' | 'Least Concern';
  populationTrend: 'Decreasing' | 'Stable' | 'Unknown';
  threatLevel: 'High' | 'Medium' | 'Low';
  habitat: string;
  distribution: string;
  diet: string;
  majorThreats: string;
  conservationRecommendation: string;
  academicCitation: string;
  funFact: string;
  description: string;
  
  // CBAM spatial features (for quantum encoding map, length 4)
  quantumFeatures: number[]; // [length/size, depth, weight/density, rarity]
  
  // SVG drawing representation of the fish
  svgPath: string;
  color: string;
  viewBox: string;
}

export const CLOSED_SET_6_SPECIES: FishSpecies[] = [
  {
    id: 'whale_shark',
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    family: 'Rhincodontidae',
    iucnStatus: 'Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Tropical and warm-temperate open oceans, coastal feeding aggregation zones, and seasonal upwelling areas down to 1,900 meters.',
    distribution: 'Circumtropical across Atlantic, Indian, and Pacific Oceans (Australia, Mexico, Maldives, Philippines, Mozambique, Ningaloo Reef).',
    diet: 'Filter feeder consuming plankton, krill, fish eggs, crab larvae, squid, and small schooling teleost fish.',
    majorThreats: 'Targeted illegal fishing for fins and meat, commercial vessel strikes in major shipping lanes, ocean plastic ingestion, and net entanglement.',
    conservationRecommendation: 'Global CITES Appendix II trade controls, mandatory vessel speed limits in aggregation corridors, photo-ID spot pattern database tracking, and marine sanctuaries.',
    academicCitation: 'Pierce, S.J. & Norman, B. 2021. Rhincodon typus. The IUCN Red List of Threatened Species 2021: e.T19488A124995021.',
    funFact: 'Every whale shark has a distinct pattern of white spots behind their gills functioning like a unique human fingerprint.',
    description: 'The world\'s largest living fish species, characterized by a broad flattened head, huge terminal mouth, filter-feeding gill rakers, and striking checkerboard spot patterns.',
    quantumFeatures: [0.99, 0.12, 0.98, 0.78],
    svgPath: 'M10,50 Q40,20 90,22 T180,35 Q220,40 250,38 L280,20 Q290,50 280,80 L250,62 Q210,60 180,65 T90,78 Q40,80 10,50 Z M120,25 Q140,5 155,27 M150,65 Q130,95 125,67 M210,39 L220,28 L232,40 M65,50 Q70,30 65,70 M75,50 Q80,30 75,70',
    color: '#0284c7',
    viewBox: '0 0 300 100'
  },
  {
    id: 'scalloped_hammerhead',
    name: 'Scalloped Hammerhead Shark',
    scientificName: 'Sphyrna lewini',
    family: 'Sphyrnidae',
    iucnStatus: 'Critically Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Warm temperate and tropical coastal shelves, insular drop-offs, seamounts, and pelagic waters from surface down to 275m.',
    distribution: 'Worldwide in tropical and warm temperate seas, including Galapagos Islands, Cocos Island, Malpelo, and the Red Sea.',
    diet: 'Teleost fish, squid, octopus, stingrays, small sharks, and crustaceans.',
    majorThreats: 'High demand for shark fins (commercial finning), pelagic longline and gillnet bycatch, loss of coastal mangrove nurseries, and aggregation overfishing.',
    conservationRecommendation: 'CITES Appendix II international trade controls, establishment of oceanic shark sanctuaries (Galapagos Marine Reserve), longline circle hook mandates, and satellite tagging of nursery bays.',
    academicCitation: 'Rigby, C.L. et al. 2021. Sphyrna lewini. The IUCN Red List of Threatened Species 2021: e.T39385A2918526.',
    funFact: 'Their cephalofoil head shape acts as a hydrofoil, providing vertical lift and housing thousands of ampullae of Lorenzini electro-receptors.',
    description: 'A large predatory shark distinguished by a wide, laterally extended hammer-shaped head with a prominent central indentation along the front margin.',
    quantumFeatures: [0.75, 0.25, 0.65, 0.92],
    svgPath: 'M30,50 L5,35 L5,65 L30,50 Q60,30 110,35 T200,45 Q230,48 250,42 L280,25 Q290,50 280,75 L250,58 Q200,55 160,58 T110,65 Q60,70 30,50 Z M120,35 L135,15 L150,38 M180,45 L190,30 L202,46 M120,65 L132,80 L145,62',
    color: '#334155',
    viewBox: '0 0 300 100'
  },
  {
    id: 'smalltooth_sawfish',
    name: 'Smalltooth Sawfish',
    scientificName: 'Pristis pectinata',
    family: 'Pristidae',
    iucnStatus: 'Critically Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Shallow coastal estuarine habitats, estuarine mangroves, muddy river mouths, and lagoons.',
    distribution: 'Historically widespread in tropical and subtropical Atlantic; currently restricted primarily to Southwest Florida (Everglades) and the Bahamas.',
    diet: 'Mullet, herring, jacks, crabs, shrimp, and benthic invertebrates disabled using their tooth-lined rostrum.',
    majorThreats: 'Entanglement in commercial trawl and gillnet gear (bycatch), mangrove deforestation, coastal habitat development, and slow reproductive rates.',
    conservationRecommendation: 'Strict protection under Endangered Species Act (ESA), designated critical mangrove habitats, CITES Appendix I, and emergency rescue disentanglement networks.',
    academicCitation: 'Carlson, J. et al. 2021. Pristis pectinata. The IUCN Red List of Threatened Species 2021: e.T18175A124803738.',
    funFact: 'Their long saw-like rostrum possesses thousands of electro-receptive ampullae of Lorenzini to detect hidden prey buried in muddy sediments.',
    description: 'A large batoid ray with a elongated flattened rostrum lined with 22-29 pairs of sharp teeth on each side, utilized for hunting and self-defense.',
    quantumFeatures: [0.88, 0.10, 0.70, 0.98],
    svgPath: 'M5,48 L5,52 L80,52 L80,48 Z M80,50 Q110,30 160,35 T220,45 L270,30 Q280,50 270,70 L220,55 T160,65 Q110,70 80,50 Z M150,35 L165,15 L180,38',
    color: '#0f766e',
    viewBox: '0 0 300 100'
  },
  {
    id: 'humphead_wrasse',
    name: 'Humphead Wrasse',
    scientificName: 'Cheilinus undulatus',
    family: 'Labridae',
    iucnStatus: 'Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Steep outer reef slopes, channel drop-offs, pass edges, and shallow lagoon coral reefs up to 100 meters depth.',
    distribution: 'Indo-Pacific region, from Red Sea and East Africa to Tuamotu Archipelago, Coral Triangle, and Great Barrier Reef.',
    diet: 'Toxic sea hares, crown-of-thorns starfish, sea urchins, mollusks, crabs, and reef invertebrates (impervious to stings and toxins).',
    majorThreats: 'Targeted live reef food fish trade (LRFFT), destructive cyanide fishing, spear fishing, slow maturation rates, and coral reef bleaching.',
    conservationRecommendation: 'Strict CITES Appendix II trade controls, export quota enforcement in Indonesia and Malaysia, national bans on live trade, and marine protected area networks.',
    academicCitation: 'Russell, B. 2021. Cheilinus undulatus. The IUCN Red List of Threatened Species 2021: e.T4592A124976218.',
    funFact: 'They are protogynous hermaphrodites — some females transition into dominant blue-green males around 9 years of age.',
    description: 'A massive coral reef fish reaching lengths over 2 meters, identified by a prominent bulbous hump on its forehead, thick fleshy lips, and intricate wavy facial markings.',
    quantumFeatures: [0.72, 0.35, 0.82, 0.80],
    svgPath: 'M10,50 Q30,15 90,20 T180,35 Q220,40 250,42 L275,32 L275,68 L250,58 Q220,60 180,65 T90,80 Q30,85 10,50 Z M80,20 Q60,5 50,22',
    color: '#0284c7',
    viewBox: '0 0 300 100'
  },
  {
    id: 'chinese_sturgeon',
    name: 'Chinese Sturgeon',
    scientificName: 'Acipenser sinensis',
    family: 'Acipenseridae',
    iucnStatus: 'Critically Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Benthic riverbeds and coastal marine waters; spawns in upper Yangtze River over gravel substrates.',
    distribution: 'Yangtze River basin in China and coastal waters of the East China Sea and South China Sea.',
    diet: 'Benthic invertebrates, small fish, aquatic insects, aquatic worms, and crustaceans.',
    majorThreats: 'Hydroelectric dam construction (Gezhouba & Three Gorges blocking spawning migrations), overfishing, habitat degradation, water pollution, and river dredging.',
    conservationRecommendation: 'Total ban on commercial harvesting, artificial breeding & restocking, spawning bed habitat restoration below Gezhouba Dam, and CITES Appendix I protections.',
    academicCitation: 'Zhuang, P. et al. 2022. Acipenser sinensis. The IUCN Red List of Threatened Species 2022: e.T237A135848210.',
    funFact: 'Prehistoric bony fish known as "living fossils", existing continuously for over 140 million years with distinct armored scutes along their body.',
    description: 'A large, ancient benthic sturgeon with five rows of armored bony scutes, a toothless extendable mouth, and sensitive barbels used for detecting riverbed prey.',
    quantumFeatures: [0.92, 0.30, 0.85, 0.95],
    svgPath: 'M10,50 Q40,30 80,35 T150,45 Q180,48 200,42 T240,48 L270,30 Q280,50 270,70 L240,52 Q180,58 150,55 T80,65 Q40,70 10,50 Z M80,35 L90,25 L105,36',
    color: '#475569',
    viewBox: '0 0 300 100'
  },
  {
    id: 'devils_hole_pupfish',
    name: 'Devils Hole Pupfish',
    scientificName: 'Cyprinodon diabolis',
    family: 'Cyprinodontidae',
    iucnStatus: 'Critically Endangered',
    populationTrend: 'Decreasing',
    threatLevel: 'High',
    habitat: 'Extremely restricted geothermal limestone cavern spring (Devils Hole) in Death Valley National Park, Nevada, USA.',
    distribution: 'Single natural cavern pool shelf at Devils Hole, Nye County, Nevada, USA.',
    diet: 'Algae (Spirogyra), diatoms, organic detritus, and small aquatic invertebrates.',
    majorThreats: 'Groundwater depletion, geothermal water level fluctuations, flash flood siltation, and severe genetic bottlenecks.',
    conservationRecommendation: 'Captive breeding in refugia tanks, artificial flood protection, water table monitoring, and US Endangered Species Act critical habitat protection.',
    academicCitation: 'NatureServe. 2021. Cyprinodon diabolis. The IUCN Red List of Threatened Species 2021: e.T6212A3108600.',
    funFact: 'Considered the rarest fish in the world, living naturally in the smallest geographic habitat range of any known vertebrate on Earth.',
    description: 'A tiny, iridescent dark blue pupfish lacking pelvic fins, uniquely adapted to survive in warm (33°C), low-oxygen geothermal cavern spring waters.',
    quantumFeatures: [0.15, 0.05, 0.10, 0.99],
    svgPath: 'M20,50 Q40,25 90,30 T180,40 Q210,42 230,38 L250,28 L250,72 L230,62 Q210,60 180,62 T90,70 Q40,75 20,50 Z M100,30 L115,18 L130,32',
    color: '#3b82f6',
    viewBox: '0 0 300 100'
  }
];

export const CLOSED_SET_5_SPECIES = CLOSED_SET_6_SPECIES;

export const UNKNOWN_SPECIES: FishSpecies = {
  id: 'unknown_species',
  name: 'Unknown Species',
  scientificName: 'Unclassified / Out-of-Distribution',
  family: 'Unrecognized / Non-Target',
  iucnStatus: 'Least Concern',
  populationTrend: 'Unknown',
  threatLevel: 'Low',
  habitat: 'Not found in the closed-set trained endangered marine database.',
  distribution: 'Out-of-Distribution / Non-target aquatic organism',
  diet: 'N/A',
  majorThreats: 'N/A',
  conservationRecommendation: 'This species is not included in the trained endangered marine fish database.',
  academicCitation: 'Verified against 6-Species Closed Set Classifier (YOLOv8 + CBAM + IBM Qiskit VQC).',
  funFact: 'Our real closed-set model is strictly trained on 6 target species: Whale Shark, Scalloped Hammerhead Shark, Smalltooth Sawfish, Humphead Wrasse, Chinese Sturgeon, and Devils Hole Pupfish. Images outside this set or with confidence < 70% are classified as Unknown Species.',
  description: 'This species is not included in the trained endangered marine fish database.',
  quantumFeatures: [0.0, 0.0, 0.0, 0.0],
  svgPath: 'M50,50 M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50',
  color: '#64748b',
  viewBox: '0 0 100 100'
};

export const ENDANGERED_SPECIES_20 = CLOSED_SET_6_SPECIES;
export const FISH_DATA_LIST = CLOSED_SET_6_SPECIES;
