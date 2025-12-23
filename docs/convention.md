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

---

## 📄 Page Structure Guidelines

### 🎯 Nguyên tắc chia Page

1. **Mỗi Page = 1 Route chính**: Mỗi page component tương ứng với một route riêng biệt
2. **Chia theo chức năng**: Tách biệt List, Detail, Form, Map, Report
3. **Tên file**: PascalCase với suffix `Page.tsx` (ví dụ: `ForestAreasListPage.tsx`)
4. **Route path**: kebab-case (ví dụ: `/forest-areas`, `/forest-areas/:id`)

### 📋 Pattern chia Page theo Feature Type

| Feature Type         | Pages Pattern                                                 | Ví dụ                                                                                                             |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Master**           | `ListPage`, `DetailPage`, `CreatePage`, `EditPage`            | `SuppliersListPage`, `SupplierDetailPage`, `SupplierCreatePage`, `SupplierEditPage`                               |
| **Master + GIS**     | `ListPage`, `DetailPage`, `CreatePage`, `EditPage`, `MapPage` | `ForestAreasListPage`, `ForestAreaDetailPage`, `ForestAreaCreatePage`, `ForestAreaEditPage`, `ForestAreasMapPage` |
| **Transaction**      | `ListPage`, `DetailPage`, `CreatePage`, `EditPage`            | `HarvestPlansListPage`, `HarvestPlanDetailPage`, `HarvestPlanCreatePage`, `HarvestPlanEditPage`                   |
| **Report/Analytics** | `ReportPage` (có thể có filter tabs)                          | `HarvestReportsPage`, `YieldEstimationPage`                                                                       |
| **Realtime/GIS**     | `TrackingPage`, `MapPage`                                     | `TrackingPage`, `ForestAreasMapPage`                                                                              |
| **IoT/Realtime**     | `MonitorPage`, `StatusPage`                                   | `WeighbridgeMonitorPage`                                                                                          |
| **Dashboard**        | `DashboardPage`                                               | `DashboardsPage`                                                                                                  |

---

## 📋 Chi tiết Page Structure cho từng Feature

### 🌲 A. Forest Area Management (`features/forest/`)

#### `forest-areas/` - Master + GIS

**Mô tả**: DS/chi tiết vùng trồng + mapview vùng rừng

```
pages/
├── ForestAreasListPage.tsx      # Danh sách vùng trồng (table + filters)
├── ForestAreaDetailPage.tsx     # Chi tiết vùng trồng (tabs: info, legal, history)
├── ForestAreaCreatePage.tsx     # Tạo vùng trồng mới (form với map picker)
├── ForestAreaEditPage.tsx       # Chỉnh sửa vùng trồng
└── ForestAreasMapPage.tsx       # Mapview vùng rừng (GIS map với markers)
```

**Routes**:

- `/forest-areas` → `ForestAreasListPage`
- `/forest-areas/new` → `ForestAreaCreatePage`
- `/forest-areas/:id` → `ForestAreaDetailPage`
- `/forest-areas/:id/edit` → `ForestAreaEditPage`
- `/forest-areas/map` → `ForestAreasMapPage`

---

#### `legal-certificates/` - Master/Compliance

**Mô tả**: Hồ sơ pháp lý & chứng chỉ FSC/PEFC

```
pages/
├── LegalCertificatesListPage.tsx    # Danh sách chứng chỉ
├── LegalCertificateDetailPage.tsx   # Chi tiết chứng chỉ (tabs: info, documents, validity)
├── LegalCertificateCreatePage.tsx   # Tạo chứng chỉ mới
└── LegalCertificateEditPage.tsx      # Chỉnh sửa chứng chỉ
```

**Routes**:

- `/legal-certificates` → `LegalCertificatesListPage`
- `/legal-certificates/new` → `LegalCertificateCreatePage`
- `/legal-certificates/:id` → `LegalCertificateDetailPage`
- `/legal-certificates/:id/edit` → `LegalCertificateEditPage`

---

#### `harvesting/harvest-plans/` - Transaction/Planning

**Mô tả**: Lập & quản lý kế hoạch khai thác

