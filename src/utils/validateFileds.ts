export interface FieldValidation {
  name: string;
  value: string | number | Date | undefined | null;
  message: string;
}

export function validateFields(
  fields: FieldValidation[],
  setErrorByField: (name: string, message: string) => void,
): boolean {
  for (const field of fields) {
    const isEmpty =
      field.value === undefined ||
      field.value === null ||
      (typeof field.value === "string" && !field.value.trim()) ||
      (field.value instanceof Date && isNaN(field.value.getTime()));

    if (isEmpty) {
      setErrorByField(field.name, field.message);
      return false;
    }
  }
  return true;
}
