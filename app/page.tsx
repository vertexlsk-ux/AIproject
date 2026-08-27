import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-background sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            시작하려면{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
              page.tsx
            </code>{" "}
            파일을 수정하세요.
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            시작점이나 추가 안내가 필요하신가요?{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-foreground"
            >
              템플릿
            </a>{" "}
            또는{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-foreground"
            >
              학습 센터
            </a>
            를 확인해 보세요.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button
            size="lg"
            className="w-full md:w-[158px]"
            nativeButton={false}
            render={
              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="dark:invert h-[14px] w-4"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={16}
                  height={14}
                />
                Deploy Now
              </a>
            }
          />
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-[158px]"
            nativeButton={false}
            render={
              <a
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Documentation
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </main>
    </div>
  );
}
