export type Speaker = {
  name: string;
  role: string;
  org?: string;
  image?: string;
  imagePosition?: string;
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

export type Laboratory = {
  name: string;
  description: string;
  image: string;
  alt: string;
  tags: string[];
};

export type Project = {
  name: string;
  description: string;
  image: string;
  alt: string;
  technologies: string[];
  status: string;
  mentor?: string;
  teamName: string;
  participants: string[];
  eventDate?: string;
  achievement?: string;
};

export const APPLY_URL = "https://app.zuddl.com/roboflow/applytovis/";

export const SPEAKERS: Speaker[] = [
  { name: "Хамза Даулетбек", role: "Руководитель Digital Lady Technopark", image: "/images/team/hamza-dauletbek.jpeg", imagePosition: "50% 24%" },
  { name: "Байсултан Рамазан", role: "Инженер-программист", image: "/images/team/baisultan-ramazan.jpeg", imagePosition: "50% 24%" },
  { name: "Еркиулы Нурислам", role: "Менеджер по проекту", image: "/images/team/erkiuly-nurislam.jpeg", imagePosition: "50% 34%" },
  { name: "Айнур Жамадилова", role: "Менеджер по проекту", image: "/images/team/ainur-zhamadilova.jpeg", imagePosition: "50% 48%" },
  { name: "Кубаев Айсултан", role: "Инженер-программист", image: "/images/team/kubaev-aisultan.jpeg", imagePosition: "50% 35%" },
  { name: "Жумабек Алмасбек", role: "Инженер-программист", image: "/images/team/almasbek-zhumabek.jpg", imagePosition: "50% 32%" },
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

export const LABORATORIES: Laboratory[] = [
  {
    name: "Apple Class",
    description:
      "Пространство для разработки цифровых продуктов в экосистеме Apple. Студенты знакомятся с созданием приложений, интерфейсов, мультимедийного контента и принципами современного продуктового дизайна.",
    image: "/images/laboratories/apple-class.jpeg",
    alt: "Студенты работают с компьютерами в технологической лаборатории",
    tags: ["APPLE ECOSYSTEM", "SWIFT", "UI/UX"],
  },
  {
    name: "Cisco Class",
    description:
      "Учебный класс для освоения компьютерных сетей и сетевого администрирования. Здесь студенты изучают настройку оборудования, построение сетевой инфраструктуры и основы кибербезопасности.",
    image: "/images/laboratories/cisco-class.jpeg",
    alt: "Презентация современных сетевых технологий",
    tags: ["NETWORKS", "CISCO", "CYBERSECURITY"],
  },
  {
    name: "Coding Class",
    description:
      "Практическая среда для изучения программирования, алгоритмов и веб-разработки. Студенты создают приложения, работают в командах и проходят путь от идеи до готового программного продукта.",
    image: "/images/laboratories/coding-class.jpeg",
    alt: "Практическое занятие по программированию",
    tags: ["WEB", "PROGRAMMING", "TEAMWORK"],
  },
  {
    name: "Huawei Class",
    description:
      "Класс для знакомства с телекоммуникационными, облачными и цифровыми технологиями. Практические занятия помогают понять принципы работы современных информационных систем и инфраструктуры.",
    image: "/images/laboratories/huawei-class.jpeg",
    alt: "Образовательная презентация цифровых технологий",
    tags: ["CLOUD", "TELECOM", "AI"],
  },
  {
    name: "3D Lab",
    description:
      "Лаборатория цифрового производства, 3D-моделирования и прототипирования. Студенты проектируют трёхмерные модели, готовят их к печати и создают физические прототипы собственных проектов.",
    image: "/images/laboratories/3d-lab.jpeg",
    alt: "Работа над технологическим прототипом",
    tags: ["3D MODELING", "3D PRINTING", "PROTOTYPING"],
  },
];

export const AI_AGENT_PROJECTS: Project[] = [
  {
    name: "Lesson Study Coach",
    description:
      "AI-агент для методического сопровождения педагогического эксперимента Lesson Study в рамках выпускных работ бакалавров. Помогает организовать исследование, работать по единой методике и анализировать полученные результаты.",
    image: "/images/projects/lessonstudy.jpg",
    alt: "Интерфейс AI-агента Lesson Study Coach",
    technologies: ["AI", "LESSON STUDY", "ПЕДАГОГИКА"],
    status: "В разработке",
    teamName: "Команда Digital Lady Technopark",
    participants: ["Участники уточняются"],
  },
  {
    name: "NavIQ",
    description:
      "Интеллектуальный AI-агент для сопровождения студентов в учебном процессе. Диагностирует уровень знаний, формирует индивидуальную траекторию обучения, помогает готовиться к занятиям и рекомендует подходящие образовательные ресурсы.",
    image: "/images/projects/naviq.jpg",
    alt: "Интерфейс образовательного AI-агента NavIQ",
    technologies: ["AI", "АДАПТИВНОЕ ОБУЧЕНИЕ", "УЧЕБНАЯ АНАЛИТИКА"],
    status: "В разработке",
    teamName: "Команда Digital Lady Technopark",
    participants: ["Участники уточняются"],
  },
  {
    name: "Zerde AI",
    description:
      "AI-агент для подготовки обучающихся к Единому национальному тестированию. Обеспечивает персонализированное обучение, адаптивное тестирование, анализ результатов и развитие академических навыков.",
    image: "/images/projects/zerde.jpg",
    alt: "Интерфейс AI-агента Zerde для подготовки к ҰБТ",
    technologies: ["AI", "ЕНТ", "АДАПТИВНОЕ ТЕСТИРОВАНИЕ"],
    status: "В разработке",
    teamName: "Команда Digital Lady Technopark",
    participants: ["Участники уточняются"],
  },
];

export const TOMIRIS_PROJECTS: Project[] = [
  {
    name: "Aspan AI",
    description:
      "Интеллектуальный патрульный дрон для повышения безопасности в общественных местах. Компьютерное зрение помогает выявлять опасные ситуации, а система передаёт координаты и визуальную информацию ответственным службам.",
    image: "/images/showcase-stage.avif",
    alt: "Презентация проекта Aspan AI",
    technologies: ["COMPUTER VISION", "YOLO", "DRONE", "GPS"],
    status: "Демо-тестирование",
    mentor: "Байсултан Рамазан",
    teamName: "Aspan Team",
    participants: ["Студент 01", "Студент 02", "Студент 03"],
    eventDate: "8 октября 2026",
    achievement: "Сертификат участника",
  },
  {
    name: "AgroAI",
    description:
      "AI-помощник для диагностики заболеваний растений по фотографии. Система анализирует изображение, определяет вероятную проблему и предлагает рекомендации по лечению, профилактике и уходу.",
    image: "/images/build-hands-on.avif",
    alt: "Практическая работа над проектом AgroAI",
    technologies: ["COMPUTER VISION", "MACHINE LEARNING", "MOBILE APP"],
    status: "Демо-тестирование",
    mentor: "Кубаев Айсултан",
    teamName: "AgroAI Team",
    participants: ["Студент 04", "Студент 05", "Студент 06"],
    eventDate: "8 октября 2026",
    achievement: "Сертификат участника",
  },
  {
    name: "Skill to Income",
    description:
      "Интеллектуальная платформа, которая анализирует навыки пользователя и помогает превратить их в источник дохода. Система предлагает направление, персональный план действий и рекомендации для выхода на первый заработок.",
    image: "/images/showcase-stage.avif",
    alt: "Презентация проекта Skill to Income",
    technologies: ["NLP", "RECOMMENDATION AI", "WEB PLATFORM"],
    status: "Демо-тестирование",
    mentor: "Байсултан Рамазан",
    teamName: "Skill Team",
    participants: ["Студент 07", "Студент 08", "Студент 09"],
    eventDate: "8 октября 2026",
    achievement: "Сертификат участника",
  },
  {
    name: "nventControl",
    description:
      "Цифровая система для учёта и контроля оборудования технопарка. Помогает регистрировать выдачу и возврат устройств, отслеживать их состояние, планировать обслуживание и быстро находить нужные ресурсы.",
    image: "/images/build-hands-on.avif",
    alt: "Команда тестирует цифровую систему управления оборудованием",
    technologies: ["WEB APP", "QR-КОДЫ", "DATABASE", "ANALYTICS"],
    status: "Демо-тестирование",
    mentor: "Хамза Даулетбек",
    teamName: "nventControl Team",
    participants: ["Студент 10", "Студент 11", "Студент 12"],
    eventDate: "8 октября 2026",
    achievement: "Сертификат участника",
  },
];
