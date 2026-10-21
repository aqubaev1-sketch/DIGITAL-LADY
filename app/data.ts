export type Speaker = {
  name: string;
  role: string;
  org?: string;
  image?: string;
};

export type Session = {
  kind: string;
  title: string;
  speakers?: Speaker[];
};

export type AgendaRow = {
  time: string;
  dateTime: string;
  endTime?: string;
  endDateTime?: string;
  plenary?: { kind?: string; title: string; note?: string };
  stages?: Session[][];
  card?: boolean;
};

export const APPLY_URL = "https://app.zuddl.com/roboflow/applytovis/";

export const SPEAKERS: Speaker[] = [
  { name: "Хамза Даулетбек", role: "Руководитель", image: "/images/speakers/joseph-nelson.webp" },
  { name: "Жумадилова Айнур", role: "Менеджер по проекту", image: "/images/speakers/chay-ryali.webp" },
  { name: "Еркинулы Нурислам", role: "Менеджер по проекту", image: "/images/speakers/laura-gustafson.webp" },
  { name: "Кубаев Айсултан", role: "Инженер-программист", image: "/images/speakers/nagesh-saldi.webp" },
  { name: "Байсултан Рамазан", role: "Инженер-программист", image: "/images/speakers/alvin-clark.webp" },
  { name: "Жумабек Алмасбек", role: "Инженер-программист", image: "/images/speakers/brad-dwyer.webp" },
];

const person = (name: string): Speaker => {
  const speaker = SPEAKERS.find((candidate) => candidate.name === name);

  return speaker ?? {
    name,
    role: "Guest speaker",
  };
};

const roboflow = (name: string, role: string, image: string): Speaker => ({
  name,
  role,
  org: "Roboflow",
  image,
});

export const SESSION_FORMATS = [
  {
    name: "Showcase",
    kicker: "ON STAGE",
    body: "Learn what works from the people who are using AI in the physical world today at scale.",
    image: "/images/showcase-stage.avif",
    alt: "A speaker presenting on stage at a summit",
  },
  {
    name: "Build",
    kicker: "HANDS ON",
    body: "Hands-on workshops where you'll learn step-by-step and leave with something you can use immediately.",
    image: "/images/build-hands-on.avif",
    alt: "A Roboflow team member walking an attendee through a hands-on demonstration",
  },
];

export const EVENT_STATS = [
  { figure: "30+", label: "speakers" },
  { figure: "15+", label: "sessions" },
  { figure: "1", label: "day" },
];

export const ATTENDEE_ROWS = [
  [
    ["Tesla", "/images/attendees/tesla.svg", "wordmark"],
    ["GM", "/images/attendees/gm.svg", "compact"],
    ["SpaceX", "/images/attendees/spacex.svg", "symbol"],
    ["Google", "/images/attendees/google.svg", "wordmark"],
    ["Amazon", "/images/attendees/amazon.svg", "wordmark"],
    ["SAP", "/images/attendees/sap.svg", "compact"],
    ["Shopify", "/images/attendees/shopify.svg", "wordmark"],
    ["SoftBank", "/images/attendees/softbank.svg", "wordmark"],
  ],
  [
    ["Comcast", "/images/attendees/comcast.webp", "raster"],
    ["Decagon", "/images/attendees/decagon.svg", "wordmark"],
    ["DigitalOcean", "/images/attendees/digitalocean.svg", "symbol"],
    ["Redwood Materials", "/images/attendees/redwood.svg", "wordmark"],
    ["Mach Industries", "/images/attendees/mach.svg", "wordmark"],
    ["Advanced Energy", "/images/attendees/advanced-energy.svg", "wordmark"],
    ["CodeRabbit", "/images/attendees/coderabbit.svg", "symbol"],
    ["Chewy", "/images/attendees/chewy.svg", "wordmark"],
  ],
] as const;

