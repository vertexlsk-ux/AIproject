# transfer-arrival-preview 코드 리뷰 메모

AGENTS.md 검증·리뷰 예산에 따라, 스펙 수용 기준을 깨지 않는 지적은 고치지 않고 아래에 한 줄로만 남긴다.

- `lib/transit/fixtures.ts`의 `findRoute`는 방향성만 지원한다 (예: 잠실역→판교역처럼 역방향으로 조회하면 정방향 경로가 있어도 `undefined`를 반환한다).
- `lib/transit/fixtures.ts`의 `randomInRange(1, 8)`은 상한이 배타적이라 `stopsRemaining`이 8을 반환하지 않는다 (실질 범위는 1~7).
- `lib/transit/fixtures.ts`의 정류장/경로 데이터가 지명별 하드코딩 테이블이라, 예시가 늘어날수록(강남역/홍대입구역처럼 버스·지하철 모드별로 같은 장소가 별도 객체로 중복되는 등) 확장성이 떨어진다.
- `app/page.tsx`의 `arrival` 상태가 `result` discriminated union 밖에 별도 `useState`로 있어, 상태가 늘어나면 `result`와 어긋난 채로 남을 수 있다.