```
pages/
├── HarvestPlansListPage.tsx      # Danh sách kế hoạch (filters: status, date range)
├── HarvestPlanDetailPage.tsx    # Chi tiết kế hoạch (tabs: info, areas, timeline)
├── HarvestPlanCreatePage.tsx    # Tạo kế hoạch mới (wizard form)
└── HarvestPlanEditPage.tsx      # Chỉnh sửa kế hoạch
```

**Routes**:

- `/harvest-plans` → `HarvestPlansListPage`
- `/harvest-plans/new` → `HarvestPlanCreatePage`
- `/harvest-plans/:id` → `HarvestPlanDetailPage`
- `/harvest-plans/:id/edit` → `HarvestPlanEditPage`

---

#### `harvesting/harvest-orders/` - Transaction/Execution

**Mô tả**: Lệnh khai thác, theo dõi thực thi/nghiệm thu

```
pages/
├── HarvestOrdersListPage.tsx        # Danh sách lệnh khai thác (filters: status, plan)
├── HarvestOrderDetailPage.tsx       # Chi tiết lệnh (tabs: info, execution, acceptance)
├── HarvestOrderCreatePage.tsx       # Tạo lệnh mới
└── HarvestOrderExecutionPage.tsx    # Màn hình thực thi (realtime tracking)
```

**Routes**:

- `/harvest-orders` → `HarvestOrdersListPage`
- `/harvest-orders/new` → `HarvestOrderCreatePage`
- `/harvest-orders/:id` → `HarvestOrderDetailPage`
- `/harvest-orders/:id/execution` → `HarvestOrderExecutionPage`

---

#### `harvesting/harvest-reports/` - Report/Analytics

**Mô tả**: Báo cáo sản lượng, so sánh kế hoạch vs thực tế

```
pages/
└── HarvestReportsPage.tsx       # Báo cáo (tabs: production, comparison, charts)
```

**Routes**:

- `/harvest-reports` → `HarvestReportsPage`

---

#### `suppliers/` - Master + Transaction History

**Mô tả**: Master + lịch sử giao dịch NCC

```
pages/
├── SuppliersListPage.tsx        # Danh sách NCC (filters: status, type)
├── SupplierDetailPage.tsx      # Chi tiết NCC (tabs: info, contracts, transaction history)
├── SupplierCreatePage.tsx      # Tạo NCC mới
└── SupplierEditPage.tsx        # Chỉnh sửa NCC
```

**Routes**:

- `/suppliers` → `SuppliersListPage`
- `/suppliers/new` → `SupplierCreatePage`
- `/suppliers/:id` → `SupplierDetailPage`
- `/suppliers/:id/edit` → `SupplierEditPage`

---

#### `yield-estimation/` - Report/Forecast

**Mô tả**: Ước tính sản lượng phục vụ kế hoạch & PAB

```
pages/
└── YieldEstimationPage.tsx     # Báo cáo ước tính (filters: area, period, charts)
```

**Routes**:

- `/yield-estimation` → `YieldEstimationPage`

---

### 🚛 B. Vận chuyển & Trạm cân (`features/logistics/`)

#### `fleet/` - Master

**Mô tả**: Xe & tài xế

```
pages/
├── FleetListPage.tsx           # Danh sách xe & tài xế (tabs: vehicles, drivers)
├── VehicleDetailPage.tsx       # Chi tiết xe (tabs: info, maintenance, history)
├── VehicleCreatePage.tsx       # Tạo xe mới
├── VehicleEditPage.tsx         # Chỉnh sửa xe
├── DriverDetailPage.tsx        # Chi tiết tài xế (tabs: info, license, assignments)
├── DriverCreatePage.tsx         # Tạo tài xế mới
└── DriverEditPage.tsx           # Chỉnh sửa tài xế
```

**Routes**:

- `/fleet` → `FleetListPage`
- `/fleet/vehicles/new` → `VehicleCreatePage`
- `/fleet/vehicles/:id` → `VehicleDetailPage`
- `/fleet/vehicles/:id/edit` → `VehicleEditPage`
- `/fleet/drivers/new` → `DriverCreatePage`
- `/fleet/drivers/:id` → `DriverDetailPage`
- `/fleet/drivers/:id/edit` → `DriverEditPage`

---

#### `dispatching/` - Transaction/Scheduling

**Mô tả**: Lệnh điều động, lịch điều phối, chuyến vận chuyển

