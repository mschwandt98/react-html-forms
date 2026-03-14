import type { ReactEventHandler, SyntheticEvent } from 'react';

import { useFieldUtils } from './useFieldUtils';

type T = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function useOnInvalid(name: string, onInvalid?: ReactEventHandler<T>) {
    const { setError } = useFieldUtils(name);

    return (e: SyntheticEvent<T, Event>) => {
        e.preventDefault();
        onInvalid?.(e);

        const target = e.currentTarget ?? e.target;
        const { validity, dataset } = target;

        let message = target.validationMessage;

        if (validity.valueMissing && dataset.requiredMessage) {
            message = dataset.requiredMessage;
        } else if (validity.typeMismatch && dataset.typeMessage) {
            message = dataset.typeMessage;
        } else if (validity.tooShort && dataset.minlengthMessage) {
            message = dataset.minlengthMessage;
        } else if (validity.rangeUnderflow && dataset.minMessage) {
            message = dataset.minMessage;
        } else if (validity.patternMismatch && dataset.patternMessage) {
            message = dataset.patternMessage;
        }

        setError(message);
    };
}
