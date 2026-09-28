import { useEffect } from "react";

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timeoutId);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl sm:right-6 sm:top-6 ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-emerald-200 bg-white text-slate-900"
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isError ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}
        aria-hidden="true"
      >
        {isError ? "!" : "✓"}
      </span>
      <p className="pt-0.5 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto -mr-1 -mt-1 rounded-md p-1 text-slate-500 transition hover:bg-black/5 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
