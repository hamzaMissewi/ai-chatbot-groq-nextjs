import { ChatWindow } from "@/components/other/ChatWindow";
import InfoCard from "@/components/other/InfoCard";
import { Emojis } from "@/lib/types";
// import { GuideInfoBox } from "@/components/other/guide/GuideInfoBox";
// import { EmojiStyle } from "emoji-picker-react";

function Page() {
  // const InfoCard = (
  //   <GuideInfoBox>
  //     <ul>
  //       <li className="text-l hidden text-center md:block">
  //         {/* {EmojiStyle.GOOGLE} */}
  //         Retrieval Agents. This page uses a LangChain retrieval chain and the
  //         Vercel
  //       </li>
  //       {/* <li>{Emojis.ladder}</li> */}
  //       <li className="text-l hidden md:block">
  //         {Emojis.settings}
  //         <span className="ml-2">
  //           The agent has access to a vector store retriever as a tool as well
  //           as a memory. It&apos;s particularly well suited to meta-questions
  //           about the current conversation.
  //         </span>
  //       </li>
  //       <li className="text-l">
  //         {Emojis.finger_down}
  //         <span className="ml-2">
  //           Upload some text, then try asking e.g.{" "}
  //           <code>
  //             When is the next discovery call of NeuroMastery Bootcamp?
  //           </code>{" "}
  //           below!
  //         </span>
  //       </li>
  //     </ul>
  //   </GuideInfoBox>
  // );

  return (
    <ChatWindow
      endpoint="/api/chat/retrieval_agents"
      emptyStateComponent={
        <InfoCard description="Retrieval Agents. This page uses a LangChain retrieval chain and Vercel">
          <li className="text-l">
            {Emojis.finger_down}
            <span className="ml-2">
              Upload some text, then try asking e.g.{" "}
              <code>
                {/* When is the next discovery call of NeuroMastery Bootcamp? */}
                When is the next discovery call ?
              </code>{" "}
              below!
            </span>
          </li>
        </InfoCard>
      }
      showIngestForm={true}
      showIntermediateStepsToggle={true}
      placeholder={
        // 'I am a Retrieval-focused agent! Ask, "When is the next discovery call of NeuroMastery Bootcamp?"'
        'I am a Retrieval-focused agent! Ask, "What is the current conversation like ?"'
      }
      emoji="🟣"
    />
  );
}

export default Page;
