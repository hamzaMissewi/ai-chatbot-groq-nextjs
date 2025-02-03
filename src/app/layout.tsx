import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap"
});


export const metadata = {
  title: "Aiden🚀",
  description: "An AI chatbot for recommending how to study and build LLM's"
};

export default function RootLayout({ children }) {
  return (
    <ConvexClientProvider>
      <html lang="en" className={grotesk.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any"
        />

      </head>
      <body
        className="bg-black"
      >
      {children}
      </body>
      </html>
    </ConvexClientProvider>
  );
}
