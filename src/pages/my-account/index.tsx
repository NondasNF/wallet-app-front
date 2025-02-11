import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import DeviceList from "@/components/DeviceList";
import WalletStatusToggle from "@/components/WalletStatusToggle";
import { getData, putData } from "@/services/api";

const AccountPage = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<number>(0);
  const router = useRouter();

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
        setUserData(response?.user);

        const devicesResponse = await getData("api/user/logged-devices", {
          Authorization: `Bearer ${token}`,
        });

        if (!devicesResponse.ok || !devicesResponse.devices) {
          throw new Error("Falha ao carregar dispositivos logados");
        }

        setDevices(devicesResponse?.devices);

        const walletResponse = await getData("api/user/wallet", {
          Authorization: `Bearer ${token}`,
        });

        if (!walletResponse.ok) {
          throw new Error("Falha ao carregar status da carteira");
        }

        setWalletStatus(walletResponse.ok);
      } catch (error) {
        setError("Erro ao buscar os dados.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleWalletStatusChange = async () => {
    const token = Cookie.get("auth_token");
    try {
      const response = await putData(
        "api/user/wallet",
        { status: newStatus },
        { Authorization: `Bearer ${token}` }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da carteira");
      }

      setWalletStatus(newStatus);
      alert("Status da carteira atualizado com sucesso.");
      setModalOpen(false);
    } catch (error) {
      alert("Erro ao atualizar status da carteira.");
      console.error(error);
    }
  };

  const toggleWalletStatus = () => {
    setNewStatus(walletStatus === 1 ? 0 : 1);
    setModalOpen(true);
  };

  const handleLogout = () => {
    Cookie.remove("auth_token");
    router.push("/login");
  };

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
      <div className="p-6">
      <div className="w-full">
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4 mb-6"
          >&laquo; Voltar</button>
        </div>
        <DeviceList devices={devices} loading={loading} error={error} />
        {userData && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center items-center">
            <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Informações do Usuário</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Nome:</label>
              <p className="text-gray-900">{userData.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
          </div>
          <button
                onClick={ () => router.push("/my-account/update") }
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
            Atualizar Dados
          </button>
          </div>
        )}
  
        <WalletStatusToggle
          walletStatus={walletStatus}
          toggleWalletStatus={toggleWalletStatus}
        />
      </div>
  
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">
              {newStatus === 1 ? "Ativar" : "Desativar"} a Carteira
            </h3>
            <p>
              Tem certeza de que deseja {newStatus === 1 ? "ativar" : "desativar"} a
              sua carteira? Essa ação pode afetar seus serviços.
            </p>
            <button
              onClick={handleWalletStatusChange}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
            >
              Confirmar
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4 mt-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
