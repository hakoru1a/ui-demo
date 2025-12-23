// ==============================|| FOREST AREAS TYPES - PUBLIC EXPORTS ||============================== //

/**
 * Central export file for all Forest Areas types
 * Import from here: import type { ForestArea, ForestAreaFormData } from './types';
 */

// Export enums
export type { OwnershipType, CertificateType, TreeType } from './enums';

// Export entity types
export type { Coordinates, ForestAreaBoundary, ForestArea } from './entity';

// Export form types
export type { ForestAreaFormData, ForestAreaMapFormData } from './form';

// Export filter types
export type { AreaRange, ForestAreaFilters } from './filters';

// Export map types
export type { MapLayer, MapViewConfig, MapEditMode, MapAction } from './map';

// Export constants
export { OWNERSHIP_TYPE_OPTIONS, CERTIFICATE_OPTIONS, TREE_TYPE_OPTIONS, CURRENT_YEAR, MIN_PLANTING_YEAR } from './constants';
