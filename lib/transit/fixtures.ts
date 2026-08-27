export type TransitMode = "bus" | "subway";

export type Stop = {
  id: string;
  name: string;
  mode: TransitMode;
};

const STOPS_BY_PLACE: Record<string, Stop> = {
  판교역: { id: "gyeonggi-pangyo-transfer-center", name: "판교역.버스환승센터", mode: "bus" },
  잠실역: { id: "seoul-jamsil-station", name: "잠실역", mode: "subway" },
  여의도: { id: "seoul-yeouido-station", name: "여의도역", mode: "subway" },
  합정: { id: "seoul-hapjeong-station", name: "합정역", mode: "subway" },
  평촌역: { id: "anyang-pyeongchon-academy-street", name: "평촌역.학원가", mode: "bus" },
  마곡나루역: { id: "seoul-magongnaru-station", name: "마곡나루역", mode: "subway" },
};

export function findNearestStop(placeName: string): Stop | undefined {
  return STOPS_BY_PLACE[placeName];
}

export type Leg = {
  mode: TransitMode;
  line: string;
  from: Stop;
  to: Stop;
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
    },
    transferStop: GANGNAM_SUBWAY,
    nextLeg: {
      mode: "subway",
      line: "2호선",
      from: GANGNAM_SUBWAY,
      to: STOPS_BY_PLACE["잠실역"],
    },
  },
  "seoul-yeouido-station->seoul-hapjeong-station": {
    firstLeg: {
      mode: "bus",
      line: "603",
      from: STOPS_BY_PLACE["여의도"],
      to: HONGDAE_BUS,
    },
    transferStop: HONGDAE_SUBWAY,
    nextLeg: {
      mode: "subway",
      line: "2호선",
      from: HONGDAE_SUBWAY,
      to: STOPS_BY_PLACE["합정"],
    },
  },
  "anyang-pyeongchon-academy-street->seoul-magongnaru-station": {
    firstLeg: {
      mode: "bus",
      line: "5623",
      from: STOPS_BY_PLACE["평촌역"],
      to: STOPS_BY_PLACE["여의도"],
    },
    transferStop: STOPS_BY_PLACE["여의도"],
    nextLeg: {
      mode: "subway",
      line: "9호선",
      from: STOPS_BY_PLACE["여의도"],
      to: STOPS_BY_PLACE["마곡나루역"],
    },
  },
};

export function findRoute(origin: Stop, destination: Stop): RouteExample | undefined {
  return ROUTES[`${origin.id}->${destination.id}`];
}

export type BusArrivalInfo = {
  mode: "bus";
  line: string;
  arrivalSeconds: number;
  stopsRemaining: number;
  vehicleType: "저상버스" | "일반버스";
};

export type SubwayArrivalInfo = {
  mode: "subway";
  line: string;
  arrivalSeconds: number;
  trainType: "일반" | "급행";
  destinationName: string;
};

export type ArrivalInfo = BusArrivalInfo | SubwayArrivalInfo;

function randomInRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

export function getArrivalInfo(leg: Leg): ArrivalInfo {
  if (leg.mode === "bus") {
    return {
      mode: "bus",
      line: leg.line,
      arrivalSeconds: randomInRange(60, 600),
      stopsRemaining: randomInRange(1, 8),
      vehicleType: Math.random() < 0.5 ? "저상버스" : "일반버스",
    };
  }

  return {
    mode: "subway",
    line: leg.line,
    arrivalSeconds: randomInRange(60, 600),
    trainType: Math.random() < 0.2 ? "급행" : "일반",
    destinationName: leg.to.name,
  };
}
