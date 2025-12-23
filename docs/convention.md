# 📁 Project Structure Convention

```
features/
└── feature-name/                   # Feature: Feature Name
    ├── api/                        # 📡 API Layer
    │   └── index.ts                # API calls (GET, POST, PUT, DELETE)
    │
    ├── pages/                      # 🎨 UI Layer - Pages
    │   └── FeatureNamePage.tsx     # Page components (routes)
    │
    ├── components/                 # 🎨 UI Layer - Components
    │   ├── FeatureNameList.tsx     # List/Table components
    │   ├── FeatureNameForm.tsx     # Form components
    │   └── ...                     # Other feature-specific components
    │
    ├── hooks/                      # 🎣 Hooks Layer
    │   └── useFeatureName.ts       # Custom hooks (React Query, form logic, etc.)
    │
    ├── validation/                 # 🔥 Validation Layer
    │   └── index.ts                # Validation schemas (Zod/Yup)
    │
    ├── types.ts                    # 📝 TypeScript types & interfaces
    ├── routes.tsx                  # 📋 Feature routes configuration
    └── index.ts                    # 📋 Public exports (optional)
```

## 📋 Cấu trúc Feature theo Domain

Dựa trên `docs/features.md`, các feature được tổ chức theo domain:

- **forest/** - Quản lý vùng trồng & khai thác rừng
- **logistics/** - Vận chuyển & Trạm cân
- **factory/** - Nhà máy & Sản xuất
- **business/** - Phương án kinh doanh
- **sales/** - Bán hàng & Xuất khẩu
- **inventory/** - Tồn kho
- **admin/** - Quản trị & Nhân sự

## 📋 Layer Descriptions

### 📡 API Layer (`api/`)

- **Purpose**: HTTP communication with backend
- **File**: `api/index.ts` - Chứa tất cả API calls (GET, POST, PUT, DELETE)
- **Pattern**: Sử dụng base service từ `src/services/http/`

### 🎨 UI Layer (`pages/`, `components/`)

- **Purpose**: User interface components
- **Pages**: Full page components (routes) - mỗi page tương ứng với một route
- **Components**: Reusable UI components cho feature
  - `*List.tsx`: Components hiển thị danh sách/bảng
  - `*Form.tsx`: Components form (create/edit)

### 🎣 Hooks Layer (`hooks/`)

- **Purpose**: Custom React hooks
- **Pattern**:
  - React Query hooks cho data fetching và mutations
  - Form hooks cho form logic
  - Business logic hooks

### 🔥 Validation Layer (`validation/`)

- **Purpose**: Validation schemas và business rules
- **File**: `validation/index.ts` - Chứa validation schemas (Zod/Yup)
- **Usage**: Dùng cho form validation và API validation

### 📝 Types (`types.ts`)

- **Purpose**: TypeScript type definitions cho feature
- **File**: `types.ts` - Chứa domain types, API types, form types
- **Organization**: Tất cả types của feature trong một file

### 📋 Routes (`routes.tsx`)

- **Purpose**: Route configuration cho feature
- **File**: `routes.tsx` - Định nghĩa routes và lazy loading

### 📋 Index (`index.ts`)

- **Purpose**: Public exports của feature (optional)
- **File**: `index.ts` - Export các components, hooks, types cần thiết

## 📚 Shared Resources (outside features/)

Các resources dùng chung được đặt ở root level:

- **`src/components/`** - Reusable UI components
- **`src/hooks/`** - Shared hooks
- **`src/services/`** - HTTP services và API configuration
- **`src/types/`** - Shared types
- **`src/utils/`** - Shared utilities
- **`src/contexts/`** - Global contexts (Auth, Config, etc.)
