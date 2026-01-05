// ==============================|| TRAINING & SAFETY TYPES - PUBLIC EXPORTS ||============================== //

/**
 * Central export file for all Training & Safety types
 * Import from here: import type { Training, TrainingFormData } from './types';
 */

// Export enums
export type { TrainingType, TrainingStatus, Department } from './enums';

// Export entity types
export type { Training } from './entity';

// Export form types
export type { TrainingFormData } from './form';

// Export constants
export { TRAINING_TYPE_OPTIONS, TRAINING_STATUS_OPTIONS, DEPARTMENT_OPTIONS, TRAINING_PATHS, TRAINING_URLS } from './constants';
