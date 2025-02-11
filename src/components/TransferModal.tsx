// components/TransferModal.tsx
interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferAmount: string;
  setTransferAmount: (value: string) => void;
  destinationWalletId: string;
  setDestinationWalletId: (value: string) => void;
  handleTransfer: () => void;
}

const TransferModal = ({
  isOpen,
  onClose,
  transferAmount,
  setTransferAmount,
  destinationWalletId,
  setDestinationWalletId,
  handleTransfer,
}: TransferModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-90">
        <h3 className="text-lg font-bold mb-4">Fazer Transferência</h3>
        <div>
          <label className="block text-gray-700">Valor:</label>
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Quantidade"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <label className="block text-gray-700">ID da carteira destino:</label>
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
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
