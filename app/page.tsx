"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrivalInfo,
  RouteExample,
  Stop,
  findNearestStop,
  findRoute,
  getArrivalInfo,
} from "@/lib/transit/fixtures";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${remainder}초`;
  return `${minutes}분 ${remainder}초`;
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
    | { status: "no-route-match"; origin: Stop; destination: Stop }
    | { status: "found"; origin: Stop; destination: Stop; route: RouteExample }
  >({ status: "idle" });
  const [arrival, setArrival] = useState<ArrivalInfo | null>(null);

  function handleSearch() {
    setArrival(null);
    const origin = findNearestStop(originInput.trim());
    const destination = findNearestStop(destinationInput.trim());

    if (!origin || !destination) {
      setResult({ status: "no-stop-match" });
      return;
    }

    const route = findRoute(origin, destination);
    if (!route) {
      setResult({ status: "no-route-match", origin, destination });
      return;
    }

    setResult({ status: "found", origin, destination, route });
  }

  function handleCheckArrival() {
    if (result.status !== "found") return;
    setArrival(getArrivalInfo(result.route.nextLeg));
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
            예시 데이터에 있는 지명을 입력해 주세요. (예: 판교역, 여의도, 잠실역, 합정)
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
              <p>
                {result.origin.name} → {legLabel(result.route.firstLeg)} →{" "}
                <span className="font-medium">{result.route.transferStop.name}</span>{" "}
                (환승) → {legLabel(result.route.nextLeg)} → {result.destination.name}
              </p>

              <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                <p className="text-sm font-medium text-foreground">
                  {result.route.transferStop.name}에서 탈 다음{" "}
                  {legLabel(result.route.nextLeg)}
                </p>
                <Button variant="outline" onClick={handleCheckArrival}>
                  도착 정보 확인
                </Button>
                {arrival && (
                  <div className="text-sm text-muted-foreground" role="status">
                    <p>도착까지 {formatDuration(arrival.arrivalSeconds)}</p>
                    {arrival.mode === "bus" ? (
                      <p>
                        {arrival.stopsRemaining}개 정류장 전 · {arrival.vehicleType}
                      </p>
                    ) : (
                      <p>
                        {arrival.trainType} · {arrival.destinationName}행
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
