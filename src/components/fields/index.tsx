import AutocompleteField from './AutocompleteField';
import CheckboxField from './CheckboxField';
import DatePickerField from './DatePickerField';
import NumberField from './NumberField';
import RichField from './RichField';
import SelectField from './SelectField';
import TextField from './TextField';
import ToggleField from './ToggleField';

const Field = {
  Autocomplete: AutocompleteField,
  DatePicker: DatePickerField,
  Select: SelectField,
  Text: TextField,
  Rich: RichField,
  Number: NumberField,
  Toggle: ToggleField,
  Checkbox: CheckboxField
};

export default Field;
