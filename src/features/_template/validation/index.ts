import * as Yup from 'yup';

// ==============================|| FEATURE_NAME VALIDATION ||============================== //

// TODO: Replace 'FeatureName' with your actual feature name
// TODO: Customize validation schema based on your form fields

export const featureNameValidationSchema = Yup.object().shape({
  // TODO: Add your validation rules
  // name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  // email: Yup.string().email('Invalid email').required('Email is required')
});

// TODO: Add more validation schemas as needed
// export const featureNameFilterValidationSchema = Yup.object().shape({ ... });
