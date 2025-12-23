# Code Review: Forest Areas Feature

## 📋 Tổng quan

Feature `forest-areas` được tổ chức tốt về cấu trúc, nhưng có một số vấn đề về logic, state management và performance cần được cải thiện.

---

## 🔴 Vấn đề nghiêm trọng (Critical Issues)

### 1. **Duplicate Filtering Logic**

**File:** `hooks/useForestAreaTable.tsx:56-76`

**Vấn đề:**

- Filtering được thực hiện ở 2 nơi:
  - Manual filtering trong `filteredData` useMemo (status + search)
  - TanStack Table's built-in `getFilteredRowModel()` (column filters)
- Điều này gây confusion và có thể dẫn đến kết quả không nhất quán

**Giải pháp:**

```typescript
// Option 1: Sử dụng TanStack Table filtering cho tất cả
// Chuyển status và search vào columnFilters

// Option 2: Tách biệt rõ ràng
// - Pre-filtering (status, search) → filteredData
// - Column filtering → TanStack Table
// Nhưng cần document rõ ràng
```

### 2. **Redundant Data Passing**

**File:** `pages/ForestAreasListPage.tsx:71`

**Vấn đề:**

```typescript
data={table.getRowModel().rows.map((row) => row.original)}
```

- Table đã có data, không cần map lại
- Có thể dùng `filteredData` từ hook hoặc `table.getRowModel().rows` trực tiếp

**Giải pháp:**

```typescript
// Option 1: Pass filteredData từ hook
const { table, filteredData, ... } = useForestAreaTable(...);
<ForestAreaTable table={table} data={filteredData} ... />

// Option 2: Không cần pass data, component tự lấy từ table
// Remove data prop từ ForestAreaTable
```

### 3. **Empty Component**

**File:** `components/ForestAreaForm.tsx`

**Vấn đề:** File rỗng nhưng được export, có thể gây confusion

**Giải pháp:** Implement hoặc remove file

---

## 🟡 Vấn đề logic và state (Logic & State Issues)

### 4. **Inconsistent Filter State Management**

**Files:** `hooks/useForestAreaTable.tsx`, `pages/ForestAreasListPage.tsx`

**Vấn đề:**

- `statusFilter` và `searchValue` được quản lý ở page level
- `columnFilters` được quản lý trong table hook
- Không có single source of truth cho filters

**Giải pháp:**

```typescript
// Tạo một filter state object duy nhất
interface ForestAreaTableFilters {
  status: StatusFilter;
  search: string;
  columns: ColumnFiltersState;
}

// Hoặc sử dụng một custom hook để quản lý tất cả filters
const useForestAreaFilters = () => {
  const [filters, setFilters] = useState<ForestAreaTableFilters>({
    status: StatusFilter.ALL,
    search: '',
    columns: []
  });
  // ...
};
```

### 5. **Filter Dialog State Location**

**File:** `hooks/useForestAreaTable.tsx:52-53`

**Vấn đề:**

- `filterDialogOpen` và `filterAnchorRef` được quản lý trong table hook
- Nhưng chỉ được sử dụng trong header component
- Nên được quản lý ở component level hoặc tách thành separate hook

**Giải pháp:**

```typescript
// Move to page level hoặc tách thành useFilterDialog hook
const useFilterDialog = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return { open, setOpen, anchorRef };
};
```

### 6. **Type Safety Issues**

**File:** `hooks/useForestAreaTable.tsx:84, 93`

**Vấn đề:**

```typescript
header: ({ table }: any) => (...)
cell: ({ row }: any) => (...)
```

**Giải pháp:**

```typescript
import type { HeaderContext, CellContext } from '@tanstack/react-table';

header: ({ table }: HeaderContext<ForestArea, unknown>) => (...)
cell: ({ row }: CellContext<ForestArea, unknown>) => (...)
```

### 7. **Filter Hook Logic Complexity**

**File:** `hooks/useForestAreaFilter.tsx:35-49`

**Vấn đề:**

- Logic xử lý array vs non-array values phức tạp
- Có thể đơn giản hóa

**Giải pháp:**

```typescript
const handleApply = () => {
  const newFilters: ColumnFiltersState = Object.entries(filters)
    .filter(([_, value]) => {
      if (value === '' || value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    })
    .map(([id, value]) => ({ id, value }));

  onFilterChange(newFilters);
  onClose();
};
```

---

## 🟢 Vấn đề performance (Performance Issues)

### 8. **Unnecessary Re-renders**

**File:** `hooks/useForestAreaTable.tsx:142-151`

**Vấn đề:**

```typescript
const selectedRows = useMemo(() => {
  return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
}, [table, rowSelection]);

useEffect(() => {
  if (onRowSelectionChange) {
    onRowSelectionChange(selectedRows);
  }
}, [selectedRows, onRowSelectionChange]);
```

- `onRowSelectionChange` có thể thay đổi mỗi render nếu không được memoized
- `table` object thay đổi mỗi render

**Giải pháp:**

```typescript
// Use useCallback trong parent component
// Hoặc chỉ depend on rowSelection
const selectedRows = useMemo(() => {
  return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
}, [rowSelection]); // Remove table dependency

useEffect(() => {
  onRowSelectionChange?.(selectedRows);
}, [selectedRows]); // Remove onRowSelectionChange from deps
```

