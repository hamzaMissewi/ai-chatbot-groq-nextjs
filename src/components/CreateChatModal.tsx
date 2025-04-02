import { Dialog } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
// import { toast } fom "sonner";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
// import { useCreateChat } from "@/components/convex/useCreateChat";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function CreateChatDialog({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const createChat = useMutation(api.chats.createChat);
  // const { isPending, mutate: createChat } = useCreateChat();
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const { isSignedIn } = useAuth();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleNewChat = useCallback(async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setIsPending(true);
    try {
      const chatId = await createChat({ title });
      if (chatId) {
        setOpenDialog(false);
        // toast.success(`Create new chat successfully with title ${title}`);
        router.push(`/dashboard/chat/${chatId}`);
      }
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className="w-full border border-gray-200/50 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow"
            onClick={() => setOpenDialog((prev) => !prev)}
          >
            <PlusIcon className={"mr-2 h-4 w-4"} />
            New Chat
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-white text-black dark:bg-slate-900 dark:text-white">
        <DialogTitle className="text-center text-xl font-bold tracking-widest">
          Start New Chat
        </DialogTitle>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-black p-2"
          placeholder="Choose chat name. e.g: New chat"
        />
        <DialogFooter className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant={"outline"}
            className="rounded-xl border border-green-600 text-white shadow-md hover:bg-green-600 hover:text-gray-100 hover:shadow-green-600"
            disabled={isPending || title === ""}
            onClick={handleNewChat}
          >
            Confirm
          </Button>
          <Button
            onClick={handleClose}
            variant={"outline"}
            className="rounded-xl border border-red-600 text-white shadow-md hover:bg-red-600 hover:text-gray-100 hover:shadow-red-600"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChatDialog;
