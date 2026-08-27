import { describe, expect, test } from "vitest";

import { findNearestStop, findRoute, getArrivalInfo } from "@/lib/transit/fixtures";

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

  test("예시 데이터에 없는 조합을 넣으면 undefined를 반환한다", () => {
    const origin = findNearestStop("판교역")!;
    const destination = findNearestStop("합정")!;

    const route = findRoute(origin, destination);

    expect(route).toBeUndefined();
  });
});

describe("getArrivalInfo", () => {
  test("지하철 구간의 도착 정보는 mode가 subway이고 line이 구간의 노선과 같다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;

    const info = getArrivalInfo(route.nextLeg);

    expect(info.mode).toBe("subway");
    expect(info.line).toBe("2호선");
  });

  test("여러 번 호출하면 도착예상시간 값이 달라질 수 있다", () => {
    const route = findRoute(findNearestStop("판교역")!, findNearestStop("잠실역")!)!;

    const observed = new Set(
      Array.from({ length: 20 }, () => getArrivalInfo(route.nextLeg).arrivalSeconds)
    );

    expect(observed.size).toBeGreaterThan(1);
  });
});
