import { useEffect, useId, useRef } from "react";

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
  variant = "warning",
}) => {
  const dialogId = useId();
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const isSuccess = variant === "success";

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previousFocus = document.activeElement;
    cancelButtonRef.current?.focus();

    const keepFocusInside = (event) => {
      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement) || activeElement === dialog) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", keepFocusInside);

    return () => {
      document.removeEventListener("keydown", keepFocusInside);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-message`}
        tabIndex={-1}
        className="flex max-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none sm:max-h-[calc(100dvh-3rem)]"
      >
        <div aria-hidden="true" className={`h-1.5 shrink-0 ${isSuccess ? "bg-green-600" : "bg-red-600"}`} />

        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
          <div
            aria-hidden="true"
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${isSuccess ? "border-green-200 bg-green-50 text-green-700 [.theme-dark_&]:text-green-300" : "border-red-200 bg-red-50 text-red-700"}`}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {isSuccess ? (
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="m7.5 12 3 3 6-6" />
                </>
              ) : (
                <>
                  <path d="m10.3 4.5-8 13.8A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.7l-8-13.8a2 2 0 0 0-3.4 0Z" />
                  <path d="M12 9v4m0 3h.01" />
                </>
              )}
            </svg>
          </div>

          <p className={`text-[11px] font-bold uppercase tracking-widest ${isSuccess ? "text-green-700 [.theme-dark_&]:text-green-300" : "text-red-700"}`}>
            {isSuccess ? "Confirmation" : "Please confirm"}
          </p>
          <h2 id={`${dialogId}-title`} className="mt-2 break-words text-2xl font-bold leading-tight tracking-tight text-slate-900">
            {title}
          </h2>
          <p id={`${dialogId}-message`} className="mt-3 break-words text-sm leading-7 text-slate-600">
            {message}
          </p>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:px-8">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 motion-reduce:transition-none sm:flex-1"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none sm:flex-1 ${isSuccess ? "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500" : "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
