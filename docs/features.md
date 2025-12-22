src
|**_ features
|_** forest # A. Forest Area Management — Quản lý vùng trồng & khai thác rừng
| |**_ forest-areas # Master + GIS — DS/chi tiết vùng trồng + mapview vùng rừng
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| | |**_ index.ts
| |
| |_** legal-certificates # Master/Compliance — hồ sơ pháp lý & chứng chỉ FSC/PEFC
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** harvesting # Harvesting domain — kế hoạch/lệnh/báo cáo khai thác
| | |**_ harvest-plans # Transaction/Planning — lập & quản lý kế hoạch khai thác
| | | |_** api
| | | |**_ pages
| | | |_** components
| | | |**_ hooks
| | | |_** validation
| | | |**_ types.ts
| | | |_** routes.tsx
| | |
| | |**_ harvest-orders # Transaction/Execution — lệnh khai thác, theo dõi thực thi/nghiệm thu
| | | |_** api
| | | |**_ pages
| | | |_** components
| | | |**_ hooks
| | | |_** validation
| | | |**_ types.ts
| | | |_** routes.tsx
| | |
| | |**_ harvest-reports # Report/Analytics — báo cáo sản lượng, so sánh kế hoạch vs thực tế
| | |_** pages
| | |**_ hooks
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** suppliers # Master + lịch sử giao dịch NCC
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** yield-estimation # Report/Forecast — ước tính sản lượng phục vụ kế hoạch & PAB
| |**_ pages
| |_** hooks
| |**_ types.ts
| |_** routes.tsx
|
|**_ logistics # B. Vận chuyển & Trạm cân — điều phối, tracking, trạm cân
| |_** fleet # Master — xe & tài xế
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** dispatching # Transaction/Scheduling — lệnh điều động, lịch điều phối, chuyến vận chuyển
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** tracking # Realtime/GIS — tracking lộ trình realtime, geofence/cảnh báo
| | |**_ pages
| | |_** hooks
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ weighbridge # IoT/Realtime — màn hình trạm cân, device status, nhận dữ liệu cân
| | |_** pages
| | |**_ hooks
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** weigh-tickets # Transaction — phiếu cân inbound/outbound
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** price-engine # Config/Rule Engine — bảng giá & công thức giá theo độ ẩm/tạp chất
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** partners # Master — đối tác dùng chung (khách hàng/nhà cung cấp/đại lý)
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** factory # C. Nhà máy & Sản xuất
| |**_ material-receipts # Transaction — phiếu nguyên liệu đầu vào (liên kết phiếu cân/lô/NCC)
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ production-plans # Planning — kế hoạch SX tuần/tháng
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ production-orders # Transaction/Execution — lệnh SX, định mức/tiêu hao/sản lượng
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ batches # Batch/Trace — lô SX & nguyên liệu, phục vụ truy xuất
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ shift-logs # Operation Log — nhật ký ca & sản lượng, sự cố/dừng máy
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ shipments # Transaction/Outbound — phiếu xuất hàng (kho/cảng)
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ quality # QC/Inspection — phiếu kiểm định, báo cáo độ ẩm/tạp chất, QC thành phẩm
| |_** api
| |**_ pages
| |_** components
| |**_ hooks
| |_** validation
| |**_ types.ts
| |_** routes.tsx
|
|**_ business # D. Phương án kinh doanh
| |_** pab # Core + Workflow — lập/duyệt PAB, trạng thái, báo cáo PAB
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** contracts # Transaction+Master — hợp đồng & giá, hiệu lực, điều khoản
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** payments # Finance Transaction + Workflow — payment order/phiếu chi
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** advances # Finance Transaction + Workflow — tạm ứng, phê duyệt, đối soát
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** sales # E. Bán hàng & Xuất khẩu
| |**_ export-orders # Sales Transaction — đơn hàng xuất khẩu, trạng thái fulfillment
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ crm # Master/CRM — hồ sơ khách hàng, lịch sử giao dịch
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ export-documents # Document/Compliance — invoice, packing list, versioning, export
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ vessel-tracking # Tracking/Document — theo dõi tàu, ETD/ETA, B/L
| | |_** pages
| | |**_ hooks
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** logistics-costing # Costing/Finance — ghi nhận & phân bổ chi phí logistics/dịch vụ
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** inventory # F. Tồn kho
| |**_ inventory-receipts # Transaction/Inbound Warehouse — phiếu nhập kho
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ inventory-issues # Transaction/Outbound Warehouse — phiếu xuất kho
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ sku # Master — danh mục SKU
| | |_** api
| | |**_ pages
| | |_** components
| | |**_ hooks
| | |_** validation
| | |**_ types.ts
| | |_** routes.tsx
| |
| |**_ stock # Report/Query — xem tồn theo kho/SKU/batch
| | |_** pages
| | |**_ hooks
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** stocktakes # Transaction+Audit — kiểm kê, chênh lệch, biên bản
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** transfers # Transaction/Internal Move — chuyển kho
| | |**_ api
| | |_** pages
| | |**_ components
| | |_** hooks
| | |**_ validation
| | |_** types.ts
| | |**_ routes.tsx
| |
| |_** traceability # Traceability — truy xuất nguồn gốc end-to-end
| |**_ pages
| |_** hooks
| |**_ types.ts
| |_** routes.tsx
|
|**_ admin # G. Quản trị & Nhân sự
|_** dashboards # Dashboard — KPI tổng hợp
| |**_ pages
| |_** hooks
| |**_ types.ts
| |_** routes.tsx
|
|**_ reports # Reports — P&L, sản xuất, tồn kho, nhập/xuất...
| |_** pages
| |**_ hooks
| |_** types.ts
| |**_ routes.tsx
|
|_** hr # HR — hồ sơ & hợp đồng nhân sự
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** timekeeping-payroll # HR Transaction — chấm công & tính lương
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** workforce-dispatch # HR Scheduling — điều phối nhân sự theo ca/tổ/line
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** training-safety # HSE/Training — đào tạo & an toàn lao động
| |**_ api
| |_** pages
| |**_ components
| |_** hooks
| |**_ validation
| |_** types.ts
| |**_ routes.tsx
|
|_** complaints # Ticketing/Workflow — tiếp nhận & xử lý khiếu nại, SLA
|**_ api
|_** pages
|**_ components
|_** hooks
|**_ validation
|_** types.ts
|\_\_\_ routes.tsx
