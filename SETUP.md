# 🚀 Setup Guide - Mantis React TypeScript

## 📋 Prerequisites

- Node.js >= 18.x
- Yarn >= 4.x (recommended) or npm

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd seed
```

2. **Install dependencies**

```bash
yarn install
```

3. **Create environment file**

```bash
# Create .env file from example
cp .env.example .env
```

4. **Configure environment variables**
   Edit `.env` file with your settings:

```env
VITE_APP_API_URL=http://localhost:3010/
VITE_APP_BASE_NAME=/
NODE_ENV=development
```

## 🏃 Running the Application

### Development Mode

```bash
yarn start
# or
yarn dev
```

Application will run on `http://localhost:3000`

### Build for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## 🧪 Code Quality

### Linting

```bash
# Check for linting errors
yarn lint

# Fix linting errors automatically
yarn lint:fix
```

### Formatting

```bash
# Format all files
yarn format

# Check formatting without modifying files
yarn prettier:check
```

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically:

- Run ESLint on staged `.ts/.tsx/.js/.jsx` files
- Format code with Prettier
- Prevent commits with linting errors

Pre-commit hooks run automatically when you commit. To bypass (not recommended):

```bash
git commit --no-verify
```

## 📁 Project Structure

```
seed/
├── .husky/              # Git hooks configuration
├── .vscode/             # VSCode settings and extensions
├── dist/                # Production build output
├── src/
│   ├── api/            # API services and endpoints
│   ├── assets/         # Static assets (images, styles)
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   ├── routes/         # Route configurations
│   ├── themes/         # Theme configuration
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .eslintignore       # ESLint ignore patterns
├── .eslintrc.mjs       # ESLint configuration
├── .gitignore          # Git ignore patterns
├── .prettierignore     # Prettier ignore patterns
├── .prettierrc.json    # Prettier configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── vite.config.mts     # Vite configuration
```

## 🔐 Environment Variables

| Variable             | Description           | Default                  |
| -------------------- | --------------------- | ------------------------ |
| `VITE_APP_API_URL`   | Backend API URL       | `http://localhost:3010/` |
| `VITE_APP_BASE_NAME` | Application base path | `/`                      |
| `NODE_ENV`           | Environment mode      | `development`            |

## 🛠️ Development Tools

### VSCode Extensions (Recommended)

Install recommended extensions when prompted, or manually:

- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense
- ES7+ React/Redux/React-Native snippets

### Commands

| Command               | Description               |
| --------------------- | ------------------------- |
| `yarn start`          | Start development server  |
| `yarn build`          | Build for production      |
| `yarn preview`        | Preview production build  |
| `yarn lint`           | Run ESLint                |
| `yarn lint:fix`       | Fix ESLint errors         |
| `yarn format`         | Format code with Prettier |
| `yarn prettier:check` | Check code formatting     |

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or change port in vite.config.mts
```

### ESLint/Prettier conflicts

```bash
# Clear ESLint cache
rm -rf node_modules/.cache/eslint

# Reinstall dependencies
yarn install
```

### Husky hooks not working

```bash
# Reinstall Husky
yarn husky install
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Commit (pre-commit hooks will run)
5. Push and create a Pull Request

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Material-UI Documentation](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