```
pages/
├── DispatchingListPage.tsx         # Danh sách lệnh điều động (filters: status, date)
├── DispatchOrderDetailPage.tsx     # Chi tiết lệnh (tabs: info, route, tracking)
├── DispatchOrderCreatePage.tsx     # Tạo lệnh mới
└── DispatchingSchedulePage.tsx     # Lịch điều phối (calendar/timeline view)
```

**Routes**:

- `/dispatching` → `DispatchingListPage`
- `/dispatching/new` → `DispatchOrderCreatePage`
- `/dispatching/:id` → `DispatchOrderDetailPage`
- `/dispatching/schedule` → `DispatchingSchedulePage`

---

#### `tracking/` - Realtime/GIS

**Mô tả**: Tracking lộ trình realtime, geofence/cảnh báo

```
pages/
└── TrackingPage.tsx            # Map tracking realtime (GIS với markers, routes, alerts)
```

**Routes**:

- `/tracking` → `TrackingPage`

---

#### `weighbridge/` - IoT/Realtime

**Mô tả**: Màn hình trạm cân, device status, nhận dữ liệu cân

```
pages/
├── WeighbridgeMonitorPage.tsx      # Màn hình trạm cân (realtime display)
└── WeighbridgeStatusPage.tsx      # Device status & configuration
```

**Routes**:

- `/weighbridge` → `WeighbridgeMonitorPage`
- `/weighbridge/status` → `WeighbridgeStatusPage`

---

#### `weigh-tickets/` - Transaction

**Mô tả**: Phiếu cân inbound/outbound

```
pages/
├── WeighTicketsListPage.tsx        # Danh sách phiếu cân (filters: type, date, status)
├── WeighTicketDetailPage.tsx       # Chi tiết phiếu cân (tabs: info, images, history)
└── WeighTicketCreatePage.tsx       # Tạo phiếu cân (form hoặc từ weighbridge)
```

**Routes**:

- `/weigh-tickets` → `WeighTicketsListPage`
- `/weigh-tickets/new` → `WeighTicketCreatePage`
- `/weigh-tickets/:id` → `WeighTicketDetailPage`

---

#### `price-engine/` - Config/Rule Engine

**Mô tả**: Bảng giá & công thức giá theo độ ẩm/tạp chất

```
pages/
├── PriceEngineListPage.tsx         # Danh sách bảng giá (filters: product, date)
├── PriceTableDetailPage.tsx         # Chi tiết bảng giá (tabs: base price, formulas, rules)
└── PriceTableCreatePage.tsx         # Tạo/cấu hình bảng giá
```

**Routes**:

- `/price-engine` → `PriceEngineListPage`
- `/price-engine/new` → `PriceTableCreatePage`
- `/price-engine/:id` → `PriceTableDetailPage`

---

#### `partners/` - Master

**Mô tả**: Đối tác dùng chung (khách hàng/nhà cung cấp/đại lý)

```
pages/
├── PartnersListPage.tsx         # Danh sách đối tác (filters: type, status)
├── PartnerDetailPage.tsx        # Chi tiết đối tác (tabs: info, contracts, transactions)
├── PartnerCreatePage.tsx        # Tạo đối tác mới
└── PartnerEditPage.tsx          # Chỉnh sửa đối tác
```

**Routes**:

- `/partners` → `PartnersListPage`
- `/partners/new` → `PartnerCreatePage`
- `/partners/:id` → `PartnerDetailPage`
- `/partners/:id/edit` → `PartnerEditPage`

---

### 🏭 C. Nhà máy & Sản xuất (`features/factory/`)

#### `material-receipts/` - Transaction

**Mô tả**: Phiếu nguyên liệu đầu vào (liên kết phiếu cân/lô/NCC)

```
pages/
├── MaterialReceiptsListPage.tsx    # Danh sách phiếu nhập (filters: date, supplier, status)
├── MaterialReceiptDetailPage.tsx    # Chi tiết phiếu (tabs: info, items, quality, linked docs)
└── MaterialReceiptCreatePage.tsx   # Tạo phiếu nhập (form với link weigh ticket)
```

**Routes**:

- `/material-receipts` → `MaterialReceiptsListPage`
- `/material-receipts/new` → `MaterialReceiptCreatePage`
- `/material-receipts/:id` → `MaterialReceiptDetailPage`

