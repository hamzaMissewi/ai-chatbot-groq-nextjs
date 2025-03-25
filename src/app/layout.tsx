import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap"
});


export const metadata = {
  title: "Hamza Chatbot🚀",
  description: "An AI chatbot using Langchain, groq and Deepseek R1 LLM"
};

export default function RootLayout({ children }: { children: Readonly<React.ReactNode> }) {
  return (
    // <ConvexAuthNextjsServerProvider>
    <ConvexClientProvider>
      <html lang="en" className={grotesk.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any"
        />

      </head>
      <body
        // className="bg-black"
      >
      {children}
      </body>
      </html>
    </ConvexClientProvider>
  );
}
