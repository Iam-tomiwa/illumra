"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import AlertBanner from "./alert-banner";

const Navbar: React.FC<{ className?: string; isDraftMode?: boolean }> = ({
	className,
	isDraftMode,
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSubMenuOpen, setIsSubMenuOpen] = useState<string | null>(null);

	const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
	const toggleSubMenu = (name: string) =>
		setIsSubMenuOpen(prev => (prev === name ? null : name));

	const navLinks = [
		// { name: "Home", path: "/" },
		{
			name: "About Us",
			submenu: [
				{ name: "About ILLUMRA", path: "/about" },
				{ name: "Become A Distributor", path: "/about#become-a-distributor" },
				{ name: "Become A Rep", path: "/about#rep" },
			],
		},
		{ name: "Where to Buy", path: "/distributors" },
		{ name: "Products", path: "/products" },
		{ name: "Blog", path: "/posts" },
		{
			name: "Resources",
			submenu: [
				{
					name: "Support",
					path: "https://illumra.freshdesk.com/support/home",
					target: "_blank",
				},
				// { name: "Tutorials", path: "/tutorials" },
				{ name: "FAQ", path: "/#faq" },
			],
		},
	];

	// Lock scroll when mobile menu is open
	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	return (
		<nav className={cn("sticky w-full top-0 z-50 bg-background", className)}>
			{isDraftMode && <AlertBanner />}
			<div className="container w-[95%] mx-auto py-2 relative">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center lg:ml-4 h-10 relative">
						<Image
							src="/illumra-logo.png"
							alt="Logo"
							height={40}
							width={120}
							className="h-10 w-auto"
							priority
						/>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex grow justify-center space-x-4">
						{navLinks.map(link =>
							link.submenu ? (
								<div
									key={link.name}
									className="relative group hover-border-primary hover:text-primary"
								>
									<button
										onClick={() => toggleSubMenu(link.name)}
										className="flex items-center gap-1 px-3 py-2 font-medium"
									>
										{link.name}
										<ChevronDown
											className={`size-6 transition-transform duration-200 ${
												isSubMenuOpen === link.name ? "rotate-180" : ""
											}`}
										/>
									</button>
									{/* Submenu */}
									<div
										className={`absolute min-w-[200px] overflow-clip left-0 mt-2 bg-background border rounded-xl shadow-lg text-black w-max transition-all duration-200 ${
											isSubMenuOpen === link.name
												? "opacity-100 visible translate-y-0"
												: "opacity-0 invisible -translate-y-2"
										} group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}
										onMouseLeave={() => setIsSubMenuOpen(null)}
									>
										{link.submenu.map(sub => (
											<Link
												key={sub.name}
												href={sub.path}
												target={sub.target}
												rel={sub.target === "_blank" ? "noopener noreferrer" : undefined}
												className="block px-4 py-2 text-sm hover:bg-muted"
											>
												{sub.name}
											</Link>
										))}
									</div>
								</div>
							) : (
								<Link
									key={link.name}
									href={link.path}
									className="px-3 py-2 rounded-md font-medium hover-border-primary hover:text-primary"
								>
									{link.name}
								</Link>
							)
						)}
					</div>

					{/* Desktop Button */}
					<div className="hidden lg:flex items-center">
						<Button asChild className="px-8! shadow-lg shadow-primary/20">
							<Link href="/contact">
								Get A Quote
								<Icon icon="solar:round-arrow-right-bold" className="size-7" />
							</Link>
						</Button>
					</div>

					{/* Mobile Toggle */}
					<div className="lg:hidden flex items-center">
						<button
							onClick={toggleMobileMenu}
							className="rounded-3xl p-2 border border-primary"
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed top-[64px] bottom-0 left-0 w-full bg-background transition-[clip-path] duration-500 ease-in-out overflow-y-auto z-40 ${
					!isMobileMenuOpen
						? "[clip-path:inset(0_0_100%_0)]"
						: "[clip-path:inset(0_0_0_0)]"
				} ${isDraftMode ? "top-[104px]" : "top-[64px]"}`}
			>
				<div className="py-12 space-y-6 w-[90%] mx-auto">
					{navLinks.map(link =>
						link.submenu ? (
							<div key={link.name} className="space-y-2">
								<button
									onClick={() => toggleSubMenu(link.name)}
									className="w-full flex justify-between items-center text-lg pb-4 border-b border-border font-medium"
								>
									{link.name}
									<ChevronDown
										className={`w-5 h-5 transition-transform duration-200 ${
											isSubMenuOpen === link.name ? "rotate-180" : ""
										}`}
									/>
								</button>
								{isSubMenuOpen === link.name && (
									<div className="pl-4 space-y-2">
										{link.submenu.map(sub => (
											<Link
												key={sub.name}
												href={sub.path}
												onClick={toggleMobileMenu}
												className="block text-base"
											>
												{sub.name}
											</Link>
										))}
									</div>
								)}
							</div>
						) : (
							<Link
								key={link.name}
								href={link.path}
								onClick={toggleMobileMenu}
								className="block text-lg pb-4 border-b border-border font-medium"
							>
								{link.name}
							</Link>
						)
					)}

					<Button asChild className="px-8! shadow-lg shadow-primary/20">
						<Link onClick={toggleMobileMenu} href="/contact">
							Get A Quote
							<Icon icon="solar:round-arrow-right-bold" className="size-7" />
						</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
