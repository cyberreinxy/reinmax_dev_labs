// --- Core Site Information ---
// Extracted from HTML meta tags and content structure.
export const siteKnowledge = {
  company: {
    name: "Reinmax Creative",
    description:
      "A design agency that specializes in creating unforgettable brands and digital experiences.",
    location: "Tanzania", // Mentioned in keywords/context
    registration: "BRELA No: 56**1", // From footer
    email: "mail@reinmaxcreative.com", // Assumed standard, not directly in HTML provided but in original KB
    phone: "+255 678 700 731", // Assumed standard, not directly in HTML provided but in original KB
    author:
      "Reinhard Baraka, CEO and Founder of Reinmax Creative & Design Agency", // From meta tag
    keywords: [
      // From meta tag
      "creative agency Tanzania",
      "graphic design services",
      "professional logo design",
      "brand identity design",
      "UI/UX design experts",
      "modern web design Tanzania",
      "custom illustration services",
      "motion graphics studio",
      "poster design Dodoma",
      "company profile design",
      "branding solutions for startups",
      "digital experiences agency",
      "visual storytelling experts",
      "creative courses online",
      "graphic design Dodoma",
      "web design Tanzania",
      "social media branding",
      "affordable design packages",
      "creative studio Africa",
    ],
  },
  team: [
    // Extracted from #team section
    {
      name: "Reinhard Baraka",
      role: "Creative Designer & Founder", // Role from original KB, description from HTML
      description:
        "The visionary force setting the creative standards for our agency and the brands we partner with.",
      social: {
        // Extracted from links under Reinhard's card
        instagram: "https://www.instagram.com/reinmax_creative/",
        twitter: "https://x.com/reinmaxstudio/",
        github: "https://github.com/cyberreinxy/",
      },
    },
    {
      name: "Henry Binamungu",
      role: "Brand Strategist", // Role from original KB, description from HTML
      description:
        "The strategic force behind our brand narratives, crafting the core stories for brands.",
      social: {
        // Assume same social links as company for consistency unless specified
        instagram: "https://www.instagram.com/reinmax_creative/",
        twitter: "https://x.com/reinmaxstudio/",
        github: "https://github.com/cyberreinxy/", // Placeholder, adjust if different
      },
    },
    {
      name: "Klerry Tumsiime",
      role: "Developer", // Role from original KB, description from HTML
      description:
        "The engineering force behind our digital work, web engineering and interactive experiences.",
      social: {
        // Assume same social links as company
        instagram: "https://www.instagram.com/reinmax_creative/",
        twitter: "https://x.com/reinmaxstudio/",
        github: "https://github.com/cyberreinxy/", // Placeholder, adjust if different
      },
    },
    {
      name: "Maggie Shayo",
      role: "Creative Designer", // Role from original KB, description from HTML
      description:
        "The creative force behind our visual output, designing stunning assets.",
      social: {
        // Assume same social links as company
        instagram: "https://www.instagram.com/reinmax_creative/",
        twitter: "https://x.com/reinmaxstudio/",
        github: "https://github.com/cyberreinxy/", // Placeholder, adjust if different
      },
    },
  ],
  philosophy: [
    // Extracted from #cores section
    {
      name: "Innovation",
      description:
        "We constantly push boundaries, exploring new tech and creative solutions.",
    },
    {
      name: "Excellence",
      description:
        "Committed to the highest standards, ensuring every detail is perfected.",
    },
    {
      name: "Collaboration",
      description:
        "The best ideas are born from partnership. We work closely with our clients.",
    },
    {
      name: "Integrity",
      description:
        "Operating with transparency and honesty, building trust with our clients.",
    },
  ],
  services: [
    // Extracted from #services section cards
    {
      name: "Brand Identity",
      description:
        "Comprehensive branding solutions that define and elevate your presence.", // Combined info
      details:
        "In a crowded market, a distinctive brand is your greatest asset. Logos and brand identities serve as the visual heartbeat of a business, carefully crafted to uncover its core values and translate them into a cohesive story that resonates with audiences and leaves a lasting impression.", // From #projects section explanation
    },
    {
      name: "Web UI Design", // Renamed from "UI/UX Design" for consistency with HTML card title
      description:
        "Intuitive and beautiful user interfaces that provide a seamless user experience.",
      details:
        "Strong graphic and interface design goes beyond aesthetics. Every visual element is intentionally created to engage the audience, convey information clearly, and provide a seamless, intuitive experience that strengthens brand perception across both digital and print platforms.", // From #projects graphic design card (related)
    },
    {
      name: "Illustration",
      description:
        "Custom illustrations that add a unique and personal touch to your brand.",
      details:
        "Illustrations breathe life into a brand’s narrative. Each piece of custom artwork is designed to reflect the brand’s personality, capture attention, and communicate ideas in a way that evokes emotion, making the message unforgettable and visually compelling.", // From #projects section explanation
    },
    {
      name: "Motion Graphics",
      description:
        "Engaging animations and motion graphics that bring your brand's story to life.",
      details:
        "Motion graphics turn static ideas into dynamic visual stories. Through carefully timed animations and creative movement, concepts are brought to life in a way that captivates viewers, emphasizes key messages, and enhances the overall impact of the brand’s communication.", // From #projects section explanation
    },
    // Added based on #projects section card titles
    {
      name: "Logo Design",
      description:
        "Crafting distinctive logos that serve as the visual heartbeat of a business.",
      details:
        "In a crowded market, a distinctive brand is your greatest asset. Logos and brand identities serve as the visual heartbeat of a business, carefully crafted to uncover its core values and translate them into a cohesive story that resonates with audiences and leaves a lasting impression.",
    },
    {
      name: "Graphic Design",
      description:
        "Intentional visual elements to engage audiences and convey information clearly.",
      details:
        "Strong graphic and interface design goes beyond aesthetics. Every visual element is intentionally created to engage the audience, convey information clearly, and provide a seamless, intuitive experience that strengthens brand perception across both digital and print platforms.",
    },
  ],
  workflow: [
    // Extracted from #workflow section
    {
      step: 1,
      name: "The Creative Brief",
      description:
        "We collect detailed information about your brand, goals, target audience, and vision to establish a clear strategic foundation for the project.",
    },
    {
      step: 2,
      name: "Research & Strategy",
      description:
        "We conduct comprehensive research on market trends, competitors, and audience preferences. Insights from this research inform a strategic approach tailored to your brand.",
    },
    {
      step: 3,
      name: "Concept Development",
      description:
        "We explore a range of unique ideas and creative directions, presenting you with distinct concepts that tell your brand’s story.",
    },
    {
      step: 4,
      name: "Sketching & Designing",
      description:
        "The chosen concept is transformed into polished, high-quality designs, focusing on aesthetics, usability, and functionality to ensure the final product represents your brand perfectly.",
    },
    {
      step: 5,
      name: "Client Feedback",
      description:
        "We present the designs for your feedback and collaborate closely to refine and adjust every detail. This iterative process ensures the final design aligns with your vision.",
    },
    {
      step: 6,
      name: "Asset Delivery",
      description:
        "Deliver all finalized assets in appropriate formats, production-ready and a detailed brand guidelines, empowering your team to maintain brand consistency.",
    },
  ],
  brandingPlans: [
    // Extracted from #pricing section
    {
      name: "Twiga Plan",
      tier: "Essential",
      price: "150,000 TZS",
      target:
        "Individuals, startups, or small businesses getting off the ground",
      features: [
        // Extracted from HTML list items under the plan
        "Two Logo Concept",
        "Up to 2 Revision Rounds",
        "Basic Logo Mockups",
        "PNG & Source File",
        "Editable Source File",
        "Essential Brand Guidelines",
      ],
    },
    {
      name: "Simba Plan",
      tier: "Professional",
      price: "200,000 TZS",
      target: "Growing businesses that needs a professional brand identity",
      features: [
        // Extracted from HTML list items under the plan
        "Multiple Logo Concepts",
        "Up to 3 Revision Rounds",
        "Professional Logo Mockups",
        "PNG, JPG, SVG & Source File",
        "Social Media Mockups",
        "Professional Brand Guidelines",
      ],
    },
    {
      name: "Tembo Plan",
      tier: "Enterprise",
      price: "Custom Quote",
      target: "Well-established companies that require full-scale strategy",
      features: [
        // Extracted from HTML list items under the plan
        "Full Logo Variations",
        "Unlimited Revisions",
        "Iconography & Illustrations",
        "Premium Marketing Materials",
        "Brand Strategy Consultation",
        "Comprehensive Brand Guidelines",
      ],
    },
  ],
  academyCourses: [
    // Extracted from #pricing section (Academy part)
    {
      name: "Adobe Illustrator",
      level: "Beginner - Professional",
      price: "60,000 TZS",
      description:
        "Master the industry-standard tool for vector graphics, from basic shapes to complex illustrations.",
      topics: [
        // Extracted from HTML list items under the course
        "Mastery of Vector Graphics",
        "Professional Logo & Icon Design",
        "Advanced Typography & Layout",
        "Creative Color Theory & Gradients",
        "Exporting for Web & Print",
      ],
    },
    {
      name: "Adobe Photoshop",
      level: "Beginner - Professional",
      price: "50,000 TZS",
      description:
        "Unlock the power of photo editing, digital compositing, and graphic design.",
      topics: [
        // Extracted from HTML list items under the course
        "Advanced Photo Retouching",
        "Layer & Masking Techniques",
        "Graphic Design Fundamentals",
        "Social Media Design",
        "Intro to Digital Painting",
      ],
    },
    {
      name: "Figma",
      level: "Beginner - Professional",
      price: "55,000 TZS",
      description:
        "Design and prototype modern interfaces from the ground up using collaborative tools.", // Slightly adapted from HTML
      topics: [
        // Extracted from HTML list items under the course
        "UI/UX Design Fundamentals",
        "Interactive Prototyping",
        "Design Systems",
        "Collaboration Tools",
        "Component Libraries",
      ],
    },
    // Added Adobe Premiere Pro based on footer link (assuming it's a course)
    {
      name: "Adobe Premiere Pro",
      level: "Unknown", // Level not specified in HTML
      price: "Unknown", // Price not specified in HTML
      description: "Learn professional video editing techniques.", // Placeholder description
      topics: [], // Topics not specified
    },
  ],
  socialLinks: {
    // Extracted from footer
    instagram: "https://instagram.com/reinmax_creative",
    behance: "https://behance.net/reinmaxcreative",
    dribbble: "https://dribbble.com/reinmaxcreative",
    youtube: "https://youtube.com/@reinmaxcreative", // Updated based on HTML
    twitter: "https://x.com/reinmaxstudio/", // From team card links
  },
  resources: [
    // Extracted from footer
    { name: "Free Templates", url: "#" }, // URL placeholder based on HTML
    { name: "Icon Library", url: "#" }, // URL placeholder based on HTML
    { name: "TimeScript", url: "https://timescript.vercel.app/" },
    { name: "Image Editor", url: "https://megascale.vercel.app/" },
  ],
  legal: [
    // Extracted from footer
    { name: "Privacy Policy", url: "#" },
    { name: "Terms of Service", url: "#" },
    { name: "Cookie Policy", url: "#" },
    { name: "Sitemap", url: "#" },
  ],
};

