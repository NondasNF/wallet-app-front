// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Navbar from "@/components/Navbar";
import Wallet from "@/components/Wallet";
import DepositModal from "@/components/DepositModal";
import TransferModal from "@/components/TransferModal";
import TransactionHistory from "@/components/TransactionHistory";
import { getData, postData } from "@/services/api";

interface WalletData {
  id: number;
  user_id: number;
  balance: number;
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
        "api/user/transaction/deposit",
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
      setWalletData(walletData ? { ...walletData, balance: parseFloat(response.balance) } : null);
      setDepositAmount("");
    } catch (error) {
      alert("Erro ao tentar fazer depósito.");
    }
  };

  const handleTransfer = async () => {
    const token = Cookie.get("auth_token");

    try {
      const response = await postData(
        "api/user/transaction/transfer",
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
      <Navbar onLogout={handleLogout} />
      <div className="flex flex-col justify-center items-center flex-grow p-8">
        <Wallet walletData={walletData} loading={loading} error={error} />
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setModalOpen("deposit")}
            className={`bg-green-500 text-white px-4 py-2 rounded-md ${!walletData?.is_active ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-600'}`}
            disabled={!walletData?.is_active}
          >
            Fazer Depósito
          </button>
              <button
              onClick={() => setModalOpen("transfer")}
              className={`px-4 py-2 rounded-md text-white ${!walletData?.is_active || walletData?.balance <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={!walletData?.is_active || walletData?.balance <= 0}
              >
              Fazer Transferência
              </button>
        </div>
        <TransactionHistory initialPage={1} currentUserId={walletData?.user_id ?? 0} />
      </div>

      <DepositModal
        isOpen={modalOpen === "deposit"}
        onClose={() => setModalOpen(null)}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        handleDeposit={handleDeposit}
      />
      
      <TransferModal
        isOpen={modalOpen === "transfer"}
        onClose={() => setModalOpen(null)}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        destinationWalletId={destinationWalletId}
        setDestinationWalletId={setDestinationWalletId}
        handleTransfer={handleTransfer}
      />
    </div>
  );
};

export default DashboardPage;
