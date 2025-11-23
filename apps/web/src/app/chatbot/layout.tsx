import { HeroHeader } from "@/components/header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <Header /> */}
      <HeroHeader />
      {children}
    </>
  );
}
