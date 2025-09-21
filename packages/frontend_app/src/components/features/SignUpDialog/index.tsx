"use client";

import { useRouter } from "next/navigation";
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

export const SignUpDialog = () => {
  const supabase = createClient();

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, startLoadingTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    startLoadingTransition(async () => {
      e.preventDefault();

      const result = await supabase.auth.signInAnonymously();
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      toast.success("Signed up successfully");
      setIsOpen(false);

      router.push("/logout");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign Up Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              You can sign up to the app anonymously.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              Sign Up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
