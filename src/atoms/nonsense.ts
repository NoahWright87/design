/**
 * Nonsense Atom - Whimsical placeholder copy generator
 * See specs/atoms/nonsense.spec.md for full specification
 */

// Data pools for each category
const shortTitles = [
  "Circular Thinking",
  "Blue Momentum",
  "Silent Protocol",
  "Quantum Drift",
  "Echo Nexus",
  "Cascade Theory",
  "Vivid Syntax",
  "Parallel Harmony",
  "Fluid Logic",
  "Radiant Context",
  "Sublime Vector",
  "Cosmic Refactor",
];

const longTitles = [
  "Empowering Teams Through Data Visualization",
  "Building Tomorrow's Interfaces with Yesterday's Ideas",
  "Transforming Chaos into Strategic Advantage",
  "Crafting Experiences That Resonate Beyond Pixels",
  "Unlocking Potential Through Collaborative Innovation",
  "Designing Systems That Think Ahead",
  "Bridging the Gap Between Intent and Outcome",
  "Elevating Human Connection Through Digital Spaces",
  "Redefining Success One Iteration at a Time",
  "Making Complexity Feel Effortless",
];

const shortParagraphs = [
  "We believe in pushing boundaries while staying grounded in reality. Every project is an opportunity to explore new patterns and challenge conventional thinking.",
  "Our approach combines intuitive design with rigorous execution. We focus on what matters most: delivering value that lasts.",
  "Innovation isn't about doing more—it's about doing what counts. We strip away the noise and amplify the signal.",
  "Great work emerges from the intersection of curiosity and discipline. We bring both to every engagement.",
  "We're here to build things that make sense, even when the requirements don't. That's the art of the craft.",
  "Collaboration fuels everything we do. Ideas improve when they're tested, refined, and reimagined together.",
  "Simplicity is our north star. The best solutions feel obvious in hindsight.",
  "We thrive in complexity but deliver in clarity. That's the promise we keep.",
  "Every detail tells a story. We make sure it's the right one.",
  "Progress happens when you question assumptions and follow through with conviction.",
];

const longParagraphs = [
  "In today's fast-paced environment, the ability to adapt and iterate quickly separates the successful from the static. We've spent years refining processes that embrace change as a constant, allowing us to pivot without losing momentum. Our methodology isn't prescriptive—it's responsive, flexible, and designed to meet you where you are. Whether you're scaling up or starting fresh, our focus remains on sustainable growth and meaningful outcomes.",
  "The best experiences don't shout for attention—they earn it through thoughtful design and genuine utility. We've cultivated a deep understanding of how people interact with digital products, and we use that knowledge to craft interfaces that feel natural and inviting. Every interaction is an opportunity to build trust, and every element serves a purpose. We don't add features for the sake of it; we add value.",
  "Success in this space requires more than technical skill. It demands empathy, vision, and a willingness to experiment. We've built our reputation on being partners, not just vendors. When you work with us, you gain access to a team that's as invested in your goals as you are. We listen, we challenge, we collaborate—and together, we create work that stands the test of time.",
  "Navigating uncertainty is part of the job, and we've gotten quite good at it. Rather than resisting ambiguity, we've learned to thrive in it. Our frameworks encourage exploration while maintaining structure. We move fast but never recklessly. By balancing creative freedom with strategic discipline, we consistently deliver results that exceed expectations.",
  "Quality isn't an afterthought—it's baked into everything we do from day one. Our standards are high because we believe excellence is the only option. But we're also pragmatic. We know that done is better than perfect, and we're skilled at finding the sweet spot between polish and progress. That's how we ship on time without cutting corners.",
];

const personNames = [
  "Morgan Vex",
  "Jamie Stohl",
  "Alex Ren",
  "Casey Lumen",
  "Taylor Finch",
  "Jordan Peak",
  "Avery Moss",
  "Quinn Arlo",
  "Skyler Wynn",
  "River Hale",
  "Sage Bellamy",
  "Rowan Nash",
];

const companyNames = [
  "Synapse Labs",
  "Echo & Co",
  "Vertex Dynamics",
  "Catalyst Group",
  "Meridian Systems",
  "Apex Innovations",
  "Prism Ventures",
  "Zenith Solutions",
  "Beacon Industries",
  "Horizon Partners",
  "Nexus Corp",
  "Summit Enterprises",
  "Orion Creative",
  "Pulse Technologies",
];

const jobTitles = [
  "Lead Vibe Architect",
  "Chaos Coordinator",
  "Senior Narrative Engineer",
  "Chief Paradox Officer",
  "Principal Context Designer",
  "Director of Subtle Disruption",
  "VP of Ambiguous Excellence",
  "Head of Thoughtful Mayhem",
  "Senior Momentum Strategist",
  "Lead Curiosity Engineer",
  "Chief Iteration Specialist",
  "Principal Harmony Facilitator",
];

