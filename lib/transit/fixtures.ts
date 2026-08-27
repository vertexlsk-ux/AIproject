export type TransitMode = "bus" | "subway";

export type Stop = {
  id: string;
  name: string;
  mode: TransitMode;
};

// 아래 LINE_*_STATION_NAMES는 위키백과 기준 노선 순서다. 서울 도심 위주 핵심 구간을
// 다루며, 수도권 외곽으로 이어지는 지선·직결 구간은 4호선(과천선·안산선·진접선 포함)과
// 9호선을 뺀 나머지 노선에서는 서울교통공사 관할 구간 위주로 간략화했다.

const LINE_1_STATION_NAMES = [
  "구로역", "신도림역", "영등포역", "신길역", "대방역", "노량진역", "용산역", "남영역",
  "서울역", "시청역", "종각역", "종로3가역", "종로5가역", "동대문역", "동묘앞역",
  "신설동역", "제기동역", "청량리역",
] as const;

const LINE_2_STATION_NAMES = [
  "시청역", "을지로입구역", "을지로3가역", "을지로4가역", "동대문역사문화공원역", "신당역",
  "상왕십리역", "왕십리역", "한양대역", "뚝섬역", "성수역", "건대입구역", "구의역", "강변역",
  "잠실나루역", "잠실역", "잠실새내역", "종합운동장역", "삼성역", "선릉역", "역삼역",
  "강남역", "교대역", "서초역", "방배역", "사당역", "낙성대역", "서울대입구역", "봉천역",
  "신림역", "신대방역", "구로디지털단지역", "대림역", "신도림역", "문래역", "영등포구청역",
  "당산역", "합정역", "홍대입구역", "신촌역", "이대역", "아현역", "충정로역",
] as const;

const LINE_3_STATION_NAMES = [
  "구파발역", "연신내역", "불광역", "녹번역", "홍제역", "무악재역", "독립문역", "경복궁역",
  "안국역", "종로3가역", "을지로3가역", "충무로역", "동대입구역", "약수역", "금호역",
  "옥수역", "압구정역", "신사역", "잠원역", "고속터미널역", "교대역", "남부터미널역",
  "양재역", "매봉역", "도곡역", "대치역", "학여울역", "대청역", "일원역", "수서역",
  "가락시장역", "경찰병원역", "오금역",
] as const;

// 수도권 전철 4호선 전체 역 (진접선·서울 지하철 4호선·과천선·안산선), 위키백과 기준 노선 순서.
const LINE_4_STATION_NAMES = [
  "진접역", "오남역", "풍양역", "별내별가람역", "불암산역", "상계역", "노원역", "창동역",
  "쌍문역", "수유역", "미아역", "미아사거리역", "길음역", "성신여대입구역", "한성대입구역",
  "혜화역", "동대문역", "동대문역사문화공원역", "충무로역", "명동역", "회현역", "서울역",
  "숙대입구역", "삼각지역", "신용산역", "이촌역", "동작역", "이수역", "사당역",
  "남태령역", "선바위역", "경마공원역", "대공원역", "과천역", "정부과천청사역",
  "과천정보타운역", "인덕원역", "평촌역", "범계역", "금정역", "산본역", "수리산역",
  "대야미역", "반월역", "상록수역", "한대앞역", "중앙역", "고잔역", "초지역", "안산역",
  "신길온천역", "정왕역", "오이도역",
] as const;

const LINE_5_STATION_NAMES = [
  "방화역", "개화산역", "김포공항역", "송정역", "마곡역", "발산역", "우장산역", "화곡역",
  "까치산역", "신정역", "목동역", "오목교역", "양평역", "영등포구청역", "영등포시장역",
  "신길역", "여의도역", "여의나루역", "마포역", "공덕역", "애오개역", "충정로역", "서대문역",
  "광화문역", "종로3가역", "을지로4가역", "동대문역사문화공원역", "청구역", "신금호역",
  "행당역", "왕십리역", "마장역", "답십리역", "장한평역", "군자역", "아차산역", "광나루역",
  "천호역", "강동역", "둔촌동역", "올림픽공원역", "방이역", "오금역", "개롱역", "거여역",
  "마천역",
] as const;

const LINE_6_STATION_NAMES = [
  "응암역", "역촌역", "불광역", "독바위역", "연신내역", "구산역", "새절역", "증산역",
  "디지털미디어시티역", "월드컵경기장역", "마포구청역", "망원역", "합정역", "상수역",
  "광흥창역", "대흥역", "공덕역", "효창공원앞역", "삼각지역", "녹사평역", "이태원역",
  "한강진역", "버티고개역", "약수역", "청구역", "신당역", "동묘앞역", "창신역", "보문역",
  "안암역", "고려대역", "월곡역", "상월곡역", "돌곶이역", "석계역", "태릉입구역", "화랑대역",
  "봉화산역", "신내역",
] as const;

