/*
 * 포트폴리오 콘텐츠 — 이 파일만 수정하면 사이트 전체에 반영됩니다.
 *
 * 출처: HED LAB 홈페이지(member · publications · activities · achievements).
 * 화면에 보이는 문구는 모두 영문입니다(한글은 이 파일의 주석에만 씁니다).
 * TODO: 공공디자인 / 가상 공간 / UX·UI 프로젝트와 아이디에이션은 아직 초안(가제)입니다.
 *       전시 작업의 설명(summary)과 재료(material)도 채워 주세요.
 *
 * type   : paper | conference | material | interior | architecture
 *          (Publications · Conferences · Exhibition · Interior Architecture · Architecture)
 * year   : Search 화면의 세로 위치. 소수점은 같은 해 안에서 점을 벌려 놓기 위한 값이고,
 *          화면에는 연도만 표시됩니다.
 * award  : (선택) 수상 내역 — 카드와 상세에 함께 표시됩니다.
 */

window.SITE = {
  name: "Juyoung Lee",
  role: "Researcher / Designer",
  email: "jyl930@hanyang.ac.kr",
  links: [
    { label: "HED LAB", href: "https://hedlab.hanyang.ac.kr" }
  ],

  // 첫 화면 시퀀스의 세 단계 — 각 단계를 누르면 해당 페이지로 이동
  stages: [
    { key: "material",     route: "#/design/exhibition",     no: "01", label: "Material & Ideation" },
    { key: "talks",        route: "#/research/conferences", no: "02", label: "Conferences & Awards" },
    { key: "publications", route: "#/research/publications", no: "03", label: "Publications" }
  ],

  // 상단 탭 아래 하위 페이지 — 탭에 마우스를 올리면 나오는 항목. 페이지마다 한 가지 type을 보여줍니다.
  pages: {
    research: [
      { id: "publications", label: "Publications", type: "paper",
        lead: "Peer-reviewed journal papers on the role space plays where the digital meets the non-digital — affordance, digital inclusion and digital wellbeing in public and exhibition spaces." },
      { id: "conferences", label: "Conferences", type: "conference",
        lead: "Presentations at international and domestic conferences. Awards are noted on the presentation they were given for." }
    ],
    design: [
      { id: "exhibition", label: "Exhibition", type: "material",
        lead: "Material-led work shown at international fairs and exhibitions, with the ideation behind it." },
      { id: "interior-architecture", label: "Interior Architecture", type: "interior",
        lead: "Interior architecture projects — virtual spaces including the graduation work, and speculative UX/UI cases from graduate courses." },
      { id: "architecture", label: "Architecture", type: "architecture",
        lead: "Architecture and public projects." }
    ]
  },

  // 메인 화면 질의창에 자동으로 타이핑되는 문장들
  queries: [
    "affordance",
    "digital inclusion",
    "material re-exploration",
    "exhibition",
    "conference"
  ],

  // 연구 관심 분야 — HED LAB member 카드
  interests: [
    "Public Spaces",
    "Inclusive Design",
    "Digital Wellbeing",
    "Affordance"
  ],

  bio: "A Seoul-based spatial researcher and designer. Graduated from Hanyang University in Interior Architecture Design with a minor in Architecture, and now researching in the integrated M.S.–Ph.D. program of the same department at the Human & Environment Design Lab (HED LAB). The research asks what role space plays where the digital meets the non-digital — through affordance, digital inclusion and digital wellbeing in public and exhibition spaces — and material-led exhibition work tests the same question by hand.",

  cv: [
    { group: "Education", items: [
      { when: "— present", what: "Integrated M.S.–Ph.D. Program, Interior Architecture Design, Hanyang University", note: "Coursework completion expected" },
      { when: "",          what: "B.S. Interior Architecture Design (Major), Architecture (Minor), Hanyang University", note: "" }
    ]},
    { group: "Affiliation", items: [
      { when: "2024 —", what: "Human & Environment Design Lab (HED LAB), Hanyang University", note: "Ph.D. Student" }
    ]},
    { group: "Awards", items: [
      { when: "2025", what: "Best Paper Presentation Award — KIID Fall Conference", note: "Exhibition Space UX Design for Improving the Usability of Digital Elements" },
      { when: "2025", what: "Best Paper Presentation Award — KIID Spring Conference", note: "Affordance Design of Exhibition Spaces for the Use of Smart Docents" },
      { when: "2024", what: "Best Paper Presentation Award — KIID Fall Conference", note: "Improving the Design of General Hospital Public Spaces through WELL Certification Criteria" }
    ]},
    { group: "International Conferences", items: [
      { when: "2026", what: "EDRA 57, Amherst, USA", note: "Digital Inclusion and Spatial Affordances in South Korean Exhibition Spaces" },
      { when: "2025", what: "EDRA 56, Halifax, Canada", note: "Health and Safety in a WELL Certified Logistics Building" }
    ]},
    { group: "Exhibitions", items: [
      { when: "2026", what: "Habitare 2026, Helsinki", note: "Second Harvest" },
      { when: "2026", what: "GREEN MATERIAL Tokyo 2026", note: "Organic Glow · Shell to Shell" },
      { when: "2026", what: "38th KISD International Space Design Exhibition", note: "The Algorithm of Color" },
      { when: "2025", what: "Stockholm Furniture Fair 2025", note: "RE-TUNE : ON, PLAY, PAUSE, STOP, OFF" },
      { when: "2025", what: "Australian International Furniture Fair 2025, Melbourne", note: "Lumenlace" },
      { when: "2025", what: "KIID 2025 International Invitation Exhibition", note: "Fill Green, Feel Green" },
      { when: "2024", what: "MAISON&OBJET PARIS 2024", note: "Illumination of Tradition" },
      { when: "2024", what: "KIID 2024 International Invitation Exhibition", note: "Layers of Tradition" },
      { when: "2024", what: "31st KISD International Space Design Exhibition", note: "The Aesthetics of Layers" },
      { when: "2024", what: "KSDS 2024 International Spring Invitational Exhibition", note: "GreenUr House" }
    ]}
  ]
};