export const AGENDA: AgendaRow[] = [
  { time: "9:00 AM", dateTime: "09:00", plenary: { kind: "Doors open", title: "Check-in", note: "Breakfast & networking" } },
  {
    time: "10:00 AM",
    dateTime: "10:00",
    stages: [[{ kind: "Welcome", title: "Keynote", speakers: [person("Joseph Nelson"), person("Brad Dwyer")] }], []],
  },
  {
    time: "10:45 AM",
    dateTime: "10:45",
    stages: [[
      { kind: "Fireside chat", title: "The future of AI is physical", speakers: [person("Nagesh Saldi")] },
      { kind: "Showcase", title: "The biggest AI models are finally good at vision", speakers: [person("Piotr Skalski")] },
    ], []],
  },
  { time: "11:30 AM", dateTime: "11:30", plenary: { title: "Break" } },
  {
    time: "11:45 AM",
    dateTime: "11:45",
    stages: [
      [
        { kind: "Fireside chat", title: "What the next generation of vision models will see and understand", speakers: [person("Chay Ryali"), person("Laura Gustafson")] },
        { kind: "Showcase", title: "Beyond the lab: Vision AI in manufacturing and logistics", speakers: [person("Michael Ibanez"), person("Saibal Roy")] },
      ],
      [{ kind: "Build", title: "From prompt to production: Building vision apps with agents", speakers: [
        roboflow("Asfandiyar Khan", "Full Stack Engineer", "/images/team/asfandiyar-khan.webp"),
        roboflow("Mike Medvedev", "Full Stack Engineer", "/images/team/mike-medvedev.webp"),
        person("Alan Ang"),
      ] }],
    ],
  },
  { time: "12:45 PM", dateTime: "12:45", plenary: { kind: "Break", title: "Lunch", note: "Food & experiences" } },
  {
    time: "1:30 PM",
    dateTime: "13:30",
    stages: [
      [
        { kind: "Showcase", title: "Vision AI changes how we play and watch sports", speakers: [person("Kyle Boddy"), person("Sam Ehrlich")] },
        { kind: "Panel", title: "Robotics: Vision enables machines to do real work across farms, factories, and labs", speakers: [person("James Chivers"), person("Sai Vinayak Ganesh"), person("Tim DeGrasse")] },
      ],
      [{ kind: "Build", title: "Edge AI: How to run vision locally, and run it fast", speakers: [
        person("Keyan Hardman"),
        roboflow("Grant Nelson", "Product Manager", "/images/team/grant-nelson.webp"),
        roboflow("Alex Norell", "Infrastructure Engineer", "/images/team/alex-norell.webp"),
      ] }],
    ],
  },
  { time: "2:30 PM", dateTime: "14:30", plenary: { title: "Break" } },
  {
    time: "2:45 PM",
    dateTime: "14:45",
    stages: [
      [
        { kind: "Showcase", title: "Solve tough vision problems with synthetic data", speakers: [person("Alvin Clark")] },
        { kind: "Panel", title: "Open source makes vision accessible for every developer", speakers: [person("Satya Mallick"), person("Astrid Wilde"), person("Kwabena Agyeman")] },
      ],
      [{ kind: "Build", title: "Creating vision systems that outperform frontier models", speakers: [
        person("Ardavan Bidgoli"),
        roboflow("Jennifer Kuchta", "Implementation Engineer", "/images/team/jennifer-kuchta.webp"),
        roboflow("João Marcos Ramos", "Full Stack Engineer", "/images/team/joao-marcos-ramos.webp"),
      ] }],
    ],
  },
  { time: "3:45 PM", dateTime: "15:45", plenary: { title: "Break" } },
  {
    time: "4:00 PM",
    dateTime: "16:00",
    stages: [
      [
        { kind: "Showcase", title: "Warehouse automation: Seeing and moving material more intelligently", speakers: [person("Matthew Haber"), person("Rishabh Agarwal")] },
        { kind: "Panel", title: "Measure everything, waste nothing: Vision AI across edge and cloud", speakers: [person("Rian Mc Donnell"), person("Filipe Mendes"), person("James Quaglia")] },
      ],
      [{ kind: "Build", title: "Scaling to a billion inferences, and what you need to get there", speakers: [
        person("Sean Kim"),
        roboflow("Sachin Agarwal", "Infrastructure Lead", "/images/team/sachin-agarwal.webp"),
        roboflow("Thomas Hansen", "Infrastructure Engineer", "/images/team/thomas-hansen.webp"),
      ] }],
    ],
  },
  { time: "5:00 PM", dateTime: "17:00", endTime: "7:00 PM", endDateTime: "19:00", card: true, plenary: { kind: "Networking", title: "Reception", note: "Dinner, drinks & networking" } },
];

export const FAQS = [
  {
    q: "Who should attend?",
    a: [
      "Anyone pushing AI past the screen and into the physical world. That includes ML and perception engineers, developers new to vision, founders building vision-native products, and business and technical leaders deciding where vision fits into their operations.",
      "The program is built around two types of sessions. Showcase sessions are led by teams running vision at scale across plants, sites, and fleets. Build sessions are hands-on workshops where you'll learn step-by-step and leave with something you can use immediately. Your ticket provides access to all sessions.",
      "You do not need to be a Roboflow user or customer to attend.",
    ],
  },
  {
    q: "What is the format?",
    a: [
      "One day with multiple stages, featuring talks from the people building and deploying visual AI.",
      "Alongside the talks you can take part in hands-on learning and build sessions led by experts in vision AI and Roboflow engineers. Bring a laptop if you plan to do a hands-on session.",
      "There are also a demo floor and interactive experiences around the venue. Some show real world use cases, some are purely experimental. The day ends with a reception for you to network and connect with people in the community.",
    ],
  },
  {
    q: "What is included with a pass?",
    bullets: [
      "All keynotes and talks across every stage",
      "Hands-on learning and building sessions, subject to capacity",
      "Roundtable discussions, subject to capacity",
      "Demo floor access",
      "Breakfast, lunch, coffee, and snacks",
      "Closing reception with food and drinks included",
      "Conference materials and swag",
    ],
  },
  {
    q: "Should I bring anything?",
    a: [
      "Two things.",
      "Bring your computer if you plan to take part in the hands-on sessions. Those are working sessions and you will be building alongside Roboflow engineers, so you will want your own machine.",
      "Bring a sweater or a jacket. The Midway has indoor and outdoor space, and San Francisco gets cold once the sun goes down, which is right around when the reception starts.",
    ],
  },
  { q: "Will sessions be recorded? Can I attend virtually?", a: ["The Summit is in person only."] },
  { q: "Where should I stay?", a: ["We recommend staying at Hotel Luma, Hotel VIA, or Hotel Zeppelin."] },
  { q: "Are there refunds? Can I transfer my ticket?", a: ["A full refund is available more than 30 days before the event, 50% refund between 15 to 30 days before, and no refund less than 15 days before the event. You can transfer your ticket 7 days before the event date. Email us at dlt@roboflowevents.com if you have any questions."] },
  { q: "Can I speak or sponsor?", a: ["Email dlt@roboflowevents.com with a short description of what you would like to present or how you would like to participate. Product pitches will not be accepted."] },
];
