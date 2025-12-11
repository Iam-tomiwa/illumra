"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { Icon } from "@iconify/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import type { ResolvedMediaAsset } from "@/sanity/lib/utils";
import { Lens } from "../ui/lens";
import { VideoAsset } from "@/sanity.types";
import { VideoEmbed, getVideoThumbnail } from "./video-embed";

type VideoItem = Omit<VideoAsset, "_type"> & { _key?: string };

type ProductImageSliderProps = {
	images: (ResolvedMediaAsset | undefined)[];
	videos?: VideoItem[] | null;
};

export function ProductImageSlider({ images, videos }: ProductImageSliderProps) {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const mainSwiperRef = useRef<SwiperType | null>(null);

	const validImages = images.filter(
		(img): img is ResolvedMediaAsset => img !== undefined && img.url !== undefined
	);

	const validVideos = (videos ?? []).filter(
		(vid): vid is VideoItem => vid !== undefined && vid.externalUrl !== undefined
	);

	const hasVideos = validVideos.length > 0;

	if (validImages.length === 0 && !hasVideos) {
		return (
			<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const totalSlides = validImages.length + validVideos.length;

	return (
		<div className="space-y-4 aspect-square min-w-[30%]">
			{/* Main Image Slider */}
			<div className="relative min-h-[500px] lg:h-[500px] bg-muted rounded-lg overflow-hidden w-full aspect-square">
				<Swiper
					modules={[Navigation, Thumbs]}
					thumbs={{
						swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
					}}
					onSwiper={swiper => {
						mainSwiperRef.current = swiper;
					}}
					onSlideChange={swiper => {
						setActiveIndex(swiper.activeIndex);
					}}
					className="h-full w-full aspect-square"
					navigation={{
						nextEl: ".swiper-button-next-main",
						prevEl: ".swiper-button-prev-main",
					}}
				>
					{validVideos.map((vid, index) => (
						<SwiperSlide className="relative h-full w-full" key={`video-${vid._key || index}`}>
							<VideoEmbed
								url={vid.externalUrl!}
								title={vid.title || undefined}
								className="h-full w-full"
							/>
						</SwiperSlide>
					))}
					{validImages.map((image, index) => (
						<SwiperSlide className="relative h-full w-full" key={`image-${index}`}>
							<Lens
								zoomFactor={3}
								lensSize={200}
								isStatic={false}
								ariaLabel="Zoom Area"
							>
								<Image
									src={image.url}
									alt={image.alt ?? `Product image ${index + 1}`}
									className="object-contain w-full h-full"
									height={500}
									width={500}
									unoptimized
								/>
							</Lens>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Thumbnail Slider */}
			{totalSlides > 1 && (
				<div className="relative">
					<Swiper
						modules={[FreeMode, Navigation, Thumbs]}
						onSwiper={setThumbsSwiper}
						slidesPerView="auto"
						spaceBetween={12}
						freeMode={true}
						scrollbar
						watchSlidesProgress={true}
						className="thumbnail-swiper"
						navigation={{
							nextEl: ".swiper-button-next-thumbs",
							prevEl: ".swiper-button-prev-thumbs",
						}}
					>
						{validVideos.map((vid, index) => {
							const videoThumbnail = getVideoThumbnail(vid.externalUrl!);
							return (
								<SwiperSlide key={`video-thumb-${vid._key || index}`} className="size-20! cursor-pointer">
									<div
										className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
											activeIndex === index
												? "border-primary"
												: "border-transparent hover:border-muted-foreground/50"
										}`}
										onClick={() => {
											mainSwiperRef.current?.slideTo(index);
										}}
									>
										{videoThumbnail ? (
											<>
												<Image
													src={videoThumbnail}
													alt={vid.title || `Video ${index + 1} thumbnail`}
													fill
													className="object-cover"
													sizes="80px"
													unoptimized
												/>
												<div className="absolute inset-0 flex items-center justify-center bg-black/20">
													<Icon
														icon="lucide:play"
														className="size-6 text-white drop-shadow-lg"
													/>
												</div>
											</>
										) : (
											<div className="relative w-full h-full flex items-center justify-center bg-muted">
												<Icon icon="lucide:play" className="size-8 text-foreground/70" />
											</div>
										)}
									</div>
								</SwiperSlide>
							);
						})}
						{validImages.map((image, index) => (
							<SwiperSlide key={`image-thumb-${index}`} className="size-20! cursor-pointer">
								<div
									className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
										activeIndex === (validVideos.length + index)
											? "border-primary"
											: "border-transparent hover:border-muted-foreground/50"
									}`}
									onClick={() => {
										mainSwiperRef.current?.slideTo(validVideos.length + index);
									}}
								>
									<Image
										src={image.url}
										alt={image.alt || `Thumbnail ${index + 1}`}
										fill
										className="object-cover"
										sizes="80px"
										unoptimized
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
					{totalSlides > 4 && (
						<>
							<button
								className="swiper-button-prev-thumbs absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors shadow-lg border border-primary"
								aria-label="Previous image"
							>
								<Icon icon="lucide:chevron-left" className="size-5" />
							</button>
							<button
								className="swiper-button-next-thumbs absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors shadow-lg border border-primary"
								aria-label="Next image"
							>
								<Icon icon="lucide:chevron-right" className="size-5" />
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
