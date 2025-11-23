"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import Footer from "./footer";
import LandingPageContent from "./landing-page-content";
import { Team } from "./team";
import { Card } from "./ui/card";

const stats = [
  { value: "13y → 3y", label: "Acceleration Goal" },
  { value: "$8B+", label: "Global Market Scope" },
  { value: "DIY", label: "Core Philosophy" },
] as const;

const heroHighlights = [
  "Verified artists and agents across the region",
  "AI-assisted matchmaking to reduce downtime",
  "Dedicated support and on-call event staff",
] as const;

const steps = [
  {
    title: "Spotlight your craft",
    description:
      "Upload tracks, videos, live sets, and availability so bookers can feel your energy instantly.",
    accent: "bg-gradient-artist",
  },
  {
    title: "Discover curated partners",
    description:
      "Agents see curated artist profiles that match every vibe, budget, and capacity requirement.",
    accent: "bg-gradient-agent",
  },
  {
    title: "Secure stage-ready offers",
    description:
      "Receive verified offers, negotiate, and keep every deal organized in one trusted workspace.",
    accent: "bg-gradient-lavender",
  },
] as const;

const TYPING_WORDS = ["Stage", "Story", "Sound"] as const;

function TypingAnimation() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[currentWordIndex];
    const shouldDelete = isDeleting;

    const timeout = setTimeout(
      () => {
        if (shouldDelete) {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
          if (currentText.length === 1) {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
          }
        } else {
          setCurrentText(currentWord.substring(0, currentText.length + 1));

          if (currentText === currentWord) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        }
      },
      shouldDelete ? 100 : 100,
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <span className="inline-block">
      Your <span className="text-autumn-500">{currentText}</span>
      <span className="animate-pulse text-autumn-500">|</span>.
    </span>
  );
}

