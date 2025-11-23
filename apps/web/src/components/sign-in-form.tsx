import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
          },
          {
            onSuccess: () => {
              router.push("/dashboard");
              toast.success("Berhasil masuk");
            },
            onError: (error) => {
              console.error("Auth error:", error);

              // Handle different types of errors
              if (error.error?.message) {
                toast.error(error.error.message);
              } else if (error.error?.statusText) {
                toast.error(error.error.statusText);
              } else {
                toast.error("Terjadi kesalahan saat masuk. Silakan coba lagi.");
              }
            },
          },
        );
      } catch (error) {
        console.error("Network or unexpected error:", error);

        // Handle network errors specifically
        if (
          error instanceof TypeError &&
          error.message.includes("Failed to fetch")
        ) {
          // toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan tidak terduga. Silakan coba lagi.");
        }
      }
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Alamat email tidak valid"),
        password: z.string().min(8, "Password minimal 8 karakter"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <section className="flex px-4 py-16">
      <div className="m-auto w-full max-w-md">
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-background/60 shadow-2xl backdrop-blur-lg">
          <div className="p-8">
            <div className="text-center">
              <Link
                href="/"
                aria-label="Go to homepage"
                className="mx-auto block w-fit"
              >
                <h1 className="font-bold text-2xl text-white tracking-wide">
                  RantaiSkena
                </h1>
              </Link>
              <h2 className="mt-6 mb-2 font-semibold text-white text-xl">
                Masuk ke RantaiSkena
              </h2>
              <p className="text-muted-foreground text-sm">
                Selamat datang kembali! Masuk untuk melanjutkan
              </p>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div>
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="block text-sm text-white"
                      >
                        Email
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="rounded-sm border border-white/20 bg-background/40 text-white placeholder:text-muted-foreground focus:border-primary"
                        placeholder="masukkan email anda"
                        autoComplete="email"
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          className="text-red-400 text-sm"
                          key={error?.message}
                        >
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
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={field.name}
                          className="text-sm text-white"
                        >
                          Password
                        </Label>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="rounded-sm border border-white/20 bg-background/40 text-white placeholder:text-muted-foreground focus:border-primary"
                        placeholder="masukkan password anda"
                        autoComplete="current-password"
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          className="text-red-400 text-sm"
                          key={error?.message}
                        >
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
                    type="submit"
                    disabled={!state.canSubmit || state.isSubmitting}
                    className="w-full rounded-sm bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {state.isSubmitting ? "Memproses..." : "Masuk"}
                  </Button>
                )}
              </form.Subscribe>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                Belum punya akun?{" "}
                <Button
                  onClick={onSwitchToSignUp}
                  variant="link"
                  className="h-auto p-0 text-autumn-400 hover:text-autumn-300"
                >
                  Daftar sekarang
                </Button>
              </p>
            </div>
          </div>
        </Card>

        <div className="-z-10 pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-r from-autumn-500/30 via-lavender-500/30 to-sky-500/30 opacity-50 blur-3xl" />
      </div>
    </section>
  );
}
