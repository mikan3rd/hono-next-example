"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "#src/supabase/client";
import { useI18n } from "../../../locales/client";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";

const supabase = createClient();

export const LogoutDialog = () => {
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, startLoadingTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    startLoadingTransition(async () => {
      e.preventDefault();

      const result = await supabase.auth.signOut();
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      toast.success(t("toast.signOutSuccess"));
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("logout.trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("logout.title")}</DialogTitle>
            <DialogDescription data-testid="LogoutDialog-description">
              {t("logout.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                {t("logout.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {t("logout.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