// --- Fallback Responses ---
// This section defines pre-canned responses for the local fallback system.
// IMPORTANT: These responses MUST follow the formatting rules defined in api-endpoint.js
// (Use <strong>, no bullets).
const knowledgeBase = {
  team: {
    keywords: [
      "team",
      "who",
      "people",
      "staff",
      "members",
      "founder",
      "ceo",
      "designer",
      "developer",
      "Reinhard",
      "Henry",
      "Klerry",
      "Maggie",
    ],
    response: () => {
      const team = siteKnowledge.team
        .map((t) => `<strong>${t.name}</strong> (${t.role}) - ${t.description}`)
        .join("\n\n"); // Use double newline for separation
      return `Meet our creative force:\n\n${team}\n\nReady to work with us? <strong>Book a call</strong>!`;
    },
    relatedTopics: ["about", "contact"],
    category: "info",
  },
  philosophy: {
    keywords: [
      "philosophy",
      "values",
      "core",
      "believe",
      "principles",
      "approach",
      "why",
      "innovation",
      "excellence",
      "collaboration",
      "integrity",
    ],
    response: () => {
      const values = siteKnowledge.philosophy
        .map((p) => `<strong>${p.name}</strong> - ${p.description}`)
        .join("\n\n"); // Use double newline
      return `Our brand philosophy:\n\n${values}\n\nLet's create something amazing! <strong>Book a call</strong>`;
    },
    relatedTopics: ["about", "services"],
    category: "info",
  },
  workflow: {
    keywords: [
      "process",
      "workflow",
      "how it works",
      "steps",
      "procedure",
      "methodology",
      "how do you work",
      "creative brief",
      "research",
      "strategy",
      "concept development",
      "sketching",
      "designing",
      "client feedback",
      "asset delivery",
    ],
    response: () => {
      const steps = siteKnowledge.workflow
        .map((w) => `<strong>${w.step}. ${w.name}</strong>\n${w.description}`)
        .join("\n\n"); // Use double newline
      return `Our proven 6-step workflow:\n\n${steps}\n\nReady to start? <strong>Book a call</strong>!`;
    },
    relatedTopics: ["services", "timeline"],
    category: "info",
  },
  pricing: {
    keywords: [
      "pricing",
      "price",
      "cost",
      "how much",
      "package",
      "plan",
      "plans",
      "afford",
      "Twiga",
      "Simba",
      "Tembo",
      "TZS",
    ],
    response: () => {
      const plans = siteKnowledge.brandingPlans
        .map(
          (p) =>
            `<strong>${p.name}</strong> (${p.tier}) - ${p.price}\n${p.target}`,
        )
        .join("\n\n"); // Use double newline
      return `Our branding plans:\n\n${plans}\n\n<strong>Book a call</strong> to discuss which plan fits your needs!`;
    },
    relatedTopics: ["services", "booking"],
    category: "pricing",
  },
  academy: {
    keywords: [
      "academy",
      "course",
      "courses",
      "learn",
      "training",
      "education",
      "teach",
      "class",
      "Illustrator",
      "Photoshop",
      "Figma",
      "Premiere Pro",
    ],
    response: () => {
      const courses = siteKnowledge.academyCourses
        .map(
          (c) =>
            `<strong>${c.name}</strong> - ${
              c.price === "Unknown" ? "Contact for details" : c.price
            }\n${c.description}`,
        )
        .join("\n\n"); // Use double newline
      return `Our academy courses:\n\n${courses}\n\nInterested? <strong>Book a call</strong> or enroll directly!`;
    },
    relatedTopics: ["pricing"],
    category: "academy",
  },
  contact: {
    keywords: [
      "contact",
      "reach",
      "email",
      "phone",
      "call",
      "talk",
      "speak",
      "get in touch",
      "reach out",
      "location",
      "address",
    ],
    response: () => {
      return `Let's connect!\n\n${siteKnowledge.company.email} | ${siteKnowledge.company.phone}\nBased in ${siteKnowledge.company.location}\n\nOr simply <strong>book a call</strong> right here!`;
    },
    relatedTopics: ["booking"],
    category: "contact",
  },
  booking: {
    keywords: [
      "book",
      "schedule",
      "appointment",
      "meeting",
      "consultation",
      "discuss",
      "meet",
      "talk to someone",
    ],
    response: () =>
      "I'd love to help you schedule a call with our team!\n\nWhat's your <strong>full name</strong>?",
    action: "start_booking", // Special flag for the local system
    category: "booking",
  },
  about: {
    keywords: [
      "about",
      "who are you",
      "company",
      "reinmax",
      "background",
      "history",
      "agency",
    ],
    response: () => {
      return `We're <strong>${siteKnowledge.company.name}</strong> - ${siteKnowledge.company.description}.\n\nBased in ${siteKnowledge.company.location}, we're passionate about helping brands grow through strategic design!\n\n<strong>Book a call</strong> to work together!`;
    },
    relatedTopics: ["services", "team", "philosophy"],
    category: "info",
  },
  greeting: {
    keywords: [
      "hello",
      "hi",
      "hey",
      "greetings",
      "good morning",
      "good afternoon",
      "good evening",
      "how are you",
      "what can you do",
    ],
    response: () =>
      `Hello! I'm Bitto, your assistant at ${siteKnowledge.company.name}.\n\nI can help you:\nLearn about our <strong>services</strong>\nCheck <strong>pricing</strong>\n<strong>Book a call</strong>\nAnswer questions\n\nWhat brings you here today?`, // Removed bullet points
    relatedTopics: ["services", "pricing", "booking"],
    category: "greeting",
  },
  thanks: {
    keywords: ["thank", "thanks", "appreciate", "grateful", "ok", "got it"],
    response: () =>
      "You're very welcome!\n\nIs there anything else I can help you with?",
    category: "pleasantry",
  },
  services: {
    keywords: [
      "service",
      "services",
      "offer",
      "offerings",
      "do",
      "provide",
      "help with",
      "specialize",
      "brand identity",
      "branding",
      "logo",
      "logos",
      "web ui",
      "web design",
      "website",
      "illustration",
      "drawing",
      "motion graphics",
      "animation",
      "video",
      "graphic design",
    ],
    response: () => {
      const services = siteKnowledge.services
        // Filter out duplicates if description is very similar, e.g., Logo vs Brand Identity might overlap
        .filter(
          (service, index, self) =>
            index ===
            self.findIndex(
              (s) =>
                s.name === service.name ||
                s.description === service.description,
            ),
        )
        .map((s) => `<strong>${s.name}</strong> - ${s.description}`)
        .join("\n\n"); // Use double newline for separation
      return `We are experts in bringing brands to life through design and motion. Our core services are:\n\n${services}\n\nIs there a specific service you'd like to know more about, like <strong>Brand Identity</strong> or <strong>Web UI Design</strong>?`;
    },
    relatedTopics: ["workflow", "pricing", "portfolio"],
    category: "services",
  },
  portfolio: {
    // Extracted from #projects section description
    keywords: [
      "portfolio",
      "work",
      "projects",
      "examples",
      "case studies",
      "seen",
      "show me",
      "gallery",
    ],
    response: () =>
      "You can view our portfolio of selected projects on our main website. We've worked with a diverse range of clients to create impactful brand identities and digital experiences. Would you like me to point you to our <strong>workflow</strong> to see how we do it?",
    relatedTopics: ["workflow", "services"],
    category: "info",
  },
  timeline: {
    keywords: [
      "timeline",
      "how long",
      "duration",
      "fast",
      "project length",
      "turnaround",
      "schedule",
    ],
    response: () =>
      "Project timelines can vary based on complexity. A typical <strong>Brand Identity</strong> project takes about 2-4 weeks from brief to delivery. Web design projects are more variable. For a precise estimate, it's best to <strong>book a call</strong> with our team to discuss your specific needs!",
    relatedTopics: ["workflow", "booking", "pricing"],
    category: "info",
  },
  technology: {
    // Based on academy courses
    keywords: [
      "tech",
      "technology",
      "tools",
      "software",
      "stack",
      "figma",
      "illustrator",
      "photoshop",
      "premiere pro",
    ],
    response: () =>
      "Our design team primarily uses industry-standard tools like <strong>Figma</strong> for UI/UX design, and the <strong>Adobe Creative Suite</strong> (Illustrator, Photoshop, After Effects, Premiere Pro) for branding, illustration, motion graphics, and video editing. We also offer courses in some of these tools in our <strong>academy</strong>!",
    relatedTopics: ["academy", "services"],
    category: "info",
  },
  resources: {
    // Based on footer links
    keywords: [
      "resources",
      "free",
      "templates",
      "icons",
      "timescript",
      "image editor",
    ],
    response: () => {
      const resourceList = siteKnowledge.resources
        .map(
          (r) =>
            `<strong>${r.name}</strong>` +
            (r.url !== "#"
              ? " (available on our website)"
              : " (available on our website)"),
        ) // Avoid direct links per rules
        .join("\n");
      return `We offer several resources on our website:\n\n${resourceList}\n\nYou can find these under the Resources section in our site footer.`;
    },
    relatedTopics: ["academy", "services"],
    category: "info",
  },
  social: {
    // Based on footer links
    keywords: [
      "social media",
      "instagram",
      "behance",
      "dribbble",
      "youtube",
      "twitter",
      "x",
    ],
    response: () => {
      const links = Object.entries(siteKnowledge.socialLinks)
        .map(
          ([platform, url]) =>
            platform.charAt(0).toUpperCase() + platform.slice(1),
        ) // Just list platforms
        .join(", ");
      return `You can find us on ${links}. Check out our site footer for direct links!`;
    },
    relatedTopics: ["contact", "portfolio"],
    category: "info",
  },
  legal: {
    // Based on footer links
    keywords: ["legal", "privacy", "terms", "cookies", "sitemap", "policy"],
    response: () => {
      const legalPages = siteKnowledge.legal.map((l) => l.name).join(", ");
      return `You can find information about our ${legalPages} on our website, typically linked in the footer.`;
    },
    relatedTopics: ["about"],
    category: "info",
  },
  clarification: {
    // General fallback for vague requests
    keywords: ["help", "info", "details", "more", "tell me about", "what else"],
    response: () =>
      "I can certainly help with that! To give you the best information, could you be a bit more specific? For example, are you interested in our <strong>services</strong>, <strong>pricing</strong>, or our creative <strong>process</strong>?",
    relatedTopics: ["services", "pricing", "workflow"],
    category: "utility",
  },
};

