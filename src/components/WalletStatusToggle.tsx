interface WalletStatusToggleProps {
  walletStatus: number | null;
  toggleWalletStatus: () => void;
}

const WalletStatusToggle = ({ walletStatus, toggleWalletStatus }: WalletStatusToggleProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center items-center">
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-4">Status da Carteira</h3>
        <p>Status atual: {walletStatus === 1 ? "Ativo" : "Inativo"}</p>
      </div>
      <button
        onClick={toggleWalletStatus}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mt-4"
      >
        {walletStatus === 1 ? "Desativar Carteira" : "Ativar Carteira"}
      </button>
    </div>
  );
};

export default WalletStatusToggle;
