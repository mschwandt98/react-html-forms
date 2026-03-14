import { useContext } from 'react';

import { FormContext } from '../FormContext';

export function useForm() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('`useForm` must be used within the form component.');
    }

    return context;
}
