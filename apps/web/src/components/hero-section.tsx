import { SendHorizonal } from "lucide-react";
import Link from "next/link";
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
  const scrollToWhy = () => {
    document.getElementById("why-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <>
      {/* <HeroHeader /> */}

      <main className="flex flex-col gap-14 overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section className="min-h-screen">
          <img
            alt="crowd"
            className="-z-10 absolute h-full w-full object-cover"
            src="crowd.png"
          />
          <div className="absolute bottom-0 left-0 h-46 w-full bg-linear-to-b from-transparent to-background" />
          <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                as="h1"
                className="font-bold text-4xl md:text-5xl lg:text-nowrap"
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
                    onClick={scrollToWhy}
                  >
                    <span className="px-2">Get Started</span>
                  </Button>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <section id="why-section" className="pt-24">
          <div className="flex flex-col items-center justify-center gap-15 px-15 lg:px-20">
            <h1 className="text-center text-h4 max-md:flex max-md:flex-col md:text-h3 lg:text-h1">
              Why Join&nbsp;
              <span className="text-autumn-500">
                RantaiSkena<span className="text-white">?</span>
              </span>
            </h1>
            <div className="grid grid-rows-2 gap-15 lg:grid-cols-2 lg:grid-rows-none">
              <div className="h-full w-full transform rounded-xl bg-transparent p-px transition-all hover:bg-gradient-artist hover:shadow-[0_0_10px_1px_rgba(31,154,255,0.5)]">
                <Card>
                  <div className="flex w-full flex-col items-center justify-center gap-4 self-stretch px-10 py-4">
                    <h1 className="bg-gradient-artist bg-clip-text text-h5 text-transparent lg:text-h3">
                      For Artist
                    </h1>
                    <div className="h-px w-full bg-gradient-artist px-2" />
                    <p className="lg:headline text-center text-bodyLarge text-white">
                      Grow your audience and get discovered by bookers and fans
                      through your profile and live gigs.
                    </p>
                  </div>
                </Card>
              </div>
              <div className="h-full w-full transform rounded-xl bg-transparent p-px transition-all hover:bg-gradient-artist hover:shadow-[0_0_10px_1px_rgba(255,78,134,0.5)]">
                <Card className="h-full w-full">
                  <div className="flex w-full flex-col items-center justify-center gap-4 px-10 py-4">
                    <h1 className="bg-gradient-agent bg-clip-text text-h5 text-transparent lg:text-h3">
                      For Agent
                    </h1>
                    <div className="h-px w-full bg-gradient-agent px-2" />
                    <p className="text-center text-bodyLarge text-white lg:text-mobile">
                      Find the right band that fits you and connect directly
                      with artists you.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="flex flex-col items-center justify-center px-10 lg:px-20">
            <Card className="flex flex-row items-center justify-center gap-8 rounded-2xl p-10">
              <div className="flex w-full flex-col items-start justify-center gap-7 max-md:items-center max-md:text-center">
                <div className="text-h3 max-lg:text-h5">Ready to join?</div>
                <div className="text-wrap text-h5 max-md:text-caption max-lg:text-mobile">
                  Sign up now and make your sound heard across the city.
                </div>
                <Link href="/login">
                  <Button variant="destructive" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="hover:-rotate-6 overflow-hidden p-4 duration-300 max-md:hidden">
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
