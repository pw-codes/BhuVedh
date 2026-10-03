import "./globals.css";
import SW from "@/components/SW";
import "maplibre-gl/dist/maplibre-gl.css";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--sans" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--serif" });

export const metadata = {
  title: "BhuVedh: spring recharge planning",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = { themeColor: "#241A10" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <SW />
        {children}
      </body>
    </html>
  );
}
