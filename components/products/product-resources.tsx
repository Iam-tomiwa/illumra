import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
// import type { ResourceLink } from "@/sanity.types";

type Application = {
	title?: string;
	url?: string;
};

export type FileAsset = {
	_id: string;
	_type: "sanity.fileAsset";
	url?: string;
	originalFilename?: string;
	size?: number;
};

export type ResourceLinkType = {
	_type: "resourceLink";
	title?: string;
	externalUrl?: string;
	file?: {
		_type: "file";
		asset?: FileAsset;
	};
};

type ProductResourcesProps = {
	downloads?: ResourceLinkType[];
	applications?: Application[];
	wiringDiagrams?: ResourceLinkType[];
};

export function ProductResources({
	downloads,
	applications,
	wiringDiagrams,
}: ProductResourcesProps) {
	const hasDownloads = downloads && downloads.length > 0;
	const hasApplications = applications && applications.length > 0;
	const hasWiringDiagrams = wiringDiagrams && wiringDiagrams.length > 0;

	if (!hasDownloads && !hasApplications && !hasWiringDiagrams) {
		return (
			<>
				<p className="text-sm">No resources found for this product.</p>
			</>
		);
	}

	const getFileUrl = (resource: ResourceLinkType): string | null => {
		if (resource.externalUrl) {
			return resource.externalUrl;
		}
		if (resource.file?.asset?.url) {
			return resource.file.asset.url;
		}
		return null;
	};

	return (
		<div className="space-y-6">
			{/* Downloads */}
			{hasDownloads && (
				<div>
					<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
						Downloads
					</h3>
					<div className="space-y-2">
						{downloads.map((download, index) => {
							const url = getFileUrl(download);
							if (!url) return null;

							return (
								<button key={index} className="justify-start block hover-border p-2">
									<Link
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 justify-start pb-2 hover-border-primary group hover:text-primary transition-colors"
									>
										<Icon icon="lucide:file-text" className="size-4" />
										<span>{download.title || "Download"}</span>
										{download.file?.asset?.size && (
											<span className="ml-auto text-xs text-muted-foreground group-hover:text-primary">
												{formatFileSize(download.file.asset.size)}
											</span>
										)}
										<Icon icon="lucide:download" className="size-5" />
									</Link>
								</button>
							);
						})}
					</div>
				</div>
			)}
			{/* Applications */}
			{hasApplications && (
				<div>
					<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
						<Icon icon="lucide:lightbulb" className="size-5" />
						Applications
					</h3>
					<div className="space-y-2">
						{applications.map((app, index) => {
							if (!app.url) return null;

							return (
								<Button
									key={index}
									asChild
									variant="outline"
									className="w-full justify-start"
								>
									<Link
										href={app.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2"
									>
										<Icon icon="lucide:external-link" className="size-4" />
										<span>{app.title || "View Application"}</span>
									</Link>
								</Button>
							);
						})}
					</div>
				</div>
			)}
			{/* Wiring Diagrams */}
			{hasWiringDiagrams && (
				<div>
					<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
						<Icon icon="lucide:git-branch" className="size-5" />
						Wiring Diagrams
					</h3>
					<div className="space-y-2">
						{wiringDiagrams.map((diagram, index) => {
							const url = getFileUrl(diagram);
							if (!url) return null;

							return (
								<Button
									key={index}
									asChild
									variant="outline"
									className="w-full justify-start"
								>
									<Link
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2"
									>
										<Icon icon="lucide:file-image" className="size-4" />
										<span>{diagram.title || "View Diagram"}</span>
										{diagram.file?.asset?.size && (
											<span className="ml-auto text-xs text-muted-foreground">
												{formatFileSize(diagram.file.asset.size)}
											</span>
										)}
									</Link>
								</Button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
