import { ErrorOption } from 'react-hook-form';

interface HandleFormErrors {
  setError(key: string, error: ErrorOption): void;
  errors:
    | {
        errors: {
          [fieldName: string]: string[];
        };
      }
    | { [fieldName: string]: string[]; errors: never };
}

export function handleFormErrors({ setError, errors }: HandleFormErrors) {
  const errorObj = 'errors' in errors ? errors.errors : errors;
  for (const fieldName in errorObj) {
    setError(fieldName, { message: errorObj[fieldName] as any });
  }
}
