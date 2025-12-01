"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { inView } from "motion";

interface AnimatedSectionProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function AnimatedSection({
	children,
	className = "",
	delay = 0,
}: AnimatedSectionProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!ref.current) return;

		const element = ref.current;

		// Animate when in view using Motion One's inView
		const stop = inView(
			element,
			() => {
				setTimeout(() => {
					setIsVisible(true);
				}, delay * 1000);
			},
			{
				margin: "-100px",
			}
		);

		return () => {
			stop();
		};
	}, [delay]);

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "translateY(0)" : "translateY(30px)",
				transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
			}}
		>
			{children}
		</div>
	);
}
