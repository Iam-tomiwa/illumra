import React from "react";
import { cn } from "@/lib/utils";

export default function PagesHero({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-accent pt-20 pb-16 text-white min-h-[50vh] relative flex items-center",
				className
			)}
		>
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage:
						"url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)",
				}}
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="container relative z-10 mx-auto px-4">{children}</div>
		</div>
	);
}
