import AutocompleteField from './AutocompleteField';
import DatePickerField from './DatePickerField';
import SelectField from './SelectField';
import TextField from './TextField';
import RichField from './RichField';
import NumberField from './NumberField';
import ToggleField from './ToggleField';
import CheckboxField from './CheckboxField';

const Field = {
  Autocomplete: AutocompleteField,
  DatePicker: DatePickerField,
  Select: SelectField,
  Text: TextField,
  Rich: RichField,
  Number: NumberField,
  Toggle: ToggleField,
  Checkbox: CheckboxField,
};

export default Field;
