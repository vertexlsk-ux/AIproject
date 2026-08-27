"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  RouteExample,
  Schedule,
  Stop,
  estimateSchedule,
  findNearestStop,
  findRoute,
  needsNoTransfer,
} from "@/lib/transit/fixtures";

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function legLabel(leg: RouteExample["firstLeg"]) {
  return leg.mode === "bus" ? `버스 ${leg.line}` : `지하철 ${leg.line}`;
}

export default function Home() {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [result, setResult] = useState<
    | { status: "idle" }
    | { status: "no-stop-match" }
    | { status: "no-transfer-needed"; origin: Stop; destination: Stop }
    | { status: "no-route-match"; origin: Stop; destination: Stop }
    | {
        status: "found";
        origin: Stop;
        destination: Stop;
        route: RouteExample;
        schedule: Schedule;
      }
  >({ status: "idle" });

  function handleSearch() {
    const origin = findNearestStop(originInput.trim());
    const destination = findNearestStop(destinationInput.trim());

    if (!origin || !destination) {
      setResult({ status: "no-stop-match" });
      return;
    }

    if (needsNoTransfer(origin, destination)) {
      setResult({ status: "no-transfer-needed", origin, destination });
      return;
    }

    const route = findRoute(origin, destination);
    if (!route) {
      setResult({ status: "no-route-match", origin, destination });
      return;
    }

    const schedule = estimateSchedule(route, new Date());
    setResult({ status: "found", origin, destination, route, schedule });
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-16 font-sans">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            환승 도착 알리미
          </h1>
          <p className="text-sm text-muted-foreground">
            출발지와 목적지를 입력하면 환승 지점에서 탈 다음 버스·지하철의 도착 예정
            시간을 미리 확인할 수 있어요.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-foreground">
              출발지
              <Input
                value={originInput}
                onChange={(event) => setOriginInput(event.target.value)}
                placeholder="예: 판교역, 여의도"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              목적지
              <Input
                value={destinationInput}
                onChange={(event) => setDestinationInput(event.target.value)}
                placeholder="예: 잠실역, 합정"
              />
            </label>
            <Button onClick={handleSearch}>경로 찾기</Button>
          </CardContent>
        </Card>

        {result.status === "no-stop-match" && (
          <p className="text-sm text-muted-foreground" role="status">
            예시 데이터에 있는 지명을 입력해 주세요. (예: 판교역, 여의도, 잠실역, 합정, 또는
            4호선·9호선의 역 이름 아무거나)
          </p>
        )}

        {result.status === "no-transfer-needed" && (
          <p className="text-sm text-muted-foreground" role="status">
            {result.origin.name}에서 {result.destination.name}까지는 같은 노선이라 환승이
            필요 없는 구간이에요.
          </p>
        )}

        {result.status === "no-route-match" && (
          <p className="text-sm text-muted-foreground" role="status">
            {result.origin.name}에서 {result.destination.name}까지의 예시 경로는 아직
            준비되어 있지 않아요.
          </p>
        )}

        {result.status === "found" && (
          <Card>
            <CardHeader>
              <CardTitle>추천 경로</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-foreground">
              <div className="flex flex-col gap-1.5">
                <div>
                  <p className="font-medium">{result.origin.name}</p>
                  <p className="text-xs text-muted-foreground">
                    출발 시각 {formatTime(result.schedule.departureTime)}
                  </p>
                </div>

                <p className="pl-1 text-xs text-muted-foreground">
                  ↓ {legLabel(result.route.firstLeg)}
                </p>

                <div>
                  <p className="font-medium">{result.route.transferStop.name} (환승)</p>
                  <p className="text-xs text-muted-foreground">
                    도착 예정 {formatTime(result.schedule.transferArrivalTime)}
                  </p>
                </div>

                <p className="pl-1 text-xs text-muted-foreground">
                  ↓ {legLabel(result.route.nextLeg)}
                </p>

                <p className="font-medium">{result.destination.name}</p>

                <p className="text-xs text-muted-foreground">
                  (실제 시각표가 아닌, 현재 시각 기준 추정치예요)
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                <p className="text-sm font-medium text-foreground">
                  {result.route.transferStop.name}에서 탈 다음{" "}
                  {legLabel(result.route.nextLeg)} 출발 예정
                </p>
                <ul className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {result.schedule.upcomingDepartures.map((departure, index) => (
                    <li
                      key={departure.getTime()}
                      className="rounded-full bg-background px-3 py-1"
                    >
                      {index === 0 ? "다음" : `${index + 1}번째`} {formatTime(departure)}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
