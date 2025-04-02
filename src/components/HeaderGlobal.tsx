import { SignedIn } from "@clerk/nextjs";
import { ActiveLink } from "./other/Navbar";
import { TbBrandOpenai } from "react-icons/tb";
// import { Emojis } from "@/lib/types";

export function GlobalNavbar() {
  return (
    <nav className="flex flex-col justify-center gap-2 md:flex-row md:flex-wrap md:items-center">
      <ActiveLink href="/dashboard">
        <TbBrandOpenai className={"size-6"} />
        Dashboard
      </ActiveLink>

      <SignedIn>
        <ActiveLink href="/langchain/langgraph">🕸️ LangGraph</ActiveLink>
        {/* <ActiveLink href="/langchain/agents">{Emojis.handshake} Agents</ActiveLink> */}
        {/* <ActiveLink href="/langchain/retrieval">{Emojis.sea} Retrieval</ActiveLink> */}
        {/* <ActiveLink href="/langchain/retrieval_agents">
           Retrieval Agents
        </ActiveLink> */}
        {/* <ActiveLink href="/langchain/structured_output">
          Structured Output
        </ActiveLink> */}
        {/* <ActiveLink href="/langchain/ai_sdk">
          🌊 React Server Components
        </ActiveLink> */}
      </SignedIn>
    </nav>
  );
}
