import { useEffect, useState } from "react";
import { toast } from "sonner";

// import { Model } from "groq-sdk";

export function useGetGroqModels() {
  const [groqModels, setGroqModels] = useState<
    {
      id: string;
      createdAt: string;
      owned_by: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchGroqModels = async () => {
      try {
        const data = await fetch("/api/get-models", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!data.ok) {
          toast.warning("Failed to query groq models list !");
          // throw new Error("Network response was not ok");
          return;
        }

        const response = (await data.json()) as {
          id: string;
          created: number;
          owned_by: string;
        }[];

        setGroqModels(() =>
          response.map((model) => {
            return {
              ...model,
              createdAt: new Date(model.created).toLocaleDateString(),
            };
          }),
        );
      } catch (error) {
        toast.error("Failed to query groq models list !");
      }
    };
    fetchGroqModels();
  }, []);

  return { groqModels };
}