---

#### `production-plans/` - Planning

**Mô tả**: Kế hoạch SX tuần/tháng

```
pages/
├── ProductionPlansListPage.tsx      # Danh sách kế hoạch (filters: period, status)
├── ProductionPlanDetailPage.tsx    # Chi tiết kế hoạch (tabs: info, lines, capacity)
├── ProductionPlanCreatePage.tsx    # Tạo kế hoạch (wizard: period, lines, resources)
└── ProductionPlanEditPage.tsx      # Chỉnh sửa kế hoạch
```

**Routes**:

- `/production-plans` → `ProductionPlansListPage`
- `/production-plans/new` → `ProductionPlanCreatePage`
- `/production-plans/:id` → `ProductionPlanDetailPage`
- `/production-plans/:id/edit` → `ProductionPlanEditPage`

---

#### `production-orders/` - Transaction/Execution

**Mô tả**: Lệnh SX, định mức/tiêu hao/sản lượng

```
pages/
├── ProductionOrdersListPage.tsx        # Danh sách lệnh SX (filters: status, plan, date)
├── ProductionOrderDetailPage.tsx      # Chi tiết lệnh (tabs: info, materials, output, consumption)
├── ProductionOrderCreatePage.tsx      # Tạo lệnh SX
└── ProductionOrderExecutionPage.tsx    # Màn hình thực thi (realtime input/output)
```

**Routes**:

- `/production-orders` → `ProductionOrdersListPage`
- `/production-orders/new` → `ProductionOrderCreatePage`
- `/production-orders/:id` → `ProductionOrderDetailPage`
- `/production-orders/:id/execution` → `ProductionOrderExecutionPage`

---

#### `batches/` - Batch/Trace

**Mô tả**: Lô SX & nguyên liệu, phục vụ truy xuất

```
pages/
├── BatchesListPage.tsx            # Danh sách lô (filters: product, date, status)
└── BatchDetailPage.tsx            # Chi tiết lô (tabs: info, materials, traceability, quality)
```

**Routes**:

- `/batches` → `BatchesListPage`
- `/batches/:id` → `BatchDetailPage`

---

#### `shift-logs/` - Operation Log

**Mô tả**: Nhật ký ca & sản lượng, sự cố/dừng máy

```
pages/
├── ShiftLogsListPage.tsx          # Danh sách nhật ký ca (filters: shift, date, line)
├── ShiftLogDetailPage.tsx         # Chi tiết nhật ký (tabs: production, downtime, issues)
└── ShiftLogCreatePage.tsx         # Tạo nhật ký ca (form hoặc realtime input)
```

**Routes**:

- `/shift-logs` → `ShiftLogsListPage`
- `/shift-logs/new` → `ShiftLogCreatePage`
- `/shift-logs/:id` → `ShiftLogDetailPage`

---

#### `shipments/` - Transaction/Outbound

**Mô tả**: Phiếu xuất hàng (kho/cảng)

```
pages/
├── ShipmentsListPage.tsx          # Danh sách phiếu xuất (filters: type, date, status)
├── ShipmentDetailPage.tsx         # Chi tiết phiếu (tabs: info, items, documents, tracking)
└── ShipmentCreatePage.tsx         # Tạo phiếu xuất
```

**Routes**:

- `/shipments` → `ShipmentsListPage`
- `/shipments/new` → `ShipmentCreatePage`
- `/shipments/:id` → `ShipmentDetailPage`

---

#### `quality/` - QC/Inspection

**Mô tả**: Phiếu kiểm định, báo cáo độ ẩm/tạp chất, QC thành phẩm

```
pages/
├── QualityInspectionsListPage.tsx     # Danh sách phiếu QC (filters: type, date, status)
├── QualityInspectionDetailPage.tsx   # Chi tiết phiếu (tabs: info, test results, images)
├── QualityInspectionCreatePage.tsx   # Tạo phiếu kiểm định
└── QualityReportsPage.tsx            # Báo cáo chất lượng (charts: moisture, impurities)
```

**Routes**:

- `/quality` → `QualityInspectionsListPage`
- `/quality/new` → `QualityInspectionCreatePage`
- `/quality/:id` → `QualityInspectionDetailPage`
- `/quality/reports` → `QualityReportsPage`