// --- Helper Functions ---

// Normalizes text for keyword matching (lowercase, remove punctuation, collapse whitespace)
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation, keep alphanumeric and space
    .replace(/\s+/g, " ") // Collapse multiple spaces to one
    .trim();
}

// Calculates a relevance score based on keyword matches in user input
function calculateRelevanceScore(userInput, keywords) {
  const normalizedInput = normalizeText(userInput);
  const inputWords = normalizedInput.split(" ");
  let score = 0;

  keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    // Boost score significantly for exact phrase match
    if (normalizedInput.includes(normalizedKeyword)) {
      score += normalizedKeyword.length * 3; // Weight by length, emphasize phrase
    }

    // Add score for individual word matches within the keyword phrase
    const keywordWords = normalizedKeyword.split(" ");
    keywordWords.forEach((kw) => {
      if (inputWords.includes(kw)) {
        score += kw.length; // Weight by word length
      }
    });
  });
  return score;
}

// Finds the best matching knowledge base entry for the user input
function findBestMatch(userInput) {
  let bestMatch = null;
  let highestScore = 0;

  for (const [key, data] of Object.entries(knowledgeBase)) {
    const score = calculateRelevanceScore(userInput, data.keywords || []); // Ensure keywords exist
    if (score > highestScore) {
      highestScore = score;
      bestMatch = { key, data };
    }
  }

  // Define a threshold to avoid low-confidence matches
  const MINIMUM_RELEVANCE_SCORE = 10; // Adjusted threshold
  return highestScore >= MINIMUM_RELEVANCE_SCORE ? bestMatch : null;
}

