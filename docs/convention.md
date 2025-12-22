# 📁 Project Structure Convention

```
features/
└── users/                          # Feature: User Management
    ├── api/                        # 📡 API Layer
    │   ├── users.api.ts            # HTTP calls (GET, POST, PUT, DELETE)
    │   ├── users.dto.ts           # DTO ↔ Domain mapping
    │   ├── users.errors.ts         # map API error → domain error
    │   └── index.ts
    │
    ├── pages/                      # 🎨 UI Layer - Pages
    │   ├── UserListPage.tsx
    │   ├── UserCreatePage.tsx
    │   ├── UserViewPage.tsx
    │   └── UserEditPage.tsx
    │
    ├── components/                 # 🎨 UI Layer - Components
    │   ├── UserForm/
    │   │   ├── UserForm.tsx
    │   │   ├── UserForm.schema.ts  # Zod / Yup schema (FORM validation)
    │   │   ├── UserForm.types.ts
    │   │   ├── UserForm.messages.ts # i18n / error messages
    │   │   └── index.ts
    │   ├── UserTable/
    │   │   ├── UserTable.tsx
    │   │   ├── UserTable.types.ts
    │   │   └── index.ts
    │   └── UserCard/
    │       ├── UserCard.tsx
    │       └── index.ts
    │
    ├── hooks/                      # 🎣 Hooks Layer
    │   ├── useUsersQuery.ts        # React Query: list users
    │   ├── useUserQuery.ts         # React Query: single user
    │   ├── useUserMutations.ts     # React Query: create/update/delete
    │   └── useUserForm.ts          # form orchestration (combines validation + mutations)
    │
    ├── validation/                 # 🔥 Validation Layer (Domain-level)
    │   ├── user.schema.ts          # domain-level validation (Zod/Yup)
    │   ├── user.rules.ts           # business rules validation
    │   └── user.messages.ts        # validation error messages (i18n)
    │
    ├── services/                   # 🏗️ Services Layer (Business Logic)
    │   ├── user.service.ts         # business logic, data transformation
    │   ├── user-cache.service.ts   # cache management
    │   └── user-filter.service.ts  # filtering logic
    │
    ├── stores/                     # 📦 Feature-scoped State Management
    │   └── user.store.ts           # ✅ OK: Feature-specific state
    │   # OR
    │   # context/
    │   #   ├── UserContext.tsx
    │   #   └── UserProvider.tsx
    │
    ├── types/                      # 📝 Types & Interfaces
    │   ├── user.ts                 # domain types
    │   ├── user-errors.ts          # error types
    │   └── user-api.types.ts       # API response types
    │
    ├── utils/                      # 🛠️ Utilities
    │   ├── mapUserStatus.ts
    │   ├── buildUserFilter.ts
    │   └── formatUserData.ts
    │
    ├── __tests__/                  # 🧪 Tests (optional but recommended)
    │   ├── UserForm.test.tsx
    │   ├── user.service.test.ts
    │   └── user.schema.test.ts
    │
    ├── constants.ts                # 📋 Feature constants
    ├── routes.tsx                  # 📋 Feature routes
    └── index.ts                    # 📋 Public exports

# 📚 Shared / Common (outside features/)
shared/
├── components/                     # truly reusable components
├── hooks/                         # shared hooks
├── utils/                         # shared utilities
├── types/                         # shared types
├── constants/                     # shared constants
├── api/                           # shared API config
├── validation/                    # shared validation schemas
└── stores/                        # 🌐 Cross-feature State Management
    ├── app.store.ts               # Global app state (theme, auth, etc.)
    ├── ui.store.ts                # Global UI state (modals, notifications)
    └── index.ts
```

## 📋 Layer Descriptions

### 📡 API Layer (`api/`)

- **Purpose**: HTTP communication with backend
- **Files**:
  - `*.api.ts`: API endpoints (GET, POST, PUT, DELETE)
  - `*.dto.ts`: Data Transfer Objects (API ↔ Domain mapping)
  - `*.errors.ts`: API error handling and mapping

### 🎨 UI Layer (`pages/`, `components/`)

- **Purpose**: User interface components
- **Pages**: Full page components (routes)
- **Components**: Reusable UI components with their own:
  - `*.schema.ts`: Form validation schemas
  - `*.types.ts`: Component-specific types
  - `*.messages.ts`: i18n messages

### 🎣 Hooks Layer (`hooks/`)

- **Purpose**: React hooks for data fetching and mutations
- **Pattern**: React Query hooks
  - `use*Query.ts`: Data fetching (GET)
  - `use*Mutations.ts`: Data mutations (POST, PUT, DELETE)
  - `use*Form.ts`: Form orchestration

### 🔥 Validation Layer (`validation/`)

- **Purpose**: Domain-level validation and business rules
- **Separation**: Domain validation ≠ Form validation
  - Form validation: in `components/*/schema.ts`
  - Domain validation: in `validation/`

### 🏗️ Services Layer (`services/`)

- **Purpose**: Business logic and data transformation
- **Keep**: Hooks thin, services handle complex logic

### 📦 State Management (`stores/` or `context/`)

#### 🎯 Decision Guide: Where to Put Your Store?

**✅ Store trong Feature (`features/*/stores/`) - KHI:**

- State chỉ được dùng trong feature đó
- State liên quan đến domain của feature (ví dụ: `user.store.ts` cho user management)
- Muốn giữ feature độc lập, có thể tách ra module riêng
- State có lifecycle gắn với feature

**✅ Store trong Shared (`shared/stores/`) - KHI:**

- State được dùng bởi nhiều features khác nhau
- State là global app state (auth, theme, notifications)
- State là UI state chung (modals, sidebar, etc.)
- State cần được share cross-feature

#### 📋 Best Practices:

1. **Start với Feature Store**: Bắt đầu đặt store trong feature, refactor ra shared khi cần
2. **Export từ Feature Index**: Export store từ `features/*/index.ts` để dễ import
3. **Composition Pattern**: Có thể compose nhiều feature stores trong shared store
4. **Avoid Over-sharing**: Không share state nếu không thực sự cần

#### 💡 Example:

```typescript
// ✅ GOOD: Feature-scoped store
features / users / stores / user.store.ts;
// Used only by: UserListPage, UserForm, UserTable

// ✅ GOOD: Cross-feature store
shared / stores / app.store.ts;
// Used by: All features (auth, theme, notifications)

// ❌ BAD: Feature store but used everywhere
features / users / stores / user.store.ts;
// But imported in: orders, products, dashboard features
```

- **Options**: Zustand, Jotai, Redux, or React Context

### 📝 Types (`types/`)

- **Purpose**: TypeScript type definitions
- **Organization**: Domain types, API types, error types

### 🛠️ Utils (`utils/`)

- **Purpose**: Feature-specific utility functions
- **Note**: Shared utilities go in `shared/utils/`

### 🧪 Tests (`__tests__/` or `tests/`)

- **Purpose**: Unit and integration tests
- **Coverage**: Components, services, validation schemas
