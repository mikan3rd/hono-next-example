"use client";

import { useEffect, useId, useState, useTransition } from "react";
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
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";

export const SignUpDialog = () => {
  const supabase = createClient();
  const {
    isOpenLoginDialog,
    setIsOpenLoginDialog,
    setEnableAutoLogin,
    getLoginUser,
  } = useUserContext();

  const signupMutation = usePostUserSignup();

  const [loading, startLoadingTransition] = useTransition();
  const [displayName, setDisplayName] = useState("");
  const displayNameId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    startLoadingTransition(async () => {
      e.preventDefault();

      const result = await supabase.auth.signInAnonymously();
      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      const response = await signupMutation.mutateAsync({
        data: {
          display_name: displayName.trim(),
        },
      });

      if (response.status !== 200) {
        await supabase.auth.signOut();
        toast.error(`Failed to sign up: ${response.data.message}`);
        return;
      }

      const isLoggedIn = await getLoginUser();
      if (!isLoggedIn) {
        toast.error("Failed to login");
        return;
      }

      toast.success("Signed up successfully");
      setIsOpenLoginDialog(false);
      setDisplayName("");
    });
  };

  useEffect(() => {
    setEnableAutoLogin(!loading);
  }, [loading, setEnableAutoLogin]);

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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={displayNameId}>Your Name</Label>
              <Input
                id={displayNameId}
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !displayName.trim()}>
              Sign Up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
