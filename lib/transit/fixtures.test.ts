import { describe, expect, test } from "vitest";

import {
  estimateSchedule,
  findNearestStop,
  findRoute,
  needsNoTransfer,
} from "@/lib/transit/fixtures";

describe("findNearestStop", () => {
  test("판교역을 입력하면 판교역.버스환승센터 정류장을 반환한다", () => {
    const stop = findNearestStop("판교역");

    expect(stop?.name).toBe("판교역.버스환승센터");
  });

  test("잠실역을 입력하면 잠실역을 반환한다", () => {
    const stop = findNearestStop("잠실역");

    expect(stop?.name).toBe("잠실역");
  });

  test("여의도를 입력하면 여의도역 정류장을 반환한다", () => {
    const stop = findNearestStop("여의도");

    expect(stop?.name).toBe("여의도역");
  });

  test("합정을 입력하면 합정역을 반환한다", () => {
    const stop = findNearestStop("합정");

    expect(stop?.name).toBe("합정역");
  });

  test("평촌역을 입력하면 평촌역(4호선)을 반환한다", () => {
    const stop = findNearestStop("평촌역");

    expect(stop?.name).toBe("평촌역");
    expect(stop?.mode).toBe("subway");
  });

  test("마곡나루역을 입력하면 마곡나루역을 반환한다", () => {
    const stop = findNearestStop("마곡나루역");

    expect(stop?.name).toBe("마곡나루역");
  });

  test("4호선의 다른 역(혜화역)도 그 역 자체를 반환한다", () => {
    const stop = findNearestStop("혜화역");

    expect(stop?.name).toBe("혜화역");
    expect(stop?.mode).toBe("subway");
  });

  test("9호선의 다른 역(당산역)도 그 역 자체를 반환한다", () => {
    const stop = findNearestStop("당산역");

    expect(stop?.name).toBe("당산역");
    expect(stop?.mode).toBe("subway");
  });

  test("예시 데이터에 없는 지명을 입력하면 undefined를 반환한다", () => {
    const stop = findNearestStop("부산역");

    expect(stop).toBeUndefined();
  });
});

describe("findRoute", () => {
  test("판교역.버스환승센터에서 잠실역까지는 강남역에서 버스로 지하철 2호선으로 환승하는 경로를 반환한다", () => {
    const origin = findNearestStop("판교역")!;
    const destination = findNearestStop("잠실역")!;

    const route = findRoute(origin, destination);

    expect(route?.firstLeg.mode).toBe("bus");
    expect(route?.firstLeg.to.name).toBe("강남역");
    expect(route?.transferStop.name).toBe("강남역");
    expect(route?.nextLeg.mode).toBe("subway");
    expect(route?.nextLeg.line).toBe("2호선");
    expect(route?.nextLeg.to.name).toBe("잠실역");
  });

  test("여의도역에서 합정역까지는 홍대입구역에서 버스로 지하철 2호선으로 환승하는 경로를 반환한다", () => {
    const origin = findNearestStop("여의도")!;
    const destination = findNearestStop("합정")!;

    const route = findRoute(origin, destination);

    expect(route?.firstLeg.mode).toBe("bus");
    expect(route?.firstLeg.to.name).toBe("홍대입구역");
    expect(route?.transferStop.name).toBe("홍대입구역");
    expect(route?.nextLeg.mode).toBe("subway");
    expect(route?.nextLeg.line).toBe("2호선");
    expect(route?.nextLeg.to.name).toBe("합정역");
  });

  test("평촌역(4호선)에서 마곡나루역(9호선)까지는 동작역에서 환승하는 경로를 반환한다", () => {
    const origin = findNearestStop("평촌역")!;
    const destination = findNearestStop("마곡나루역")!;

    const route = findRoute(origin, destination);

    expect(route?.firstLeg.mode).toBe("subway");
    expect(route?.firstLeg.line).toBe("4호선");
    expect(route?.firstLeg.to.name).toBe("동작역");
    expect(route?.transferStop.name).toBe("동작역");
    expect(route?.nextLeg.mode).toBe("subway");
    expect(route?.nextLeg.line).toBe("9호선");
    expect(route?.nextLeg.to.name).toBe("마곡나루역");
  });

  test("생성된 4호선 구간의 소요 시간은 동작역까지의 역 개수(11개) × 2분으로 계산된다", () => {
    const origin = findNearestStop("평촌역")!;
    const destination = findNearestStop("마곡나루역")!;

    const route = findRoute(origin, destination);

    // 4호선 노선 순서상 평촌역(37번째)과 동작역(27번째) 사이는 11개 역 차이.
    expect(route?.firstLeg.durationMinutes).toBe(22);
    // 9호선 노선 순서상 동작역(20번째)과 마곡나루역(5번째) 사이는 15개 역 차이.
    expect(route?.nextLeg.durationMinutes).toBe(30);
  });

  test("9호선에서 4호선으로 가는 반대 방향도 동작역 환승 경로를 반환한다", () => {
    const origin = findNearestStop("당산역")!;
    const destination = findNearestStop("혜화역")!;

    const route = findRoute(origin, destination);

    expect(route?.firstLeg.line).toBe("9호선");
    expect(route?.transferStop.name).toBe("동작역");
    expect(route?.nextLeg.line).toBe("4호선");
    expect(route?.nextLeg.to.name).toBe("혜화역");
  });

  test("같은 노선(4호선)의 두 역을 넣으면 경로 없이 undefined를 반환한다", () => {
    const origin = findNearestStop("혜화역")!;
    const destination = findNearestStop("사당역")!;

    const route = findRoute(origin, destination);

    expect(route).toBeUndefined();
  });

  test("예시 데이터에 없는 조합을 넣으면 undefined를 반환한다", () => {
    const origin = findNearestStop("판교역")!;
    const destination = findNearestStop("합정")!;

    const route = findRoute(origin, destination);

    expect(route).toBeUndefined();
  });
});

