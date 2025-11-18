"use client";

import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="flex flex-col p-4">
      <Link href="/">
        <ArrowLeftIcon size={28}/>
      </Link>
      {showSignIn ? (
        <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
      )}
    </div>
  );
}
