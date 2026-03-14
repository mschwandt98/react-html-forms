import type { ValidatorFn } from '../models/ValidatorFn';
import { useForm } from './useForm';

export function useFieldUtils(name: string) {
    const { errors, initialValues, setFieldError, validators } = useForm();

    const setError = (error?: string) => {
        setFieldError(name, error);
    };

    const addValidator = (validatorFn: ValidatorFn) => {
        validators.set(name, validatorFn);
    };

    const removeValidator = () => validators.delete(name);

    return {
        error: errors[name],
        initialValue: initialValues[name],
        addValidator,
        removeValidator,
        setError
    };
}
