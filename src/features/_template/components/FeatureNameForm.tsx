// project imports
// import MainCard from 'components/MainCard';
// import { TextField } from 'components/fields';

// TODO: Import your types and validation
// import { FeatureNameFormData } from '../types';
// import { featureNameValidationSchema } from '../validation';

// ==============================|| FEATURE_NAME FORM COMPONENT ||============================== //

// TODO: Replace 'FeatureNameForm' with your actual form component name
// TODO: Implement your form component

interface FeatureNameFormProps {
  // TODO: Define your props
  // initialValues?: FeatureNameFormData;
  // onSubmit: (values: FeatureNameFormData) => void;
  // onCancel?: () => void;
}

const FeatureNameForm = (_props: FeatureNameFormProps) => {
  // TODO: Implement your form logic
  // const formik = useFormik({
  //   initialValues: _props.initialValues || {
  //     // TODO: Add your default form values
  //   },
  //   validationSchema: featureNameValidationSchema,
  //   onSubmit: _props.onSubmit
  // });

  return (
    <div>
      {/* TODO: Implement your form UI */}
      {/* <form onSubmit={formik.handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
      </form> */}
      <p>Feature Name Form Component</p>
    </div>
  );
};

export default FeatureNameForm;