const LINE_7_STATION_NAMES = [
  "도봉산역", "수락산역", "마들역", "노원역", "중계역", "하계역", "공릉역", "태릉입구역",
  "먹골역", "중화역", "상봉역", "면목역", "사가정역", "용마산역", "중곡역", "군자역",
  "어린이대공원역", "건대입구역", "자양역", "청담역", "강남구청역", "학동역", "논현역",
  "반포역", "고속터미널역", "내방역", "이수역", "남성역", "숭실대입구역", "상도역",
  "장승배기역", "신대방삼거리역", "보라매역", "신풍역", "대림역", "남구로역",
  "가산디지털단지역", "철산역", "광명사거리역", "천왕역", "온수역",
] as const;

const LINE_8_STATION_NAMES = [
  "암사역", "천호역", "강동구청역", "몽촌토성역", "잠실역", "석촌역", "송파역", "가락시장역",
  "문정역", "장지역", "복정역", "남위례역", "산성역", "남한산성입구역", "단대오거리역",
  "신흥역", "수진역", "모란역",
] as const;

// 서울 지하철 9호선 전체 역, 위키백과 기준 노선 순서 (역명 부기는 생략).
const LINE_9_STATION_NAMES = [
  "개화역", "김포공항역", "공항시장역", "신방화역", "마곡나루역", "양천향교역", "가양역",
  "증미역", "등촌역", "염창역", "신목동역", "선유도역", "당산역", "국회의사당역",
  "여의도역", "샛강역", "노량진역", "노들역", "흑석역", "동작역", "구반포역", "신반포역",
  "고속터미널역", "사평역", "신논현역", "언주역", "선정릉역", "삼성중앙역", "봉은사역",
  "종합운동장역", "삼전역", "석촌고분역", "석촌역", "송파나루역", "한성백제역",
  "올림픽공원역", "둔촌오륜역", "중앙보훈병원역",
] as const;

type LineDef = { name: string; stations: readonly string[] };

const LINE_DEFS: LineDef[] = [
  { name: "1호선", stations: LINE_1_STATION_NAMES },
  { name: "2호선", stations: LINE_2_STATION_NAMES },
  { name: "3호선", stations: LINE_3_STATION_NAMES },
  { name: "4호선", stations: LINE_4_STATION_NAMES },
  { name: "5호선", stations: LINE_5_STATION_NAMES },
  { name: "6호선", stations: LINE_6_STATION_NAMES },
  { name: "7호선", stations: LINE_7_STATION_NAMES },
  { name: "8호선", stations: LINE_8_STATION_NAMES },
  { name: "9호선", stations: LINE_9_STATION_NAMES },
];

function buildLineStops(names: readonly string[], idPrefix: string): Record<string, Stop> {
  return Object.fromEntries(
    names.map((name, index) => [name, { id: `${idPrefix}-${index}`, name, mode: "subway" as const }])
  );
}

const STOPS_BY_PLACE: Record<string, Stop> = {
  판교역: { id: "gyeonggi-pangyo-transfer-center", name: "판교역.버스환승센터", mode: "bus" },
  여의도: { id: "seoul-yeouido-station", name: "여의도역", mode: "subway" },
  합정: { id: "seoul-hapjeong-station", name: "합정역", mode: "subway" },
  ...LINE_DEFS.reduce<Record<string, Stop>>(
    (stops, line, index) => ({ ...stops, ...buildLineStops(line.stations, `line${index + 1}`) }),
    {}
  ),
};

export function findNearestStop(placeName: string): Stop | undefined {
  return STOPS_BY_PLACE[placeName];
}

function linesContaining(stationName: string): LineDef[] {
  return LINE_DEFS.filter((line) => line.stations.includes(stationName));
}

/**
 * 두 역이 같은 노선을 공유해(또는 같은 역이라) 환승이 필요 없는지 여부.
 * 두 역 모두 이 프로젝트가 다루는 노선(1~9호선) 소속일 때만 판단하며,
 * 손으로 정한 예시 지명(판교역 등)에는 적용하지 않는다.
 */
export function needsNoTransfer(origin: Stop, destination: Stop): boolean {
  const originLines = linesContaining(origin.name);
  const destinationLines = linesContaining(destination.name);
  if (originLines.length === 0 || destinationLines.length === 0) return false;
  return originLines.some((line) => destinationLines.includes(line));
}

// 노선 순서를 아는 구간에서, 역 1개를 지날 때마다 걸린다고 가정하는 시간.
const MINUTES_PER_STATION = 2;

function stationDistance(lineNames: readonly string[], fromName: string, toName: string): number {
  return Math.abs(lineNames.indexOf(fromName) - lineNames.indexOf(toName));
}

function sharedStations(a: LineDef, b: LineDef): string[] {
  return a.stations.filter((name) => b.stations.includes(name));
}

