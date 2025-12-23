// ==============================|| FOREST AREAS PUBLIC EXPORTS ||============================== //

/**
 * Public API exports for Forest Areas feature
 *
 * This file exports types, components, hooks that can be used by other features.
 * Only export what is necessary for inter-feature communication.
 */

// Export all types from types folder
export type {
  // Enums
  OwnershipType,
  CertificateType,
  TreeType,
  // Entity
  Coordinates,
  ForestAreaBoundary,
  ForestArea,
  // Form
  ForestAreaFormData,
  ForestAreaMapFormData,
  // Filters
  AreaRange,
  ForestAreaFilters,
  // Map
  MapLayer,
  MapViewConfig,
  MapEditMode,
  MapAction
} from './types';

// Export constants
export { OWNERSHIP_TYPE_OPTIONS, CERTIFICATE_OPTIONS, TREE_TYPE_OPTIONS, CURRENT_YEAR, MIN_PLANTING_YEAR } from './types';

// Export hooks (if needed by other features)
// export { useForestArea } from './hooks/useForestArea';

// Export components (if needed by other features)
// export { default as ForestAreaTable } from './components/ForestAreaTable';

// Export API service (if needed by other features)
// export { ForestAreaService } from './api';
