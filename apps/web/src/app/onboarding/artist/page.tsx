"use client";
import { useForm } from "@tanstack/react-form";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
import { authClient } from "@/lib/auth-client";

export default function OnboardingArtist() {
  const [bandImageUrl, setBandImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const steps = [{ title: "" }, { title: "" }, { title: "" }];
  const [currentStep, setCurrentStep] = useState(0);
  const genres = [
    "Pop",
    "Indie",
    "Hardcore",
    "Emo",
    "Rock",
    "Jazz",
    "R&B",
    "HipHop",
    "Punk",
    "Metalcore",
    "EDM",
  ];

  const router = useRouter();
  const { isPending } = authClient.useSession();

  const nextPage = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
      bio: "",
      genre: [] as string[],
      spotify: "",
      instagram: "",
      youtube: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

        if (!baseUrl) {
          toast.error("Server URL is not configured");
          return;
        }
        const payload = {
          stageName: value.name,
          city: value.location,
          genre: value.genre.join(", "),
          bio: value.bio,
          instagram: value.instagram,
          spotify: value.spotify,
          youtube: value.youtube,
          imageUrl: bandImageUrl || undefined,
        };

        const res = await fetch(`${baseUrl}/api/artist/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as {
          success?: boolean;
          error?: string;
        };

        if (!res.ok || !data?.success) {
          toast.error(
            data?.error ?? "Failed to save artist profile. Please try again.",
          );
          return;
        }

        toast.success("Artist profile saved!");

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name must be at least 1 characters"),
        location: z.string(),
        bio: z.string(),
        genre: z.array(z.string()).min(1, "Pick at least 1 genre"),
        spotify: z.string(),
        instagram: z.string(),
        youtube: z.string(),
      }),
    },
  });

  async function handleBandImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!baseUrl) {
      toast.error("Server URL is not configured");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = (await res.json()) as {
        success?: boolean;
        url?: string;
        error?: string;
      };

      if (!res.ok || !data?.success || !data.url) {
        throw new Error(data?.error ?? "Upload failed");
      }

      setBandImageUrl(data.url);
      toast.success("Band image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload band image");
    } finally {
      setUploadingImage(false);
    }
  }

  if (isPending) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="-z-10 absolute top-0 left-0 h-1/2 min-w-screen bg-linear-to-r from-autumn-500 via-lavender-500 to-sky-500 opacity-30 blur-3xl" />
      <div
        className="contents hover:cursor-pointer"
        onClick={() => {
          currentStep > 0
            ? setCurrentStep((prev) => prev - 1)
            : (window.location.href = "/onboarding");
        }}
      >
        <ArrowLeftIcon size={28} />
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full justify-center px-20">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="mt-10">
          <div className="grid w-full grid-cols-2 gap-15">
            <div className="flex grow flex-col items-center gap-10">
              <div className="flex flex-col items-start">
                <h1 className="text-h3 text-white">Tell us about your</h1>
                <h1 className="inline-flex bg-gradient-artist bg-clip-text text-h1 text-transparent">
                  Band
                </h1>
              </div>
              <img
                src="/guitar.png"
                alt="guitar"
                className="h-60 w-auto object-cover"
              />
            </div>
            {currentStep === 0 && (
              <Card className="flex w-full max-w-md grow rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-6 text-center font-bold text-3xl">
                    Band Profile
                  </h1>
                  <p className="text-center text-bodyLarge">
                    Show who you are, add your band's name, city, and story that
                    define your sound.
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
                  <div className="space-y-2">
                    <Label>Band image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBandImageChange}
                    />
                    {uploadingImage && (
                      <p className="text-muted-foreground text-xs">
                        Uploading band image...
                      </p>
                    )}
                    {bandImageUrl && (
                      <img
                        src={bandImageUrl}
                        alt="Band image preview"
                        className="mt-2 h-32 w-32 rounded-md object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <form.Field name="name">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Band name</Label>
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
                    <form.Field name="location">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>City/Base location</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
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
                    <form.Field name="bio">
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
                        variant="destructive"
                        onClick={nextPage}
                      >
                        {state.isSubmitting ? "Loading..." : "Next"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </Card>
            )}
            {currentStep === 1 && (
              <Card className="flex h-fit w-full max-w-md rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center gap-1">
                  <h1 className="text-center font-bold text-3xl">
                    Genre & Music Style
                  </h1>
                  <p className="text-center text-bodyLarge">
                    Pick genres that describe your music.
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
                    <form.Field name="genre">
                      {(field) => (
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                          {genres.map((g) => {
                            const selected = field.state.value.includes(g);

                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  if (selected) {
                                    field.handleChange(
                                      field.state.value.filter((v) => v !== g),
                                    );
                                  } else {
                                    field.handleChange([
                                      ...field.state.value,
                                      g,
                                    ]);
                                  }
                                }}
                                className={`rounded-md border px-1 py-0.5 text-small transition ${
                                  selected
                                    ? "border-purple-500"
                                    : "border-white/40 bg-transparent hover:bg-white/10"
                                }`}
                              >
                                <span
                                  className={`${
                                    selected
                                      ? "bg-gradient-artist bg-clip-text text-transparent"
                                      : "text-white"
                                  }`}
                                >
                                  {g}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Subscribe>
                    {(state) => (
                      <Button
                        className="w-full"
                        disabled={!state.canSubmit || state.isSubmitting}
                        variant="destructive"
                        onClick={nextPage}
                      >
                        {state.isSubmitting ? "Loading..." : "Next"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </Card>
            )}
            {currentStep === 2 && (
              <Card className="flex h-fit w-full max-w-md rounded-lg border p-6">
                <div className="flex flex-col items-center justify-center gap-1">
                  <h1 className="text-center font-bold text-3xl">Media</h1>
                  <p className="text-center text-bodyLarge">
                    Share your links and help more people discover your music
                    and connect with your band
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
                    <form.Field name="instagram">
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
                    <form.Field name="spotify">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Spotify Link</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            value={field.state.value}
                            placeholder="Enter your spotify link"
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
                    <form.Field name="youtube">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Youtube Link</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            value={field.state.value}
                            placeholder="Enter your youtube link"
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