---

### 💼 D. Phương án kinh doanh (`features/business/`)

#### `pab/` - Core + Workflow

**Mô tả**: Lập/duyệt PAB, trạng thái, báo cáo PAB

```
pages/
├── PabListPage.tsx               # Danh sách PAB (filters: status, period, approver)
├── PabDetailPage.tsx             # Chi tiết PAB (tabs: info, items, workflow, history)
├── PabCreatePage.tsx             # Tạo PAB (wizard form)
├── PabEditPage.tsx               # Chỉnh sửa PAB
└── PabReportsPage.tsx            # Báo cáo PAB (charts, comparisons)
```

**Routes**:

- `/pab` → `PabListPage`
- `/pab/new` → `PabCreatePage`
- `/pab/:id` → `PabDetailPage`
- `/pab/:id/edit` → `PabEditPage`
- `/pab/reports` → `PabReportsPage`

---

#### `contracts/` - Transaction+Master

**Mô tả**: Hợp đồng & giá, hiệu lực, điều khoản

```
pages/
├── ContractsListPage.tsx         # Danh sách hợp đồng (filters: status, partner, date)
├── ContractDetailPage.tsx        # Chi tiết hợp đồng (tabs: info, terms, prices, validity)
├── ContractCreatePage.tsx        # Tạo hợp đồng mới
└── ContractEditPage.tsx          # Chỉnh sửa hợp đồng
```

**Routes**:

- `/contracts` → `ContractsListPage`
- `/contracts/new` → `ContractCreatePage`
- `/contracts/:id` → `ContractDetailPage`
- `/contracts/:id/edit` → `ContractEditPage`

---

#### `payments/` - Finance Transaction + Workflow

**Mô tả**: Payment order/phiếu chi

```
pages/
├── PaymentsListPage.tsx          # Danh sách phiếu chi (filters: status, date, approver)
├── PaymentDetailPage.tsx         # Chi tiết phiếu (tabs: info, workflow, documents)
├── PaymentCreatePage.tsx         # Tạo phiếu chi
└── PaymentApprovalPage.tsx       # Màn hình phê duyệt (workflow)
```

**Routes**:

- `/payments` → `PaymentsListPage`
- `/payments/new` → `PaymentCreatePage`
- `/payments/:id` → `PaymentDetailPage`
- `/payments/:id/approval` → `PaymentApprovalPage`

---

#### `advances/` - Finance Transaction + Workflow

**Mô tả**: Tạm ứng, phê duyệt, đối soát

```
pages/
├── AdvancesListPage.tsx          # Danh sách tạm ứng (filters: status, employee, date)
├── AdvanceDetailPage.tsx         # Chi tiết tạm ứng (tabs: info, workflow, reconciliation)
├── AdvanceCreatePage.tsx         # Tạo tạm ứng
└── AdvanceReconciliationPage.tsx # Đối soát tạm ứng
```

**Routes**:

- `/advances` → `AdvancesListPage`
- `/advances/new` → `AdvanceCreatePage`
- `/advances/:id` → `AdvanceDetailPage`
- `/advances/:id/reconciliation` → `AdvanceReconciliationPage`

---

### 📦 E. Bán hàng & Xuất khẩu (`features/sales/`)

#### `export-orders/` - Sales Transaction

**Mô tả**: Đơn hàng xuất khẩu, trạng thái fulfillment

```
pages/
├── ExportOrdersListPage.tsx      # Danh sách đơn hàng (filters: status, customer, date)
├── ExportOrderDetailPage.tsx    # Chi tiết đơn hàng (tabs: info, items, fulfillment, documents)
├── ExportOrderCreatePage.tsx    # Tạo đơn hàng
└── ExportOrderFulfillmentPage.tsx # Màn hình fulfillment (tracking status)
```

**Routes**:

- `/export-orders` → `ExportOrdersListPage`
- `/export-orders/new` → `ExportOrderCreatePage`
- `/export-orders/:id` → `ExportOrderDetailPage`
- `/export-orders/:id/fulfillment` → `ExportOrderFulfillmentPage`

---

#### `crm/` - Master/CRM

**Mô tả**: Hồ sơ khách hàng, lịch sử giao dịch

