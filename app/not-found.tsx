import { Footer } from "@/components/footer";
import Navbar from "@/components/nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./globals.css";

export default function NotFoundPage() {
	return (
		<>
			<Navbar />
			<div className="flex flex-col items-center justify-center h-screen text-center mx-auto gap-4">
				<Image
					src="/404-illustration.png"
					alt="404"
					width={1200}
					height={1200}
					className="md:h-[40vh]! w-auto"
				/>
				<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
				<p className="text-lg">The page you are looking for does not exist.</p>
				<Button asChild>
					<Link href="/products">Explore Our Products</Link>
				</Button>
			</div>
			<Footer />
		</>
	);
}
