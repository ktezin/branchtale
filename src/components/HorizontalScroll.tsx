"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type HorizontalScrollProps = {
	children: ReactNode;
	className?: string;
	containerClassName?: string;
};

export default function HorizontalScroll({
	children,
	className,
	containerClassName,
}: HorizontalScrollProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showLeft, setShowLeft] = useState(false);
	const [showRight, setShowRight] = useState(false);

	const updateScrollVisibility = () => {
		const el = scrollRef.current;
		if (!el) return;

		const { scrollLeft, scrollWidth, clientWidth } = el;
		setShowLeft(scrollLeft > 10);
		setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
	};

	const scroll = (dir: "left" | "right") => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: dir === "left" ? -300 : 300,
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		updateScrollVisibility();

		el.addEventListener("scroll", updateScrollVisibility);
		window.addEventListener("resize", updateScrollVisibility);

		return () => {
			el.removeEventListener("scroll", updateScrollVisibility);
			window.removeEventListener("resize", updateScrollVisibility);
		};
	}, []);

	return (
		<div className={clsx("relative", containerClassName)}>
			{showLeft && (
				<div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 dark:from-black" />
			)}
			{showRight && (
				<div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 dark:from-black" />
			)}

			{showLeft && (
				<button
					onClick={() => scroll("left")}
					className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow dark:bg-neutral-900 hover:scale-110 transition"
				>
					<ChevronLeftIcon width={20} />
				</button>
			)}

			{showRight && (
				<button
					onClick={() => scroll("right")}
					className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow dark:bg-neutral-900 hover:scale-110 transition"
				>
					<ChevronRightIcon width={20} />
				</button>
			)}

			<div
				ref={scrollRef}
				className={clsx(
					"flex gap-4 overflow-x-auto hide-scrollbar py-2 px-2 scroll-smooth",
					className
				)}
			>
				{children}
			</div>
		</div>
	);
}
