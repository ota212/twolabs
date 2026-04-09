import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Dois Labs — Produtos Digitais para Psicólogos",
    template: "%s | Dois Labs",
  },
  description:
    "Planilhas, documentos e ferramentas digitais para psicólogos gerenciarem seu consultório com mais clareza e profissionalismo.",
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
    title: "Dois Labs — Produtos Digitais para Psicólogos",
    description:
      "Planilhas, documentos e ferramentas digitais para psicólogos gerenciarem seu consultório com mais clareza e profissionalismo.",
    images: [
      {
        url: "/images/planilha/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Dois Labs — Produtos Digitais para Psicólogos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dois Labs — Produtos Digitais para Psicólogos",
    description:
      "Planilhas, documentos e ferramentas digitais para psicólogos gerenciarem seu consultório com mais clareza e profissionalismo.",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
