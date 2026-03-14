import { createContext } from 'react';

import type { FormErrors } from './models/FormErrors';
import type { ValidatorFn } from './models/ValidatorFn';

type FormContextType = {
    errors: FormErrors;
    initialValues: any;
    reset: () => void;
    setFieldError: (name: string, error?: string) => void;
    validators: Map<string, ValidatorFn>;
};

export const FormContext = createContext<FormContextType>(null!);
