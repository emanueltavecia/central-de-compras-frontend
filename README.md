# 🛒 Central de Compras - Frontend

> MVP frontend for a Purchasing Center developed for academic purposes.

## 📋 About the Project

This is the frontend of a Purchasing Center platform, developed for the interdisciplinary project of the 4th phase of the Computer Science course at UNESC. Built with Next.js 16 and the App Router, this modern web application provides a complete interface to manage organizations, users, products, campaigns, orders, cashback, and much more.

## 👥 Authors

- Emanuel Cardoso Tavecia
- Guilherme Conti Machado
- Gabriel Alves Teixeira
- Caio Vinícius Guimarães de Oliveira Dagostim

## 🔗 Project Links

- 🚀 [**Front-end Deploy**](https://central-de-compras-frontend.vercel.app/)
- 🔙 [**Back-end Repository**](https://github.com/emanueltavecia/central-de-compras-backend)

## ✨ Features

- **Dashboard**: Overview with statistics and charts
- **Organizations Management**: Manage stores and suppliers
- **Products Catalog**: Full product management with categories
- **Orders System**: Create, track, and manage purchase orders
- **Campaigns**: Marketing and promotional campaigns management
- **Cashback Program**: Transaction tracking and cashback management
- **Payment Conditions**: Configure payment terms and conditions
- **Supplier State Conditions**: Manage supplier-specific conditions by state
- **User Profile**: Profile management and settings

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: Mantine v8
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Icons**: Tabler Icons + Lucide React
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication routes (login)
│   └── (private-routes)/   # Protected routes
│       ├── dashboard/
│       ├── campaigns/
│       ├── cashback/
│       ├── categories/
│       ├── orders/
│       ├── organizations/
│       ├── payment-conditions/
│       ├── products/
│       ├── profile/
│       └── supplier-state-conditions/
├── components/             # Reusable UI components
├── lib/                    # Business logic and data fetching
├── sdk/                    # API SDK and types
├── types/                  # TypeScript type definitions
└── utils/                  # Utilities, constants, and schemas
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/emanueltavecia/central-de-compras-frontend.git
   cd central-de-compras-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start development server             |
| `pnpm build` | Build for production                 |
| `pnpm start` | Start production server              |
| `pnpm lint`  | Run Prettier and ESLint with autofix |

## 👤 Default Users

The seed script creates the following users for testing:

| Role     | Email                            | Password  | Description                     |
| -------- | -------------------------------- | --------- | ------------------------------- |
| Admin    | admin@centralcompras.com         | Admin@123 | Purchasing Center Administrator |
| Store    | loja@lojaexemplo.com             | Admin@123 | Store User                      |
| Supplier | fornecedor@fornecedorexemplo.com | Admin@123 | Supplier User                   |

### User Permissions

- **Admin**: Full system access - manages users, organizations, products, orders, campaigns, and all settings
- **Store**: Can view suppliers, create orders, and view their orders
- **Supplier**: Can manage products, view and manage orders, manage campaigns, and configure commercial conditions

## 🎨 Design System

The project uses a custom color palette defined with CSS variables:

| Variable          | Color   | Usage                  |
| ----------------- | ------- | ---------------------- |
| `--primary`       | #1976d2 | Primary actions        |
| `--primary-light` | #42a5f5 | Hover states           |
| `--primary-dark`  | #1565c0 | Active states          |
| `--secondary`     | #dc004e | Secondary actions      |
| `--success`       | #4caf50 | Success states         |
| `--warning`       | #ff9800 | Warning states         |
| `--error`         | #f44336 | Error states           |
| `--info`          | #2196f3 | Informational elements |

## 📄 License

This project is licensed under the terms specified in [LICENSE.md](LICENSE.md).
