import { describe, expect, test } from "vitest";

import {
  estimateSchedule,
  findNearestStop,
  findRoute,
  needsNoTransfer,
  shiftDepartureTime,
} from "@/lib/transit/fixtures";

describe("findNearestStop", () => {
  test("판교역을 입력하면 판교역.버스환승센터 정류장을 반환한다", () => {
    const stop = findNearestStop("판교역");

    expect(stop?.name).toBe("판교역.버스환승센터");
  });

  test("여의도를 입력하면 여의도역 정류장을 반환한다", () => {
    const stop = findNearestStop("여의도");

    expect(stop?.name).toBe("여의도역");
  });

  test("합정을 입력하면 합정역을 반환한다", () => {
    const stop = findNearestStop("합정");

    expect(stop?.name).toBe("합정역");
  });

  test("역 이름을 그대로 입력하면 그 역 자체를 반환한다 (잠실역, 강남역, 도곡역, 평촌역)", () => {
    expect(findNearestStop("잠실역")?.name).toBe("잠실역");
    expect(findNearestStop("강남역")?.name).toBe("강남역");
    expect(findNearestStop("도곡역")?.name).toBe("도곡역");
    expect(findNearestStop("평촌역")?.name).toBe("평촌역");
  });

  test("예시 데이터에 없는 지명을 입력하면 undefined를 반환한다", () => {
    const stop = findNearestStop("부산역");

    expect(stop).toBeUndefined();
  });
});

describe("needsNoTransfer", () => {
  test("같은 노선(2호선) 안의 두 역은 환승이 필요 없다", () => {
    expect(needsNoTransfer(findNearestStop("사당역")!, findNearestStop("교대역")!)).toBe(true);
  });

  test("같은 노선(4호선) 안의 두 역은 환승이 필요 없다", () => {
    expect(needsNoTransfer(findNearestStop("혜화역")!, findNearestStop("사당역")!)).toBe(true);
  });

  test("서로 다른 노선에만 속한 두 역은 환승이 필요하다", () => {
    expect(needsNoTransfer(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)).toBe(
      false
    );
  });

  test("이 프로젝트가 다루지 않는 지명(판교역 등)끼리는 환승이 필요 없다고 판단하지 않는다", () => {
    expect(needsNoTransfer(findNearestStop("판교역")!, findNearestStop("잠실역")!)).toBe(false);
  });
});

describe("findRoute", () => {
  test("판교역.버스환승센터에서 잠실역까지는 강남역에서 버스로 지하철 2호선으로 환승하는 경로를 반환한다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!);

    expect(route?.legs[0].mode).toBe("bus");
    expect(route?.legs[0].to.name).toBe("강남역");
    expect(route?.transferStops[0].name).toBe("강남역");
    expect(route?.legs[1].mode).toBe("subway");
    expect(route?.legs[1].line).toBe("2호선");
    expect(route?.legs[1].to.name).toBe("잠실역");
  });

  test("여의도역에서 합정역까지는 이제 지하철만으로 이어지는 경로를 찾는다 (5·9호선이 2·6호선과도 연결됨)", () => {
    const route = findRoute(findNearestStop("여의도")!, findNearestStop("합정")!);

    expect(route?.legs[0].mode).toBe("subway");
    expect(route?.legs.at(-1)?.to.name).toBe("합정역");
    // 구간들이 환승역으로 순서대로 이어져야 한다.
    route?.legs.forEach((leg, i) => {
      if (i > 0) expect(leg.from.name).toBe(route.transferStops[i - 1].name);
      if (i < route.legs.length - 1) expect(leg.to.name).toBe(route.transferStops[i].name);
    });
  });

  test("평촌역(4호선)에서 마곡나루역(9호선)까지는 동작역에서 환승하는 경로를 반환한다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!);

    expect(route?.legs[0].line).toBe("4호선");
    expect(route?.transferStops[0].name).toBe("동작역");
    expect(route?.legs[1].line).toBe("9호선");
    expect(route?.legs[1].to.name).toBe("마곡나루역");
  });

  test("반대 방향(9호선 역 → 4호선 역)으로도 환승 경로를 반환한다", () => {
    const route = findRoute(findNearestStop("마곡나루역")!, findNearestStop("평촌역")!);

    expect(route?.legs[0].line).toBe("9호선");
    expect(route?.legs.at(-1)?.line).toBe("4호선");
    expect(route?.legs.at(-1)?.to.name).toBe("평촌역");
  });

  test("같은 노선(4호선)의 두 역을 넣으면 경로 없이 undefined를 반환한다", () => {
    const route = findRoute(findNearestStop("혜화역")!, findNearestStop("사당역")!);

    expect(route).toBeUndefined();
  });

  test("평촌역(4호선)에서 잠실역(2·8호선)까지 환승 1회 경로를 반환한다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("잠실역")!);

    expect(route?.transferStops).toHaveLength(1);
    expect(route?.legs[0].line).toBe("4호선");
    expect(route?.legs[1].line).toBe("2호선");
    expect(route?.legs[1].to.name).toBe("잠실역");
    // 두 구간이 같은 환승역으로 이어져야 한다.
    expect(route?.legs[0].to.name).toBe(route?.transferStops[0].name);
    expect(route?.legs[1].from.name).toBe(route?.transferStops[0].name);
  });

  test("평촌역(4호선)에서 도곡역(3호선)까지 환승 1회 경로를 반환한다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("도곡역")!);

    expect(route?.transferStops).toHaveLength(1);
    expect(route?.legs[0].line).toBe("4호선");
    expect(route?.legs[1].line).toBe("3호선");
    expect(route?.legs[1].to.name).toBe("도곡역");
  });

  test("직접 연결되지 않는 먼 노선끼리는 환승 2회 경로도 찾는다 (모란역→청량리역)", () => {
    const route = findRoute(findNearestStop("모란역")!, findNearestStop("청량리역")!);

    expect(route?.transferStops).toHaveLength(2);
    expect(route?.legs).toHaveLength(3);
    expect(route?.legs[0].line).toBe("8호선");
    expect(route?.legs[2].line).toBe("1호선");
    expect(route?.legs[2].to.name).toBe("청량리역");
    // 구간들이 환승역으로 순서대로 이어져야 한다.
    expect(route?.legs[0].to.name).toBe(route?.transferStops[0].name);
    expect(route?.legs[1].from.name).toBe(route?.transferStops[0].name);
    expect(route?.legs[1].to.name).toBe(route?.transferStops[1].name);
    expect(route?.legs[2].from.name).toBe(route?.transferStops[1].name);
  });

  test("예시 데이터에 없는 조합을 넣으면 undefined를 반환한다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("합정")!);

    expect(route).toBeUndefined();
  });
});