export default function HeroSection() {
  const scrollToWhy = () => {
    const element = document.getElementById("why-section");
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <main className="flex flex-col gap-16 overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section className="relative min-h-screen">
          <img
            alt="crowd"
            className="-z-10 absolute inset-0 h-full w-full object-cover"
            src="crowd.png"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background" />
          <div className="absolute bottom-0 left-0 h-46 w-full bg-linear-to-b from-transparent to-background" />
          <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-20 lg:pt-36">
            <div className="relative z-10 grid gap-12 rounded-[32px] border border-white/10 bg-background/60 px-6 py-10 shadow-2xl ring-1 ring-white/20 backdrop-blur-lg lg:grid-cols-[1.25fr_0.75fr] lg:px-12 lg:py-12">
              <div className="space-y-8 text-center text-white md:text-left lg:text-left">
                <h1 className="font-bold text-4xl leading-tight md:text-5xl lg:text-h1">
                  <TypingAnimation />
                </h1>
                <TextEffect
                  as="p"
                  className="mx-auto max-w-2xl text-pretty text-lg md:text-left"
                  delay={0.5}
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                >
                  Your bridge from the underground to the world. We connect bands, venues, and agents to build tours that actually happen. Real connections, no gatekeepers.
                </TextEffect>

                <AnimatedGroup
                  className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
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
                          type: "spring",
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
                      aria-label="scroll to why section"
                      className="rounded-(--radius)"
                      size="sm"
                      variant="destructive"
                      onClick={scrollToWhy}
                    >
                      <span className="px-2">Get Started</span>
                    </Button>
                  </div>
                  <div className="md:pr-1.5 lg:pr-0">
                    <Button size="sm" variant="outline">
                      <Link href="/onboarding/artist" className="px-2">
                        Explore gigs
                      </Link>
                    </Button>
                  </div>
                </AnimatedGroup>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-background/40 px-4 py-3 text-left sm:rounded-2xl sm:px-6 sm:py-5"
                    >
                      <p className="font-bold text-h5 text-white sm:text-h4">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs sm:mt-2 sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="hidden rounded-[28px] border border-white/5 p-8 text-white shadow-2xl shadow-sky-600/40 lg:block">
                <p className="text-sm text-white/70 uppercase tracking-[0.4em]">
                  Momentum
                </p>
                <p className="mt-4 font-semibold text-h4 text-white">
                  Keep It Moving
                </p>
                <p className="mt-2 text-body text-white/80">
                  Real Recognize Real, connect with active venues and agents who actually want to book. No gates, just open doors for everyone.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {heroHighlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* <LogoCloud /> */}

        <section id="why-section" className="pt-8">
          <div className="flex flex-col items-center justify-center gap-15 px-10 lg:px-30">
            <h1 className="text-center text-h4 md:text-h3 lg:text-h1">
              Why Join{" "}
              <span className="text-autumn-500">
                RantaiSkena<span className="text-white">?</span>
              </span>
            </h1>
            <div className="grid w-full gap-6 lg:grid-cols-2">
              <div className="transform rounded-xl bg-transparent p-px transition-all hover:bg-gradient-artist hover:shadow-[0_0_25px_rgba(31,154,255,0.35)]">
                <Card>
                  <div className="flex w-full flex-col items-center justify-center gap-4 px-10 py-6">
                    <h1 className="bg-gradient-artist bg-clip-text text-h5 text-transparent lg:text-h3">
                      For Artists
                    </h1>
                    <div className="h-px w-full bg-gradient-artist" />
                    <p className="text-center text-bodyLarge text-white">
                      Grow your audience, land next-level gigs, and keep every
                      activation organized in one polished profile.
                    </p>
                  </div>
                </Card>
              </div>
              <div className="transform rounded-xl bg-transparent p-px transition-all hover:bg-gradient-agent hover:shadow-[0_0_25px_rgba(255,78,134,0.35)]">
                <Card className="h-full">
                  <div className="flex w-full flex-col items-center justify-center gap-4 px-10 py-6">
                    <h1 className="bg-gradient-agent bg-clip-text text-h5 text-transparent lg:text-h3">
                      For Agents
                    </h1>
                    <div className="h-px w-full bg-gradient-agent" />
                    <p className="text-center text-bodyLarge text-white">
                      Discover artists that match each brief, coordinate
                      schedules, and close offers without leaving the platform.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
              How it works
            </p>
            <h2 className="mt-4 font-semibold text-h4 text-white md:text-h3">
              A collaborative workflow for artists and agents
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-body text-muted-foreground">
              RantaiSkena keeps every introduction transparent so partnerships
              happen faster. Match, message, and manage payments without
              bouncing between tools.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Card
                  key={step.title}
                  className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-background/50 p-6 shadow-black/20 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
                      Step {index + 1}
                    </span>
                    <span className={`h-1 w-16 rounded-full ${step.accent}`} />
                  </div>
                  <h3 className="font-semibold text-h5 text-white">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <LandingPageContent />

        <section className="py-24">
          <div className="mx-auto px-2 lg:px-30">
            <Card className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-background/80 via-background/60 to-background/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm lg:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

              <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-6 text-center lg:text-left">
                  <div className="space-y-3">
                    <h2 className="font-bold text-h3 text-white lg:text-h2">
                      Ready to amplify your sound?
                    </h2>
                    <p className="max-w-lg text-body text-muted-foreground lg:text-bodyLarge">
                      Join thousands of artists and agents creating
                      unforgettable experiences. Your next breakthrough is one
                      connection away.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                    <Link href="/login">
                      <Button
                        variant="destructive"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Join as Artist
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto"
                      >
                        Join as Agent
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="group relative">
                  <div className="-inset-4 absolute rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl transition-all duration-300 group-hover:blur-2xl" />
                  <div className="relative transform overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:rotate-2 hover:scale-105">
                    <img
                      src="frequency.png"
                      alt="Audio frequency visualization representing the platform's connection capabilities"
                      className="h-32 w-auto object-cover lg:h-40"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
        <Team />
      </main>
      <Footer />
    </>
  );
}
