import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../styles/toast.css";

type ToastKind = "success" | "error" | "info";

const CLASS_BY_KIND: Record<ToastKind, string> = {
  success: "app-toast app-toast--success",
  error: "app-toast app-toast--error",
  info: "app-toast app-toast--info",
};

function show(text: string, kind: ToastKind, duration = 3500) {
  Toastify({
    text,
    duration,
    gravity: "top",
    position: "right",
    close: true,
    stopOnFocus: true,
    className: CLASS_BY_KIND[kind],
  }).showToast();
}

export const toastSuccess = (text: string) => show(text, "success");
export const toastError = (text: string) => show(text, "error", 5000);
export const toastInfo = (text: string) => show(text, "info");
