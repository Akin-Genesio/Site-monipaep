import 'yup';

declare module 'yup' {
  export interface StringSchema {
    cpf(message?: string): StringSchema<string>;
  }
}