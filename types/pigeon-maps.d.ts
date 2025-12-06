declare module "pigeon-maps" {
	import { ReactNode, ComponentType } from "react";

	export interface MapProps {
		center?: [number, number];
		defaultCenter?: [number, number];
		zoom?: number;
		defaultZoom?: number;
		width?: number;
		height?: number;
		provider?: (x: number, y: number, z: number) => string;
		dprs?: number[];
		animate?: boolean;
		animateMaxScreens?: number;
		minZoom?: number;
		maxZoom?: number;
		metaWheelZoom?: boolean;
		metaWheelZoomWarning?: string;
		twoFingerDrag?: boolean;
		twoFingerDragWarning?: string;
		warningZIndex?: number;
		attribution?: ReactNode;
		attributionPrefix?: ReactNode;
		zoomSnap?: boolean;
		mouseEvents?: boolean;
		touchEvents?: boolean;
		onClick?: (event: { event: MouseEvent; latLng: [number, number]; pixel: [number, number] }) => void;
		onBoundsChanged?: (event: { center: [number, number]; zoom: number; bounds: { ne: [number, number]; sw: [number, number] }; initial: boolean }) => void;
		onAnimationStart?: () => void;
		onAnimationStop?: () => void;
		children?: ReactNode;
	}

	export interface MarkerProps {
		anchor: [number, number];
		payload?: unknown;
		offset?: [number, number];
		hover?: boolean;
		color?: string;
		width?: number;
		onClick?: (event: { event: MouseEvent; payload: unknown; anchor: [number, number] }) => void;
		onMouseOver?: (event: { event: MouseEvent; payload: unknown; anchor: [number, number] }) => void;
		onMouseOut?: (event: { event: MouseEvent; payload: unknown; anchor: [number, number] }) => void;
		children?: ReactNode;
	}

	export interface OverlayProps {
		anchor: [number, number];
		offset?: [number, number];
		children?: ReactNode;
	}

	export interface ZoomControlProps {
		style?: React.CSSProperties;
		buttonStyle?: React.CSSProperties;
	}

	export const Map: ComponentType<MapProps>;
	export const Marker: ComponentType<MarkerProps>;
	export const Overlay: ComponentType<OverlayProps>;
	export const ZoomControl: ComponentType<ZoomControlProps>;
}
