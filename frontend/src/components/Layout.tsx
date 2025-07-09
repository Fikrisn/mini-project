import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 to-white font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          w-64 bg-white/80 border-r shadow-xl flex flex-col p-4
          backdrop-blur-lg rounded-r-xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 h-full
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">📦 Inventory</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-2 flex-1 text-sm font-medium text-gray-700">
          <li>
            <NavLink to="/" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>🏠 Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>👤 Users</NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>📦 Products</NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>📝 Orders</NavLink>
          </li>
          <li>
            <NavLink to="/payments" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>💳 Payments</NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:text-blue-600 hover:bg-blue-100"
              }`
            }>➕ Register</NavLink>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition w-full font-semibold shadow"
        >
          🔒 Logout
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
        <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700 text-xl"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">Admin Panel</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          <div className="max-w-none w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
