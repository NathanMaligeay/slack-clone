"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo, useEffect } from "react";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember ,[data?.isMember])

  useEffect(() => {
    if (isMember) {
        router.push(`/workspace/${workspaceId}`)
    }
  },[isMember, router, workspaceId])

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.jpg" width={60} height={60} alt="Logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <InputOTP
          maxLength={6}
          //value=
          onChange={() => {}}
          autoFocus={true}
          onComplete={handleComplete}
          className={cn(isPending && "opacity-75 cursor-not-allowed")}
        >
          <InputOTPGroup className="uppercase h-auto rounded-md border border-gray-500 flex items-center font-semibold">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/" className="font-semibold">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
