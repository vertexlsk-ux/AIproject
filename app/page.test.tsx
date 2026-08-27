import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import Home from "@/app/page";

function search(origin: string, destination: string) {
  fireEvent.change(screen.getByLabelText("출발지"), {
    target: { value: origin },
  });
  fireEvent.change(screen.getByLabelText("목적지"), {
    target: { value: destination },
  });
  fireEvent.click(screen.getByRole("button", { name: "경로 찾기" }));
}

test("경로를 찾으면 출발역 아래에 출발 시각, 환승역 아래에 도착·환승 열차 출발 시각이 구분되어 표시된다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");

    // firstLeg.durationMinutes(35분)만큼 09:00에 더한 09:35, 거기에 2호선 평시 배차간격(6분)을 더한 09:41.
    expect(screen.getByText(/출발 시각 09:00/)).toBeInTheDocument();
    expect(screen.getByText(/도착 예정 09:35/)).toBeInTheDocument();
    expect(screen.getByText(/환승 열차\s*출발 예정 09:41/)).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

test("예시 지명으로 경로를 찾으면 환승 지점을 포함한 경로가 표시된다", () => {
  render(<Home />);

  search("판교역", "잠실역");

  expect(screen.getAllByText(/강남역/).length).toBeGreaterThan(0);
  expect(screen.getByText(/버스 9407/)).toBeInTheDocument();
  expect(screen.getAllByText(/지하철 2호선/).length).toBeGreaterThan(0);
});

test("환승 지점에서 도착 정보 확인을 누르면 도착 예정 시간이 표시된다", () => {
  render(<Home />);

  search("판교역", "잠실역");
  fireEvent.click(screen.getByRole("button", { name: "도착 정보 확인" }));

  expect(screen.getByText(/도착까지/)).toBeInTheDocument();
});

test("평촌역(4호선)에서 마곡나루역(9호선)까지 경로를 찾으면 동작역 환승과 9호선이 표시된다", () => {
  render(<Home />);

  search("평촌역", "마곡나루역");

  expect(screen.getAllByText(/동작역/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/지하철 9호선/).length).toBeGreaterThan(0);
});

test("같은 노선(4호선)의 두 역을 입력하면 환승이 필요 없다는 안내가 표시된다", () => {
  render(<Home />);

  search("혜화역", "사당역");

  expect(screen.getByText(/같은 노선이라 환승이/)).toBeInTheDocument();
});

test("평촌역→마곡나루역 경로에서도 도착 정보 확인을 누르면 도착 예정 시간이 표시된다", () => {
  render(<Home />);

  search("평촌역", "마곡나루역");
  fireEvent.click(screen.getByRole("button", { name: "도착 정보 확인" }));

  expect(screen.getByText(/도착까지/)).toBeInTheDocument();
});

test("예시 데이터에 없는 지명을 입력하면 안내 메시지가 표시된다", () => {
  render(<Home />);

  search("부산역", "잠실역");

  expect(screen.getByText(/예시 데이터에 있는 지명을 입력해 주세요/)).toBeInTheDocument();
});
