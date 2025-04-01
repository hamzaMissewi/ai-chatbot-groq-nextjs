import { SiLangchain } from "react-icons/si";
import { GuideInfoBox } from "./guide/GuideInfoBox";

function InfoCard({
  description,
  children,
}: {
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <GuideInfoBox>
      <ul className="flex flex-col">
        <li className="text-lg">
          <span className="ml-2">
            💻 This is a chatbot using{" "}
            <a href="https://js.langchain.com/" target="_blank">
              <SiLangchain className="size-6" />
              LangChain
            </a>{" "}
          </span>
        </li>

        {description && (
          <li className="hidden text-center text-lg md:block">{description}</li>
        )}

        <li>
          💯
          <span className="ml-2">
            By default, this AI assistant can help answer all questions about a
            coding and IT questions basically, but you can change the prompt to
            whatever you want!
          </span>
        </li>
        {/* 🎨 */}
        {/* <span className="ml-2">
                The main frontend logic is found in <code>app/page.tsx</code>.
              </span> */}
        {children}
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
}

export default InfoCard;
