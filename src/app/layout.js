import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});


export const metadata = {
  title: "AI Chatbot🚀",
  description: "An AI chatbot for recommending how to study and build LLM's",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={grotesk.className}>
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
