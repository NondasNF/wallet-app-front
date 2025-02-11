import { useEffect, useState } from "react";
import { getData, putData } from "@/services/api";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

interface Transaction {
  id: number;
  from_user_id: number;
  to_user_id: number;
  amount: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface TransactionHistoryProps {
  initialPage: number;
  currentUserId: number;
}

const TransactionHistory = ({ initialPage, currentUserId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async (page: number) => {
      try {
        setLoading(true);
        const token = Cookie.get("auth_token");
        const response = await getData(`api/user/transaction/history?page=${page}`, {
          Authorization: `Bearer ${token}`,
        });

        if (!response.data) {
          throw new Error("Erro ao carregar transações");
        }

        setTransactions(response.data);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          next_page_url: response.next_page_url,
          prev_page_url: response.prev_page_url,
        });
      } catch (error) {
        setError("Erro ao carregar transações");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancelTransaction = async (transactionId: number) => {
    try {
      const token = Cookie.get("auth_token");
      const response = await putData(`api/user/transaction/cancel/${transactionId}`,{},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cancelar transação");
      }

      router.reload();
    } catch (error) {
      console.error(error);
    }
  }

  const getTypeFormatted = (type: string) => {
    switch (type) {
      case "deposit":
        return "Depósito";
      case "transfer":
        return "Transferência";
      case "cancelled":
        return "Estornado";
      default:
        return "Desconhecido";
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mt-8 mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Histórico de Transações</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">De</th>
                <th className="border p-2">Para</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Data</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border p-2">{transaction.id}</td>
                  <td className="border p-2">{transaction.from_user_id}</td>
                  <td className="border p-2">{transaction.type === "deposit" ? "-" : transaction.to_user_id}</td>
                  <td className="border p-2">{transaction.amount}</td>
                  <td className="border p-2">{getTypeFormatted(transaction.type)}</td>
                  <td className="border p-2">{new Date(transaction.created_at).toLocaleString()}</td>
                  <td className="border p-2">
                    {transaction.type === "transfer" && (
                      <button className="text-red-500 underline"
                        onClick={() => handleCancelTransaction(transaction.id)}
                      >
                        {transaction.to_user_id === currentUserId ? "Estornar" : "Cancelar"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={!pagination.prev_page_url}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                  !pagination.prev_page_url ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                &laquo; Anterior
              </button>
              <div className="text-sm">
                Página {pagination.current_page} de {pagination.last_page}
              </div>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={!pagination.next_page_url}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                  !pagination.next_page_url ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Próximo &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
