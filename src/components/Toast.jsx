import { useEffect } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

const toastVariants = {
  success: {
    title: "Success",
    icon: CircleCheck,
    accent: "bg-green-500",
    iconStyle: "bg-green-50 text-green-700 [.theme-dark_&]:text-green-300",
  },
  error: {
    title: "Something went wrong",
    icon: CircleAlert,
    accent: "bg-red-600",
    iconStyle: "bg-red-50 text-red-700",
  },
  warning: {
    title: "Please note",
    icon: TriangleAlert,
    accent: "bg-amber-500",
    iconStyle: "bg-amber-50 text-amber-700 [.theme-dark_&]:bg-amber-950 [.theme-dark_&]:text-amber-300",
  },
  info: {
    title: "Information",
    icon: Info,
    accent: "bg-blue-500",
    iconStyle: "bg-blue-50 text-blue-700 [.theme-dark_&]:text-blue-300",
  },
};

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timeoutId);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const variant = Object.hasOwn(toastVariants, toast.type)
    ? toastVariants[toast.type]
    : toastVariants.success;
  const Icon = variant.icon;

  return (
    <div
      key={toast.id}
      className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-[60] flex max-h-[calc(100dvh-2rem)] animate-toast-in items-start gap-3 overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 pl-5 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.16)] motion-reduce:animate-none sm:top-6 sm:right-6 sm:left-auto sm:w-96"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${variant.accent}`} />
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${variant.iconStyle}`}
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-sm font-bold leading-5 text-slate-900">{variant.title}</p>
        <p className="mt-1 text-sm leading-6 break-words text-slate-600">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-mt-1 -mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
        aria-label="Dismiss notification"
      >
        <X size={18} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
