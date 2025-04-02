import { NavigationButtons } from "@/components/NavigationButtons";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TbBrandOpenai } from "react-icons/tb";

function ProfileHeader() {
  const router = useRouter();
  const { user } = useUser();
  // const [userLevel, setUserLevel] = useState<SubscriptionLevel>("free");
  // const { ConfirmDialog: ConfirmGoBack, confirm } = useConfirmDialog({
  //   title: "Are you sure you want to go back ?",
  // });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-blue-800 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-1 items-center gap-5">
          <div
            // shadow-md hover:shadow-gray-800
            className="mr-4 flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-xl hover:border-white/20 md:mr-6"
            onClick={() => router.push("/dashboard")}
          >
            <TbBrandOpenai className={"size-6"} />
            {/*hover:bg-gradient-to-r hover:scale-105 from-red-700 to-red-600 hover:bg-clip-text hover:text-transparent*/}
            {/*<p className="electric-hover hover:electric-effect max-w-[40%] animate-pulse truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:text-red-700 md:text-xl">*/}
            <p className="truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:animate-pulse hover:text-red-700 md:text-xl">
              Hamza AI Assistant
            </p>
            {/* <SiLangchain className={"size-8"} /> */}

            {/* Shining animation layer */}
            {/*<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out hover:animate-shine" />*/}
          </div>

          {/* <Button
            onClick={() => router.push("/dashboard")}
            variant={"outline"}
            className="group relative flex items-center rounded-lg px-1 py-0"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:translate-x-0.5" />
            Go Back
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
          </Button> */}

          <NavigationButtons className={"hidden items-center gap-1 md:flex"} />
        </div>

        <div className="flex items-center justify-end space-x-3">
          {user?.fullName && (
            <div className="hidden flex-col text-left md:flex">
              <p className="text-xs">welcome back:</p>
              <span className="truncate text-sm font-bold">
                {user.fullName}
              </span>
            </div>
          )}

          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/dashboard/user-profile"
            appearance={{
              elements: {
                avatarBox:
                  "h-12 w-12 ring-2 ring-gray-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-gray-300/50",
                userButtonPopoverCard:
                  "bg-white shadow-lg border border-gray-200",
                userButtonPopoverActions: "bg-gray-50",
                userButtonPopoverActionButton: "hover:bg-gray-100",
                userButtonPopoverFooter: "border-t border-gray-200",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
