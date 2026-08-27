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

test("경로를 찾으면 출발역 아래에 출발 시각, 환승역 아래에 도착 예정 시각이 표시된다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");

    // legs[0].durationMinutes(35분)만큼 09:00에 더한 09:35.
    expect(screen.getByText(/출발 09:00/)).toBeInTheDocument();
    expect(screen.getByText(/도착 09:35/)).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

test("환승역 도착 시간 오른쪽에 출발 시간도 함께(굵게) 표시된다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");

    // 도착 09:35 · 출발(2호선 평시 배차간격 6분 첫 값) 09:41이 한 요소 안에 함께 표시된다.
    const transferTime = screen.getByText(/도착 09:35 · 출발 09:41/);
    expect(transferTime).toBeInTheDocument();
    expect(transferTime).toHaveClass("font-bold");
  } finally {
    vi.useRealTimers();
  }
});

test("이전/다음 버튼이 추천 경로 텍스트보다 앞에 나온다", () => {
  render(<Home />);

  search("판교역", "잠실역");

  const routeLabel = screen.getByText("추천 경로");
  const prevButton = screen.getByRole("button", { name: "이전" });
  // DOM 순서상 이전 버튼이 "추천 경로"보다 앞에 있어야 한다.
  expect(
    prevButton.compareDocumentPosition(routeLabel) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

test("경로를 찾으면 환승 지점에서 탈 다음 교통편의 출발 예정 시각이 3개 목록으로 표시된다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");

    // 도착 예정 09:35에 2호선 평시 배차간격(6분)을 1~3번 더한 값들.
    expect(screen.getByText("09:41")).toBeInTheDocument();
    expect(screen.getByText("09:47")).toBeInTheDocument();
    expect(screen.getByText("09:53")).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

test("경로를 찾은 직후에는 이전 버튼이 비활성화되어 있다", () => {
  render(<Home />);

  search("판교역", "잠실역");

  expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
});

test("다음 버튼을 누르면 출발 시각과 도착 예정 시각이 배차간격만큼 늦어진다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");
    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    // legs[0](버스, 기본 배차간격 평시 10분)만큼 09:00에서 09:10으로, 도착 예정도 09:45로 늦어진다.
    expect(screen.getByText(/출발 09:10/)).toBeInTheDocument();
    expect(screen.getByText(/도착 09:45/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).not.toBeDisabled();
  } finally {
    vi.useRealTimers();
  }
});

test("다음을 누른 뒤 이전을 누르면 원래 출발 시각으로 돌아온다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));

  try {
    render(<Home />);

    search("판교역", "잠실역");
    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    fireEvent.click(screen.getByRole("button", { name: "이전" }));

    expect(screen.getByText(/출발 09:00/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
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

test("평촌역에서 잠실역까지 경로를 찾을 수 있다 (4호선 역과 손으로 만든 예시 밖의 조합)", () => {
  render(<Home />);

  search("평촌역", "잠실역");

  expect(screen.getAllByText(/잠실역/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/예시 경로는 아직/)).not.toBeInTheDocument();
});

test("평촌역에서 도곡역까지 경로를 찾을 수 있다", () => {
  render(<Home />);

  search("평촌역", "도곡역");

  expect(screen.getAllByText(/도곡역/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/예시 경로는 아직/)).not.toBeInTheDocument();
});

test("환승이 두 번 필요한 경로는 환승역 두 곳 모두 출발 예정 시각이 3개씩 표시된다", () => {
  render(<Home />);

  search("모란역", "청량리역");

  const chipLists = screen.getAllByText(/^\d{2}:\d{2}$/);
  expect(chipLists.length).toBe(6); // 환승역 2곳 × 3개
});

test("예시 데이터에 없는 지명을 입력하면 안내 메시지가 표시된다", () => {
  render(<Home />);

  search("부산역", "잠실역");

  expect(screen.getByText(/예시 데이터에 있는 지명을 입력해 주세요/)).toBeInTheDocument();
});
