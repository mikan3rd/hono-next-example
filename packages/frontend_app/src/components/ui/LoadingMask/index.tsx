import { Loader2Icon } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "../Dialog";

export const LoadingMask = () => {
  return (
    <Dialog open={true}>
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <div className="fixed inset-0 flex items-center justify-center">
          <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
        </div>
      </DialogPortal>
    </Dialog>
  );
};
