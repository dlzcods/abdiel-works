import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://abdiel.works"),
  title: "Muhammad Abdiel Al Hafiz | AI Project Manager & AI/ML Engineer",
  description:
    "AI Project Manager and AI/ML Engineer building evaluated, human-owned AI systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
