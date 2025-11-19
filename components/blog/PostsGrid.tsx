import type { MoreStoriesQueryResult } from "@/sanity.types";
import { PostCard } from "./PostCard";

interface PostsGridProps {
	posts: MoreStoriesQueryResult;
	emptyState?: React.ReactNode;
}

export default function PostsGrid({ posts, emptyState }: PostsGridProps) {
	if (!posts?.length) {
		return (
			<div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
				{emptyState ?? (
					<>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							No stories yet
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Start publishing from the Studio to see posts appear here instantly.
						</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
			{posts.map(post => (
				<PostCard key={post._id} post={post} />
			))}
		</div>
	);
}
