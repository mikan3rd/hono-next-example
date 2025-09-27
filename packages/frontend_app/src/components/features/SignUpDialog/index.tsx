"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "#src/supabase/client";
import { usePostUserSignup } from "../../../client";
import { useUserContext } from "../../../context/UserContext";
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
  const { isOpenLoginDialog, setIsOpenLoginDialog } = useUserContext();

  const signupMutation = usePostUserSignup();

  const [loading, startLoadingTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    startLoadingTransition(async () => {
      e.preventDefault();

      const result = await supabase.auth.signInAnonymously();
      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      const response = await signupMutation.mutateAsync();

      if (response.status !== 200) {
        await supabase.auth.signOut();
        toast.error(`Failed to sign up: ${response.data.message}`);
        return;
      }

      toast.success("Signed up successfully");
      setIsOpenLoginDialog(false);
    });
  };

  return (
    <Dialog open={isOpenLoginDialog} onOpenChange={setIsOpenLoginDialog}>
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
