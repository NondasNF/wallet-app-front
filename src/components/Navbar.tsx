import { useRouter } from "next/router";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const router = useRouter();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="text-xl">Dashboard</div>
      <div>
        <button
          onClick={() => router.push("/account")}
          className="bg-blue-500 px-4 py-2 rounded-md mr-4 hover:bg-blue-700"
        >
          Minha Conta
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
