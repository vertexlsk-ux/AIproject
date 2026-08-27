export type TransitMode = "bus" | "subway";

export type Stop = {
  id: string;
  name: string;
  mode: TransitMode;
};

// 수도권 전철 4호선 전체 역 (진접선·서울 지하철 4호선·과천선·안산선), 위키백과 기준 노선 순서.
const LINE_4_STATION_NAMES = [
  "진접역", "오남역", "풍양역", "별내별가람역", "불암산역", "상계역", "노원역", "창동역",
  "쌍문역", "수유역", "미아역", "미아사거리역", "길음역", "성신여대입구역", "한성대입구역",
  "혜화역", "동대문역", "동대문역사문화공원역", "충무로역", "명동역", "회현역", "서울역",
  "숙대입구역", "삼각지역", "신용산역", "이촌역", "동작역", "총신대입구역", "사당역",
  "남태령역", "선바위역", "경마공원역", "대공원역", "과천역", "정부과천청사역",
  "과천정보타운역", "인덕원역", "평촌역", "범계역", "금정역", "산본역", "수리산역",
  "대야미역", "반월역", "상록수역", "한대앞역", "중앙역", "고잔역", "초지역", "안산역",
  "신길온천역", "정왕역", "오이도역",
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

const DONGJAK: Stop = { id: "seoul-dongjak-station", name: "동작역", mode: "subway" };

function buildLineStops(names: readonly string[], idPrefix: string): Record<string, Stop> {
  return Object.fromEntries(
    names
      .filter((name) => name !== "동작역")
      .map((name, index) => [name, { id: `${idPrefix}-${index}`, name, mode: "subway" as const }])
  );
}

const STOPS_BY_PLACE: Record<string, Stop> = {
  판교역: { id: "gyeonggi-pangyo-transfer-center", name: "판교역.버스환승센터", mode: "bus" },
  잠실역: { id: "seoul-jamsil-station", name: "잠실역", mode: "subway" },
  여의도: { id: "seoul-yeouido-station", name: "여의도역", mode: "subway" },
  합정: { id: "seoul-hapjeong-station", name: "합정역", mode: "subway" },
  ...buildLineStops(LINE_4_STATION_NAMES, "line4"),
  ...buildLineStops(LINE_9_STATION_NAMES, "line9"),
  동작역: DONGJAK,
};

export function findNearestStop(placeName: string): Stop | undefined {
  return STOPS_BY_PLACE[placeName];
}

function linesOf(stopName: string): Set<"4호선" | "9호선"> {
  const lines = new Set<"4호선" | "9호선">();
  if ((LINE_4_STATION_NAMES as readonly string[]).includes(stopName)) lines.add("4호선");
  if ((LINE_9_STATION_NAMES as readonly string[]).includes(stopName)) lines.add("9호선");
  return lines;
}

/**
 * 4호선·9호선 역끼리 이미 같은 노선을 공유해(또는 동작역 자체라) 환승이 필요 없는지 여부.
 * 두 역 모두 4호선/9호선 소속일 때만 판단하며, 그 외 지명에는 적용하지 않는다.
 */
export function needsNoTransfer(origin: Stop, destination: Stop): boolean {
  const originLines = linesOf(origin.name);
  const destinationLines = linesOf(destination.name);
  if (originLines.size === 0 || destinationLines.size === 0) return false;
  return [...originLines].some((line) => destinationLines.has(line));
}

// 노선 순서를 아는 구간(4호선·9호선)에서, 역 1개를 지날 때마다 걸린다고 가정하는 시간.
const MINUTES_PER_STATION = 2;

function stationDistance(lineNames: readonly string[], fromName: string, toName: string): number {
  return Math.abs(lineNames.indexOf(fromName) - lineNames.indexOf(toName));
}

function generateCrossLineRoute(origin: Stop, destination: Stop): RouteExample | undefined {
  const originLines = linesOf(origin.name);
  const destinationLines = linesOf(destination.name);
  if (originLines.size === 0 || destinationLines.size === 0) return undefined;
  if (needsNoTransfer(origin, destination)) return undefined;

  const [originLine] = originLines;
  const [destinationLine] = destinationLines;
  const originLineNames = originLine === "4호선" ? LINE_4_STATION_NAMES : LINE_9_STATION_NAMES;
  const destinationLineNames =
    destinationLine === "4호선" ? LINE_4_STATION_NAMES : LINE_9_STATION_NAMES;

  return {
    firstLeg: {
      mode: "subway",
      line: originLine,
      from: origin,
      to: DONGJAK,
      durationMinutes: stationDistance(originLineNames, origin.name, "동작역") * MINUTES_PER_STATION,
    },
    transferStop: DONGJAK,
    nextLeg: {
      mode: "subway",
      line: destinationLine,
      from: DONGJAK,
      to: destination,
      durationMinutes:
        stationDistance(destinationLineNames, "동작역", destination.name) * MINUTES_PER_STATION,
    },
  };
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
  firstLeg: Leg;
  transferStop: Stop;
  nextLeg: Leg;
};

const GANGNAM_BUS: Stop = { id: "seoul-gangnam-bus-stop", name: "강남역", mode: "bus" };
const GANGNAM_SUBWAY: Stop = { id: "seoul-gangnam-station", name: "강남역", mode: "subway" };
const HONGDAE_BUS: Stop = { id: "seoul-hongdae-bus-stop", name: "홍대입구역", mode: "bus" };
const HONGDAE_SUBWAY: Stop = { id: "seoul-hongdae-station", name: "홍대입구역", mode: "subway" };

const ROUTES: Record<string, RouteExample> = {
  "gyeonggi-pangyo-transfer-center->seoul-jamsil-station": {
    firstLeg: {
      mode: "bus",
      line: "9407",
      from: STOPS_BY_PLACE["판교역"],
      to: GANGNAM_BUS,
      durationMinutes: 35,
    },
    transferStop: GANGNAM_SUBWAY,
    nextLeg: {
      mode: "subway",
      line: "2호선",
      from: GANGNAM_SUBWAY,
      to: STOPS_BY_PLACE["잠실역"],
      durationMinutes: 10,
    },
  },
  "seoul-yeouido-station->seoul-hapjeong-station": {
    firstLeg: {
      mode: "bus",
      line: "603",
      from: STOPS_BY_PLACE["여의도"],
      to: HONGDAE_BUS,
      durationMinutes: 15,
    },
    transferStop: HONGDAE_SUBWAY,
    nextLeg: {
      mode: "subway",
      line: "2호선",
      from: HONGDAE_SUBWAY,
      to: STOPS_BY_PLACE["합정"],
      durationMinutes: 5,
    },
  },
};

export function findRoute(origin: Stop, destination: Stop): RouteExample | undefined {
  return generateCrossLineRoute(origin, destination) ?? ROUTES[`${origin.id}->${destination.id}`];
}

export type Schedule = {
  departureTime: Date;
  transferArrivalTime: Date;
  upcomingDepartures: Date[];
};

// 환승 지점에서 탈 다음 교통편의 출발 예정 시각을 몇 개까지 보여줄지.
const UPCOMING_DEPARTURE_COUNT = 5;

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
 * 경로찾기를 누른 시각을 출발역 시각으로 삼아, 첫 구간의 예상 소요 시간만큼 더한
 * 환승역 도착 예정 시각과, 환승 지점에서 탈 다음 교통편의 출발 예정 시각 목록을
 * 계산한다. 출발 예정 시각은 다음 구간 노선의 실제 배차간격을 참고한 추정치를
 * 등간격으로 반복해 만든다. 실제 열차 시각표를 조회하지 않는 추정치다.
 */
export function estimateSchedule(route: RouteExample, now: Date): Schedule {
  const transferArrivalTime = new Date(now.getTime() + route.firstLeg.durationMinutes * 60_000);
  const waitMinutes = estimateWaitMinutes(route.nextLeg, now);
  const upcomingDepartures = Array.from(
    { length: UPCOMING_DEPARTURE_COUNT },
    (_, index) => new Date(transferArrivalTime.getTime() + waitMinutes * (index + 1) * 60_000)
  );

  return {
    departureTime: now,
    transferArrivalTime,
    upcomingDepartures,
  };
}
