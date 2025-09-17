"use client";

import { toast } from "sonner";
import { createClient } from "../../../supabase/client";
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const result = await supabase.auth.signInAnonymously();
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    console.info(result.data);
    toast.success("Signed up successfully");
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              You can sign up to the app anonymously.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
