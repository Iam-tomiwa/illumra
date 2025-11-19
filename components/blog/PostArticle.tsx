import Image from "next/image";
import { urlForImage } from "@/sanity/image";
import type { PostDocument } from "@/sanity/types";
import { RichText } from "./RichText";

interface PostArticleProps {
	post: PostDocument;
}

export function PostArticle({ post }: PostArticleProps) {
	const hero = post.coverImage?.asset?._ref
		? urlForImage(post.coverImage).width(1600).height(900).fit("crop").url()
		: null;
	const lqip = post.coverImage?.asset?.metadata?.lqip;

	const publishedDate = post.publishedAt
		? new Date(post.publishedAt).toLocaleDateString(undefined, {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: "Draft";

	return (
		<article className="mx-auto flex w-full max-w-3xl flex-col gap-10 pb-24">
			<header className="space-y-6">
				<div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-primary">
					{post.categories?.map(category => (
						<span
							key={category._id}
							className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary"
						>
							{category.title}
						</span>
					))}
				</div>
				<h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
					{post.title}
				</h1>
				{post.headline && (
					<p className="text-lg text-muted-foreground">{post.headline}</p>
				)}
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
					{post.author && (
						<div className="flex items-center gap-3">
							{post.author.headshot?.asset?._ref && (
								<div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
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
							<div className="leading-tight">
								<p className="font-medium text-foreground">{post.author.name}</p>
								{post.author.role && <p className="text-xs">{post.author.role}</p>}
							</div>
						</div>
					)}
					<span>Published {publishedDate}</span>
					{post.readingTime && (
						<span>≈ {post.readingTime} minute read</span>
					)}
				</div>
			</header>

			{hero && (
				<figure className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted shadow-md">
					<Image
						src={hero}
						alt={post.coverImage?.alt ?? post.title}
						fill
						priority={false}
						className="object-cover"
						placeholder={lqip ? "blur" : "empty"}
						blurDataURL={lqip ?? undefined}
					/>
					{post.coverImage?.caption && (
						<figcaption className="absolute bottom-4 right-4 rounded-full bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
							{post.coverImage.caption}
						</figcaption>
					)}
				</figure>
			)}

			{post.body && <RichText value={post.body} />}
		</article>
	);
}


