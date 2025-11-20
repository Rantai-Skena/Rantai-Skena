"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="text-lg text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              venenatis, turpis at aliquet laoreet, nisi nulla porttitor augue,
              vitae tempus justo enim in lectus.
            </p>
            <p className="text-muted-foreground text-sm">
              Suspendisse potenti. Integer et massa nec mi ullamcorper ultrices.
              Cras ullamcorper risus eu nulla dignissim tristique. Donec
              commodo, nisl ac aliquet convallis, tellus ipsum hendrerit justo,
              id aliquam nisl tortor vel felis.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Lorem ipsum", "Dolor sit amet", "Consectetur"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/20 bg-background/30 px-4 py-2 text-sm text-white"
                >
                  {item}
                </div>
              ))}
            </div>
            <div>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="gap-1 pr-1.5"
              >
                <Link href="#">
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
              <p className="mt-3 font-semibold text-2xl">Lorem ipsum</p>
              <p className="mt-2 text-muted-foreground text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                vitae orci eros.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Lorem ipsum", value: "42%" },
                { label: "Dolor sit amet", value: "256" },
                { label: "Consectetur", value: "12" },
                { label: "Adipiscing", value: "8 hrs" },
              ].map((stat) => (
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse dignissim, lorem at ullamcorper facilisis, massa
                nisi tempus dui, non vehicula purus sem sed purus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