// --- Main Export ---
// This function is called by visual-design.js when the server API fails.
export function getLocalResponse(userInput, state) {
  const match = findBestMatch(userInput);

  if (match) {
    // Trigger special local actions if defined (like starting the booking flow)
    if (match.data.action === "start_booking") {
      state.bookingState.isActive = true; // Modify state passed from visual-design.js
      state.bookingState.step = "name";
    }

    // Execute the response function or return the static response string
    const response =
      typeof match.data.response === "function"
        ? match.data.response()
        : match.data.response;

    // Track conversation topics locally for context (optional)
    if (!state.conversationContext.askedAbout.includes(match.key)) {
      state.conversationContext.askedAbout.push(match.key);
    }
    return response;
  }

  // --- Fallback Response Generation ---
  // If no confident match, provide helpful suggestions.
  const normalizedInput = normalizeText(userInput);
  let suggestionsIntro = "I can help with things like:\n";
  const defaultSuggestionTopics = [
    "services",
    "pricing",
    "workflow",
    "portfolio",
    "booking",
  ];
  let suggestionTopics = [...defaultSuggestionTopics]; // Copy defaults
  let potentialTopic = null;

  // Attempt to find a *partial* match to offer smarter suggestions
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (
      data.keywords?.some(
        (
          keyword, // Check if keywords exist
        ) => normalizedInput.includes(normalizeText(keyword)),
      )
    ) {
      potentialTopic = key;
      break;
    }
  }

  // If a partial match was found, tailor suggestions
  if (potentialTopic && knowledgeBase[potentialTopic]) {
    const related = knowledgeBase[potentialTopic].relatedTopics || [];
    // Prioritize potential topic, related topics, booking, then defaults
    const smartSuggestions = [
      ...new Set([
        potentialTopic,
        ...related,
        "booking",
        ...defaultSuggestionTopics,
      ]),
    ];
    suggestionsIntro = `I'm not sure I fully understand. Did you want to know about <strong>${potentialTopic}</strong>? I can also tell you about:\n`;
    suggestionTopics = smartSuggestions; // Use the smarter list
  }

  // Format the final suggestion list (no bullets, using <strong>)
  const suggestionList = suggestionTopics
    .slice(0, 4) // Limit to 4 suggestions
    .map((topic) => `Our <strong>${topic}</strong>`) // Format each suggestion
    .join("\n"); // Separate with newlines

  return `I'm sorry, I'm not equipped to answer that question. My knowledge is focused on Reinmax Creative.\n\n${suggestionsIntro}\n${suggestionList}`;
}
