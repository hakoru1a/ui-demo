// ==============================|| FOREST AREAS ENTITY ||============================== //

import type { EntityStatus } from 'types/status';

import type { OwnershipType, CertificateType, TreeType } from './enums';

export interface Coordinates {
  latitude: number; // Vĩ độ
  longitude: number; // Kinh độ
}

export interface ForestAreaBoundary {
  coordinates: Coordinates[]; // Tọa độ các điểm của polygon
  center: Coordinates; // Tọa độ trung tâm
  calculatedArea: number; // Diện tích tính toán từ polygon (ha)
}

export interface ForestArea {
  id: string; // ID vùng trồng
  code: string; // Mã vùng trồng (Auto-generate, Read-only)
  name: string; // Tên vùng trồng
  ownershipType: OwnershipType; // Loại sở hữu: Công ty / Đối tác
  ownerId?: string; // Chủ sở hữu / Đối tác ID (Bắt buộc nếu là đối tác)
  ownerName?: string; // Tên chủ sở hữu / Đối tác
  area: number; // Diện tích (ha) - > 0
  province: string; // Tỉnh / Khu vực
  treeType?: TreeType; // Loại cây trồng: Keo / Bạch đàn...
  plantingYear?: number; // Năm trồng
  status: EntityStatus; // Trạng thái: Hoạt động / Tạm ngưng
  certificates: CertificateType[]; // Chứng chỉ: FSC / PEFC
  notes?: string; // Ghi chú
  boundary?: ForestAreaBoundary; // Ranh giới vùng trồng (polygon)
  coordinates?: Coordinates; // Tọa độ địa lý (legacy, dùng boundary thay thế)
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