describe("estimateSchedule", () => {
  test("출발역 시각은 넘겨받은 현재 시각 그대로다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    expect(schedule.departureTime).toEqual(now);
  });

  test("환승 1회 경로는 환승역 도착 예정 시각 1개와 출발 예정 시각 5개짜리 목록 1개를 반환한다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    // 4호선 노선 순서상 평촌역과 동작역 사이는 11개 역 차이(22분)이므로 09:00+22분=09:22.
    expect(schedule.transferArrivalTimes).toEqual([new Date(2026, 0, 1, 9, 22, 0)]);
    expect(schedule.upcomingDeparturesByTransfer).toHaveLength(1);
    expect(schedule.upcomingDeparturesByTransfer[0]).toHaveLength(5);
  });

  test("환승 2회 경로는 두 환승역 모두 도착 예정 시각과 출발 예정 시각 3개짜리 목록을 반환한다", () => {
    const route = findRoute(findNearestStop("모란역")!, findNearestStop("청량리역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    expect(schedule.transferArrivalTimes).toHaveLength(2);
    expect(schedule.upcomingDeparturesByTransfer).toHaveLength(2);
    expect(schedule.upcomingDeparturesByTransfer[0]).toHaveLength(3);
    expect(schedule.upcomingDeparturesByTransfer[1]).toHaveLength(3);
    // 두 번째 환승역 도착 예정은 첫 번째 환승역 도착 예정보다 늦어야 한다.
    expect(schedule.transferArrivalTimes[1].getTime()).toBeGreaterThan(
      schedule.transferArrivalTimes[0].getTime()
    );
  });

  test("평시(9호선, 09시)에는 9호선 평시 배차간격(11분) 간격으로 출발 예정 시각이 나온다", () => {
    const route = findRoute(findNearestStop("평촌역")!, findNearestStop("마곡나루역")!)!;
    const now = new Date(2026, 0, 1, 9, 0, 0);

    const schedule = estimateSchedule(route, now);

    expect(schedule.upcomingDeparturesByTransfer[0]).toEqual([
      new Date(2026, 0, 1, 9, 33, 0),
      new Date(2026, 0, 1, 9, 44, 0),
      new Date(2026, 0, 1, 9, 55, 0),
      new Date(2026, 0, 1, 10, 6, 0),
      new Date(2026, 0, 1, 10, 17, 0),
    ]);
  });
});

describe("shiftDepartureTime", () => {
  test("0칸 이동하면 기준 시각 그대로다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;
    const baseTime = new Date(2026, 0, 1, 14, 0, 0);

    expect(shiftDepartureTime(route, baseTime, 0)).toEqual(baseTime);
  });

  test("첫 구간 노선의 배차간격만큼 다음(+1)으로 이동한다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;
    const baseTime = new Date(2026, 0, 1, 14, 0, 0);

    // legs[0]는 버스(근거 없는 기본값), 평시 배차간격은 10분이므로 14:10.
    expect(shiftDepartureTime(route, baseTime, 1)).toEqual(new Date(2026, 0, 1, 14, 10, 0));
  });

  test("이전(-1)으로 이동하면 배차간격만큼 앞선 시각이 된다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;
    const baseTime = new Date(2026, 0, 1, 14, 0, 0);

    expect(shiftDepartureTime(route, baseTime, -1)).toEqual(new Date(2026, 0, 1, 13, 50, 0));
  });
});
