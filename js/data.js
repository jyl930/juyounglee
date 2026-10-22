/*
 * 포트폴리오 콘텐츠 — 이 파일만 수정하면 사이트 전체에 반영됩니다.
 *
 * TODO: 아래 프로젝트/논문은 레이아웃 확인용 초안(가제)입니다.
 *       실제 제목·연도·전시명·설명으로 교체하세요.
 *
 * type   : material | public | vspace | uxui | paper
 * scale  : 필드(메인 화면)의 세로 위치. 0 = 재료(mm) … 4 = 가상(무척도)
 *          같은 단계 안에서 소수점으로 미세 조정 가능 (예: 1.4)
 * year   : 가로 위치. 소수점으로 월 단위 조정 가능 (예: 2023.6)
 */

window.SITE = {
  name: "Juyoung Lee",
  nameKo: "이주영",
  role: "Researcher / Designer",
  base: "Seoul",
  coords: "37.5558°N 127.0442°E",
  email: "hello@example.com", // TODO
  links: [
    { label: "HED LAB", href: "https://hedlab.hanyang.ac.kr" },
    { label: "Google Scholar", href: "#" }, // TODO
    { label: "Instagram", href: "#" }       // TODO
  ],

  // 첫 화면 애니메이션의 세 단계 라벨 (엉킨 선 → 수렴 → 채워지는 공간)
  intro: {
    labels: ["Uncertainty", "Analysis", "Space"]
  },

  // 메인 화면 질의창에 자동으로 타이핑되는 문장들
  queries: [
    "material re-exploration",
    "public design",
    "virtual space",
    "ux/ui",
    "research"
  ],

  // 연구 관심 분야 — HED LAB members 카드 내용으로 교체
  interests: [
    "Spatial experience & human-environment interaction",
    "Virtual environments and spatial UX",
    "Material-driven design methods",
    "Public space and everyday infrastructure"
  ],

  bio: {
    ko: "서울을 기반으로 활동하는 공간 연구자이자 디자이너. 한양대학교 실내건축디자인학과를 주전공, 건축학을 부전공으로 졸업했으며, 현재 같은 학과 석박사통합과정에서 연구하고 있다. 재료의 물성을 다시 읽는 전시 작업부터 공공 공간, 가상 공간과 인터페이스까지 — 서로 다른 척도의 공간을 하나의 질문으로 엮는다.",
    en: "A Seoul-based spatial researcher and designer. Graduated from Hanyang University in Interior Architecture Design with a minor in Architecture, and currently in the integrated M.S.–Ph.D. program of the same department. The work moves across scales — from re-reading the properties of materials, to public space, to virtual environments and interfaces — held together by one question about how people meet space."
  },

  cv: [
    { group: "Education", items: [
      { when: "— present", what: "Integrated M.S.–Ph.D. Program, Interior Architecture Design, Hanyang University", note: "Coursework completion expected" },
      { when: "",          what: "B.S. Interior Architecture Design (Major), Architecture (Minor), Hanyang University", note: "" }
    ]},
    { group: "Affiliation", items: [
      { when: "— present", what: "HED LAB, Hanyang University", note: "Graduate researcher" }
    ]},
    { group: "Exhibitions", items: [
      { when: "2025", what: "International exhibition (TBD)", note: "Group exhibition" },
      { when: "2024", what: "International exhibition (TBD)", note: "Group exhibition" }
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
  {
    id: "m01", type: "material", year: 2025.4, scale: 0.35,
    title: "Folded Residue", titleKo: "접힌 잔여물",
    venue: "International Exhibition (TBD)", role: "Design, Fabrication",
    material: "Paper pulp, resin",
    summary: "버려진 재료의 결을 다시 접고 굳혀, 표면이 구조가 되는 순간을 기록한 전시 작업. (초안 설명 — 교체)"
  },
  {
    id: "m02", type: "material", year: 2024.7, scale: 0.6,
    title: "Soft Masonry", titleKo: "부드러운 조적",
    venue: "International Exhibition (TBD)", role: "Design, Fabrication",
    material: "Felt, plaster",
    summary: "단단함을 전제로 하는 조적 방식을 연한 재료로 옮겨, 쌓는 행위의 의미를 다시 묻는다. (초안 설명 — 교체)"
  },
  {
    id: "m03", type: "material", year: 2023.9, scale: 0.2,
    title: "Light Sediment", titleKo: "빛의 퇴적",
    venue: "International Exhibition (TBD)", role: "Design",
    material: "Glass, sand",
    summary: "층층이 쌓인 재료가 빛을 거르는 방식을 관찰한 재료 연구. (초안 설명 — 교체)"
  },
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
  {
    id: "r01", type: "paper", year: 2025.7, scale: 2.4,
    title: "Paper Title Placeholder A", titleKo: "논문 제목 (가제) A",
    venue: "Journal / Conference (TBD)", role: "First author",
    material: "",
    summary: "연구 요약을 입력하세요. (초안)"
  },
  {
    id: "r02", type: "paper", year: 2024.5, scale: 1.8,
    title: "Paper Title Placeholder B", titleKo: "논문 제목 (가제) B",
    venue: "Journal / Conference (TBD)", role: "Co-author",
    material: "",
    summary: "연구 요약을 입력하세요. (초안)"
  },
  {
    id: "r03", type: "paper", year: 2023.2, scale: 2.1,
    title: "Paper Title Placeholder C", titleKo: "논문 제목 (가제) C",
    venue: "Journal / Conference (TBD)", role: "First author",
    material: "",
    summary: "연구 요약을 입력하세요. (초안)"
  }
];
