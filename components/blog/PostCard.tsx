import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostListItem } from "@/sanity/types";
import { urlForImage } from "@/sanity/image";

interface PostCardProps {
	post: PostListItem;
	className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
	const coverImage = post.coverImage?.asset?._ref
		? urlForImage(post.coverImage).width(640).height(360).fit("crop").url()
		: null;

	const lqip = post.coverImage?.asset?.metadata?.lqip;
	const publishedDate = post.publishedAt
		? new Date(post.publishedAt).toLocaleDateString(undefined, {
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
				<div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
					<Image
						src={coverImage}
						alt={post.coverImage?.alt ?? post.title}
						fill
						className="object-cover transition duration-500 group-hover:scale-[1.03]"
						priority={false}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
						placeholder={lqip ? "blur" : "empty"}
						blurDataURL={lqip ?? undefined}
					/>
				</div>
			)}

			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-primary">
						{post.categories?.map(category => (
							<span
								key={category._id}
								className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary"
							>
								{category.title}
							</span>
						))}
					</div>
					<span className="text-xs font-medium uppercase text-muted-foreground">
						{publishedDate}
					</span>
				</div>

				<div className="space-y-3">
					<h3 className="text-xl font-semibold leading-tight text-foreground">
						{post.title}
					</h3>
					{post.headline && (
						<p className="text-sm text-muted-foreground line-clamp-3">
							{post.headline}
						</p>
					)}
				</div>

				<div className="mt-auto flex items-center justify-between pt-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-3">
						{post.author?.headshot?.asset?._ref && (
							<div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
								<Image
									src={
										urlForImage(post.author.headshot)
											.width(96)
											.height(96)
											.fit("crop")
											.url() ?? "/vercel.svg"
									}
									alt={post.author.headshot.alt ?? post.author.name}
									fill
									className="object-cover"
								/>
							</div>
						)}
						<div className="leading-snug">
							<p className="font-medium text-foreground">{post.author?.name}</p>
							{post.readingTime && (
								<p className="text-xs text-muted-foreground">
									≈ {post.readingTime} min read
								</p>
							)}
						</div>
					</div>

					<Link
						href={`/blog/${post.slug.current}`}
						className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/10"
					>
						Read <ArrowUpRight className="size-4" />
					</Link>
				</div>
			</div>
		</article>
	);
}


