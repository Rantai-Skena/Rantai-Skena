"use client";

import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PickRole from "@/components/pick-role";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="flex flex-col p-4">
      <Link href="/" className="contents">
        <ArrowLeftIcon size={28} />
      </Link>
      {showSignIn ? (
        <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
      )}
    </div>
  );
}
