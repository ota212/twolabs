import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
    <html
      lang="pt-BR"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
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
