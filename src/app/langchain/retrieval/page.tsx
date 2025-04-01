import { ChatWindow } from "@/components/other/ChatWindow";
import { GuideInfoBox } from "@/components/other/guide/GuideInfoBox";
import InfoCard from "@/components/other/InfoCard";
import { SiLangchain } from "react-icons/si";

const Page = () => {
  // const InfoCard = (
  //   <GuideInfoBox>
  //     <ul>
  //       <li className="text-l">
  //         <span className="ml-2">
  //           💻 This is a chatbot using{" "}
  //           <a href="https://js.langchain.com/" target="_blank">
  //             <SiLangchain size={6} />
  //             LangChain.js
  //           </a>{" "}
  //         </span>
  //       </li>
  //       <li>
  //         💯
  //         <span className="ml-2">
  //           By default, this AI assistant can help answer all questions about a
  //           coding and IT questions basically, but you can change the prompt to
  //           whatever you want!
  //         </span>
  //       </li>
  //       <li className="text-l hidden">
  //         🎨
  //         <span className="ml-2">
  //           The main frontend logic is found in <code>app/page.tsx</code>.
  //         </span>
  //       </li>
  //       <li className="text-l">
  //         👇
  //         <span className="ml-2">
  //           {/*Try asking e.g. <code>What is the course about?</code> below!*/}
  //           Try asking for example <code>What is NextJs Framework?</code> below!
  //         </span>
  //       </li>
  //     </ul>
  //   </GuideInfoBox>
  // );

  return (
    <ChatWindow
      endpoint={"/api/retrieval_agents"}
      placeholder={"I am chat gpt Ai"}
      emptyStateComponent={<InfoCard />}
    />
  );
};

export default Page;
