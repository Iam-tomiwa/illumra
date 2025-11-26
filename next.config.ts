import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		// Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
		SC_DISABLE_SPEEDY: "false",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "static.wixstatic.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "kaylac929.wixsite.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "illumra.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