// 환승을 몇 번까지 허용해 경로를 찾을지 (환승 횟수 = 거치는 노선 수 - 1).
const MAX_TRANSFERS = 2;

type RouteCandidate = { linePath: LineDef[]; transferNames: string[]; totalStationDistance: number };

/**
 * 출발역에서 도착역까지, 환승 최대 2회 안에서 실제로 존재하는 모든 노선 경로를
 * 탐색해 총 이동 역 수가 가장 적은(= 가장 빠른) 조합을 고른다. 두 노선이 역을
 * 여러 개 공유하면(예: 4호선·2호선은 동대문역사문화공원역과 사당역 둘 다 공유)
 * 그중 총 거리가 가장 짧아지는 역을 환승역으로 고른다.
 */
function findBestRoute(origin: Stop, destination: Stop): RouteCandidate | undefined {
  const originLines = linesContaining(origin.name);
  const destinationLines = linesContaining(destination.name);
  if (originLines.length === 0 || destinationLines.length === 0) return undefined;

  const destinationSet = new Set(destinationLines);
  let best: RouteCandidate | undefined;

  function evaluatePath(linePath: LineDef[]) {
    const candidateListsPerJunction = linePath
      .slice(0, -1)
      .map((line, i) => sharedStations(line, linePath[i + 1]));

    function search(junctionIndex: number, transferNames: string[]) {
      if (junctionIndex === candidateListsPerJunction.length) {
        const stopNames = [origin.name, ...transferNames, destination.name];
        let totalStationDistance = 0;
        for (let i = 0; i < linePath.length; i++) {
          totalStationDistance += stationDistance(linePath[i].stations, stopNames[i], stopNames[i + 1]);
        }
        if (!best || totalStationDistance < best.totalStationDistance) {
          best = { linePath, transferNames: [...transferNames], totalStationDistance };
        }
        return;
      }
      for (const candidate of candidateListsPerJunction[junctionIndex]) {
        search(junctionIndex + 1, [...transferNames, candidate]);
      }
    }

    search(0, []);
  }

  function dfs(path: LineDef[]) {
    const last = path[path.length - 1];
    if (destinationSet.has(last)) {
      evaluatePath(path);
      return;
    }
    if (path.length > MAX_TRANSFERS) return;

    for (const next of LINE_DEFS) {
      if (path.includes(next)) continue;
      if (sharedStations(last, next).length > 0) {
        dfs([...path, next]);
      }
    }
  }

  for (const line of originLines) {
    dfs([line]);
  }

  return best;
}

export type Leg = {
  mode: TransitMode;
  line: string;
  from: Stop;
  to: Stop;
  /** 이 구간에 걸리는 대략적인 시간(분). 실제 배차·소요시간을 측정한 값이 아니라 예시 추정치다. */
  durationMinutes: number;
};

export type RouteExample = {
  /** 이동 구간들. legs.length === transferStops.length + 1. */
  legs: Leg[];
  /** 환승 지점들. 순서대로 legs[i]와 legs[i+1] 사이의 환승역이다. */
  transferStops: Stop[];
};

function buildRoute(
  origin: Stop,
  destination: Stop,
  linePath: LineDef[],
  transferNames: string[]
): RouteExample {
  const stopNames = [origin.name, ...transferNames, destination.name];
  const legs: Leg[] = linePath.map((line, i) => {
    const fromName = stopNames[i];
    const toName = stopNames[i + 1];
    return {
      mode: "subway",
      line: line.name,
      from: i === 0 ? origin : STOPS_BY_PLACE[fromName],
      to: i === linePath.length - 1 ? destination : STOPS_BY_PLACE[toName],
      durationMinutes: stationDistance(line.stations, fromName, toName) * MINUTES_PER_STATION,
    };
  });

  return { legs, transferStops: transferNames.map((name) => STOPS_BY_PLACE[name]) };
}

/**
 * 1~9호선 노선 목록을 기반으로, 두 역 사이에서 총 이동 역 수가 가장 적은(=
 * 가장 빠른) 경로를 생성한다(환승 최대 2회). 두 역이 같은 노선을 이미
 * 공유한다면(환승이 필요 없다면) undefined를 반환한다.
 */
function generateLineGraphRoute(origin: Stop, destination: Stop): RouteExample | undefined {
  if (needsNoTransfer(origin, destination)) return undefined;
  const best = findBestRoute(origin, destination);
  if (!best) return undefined;
  return buildRoute(origin, destination, best.linePath, best.transferNames);
}

const GANGNAM_BUS: Stop = { id: "seoul-gangnam-bus-stop", name: "강남역", mode: "bus" };

