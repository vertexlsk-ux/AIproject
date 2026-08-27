import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

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

test("평촌역에서 마곡나루역까지 경로를 찾으면 여의도역 환승과 9호선이 표시된다", () => {
  render(<Home />);

  search("평촌역", "마곡나루역");

  expect(screen.getAllByText(/여의도역/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/지하철 9호선/).length).toBeGreaterThan(0);
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
