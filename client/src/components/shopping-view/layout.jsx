import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div>
    {/* Sticky header with shadow */}
    <header className="sticky top-0 z-50 shadow-2xl w-full bg-white">
        <ShoppingHeader />
      </header>
      <main className="flex flex-col w-full z-10">
        <Outlet />
      </main>
  </div>
  );
}

export default ShoppingLayout;
