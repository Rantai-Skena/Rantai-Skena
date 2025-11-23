"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { UrlObject } from "url";
import { Button } from "@/components/ui/button";

const NAVIGATION_LINKS = [
  { label: "The Blueprint", href: "/how-it-works" },
  { label: "Start Your Run", href: "/login" },
] as const;

const STATS = [
  { label: "The Acceleration Goal", value: "13y → 3y" },
  { label: "Global Market Scope", value: "$8B+" },
  { label: "Gatekeepers", value: "0" },
  { label: "Core Philosophy", value: "DIY" },
] as const;

export default function LandingPageContent() {
  return (
    <section className="py-6 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="s grid gap-10 p-10 md:grid-cols-2">
          <div className="space-y-6 text-white">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
              Our Vision
            </p>
            <h2 className="font-semibold text-3xl leading-tight md:text-4xl">
              Kill the 10-Year Wait.
            </h2>
            <p className="text-lg text-muted-foreground">
              The talent is world-class, but the timeline is rigged. Why should
              it take a local band 13 years to tour abroad when others do it in
              three?
            </p>
            <p className="text-muted-foreground text-sm">
              We exist to close that gap. We replace years of cold calls with a
              network that actually moves. No more waiting for a miracle. We
              built the bridge so you can just walk across.ellus ipsum hendrerit
              justo, id aliquam nisl tortor vel felis.
            </p>
            <div className="flex flex-wrap gap-3">
              {NAVIGATION_LINKS.map((item) => (
                <Button
                  key={item.label}
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-white/20 bg-background/30 text-sm text-white hover:bg-white/20"
                >
                  <Link href={item.href as unknown as UrlObject}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="gap-1 pr-1.5"
              >
                <Link href="/login">
                  <span>Learn More</span>
                  <ChevronRight className="size-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-background/40 p-6 text-white shadow-lg">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
                Insight
              </p>
              <p className="mt-3 font-semibold text-2xl">The Paradox </p>
              <p className="mt-2 text-muted-foreground text-sm">
                Indonesian scene has the culture and the crowds, but
                structurally, we are cut off. We built this platform to fix the
                broken link between local talent and the global economy.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-background/40 p-4 text-center text-white"
                >
                  <p className="font-semibold text-xl">{stat.value}</p>
                  <p className="mt-1 text-muted-foreground text-xs uppercase tracking-[0.3em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-sm text-white">
              <p>
                We don't just export music, we export culture. RantaiSkena is
                the digital spearhead for the next global wave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
