import {
	Avatar as AvatarPrimitive,
	AvatarImage,
	AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Author } from "@/sanity.types";
import { resolveMediaAsset } from "@/sanity/lib/utils";

interface Props {
	name: string;
	picture: Exclude<Author["picture"], undefined> | null;
	className?: string;
}

export default function ResolvedAvatar({ name, picture, className }: Props) {
	const resolvedPicture = picture
		? resolveMediaAsset(picture as any, { width: 96, height: 96, fit: "crop" })
		: undefined;

	return (
		<div className={cn("flex items-center text-xl custom-avatar", className)}>
			<AvatarPrimitive className="mr-4 h-12 w-12">
				<AvatarImage
					src={resolvedPicture?.url}
					alt={resolvedPicture?.alt || name || "Author"}
				/>
				<AvatarFallback>{name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
			</AvatarPrimitive>
			<div className={cn("text-pretty text-xl font-bold avatar-name")}>{name}</div>
		</div>
	);
}
