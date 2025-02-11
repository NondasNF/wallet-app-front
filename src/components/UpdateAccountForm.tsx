import { useState } from "react";

interface UpdateAccountFormProps {
  userData: any;
}

const UpdateAccountForm = ({ userData }: UpdateAccountFormProps) => {
  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Atualizar nome:", name, "e-mail:", email);
  };

  return (
    <div className="p-8 mb-8">
      <h3 className="text-xl font-semibold mb-4">Alterar Dados de Cadastro</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder={userData?.email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default UpdateAccountForm;
