"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "#src/supabase/client";
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
      toast.success("Signed out successfully");
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign Out Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription data-testid="LogoutDialog-description">
              You are signed in
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              Sign Out
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
