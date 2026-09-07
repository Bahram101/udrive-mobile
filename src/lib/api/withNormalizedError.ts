import axios from "axios";

// Unwraps the backend's `{ error: string }` body into a plain Error message,
// so mutation hooks don't each repeat the same axios try/catch.
export async function withNormalizedError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { error?: string } | undefined)
        ?.error;
      throw new Error(message ?? error.message);
    }
    throw error;
  }
}
