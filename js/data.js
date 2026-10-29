/*
 * 포트폴리오 콘텐츠 — 이 파일만 수정하면 사이트 전체에 반영됩니다.
 *
 * 출처: HED LAB 홈페이지(member · publications · activities · achievements).
 * TODO: 공공디자인 / 가상 공간 / UX·UI 프로젝트와 아이디에이션은 아직 초안(가제)입니다.
 *       전시 작업의 설명(summary)과 재료(material)도 채워 주세요.
 *
 * type   : material | public | vspace | uxui | paper
 * scale  : 필드(메인 화면)의 세로 위치. 0 = 재료(mm) … 4 = 가상(무척도)
 *          같은 단계 안에서 소수점으로 미세 조정 가능 (예: 1.4)
 * year   : 가로 위치. 소수점은 같은 해 안에서 점을 벌려 놓기 위한 값이고,
 *          화면에는 연도만 표시됩니다. scale 값은 추정치이니 필요하면 조정하세요.
 */

window.SITE = {
  name: "Juyoung Lee",
  nameKo: "이주영",
  role: "Researcher / Designer",
  base: "Seoul",
  coords: "37.5558°N 127.0442°E",
  email: "jyl930@hanyang.ac.kr",
  links: [
    { label: "HED LAB", href: "https://hedlab.hanyang.ac.kr" },
    { label: "Google Scholar", href: "#" }, // TODO
    { label: "Instagram", href: "#" }       // TODO
  ],

  // 첫 화면 시퀀스의 세 단계 — 각 단계를 누르면 해당 페이지로 이동
  stages: [
    { key: "material",     route: "#/material",     no: "01", label: "Material & Ideation",    ko: "재료 탐구 · 아이디에이션" },
    { key: "talks",        route: "#/conferences",  no: "02", label: "Conferences & Awards",   ko: "학회 발표 · 수상" },
    { key: "publications", route: "#/publications", no: "03", label: "Publications",           ko: "연구 논문" }
  ],

  // 메인 화면 질의창에 자동으로 타이핑되는 문장들
  queries: [
    "affordance",
    "digital inclusion",
    "material re-exploration",
    "exhibition space",
    "public space"
  ],

  // 연구 관심 분야 — HED LAB member 카드
  interests: [
    "Public Spaces",
    "Inclusive Design",
    "Digital Wellbeing",
    "Affordance"
  ],

  bio: {
    ko: "서울을 기반으로 활동하는 공간 연구자이자 디자이너. 한양대학교 실내건축디자인학과를 주전공, 건축학을 부전공으로 졸업했으며, 현재 같은 학과 석박사통합과정에서 Human & Environment Design Lab(HED LAB) 소속으로 연구하고 있다. 디지털과 비디지털이 만나는 자리에서 공간이 어떤 역할을 하는지를 어포던스, 디지털 포용, 디지털 웰빙의 관점에서 묻고, 재료를 다시 읽는 전시 작업으로 그 질문을 손으로 확인한다.",
    en: "A Seoul-based spatial researcher and designer. Graduated from Hanyang University in Interior Architecture Design with a minor in Architecture, and now researching in the integrated M.S.–Ph.D. program of the same department at the Human & Environment Design Lab (HED LAB). The research asks what role space plays where the digital meets the non-digital — through affordance, digital inclusion and digital wellbeing in public and exhibition spaces — and material-led exhibition work tests the same question by hand."
  },

  cv: [
    { group: "Education", items: [
      { when: "— present", what: "Integrated M.S.–Ph.D. Program, Interior Architecture Design, Hanyang University", note: "Coursework completion expected" },
      { when: "",          what: "B.S. Interior Architecture Design (Major), Architecture (Minor), Hanyang University", note: "" }
    ]},
    { group: "Affiliation", items: [
      { when: "2024 —", what: "Human & Environment Design Lab (HED LAB), Hanyang University", note: "Ph.D. Student" }
    ]},
    { group: "Awards", items: [
      { when: "2025", what: "우수논문발표상 — 한국실내디자인학회 추계학술발표대회", note: "디지털 요소 사용성 증진을 위한 전시공간 UX 디자인 연구" },
      { when: "2025", what: "우수논문발표상 — 한국실내디자인학회 춘계학술발표대회", note: "스마트 도슨트 활용을 위한 전시 공간의 어포던스 디자인 연구" },
      { when: "2024", what: "우수논문발표상 — 한국실내디자인학회 추계학술발표대회", note: "WELL 인증 평가 요소를 통한 종합병원 공용공간 디자인 개선방안에 관한 연구" }
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

window.TYPES = {
  material: { label: "Material",      ko: "재료 재탐구 · 전시" },
  public:   { label: "Public Design", ko: "공공디자인" },
  vspace:   { label: "Virtual Space", ko: "가상 공간디자인" },
  uxui:     { label: "UX/UI",         ko: "가상 UX/UI 디자인" },
  paper:    { label: "Research",      ko: "연구 논문" }
};

window.PROJECTS = [
  // ── 전시 · 재료 탐구 (HED LAB activities) — TODO: summary와 material을 채워 주세요 ──
  {
    id: "m01", type: "material", year: 2026.75, scale: 0.35,
    title: "Second Harvest", titleKo: "",
    venue: "Habitare 2026, Helsinki, Finland", role: "Juyoung Lee, Seoyoung Min, Yeonsook Hwang",
    material: "",
    summary: "Habitare 2026, Helsinki, Finland 출품작."
  },
  {
    id: "m02", type: "material", year: 2026.55, scale: 0.7,
    title: "Organic Glow", titleKo: "",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan", role: "Juyoung Lee, Euna Shin, Yeonsook Hwang",
    material: "",
    summary: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan 출품작."
  },
  {
    id: "m03", type: "material", year: 2026.35, scale: 0.2,
    title: "Shell to Shell", titleKo: "",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan", role: "Juyoung Lee, Euna Shin, Soongak Jang",
    material: "",
    summary: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan 출품작."
  },
  {
    id: "m04", type: "material", year: 2026.15, scale: 0.85,
    title: "The Algorithm of Color", titleKo: "",
    venue: "38th KISD International Space Design Exhibition", role: "Juyoung Lee, Minkyung Lee, Yeonsook Hwang",
    material: "",
    summary: "38th KISD International Space Design Exhibition 출품작."
  },
  {
    id: "m05", type: "material", year: 2025.8, scale: 1.5,
    title: "RE-TUNE : ON, PLAY, PAUSE, STOP, OFF", titleKo: "",
    venue: "Stockholm Furniture Fair 2025, Stockholm, Sweden", role: "Yujin Kim, Juyoung Lee, Youlim Hwang, Namhoon Jeong, Soongak Jang",
    material: "",
    summary: "Stockholm Furniture Fair 2025, Stockholm, Sweden 출품작."
  },
  {
    id: "m06", type: "material", year: 2025.5, scale: 1.3,
    title: "Lumenlace", titleKo: "",
    venue: "Australian International Furniture Fair (AIFF) 2025, Melbourne, Australia", role: "Hyerim Koo, Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Australian International Furniture Fair (AIFF) 2025, Melbourne, Australia 출품작."
  },
  {
    id: "m07", type: "material", year: 2025.2, scale: 0.5,
    title: "Fill Green, Feel Green", titleKo: "",
    venue: "KIID 2025 International Invitation Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "KIID 2025 International Invitation Exhibition 출품작."
  },
  {
    id: "m08", type: "material", year: 2024.85, scale: 1.4,
    title: "Illumination of Tradition", titleKo: "",
    venue: "MAISON&OBJET PARIS 2024, Paris, France", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "MAISON&OBJET PARIS 2024, Paris, France 출품작."
  },
  {
    id: "m09", type: "material", year: 2024.65, scale: 0.6,
    title: "Layers of Tradition", titleKo: "",
    venue: "KIID 2024 International Invitation Exhibition", role: "Juyoung Lee, Yujin Kim, Yeonsook Hwang",
    material: "",
    summary: "KIID 2024 International Invitation Exhibition 출품작."
  },
  {
    id: "m10", type: "material", year: 2024.4, scale: 0.3,
    title: "The Aesthetics of Layers", titleKo: "",
    venue: "31st KISD International Space Design Exhibition", role: "Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "31st KISD International Space Design Exhibition 출품작."
  },
  {
    id: "m11", type: "material", year: 2024.15, scale: 1.7,
    title: "GreenUr House", titleKo: "",
    venue: "KSDS 2024 International Spring Invitational Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "KSDS 2024 International Spring Invitational Exhibition 출품작."
  },
  // ── TODO: 아래 공공디자인 · 가상 공간 · UX/UI 프로젝트는 초안(가제)입니다 ──
  {
    id: "p01", type: "public", year: 2024.2, scale: 3.3,
    title: "Waiting Line", titleKo: "기다림의 선",
    venue: "Public Design Project (TBD)", role: "Concept, Spatial Design",
    material: "Steel, concrete",
    summary: "정류장의 '기다리는 시간'을 하나의 선형 가구로 풀어낸 공공디자인 제안. (초안 설명 — 교체)"
  },
  {
    id: "p02", type: "public", year: 2022.8, scale: 3.6,
    title: "Street Room", titleKo: "거리의 방",
    venue: "Public Design Competition (TBD)", role: "Team Project",
    material: "Timber",
    summary: "보행로의 빈틈을 잠시 머무는 방으로 바꾸는 공공 공간 개입. (초안 설명 — 교체)"
  },
  {
    id: "v01", type: "vspace", year: 2025.0, scale: 4.3,
    title: "Unfixed Rooms", titleKo: "고정되지 않은 방",
    venue: "Virtual Space Project", role: "Spatial Design, Real-time 3D",
    material: "Unreal Engine",
    summary: "사용자의 움직임에 따라 경계가 바뀌는 가상 공간 시퀀스. (초안 설명 — 교체)"
  },
  {
    id: "v02", type: "vspace", year: 2023.5, scale: 4.55,
    title: "Gallery Without Walls", titleKo: "벽 없는 갤러리",
    venue: "Virtual Exhibition Space", role: "Spatial Design",
    material: "WebGL",
    summary: "중력과 벽이 없는 조건에서 전시 동선을 재구성한 가상 전시 공간. (초안 설명 — 교체)"
  },
  {
    id: "u01", type: "uxui", year: 2024.9, scale: 4.75,
    title: "Room Tuner", titleKo: "룸 튜너",
    venue: "Virtual UX/UI Project", role: "UX Research, UI Design",
    material: "Figma, Prototype",
    summary: "실내 환경(빛·소리·온도)을 공간 단위로 조율하는 인터페이스 제안. (초안 설명 — 교체)"
  },
  {
    id: "u02", type: "uxui", year: 2022.4, scale: 4.2,
    title: "Wayfinding Layer", titleKo: "길찾기 레이어",
    venue: "Virtual UX/UI Project", role: "UX/UI Design",
    material: "Figma, AR Prototype",
    summary: "실내 길찾기를 공간 위에 겹쳐지는 레이어로 다룬 UX/UI 프로젝트. (초안 설명 — 교체)"
  },
  // ── 연구 논문 (HED LAB publications) ──
  {
    id: "r01", type: "paper", year: 2026.6, scale: 3.3,
    title: "Affordance Mechanisms of Smart Bus Shelters Based on User Behaviors", titleKo: "",
    venue: "Journal of the Korean Institute of Spatial Design (KCI), 35(2), 483–494", role: "First author",
    material: "",
    summary: "Ju Young Lee, Min Kyung Lee, Yeon Sook Hwang"
  },
  {
    id: "r02", type: "paper", year: 2026.3, scale: 2.4,
    title: "Spatial UX Design for Exhibition Spaces in the Context of Digital Enabler Utilization", titleKo: "",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 35(3), 90–98", role: "First author",
    material: "",
    summary: "Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r03", type: "paper", year: 2025.8, scale: 2.2,
    title: "Enhancing Spatial Acceptance of Smart Docents through Digital Inclusion and Affordance Design", titleKo: "",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 34(4), 55–63", role: "First author",
    material: "",
    summary: "Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r04", type: "paper", year: 2025.55, scale: 2.7,
    title: "User Perception Analysis of Museum Spatial Design Based on Place Characteristics", titleKo: "",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(5), 181–190", role: "Co-author",
    material: "",
    summary: "Feng Ming Guo, Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r05", type: "paper", year: 2025.3, scale: 2.5,
    title: "A Study on Spatial Design Elements in SNS-Friendly Exhibition Spaces Using Sentiment Analysis of Social Media Text", titleKo: "",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(3), 529–540", role: "First author",
    material: "",
    summary: "Ju Young Lee, Hea Soo Ryu, Yeon Sook Hwang"
  }
];

/*
 * 아이디에이션 — 연구를 시작하기 전의 질문, 스케치, 재료 테스트 메모.
 * TODO: 초안(가제)입니다. 실제 내용으로 교체하세요.
 */
window.IDEAS = [
  { year: 2025, title: "Digital residue in physical rooms", titleKo: "물리적 공간에 남는 디지털의 흔적", note: "질문 메모 (초안)" },
  { year: 2024, title: "Material that remembers touch",     titleKo: "접촉을 기억하는 재료",           note: "재료 테스트 (초안)" },
  { year: 2024, title: "Screens as walls, walls as screens", titleKo: "벽이 되는 화면, 화면이 되는 벽", note: "스케치 (초안)" }
];

/*
 * 학회 발표 · 수상 (HED LAB activities · achievements).
 * kind : Presentation | Award
 * year 소수점은 화면 배치용이며, 표시는 연도만 됩니다.
 */
window.TALKS = [
  { year: 2026.5,  kind: "Presentation", title: "Digital Inclusion and Spatial Affordances in South Korean Exhibition Spaces", venue: "EDRA 57 · Amherst, USA" },
  { year: 2025.9,  kind: "Award",        title: "디지털 요소 사용성 증진을 위한 전시공간 UX 디자인 연구", venue: "우수논문발표상 · 한국실내디자인학회 추계학술발표대회" },
  { year: 2025.5,  kind: "Presentation", title: "Health and Safety in a WELL Certified Logistics Building: A Case Study of ESR Kendall Square Bucheon Logistics Park", venue: "EDRA 56 · Halifax, Canada" },
  { year: 2025.4,  kind: "Award",        title: "스마트 도슨트 활용을 위한 전시 공간의 어포던스 디자인 연구", venue: "우수논문발표상 · 한국실내디자인학회 춘계학술발표대회" },
  { year: 2024.9,  kind: "Award",        title: "WELL 인증 평가 요소를 통한 종합병원 공용공간 디자인 개선방안에 관한 연구", venue: "우수논문발표상 · 한국실내디자인학회 추계학술발표대회" }
];
