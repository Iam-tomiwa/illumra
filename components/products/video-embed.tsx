"use client";

import { useMemo } from "react";

type VideoEmbedProps = {
	url: string;
	title?: string;
	className?: string;
};

/**
 * Extracts video ID and platform from YouTube or Vimeo URLs
 */
export function parseVideoUrl(url: string): {
	videoId: string;
	platform: "youtube" | "vimeo" | null;
} {
	// YouTube patterns
	const youtubePatterns = [
		/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
		/youtu\.be\/([a-zA-Z0-9_-]+)/,
		/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
		/youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
	];

	// Vimeo patterns
	const vimeoPatterns = [
		/vimeo\.com\/(\d+)/,
		/vimeo\.com\/video\/(\d+)/,
		/player\.vimeo\.com\/video\/(\d+)/,
	];

	// Check YouTube
	for (const pattern of youtubePatterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return { videoId: match[1], platform: "youtube" };
		}
	}

	// Check Vimeo
	for (const pattern of vimeoPatterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return { videoId: match[1], platform: "vimeo" };
		}
	}

	return { videoId: "", platform: null };
}

/**
 * Gets the thumbnail URL for a YouTube or Vimeo video
 */
export function getVideoThumbnail(url: string): string | null {
	const { videoId, platform } = parseVideoUrl(url);

	if (!platform || !videoId) {
		return null;
	}

	if (platform === "youtube") {
		// Try maxresdefault first (highest quality), fallback to hqdefault
		return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
	}

	if (platform === "vimeo") {
		// Use vumbnail.com service for Vimeo thumbnails
		return `https://vumbnail.com/${videoId}.jpg`;
	}

	return null;
}

export function VideoEmbed({ url, title, className = "" }: VideoEmbedProps) {
	const { videoId, platform } = useMemo(() => parseVideoUrl(url), [url]);

	if (!platform || !videoId) {
		return (
			<div
				className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
			>
				<p className="text-muted-foreground text-sm">
					Invalid video URL. Please provide a valid YouTube or Vimeo URL.
				</p>
			</div>
		);
	}

	const embedUrl =
		platform === "youtube"
			? `https://www.youtube.com/embed/${videoId}`
			: `https://player.vimeo.com/video/${videoId}`;

	return (
		<div className={`relative w-full h-full overflow-hidden ${className}`}>
			<iframe
				src={embedUrl}
				title={title || "Video player"}
				className="absolute inset-0 w-full h-full border-0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				loading="lazy"
			/>
		</div>
	);
}