### 9. **CSV Data Re-computation**

**File:** `hooks/useForestAreaTable.tsx:154-169`

**Vấn đề:**

- `csvData` và `csvHeadersData` được tính toán lại mỗi khi table state thay đổi
- Có thể optimize bằng cách chỉ tính khi cần export

**Giải pháp:**

```typescript
// Lazy computation - chỉ tính khi export
const getCsvData = useCallback(() => {
  if (!enableCSVExport) return [];
  return table.getFilteredRowModel().rows.map((row) => row.original);
}, [table, enableCSVExport]);
```

---

## 🔵 Vấn đề code organization (Code Organization)

### 10. **Hook Doing Too Much**

**File:** `hooks/useForestAreaTable.tsx`

**Vấn đề:**

- Hook này làm quá nhiều: filtering, selection, CSV export, dialog state
- Vi phạm Single Responsibility Principle

**Giải pháp:**

```typescript
// Tách thành nhiều hooks nhỏ hơn:
// - useTableState (sorting, pagination, visibility)
// - useTableFilters (status, search, column filters)
// - useTableSelection (row selection)
// - useTableExport (CSV export)
// - useTableDialog (filter dialog state)
```

### 11. **Missing API Layer**

**File:** `api/` folder is empty

**Vấn đề:**

- Không có API service layer
- Data được lấy từ mock trực tiếp trong page

**Giải pháp:**

```typescript
// api/forestAreaService.ts
export const forestAreaService = {
  getAll: () => axios.get<ForestArea[]>('/api/forest-areas'),
  getById: (id: string) => axios.get<ForestArea>(`/api/forest-areas/${id}`),
  create: (data: ForestAreaFormData) => axios.post('/api/forest-areas', data),
  update: (id: string, data: ForestAreaFormData) => axios.put(`/api/forest-areas/${id}`, data),
  delete: (id: string) => axios.delete(`/api/forest-areas/${id}`)
};
```

### 12. **Inconsistent Naming**

**Files:** Multiple files

**Vấn đề:**

- `useForestAreaTable` vs `useForestAreaFilter` - một số dùng default export, một số dùng named export
- `ForestAreaTableHeader` - component name không consistent với pattern

**Giải pháp:**

- Standardize: tất cả hooks dùng default export hoặc named export
- Component naming: `ForestAreaTableHeader` → `ForestAreaTableHeader` (OK) hoặc `TableHeader` nếu trong context

---

## 📝 Đề xuất cải thiện (Recommendations)

### Priority 1 (High Priority)

1. ✅ Fix duplicate filtering logic
2. ✅ Fix redundant data passing
3. ✅ Implement hoặc remove `ForestAreaForm.tsx`
4. ✅ Fix type safety issues (remove `any`)

### Priority 2 (Medium Priority)

5. ✅ Consolidate filter state management
6. ✅ Move filter dialog state to appropriate level
7. ✅ Optimize re-renders (useCallback, memo)
8. ✅ Create API service layer

### Priority 3 (Low Priority)

9. ✅ Refactor large hook into smaller hooks
10. ✅ Standardize naming conventions
11. ✅ Add error handling
12. ✅ Add loading states management

---

## 🎯 Best Practices Recommendations

### 1. **State Management Pattern**

```typescript
// Recommended: Use reducer pattern cho complex state
const useForestAreaTableState = () => {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  // ...
};
```

### 2. **Error Handling**

```typescript
// Add error boundaries và error states
const [error, setError] = useState<Error | null>(null);
```

### 3. **Loading States**

```typescript
// Separate loading states
const [isLoading, setIsLoading] = useState(false);
const [isFiltering, setIsFiltering] = useState(false);
```

### 4. **Memoization**

```typescript
// Memoize callbacks passed to children
const handleRowSelectionChange = useCallback((selected: ForestArea[]) => {
  // ...
}, []);
```

### 5. **Type Safety**

```typescript
// Avoid `any`, use proper types
// Use type guards for runtime checks
```

---

## 📊 Code Quality Metrics

- **Type Safety:** 85% (có `any` types)
- **Code Organization:** 80% (hook quá lớn)
- **Performance:** 75% (có unnecessary re-renders)
- **Maintainability:** 80% (cần refactor một số phần)
- **Testability:** 60% (chưa có tests, logic phức tạp)

---

## ✅ Điểm mạnh (Strengths)

1. ✅ Cấu trúc folder rõ ràng, dễ navigate
2. ✅ Types được định nghĩa tốt và tách biệt
3. ✅ Components được tách biệt hợp lý
4. ✅ Sử dụng TanStack Table đúng cách
5. ✅ Code có comments và documentation

---

## 🔄 Migration Plan

Nếu muốn refactor, đề xuất làm theo thứ tự:

1. **Phase 1:** Fix critical issues (duplicate filtering, type safety)
2. **Phase 2:** Refactor state management (consolidate filters)
3. **Phase 3:** Split large hook into smaller hooks
4. **Phase 4:** Add API layer và error handling
5. **Phase 5:** Performance optimization

---

_Review date: 2024_
_Reviewer: AI Code Reviewer_
