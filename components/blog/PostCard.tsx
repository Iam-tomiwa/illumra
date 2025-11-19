import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MoreStoriesQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

type PostListItem = NonNullable<MoreStoriesQueryResult[number]>;

interface PostCardProps {
	post: PostListItem;
	className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
	const coverImageBuilder = post.coverImage
		? urlForImage(post.coverImage)
		: undefined;
	const coverImage = coverImageBuilder
		? coverImageBuilder.width(640).height(360).fit("crop").url()
		: null;

	const publishedDate = post.date
		? new Date(post.date).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "Draft";

	return (
		<article
			className={cn(
				"group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
				className
			)}
		>
			{coverImage && (
				<div className="relative aspect-video w-full overflow-hidden bg-muted">
					<Image
						src={coverImage}
						alt={post.coverImage?.alt ?? post.title ?? "Post cover image"}
						fill
						className="object-cover transition duration-500 group-hover:scale-[1.03]"
						priority={false}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
					/>
				</div>
			)}

			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-start justify-between gap-2">
					<span className="text-xs font-medium uppercase text-muted-foreground">
						{publishedDate}
					</span>
				</div>

				<div className="space-y-3">
					<h3 className="text-xl font-semibold leading-tight text-foreground">
						{post.title}
					</h3>
					{post.excerpt && (
						<p className="text-sm text-muted-foreground line-clamp-3">
							{post.excerpt}
						</p>
					)}
				</div>

				<div className="mt-auto flex items-center justify-between pt-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-3">
						{(() => {
							const authorPicture = post.author?.picture;
							const pictureBuilder = authorPicture
								? urlForImage(authorPicture)
								: undefined;
							return pictureBuilder ? (
								<div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
									<Image
										src={
											pictureBuilder.width(96).height(96).fit("crop").url() ??
											"/vercel.svg"
										}
										alt={authorPicture?.alt ?? post.author?.name ?? "Author"}
										fill
										className="object-cover"
									/>
								</div>
							) : null;
						})()}
						<div className="leading-snug">
							<p className="font-medium text-foreground">{post.author?.name}</p>
						</div>
					</div>

					{post.slug && (
						<Link
							href={`/posts/${post.slug}`}
							className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/10"
						>
							Read <ArrowUpRight className="size-4" />
						</Link>
					)}
				</div>
			</div>
		</article>
	);
}
