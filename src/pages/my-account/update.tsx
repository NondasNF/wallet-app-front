import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getData } from "@/services/api";
import UpdateAccountForm from "@/components/UpdateAccountForm";
import Cookie from "js-cookie";

function UpdatePage () {
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const handleLogout = () => {
    Cookie.remove("auth_token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookie.get("auth_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await getData("api/user", {
          Authorization: `Bearer ${token}`,
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do usuário");
        }
        setUserData(response);

      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <div className="text-xl">Minha Conta</div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="flex flex-col items-center flex-grow p-8">
        <div className="w-full">
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
          >&laquo; Voltar</button>
        </div>
        <UpdateAccountForm userData={userData} />
      </div>
    </div>
  )
}

export default UpdatePage;