```
pages/
├── CustomersListPage.tsx         # Danh sách khách hàng (filters: type, status, country)
├── CustomerDetailPage.tsx       # Chi tiết khách hàng (tabs: info, contacts, orders, history)
├── CustomerCreatePage.tsx       # Tạo khách hàng mới
└── CustomerEditPage.tsx         # Chỉnh sửa khách hàng
```

**Routes**:

- `/crm/customers` → `CustomersListPage`
- `/crm/customers/new` → `CustomerCreatePage`
- `/crm/customers/:id` → `CustomerDetailPage`
- `/crm/customers/:id/edit` → `CustomerEditPage`

---

#### `export-documents/` - Document/Compliance

**Mô tả**: Invoice, packing list, versioning, export

```
pages/
├── ExportDocumentsListPage.tsx      # Danh sách chứng từ (filters: type, order, date)
├── ExportDocumentDetailPage.tsx     # Chi tiết chứng từ (tabs: info, versions, preview, export)
└── ExportDocumentCreatePage.tsx    # Tạo chứng từ (wizard: select order, generate)
```

**Routes**:

- `/export-documents` → `ExportDocumentsListPage`
- `/export-documents/new` → `ExportDocumentCreatePage`
- `/export-documents/:id` → `ExportDocumentDetailPage`

---

#### `vessel-tracking/` - Tracking/Document

**Mô tả**: Theo dõi tàu, ETD/ETA, B/L

```
pages/
└── VesselTrackingPage.tsx       # Tracking tàu (map + timeline, ETD/ETA, B/L status)
```

**Routes**:

- `/vessel-tracking` → `VesselTrackingPage`

---

#### `logistics-costing/` - Costing/Finance

**Mô tả**: Ghi nhận & phân bổ chi phí logistics/dịch vụ

```
pages/
├── LogisticsCostingListPage.tsx     # Danh sách chi phí (filters: type, order, date)
├── LogisticsCostDetailPage.tsx      # Chi tiết chi phí (tabs: info, allocation, documents)
└── LogisticsCostCreatePage.tsx     # Tạo chi phí
```

**Routes**:

- `/logistics-costing` → `LogisticsCostingListPage`
- `/logistics-costing/new` → `LogisticsCostCreatePage`
- `/logistics-costing/:id` → `LogisticsCostDetailPage`

---

### 📋 F. Tồn kho (`features/inventory/`)

#### `inventory-receipts/` - Transaction/Inbound Warehouse

**Mô tả**: Phiếu nhập kho

```
pages/
├── InventoryReceiptsListPage.tsx    # Danh sách phiếu nhập (filters: warehouse, date, type)
├── InventoryReceiptDetailPage.tsx   # Chi tiết phiếu (tabs: info, items, documents)
└── InventoryReceiptCreatePage.tsx   # Tạo phiếu nhập
```

**Routes**:

- `/inventory-receipts` → `InventoryReceiptsListPage`
- `/inventory-receipts/new` → `InventoryReceiptCreatePage`
- `/inventory-receipts/:id` → `InventoryReceiptDetailPage`

---

#### `inventory-issues/` - Transaction/Outbound Warehouse

**Mô tả**: Phiếu xuất kho

```
pages/
├── InventoryIssuesListPage.tsx      # Danh sách phiếu xuất (filters: warehouse, date, type)
├── InventoryIssueDetailPage.tsx     # Chi tiết phiếu (tabs: info, items, documents)
└── InventoryIssueCreatePage.tsx    # Tạo phiếu xuất
```

**Routes**:

- `/inventory-issues` → `InventoryIssuesListPage`
- `/inventory-issues/new` → `InventoryIssueCreatePage`
- `/inventory-issues/:id` → `InventoryIssueDetailPage`

---

#### `sku/` - Master

**Mô tả**: Danh mục SKU

```
pages/
├── SkuListPage.tsx              # Danh sách SKU (filters: category, status)
├── SkuDetailPage.tsx            # Chi tiết SKU (tabs: info, specifications, stock)
├── SkuCreatePage.tsx            # Tạo SKU mới
└── SkuEditPage.tsx              # Chỉnh sửa SKU
```

**Routes**:

