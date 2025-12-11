"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { useRef } from "react";
import { Button } from "../ui/button";
import type { Swiper as SwiperType } from "swiper";
import { MediaAsset, ProjectsContent } from "@/sanity.types";
import { resolveMediaAsset } from "@/sanity/lib/utils";

interface Project {
	id: string;
	title: string;
	image: string;
	category: string;
	href: string;
}

const demoProjects: Project[] = [
	{
		id: "1",
		title: "Residential Home Remodel",
		category: "Lighting Control",
		image:
			"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "2",
		title: "San Diego Convention Center",
		category: "HVAC & Lighting",
		image:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "3",
		title: "Temple-Tifereth Israel",
		category: "Wireless Automation",
		image:
			"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "4",
		title: "Worker's Compensation Building",
		category: "Energy Management",
		image:
			"https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "5",
		title: "Olympic Ice Skating Rink",
		category: "Smart Building",
		image:
			"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "6",
		title: "Marriott Courtyard - Hawaii",
		category: "Industrial Control",
		image:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
	{
		id: "7",
		title: "Penthouse Remodel",
		category: "Industrial Control",
		image:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
		href: "https://www.google.com",
	},
];

export function ProjectsSection({ projects, projectsHeading, projectsSubheading }: { projects: ProjectsContent[], projectsHeading?: string | null, projectsSubheading?: string | null }) {
	const swiperRef = useRef<SwiperType | null>(null);
	return (
		<section id="projects" className="py-20 bg-background">
			<div className="container mx-auto px-4">
				<div className="grid lg:grid-cols-2 gap-8 mb-12">
					<div>
						<h2 className="font-heading max-w-md text-4xl md:text-5xl font-semibold tracking-tight mb-4">
							{projectsHeading ?? "Projects We've Worked On So Far"}
						</h2>
					</div>
					<div>
						<p 
							className="text-lg text-muted-foreground"
							dangerouslySetInnerHTML={{ __html: projectsSubheading ?? "Explore our portfolio of successful installations across diverse industries. Each project showcases our commitment to delivering innovative wireless control solutions that enhance efficiency, and improve environmental sustainability." }}
						/>
					</div>
				</div>

				{/* Carousel Container */}
				<div className="relative group overflow-hidden">
					<Swiper
						modules={[Navigation, FreeMode, Autoplay]}
						spaceBetween={24}
						slidesPerView="auto"
						freeMode={true}
						grabCursor={true}
						autoplay={{
							delay: 2500,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						loop={true}
						onSwiper={swiper => {
							swiperRef.current = swiper;
						}}
						navigation={{
							nextEl: ".projects-swiper-button-next",
							prevEl: ".projects-swiper-button-prev",
						}}
						className="projects-swiper"
						breakpoints={{
							320: {
								slidesPerView: 1.3,
								spaceBetween: 16,
							},
							768: {
								slidesPerView: 2.5,
								spaceBetween: 24,
							},
							1280: {
								slidesPerView: 4,
								spaceBetween: 24,
							},
						}}
					>
						{projects.map(project => {
							const picture = project?.picture as MediaAsset | null | undefined;
							const imageResolved = picture
								? resolveMediaAsset({
										...picture,
										_type: "mediaAsset",
									} as MediaAsset)
								: undefined;
							return (
								<SwiperSlide key={project.url} className={`w-full`}>
									<Link
										href={project.url ?? ""}
										target="_blank"
										rel="noopener noreferrer"
										className={`relative hover:underline cursor-pointer text-white flex flex-col justify-end min-h-[420px] rounded-2xl shadow-lg p-4`}
									>
										<Image
											src={imageResolved?.url ?? ""}
											alt={imageResolved?.alt ?? ""}
											fill
											className={`object-cover`}
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
										<div className="relative z-50 text-white">
											<p className="text-xs uppercase text-yellow-400">
												{project.projectCategory}
											</p>
											<h3 className="text-2xl font-semibold">{project.title}</h3>
										</div>
									</Link>
								</SwiperSlide>
							);
						})}
					</Swiper>

					<div className="flex justify-between">
						{/* View All Link */}
						{/* <div className="text-center mt-8">
							<Link
								href="/projects"
								className="inline-flex items-center gap-2 font-semibold transition-colors"
							>
								<span>View All Projects</span>
								<Icon icon="solar:arrow-right-bold" className="size-5" />
							</Link>
						</div> */}

						{/* Navigation Arrows */}
						<div className="flex gap-4 pt-6 justify-end ml-auto">
							<Button
								variant="outline"
								size="icon"
								className="projects-swiper-button-prev"
								aria-label="Previous projects"
								onClick={() => swiperRef.current?.slidePrev()}
							>
								<Icon icon="lucide:arrow-left" className="size-5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="projects-swiper-button-next"
								aria-label="Next projects"
								onClick={() => swiperRef.current?.slideNext()}
							>
								<Icon icon="lucide:arrow-right" className="size-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