const awardNames = [
  "Golden Insight Award",
  "Innovator's Circle Badge",
  "Excellence in Ambiguity Prize",
  "Thoughtful Execution Trophy",
  "Clarity Champion Award",
  "Strategic Vision Medal",
  "Collaboration Excellence Badge",
  "Impact Pioneer Certificate",
  "Creative Catalyst Award",
  "Outstanding Achievement in Progress",
];

const projectNames = [
  "Wavelength",
  "Nexus Proto",
  "Cascade",
  "Lumina",
  "Velocity",
  "Prism",
  "Momentum",
  "Horizon",
  "Echo Platform",
  "Zenith Initiative",
  "Vortex System",
  "Radiant Interface",
];

const skillNames = [
  "Intent Mapping",
  "Color Psychology",
  "Responsive Architecture",
  "System Thinking",
  "Pattern Recognition",
  "Strategic Improvisation",
  "Context Design",
  "Rapid Prototyping",
  "User Empathy",
  "Visual Hierarchy",
  "Interaction Flow",
  "Accessibility Optimization",
  "Performance Tuning",
  "Component Architecture",
];

const serviceNames = [
  "Brand Harmonization",
  "Strategic Insight Delivery",
  "Experience Refinement",
  "Digital Transformation Guidance",
  "Interface Optimization",
  "Collaborative Innovation Workshops",
  "System Architecture Consulting",
  "User Journey Mapping",
  "Product Vision Alignment",
  "Iterative Design Sprints",
];

const testimonialQuotes = [
  "Working with them transformed how we think about our product. The clarity they brought was invaluable.",
  "They didn't just build what we asked for—they helped us understand what we actually needed.",
  "Every interaction felt collaborative and purposeful. We couldn't have asked for better partners.",
  "They turned our vague ideas into a cohesive strategy that everyone could rally behind.",
  "The attention to detail was extraordinary, but they never lost sight of the big picture.",
  "Our users noticed the difference immediately. Engagement skyrocketed after launch.",
  "They challenged us in all the right ways and guided us through the ambiguity with confidence.",
  "We were amazed at how quickly they understood our domain and started adding value.",
];

const accomplishments = [
  "Tripled team morale through interpretive meetings",
  "Solved invisible problems with aggressive optimism",
  "Unified conflicting timelines via emoji consensus",
  "Reduced complexity by 47% using only vibes",
  "Implemented groundbreaking solution that already exists",
  "Achieved unprecedented levels of documented assumptions",
  "Streamlined workflow by introducing three new layers",
  "Revolutionized onboarding with mandatory fun",
  "Discovered new ways to measure intangible success",
  "Built consensus through strategic ambiguity",
  "Elevated standards by lowering expectations",
  "Created synergy by redefining what synergy means",
];

const introTexts = [
  "Welcome! We're passionate about building things that matter and making an impact that lasts. Let's create something extraordinary together.",
  "Hi there! We combine creativity with strategy to deliver experiences that resonate. Ready to get started?",
  "Great to have you here. We're all about turning ideas into reality—no fluff, just results.",
  "Welcome aboard! We believe that the best work emerges from collaboration, curiosity, and a commitment to excellence.",
  "Hello! Our mission is simple: craft solutions that feel natural, work brilliantly, and stand the test of time.",
];

const ctaTexts = [
  "Unlock the Chaos",
  "Begin the Journey",
  "Dive Deeper",
  "Explore Further",
  "Let's Connect",
  "Get Started",
  "Discover More",
  "Join the Movement",
  "See What's Possible",
  "Take the Next Step",
  "Learn More",
  "Get in Touch",
];

const socialSiteNames = [
  "SpaceBook",
  "ThoughtWave",
  "VortexNow",
  "Nexus Chat",
  "Echo Sphere",
  "Pulse Network",
  "Horizon Hub",
  "Beacon Social",
  "Prism Connect",
  "Momentum Feed",
];

/**
 * Generate a simple abstract SVG as a data URL
 */
function generateAbstractSvg(seed?: string): string {
  const hash = seed ? simpleHash(seed) : Math.random();
  const hue = Math.floor(hash * 360);
  const shapes = [];
  
  // Generate 3-5 random shapes
  const numShapes = 3 + Math.floor((hash * 3) % 3);
  for (let i = 0; i < numShapes; i++) {
    const shapeHash = (hash * (i + 1) * 7919) % 1;
    const cx = 10 + (shapeHash * 80);
    const cy = 10 + ((shapeHash * 13) % 1) * 80;
    const r = 15 + ((shapeHash * 17) % 1) * 25;
    const shapeHue = (hue + i * 60) % 360;
    const opacity = 0.3 + (shapeHash * 0.4);
    
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${shapeHue}, 70%, 60%)" opacity="${opacity}" />`
    );
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${shapes.join('')}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Simple hash function for seeded randomness
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

/**
 * Generate a realistic date or date range
 */
