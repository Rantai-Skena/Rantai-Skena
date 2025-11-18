"use client";

import { Check } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type StepperProps = {
  steps: { title: string }[];
  currentStep: number;
};

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex w-full items-center justify-center">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const text = isCompleted ? <Check /> : `0${index + 1}`;

        return (
          <div
            key={index}
            className={`${index < steps.length - 1 ? "w-full" : "w-fit"} flex items-center`}
          >
            {/* Step Circle */}
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border border-autumn-500 transition-all",
                isActive &&
                  "bg-card text-white shadow-[0_0_10px_1px_rgba(184,98,0,0.5)]",
                isCompleted && "bg-autumn-500 text-white",
                !isActive && !isCompleted && "bg-card text-gray-500",
              )}
            >
              {text}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 flex-1 transition-all",
                  isCompleted ? "bg-autumn-500" : "bg-card",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
