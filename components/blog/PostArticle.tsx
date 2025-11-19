import Image from "next/image";
import type { PortableTextBlock } from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils";
import type { PostQueryResult } from "@/sanity.types";
import { RichText } from "@/components/blog/RichText";

interface PostArticleProps {
	post: NonNullable<PostQueryResult>;
}

export function PostArticle({ post }: PostArticleProps) {
	const coverImage = post.coverImage;
	const imageBuilder = coverImage ? urlForImage(coverImage) : undefined;
	const hero = imageBuilder
		? imageBuilder.width(1600).height(900).fit("crop").url()
		: null;

	const publishedDate = post.date
		? new Date(post.date).toLocaleDateString(undefined, {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: "Draft";

	return (
		<article className="mx-auto flex w-full max-w-3xl flex-col gap-10 pb-24">
			<header className="space-y-6">
				<h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
					{post.title}
				</h1>
				{post.excerpt && (
					<p className="text-lg text-muted-foreground">{post.excerpt}</p>
				)}
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
					{post.author && (
						<div className="flex items-center gap-3">
							{(() => {
								const authorPicture = post.author.picture;
								const pictureBuilder = authorPicture
									? urlForImage(authorPicture)
									: undefined;
								return pictureBuilder ? (
									<div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
										<Image
											src={
												pictureBuilder.width(96).height(96).fit("crop").url() ??
												"/vercel.svg"
											}
											alt={authorPicture?.alt ?? post.author.name}
											fill
											className="object-cover"
										/>
									</div>
								) : null;
							})()}
							<div className="leading-tight">
								<p className="font-medium text-foreground">{post.author.name}</p>
							</div>
						</div>
					)}
					<span>Published {publishedDate}</span>
				</div>
			</header>

			{hero && (
				<figure className="relative aspect-video overflow-hidden rounded-3xl bg-muted shadow-md">
					<Image
						src={hero}
						alt={post.coverImage?.alt ?? post.title ?? "Post cover image"}
						fill
						priority={false}
						className="object-cover"
					/>
					{post.coverImage?.alt && (
						<figcaption className="absolute bottom-4 right-4 rounded-full bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
							{post.coverImage.alt}
						</figcaption>
					)}
				</figure>
			)}

			{post.content && <RichText value={post.content as PortableTextBlock[]} />}
		</article>
	);
}
