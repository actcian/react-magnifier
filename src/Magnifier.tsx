import "./style.scss";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import React, { useState, useEffect, useRef } from "react";

type mgShape = "circle" | "square";

interface Props {
	// Image
	src: string;
	width: string | number;
	height: string | number;
	className: string;

	// Zoom image
	zoomImgSrc: string;
	zoomFactor: number;

	// Magnifying glass
	mgWidth: number;
	mgHeight: number;
	mgBorderWidth: number;
	mgShape: mgShape;
	mgShowOverflow: boolean;
	mgMouseOffsetX: number;
	mgMouseOffsetY: number;
	mgTouchOffsetX: number;
	mgTouchOffsetY: number;
}

const Magnifier: React.FC<Props> = (props) => {
	const {
		src,
		width,
		height,
		className,
		zoomImgSrc,
		zoomFactor,
		mgWidth,
		mgHeight,
		mgBorderWidth,
		mgShape,
		mgShowOverflow,
		mgMouseOffsetX,
		mgMouseOffsetY,
		mgTouchOffsetX,
		mgTouchOffsetY,
	} = props;

	const [showZoom, setShowZoom] = useState(false);
	const [mgOffsetX, setMgOffsetX] = useState(0);
	const [mgOffsetY, setMgOffsetY] = useState(0);
	const [relX, setRelX] = useState(0);
	const [relY, setRelY] = useState(0);
	const imgRef = useRef<HTMLImageElement>(null);
	const [imgBounds, setImgBounds] = useState<DOMRect | null>(null);

	const calcImgBounds = () => {
		if (imgRef.current) {
			setImgBounds(imgRef.current.getBoundingClientRect());
		}
	};

	const calcImgBoundsDebounced = debounce(calcImgBounds, 200);
	const onMouseMove = throttle((e: MouseEvent) => {
		if (imgBounds) {
			const target = e.target as HTMLElement;
			const newRelX = (e.clientX - imgBounds.left) / target.clientWidth;
			const newRelY = (e.clientY - imgBounds.top) / target.clientHeight;

			setMgOffsetX(mgMouseOffsetX);
			setMgOffsetY(mgMouseOffsetY);
			setRelX(newRelX);
			setRelY(newRelY);
			setShowZoom(true);
		}
	}, 20, { trailing: false });

	const onMouseOut = () => {
		setShowZoom(false);
	};

	const onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		if (imgBounds) {
			const target = e.target as HTMLElement;
			const newRelX = (e.targetTouches[0].clientX - imgBounds.left) / target.clientWidth;
			const newRelY = (e.targetTouches[0].clientY - imgBounds.top) / target.clientHeight;

			if (newRelX >= 0 && newRelY >= 0 && newRelX <= 1 && newRelY <= 1) {
				setMgOffsetX(mgTouchOffsetX);
				setMgOffsetY(mgTouchOffsetY);
				setRelX(newRelX);
				setRelY(newRelY);
				setShowZoom(true);
			} else {
				setShowZoom(false);
			}
		}
	};

	useEffect(() => {
		const imgElement = imgRef.current;
		if (imgElement) {
			imgElement.addEventListener("mouseenter", calcImgBounds);
			imgElement.addEventListener("mousemove", onMouseMove);
			imgElement.addEventListener("mouseout", onMouseOut);
			imgElement.addEventListener("touchstart", calcImgBounds);
			imgElement.addEventListener("touchmove", onTouchMove);
			imgElement.addEventListener("touchend", () => setShowZoom(false));

			window.addEventListener("resize", calcImgBoundsDebounced);
			window.addEventListener("scroll", calcImgBoundsDebounced, true);
		}

		return () => {
			if (imgElement) {
				imgElement.removeEventListener("mouseenter", calcImgBounds);
				imgElement.removeEventListener("mousemove", onMouseMove);
				imgElement.removeEventListener("mouseout", onMouseOut);
				imgElement.removeEventListener("touchstart", calcImgBounds);
				imgElement.removeEventListener("touchmove", onTouchMove);
				imgElement.removeEventListener("touchend", () => setShowZoom(false));
			}
			window.removeEventListener("resize", calcImgBoundsDebounced);
			window.removeEventListener("scroll", calcImgBoundsDebounced, true);
		};
	}, [imgBounds]);

	return (
		<div
			className={`magnifier ${className}`}
			style={{
				width,
				height,
				overflow: mgShowOverflow ? "visible" : "hidden",
			}}
		>
			<img
				className="magnifier-image"
				src={src}
				width="100%"
				height="100%"
				onLoad={calcImgBounds}
				ref={imgRef}
			/>
			{imgBounds && (
				<div
					className={`magnifying-glass ${showZoom ? "visible" : ""} ${mgShape}`}
					style={{
						width: mgWidth,
						height: mgHeight,
						left: `calc(${relX * 100}% - ${mgWidth / 2}px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
						top: `calc(${relY * 100}% - ${mgHeight / 2}px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
						backgroundImage: `url("${zoomImgSrc || src}")`,
						backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${relX * mgWidth}px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
						backgroundSize: `${zoomFactor * (imgBounds.width || 0)}% ${zoomFactor * (imgBounds.height || 0)}%`,
						borderWidth: mgBorderWidth,
					}}
				/>
			)}
		</div>
	);
};

export default Magnifier;
