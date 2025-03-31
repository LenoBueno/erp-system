'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type FieldValidation<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

interface UseFormValidationProps<T> {
  initialValues: T;
  validationRules?: FieldValidation<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  showToast?: boolean;
}

interface UseFormValidationResult<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  props: UseFormValidationProps<T>
): UseFormValidationResult<T> {
  const { initialValues, validationRules = {}, onSubmit, showToast = true } = props;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  const validateField = useCallback(
    (field: keyof T) => {
      const fieldRules = validationRules[field] || [];
      const fieldErrors: string[] = [];

      fieldRules.forEach(rule => {
        if (!rule.validate(values[field])) {
          fieldErrors.push(rule.message);
        }
      });

      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors,
      }));

      return fieldErrors.length === 0;
    },
    [values, validationRules]
  );

  const validateForm = useCallback(() => {
    const fields = Object.keys(validationRules) as (keyof T)[];
    const isValid = fields.every(field => validateField(field));
    return isValid;
  }, [validateField, validationRules]);

  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [field]: value }));
      setIsDirty(true);
      if (touched[field]) {
        validateField(field);
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field);
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = validateForm();

      if (isValid) {
        try {
          await onSubmit?.(values);
          if (showToast) {
            toast({
              title: 'Sucesso',
              description: 'Formulário enviado com sucesso',
              variant: 'default',
            });
          }
        } catch (error) {
          if (showToast) {
            toast({
              title: 'Erro',
              description: error instanceof Error ? error.message : 'Erro ao enviar formulário',
              variant: 'destructive',
            });
          }
        }
      } else if (showToast) {
        toast({
          title: 'Erro',
          description: 'Por favor, corrija os erros no formulário',
          variant: 'destructive',
        });
      }
    },
    [values, validateForm, onSubmit, showToast, toast]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  const setFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      handleChange(field, value);
    },
    [handleChange]
  );

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateField,
    validateForm,
  };
}