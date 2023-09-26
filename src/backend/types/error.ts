import { ZodIssue } from 'zod';

export interface ErrorResponse {
  message: string
  issues?: ZodIssue[]
}
