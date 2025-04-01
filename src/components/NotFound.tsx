"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  const handleNavigation = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
    // console.error('Navigation error:', error)
  };

  return (
    // from-gray-100 from-gray-50 via-gray-200 to-gray-100 to-violet-300
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4 text-black text-white">
      <div className="flex flex-col justify-center space-y-10 text-center">
        {/* <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1> */}
        {/* <p className="mb-8 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p> */}
        {/* <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Page Not Found
          </h2> */}

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white md:text-9xl"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/30 blur-2xl" />
          <Image
            src="https://cdn-icons-png.flaticon.com/512/755/755014.png"
            alt="404 Illustration"
            width={200}
            height={200}
            className="relative z-10 mx-auto transition-transform duration-300 hover:rotate-12"
          />
        </motion.div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          // text-red-800
          className="text-accent_green-hover mb-8 text-xl"
        >
          The page you're looking for doesn't exist or has been moved.
          {/* Oops! There&apos;s something wrong happened. */}
        </motion.p>

        {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="animate-float space-x-4">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-400" />
              <span className="animation-delay-150 inline-block h-3 w-3 rounded-full bg-purple-400" />
              <span className="animation-delay-300 inline-block h-3 w-3 rounded-full bg-purple-400" />
            </div>
          </motion.div> */}

        {/* <Button
            variant={"ghost"}
            size={"lg"}
            onClick={handleNavigation}
            className="inline-block rounded-full bg-white text-lg font-semibold text-purple-900 shadow-lg transition-colors duration-300 hover:bg-purple-100 hover:shadow-xl active:scale-95"
          >
            Go Back!
          </Button> */}

        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-500">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
