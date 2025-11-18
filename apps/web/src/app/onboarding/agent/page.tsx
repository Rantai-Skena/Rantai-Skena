"use client";
import { useForm } from "@tanstack/react-form";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
import { authClient } from "@/lib/auth-client";

export default function OnboardingAgent() {
  const steps = [{ title: "" }, { title: "" }, { title: "" }];
  const [currentStep, setCurrentStep] = useState(2);

  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            setCurrentStep(1);
          },
          onError: (error) => {
            console.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="-z-10 absolute top-0 left-0 h-1/2 min-w-screen bg-linear-to-r from-autumn-500 via-lavender-500 to-sky-500 opacity-30 blur-3xl" />
      <Link href="/" className="contents">
        <ArrowLeftIcon size={28} />
      </Link>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full justify-center px-20">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="mt-10">
          <div className="grid w-full grid-cols-2 gap-15">
            <div className="flex grow flex-col items-center">
              <div className="flex flex-col items-start">
                <h1 className="text-h1 text-white">Tell us about your</h1>
                <h1 className="inline-flex bg-gradient-agent bg-clip-text text-h1 text-transparent">
                  Agency
                </h1>
              </div>
            </div>
            {currentStep === 0 && (
              <Card className="flex w-full max-w-md grow rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-6 text-center font-bold text-3xl">
                    Agent Profile
                  </h1>
                  <p className="text-center text-bodyLarge">
                    Introduce your agency, add your name, city, and short
                    description.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div>
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>
                            Agency/Organizer name
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            placeholder="Enter your band name"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <form.Field name="email">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>City/Base location</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="email"
                            value={field.state.value}
                            placeholder="Enter your city"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <form.Field name="password">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Bio</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="area"
                            value={field.state.value}
                            placeholder="Enter your bio"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Subscribe>
                    {(state) => (
                      <Button
                        className="w-full"
                        disabled={!state.canSubmit || state.isSubmitting}
                        type="submit"
                        variant="destructive"
                      >
                        {state.isSubmitting ? "Submitting..." : "Next"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </Card>
            )}
            {currentStep === 1 && (
              <Card className="flex w-full max-w-md grow rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-6 text-center font-bold text-3xl">
                    Genre & Music Style
                  </h1>
                  <p className="text-center text-bodyLarge">
                    Pick the genres you like to connect with the right bands.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div>
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Band Name</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            placeholder="Enter your band name"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Subscribe>
                    {(state) => (
                      <Button
                        className="w-full"
                        disabled={!state.canSubmit || state.isSubmitting}
                        type="submit"
                        variant="destructive"
                      >
                        {state.isSubmitting ? "Submitting..." : "Next"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </Card>
            )}
            {currentStep === 2 && (
              <Card className="flex w-full max-w-md grow rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-6 text-center font-bold text-3xl">
                    Contacts
                  </h1>
                  <p className="text-center text-bodyLarge">
                    Share your links to help band discover your agency and get
                    in touch.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div>
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Instagram</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            placeholder="Enter your instagram username"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <form.Field name="email">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Email</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="email"
                            value={field.state.value}
                            placeholder="Enter your email"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p className="text-red-500" key={error?.message}>
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Subscribe>
                    {(state) => (
                      <Button
                        className="w-full"
                        disabled={!state.canSubmit || state.isSubmitting}
                        type="submit"
                        variant="destructive"
                      >
                        {state.isSubmitting ? "Submitting..." : "Finish"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
