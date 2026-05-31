export interface Builder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  field: 'AI' | 'SaaS' | 'Robotics' | 'Semiconductors' | 'AR/VR' | 'Fintech' | 'Deep Tech';
  city: string;
  experience: string;
  bio: string;
  matchScore: number;
}

export interface Investor {
  id: string;
  name: string;
  type: 'VC' | 'Angel Network' | 'Family Office' | 'Government Grant' | 'Corporate Fund';
  focus: string[];
  chequeSize: string;
  portfolioCount: number;
  description: string;
  logo: string;
}

export interface Partnership {
  id: string;
  name: string;
  type: 'Corporate Alliance' | 'University Collab' | 'Diaspora Network' | 'Venture Connection';
  entity: string;
  benefit: string;
  activeOpportunities: number;
  icon: string;
}

export interface GovProgram {
  id: string;
  title: string;
  agency: string;
  fundingCap: string;
  eligibility: string;
  deadline: string;
  type: 'Grant' | 'Incubator' | 'Procurement' | 'Subsidy';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  skills: string[];
  category: 'AI' | 'SaaS' | 'Robotics' | 'Semiconductors' | 'AR/VR' | 'Fintech' | 'Deep Tech';
}

export interface Challenge {
  id: string;
  title: string;
  postedBy: string;
  prizePool: string;
  rewardType: 'Prize Money' | 'Pilot Contract' | 'Procurement Slot' | 'Equity Investment';
  participantsCount: number;
  daysLeft: number;
  category: string;
  description: string;
  problemStatement: string;
}

export const buildersData: Builder[] = [
  {
    id: 'b1',
    name: 'Ayesha Khan',
    role: 'Computer Vision & Deep Learning Scientist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    skills: ['PyTorch', 'C++', 'Edge AI', 'TensorRT'],
    field: 'AI',
    city: 'Islamabad',
    experience: 'Ex-Researcher at HEC Robotics Lab, 2 patents in edge object detection.',
    bio: 'Forging real-time vision algorithms for agricultural drone swarms. Looking for a commercial-focused SaaS cofounder.',
    matchScore: 98
  },
  {
    id: 'b2',
    name: 'Zain Ahmed',
    role: 'VLSI & Semiconductor Layout Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    skills: ['Verilog', 'ASIC Layout', 'FPGA Prototyping', 'SystemVerilog'],
    field: 'Semiconductors',
    city: 'Lahore',
    experience: '5+ years in fabless design houses globally.',
    bio: 'Designing a RISC-V based low-power edge processor customized for vernacular speech recognition systems. Looking for firmware experts and funding partners.',
    matchScore: 95
  },
  {
    id: 'b3',
    name: 'Zahra Bilgrami',
    role: 'Fintech Protocol Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    skills: ['Rust', 'Hyperledger', 'Go', 'gRPC'],
    field: 'Fintech',
    city: 'Karachi',
    experience: 'Ex-Lead Architect at a major Middle East payment gateway.',
    bio: 'Building offline-first micro-payment APIs tailored for Pakistans retail (Kiryana) stores. Seeking an operations expert with offline supply chain experience.',
    matchScore: 92
  },
  {
    id: 'b4',
    name: 'Haris Mumtaz',
    role: 'Robotics Control Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    skills: ['ROS2', 'RTOS', 'Python', 'SolidWorks'],
    field: 'Robotics',
    city: 'Peshawar',
    experience: 'Winner of National Robotics Challenge 2025.',
    bio: 'Developing self-navigating industrial warehouse carts for local textile mills. Need a business development partner with local manufacturing connections.',
    matchScore: 89
  },
  {
    id: 'b5',
    name: 'Mariam Ali',
    role: 'SaaS Growth & Product Designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    skills: ['Product Design', 'Next.js', 'B2B Marketing', 'Figma'],
    field: 'SaaS',
    city: 'Faisalabad',
    experience: 'Designed and scaled 3 SaaS platforms with 10k+ monthly active users.',
    bio: 'Creating an Urdu-first ERP system for small SME manufacturers. Looking for technical co-founders specializing in PostgreSQL and Node.js.',
    matchScore: 91
  },
  {
    id: 'b6',
    name: 'Daniyal Mirza',
    role: 'WebXR & Spatial Computing Creator',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    skills: ['Three.js', 'Unity', 'WebXR', 'React Three Fiber'],
    field: 'AR/VR',
    city: 'Rawalpindi',
    experience: 'Ex-Spatial UI Consultant for international gaming studios.',
    bio: 'Building browser-based digital twins for local real estate developments and interactive remote schools. Looking for a B2B sales partner.',
    matchScore: 87
  }
];

