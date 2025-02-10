// components/DepositModal.tsx
interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: string;
  setDepositAmount: (value: string) => void;
  handleDeposit: () => void;
}

const DepositModal = ({
  isOpen,
  onClose,
  depositAmount,
  setDepositAmount,
  handleDeposit,
}: DepositModalProps) => {
  if (!isOpen) return null;

  return (
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

export default DepositModal;
