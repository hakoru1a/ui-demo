// ==============================|| FOREST AREAS FORM TYPES ||============================== //

import type { ForestAreaBoundary } from './entity';
import type { OwnershipType, ForestAreaStatus, CertificateType, TreeType } from './enums';

export interface ForestAreaFormData {
  code: string; // Mã vùng trồng (Auto-generate, Read-only)
  name: string; // Tên vùng trồng - Required
  ownershipType: OwnershipType; // Loại sở hữu - Required
  ownerId?: string; // Chủ sở hữu / Đối tác ID - Required nếu ownershipType = 'partner'
  area: number; // Diện tích (ha) - Required, > 0
  province: string; // Tỉnh / Khu vực - Required
  treeType?: TreeType; // Loại cây trồng
  plantingYear?: number; // Năm trồng
  status: ForestAreaStatus; // Trạng thái - Required, Default: 'active'
  certificates: CertificateType[]; // Chứng chỉ
  notes?: string; // Ghi chú
}

export interface ForestAreaMapFormData {
  boundary?: ForestAreaBoundary; // Bản đồ vùng trồng - Polygon boundary
  calculatedArea?: number; // Diện tích tính toán (Auto) - Tính từ bản đồ
  centerCoordinates?: {
    latitude: number; // Vĩ độ
    longitude: number; // Kinh độ
  }; // Tọa độ trung tâm (Auto, Read-only)
  showLayers?: boolean; // Lớp hiển thị - Bật/tắt lớp vùng
}
