# 📚 Ví dụ: Sharing Types giữa các Features

Tài liệu này minh họa các cách xử lý khi một feature cần sử dụng types từ feature khác.

## Ví dụ 1: Export qua `index.ts` (Recommended)

### Scenario

Feature `harvest-plans` cần sử dụng type `ForestArea` từ feature `forest-areas`.

### Bước 1: Export types từ `forest-areas`

```typescript
// features/forest/forest-areas/index.ts
export type { ForestArea, ForestAreaFormData } from './types';
```

### Bước 2: Import và sử dụng trong `harvest-plans`

```typescript
// features/forest/harvesting/harvest-plans/types.ts
import type { ForestArea } from 'features/forest/forest-areas';

export interface HarvestPlan {
  id: string;
  forestAreaId: string;
  forestArea?: ForestArea; // Reference to ForestArea
  planDate: Date;
  quantity: number;
}
```

```typescript
// features/forest/harvesting/harvest-plans/components/HarvestPlanForm.tsx
import type { ForestArea } from 'features/forest/forest-areas';
import type { HarvestPlan } from '../types';

interface HarvestPlanFormProps {
  forestAreas: ForestArea[];
  onSubmit: (data: HarvestPlan) => void;
}
```

---

## Ví dụ 2: Shared Types trong Domain

### Scenario

Nhiều features trong domain `forest/` cần dùng chung một base type.

### Bước 1: Tạo shared types file

```typescript
// features/forest/shared-types.ts
export interface ForestBaseEntity {
  id: string;
  forestAreaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForestLocation {
  latitude: number;
  longitude: number;
  address?: string;
}
```

### Bước 2: Sử dụng trong các features

```typescript
// features/forest/harvesting/harvest-plans/types.ts
import type { ForestBaseEntity, ForestLocation } from '../../shared-types';

export interface HarvestPlan extends ForestBaseEntity {
  planDate: Date;
  quantity: number;
  location: ForestLocation;
}
```

```typescript
// features/forest/suppliers/types.ts
import type { ForestBaseEntity } from '../../shared-types';

export interface Supplier extends ForestBaseEntity {
  name: string;
  contactInfo: string;
}
```

---

## Ví dụ 3: Global Shared Types

### Scenario

Types được dùng bởi nhiều features từ các domains khác nhau.

### Bước 1: Tạo file trong `src/types/`

```typescript
// src/types/common.ts
export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
```

### Bước 2: Sử dụng trong các features

```typescript
// features/forest/forest-areas/api/index.ts
import type { PaginationParams, PaginationResult } from 'types/common';
import type { ForestArea } from '../types';

class ForestAreaService extends BaseService {
  async getAreas(params?: PaginationParams): Promise<ApiResult<PaginationResult<ForestArea>>> {
    return this.get<PaginationResult<ForestArea>>('/api/forest-areas', params);
  }
}
```

```typescript
// features/factory/batches/api/index.ts
import type { PaginationParams, PaginationResult } from 'types/common';
import type { Batch } from '../types';

class BatchService extends BaseService {
  async getBatches(params?: PaginationParams): Promise<ApiResult<PaginationResult<Batch>>> {
    return this.get<PaginationResult<Batch>>('/api/batches', params);
  }
}
```

---

## 📋 Decision Tree

Khi quyết định nơi đặt shared types:

```
Có phải types dùng chung cho nhiều domains khác nhau?
├─ YES → Đặt vào src/types/
└─ NO
   ├─ Có phải types dùng bởi nhiều features trong cùng domain?
   │  ├─ YES → Đặt vào features/{domain}/shared-types.ts
   │  └─ NO → Export qua index.ts của feature
```

---

## ⚠️ Lưu ý quan trọng

1. **Tránh circular dependencies**:

   - Feature A import từ Feature B
   - Feature B không nên import từ Feature A
   - Nếu cần, đặt shared types vào `src/types/` hoặc domain-level shared types

2. **Naming conventions**:

   - Đặt tên types rõ ràng, tránh conflict
   - Ví dụ: `ForestArea` thay vì `Area`, `HarvestPlan` thay vì `Plan`

3. **Export only what's needed**:

   - Chỉ export types/components/hooks thực sự cần thiết
   - Giữ API public của feature nhỏ gọn

4. **Documentation**:
   - Comment types phức tạp hoặc có business logic quan trọng
   - Giải thích mối quan hệ giữa các types nếu cần