- `/sku` → `SkuListPage`
- `/sku/new` → `SkuCreatePage`
- `/sku/:id` → `SkuDetailPage`
- `/sku/:id/edit` → `SkuEditPage`

---

#### `stock/` - Report/Query

**Mô tả**: Xem tồn theo kho/SKU/batch

```
pages/
└── StockPage.tsx                # Xem tồn (filters: warehouse, SKU, batch, charts)
```

**Routes**:

- `/stock` → `StockPage`

---

#### `stocktakes/` - Transaction+Audit

**Mô tả**: Kiểm kê, chênh lệch, biên bản

```
pages/
├── StocktakesListPage.tsx          # Danh sách phiếu kiểm kê (filters: warehouse, date, status)
├── StocktakeDetailPage.tsx         # Chi tiết kiểm kê (tabs: info, items, variances, report)
├── StocktakeCreatePage.tsx         # Tạo phiếu kiểm kê
└── StocktakeExecutionPage.tsx      # Màn hình thực hiện kiểm kê (mobile-friendly)
```

**Routes**:

- `/stocktakes` → `StocktakesListPage`
- `/stocktakes/new` → `StocktakeCreatePage`
- `/stocktakes/:id` → `StocktakeDetailPage`
- `/stocktakes/:id/execution` → `StocktakeExecutionPage`

---

#### `transfers/` - Transaction/Internal Move

**Mô tả**: Chuyển kho

```
pages/
├── TransfersListPage.tsx        # Danh sách phiếu chuyển (filters: from/to warehouse, date)
├── TransferDetailPage.tsx       # Chi tiết phiếu (tabs: info, items, tracking)
└── TransferCreatePage.tsx       # Tạo phiếu chuyển
```

**Routes**:

- `/transfers` → `TransfersListPage`
- `/transfers/new` → `TransferCreatePage`
- `/transfers/:id` → `TransferDetailPage`

---

#### `traceability/` - Traceability

**Mô tả**: Truy xuất nguồn gốc end-to-end

```
pages/
└── TraceabilityPage.tsx         # Truy xuất (input: batch/SKU, output: full chain)
```

**Routes**:

- `/traceability` → `TraceabilityPage`

---

### 👥 G. Quản trị & Nhân sự (`features/admin/`)

#### `dashboards/` - Dashboard

**Mô tả**: KPI tổng hợp

```
pages/
└── DashboardsPage.tsx           # Dashboard (tabs: overview, production, sales, inventory)
```

**Routes**:

- `/dashboards` → `DashboardsPage`

---

#### `reports/` - Reports

**Mô tả**: P&L, sản xuất, tồn kho, nhập/xuất...

```
pages/
└── ReportsPage.tsx              # Báo cáo (tabs: P&L, production, inventory, sales)
```

**Routes**:

- `/reports` → `ReportsPage`

---

#### `hr/` - HR

**Mô tả**: Hồ sơ & hợp đồng nhân sự

```
pages/
├── EmployeesListPage.tsx         # Danh sách nhân viên (filters: department, status)
├── EmployeeDetailPage.tsx        # Chi tiết nhân viên (tabs: info, contract, assignments)
├── EmployeeCreatePage.tsx        # Tạo nhân viên mới
└── EmployeeEditPage.tsx          # Chỉnh sửa nhân viên
```

**Routes**:

- `/hr/employees` → `EmployeesListPage`
- `/hr/employees/new` → `EmployeeCreatePage`
- `/hr/employees/:id` → `EmployeeDetailPage`
- `/hr/employees/:id/edit` → `EmployeeEditPage`

---

#### `timekeeping-payroll/` - HR Transaction

**Mô tả**: Chấm công & tính lương

```
pages/
├── TimekeepingListPage.tsx      # Danh sách chấm công (filters: period, employee, department)
├── TimekeepingDetailPage.tsx     # Chi tiết chấm công (tabs: attendance, overtime, adjustments)
├── PayrollListPage.tsx           # Danh sách lương (filters: period, employee)
└── PayrollDetailPage.tsx         # Chi tiết lương (tabs: salary, deductions, net pay)
```

**Routes**:

- `/timekeeping` → `TimekeepingListPage`
- `/timekeeping/:id` → `TimekeepingDetailPage`
- `/payroll` → `PayrollListPage`
- `/payroll/:id` → `PayrollDetailPage`

