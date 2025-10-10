import type { Article } from "@/lib/articleSchema"

// In-memory storage using Map
const articlesStore = new Map<string, Article>()

// Initialize with example article including all module types
const exampleArticle: Article = {
  title: "2026 Midsize Sedan Comparison: Honda Accord vs Toyota Camry vs Mazda6",
  slug: "2026-midsize-sedan-comparison",
  description:
    "A detailed comparison and overview of three top midsize sedans, including fuel economy, performance, and value analysis",
  hero: {
    eyebrow: "Vehicle Intelligence Report",
    headline: "2026 Midsize Sedan Comparison",
    subheadline: "Honda Accord vs Toyota Camry vs Mazda6 - Which sedan offers the best value?",
    image: {
      url: "/2026-midsize-sedan-comparison.jpg",
      alt: "2026 Honda Accord, Toyota Camry, and Mazda6 side by side",
    },
    badges: [{ label: "Updated 2026" }, { label: "Expert Analysis" }, { label: "164+ Data Points" }],
    cta: {
      label: "Get Pricing",
      href: "#pricing",
    },
  },
  toc: [
    { id: "overview", label: "Overview" },
    { id: "performance", label: "Performance" },
    { id: "fuel-economy", label: "Fuel Economy" },
    { id: "specs", label: "Specifications" },
    { id: "pros-cons", label: "Pros & Cons" },
    { id: "faq", label: "FAQ" },
  ],
  blocks: [
    {
      type: "intro",
      html: "<p>The midsize sedan segment remains one of the most competitive in the automotive market. For 2026, the Honda Accord, Toyota Camry, and Mazda6 continue to set the standard for reliability, comfort, and value. This comprehensive comparison examines every aspect of these three popular sedans to help you make an informed decision.</p><p>Each vehicle brings unique strengths to the table: the Accord offers sporty handling and a refined interior, the Camry provides legendary reliability and strong resale value, while the Mazda6 delivers upscale styling and engaging driving dynamics.</p>",
    },
    {
      type: "comparisonTable",
      caption: "Key Specifications Comparison",
      columns: ["Metric", "Honda Accord", "Toyota Camry", "Mazda6"],
      rows: [
        { Metric: "Starting Price", "Honda Accord": "$27,950", "Toyota Camry": "$27,950", Mazda6: "$26,950" },
        { Metric: "Horsepower", "Honda Accord": "192 hp", "Toyota Camry": "203 hp", Mazda6: "187 hp" },
        { Metric: "City MPG", "Honda Accord": "30", "Toyota Camry": "28", Mazda6: "26" },
        { Metric: "Highway MPG", "Honda Accord": "38", "Toyota Camry": "39", Mazda6: "35" },
        { Metric: "Cargo Space", "Honda Accord": "16.7 cu ft", "Toyota Camry": "15.1 cu ft", Mazda6: "14.7 cu ft" },
        { Metric: "Warranty", "Honda Accord": "3yr/36k mi", "Toyota Camry": "3yr/36k mi", Mazda6: "3yr/36k mi" },
      ],
      highlightRule: "max",
    },
    {
      type: "specGrid",
      groups: [
        {
          title: "Performance",
          items: [
            { label: "Engine", value: "2.5L 4-Cylinder" },
            { label: "Horsepower", value: "192 hp @ 6,500 rpm" },
            { label: "Torque", value: "192 lb-ft @ 3,500 rpm" },
            { label: "Transmission", value: "CVT Automatic" },
            { label: "0-60 mph", value: "7.8 seconds" },
          ],
        },
        {
          title: "Fuel Economy",
          items: [
            { label: "City", value: "30 MPG" },
            { label: "Highway", value: "38 MPG" },
            { label: "Combined", value: "33 MPG" },
            { label: "Fuel Tank", value: "14.8 gallons" },
            { label: "Range", value: "488 miles" },
          ],
        },
        {
          title: "Dimensions",
          items: [
            { label: "Length", value: "192.2 inches" },
            { label: "Width", value: "73.3 inches" },
            { label: "Height", value: "57.1 inches" },
            { label: "Wheelbase", value: "111.4 inches" },
            { label: "Curb Weight", value: "3,131 lbs" },
          ],
        },
      ],
    },
    {
      type: "prosCons",
      pros: [
        "Excellent fuel economy across all models",
        "Spacious and comfortable interiors",
        "Strong reliability ratings and resale value",
        "Advanced safety features standard",
        "Smooth and refined ride quality",
      ],
      cons: [
        "CVT transmissions may feel less engaging",
        "Base models lack some premium features",
        "Styling may be too conservative for some",
        "Infotainment systems can be complex",
      ],
    },
    {
      type: "faq",
      items: [
        {
          q: "Which midsize sedan has the best fuel economy?",
          a: "The Toyota Camry leads with 39 highway MPG, followed closely by the Honda Accord at 38 MPG. The Mazda6 achieves 35 highway MPG.",
        },
        {
          q: "Are these sedans reliable?",
          a: "Yes, all three sedans have excellent reliability ratings. Toyota and Honda consistently rank among the most reliable brands, and Mazda has significantly improved its reliability in recent years.",
        },
        {
          q: "Which sedan offers the best value?",
          a: "The Mazda6 has the lowest starting price at $26,950, but the Honda Accord offers the best combination of features, space, and fuel economy for the money.",
        },
        {
          q: "Do these sedans come with all-wheel drive?",
          a: "The Toyota Camry offers an available AWD system. The Honda Accord and Mazda6 are front-wheel drive only.",
        },
      ],
    },
    {
      type: "ctaBanner",
      heading: "Ready to Find Your Perfect Sedan?",
      sub: "Compare prices from local dealers and get the best deal",
      href: "/get-quote",
      label: "Get Free Quote",
    },
  ],
  modules: [
    {
      type: "tldr",
      content:
        "The 2026 Honda Accord, Toyota Camry, and Mazda6 represent the best midsize sedans on the market. The Accord excels in fuel economy and cargo space, the Camry offers legendary reliability and available AWD, while the Mazda6 provides upscale styling at the lowest price. All three deliver excellent value, comfort, and safety features, making any choice a smart one for sedan shoppers.",
    },
    {
      type: "key_takeaways",
      items: [
        "Honda Accord leads in cargo space with 16.7 cubic feet",
        "Toyota Camry achieves best highway fuel economy at 39 MPG",
        "Mazda6 offers lowest starting price at $26,950",
        "All three sedans feature standard advanced safety systems",
        "Camry is the only model offering all-wheel drive",
        "Accord provides the most balanced combination of features and value",
      ],
    },
    {
      type: "quiz",
      title: "Which Midsize Sedan Is Right For You?",
      questions: [
        {
          prompt: "What's your top priority in a midsize sedan?",
          choices: ["Fuel economy", "Cargo space", "Lowest price", "All-wheel drive"],
          correctIndex: 0,
          explanation: "If fuel economy is your priority, the Toyota Camry's 39 highway MPG makes it the best choice.",
        },
        {
          prompt: "How important is cargo space for your needs?",
          choices: ["Very important", "Somewhat important", "Not important", "I need maximum space"],
          correctIndex: 3,
          explanation: "The Honda Accord offers the most cargo space at 16.7 cubic feet, beating both competitors.",
        },
        {
          prompt: "Do you drive in snowy or wet conditions frequently?",
          choices: ["Yes, all the time", "Occasionally", "Rarely", "Never"],
          correctIndex: 0,
          explanation:
            "If you need all-wheel drive for challenging conditions, the Toyota Camry is your only option among these three.",
        },
        {
          prompt: "What's your budget for a new sedan?",
          choices: ["Under $27,000", "$27,000-$30,000", "$30,000-$35,000", "Over $35,000"],
          correctIndex: 0,
          explanation: "The Mazda6 starts at $26,950, making it the most affordable option in this comparison.",
        },
      ],
    },
    {
      type: "mpg_calculator",
      label: "Calculate Your Fuel Costs",
      defaults: {
        cityMpg: 30,
        hwyMpg: 38,
        fuelPrice: 3.5,
        miles: 12000,
      },
    },
    {
      type: "pull_quote",
      quote:
        "The Honda Accord continues to set the benchmark for midsize sedans with its perfect blend of efficiency, space, and driving dynamics.",
      attribution: "Car and Driver, 2026 Review",
    },
    {
      type: "dropdown",
      title: "Understanding CVT Transmissions",
      body: "Continuously Variable Transmissions (CVTs) are used in both the Honda Accord and Toyota Camry. Unlike traditional automatic transmissions with fixed gears, CVTs use a belt and pulley system to provide seamless acceleration and optimal fuel efficiency. While some drivers miss the feel of gear changes, CVTs deliver better fuel economy and smoother power delivery. Modern CVTs have also addressed earlier reliability concerns and now offer excellent durability.",
    },
    {
      type: "reviews",
      sources: ["Car and Driver", "Motor Trend", "Edmunds", "Consumer Reports"],
      entries: [
        {
          author: "Car and Driver",
          rating: 4.5,
          summary:
            "The Honda Accord remains our top pick in the midsize sedan segment, offering an unbeatable combination of space, efficiency, and driving enjoyment.",
          pros: ["Spacious interior", "Excellent fuel economy", "Engaging handling"],
          cons: ["CVT can feel sluggish", "Infotainment learning curve"],
        },
        {
          author: "Motor Trend",
          rating: 4,
          summary:
            "Toyota Camry's legendary reliability and available AWD make it a smart choice for families seeking a dependable daily driver.",
          pros: ["Proven reliability", "Available AWD", "Strong resale value"],
          cons: ["Conservative styling", "Less cargo space than rivals"],
        },
        {
          author: "Edmunds",
          rating: 4,
          summary:
            "The Mazda6 punches above its weight with upscale materials and engaging dynamics, though it trails in fuel economy.",
          pros: ["Premium interior quality", "Sporty handling", "Attractive styling"],
          cons: ["Lower fuel economy", "Smaller cargo area"],
        },
      ],
    },
  ],
  seo: {
    canonical: "https://example.com/articles/2026-midsize-sedan-comparison",
    ogImage: "/2026-midsize-sedan-comparison.jpg",
  },
  publishedAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
}

// Initialize storage with example article
articlesStore.set(exampleArticle.slug, exampleArticle)

// Storage functions
export function saveArticle(article: Article): void {
  articlesStore.set(article.slug, article)
}

export function getArticle(slug: string): Article | undefined {
  return articlesStore.get(slug)
}

export function listArticles(): Article[] {
  return Array.from(articlesStore.values())
}

export function deleteArticle(slug: string): boolean {
  return articlesStore.delete(slug)
}

// Legacy aliases for backward compatibility
export const saveDraft = saveArticle
export const getDraft = getArticle
export const readDraft = getArticle