function generateDate(options?: { months?: number; seed?: string }): string {
  const months = options?.months || 24;
  const hash = options?.seed ? simpleHash(options.seed) : Math.random();
  
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);
  
  // Random duration between 12-48 months
  const durationMonths = 12 + Math.floor((hash * 36) % 37);
  const monthsAgo = Math.floor((hash * months) % months);
  
  startDate.setMonth(startDate.getMonth() - monthsAgo - durationMonths);
  endDate.setMonth(endDate.getMonth() - monthsAgo);
  
  const formatDate = (date: Date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(arr: T[], seed?: string): T {
  const hash = seed ? simpleHash(seed) : Math.random();
  return arr[Math.floor(hash * arr.length) % arr.length];
}

/**
 * Get a weighted random item from an array.
 * weights must be the same length as arr; higher values increase probability.
 */
function weightedRandomItem<T>(arr: T[], weights: number[], seed?: string): T {
  const total = weights.reduce((a, b) => a + b, 0);
  const hash = seed ? simpleHash(seed) : Math.random();
  let threshold = hash * total;
  for (let i = 0; i < arr.length; i++) {
    threshold -= weights[i];
    if (threshold <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

/**
 * Get multiple random items from an array
 */
function randomItems<T>(arr: T[], count: number, seed?: string, weights?: number[]): T[] {
  const results: T[] = [];
  for (let i = 0; i < count; i++) {
    const itemSeed = seed ? `${seed}-${i}` : undefined;
    results.push(weights ? weightedRandomItem(arr, weights, itemSeed) : randomItem(arr, itemSeed));
  }
  return results;
}

const moodEmojis = [
  "😊", "🤔", "🎯", "🔥", "✨", "💡", "🚀", "🎉",
  "👀", "💪", "🌟", "🎨", "🤩", "😎", "🧠", "💫",
];

const skillEmojis = [
  "⚡", "🛠️", "🔧", "💻", "📊", "🎯", "🔍", "📐",
  "🧩", "🔬", "📈", "🤝", "🎓", "🏆", "🔑", "📌",
];

export type NonsenseCategory =
  | 'shortTitle'
  | 'longTitle'
  | 'shortParagraph'
  | 'longParagraph'
  | 'personName'
  | 'companyName'
  | 'jobTitle'
  | 'awardName'
  | 'projectName'
  | 'skillName'
  | 'serviceName'
  | 'testimonialQuote'
  | 'accomplishment'
  | 'introText'
  | 'ctaText'
  | 'socialSiteName'
  | 'abstractImage'
  | 'date'
  | 'moodEmoji'
  | 'skillEmoji';

export interface NonsenseOptions {
  count?: number;
  seed?: string;
  months?: number; // For date category only
  /**
   * Override the built-in entry pool for this category with your own strings.
   * Ignored for function-based categories (`abstractImage`, `date`).
   */
  customEntries?: string[];
  /**
   * Relative weights for each entry in the pool (or `customEntries`).
   * Must be the same length as the active pool. Higher values make that entry
   * more likely to be selected. Ignored for function-based categories.
   * Example: `[1, 3, 1]` makes the second entry 3× more likely.
   */
  weights?: number[];
}

/**
 * Get nonsense copy for a given category
 */
export function getNonsense(
  category: NonsenseCategory,
  options?: NonsenseOptions
): string | string[] {
  const { count, seed, customEntries, weights } = options || {};

  const categoryMap: Record<NonsenseCategory, string[] | (() => string)> = {
    shortTitle: shortTitles,
    longTitle: longTitles,
    shortParagraph: shortParagraphs,
    longParagraph: longParagraphs,
    personName: personNames,
    companyName: companyNames,
    jobTitle: jobTitles,
    awardName: awardNames,
    projectName: projectNames,
    skillName: skillNames,
    serviceName: serviceNames,
    testimonialQuote: testimonialQuotes,
    accomplishment: accomplishments,
    introText: introTexts,
    ctaText: ctaTexts,
    socialSiteName: socialSiteNames,
    moodEmoji: moodEmojis,
    skillEmoji: skillEmojis,
    abstractImage: () => generateAbstractSvg(seed),
    date: () => generateDate({ months: options?.months, seed }),
  };

  const source = categoryMap[category];

  if (typeof source === 'function') {
    // Function-based categories (abstractImage, date) don't support customEntries
    if (count) {
      return Array.from({ length: count }, () => source());
    }
    return source();
  }

  // Array-based categories: prefer customEntries when provided
  const pool = customEntries && customEntries.length > 0 ? customEntries : source;

  // Validate weights length if provided
  const activeWeights = weights && weights.length === pool.length ? weights : undefined;

  if (count) {
    return randomItems(pool, count, seed, activeWeights);
  }

  return activeWeights ? weightedRandomItem(pool, activeWeights, seed) : randomItem(pool, seed);
}
