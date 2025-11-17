import { SendHorizonal } from "lucide-react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import Footer from "./footer";
// import { HeroHeader } from "./header";
import { LogoCloud } from "./logo-cloud";
import { Card } from "./ui/card";

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

      <main className="flex flex-col gap-46 overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section className="min-h-screen">
          <img
            alt="crowd"
            className="-z-10 absolute h-full w-full"
            src="crowd.png"
          />
          <div className="absolute bottom-0 left-0 h-46 w-full bg-linear-to-b from-transparent to-background" />
          <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                as="h1"
                className="text-nowrap font-bold text-4xl md:text-5xl"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Your Stage. Your Story. Your Sound.
              </TextEffect>
              <TextEffect
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg"
                delay={0.5}
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Connect Artists with the Right Opportunities
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
                <div className="md:pr-1.5 lg:pr-0">
                  <Button
                    aria-label="submit"
                    className="rounded-(--radius)"
                    size="sm"
                    variant="destructive"
                  >
                    <span className="hidden px-2 md:block">Get Started</span>
                    <SendHorizonal
                      className="relative mx-auto size-5 md:hidden"
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <section className="">
          <div className="flex flex-col items-center justify-center gap-15">
            <h1 className="text-h1">
              Why Join&nbsp;
              <span className="text-autumn-500">RantaiSkena</span>?
            </h1>
            <div className="flex justify-center gap-15 px-20">
              <div className="h-fit w-fit transform rounded-xl bg-transparent p-px transition-all duration-700 hover:bg-gradient-artist">
                <Card>
                  <div className="flex w-124 flex-col items-center justify-center gap-4 px-10 py-4">
                    <h1 className="bg-gradient-artist bg-clip-text text-h3 text-transparent">
                      For Artist
                    </h1>
                    <div className="h-px w-full bg-gradient-artist px-2" />
                    <p className="text-center text-white">
                      Grow your audience and get discovered by bookers and fans
                      through your profile and live gigs.
                    </p>
                  </div>
                </Card>
              </div>
              <div className="h-fit w-fit transform rounded-xl bg-transparent p-px transition-all duration-700 hover:bg-gradient-agent">
                <Card>
                  <div className="flex w-124 flex-col items-center justify-center gap-4 px-10 py-4">
                    <h1 className="bg-gradient-agent bg-clip-text text-h3 text-transparent">
                      For Agent
                    </h1>
                    <div className="h-px w-full bg-gradient-agent px-2" />
                    <p className="text-center text-white">
                      Find the right band that fits you and connect directly
                      with artists you.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-36">
          <div className="flex flex-col items-center justify-center px-20">
            <Card className="flex flex-row items-center justify-center gap-8 rounded-2xl p-10">
              <div className="flex w-full flex-col items-start justify-center gap-7">
                <div className="text-h3">Ready to join?</div>
                <div className="text-wrap text-h5">
                  Sign up now and make your sound heard across the city.
                </div>
                <Button variant="destructive" size="lg">
                  Get Started
                </Button>
              </div>
              <div className="overflow-hidden p-4">
                <img
                  src="frequency.png"
                  alt="icon"
                  className="h-full w-auto object-cover"
                />
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
