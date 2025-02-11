# Frontend - Carteira Financeira

## 📌 Descrição
Este projeto é o frontend de uma aplicação de **Carteira Financeira**, desenvolvido em **Next.js** e **Tailwind CSS**. Ele permite que usuários realizem login, cadastrem-se, façam depósitos, transfiram saldo e visualizem suas transações.

---

## 🚀 Tecnologias Utilizadas
- **Next.js** (React)
- **Tailwind CSS** (Estilização)
- **React Query** (Gerenciamento de estado assíncrono)
- **Fetch API** (Consumo da API)
- **JWT** (Autenticação com Bearer Token)

---

## 📂 Estrutura do Projeto
```
frontend/
│── public/
│── src/
│   ├── components/...
│   ├── pages/
│   │   ├── my-account/index.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── dashboard.tsx
│   ├── services/
│   ├── utils/
│── .env.local
│── package.json
│── tailwind.config.js
│── README.md
```

---

## 🔧 Instalação e Configuração
### **1. Clone o repositório**
```bash
git clone https://github.com/NondasNF/wallet-app-front.git
cd wallet-app-front
```

### **2. Instalar dependências**
```bash
npm install
```

### **3. Configurar variáveis de ambiente**
Crie um arquivo `.env.local` e adicione:
```
WALLET_APP_URL=http://localhost:7000/api
```

### **4. Rodar o servidor de desenvolvimento**
```bash
npm run dev
```

O projeto será iniciado em **http://localhost:3000**

---

## 🔑 Autenticação
A aplicação utiliza **JWT (Bearer Token)**. O token é armazenado em **cookie** e adicionado automaticamente às requisições protegidas.

---

## 📌 Funcionalidades
### **Registro de Usuário**
- Rota: `/register`
- Envia os dados para a API e recebe um token de autenticação.

### **Login de Usuário**
- Rota: `/login`
- Após autenticação bem-sucedida, o token é salvo no localStorage.

### **Dashboard**
- Rota: `/dashboard`
- Exibe saldo e ações rápidas para depósito e transferência.

### **Minha Conta**
- Rota: `/my-account`
- Exibe informações do usuário e possibilidade de desativar a carteira.

---

## 📦 Build e Deploy
### **Gerar build otimizada**
```bash
npm run build
```

### **Executar a versão otimizada**
```bash
npm run start
```

---

## 📬 Contato
Caso tenha dúvidas ou sugestões, entre em contato via [seuemail@example.com](mailto:seuemail@example.com).

