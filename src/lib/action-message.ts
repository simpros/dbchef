export type ActionMessage = SuccessMessage | ErrorMessage;

type SuccessMessage = { success: true; message: string; redirect?: string };
type ErrorMessage = { success: false; message: string };
