import { useState, useEffect, useRef, useMemo } from "react";

export const CatchTheRate = () => {
  const rates = useMemo(
    () => [
      0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0,
    ],
    []
  );

  const [currentRateIndex, setCurrentRateIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highestCaughtRate, setHighestCaughtRate] = useState<number | null>(
    parseFloat(localStorage.getItem("highestCaughtRate") || "0")
  );
  const intervalRef = useRef<number | null>(null);

  // Save highest caught rate to localStorage whenever it changes
  useEffect(() => {
    if (highestCaughtRate !== null) {
      localStorage.setItem("highestCaughtRate", highestCaughtRate.toString());
    }
  }, [highestCaughtRate]);

  // Start the rate cycling with random selection
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setCurrentRateIndex((prev) =>
          prev >= rates.length - 1 ? 0 : prev + 1
        );
      }, 90); // Change rate every 100ms - adjust for speed
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, rates.length]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isRunning) {
        setIsRunning(false);
        const caughtRate = rates[currentRateIndex];
        setSelectedRate(caughtRate);
        setSelectedIndex(currentRateIndex);

        // Update highest caught rate
        if (highestCaughtRate === null || caughtRate > highestCaughtRate) {
          setHighestCaughtRate(caughtRate);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRunning, currentRateIndex, rates, highestCaughtRate]);

  // Reset the game
  const handleReset = () => {
    setIsRunning(true);
    setSelectedRate(null);
    setSelectedIndex(null);
    setCurrentRateIndex(0);
  };

  return (
    <div className="w-full max-w-6xl h-full flex items-center justify-center gap-8">
      {/* Main display area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold mb-8">Catch The Rate</h1>

        {/* Current rate display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-16 mb-8 border-4 border-white/20 shadow-2xl">
          <div className="text-center">
            <p className="text-white/70 text-xl mb-4">
              {isRunning ? "Press ENTER to catch!" : "Rate Caught!"}
            </p>
            <div className="text-9xl font-bold text-white tabular-nums">
              $ {rates[currentRateIndex].toFixed(1)}
            </div>
          </div>
        </div>

        {/* Result display */}
        {selectedRate !== null && (
          <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-6 border-2 border-green-400 mb-4 animate-pulse">
            <p className="text-green-300 text-2xl font-semibold text-center">
              You caught: {selectedRate.toFixed(1)}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning && (
            <button
              onClick={handleReset}
              className="bg-white hover:bg-gray-100 text-purple-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          )}
        </div>

        <p className="text-white/50 text-sm mt-8">
          {isRunning
            ? "⌨️ Press ENTER to stop at the highest rate!"
            : "🎯 Great catch!"}
        </p>
      </div>

      {/* Rates list on the right */}
      <div className="w-fit bg-white/10 backdrop-blur-lg rounded-3xl p-4 border-2 border-white/20 shadow-2xl fixed right-10 top-10">
        {/* Highest Caught Rate */}
        {highestCaughtRate !== null && (
          <div className="mb-6 pb-6 border-b border-white/20">
            <div className="text-center">
              <p className="text-white/80 mb-4">🏆 Highest Caught</p>
              <p className="text-yellow-400 text-5xl font-bold tabular-nums">
                $ {highestCaughtRate.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-1">
          {rates.map((rate, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl transition-all duration-300 border-2 border-transparent ${
                selectedIndex === index
                  ? "bg-green-500 shadow-lg border-2 border-green-300"
                  : currentRateIndex === index && isRunning
                  ? "bg-white/50"
                  : "bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center justify-between gap-2">
                <span
                  className={`text-2xl font-bold tabular-nums ${
                    selectedIndex === index ? "text-white" : "text-white/90"
                  }`}
                >
                  $ {rate.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