describe("needsNoTransfer", () => {
  test("같은 노선(4호선) 안의 두 역은 환승이 필요 없다", () => {
    expect(needsNoTransfer(findNearestStop("혜화역")!, findNearestStop("사당역")!)).toBe(true);
  });

  test("같은 노선(9호선) 안의 두 역은 환승이 필요 없다", () => {
    expect(needsNoTransfer(findNearestStop("당산역")!, findNearestStop("여의도역")!)).toBe(true);
  });

  test("동작역이 출발지나 목적지면 이미 환승 지점이라 환승이 필요 없다", () => {
    expect(needsNoTransfer(findNearestStop("동작역")!, findNearestStop("마곡나루역")!)).toBe(true);
  });

  test("4호선 역과 9호선 역의 조합은 환승이 필요하다", () => {
    expect(needsNoTransfer(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)).toBe(
      false
    );
  });

  test("4호선·9호선에 속하지 않는 기존 예시 지명끼리는 환승이 필요 없다고 판단하지 않는다", () => {
    expect(needsNoTransfer(findNearestStop("판교역")!, findNearestStop("잠실역")!)).toBe(false);
  });
});

describe("estimateSchedule", () => {
  test("출발역 시각은 넘겨받은 현재 시각 그대로다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    expect(schedule.departureTime).toEqual(now);
  });

  test("환승역 도착 예정 시각은 현재 시각 + 첫 구간 소요 시간이다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    // firstLeg.durationMinutes는 22분이므로 09:00 + 22분 = 09:22.
    expect(schedule.transferArrivalTime).toEqual(new Date(2026, 0, 1, 9, 22, 0));
  });

  test("평시(9호선, 09시)에는 9호선 평시 배차간격(11분) 간격으로 5개의 출발 예정 시각이 나온다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    // 도착 예정 09:22에 9호선 평시 배차간격(11분)을 1~5번 더한 09:33, 09:44, 09:55, 10:06, 10:17.
    expect(schedule.upcomingDepartures).toEqual([
      new Date(2026, 0, 1, 9, 33, 0),
      new Date(2026, 0, 1, 9, 44, 0),
      new Date(2026, 0, 1, 9, 55, 0),
      new Date(2026, 0, 1, 10, 6, 0),
      new Date(2026, 0, 1, 10, 17, 0),
    ]);
  });

  test("출퇴근 시간대(9호선, 08시)에는 9호선 출퇴근 배차간격(7분) 간격으로 출발 예정 시각이 나온다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 8, 0, 0);

    const schedule = estimateSchedule(route, now);

    // 도착 예정 08:22에 9호선 출퇴근 배차간격(7분)을 더한 08:29.
    expect(schedule.upcomingDepartures[0]).toEqual(new Date(2026, 0, 1, 8, 29, 0));
  });

  test("4호선 구간은 9호선과 다른 배차간격(출퇴근 3분)이 적용된다", () => {
    const route = findRoute(findNearestStop("당산역")!, findNearestStop("혜화역")!)!;
    const now = new Date(2026, 0, 1, 8, 0, 0);

    const schedule = estimateSchedule(route, now);

    // 당산역(9호선)→동작역 14분이므로 도착 예정 08:14, 4호선 출퇴근 배차간격(3분)을 더한 08:17.
    expect(schedule.transferArrivalTime).toEqual(new Date(2026, 0, 1, 8, 14, 0));
    expect(schedule.upcomingDepartures[0]).toEqual(new Date(2026, 0, 1, 8, 17, 0));
  });

  test("첫 출발 예정 시각은 도착 예정 시각보다 늦다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    expect(schedule.upcomingDepartures[0].getTime()).toBeGreaterThan(
      schedule.transferArrivalTime.getTime()
    );
  });
});
