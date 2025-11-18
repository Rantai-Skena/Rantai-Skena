"use client";

import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PickRole from "@/components/pick-role";

export default function Onboarding() {
  return (
    <div className="flex flex-col p-4">
      <Link href="/" className="contents">
        <ArrowLeftIcon size={28} />
      </Link>
      <PickRole/>
    </div>
  );
}
