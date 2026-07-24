"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth.service";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const result = await logoutUser();

    if (result.success) {
      toast.success(result.message);

      router.refresh();
      router.push("/");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}