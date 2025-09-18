"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

const supabase = createClient();

export const LogoutDialog = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await supabase.auth.signOut();
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success("Signed out successfully");
    setIsOpen(false);

    router.push("/login");
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
        <Button variant="outline">Sign Out</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              {user !== null ? (
                <>You are signed in as {user.id}.</>
              ) : (
                "You are signed out."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={user === null}>
              Sign Out
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
