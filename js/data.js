/*
 * 포트폴리오 콘텐츠 — 이 파일만 수정하면 사이트 전체에 반영됩니다.
 *
 * 출처: HED LAB 홈페이지(member · publications · activities · achievements).
 * 화면에 보이는 문구는 모두 영문입니다(한글은 이 파일의 주석에만 씁니다).
 * TODO: 공공디자인 / 가상 공간 / UX·UI 프로젝트와 아이디에이션은 아직 초안(가제)입니다.
 *       전시 작업의 설명(summary)과 재료(material)도 채워 주세요.
 *
 * type   : paper | conference | material | project
 *          (Publications · Conferences · Exhibition · Projects)
 * year   : Search 화면의 세로 위치. 소수점은 같은 해 안에서 점을 벌려 놓기 위한 값이고,
 *          화면에는 연도만 표시됩니다.
 * award  : (선택) 수상 내역 — 카드와 상세에 함께 표시됩니다.
 * media  : (선택) 이미지·영상 목록. 첫 번째가 카드 표지, 전부 상세 화면 갤러리에 나옵니다.
 *          파일은 assets/works/<id>/ 에 두고 경로를 적습니다. 예:
 *            media: ["assets/works/m01/01.jpg", "assets/works/m01/02.mp4", "https://youtu.be/xxxxxxxxxxx"]
 *          · 이미지: jpg / png / webp — 긴 변 2000px 안팎
 *          · 영상 파일: mp4(H.264) / webm — 카드에서는 마우스를 올리면 소리 없이 재생.
 *            GitHub는 100MB 넘는 파일을 받지 않으니 1080p로 압축해 20–50MB 이하로.
 *          · YouTube / Vimeo 주소: 상세 화면에서 바로 재생 (카드 표지로는 쓰이지 않음)
 * link   : (선택) 논문 DOI·PDF, 영상 등 외부 링크 — 상세 화면에 버튼으로 표시
 * invited: (선택) 국제초대전 — Exhibition 페이지에서 이미지 카드 대신 텍스트 목록으로 표시
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
      { id: "projects", label: "Projects", type: "project",
        lead: "Spatial and interior design projects from studio, coursework and practice." }
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
      { when: "2019 —",    what: "B.S. Interior Architecture Design (Major), Architecture (Minor), Hanyang University", note: "Major from 2019 · Architecture minor from 2020" }
    ]},
    { group: "Affiliation", items: [
      { when: "2024 —", what: "Human & Environment Design Lab (HED LAB), Hanyang University", note: "Ph.D. Student" }
    ]},
    { group: "Experience", items: [
      { when: "2023",      what: "Project Designer — Jun and Jun corp.", note: "Pop-up booth interior design for cremecrumble, The Hyundai Seoul (08–09.2023)" },
      { when: "2022 —",    what: "Assistant Designer — Jun and Jun corp.", note: "cremecrumble dessert package design, brand poster, sticker and cartoon (from 09.2022)" },
      { when: "2022",      what: "Project Designer — Massiv. corp.", note: "English textbook design for high school students (03–06.2022)" }
    ]},
    { group: "Awards", items: [
      { when: "2025", what: "Best Paper Presentation Award — KIID Fall Conference", note: "Spatial UX for Usability of Digital Elements in Exhibition Spaces" },
      { when: "2025", what: "Best Paper Presentation Award — KIID Spring Conference", note: "A Study on Spatial Affordance Design in Exhibition Spaces for the Use of Smart Docent" },
      { when: "2024", what: "Best Paper Presentation Award — KIID Fall Conference", note: "A Study on the Improvement of Public Space Design in General Hospital through WELL Building Standard" },
      { when: "2023",      what: "Most Innovative Student Project of the Year — Larsen Architecture", note: "RE:Plastiground" },
      { when: "2023",      what: "Kyoto Global Design Awards 2023 — Environment", note: "RE:Plastiground" },
      { when: "2023",      what: "Best Paper Presentation Award — KIID Fall Conference", note: "RE:Plastiground" }
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
  project:      { label: "Projects" }
};

window.PROJECTS = [
  // ── 전시 · 재료 탐구 (HED LAB activities) — TODO: summary와 material을 채워 주세요 ──
  {
    id: "m01", type: "material", year: 2026.75,
    title: "Second Harvest",
    venue: "Habitare 2026, Helsinki, Finland",
    role: "Juyoung Lee, Seoyoung Min, Euna Shin, Yeonsook Hwang",
    material: "Rice husk, pectin, glycerin, calcium acetate",
    media: ["assets/works/m01/01.jpg", "assets/works/m01/02.jpg", "assets/works/m01/03.jpg", "assets/works/m01/04.jpg", "assets/works/m01/05.jpg", "assets/works/m01/06.jpg", "assets/works/m01/07.jpg", "assets/works/m01/08.jpg", "assets/works/m01/09.jpg", "assets/works/m01/10.jpg", "assets/works/m01/11.jpg"],
    summary: "Second Harvest reimagines agricultural waste as a lightweight interior material. Rice husk — one of the world's most abundant agricultural by-products — is washed, dried, milled and blended with naturally derived binders into a slurry, then molded and cured at low temperature into a bio brick, without synthetic resin adhesives. The process keeps the husk's fibrous texture while minimizing energy, showing an accessible, renewable way to make interior finishing materials from agricultural biomass."
  },
  {
    id: "m02", type: "material", year: 2026.55,
    title: "Organic Glow",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan",
    role: "Juyoung Lee, Euna Shin, Yeonsook Hwang",
    material: "Biodegradable pectin leather from lemon, grapefruit and apple peels",
    media: ["assets/works/m02/01.jpg"],
    summary: "A pendant light crafted from biodegradable pectin leather derived from lemon, grapefruit and apple peels. Inspired by the act of peeling fruit, the translucent skin unspools to reveal a bright core when pulled, and naturally coils back to dim the light when closed — letting users modulate brightness by hand, blending nature's raw texture with the elegance of light."
  },
  {
    id: "m03", type: "material", year: 2026.35,
    title: "Shell to Shell",
    venue: "GREEN MATERIAL Tokyo 2026, Tokyo, Japan",
    role: "Juyoung Lee, Euna Shin",
    material: "Pectin from fruit peels, medical gauze, eggshell calcium carbonate, fiberglass mesh",
    media: ["assets/works/m03/01.jpg", "assets/works/m03/02.jpg", "assets/works/m03/03.jpg", "assets/works/m03/04.jpg", "assets/works/m03/05.jpg", "assets/works/m03/06.jpg", "assets/works/m03/07.jpg", "assets/works/m03/08.jpg", "assets/works/m03/09.jpg", "assets/works/m03/10.jpg", "assets/works/m03/11.jpg", "assets/works/m03/12.jpg", "assets/works/m03/13.jpg", "assets/works/m03/14.jpg"],
    summary: "Shell to Shell treats discarded peels and shells as the architects of future structures. Across three series, pectin thickens from film to fabric to structure: Shell we FORM? (Euna Shin) recasts nine everyday objects in translucent pectin film; Shell we HOLD? (Juyoung Lee) reinforces it with medical gauze into a leather-like, water-soluble bag designed to dissolve once its purpose is fulfilled; Shell we STAND? (Juyoung Lee, Euna Shin) cross-links pectin with eggshell calcium carbonate into rigid vessels and planters that biodegrade into the soil. The work proposes that a material's ending can be its return."
  },
  {
    id: "m04", type: "material", year: 2026.15,
    title: "The Algorithm of Color",
    invited: true,
    venue: "38th KISD International Space Design Exhibition", role: "Juyoung Lee, Minkyung Lee, Yeonsook Hwang",
    material: "",
    summary: "Shown at the 38th KISD International Space Design Exhibition."
  },
  {
    id: "m05", type: "material", year: 2025.8,
    title: "RE-TUNE : ON, PLAY, PAUSE, STOP, OFF",
    venue: "Stockholm Furniture Fair 2025, Stockholm, Sweden",
    role: "Juyoung Lee, Namhoon Jeong, Yujin Kim, Youlim Hwang",
    material: "PCBs, LEDs, wires and buttons from discarded electronic instrument toys",
    media: ["assets/works/m05/01.mp4", "assets/works/m05/02.jpg", "assets/works/m05/03.jpg", "assets/works/m05/04.jpg", "assets/works/m05/05.mp4", "assets/works/m05/06.jpg", "assets/works/m05/07.jpg", "assets/works/m05/08.jpg", "assets/works/m05/09.jpg", "assets/works/m05/10.jpg", "assets/works/m05/11.jpg", "assets/works/m05/12.jpg", "assets/works/m05/13.mp4", "assets/works/m05/14.jpg", "assets/works/m05/15.jpg", "assets/works/m05/16.jpg", "assets/works/m05/17.jpg"],
    summary: "RE-TUNE follows an electronic instrument toy from purchase to disposal in five stages — ON, PLAY, PAUSE, STOP, OFF — to show the environmental cost of short-lived consumer products. Inspired by the printed circuit board inside the toy, the team reinterprets its elements into new pieces. In Play, Circuit, Board! (Juyoung Lee, Namhoon Jeong; W600×D630×H50), LEDs, wires and buttons recovered from the toys trace the electrical pathways of the PCB, their changing speed and colour expressing the five stages; because the boards resisted heat and laser cutting, they were shaped by hand with a precision grinder."
  },
  {
    id: "m06", type: "material", year: 2025.5,
    title: "Lumenlace",
    venue: "Australian International Furniture Fair (AIFF) 2025, Melbourne, Australia",
    role: "Hyerim Koo, Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "Wood — W900 × D900 × H1300",
    media: ["assets/works/m06/01.jpg"],
    summary: "A lighting structure built on traditional Korean joinery (Jangbu-Majchum). Hanok architecture draws its strength from precisely interlocking parts rather than nails or glue, much as a neural network's power comes from connections rather than individual neurons. Lumenlace makes this shared principle visible: its lamps plug into one another to form a structure defined by relationships, and light flows through the connections — the relationship is the structure."
  },
  {
    id: "m07", type: "material", year: 2025.2,
    title: "Fill Green, Feel Green",
    invited: true,
    venue: "KIID 2025 International Invitation Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Shown at the KIID 2025 International Invitation Exhibition."
  },
  {
    id: "m08", type: "material", year: 2024.85,
    title: "Illumination of Tradition",
    venue: "MAISON&OBJET PARIS 2024 (Autumn), Paris, France",
    role: "Juyoung Lee, Yeonsook Hwang",
    material: "Jogakbo patchwork of fabrics dyed with natural Korean dyes",
    media: ["assets/works/m08/01.jpg", "assets/works/m08/02.jpg", "assets/works/m08/03.jpg", "assets/works/m08/04.jpg"],
    summary: "A lighting object built from Jogakbo, the traditional Korean craft of sewing together leftover pieces of fabric, using textiles dyed with natural Korean dyes. Inspired by the Cheongsachorong lantern, its cool and warm versions express the balance of yin and yang; the light brings out the colours and patterns of the patchwork, reinterpreting traditional Korean aesthetics with a contemporary touch."
  },
  {
    id: "m09", type: "material", year: 2024.65,
    title: "Layers of Tradition",
    invited: true,
    venue: "KIID 2024 International Invitation Exhibition", role: "Juyoung Lee, Yujin Kim, Yeonsook Hwang",
    material: "",
    summary: "Shown at the KIID 2024 International Invitation Exhibition."
  },
  {
    id: "m10", type: "material", year: 2024.4,
    title: "The Aesthetics of Layers",
    invited: true,
    venue: "31st KISD International Space Design Exhibition", role: "Yujin Kim, Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Shown at the 31st KISD International Space Design Exhibition."
  },
  {
    id: "m11", type: "material", year: 2024.15,
    title: "GreenUr House",
    invited: true,
    venue: "KSDS 2024 International Spring Invitational Exhibition", role: "Juyoung Lee, Yeonsook Hwang",
    material: "",
    summary: "Shown at the KSDS 2024 International Spring Invitational Exhibition."
  },
  // ── Projects (CV) ──
  {
    id: "j01", type: "project", year: 2023.65,
    title: "Cremecrumble Pop-up Booth",
    venue: "The Hyundai Seoul", role: "Project Designer, Jun and Jun corp.",
    material: "",
    summary: "Pop-up booth interior design for the cookie shop cremecrumble at The Hyundai Seoul department store, August–September 2023."
  },
  {
    id: "j02", type: "project", year: 2023.85,
    title: "RE:Plastiground",
    venue: "20th Graduation Exhibition, Interior Architecture Design, Hanyang University (2023)",
    role: "Team leader — with Ju Yeon Lee, Mee So Lim",
    award: "Kyoto Global Design Awards 2023, Environment · Larsen Architecture, Most Innovative Student Project of the Year · KIID Fall Conference 2023 Best Paper Presentation Award",
    media: ["assets/works/j02/01.jpg", "assets/works/j02/02.mp4", "assets/works/j02/03.mp4", "assets/works/j02/04.mp4", "assets/works/j02/05.jpg", "assets/works/j02/06.jpg", "assets/works/j02/07.jpg", "assets/works/j02/08.jpg", "assets/works/j02/09.jpg", "assets/works/j02/10.jpg", "assets/works/j02/11.jpg", "assets/works/j02/12.jpg", "assets/works/j02/13.jpg"],
    summary: "RE:Plastiground — where plastic meets play — is an experiential recycling factory. Visitors meet giant bales of discarded plastic, watch it cleaned, sorted and shredded in a working Real Factory, and see it reborn as pellets that creators turn into new products in an upcycling factory. Plastic from nearby screening facilities returns to people as floors, furniture and merchandise, and the programme is structured around Csikszentmihalyi's flow theory so the experience becomes a lasting memory. The building itself follows the logic of plastic flakes — one whole massive plastic to walk through."
  },
  {
    id: "j03", type: "project", year: 2022.85,
    title: "Rider for Society",
    venue: "Interior architecture studio, Hanyang University (2022)",
    role: "with Ju Yeon Lee, Mee So Lim",
    media: ["assets/works/j03/01.jpg", "assets/works/j03/02.jpg", "assets/works/j03/03.jpg", "assets/works/j03/04.jpg", "assets/works/j03/05.jpg", "assets/works/j03/06.jpg", "assets/works/j03/07.jpg", "assets/works/j03/08.jpg", "assets/works/j03/09.jpg", "assets/works/j03/10.jpg", "assets/works/j03/11.jpg", "assets/works/j03/12.jpg"],
    summary: "A support network for delivery riders, whose numbers have grown with delivery platforms while safety training stays weak and rest spaces go unused. Under the concept of convert, the Narakium Sinsa Building in Gangnam is remodelled into a main hub for education, communication, support and healing — vehicle rental and parking below ground, a cafeteria on the ground floor, skip-floor education spaces above — while modular convertible-cube unit hubs can be assembled on other sites as local rest stops."
  },
  {
    id: "j04", type: "project", year: 2023.79,
    title: "Re:cycle Re:place",
    venue: "Seoul is Museum — Seoul public art university collaboration project",
    role: "Main poster design, furniture module structure — Interior Architecture Design, Hanyang University",
    link: "https://seoulismuseum.kr/seoul/index.do?content=%2fseoul%2farchive.do%3fvol%3d54%26rid%3d266",
    media: ["assets/works/j04/01.jpg", "assets/works/j04/02.jpg", "assets/works/j04/03.mp4", "assets/works/j04/04.jpg", "assets/works/j04/05.jpg", "assets/works/j04/06.jpg", "assets/works/j04/07.jpg", "assets/works/j04/08.jpg", "assets/works/j04/09.jpg", "assets/works/j04/10.jpg", "assets/works/j04/11.jpg", "assets/works/j04/12.jpg", "assets/works/j04/13.jpg", "assets/works/j04/14.jpg", "assets/works/j04/15.jpg", "assets/works/j04/16.jpg", "assets/works/j04/17.jpg", "assets/works/j04/18.jpg", "assets/works/j04/19.jpg", "assets/works/j04/20.jpg"],
    summary: "A pavilion for the square in front of Yongdap Station, Seongdong-gu, Seoul (15–21 October 2023), built from plastic waste collected from citizens to become a place of communication. After the exhibition the pavilion is taken apart and recycled again, proposing a circular system for temporary public architecture."
  },
  {
    id: "j05", type: "project", year: 2021.85,
    title: "GreenUr House",
    venue: "Architectural Design Studio II, School of Architecture, Hanyang University (2021)",
    role: "Individual project",
    media: ["assets/works/j05/01.jpg", "assets/works/j05/02.jpg", "assets/works/j05/03.jpg", "assets/works/j05/04.jpg", "assets/works/j05/05.jpg", "assets/works/j05/06.jpg", "assets/works/j05/07.jpg", "assets/works/j05/08.jpg", "assets/works/j05/09.jpg", "assets/works/j05/10.jpg", "assets/works/j05/11.jpg", "assets/works/j05/12.jpg", "assets/works/j05/13.jpg", "assets/works/j05/14.jpg", "assets/works/j05/15.jpg", "assets/works/j05/16.jpg", "assets/works/j05/17.jpg"],
    summary: "Greener + Urban House: a prototype that combines urban farming with housing on a site opening onto Seoul Forest in Seongsu-dong. A hexagonal grid organises the site to connect nature, residents and the city and to maximise solar gain; a greenhouse acts as the house's courtyard, green steps lead up from the street, and a sunken level steadies the temperature, so the house can seed a green network with the cafés and restaurants around it. Also shown at the KSDS 2024 International Spring Invitational Exhibition."
  },
  // ── 연구 논문 (HED LAB publications) ──
  {
    id: "r01", type: "paper", year: 2026.6,
    title: "Affordance Mechanisms of Smart Bus Shelters Based on User Behaviors",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 21(5), 483–494", role: "First author",
    material: "",
    link: "https://doi.org/10.35216/kisd.2026.21.5.483",
    summary: "Smart shelters now integrate real-time transit information, environmental control and safety services, but installing technology does not guarantee people can recognise and use it. Reading five curbside smart shelters in Seoul as affordance spaces, the study maps access, waiting, boarding, information checking and smart-function use against three affordance mechanisms — bids, responses and neutral support — and finds strong prompting but broken guidance at transitions, proposing a connected sequence for more continuous, inclusive use. — Ju Young Lee, Min Kyung Lee, Yeon Sook Hwang"
  },
  {
    id: "r02", type: "paper", year: 2026.3,
    title: "Spatial UX Design for Exhibition Spaces in the Context of Digital Enabler Utilization",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 35(3), 90–98", role: "First author",
    material: "",
    link: "https://doi.org/10.14774/JKIID.2026.35.3.090",
    summary: "As cultural spaces enter the phygital era, digital enablers in exhibitions often cause cognitive overload and techno-stress — the digital paradox. Through a literature review and open coding, the study classifies digital enablers into three categories and derives four spatial UX dimensions: physical sensory environment, information interaction, social engagement and emotional wellbeing. An on-site checklist applied to five exhibition spaces in Seoul found accessibility options buried in secondary interface layers, device heights fixed for adults, digital guidance misaligned with physical signage, overlapping audiovisual stimuli and few recovery spaces. It proposes accessibility controls at the first interface level, adjustable body-responsive device placement, cognitive-load mitigation zones and emotional recovery spaces, positioning spatial UX as a mediator of digital wellbeing. — Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r03", type: "paper", year: 2025.8,
    title: "Enhancing Spatial Acceptance of Smart Docents through Digital Inclusion and Affordance Design",
    venue: "Journal of the Korean Institute of Interior Design (KCI), 34(4), 55–63", role: "First author",
    material: "",
    link: "https://doi.org/10.14774/JKIID.2025.34.4.055",
    summary: "Smart docents offer real-time personalised guidance, but differences in digital capacity can open a gap in experience. Grounded in digital inclusion, the study combines the Technology Acceptance Model and Hartson's affordance theory in a mixed-methods design. Surveys showed perceived usefulness drove intention to use, digital inclusion shaped both perceived ease of use and usefulness, and older adults used smart docents more despite lower digital inclusion. Field studies at the National Museum of Korea, the National Museum of Modern and Contemporary Art and Leeum Museum of Art pointed to spaces that support dwell time and device use, consistent visual guidance and layouts for autonomous navigation, leading to design strategies that raise the spatial acceptance of digital exhibition guides. — Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r04", type: "paper", year: 2025.55,
    title: "User Perception Analysis of Museum Spatial Design Based on Place Characteristics",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(5), 181–190", role: "Co-author",
    material: "",
    link: "https://doi.org/10.35216/kisd.2025.20.5.181",
    summary: "Museums are becoming cultural and experiential platforms, yet little research asks how users perceive the space itself. A survey of 250 visitors compared the importance of and satisfaction with physical, activity and meaning characteristics of museum space; activity characteristics — interactivity and convenience — mattered most while satisfaction with experience programmes was lowest, pointing to design elements that strengthen a sense of place. — Feng Ming Guo, Ju Young Lee, Yeon Sook Hwang"
  },
  {
    id: "r05", type: "paper", year: 2025.3,
    title: "A Study on Spatial Design Elements in SNS-Friendly Exhibition Spaces Using Sentiment Analysis of Social Media Text",
    venue: "Journal of the Korea Institute of Spatial Design (KCI), 20(3), 529–540", role: "First author",
    material: "",
    link: "https://doi.org/10.35216/kisd.2025.20.3.529",
    summary: "Social media has turned exhibitions into spaces visitors share as much as view. Using sentiment analysis of social media text about ARTE MUSEUM, Korea's largest immersive media art brand, the study links visual, auditory and tactile design elements to visitors' emotional responses and derives spatial design elements that raise emotional satisfaction in SNS-friendly exhibitions. — Ju Young Lee, Hea Soo Ryu, Yeon Sook Hwang"
  },
  // ── 학회 발표 (HED LAB activities · achievements · portfolio-content) — 수상은 해당 발표의 award에 적습니다 ──
  // KIID = 한국실내디자인학회. 제목은 각 논문의 공식 영문 제목입니다.
  {
    id: "c01", type: "conference", year: 2026.5,
    title: "Digital Inclusion and Spatial Affordances in South Korean Exhibition Spaces",
    venue: "EDRA 57, Amherst, USA", role: "Presentation", material: "", award: "",
    media: ["assets/works/c01/01.jpg"],
    summary: "How exhibition spaces in South Korea can support visitors with different digital abilities through spatial affordances. — Juyoung Lee, Yeonsook Hwang"
  },
  {
    id: "c02", type: "conference", year: 2025.9,
    title: "Spatial UX for Usability of Digital Elements in Exhibition Spaces",
    venue: "KIID Fall Conference 2025", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "A spatial UX framework for the digital elements of exhibition spaces — accessibility, ergonomic compatibility, interactivity and emotional stability. — Juyoung Lee, Yeonsook Hwang"
  },
  {
    id: "c03", type: "conference", year: 2025.5,
    title: "Health and Safety in a WELL Certified Logistics Building: A Case Study of ESR Kendall Square Bucheon Logistics Park",
    venue: "EDRA 56, Halifax, Canada", role: "Presentation", material: "", award: "",
    media: ["assets/works/c03/01.jpg"],
    summary: "A case study of health and safety in a WELL-certified logistics building, ESR Kendall Square Bucheon Logistics Park. — Juyoung Lee, Hyerim Koo, Namkyu Park, Yeonsook Hwang"
  },
  {
    id: "c04", type: "conference", year: 2025.4,
    title: "A Study on Spatial Affordance Design in Exhibition Spaces for the Use of Smart Docent",
    venue: "KIID Spring Conference 2025", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "Spatial affordance design that helps visitors find and use smart docents, grounded in digital inclusion. — Juyoung Lee, Euna Shin, Yeonsook Hwang"
  },
  {
    id: "c05", type: "conference", year: 2024.9,
    title: "A Study on the Improvement of Public Space Design in General Hospital through WELL Building Standard",
    venue: "KIID Fall Conference 2024", role: "Presentation", material: "", award: "Best Paper Presentation Award",
    summary: "Using the WELL Building Standard to improve the public spaces of general hospitals. — Juyoung Lee, Yeonsook Hwang"
  },
  {
    id: "c06", type: "conference", year: 2026.3,
    title: "Affordance Mechanisms in AIoT Smart Shelters",
    venue: "KISD Spring Conference 2026",
    role: "Presentation",
    award: "",
    summary: "How AIoT smart bus shelters in Seoul prompt, respond to and support user behaviour through affordance mechanisms. — Juyoung Lee, Minkyung Lee, Yeonsook Hwang"
  },
  {
    id: "c07", type: "conference", year: 2024.45,
    title: "A Study on the Analysis of Exhibition Elements in Exhibition Space through the MZ Generation's Response to Instagrammable Exhibition",
    venue: "KIID Spring Conference 2024",
    role: "Presentation",
    award: "",
    summary: "Exhibition elements that draw the MZ generation's responses in Instagrammable exhibitions. — Juyoung Lee, Yeonsook Hwang"
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