window.TYPES = {                       // order = columns on the Search page
  paper:        { label: "Publications" },
  conference:   { label: "Conferences" },
  material:     { label: "Exhibition" },
  interior:     { label: "Interior Architecture" },
  architecture: { label: "Architecture" }
};

window.PROJECTS = [
  // ── 전시 · 재료 탐구 (HED LAB activities) — TODO: summary와 material을 채워 주세요 ──
  {
    id: "m01", type: "material", year: 2026.75,
    title: "Second Harvest",
    venue: "Habitare 2026, Helsinki, Finland", role: "Juyoung Lee, Seoyoung Min, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at Habitare 2026, Helsinki, Finland."
  },
  {
    id: "m02", type: "material", year: 2026.55,
    title: "Organic Glow",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan", role: "Juyoung Lee, Euna Shin, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at GREEN MATERIAL Tokyo 2026, Tokyo, Japan."
  },
  {
    id: "m03", type: "material", year: 2026.35,
    title: "Shell to Shell",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan", role: "Juyoung Lee, Euna Shin, Soongak Jang",
    material: "",
    summary: "Exhibited at GREEN MATERIAL Tokyo 2026, Tokyo, Japan."
  },
  {
    id: "m04", type: "material", year: 2026.15,
    title: "The Algorithm of Color",
    venue: "38th KISD International Space Design Exhibition", role: "Juyoung Lee, Minkyung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at 38th KISD International Space Design Exhibition."
  },
  {
    id: "m05", type: "material", year: 2025.8,
    title: "RE-TUNE : ON, PLAY, PAUSE, STOP, OFF",
    venue: "Stockholm Furniture Fair 2025, Stockholm, Sweden", role: "Yujin Kim, Juyoung Lee, Youlim Hwang, Namhoon Jeong, Soongak Jang",
    material: "",
    summary: "Exhibited at Stockholm Furniture Fair 2025, Stockholm, Sweden."
  },
  {
    id: "m06", type: "material", year: 2025.5,
    title: "Lumenlace",
    venue: "Australian International Furniture Fair (AIFF) 2025, Melbourne, Australia", role: "Hyerim Koo, Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at Australian International Furniture Fair (AIFF) 2025, Melbourne, Australia."
  },
  {
    id: "m07", type: "material", year: 2025.2,
    title: "Fill Green, Feel Green",
    venue: "KIID 2025 International Invitation Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at KIID 2025 International Invitation Exhibition."
  },
  {
    id: "m08", type: "material", year: 2024.85,
    title: "Illumination of Tradition",
    venue: "MAISON&OBJET PARIS 2024, Paris, France", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at MAISON&OBJET PARIS 2024, Paris, France."
  },
  {
    id: "m09", type: "material", year: 2024.65,
    title: "Layers of Tradition",
    venue: "KIID 2024 International Invitation Exhibition", role: "Juyoung Lee, Yujin Kim, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at KIID 2024 International Invitation Exhibition."
  },
  {
    id: "m10", type: "material", year: 2024.4,
    title: "The Aesthetics of Layers",
    venue: "31st KISD International Space Design Exhibition", role: "Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at 31st KISD International Space Design Exhibition."
  },
  {
    id: "m11", type: "material", year: 2024.15,
    title: "GreenUr House",
    venue: "KSDS 2024 International Spring Invitational Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Exhibited at KSDS 2024 International Spring Invitational Exhibition."
  },
  // ── TODO: 아래 Architecture(공공) · Interior Architecture(가상 공간 · UX/UI) 프로젝트는 초안(가제)입니다 ──
  {
    id: "p01", type: "architecture", year: 2024.2,
    title: "Waiting Line",
    venue: "Public Design Project (TBD)", role: "Concept, Spatial Design",
    material: "Steel, concrete",
    summary: "A public design proposal that turns the time spent waiting at a stop into a single linear piece of furniture. (draft — replace)"
  },
  {
    id: "p02", type: "architecture", year: 2022.8,
    title: "Street Room",
    venue: "Public Design Competition (TBD)", role: "Team Project",
    material: "Timber",
    summary: "A public space intervention that turns gaps along a walkway into rooms to pause in. (draft — replace)"
  },
  {
    id: "v01", type: "interior", year: 2025.0,
    title: "Unfixed Rooms",
    venue: "Virtual Space Project", role: "Spatial Design, Real-time 3D",
    material: "Unreal Engine",
    summary: "A virtual space sequence whose boundaries shift with the visitor's movement. (draft — replace)"
  },
  {
    id: "v02", type: "interior", year: 2023.5,
    title: "Gallery Without Walls",
    venue: "Virtual Exhibition Space", role: "Spatial Design",
    material: "WebGL",
    summary: "A virtual exhibition space that rethinks circulation without gravity or walls. (draft — replace)"
  },
  {
    id: "u01", type: "interior", year: 2024.9,
    title: "Room Tuner",
    venue: "Virtual UX/UI Project", role: "UX Research, UI Design",
    material: "Figma, Prototype",
    summary: "An interface proposal for tuning light, sound and temperature room by room. (draft — replace)"
  },
  {
    id: "u02", type: "interior", year: 2022.4,
    title: "Wayfinding Layer",
    venue: "Virtual UX/UI Project", role: "UX/UI Design",
    material: "Figma, AR Prototype",
    summary: "A UX/UI project treating indoor wayfinding as a layer laid over space. (draft — replace)"
  },
  // ── 연구 논문 (HED LAB publications) ──
  {
    id: "r01", type: "paper", year: 2026.6,
    title: "Affordance Mechanisms of Smart Bus Shelters Based on User Behaviors",
    venue: "Journal of the Korean Institute of Spatial Design (KCI), 35(2), 483–494", role: "First author",
    material: "",
    summary: "Ju Young Lee, Min Kyung Lee, Yeon Sook Hwang"
  },
  {
    id: "r02", type: "paper", year: 2026.3,
    title: "Spatial UX Design for Exhibition Spaces in the Context of Digital Enabler Utilization",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 35(3), 90–98", role: "First author",
    material: "",
    summary: "Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r03", type: "paper", year: 2025.8,
    title: "Enhancing Spatial Acceptance of Smart Docents through Digital Inclusion and Affordance Design",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 34(4), 55–63", role: "First author",
    material: "",
    summary: "Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r04", type: "paper", year: 2025.55,
    title: "User Perception Analysis of Museum Spatial Design Based on Place Characteristics",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(5), 181–190", role: "Co-author",
    material: "",
    summary: "Feng Ming Guo, Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r05", type: "paper", year: 2025.3,
    title: "A Study on Spatial Design Elements in SNS-Friendly Exhibition Spaces Using Sentiment Analysis of Social Media Text",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(3), 529–540", role: "First author",
    material: "",
    summary: "Ju Young Lee, Hea Soo Ryu, Yeon Sook Hwang"
  },
  // ── 학회 발표 (HED LAB activities · achievements) — 수상은 해당 발표의 award에 적습니다 ──
  // KIID = 한국실내디자인학회. 수상 발표 제목은 영문 번역입니다(원제:
  //   디지털 요소 사용성 증진을 위한 전시공간 UX 디자인 연구 /
  //   스마트 도슨트 활용을 위한 전시 공간의 어포던스 디자인 연구 /
  //   WELL 인증 평가 요소를 통한 종합병원 공용공간 디자인 개선방안에 관한 연구)
  {
    id: "c01", type: "conference", year: 2026.5,
    title: "Digital Inclusion and Spatial Affordances in South Korean Exhibition Spaces",
    venue: "EDRA 57, Amherst, USA", role: "Presentation", material: "", award: "",
    summary: "Juyoung Lee, Yeonsook Hwang"
  },
  {
    id: "c02", type: "conference", year: 2025.9,
    title: "Exhibition Space UX Design for Improving the Usability of Digital Elements",
    venue: "KIID Fall Conference 2025", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "Juyoung Lee, Yeonsook Hwang"
  },
  {
    id: "c03", type: "conference", year: 2025.5,
    title: "Health and Safety in a WELL Certified Logistics Building: A Case Study of ESR Kendall Square Bucheon Logistics Park",
    venue: "EDRA 56, Halifax, Canada", role: "Presentation", material: "", award: "",
    summary: "Juyoung Lee, Hyerim Koo, Namkyu Park, Yeonsook Hwang"
  },
  {
    id: "c04", type: "conference", year: 2025.4,
    title: "Affordance Design of Exhibition Spaces for the Use of Smart Docents",
    venue: "KIID Spring Conference 2025", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "Juyoung Lee, Euna Shin, Yeonsook Hwang"
  },
  {
    id: "c05", type: "conference", year: 2024.9,
    title: "Improving the Design of General Hospital Public Spaces through WELL Certification Criteria",
    venue: "KIID Fall Conference 2024", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "Juyoung Lee, Yeonsook Hwang"
  }
];

/*
 * 아이디에이션 — 연구를 시작하기 전의 질문, 스케치, 재료 테스트 메모.
 * TODO: 초안(가제)입니다. 실제 내용으로 교체하세요.
 */
window.IDEAS = [
  { year: 2025, title: "Digital residue in physical rooms", note: "Question note (draft)" },
  { year: 2024, title: "Material that remembers touch", note: "Material test (draft)" },
  { year: 2024, title: "Screens as walls, walls as screens", note: "Sketch (draft)" }
];