export const investorsData: Investor[] = [
  {
    id: 'i1',
    name: 'Indus Valley Capital',
    type: 'VC',
    focus: ['B2B SaaS', 'Fintech', 'Logistics', 'Deep Tech'],
    chequeSize: '$500k - $2M',
    portfolioCount: 28,
    description: 'Empowering Pakistani founders to build industry-defining companies and unlock the countrys digital economy.',
    logo: 'IVC'
  },
  {
    id: 'i2',
    name: 'Sarmayacar',
    type: 'VC',
    focus: ['AI', 'Fintech', 'SaaS', 'Semiconductors'],
    chequeSize: '$250k - $1.5M',
    portfolioCount: 22,
    description: 'Providing early-stage venture capital and active board support to clean-tech, fintech, and deep tech startups.',
    logo: 'SMC'
  },
  {
    id: 'i3',
    name: 'Pakistan Startup Fund (PSF)',
    type: 'Government Grant',
    focus: ['Deep Tech', 'AgriTech', 'SaaS', 'AI', 'Export-oriented'],
    chequeSize: 'PKR 10M - 50M',
    portfolioCount: 45,
    description: 'Federal fund by MoITT matching global VC investments to supercharge growth and mitigate early startup risk.',
    logo: 'PSF'
  },
  {
    id: 'i4',
    name: 'Karavan',
    type: 'Angel Network',
    focus: ['B2C Commerce', 'Fintech', 'SaaS'],
    chequeSize: '$50k - $300k',
    portfolioCount: 18,
    description: 'A close-knit network of overseas Pakistani angel investors supporting early pre-seed and seed-stage founders.',
    logo: 'KVN'
  },
  {
    id: 'i5',
    name: 'Zayn Capital',
    type: 'VC',
    focus: ['Fintech', 'SaaS', 'B2B Marketplaces'],
    chequeSize: '$200k - $1M',
    portfolioCount: 31,
    description: 'Investing in visionary teams across Pakistan, Bangladesh, and the MENA region with deep-touch operations support.',
    logo: 'ZAYN'
  }
];

export const partnershipsData: Partnership[] = [
  {
    id: 'p1',
    name: 'Overseas Pakistani Tech Diaspora',
    type: 'Diaspora Network',
    entity: 'Silicon Valley & London Networks',
    benefit: 'Direct access to FAANG Directors, CTOs, and global engineering mentors.',
    activeOpportunities: 48,
    icon: 'Globe'
  },
  {
    id: 'p2',
    name: 'Systems Limited Innovate Program',
    type: 'Corporate Alliance',
    entity: 'Systems Ltd (Pakistans largest IT exporter)',
    benefit: 'SaaS licensing support, sandbox integration, and first-customer pilot channels.',
    activeOpportunities: 12,
    icon: 'Building'
  },
  {
    id: 'p3',
    name: 'HEC Research-to-Market Accelerator',
    type: 'University Collab',
    entity: 'Higher Education Commission (150+ Universities)',
    benefit: 'Access to state-of-the-art university clean rooms, robotics labs, and Ph.D. co-investigators.',
    activeOpportunities: 35,
    icon: 'GraduationCap'
  },
  {
    id: 'p4',
    name: 'Pak-US Tech Bridge Initiative',
    type: 'Venture Connection',
    entity: 'Global Venture Alliance & MoITT',
    benefit: 'Paid corporate exchange programs and incubation tracks in California.',
    activeOpportunities: 8,
    icon: 'Network'
  }
];

export const govProgramsData: GovProgram[] = [
  {
    id: 'g1',
    title: 'Pakistan Startup Fund (PSF) Matching Equity',
    agency: 'Ministry of IT & Telecom (MoITT)',
    fundingCap: 'Up to 30% of Venture Round (Max 50M PKR)',
    eligibility: 'Secured term-sheet from an approved venture fund.',
    deadline: 'Rolling Applications',
    type: 'Grant'
  },
  {
    id: 'g2',
    title: 'HEC Technology Development Fund (TDF)',
    agency: 'Higher Education Commission (HEC)',
    fundingCap: 'Up to 14M PKR',
    eligibility: 'Joint proposal by a university researcher and an industrial partner.',
    deadline: 'August 15, 2026',
    type: 'Grant'
  },
  {
    id: 'g3',
    title: 'PITB DeepTech Incubation Program',
    agency: 'Punjab Information Technology Board',
    fundingCap: 'Free R&D Space + 2M PKR Equity-Free Seed',
    eligibility: 'Builders in AI, Robotics, or Semiconductors.',
    deadline: 'June 30, 2026',
    type: 'Incubator'
  },
  {
    id: 'g4',
    title: 'MoITT IT Export Remittance Tax Waiver',
    agency: 'Ministry of IT & FBR',
    fundingCap: '100% Tax Exemption on Global Remote Earnings',
    eligibility: 'Registered freelancers, startups, and IT companies.',
    deadline: 'Permanent (Valid till 2030)',
    type: 'Subsidy'
  }
];

