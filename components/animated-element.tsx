"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { inView } from "motion";

interface AnimatedElementProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function AnimatedElement({
	children,
	className = "",
	delay = 0,
}: AnimatedElementProps) {
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
				margin: "-50px",
			}
		);

		return () => {
			stop();
		};
	}, [delay]);

	const style = {
		opacity: isVisible ? 1 : 0,
		transform: isVisible ? "translateY(0)" : "translateY(20px)",
		transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
	};

	return (
		<div ref={ref} className={className} style={style}>
			{children}
		</div>
	);
}
