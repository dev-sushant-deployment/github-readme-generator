import axios from "axios";
import { toast } from "sonner";

export const customError = (error : unknown, toastId : string | number) => {
  if (axios.isAxiosError(error) && error.response) {
    const { message } = error.response.data;
    toast.error(message, { id: toastId });
  } else if (error instanceof Error && error.message) toast.error(error.message, { id: toastId });
  else toast.error("Failed to connect to Github. Please try again later.", { id: toastId });
}