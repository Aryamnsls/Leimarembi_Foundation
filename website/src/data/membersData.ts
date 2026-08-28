export interface Member {
  id: number;
  name: string;
  role: string; // Official NGO Role e.g., President, Managing Director
  subtitle: string; // External background e.g., Senior Journalist | President, Manipuri Sahitya Parishad
  shortProfile: string;
  areaOfResponsibility: string;
  photo: string | null;
  category: 'Leadership' | 'Executive';
}

export const MEMBERS_DATA: Member[] = [
  {
    id: 1,
    name: "Dr. Phuritsabam Birmani",
    role: "President",
    subtitle: "Senior Journalist | President, Manipuri Sahitya Parishad, Assam",
    shortProfile: "A senior journalist and literary personality with active involvement in community, cultural and social development. He provides leadership and guidance to Leimarembi Foundation towards its vision, objectives and community-oriented initiatives.",
    areaOfResponsibility: "Overall leadership, strategic guidance, organisational development and coordination of major activities of the Foundation.",
    photo: "/members/Dr_phuritsabam.jpg",
    category: "Leadership"
  },
  {
    id: 2,
    name: "K. Ajit Singh",
    role: "Vice-Chairman",
    subtitle: "Retired Government Employee",
    shortProfile: "A retired government employee actively involved in sports, particularly Kabaddi, with a strong interest in promoting sports and youth development.",
    areaOfResponsibility: "Sports development, youth engagement and coordination of sports-related activities of the Foundation.",
    photo: "/members/ajit_singh.jpg",
    category: "Leadership"
  },
  {
    id: 3,
    name: "Y. Thambal Singha",
    role: "Managing Director",
    subtitle: "Retired Government Officer | President, GMSO | President, Sri Sri Radha Gobindo Mandir, Kekranagar",
    shortProfile: "A retired government officer with experience in public service and organisational affairs. He is actively engaged in community, social and cultural activities, contributing to the welfare and development of society.",
    areaOfResponsibility: "Organisational administration, programme coordination, community engagement and implementation of the Foundation's initiatives.",
    photo: "/members/thambal_singha.jpg",
    category: "Leadership"
  },
  {
    id: 4,
    name: "M. Bina Babu Singha",
    role: "Secretary",
    subtitle: "Retired Government Officer | Advisor, UMAA, Kamrup District",
    shortProfile: "A retired government officer with experience in public administration and organisational affairs. He is actively engaged in community service and contributes to social and developmental initiatives through his association with UMAA.",
    areaOfResponsibility: "Administration, official correspondence, documentation, coordination and effective implementation of the Foundation's programmes.",
    photo: "/members/bina_babu_singha.jpg",
    category: "Leadership"
  },
  {
    id: 5,
    name: "Ng. Baldev Singha",
    role: "Treasurer",
    subtitle: "Retired Government Officer | Working President, UMAA (Central) | Vice-President, GMSO",
    shortProfile: "A retired government officer with experience in public service and community affairs. He is actively involved in community development and serves as the Working President of UMAA and Vice-President of GMSO.",
    areaOfResponsibility: "Financial management, accounts, budgeting, record-keeping and financial coordination of the Foundation.",
    photo: "/members/NG_BALDEV_SINGHA.jpg",
    category: "Leadership"
  },
  {
    id: 6,
    name: "K. Braja Babu Singha",
    role: "Executive Member",
    subtitle: "Retired Army Personnel | Executive Member, UMAA (Central) | Executive Member, GMSO",
    shortProfile: "A retired Army personnel with a strong commitment to community service and social welfare. He actively participates in community initiatives through his association with UMAA and GMSO.",
    areaOfResponsibility: "Supports the Foundation's programmes, community outreach, member coordination and implementation of social and welfare initiatives.",
    photo: null,
    category: "Executive"
  },
  {
    id: 7,
    name: "L. Madan Chand Singha",
    role: "Executive Member",
    subtitle: "Business Owner / Proprietor | Treasurer, UMAA Kamrup District | General Secretary, GMSO",
    shortProfile: "A business owner actively engaged in community service and organisational activities. He contributes his experience and commitment to community development through his involvement with UMAA and GMSO.",
    areaOfResponsibility: "Member coordination, community outreach, programme support and assistance in the Foundation's organisational and developmental activities.",
    photo: "/members/L_Madan_chand.jpg",
    category: "Executive"
  },
  {
    id: 8,
    name: "H. Monoj Kumar Singha",
    role: "Executive Member",
    subtitle: "Business Owner / Proprietor | Assistant Secretary, UMAA Kamrup District | Publication Secretary, GMSO",
    shortProfile: "A business professional actively engaged in community, social and organisational activities. He contributes his experience and dedication to community development through his involvement with UMAA and GMSO.",
    areaOfResponsibility: "Member coordination, communication, publications and support in the planning and implementation of the Foundation's activities.",
    photo: "/members/H_monoj.jpg",
    category: "Executive"
  },
  {
    id: 9,
    name: "Y. Abhishek Singh",
    role: "Executive Member",
    subtitle: "Private Sector Employee",
    shortProfile: "A private sector employee with an interest in community service and social development. He actively supports the objectives and activities of Leimarembi Foundation.",
    areaOfResponsibility: "Member coordination, programme support and participation in the Foundation's community and developmental activities.",
    photo: "/members/abhishek_Singh.jpg",
    category: "Executive"
  },
  {
    id: 10,
    name: "Moni Mohan Singha",
    role: "Executive Member",
    subtitle: "Retired Army Personnel | Vice-President, UMAA, Kamrup District | Assistant Secretary, GMSO | President, Salbari Village Committee",
    shortProfile: "A retired Army personnel actively engaged in community service, social welfare and local development. He contributes his experience and leadership to various community organisations and initiatives.",
    areaOfResponsibility: "Community outreach, member coordination, local development initiatives and support for the Foundation's social welfare activities.",
    photo: "/members/Moni_Mohan_singha.jpg",
    category: "Executive"
  },
  {
    id: 11,
    name: "Sarakkhaibam Amarjit Singha",
    role: "Executive Member",
    subtitle: "Business Owner / Proprietor | Executive Member, UMAA, Kamrup District",
    shortProfile: "A business owner actively involved in community service and the promotion of cultural activities within the Manipuri community. He contributes to social and cultural initiatives through his active association with UMAA.",
    areaOfResponsibility: "Cultural activities, community outreach, member engagement and support for the Foundation's social and cultural initiatives.",
    photo: "/members/sarakkhaibam.jpg",
    category: "Executive"
  },
  {
    id: 12,
    name: "Ngangbam Binoy Singha",
    role: "Executive Member",
    subtitle: "Business Owner / Proprietor",
    shortProfile: "A business owner actively engaged in community affairs and social development. He supports the Foundation's objectives and contributes to its community-oriented initiatives.",
    areaOfResponsibility: "Member engagement, programme support and participation in the Foundation's social and developmental activities.",
    photo: "/members/nagangbam.jpg",
    category: "Executive"
  }
];
