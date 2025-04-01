import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/Loading";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "🚀Hamza AI Assistant🚀",
  description: "A powerful AI assistant Langchain and different LLMs",
};

export default function RootLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    // <ConvexAuthNextjsServerProvider>
    <ConvexClientProvider>
      <html lang="en" className={grotesk.className}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
        <body>{children}</body>
        {/* </Suspense> */}
      </html>
    </ConvexClientProvider>
    // </ConvexAuthNextjsServerProvider>
  );
}
