// ==============================|| FOREST AREAS FILTERS ||============================== //

import type { EntityStatus } from 'types/status';

import type { OwnershipType, CertificateType } from './enums';

export interface AreaRange {
  min?: number; // Diện tích tối thiểu (ha)
  max?: number; // Diện tích tối đa (ha)
}

export interface ForestAreaFilters {
  name?: string; // Tên vùng trồng - Tìm kiếm gần đúng
  code?: string; // Mã vùng trồng
  ownershipType?: OwnershipType; // Loại sở hữu: Công ty / Đối tác
  province?: string; // Tỉnh / Khu vực - Phân cấp theo vùng
  status?: EntityStatus; // Trạng thái: Hoạt động / Tạm ngưng
  certificates?: CertificateType[]; // Chứng chỉ: FSC / PEFC
  areaRange?: AreaRange; // Diện tích (ha) - Lọc theo khoảng
}
