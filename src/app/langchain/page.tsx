import { ChatWindow } from "@/components/other/ChatWindow";
import { GuideInfoBox } from "@/components/other/guide/GuideInfoBox";
import { SiLangchain } from "react-icons/si";

export default function Home() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          <span className="ml-2">
            💻 This is AI assistant using{" "}
            <a href="https://js.langchain.com/" target="_blank">
              <SiLangchain size={6} />
              LangChain.js and different LLMs
            </a>{" "}
          </span>
        </li>
        {/*    Vercel{" "}*/}
        {/*    <a href="https://sdk.vercel.ai/docs" target="_blank">*/}
        {/*      AI SDK*/}
        {/*    </a>{" "}*/}
        {/*    <a href="https://nextjs.org/" target="_blank">*/}
        {/*      Next.js*/}
        {/*    </a>{" "}*/}

        {/*<li className="text-l hidden">*/}
        {/*💻*/}
        {/*  <span className="ml-2">*/}
        {/*    You can find the prompt and model logic for this use-case in{" "}*/}
        {/*    <code>app/api/chat/route.ts</code>.*/}
        {/*  </span>*/}
        {/*</li>*/}
        <li>
          💯
          <span className="ml-2">
            {/*By default, the bot can help answer all questions about a Neuroscience course called */}
            By default, this AI assistant can help answer all questions about a
            coding and IT questions basically, but you can change the prompt to
            whatever you want!
            {/*<a href="https://sidwarrier.com/neuromastery" target="_blank">*/}
            {/*  NeuroMastery*/}
            {/*</a>{" "}*/}
          </span>
        </li>
        <li className="text-l hidden">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            {/*Try asking e.g. <code>What is the course about?</code> below!*/}
            Try asking for example <code>What is NextJs Framework?</code> below!
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindow
      endpoint="/api/chat"
      placeholder="I'm an AI bot to answer all your questions on different IT and techs subjects !"
      emptyStateComponent={InfoCard}
    />
  );
}
