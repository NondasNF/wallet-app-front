// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { getData, postData } from "@/services/api";

interface WalletData {
  id: number;
  user_id: number;
  balance: string;
  is_active: number;
}

const DashboardPage = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [destinationWalletId, setDestinationWalletId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<string | null>(null); // 'deposit' or 'transfer'

  const router = useRouter();

  useEffect(() => {
    const fetchWalletData = async () => {
      const token = Cookie.get("auth_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await getData("api/user/wallet", {
          Authorization: `Bearer ${token}`,
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar dados da carteira");
        }

        const data = await response[0];
        setWalletData(data);
      } catch (error) {
        console.log(error);
        setError("Erro ao buscar os dados da carteira.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [router]);

  const handleLogout = () => {
    Cookie.remove("auth_token");
    router.push("/login");
  };

  const handleDeposit = async () => {
    const token = Cookie.get("auth_token");

    try {
      const response = await postData(
        "api/user/transation/deposit",
        {
          amount: depositAmount,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao processar o depósito");
      }

      setModalOpen(null);
      alert(`Depósito bem-sucedido! Novo saldo: R$ ${response.balance}`);
      setWalletData(walletData ? { ...walletData, balance: response.balance } : null);
      setDepositAmount("");
    } catch (error) {
      alert("Erro ao tentar fazer depósito.");
    }
  };

  const handleTransfer = async () => {
    const token = Cookie.get("auth_token");

    try {
      const response = await postData(
        "api/user/transation/transfer",
        {
          wallet_id: destinationWalletId,
          amount: transferAmount,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.ok) {
        if (response.message === "User not found") {
          alert("Usuário/Carteira não encontrado(a).");
        } else if (response.message === "Insufficient balance") {
          alert("Saldo insuficiente.");
        } else if (response.message === "Cannot transfer to the same account") {
          alert("Não é possível transferir para a mesma conta.");
        } else {
          alert("Erro ao tentar realizar a transferência.");
        }
        return;
      }

      setModalOpen(null);
      alert(`Transferência bem-sucedida! Novo saldo: R$ ${response.balance}`);
      setWalletData(walletData ? { ...walletData, balance: response.balance } : null);
      setTransferAmount("");
    } catch (error) {
      alert("Erro ao tentar fazer transferência.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
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
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex justify-center items-center flex-grow p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-4">Minha Carteira</h2>

          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : walletData ? (
            <div>
              <p><strong>Endereço:</strong> {walletData.id}</p>
              <p><strong>Saldo:</strong> R${parseFloat(walletData.balance).toFixed(2)}</p>
              <p><strong>Status:</strong> {walletData.is_active ? "Ativo" : "Inativo"}</p>
            </div>
          ) : (
            <p>Nenhum dado encontrado.</p>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setModalOpen("deposit")}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Fazer Depósito
            </button>
            <button
              onClick={() => setModalOpen("transfer")}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${!walletData?.is_active || walletData?.balance == "0.00" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!walletData?.is_active || walletData?.balance == "0.00" }
            >
              Fazer Transferência
            </button>
          </div>
        </div>
      </div>
      {modalOpen === "deposit" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Fazer Depósito</h3>
            <div>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Valor"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
              <p className="mb-4 text-gray-500">A ferramenta de depósito real ainda precisa ser implementada.</p>
              <button
                onClick={handleDeposit}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Confirmar Depósito
              </button>
              <button
                onClick={() => setModalOpen(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen === "transfer" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-90">
            <h3 className="text-lg font-bold mb-4">Fazer Transferência</h3>
            <div>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Quantidade"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={destinationWalletId}
                onChange={(e) => setDestinationWalletId(e.target.value)}
                placeholder="ID da carteira destino"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleTransfer}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Confirmar Transferência
              </button>
              <button
                onClick={() => setModalOpen(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
