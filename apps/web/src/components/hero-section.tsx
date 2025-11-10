import { Mail, SendHorizonal } from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
// import { HeroHeader } from "./header";
import { LogoCloud } from "./logo-cloud";

// const transitionVariants = {
//   item: {
//     hidden: {
//       opacity: 0,
//       filter: "blur(12px)",
//       y: 12,
//     },
//     visible: {
//       opacity: 1,
//       filter: "blur(0px)",
//       y: 0,
//       transition: {
//         type: "spring",
//         bounce: 0.3,
//         duration: 1.5,
//       },
//     },
//   },
// };

export default function HeroSection() {
  return (
    <>
      {/* <HeroHeader /> */}

      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                as="h1"
                className="text-balance font-medium text-5xl md:text-6xl"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Healthier daily routine
              </TextEffect>
              <TextEffect
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg"
                delay={0.5}
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Tailwindcss highly customizable components for building modern websites and
                applications that look and feel the way you mean it.
              </TextEffect>

              <AnimatedGroup
                className="mt-12"
                variants={{
                  item: {
                    hidden: {
                      opacity: 0,
                      filter: "blur(4px)",
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                      transition: {
                        type: "spring", // ← Use literal string instead of variable
                        bounce: 0.3,
                        duration: 0.6,
                      },
                    },
                  },
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  },
                }}
              >
                <form action="" className="mx-auto max-w-sm">
                  <div className="relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border bg-background pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2 has-[input:focus]:ring-muted">
                    <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                    <input
                      className="h-12 w-full bg-transparent pl-12 focus:outline-none"
                      placeholder="Your mail address"
                      type="email"
                    />

                    <div className="md:pr-1.5 lg:pr-0">
                      <Button aria-label="submit" className="rounded-(--radius)" size="sm">
                        <span className="hidden md:block">Get Started</span>
                        <SendHorizonal
                          className="relative mx-auto size-5 md:hidden"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </div>
                </form>

                <div
                  aria-hidden
                  className="relative mx-auto mt-32 max-w-2xl bg-radial from-primary/50 to-55% to-transparent text-left dark:from-primary/25"
                >
                  <div className="-translate-x-3 -translate-y-12 sm:-translate-x-6 absolute inset-0 mx-auto w-80 rounded-[2rem] border border-border/50 bg-background p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)]">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50" />
                  </div>
                  <div className="mx-auto w-80 translate-x-4 rounded-[2rem] border border-border/50 bg-muted p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8 dark:bg-background/50">
                    <div className="space-y-2 overflow-hidden rounded-[1.5rem] border bg-background p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <AppComponent />

                      <div className="rounded-[1rem] bg-muted p-4 pb-16 dark:bg-white/5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <LogoCloud />
      </main>
    </>
  );
}

const AppComponent = () => (
  <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
    <div className="flex items-center gap-1.5 text-orange-400">
      <svg
        className="size-5"
        height="1em"
        viewBox="0 0 32 32"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none">
          <path
            d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
            fill="#ff6723"
          />
          <path
            d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
            fill="#ffb02e"
          />
        </g>
      </svg>
      <div className="font-medium text-sm">Steps</div>
    </div>
    <div className="space-y-3">
      <div className="border-white/10 border-b pb-3 font-medium text-foreground text-sm">
        This year, you're walking more on average than you did in 2023.
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="space-x-1">
            <span className="align-baseline font-medium text-foreground text-xl">8,081</span>
            <span className="text-muted-foreground text-xs">Steps/day</span>
          </div>
          <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-indigo-600 px-2 text-white text-xs">
            2024
          </div>
        </div>
        <div className="space-y-1">
          <div className="space-x-1">
            <span className="align-baseline font-medium text-foreground text-xl">5,412</span>
            <span className="text-muted-foreground text-xs">Steps/day</span>
          </div>
          <div className="flex h-5 w-2/3 items-center rounded bg-muted px-2 text-foreground text-xs dark:bg-white/20">
            2023
          </div>
        </div>
      </div>
    </div>
  </div>
);
