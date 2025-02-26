import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postData } from "@/services/api";
import Cookie from "js-cookie";
import '../styles/globals.css';

interface LoginData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get("auth_token");
      if (token) {
        router.push("/dashboard");
        return;
      }
    }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData("api/login", formData);

      if (!response.ok) {
        throw new Error("Falha na autenticação");
      }
      
      Cookie.set("auth_token", response.token);
      router.push("/dashboard");
    } catch (error) {
      if (error === "Não autorizado") {
        setError("E-mail ou senha incorretos");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Não tem uma conta?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Crie uma aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
