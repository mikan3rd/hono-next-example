"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, startLoadingTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);

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

      router.push("/login");
    });
  };

  useEffect(() => {
    supabase.auth.getUser().then((userResponse) => {
      if (userResponse.error) {
        setUser(null);
        toast.error(userResponse.error.message);
        return;
      }
      setUser(userResponse.data.user);
    });
  }, []);

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
              {user !== null ? (
                <>You are signed in as {user.id}.</>
              ) : (
                "You are signed out."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={user === null || loading}>
              Sign Out
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
