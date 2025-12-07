import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-hot-toast'; // Assuming we have or will add a toast library. For now, console shim.

// Shim for Toast until library is decided/installed
const showToast = ({ type, message }) => {
    console.log(`[TOAST-${type.toUpperCase()}] ${message}`);
    // In real implementation, this would trigger a UI toast
    // if (window.toast) window.toast[type](message);
};

export function useOperatorAction(options) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: options.mutationFn,
        onSuccess: (data, vars) => {
            if (options.successMessage) {
                showToast({ type: "success", message: options.successMessage });
            }

            if (options.invalidateKeys) {
                options.invalidateKeys.forEach((key) =>
                    qc.invalidateQueries({ queryKey: key })
                );
            }

            options.onCloseDrawer?.();
            options.onSuccess?.(data, vars);
        },
        onError: (error, vars) => {
            console.error("Action Failed:", error);
            const msg = options.errorMessage || error.message || "An unexpected error occurred.";
            showToast({ type: "error", message: msg });
            options.onError?.(error, vars);
        },
    });
}
