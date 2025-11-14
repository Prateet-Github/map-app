import MobileApp from "./MobileApp";
import DesktopApp from "./DesktopApp";

function App() {
  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <div className="md:hidden h-full">
        <MobileApp />
      </div>
      <div className="hidden md:block h-full">
        <DesktopApp />
      </div>
    </div>
  );
}

export default App;
