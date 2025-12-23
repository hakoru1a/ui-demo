# Feature Template

Template folder để tạo feature mới. Copy folder này và đổi tên theo feature của bạn.

## Cấu trúc

```
_template/
├── api/              # API services
│   └── index.ts
├── components/       # Feature-specific components
│   ├── FeatureNameList.tsx
│   └── FeatureNameForm.tsx
├── hooks/           # Custom hooks
│   └── useFeatureName.ts
├── pages/           # Page components
│   └── FeatureNamePage.tsx
├── validation/      # Validation schemas
│   └── index.ts
├── routes.tsx       # Route configuration
├── types.ts         # TypeScript types
└── README.md        # This file
```

## Cách sử dụng

1. Copy folder `_template` và đổi tên thành tên feature của bạn (ví dụ: `my-feature`)
2. Tìm và thay thế tất cả các placeholder:
   - `FeatureName` → Tên feature của bạn (PascalCase)
   - `feature-name` → Tên route của bạn (kebab-case)
   - `FEATURE_NAME` → Tên feature của bạn (UPPER_SNAKE_CASE)
3. Xóa các comment `TODO` và implement logic thực tế
4. Cập nhật routes trong `MainRoutes.tsx` hoặc import routes vào routing chính
5. Xóa file `README.md` này nếu không cần

## Lưu ý

- Tất cả các file đều có comment `TODO` để hướng dẫn
- Các folder có thể bỏ qua nếu không cần (ví dụ: không cần `validation/` nếu không có form)
- Cập nhật imports và exports theo cấu trúc thực tế của project

## Sharing Types với Features khác

Nếu feature khác cần sử dụng types từ feature này:

1. **Export types trong `index.ts`**:

```typescript
// features/my-feature/index.ts
export type { MyFeatureType, MyFeatureFormData } from './types';
```

2. **Import từ feature khác**:

```typescript
// features/other-feature/components/SomeComponent.tsx
import type { MyFeatureType } from 'features/my-feature';
```

Xem thêm chi tiết trong `docs/convention.md` phần "Sharing Types Between Features".
