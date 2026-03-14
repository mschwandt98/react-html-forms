import { ErrorSummary } from './components/ErrorSummary';
import { Fieldset as BaseFieldset, type FieldsetProps } from './components/Fieldset';
import { Form as BaseForm, type FormProps } from './components/Form';
import { Input as BaseInput, type InputProps } from './components/Input';
import { Select as BaseSelect, type SelectProps } from './components/Select';
import { SubmitButton as BaseSubmitButton, type SubmitButtonProps } from './components/SubmitButton';
import { Textarea as BaseTextarea, type TextareaProps } from './components/Textarea';

export function createFormComponents<T extends Record<string, any>>() {
    return {
        ErrorSummary,
        Fieldset: <Name extends keyof T & string>(props: FieldsetProps<T, Name>) => (
            <BaseFieldset<T, Name> {...props} />
        ),
        Form: (props: FormProps<T>) => <BaseForm {...props} />,
        Input: <Name extends keyof T & string>(props: InputProps<T, Name>) => <BaseInput {...props} />,
        Select: <Name extends keyof T & string>(props: SelectProps<T, Name>) => <BaseSelect {...props} />,
        SubmitButton: <Name extends keyof T & string>(props: SubmitButtonProps<T, Name>) => (
            <BaseSubmitButton<T, Name> {...props} />
        ),
        Textarea: <Name extends keyof T & string>(props: TextareaProps<T, Name>) => <BaseTextarea {...props} />
    };
}
