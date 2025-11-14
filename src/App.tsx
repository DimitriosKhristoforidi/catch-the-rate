import { CatchTheRate } from "./CatchTheRate";
import LoadconnectLogo from "./assets/logo/loadconnect.svg?react";
import TMSLogo from "./assets/logo/tms.svg?react";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-800 to-blue-500 flex flex-col gap-40 items-center">
      <header className="flex justify-center items-center gap-10 text-white">
        <LoadconnectLogo />
        <span className="text-2xl font-thin">|</span>
        <TMSLogo height={200} width={200} />
      </header>
      <CatchTheRate />
    </div>
  );
};

export default App;
