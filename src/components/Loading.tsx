export function LoadingDots() {
  return (
    <div className="flex h-6 items-center justify-center space-x-2">
      {/*<div className="animate-pulse rounded-full h-8 w-8 bg-[#5E5CE6]" />*/}
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

export function LoadingCircle() {
  return (
    <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
    </div>
  );
}

export function LoadingSpinner({
  width,
  height,
  text,
  spinner = true,
}: {
  text?: string;
  width?: number;
  height?: number;
  spinner?: boolean;
}) {
  if (!text && !spinner) return null;
  return (
    <div className="my-10 flex w-full items-center justify-center space-x-3">
      {spinner ? (
        <div
          className={`animate-spin h-${width || 16} w-${height || 16} rounded-full border-4 border-t-4 border-gray-200 border-b-yellow-500 border-l-red-500 border-r-green-500 border-t-blue-500`}
          style={{
            background:
              "conic-gradient(from 0deg, #3b82f6, #10b981, #eab308, #ef4444, #3b82f6)",
            border: "4px solid transparent",
          }}
        ></div>
      ) : (
        text && (
          <p className={"dark:text-accent_green text-lg font-semibold"}>
            {text || "Loading"}...
          </p>
        )
      )}
      {/*<div className={`h-${width || 34} w-${height || 34} animate-spin rounded-full border-b-2 border-t-2 border-white bg-accent_green-hover`}></div>*/}

      {/* {spinner && (*/}
      {/*  <div*/}
      {/*    className='h-16 w-16 animate-spin-slow rounded-full'*/}
      {/*    style={{*/}
      {/*      background:*/}
      {/*        'conic-gradient(from 0deg, #3b82f6, #10b981, #eab308, #ef4444, #3b82f6)',*/}
      {/*      border: '4px solid transparent'*/}
      {/*    }}*/}
      {/*  ></div>*/}
      {/*)} */}
    </div>
  );
}

export function Loading() {
  // Generate random number between 2 and 6
  const numMessages = Math.floor(Math.random() * 5) + 2;

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      {/* Messages section */}
      <div className="flex h-[calc(100vh-65px)] flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-4xl space-y-8">
            {[...Array(numMessages)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`w-2/3 rounded-2xl p-4 ${
                    i % 2 === 0
                      ? "rounded-br-none bg-blue-600/10"
                      : "rounded-bl-none border border-gray-200 bg-white"
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`h-4 w-[90%] animate-pulse rounded ${i % 2 === 0 ? "bg-white/40" : "bg-gray-200"}`}
                    />
                    <div
                      className={`h-4 w-[75%] animate-pulse rounded ${i % 2 === 0 ? "bg-white/40" : "bg-gray-200"}`}
                    />
                    <div
                      className={`h-4 w-[60%] animate-pulse rounded ${i % 2 === 0 ? "bg-white/40" : "bg-gray-200"}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input section */}
        <div className="border-t bg-white p-4">
          <div className="mx-auto max-w-4xl">
            <div className="h-12 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
