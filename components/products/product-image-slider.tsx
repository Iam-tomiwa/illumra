"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { Icon } from "@iconify/react";
import InnerImageZoom from "react-inner-image-zoom";
import "inner-image-zoom/lib/styles.min.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { resolveMediaAsset } from "@/sanity/lib/utils";
import type { ResolvedMediaAsset } from "@/sanity/lib/utils";

type ProductImageSliderProps = {
	images: (ResolvedMediaAsset | undefined)[];
};

export function ProductImageSlider({ images }: ProductImageSliderProps) {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const mainSwiperRef = useRef<SwiperType | null>(null);

	const validImages = images.filter(
		(img): img is ResolvedMediaAsset => img !== undefined && img.url !== undefined
	);

	if (validImages.length === 0) {
		return (
			<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 aspect-square min-w-[30%]">
			{/* Main Image Slider */}
			<div className="relative aspect-square max-h-[500px] bg-muted rounded-lg overflow-hidden w-full">
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
					className="h-full w-full"
					navigation={{
						nextEl: ".swiper-button-next-main",
						prevEl: ".swiper-button-prev-main",
					}}
				>
					{validImages.map((image, index) => (
						<SwiperSlide key={index}>
							<div className="relative h-full w-full [&_.iiz]:h-full [&_.iiz]:w-full [&_.iiz__img]:object-contain! [&_.iiz__zoom]:object-contain!">
								<InnerImageZoom
									src={image.url}
									zoomSrc={image.url}
									zoomType="hover"
									zoomScale={1.7}
									zoomPreload={index === 0}
									imgAttributes={{
										className: "object-contain w-full h-full",
										alt: image.alt || `Product image ${index + 1}`,
									}}
								/>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Custom Navigation Buttons */}
				{validImages.length > 1 && (
					<>
						<button
							className="swiper-button-prev-main absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors shadow-lg"
							aria-label="Previous image"
						>
							<Icon icon="lucide:chevron-left" className="size-5" />
						</button>
						<button
							className="swiper-button-next-main absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors shadow-lg"
							aria-label="Next image"
						>
							<Icon icon="lucide:chevron-right" className="size-5" />
						</button>
					</>
				)}
			</div>

			{/* Thumbnail Slider */}
			{validImages.length > 1 && (
				<div className="relative">
					<Swiper
						modules={[FreeMode, Navigation, Thumbs]}
						onSwiper={setThumbsSwiper}
						slidesPerView="auto"
						spaceBetween={12}
						freeMode={true}
						watchSlidesProgress={true}
						className="thumbnail-swiper"
					>
						{validImages.map((image, index) => (
							<SwiperSlide key={index} className="size-20! cursor-pointer">
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
									<Image
										src={image.url}
										alt={image.alt || `Thumbnail ${index + 1}`}
										fill
										className="object-cover"
										sizes="80px"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}
		</div>
	);
}
