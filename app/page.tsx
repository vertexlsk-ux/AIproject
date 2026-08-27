"use client";

import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Leg,
  RouteExample,
  Stop,
  estimateSchedule,
  findNearestStop,
  findRoute,
  needsNoTransfer,
  shiftDepartureTime,
} from "@/lib/transit/fixtures";

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function legLabel(leg: Leg) {
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
        baseSearchTime: Date;
      }
  >({ status: "idle" });
  const [departureStep, setDepartureStep] = useState(0);

  function handleSearch() {
    const origin = findNearestStop(originInput.trim());
    const destination = findNearestStop(destinationInput.trim());

    setDepartureStep(0);

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

    setResult({ status: "found", origin, destination, route, baseSearchTime: new Date() });
  }

  const schedule =
    result.status === "found"
      ? estimateSchedule(
          result.route,
          shiftDepartureTime(result.route, result.baseSearchTime, departureStep)
        )
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-200 p-6">
      {/* 아이폰 16 프로 전면 디자인을 흉내 낸 프레임: 티타늄 느낌 테두리 + Dynamic Island */}
      <div className="rounded-[55px] bg-zinc-950 p-3 shadow-2xl">
        <div className="relative h-[874px] w-[402px] overflow-hidden rounded-[44px] bg-background">
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black" />

          <div className="flex h-full flex-col items-center overflow-y-auto px-6 pb-16 pt-14 font-sans">
            <div className="flex w-full flex-col gap-4">
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
                      placeholder="예: 잠실역, 도곡역"
                    />
                  </label>
                  <Button onClick={handleSearch}>경로 찾기</Button>
                </CardContent>
              </Card>

              {result.status === "no-stop-match" && (
                <p className="text-sm text-muted-foreground" role="status">
                  예시 데이터에 있는 지명을 입력해 주세요. (예: 판교역, 여의도, 또는 1~9호선의
                  역 이름 아무거나)
                </p>
              )}

              {result.status === "no-transfer-needed" && (
                <p className="text-sm text-muted-foreground" role="status">
                  {result.origin.name}에서 {result.destination.name}까지는 같은 노선이라
                  환승이 필요 없는 구간이에요.
                </p>
              )}

              {result.status === "no-route-match" && (
                <p className="text-sm text-muted-foreground" role="status">
                  {result.origin.name}에서 {result.destination.name}까지의 예시 경로는 아직
                  준비되어 있지 않아요.
                </p>
              )}

              {result.status === "found" && schedule && (
                <Card>
                  <CardContent className="flex flex-col gap-2 py-4 text-sm text-foreground">
                    <p className="text-xs font-medium text-muted-foreground">추천 경로</p>

                    <div className="flex flex-col gap-0.5">
                      <p>
                        <span className="font-medium">{result.origin.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          · 출발 {formatTime(schedule.departureTime)}
                        </span>
                      </p>

                      {result.route.legs.map((leg, i) => (
                        <Fragment key={i}>
                          <p className="pl-1 text-xs text-muted-foreground">
                            ↓ {legLabel(leg)}
                          </p>
                          {i < result.route.transferStops.length ? (
                            <p>
                              <span className="font-medium">
                                {result.route.transferStops[i].name} (환승)
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {" "}
                                · 도착 {formatTime(schedule.transferArrivalTimes[i])}
                              </span>
                            </p>
                          ) : (
                            <p className="font-medium">{result.destination.name}</p>
                          )}
                        </Fragment>
                      ))}
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      실제 시각표가 아닌 현재 시각 기준 추정치예요
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={departureStep <= 0}
                        onClick={() => setDepartureStep((step) => Math.max(0, step - 1))}
                      >
                        이전
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDepartureStep((step) => step + 1)}
                      >
                        다음
                      </Button>
                      <p className="text-[11px] text-muted-foreground">출발 시각 옮겨보기</p>
                    </div>

                    {result.route.transferStops.map((stop, i) => (
                      <div key={i} className="flex flex-col gap-1 rounded-xl bg-muted p-2.5">
                        <p className="text-xs font-medium text-foreground">
                          {stop.name}에서 탈 {legLabel(result.route.legs[i + 1])} 출발 예정
                        </p>
                        <ul className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          {schedule.upcomingDeparturesByTransfer[i].map((departure) => (
                            <li
                              key={departure.getTime()}
                              className="rounded-full bg-background px-2 py-0.5"
                            >
                              {formatTime(departure)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
