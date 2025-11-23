import { HeroHeader } from "@/components/header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-h-screen overflow-hidden">
      <HeroHeader />
      {children}
    </div>
  );
}