---

#### `workforce-dispatch/` - HR Scheduling

**Mô tả**: Điều phối nhân sự theo ca/tổ/line

```
pages/
├── WorkforceDispatchListPage.tsx    # Danh sách điều phối (filters: shift, date, department)
├── WorkforceDispatchDetailPage.tsx   # Chi tiết điều phối (tabs: schedule, assignments, changes)
└── WorkforceDispatchSchedulePage.tsx # Lịch điều phối (calendar/timeline view)
```

**Routes**:

- `/workforce-dispatch` → `WorkforceDispatchListPage`
- `/workforce-dispatch/:id` → `WorkforceDispatchDetailPage`
- `/workforce-dispatch/schedule` → `WorkforceDispatchSchedulePage`

---

#### `training-safety/` - HSE/Training

**Mô tả**: Đào tạo & an toàn lao động

```
pages/
├── TrainingListPage.tsx          # Danh sách đào tạo (filters: type, status, employee)
├── TrainingDetailPage.tsx        # Chi tiết đào tạo (tabs: info, participants, results)
├── TrainingCreatePage.tsx        # Tạo khóa đào tạo
└── SafetyIncidentsPage.tsx       # Sự cố an toàn (list + detail)
```

**Routes**:

- `/training` → `TrainingListPage`
- `/training/new` → `TrainingCreatePage`
- `/training/:id` → `TrainingDetailPage`
- `/safety/incidents` → `SafetyIncidentsPage`

---

#### `complaints/` - Ticketing/Workflow

**Mô tả**: Tiếp nhận & xử lý khiếu nại, SLA

```
pages/
├── ComplaintsListPage.tsx        # Danh sách khiếu nại (filters: status, priority, SLA)
├── ComplaintDetailPage.tsx       # Chi tiết khiếu nại (tabs: info, workflow, history, SLA)
└── ComplaintCreatePage.tsx      # Tạo khiếu nại
```

**Routes**:

- `/complaints` → `ComplaintsListPage`
- `/complaints/new` → `ComplaintCreatePage`
- `/complaints/:id` → `ComplaintDetailPage`

---

## 🎯 Best Practices

### 1. **Naming Convention**

- **Page files**: `FeatureNamePage.tsx` (PascalCase)
- **Route paths**: `/feature-name` (kebab-case)
- **Component files**: `FeatureNameList.tsx`, `FeatureNameForm.tsx`

### 2. **Route Structure**

```typescript
// routes.tsx example
const FeatureNameListPage = Loadable(lazy(() => import('./pages/FeatureNameListPage')));
const FeatureNameDetailPage = Loadable(lazy(() => import('./pages/FeatureNameDetailPage')));

const FeatureNameRoutes = {
  path: '/feature-name',
  element: <DashboardLayout />,
  children: [
    { path: '', element: <FeatureNameListPage /> },
    { path: 'new', element: <FeatureNameCreatePage /> },
    { path: ':id', element: <FeatureNameDetailPage /> },
    { path: ':id/edit', element: <FeatureNameEditPage /> },
  ]
};
```

### 3. **Page Component Structure**

```typescript
// FeatureNameListPage.tsx example
import MainCard from 'components/MainCard';
import FeatureNameList from '../components/FeatureNameList';
import { useFeatureName } from '../hooks/useFeatureName';

const FeatureNameListPage = () => {
  const { data, isLoading } = useFeatureName();

  return (
    <MainCard title="Feature Name">
      <FeatureNameList data={data} loading={isLoading} />
    </MainCard>
  );
};

export default FeatureNameListPage;
```

### 4. **Khi nào tách thành nhiều Pages?**

- ✅ **Tách**: Khi có chức năng khác biệt rõ ràng (List vs Detail vs Map vs Report)
- ✅ **Tách**: Khi cần route riêng cho từng màn hình
- ❌ **Không tách**: Khi chỉ là tab/view khác nhau trong cùng một màn hình (dùng tabs trong DetailPage)

### 5. **Khi nào dùng Tabs trong DetailPage?**

- ✅ **Dùng tabs**: Khi thông tin liên quan đến cùng một entity (info, history, documents)
- ❌ **Không dùng tabs**: Khi là các chức năng độc lập (List vs Map vs Report)
