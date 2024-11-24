"use client";

import { useEffect, useState } from "react";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { AlertTriangle, Loader } from "lucide-react";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
	const workspaceId = useWorkspaceId();
	const memberId = useMemberId();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

	const { mutate, isPending } = useCreateOrGetConversation();

	useEffect(() => {
		mutate(
			{
				workspaceId,
				memberId,
			},
			{
				onSuccess(data) {
					setConversationId(data);
				},
				onError(error) {
					toast.error("Failed to create or get conversation")
				},
			}
		);
	}, [mutate, workspaceId, memberId]);

	if (isPending) {
		return (
			<div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
				<Loader className="animate-spin text-muted-foreground size-6" />
			</div>
		);
	}

	if (!conversationId) {
		return (
			<div className="h-full flex items-center justify-center flex-col gap-2">
				<AlertTriangle className="text-muted-foreground size-6" />
				<span className="text-sm text-muted-foreground">
					Conversation not found
				</span>
			</div>
		);
	}

	return <Conversation id={conversationId}/>;
};

export default MemberIdPage;