export const jobsData: Job[] = [
  {
    id: 'j1',
    title: 'Senior generative AI Engineer',
    company: 'Markhor AI Solutions',
    location: 'Karachi / Remote',
    type: 'Remote',
    salary: 'PKR 450,000 - 650,000 / mo',
    skills: ['LlamaIndex', 'LangChain', 'FastAPI', 'Vector Databases'],
    category: 'AI'
  },
  {
    id: 'j2',
    title: 'Embedded ROS Developer (Robotics)',
    company: 'Indus Robotics Lab',
    location: 'Peshawar',
    type: 'Hybrid',
    salary: 'PKR 350,000 - 500,000 / mo',
    skills: ['C++', 'ROS2', 'Microcontrollers', 'RTOS'],
    category: 'Robotics'
  },
  {
    id: 'j3',
    title: 'RISC-V Compiler Optimization Specialist',
    company: 'Taxila Semiconductor Corp',
    location: 'Rawalpindi / Remote',
    type: 'Remote',
    salary: '$3,500 - $5,500 / mo',
    skills: ['LLVM', 'RISC-V Assembly', 'C++', 'Compiler Theory'],
    category: 'Semiconductors'
  },
  {
    id: 'j4',
    title: 'Lead Product Designer (B2B SaaS)',
    company: 'Aura Fintech',
    location: 'Lahore',
    type: 'On-site',
    salary: 'PKR 250,000 - 400,000 / mo',
    skills: ['Figma', 'UI/UX Design', 'User Research', 'Tailwind'],
    category: 'SaaS'
  },
  {
    id: 'j5',
    title: 'Fintech Smart-Contract Security Auditor',
    company: 'Habib Ledger Group',
    location: 'Karachi',
    type: 'Hybrid',
    salary: 'PKR 400,000 - 600,000 / mo',
    skills: ['Rust', 'Solidity', 'Static Analysis', 'Formal Verification'],
    category: 'Fintech'
  }
];

export const challengesData: Challenge[] = [
  {
    id: 'c1',
    title: 'HEC Smart Agriculture AI Challenge',
    postedBy: 'HEC & Ministry of National Food Security',
    prizePool: 'PKR 5,000,000 + Government Procurement Contract',
    rewardType: 'Procurement Slot',
    participantsCount: 142,
    daysLeft: 18,
    category: 'AI & IoT',
    description: 'Post-harvest crop wastage in Pakistan exceeds 35%. Build a low-cost localized computer vision / IoT solution that monitors humidity and fungal rot in grain silos and predicts shelf life in native local languages.',
    problemStatement: 'Develop a highly-localized deep learning model trainable on edge hardware (Raspberry Pi) that operates offline and alerts farmers via SMS/audio in Punjabi, Sindhi, Pashto, and Urdu.'
  },
  {
    id: 'c2',
    title: 'Offline Digital Micro-Payment Protocol',
    postedBy: 'PITB & National Bank of Pakistan Consortium',
    prizePool: 'PKR 3,500,000 + Immediate Pilot in 5 Districts',
    rewardType: 'Pilot Contract',
    participantsCount: 88,
    daysLeft: 25,
    category: 'Fintech',
    description: 'Millions of rural retailers lack stable 4G/3G connectivity, preventing the adoption of standard UPI/QR payments. We need a secure, cryptographically validated offline-first peer-to-peer transaction protocol.',
    problemStatement: 'Propose a secure offline digital token standard using Bluetooth Low Energy (BLE) or encrypted acoustic waves (sound-based payments) that integrates with state-authorized banks once an internet connection is established.'
  },
  {
    id: 'c3',
    title: 'RISC-V Local IoT Chip Implementation',
    postedBy: 'Pakistani Semiconductor Consortium & MoITT',
    prizePool: 'PKR 10,000,000 + Tape-Out Sponsorship (Full Funding)',
    rewardType: 'Equity Investment',
    participantsCount: 41,
    daysLeft: 42,
    category: 'Semiconductors',
    description: 'Pakistan spends billions importing low-end smart meter and agricultural telemetry microchips. Design an ultra-low power, custom RISC-V microcontroller with onboard cryptographic acceleration.',
    problemStatement: 'Submit fully validated RTL designs in SystemVerilog. Winning designs will get fully funded TSMC tape-out through the national semiconductor program.'
  }
];