const HAND_AUTHORED_ROUTE_DEFS: Array<{ origin: Stop; destination: Stop; route: RouteExample }> = [
  {
    origin: STOPS_BY_PLACE["판교역"],
    destination: STOPS_BY_PLACE["잠실역"],
    route: {
      legs: [
        {
          mode: "bus",
          line: "9407",
          from: STOPS_BY_PLACE["판교역"],
          to: GANGNAM_BUS,
          durationMinutes: 35,
        },
        {
          mode: "subway",
          line: "2호선",
          from: STOPS_BY_PLACE["강남역"],
          to: STOPS_BY_PLACE["잠실역"],
          durationMinutes: 10,
        },
      ],
      transferStops: [STOPS_BY_PLACE["강남역"]],
    },
  },
];

const HAND_AUTHORED_ROUTES: Record<string, RouteExample> = Object.fromEntries(
  HAND_AUTHORED_ROUTE_DEFS.map(({ origin, destination, route }) => [
    `${origin.id}->${destination.id}`,
    route,
  ])
);

export function findRoute(origin: Stop, destination: Stop): RouteExample | undefined {
  return (
    generateLineGraphRoute(origin, destination) ??
    HAND_AUTHORED_ROUTES[`${origin.id}->${destination.id}`]
  );
}

export type Schedule = {
  departureTime: Date;
  /** 환승 지점별 도착 예정 시각. transferArrivalTimes.length === route.transferStops.length. */
  transferArrivalTimes: Date[];
  /** 환승 지점별로, 그 다음 구간의 출발 예정 시각 목록. */
  upcomingDeparturesByTransfer: Date[][];
};

// 환승 지점마다 보여줄 출발 예정 시각 개수.
const UPCOMING_DEPARTURE_COUNT = 3;

// 출퇴근 시간대(07~09시, 18~20시)인지 여부. 노선별 배차간격 추정에 사용한다.
function isRushHour(now: Date): boolean {
  const hour = now.getHours();
  return (hour >= 7 && hour < 9) || (hour >= 18 && hour < 20);
}

// 노선별로 검색해 확인한 대략적인 실제 배차간격(분). [출퇴근, 평시] 순서다.
// 4호선은 사당 이북(밀도 높은 구간) 기준, 9호선은 일반 열차 기준.
const LINE_HEADWAY_MINUTES: Record<string, [number, number]> = {
  "2호선": [2, 6],
  "4호선": [3, 5],
  "9호선": [7, 11],
};

// 배차간격 근거를 찾지 못한 노선·버스에 쓰는 대략적인 기본값.
const DEFAULT_HEADWAY_MINUTES: [number, number] = [6, 10];

function estimateWaitMinutes(leg: Leg, now: Date): number {
  const [rushMinutes, offPeakMinutes] =
    LINE_HEADWAY_MINUTES[leg.line] ?? DEFAULT_HEADWAY_MINUTES;
  return isRushHour(now) ? rushMinutes : offPeakMinutes;
}

/**
 * 출발역에서 탈 열차를 기준 시각에서 몇 칸(steps) 옮긴 출발 시각을 계산한다.
 * 한 칸은 첫 구간 노선의 배차간격(기준 시각 기준)만큼이며, 음수는 이전 열차,
 * 양수는 다음 열차를 뜻한다.
 */
export function shiftDepartureTime(route: RouteExample, baseTime: Date, steps: number): Date {
  const headwayMinutes = estimateWaitMinutes(route.legs[0], baseTime);
  return new Date(baseTime.getTime() + steps * headwayMinutes * 60_000);
}

/**
 * 경로찾기를 누른 시각을 출발역 시각으로 삼아, 각 환승 지점의 도착 예정 시각과
 * 그 지점에서 탈 다음 구간의 출발 예정 시각 목록을 계산한다. 환승 지점에 실제
 * 도착한 뒤 목록의 첫 출발 예정 시각에 탄다고 가정하고 다음 구간을 이어 계산한다.
 * 실제 열차 시각표를 조회하지 않는 추정치다.
 */
export function estimateSchedule(route: RouteExample, now: Date): Schedule {
  const transferCount = route.transferStops.length;

  const transferArrivalTimes: Date[] = [];
  const upcomingDeparturesByTransfer: Date[][] = [];
  let current = now;

  for (let i = 0; i < transferCount; i++) {
    const arrival = new Date(current.getTime() + route.legs[i].durationMinutes * 60_000);
    transferArrivalTimes.push(arrival);

    const waitMinutes = estimateWaitMinutes(route.legs[i + 1], arrival);
    const upcoming = Array.from(
      { length: UPCOMING_DEPARTURE_COUNT },
      (_, index) => new Date(arrival.getTime() + waitMinutes * (index + 1) * 60_000)
    );
    upcomingDeparturesByTransfer.push(upcoming);

    current = upcoming[0];
  }

  return { departureTime: now, transferArrivalTimes, upcomingDeparturesByTransfer };
}
