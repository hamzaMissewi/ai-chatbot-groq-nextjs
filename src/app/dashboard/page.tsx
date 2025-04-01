"use client";
import { ArrowLeft, ArrowRight, BotIcon } from "lucide-react";
import CreateChatDialog from "@/components/CreateChatModal";
import { useState } from "react";
// import { api } from "@/convex/_generated/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useGetGroqModels } from "@/components/hooks/useGetGroqModels";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirmDialog } from "@/components/hooks/useConfirmDialog";
import { useRouter } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/nextjs";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { toast } from "sonner";
import { useCreateChat } from "@/components/convex/useCreateChat";

const DashboardPage = () => {
  const [openModels, setOpenModels] = useState(false);
  const { groqModels } = useGetGroqModels();
  const router = useRouter();
  const userLevel = useSubscriptionStatus();
  // const [userLevel, setUserLevel] = useState<SubscriptionLevel>("free");
  const { ConfirmDialog, confirm } = useConfirmDialog({
    title: "Are you sure you want to go back ?",
  });

  const { userId } = useAuth();
  const { mutate: createChat } = useCreateChat();
  const [openDialog, setOpenDialog] = useState(false);

  const handleNewChat = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    const chatId = await createChat({ title: "new chat" });
    if (chatId) {
      // toast.success(`Create new chat successfully with title ${title}`);
      router.push(`/dashboard/chat/${chatId}`);
    }
  };

  // Check if user is on free tier (no subscription or basic plan)

  // useEffect(() => {
  //   async function checkUserSubs() {
  //     if (!userId) return;
  //     const subs = await getUserSubscriptionLevel(userId);
  //     setUserLevel(subs);
  //   }

  //   checkUserSubs();
  // }, [userId]);

  // if (groqModels.length === 0) {
  //   toast.warning("Found no ai models");
  // }

  return (
    <>
      <ConfirmDialog />
      <div className="flex h-full flex-1 items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          {/* Decorative elements */}
          {/* <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-gray-100 to-gray-50/50"></div> */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="relative space-y-8 bg-white/40 p-8 text-center md:mb-20">
            <div className="space-y-4 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm">
              <div className="inline-flex rounded-xl bg-gradient-to-b from-gray-50 to-white p-4">
                <BotIcon className="h-12 w-12 text-gray-600" />
              </div>
              <h2 className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold text-transparent">
                Welcome to the AI Agent Chat
              </h2>
              <p className="mx-auto max-w-md text-gray-600">
                Start a new conversation or select an existing chat from your
                previous list in the sidebar. Your AI assistant is ready to help
                you with any task.
              </p>
              <div className="flex justify-center gap-4 pt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5 hover:text-gray-800">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Real-time responses
                </div>
                <div className="flex items-center gap-1.5 hover:text-gray-800">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Smart assistance
                </div>
                <div className="flex items-center gap-1.5 hover:text-gray-800">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  Powerful tools
                </div>
              </div>

              {/* <ClerkProvider> */}
              <SignedOut>
                <div className="flex items-center justify-center">
                  <SignInButton mode="redirect" />
                  <SignUpButton mode="redirect" />
                </div>
              </SignedOut>

              <SignedIn>
                {/* <CreateChatDialog> */}
                <button
                  className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gray-900 to-gray-800 p-0 px-6 py-2 text-base font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl"
                  onClick={handleNewChat}
                >
                  New chat
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                </button>
                {/* </CreateChatDialog> */}
              </SignedIn>
            </div>

            {/*  SHEET SHOW LIST OF MODELS*/}

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={async () => {
                  const ok = await confirm();
                  if (!ok) return;
                  router.push("/");
                }}
                className="group relative inline-flex items-center rounded-lg"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:translate-x-0.5" />
                Go Back
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              </Button>

              {/* Only show upgrade button for free tier users */}

              <SignedIn>
                {userLevel !== "pro_plus" && (
                  <Button
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400"
                    onClick={() => router.push("/pricing")}
                  >
                    {userLevel === "free"
                      ? "Upgrade to Pro/Pro+"
                      : "Upgrade to Pro+"}
                  </Button>
                )}
              </SignedIn>

              {/* Show current plan status if subscribed */}
              {/* {userLevel !== "free" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Current plan:
                    <span className="ml-1 font-medium text-indigo-600">
                      {userLevel === "pro_plus" ? "Pro+" : "Pro"}
                    </span>
                  </span>
                </div>
              )} */}

              <Sheet
                open={openModels}
                onOpenChange={setOpenModels}
                key={"right"}
              >
                <SheetTrigger asChild>
                  <Button variant="outline">Show Models</Button>
                </SheetTrigger>
                <SheetContent
                  side={"right"}
                  className={"w-full overflow-y-auto bg-[#1C1C1E] text-white"}
                >
                  <SheetHeader>
                    <SheetTitle className={"text-[#00ff99]"}>
                      LLM Models
                    </SheetTitle>
                    <SheetDescription className="text-foreground-muted">
                      These are the list of available LLM models
                    </SheetDescription>
                  </SheetHeader>
                  {/*<div className="grid grid-cols-2 gap-2 py-4">*/}
                  <div className="flex w-full flex-col flex-wrap items-start justify-between py-4">
                    {/*<Label htmlFor="name" className="text-right">*/}
                    {groqModels.map((model) => (
                      <ScrollArea key={model.id} className={"w-full"}>
                        <div
                        // onClick={() => router.push(`/dashboard/chat/${chatId}`)}
                        >
                          Id:{" "}
                          <span className={"text-[#00ff99]"}>{model.id}</span>
                        </div>
                        {/*<div>Object: {model.object}</div>*/}
                        <div className={"truncate"}>
                          Owned by:{" "}
                          <span className={"text-[#ff0099]"}>
                            {model.owned_by}
                          </span>
                        </div>
                        <div>Created: {model.createdAt}</div>

                        <Separator className={"my-2 w-full bg-green-700"} />
                      </ScrollArea>
                    ))}
                  </div>
                  {/*<SheetFooter>*/}
                  {/*  <SheetClose asChild>*/}
                  {/*    <Button onClick={() => setOpenModels(false)}>Close</Button>*/}
                  {/*  </SheetClose>*/}
                  {/*</SheetFooter>*/}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
