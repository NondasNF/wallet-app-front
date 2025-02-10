interface WalletData {
  id: number;
  balance: string;
  is_active: number;
}

interface WalletProps {
  walletData: WalletData | null;
  loading: boolean;
  error: string | null;
}

const Wallet = ({ walletData, loading, error }: WalletProps) => {
  return (
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
    </div>
  );
};

export default Wallet;
