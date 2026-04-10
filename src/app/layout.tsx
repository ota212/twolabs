import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Dois Labs — Produtos Digitais",
    template: "%s | Dois Labs",
  },
  description:
    "Produtos digitais prontos para usar, construídos com automação e IA. Do problema à solução — sem enrolação.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://doislabs.com.br"),
  alternates: {
    canonical: "https://doislabs.com.br",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://doislabs.com.br",
    siteName: "Dois Labs",
    title: "Dois Labs — Produtos Digitais",
    description:
      "Produtos digitais prontos para usar, construídos com automação e IA. Do problema à solução — sem enrolação.",
    images: [
      {
        url: "/images/planilha/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Dois Labs — Produtos Digitais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dois Labs — Produtos Digitais",
    description:
      "Produtos digitais prontos para usar, construídos com automação e IA. Do problema à solução — sem enrolação.",
    images: ["/images/planilha/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body className="bg-cream text-navy font-sans antialiased min-h-screen flex flex-col">
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
