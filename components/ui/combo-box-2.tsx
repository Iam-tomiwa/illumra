"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type Option = {
	value: string | undefined;
	label: string;
};

interface ComboBoxProps {
	options: Option[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
	contentClassname?: string;
	isLoading?: boolean;
	disabled?: boolean;
	showSearch?: boolean;
	allowEmpty?: boolean;
}

export default function ComboBox({
	options,
	value,
	onValueChange,
	placeholder = "Select option...",
	searchPlaceholder = "Search...",
	emptyMessage = "No option found.",
	className,
	contentClassname,
	isLoading,
	disabled,
	showSearch = true,
	allowEmpty = false,
}: ComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [activeIndex, setActiveIndex] = React.useState<number>(-1);

	const dropdownRef = React.useRef<HTMLDivElement>(null);
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

	const filteredOptions = React.useMemo(() => {
		if (!inputValue) return options;
		return options.filter(option =>
			option.label.toLowerCase().includes(inputValue.toLowerCase())
		);
	}, [options, inputValue]);

	const allOptions = allowEmpty
		? [{ label: placeholder, value: "" }, ...filteredOptions]
		: filteredOptions;

	const selectedLabel = React.useMemo(() => {
		if (value === undefined || (value === "" && allowEmpty)) return placeholder;
		return options.find(option => option.value === value)?.label || placeholder;
	}, [value, options, placeholder, allowEmpty]);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!buttonRef.current?.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	React.useEffect(() => {
		if (open) {
			setActiveIndex(-1);
		}
	}, [open, inputValue]);

	React.useEffect(() => {
		if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
			itemRefs.current[activeIndex]?.scrollIntoView({
				block: "nearest",
			});
		}
	}, [activeIndex]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!open) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex(prev => (prev + 1) % allOptions.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex(prev => (prev - 1 + allOptions.length) % allOptions.length);
		} else if (e.key === "Enter" && activeIndex >= 0) {
			e.preventDefault();
			const selected = allOptions[activeIndex];
			onValueChange?.(selected.value ?? "");
			setOpen(false);
			setInputValue("");
		} else if (e.key === "Escape") {
			e.preventDefault();
			setOpen(false);
		}
	};

	return (
		<div
			className={cn("relative inline-block w-[200px] justify-between", className)}
		>
			<Button
				ref={buttonRef}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				size="sm"
				disabled={disabled}
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					setOpen(prev => !prev);
				}}
				className={cn(
					"w-full border-border rounded-md  justify-between",
					className
				)}
			>
				<span className="overflow-hidden text-ellipsis">{selectedLabel}</span>
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>

			{open && (
				<div
					ref={dropdownRef}
					className={cn(
						"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover shadow-md",
						contentClassname
					)}
				>
					{showSearch && (
						<div className="w-full border-b items-center px-2 text-sm flex gap-2">
							<Search className="size-4 text-muted-foreground" />
							<input
								ref={inputRef}
								autoFocus
								type="text"
								placeholder={searchPlaceholder}
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								onKeyDown={handleKeyDown}
								className="flex-grow py-1 focus:outline-none"
							/>
						</div>
					)}

					<div
						className="max-h-48 overflow-auto text-sm"
						onKeyDown={!showSearch ? handleKeyDown : undefined}
					>
						{isLoading ? (
							<div className="px-4 py-2 text-muted-foreground">Loading...</div>
						) : allOptions.length === 0 ? (
							<div className="px-4 py-2 text-muted-foreground">{emptyMessage}</div>
						) : (
							<ul>
								{allOptions.map((option, index) => (
									<li
										key={`${option.value}-${index}`}
										ref={el => {
											itemRefs.current[index] = el;
										}}
										className={cn(
											"flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-accent",
											index === activeIndex && "bg-accent"
										)}
										onMouseEnter={() => setActiveIndex(index)}
										onClick={() => {
											onValueChange?.(option.value ?? "");
											setOpen(false);
											setInputValue("");
										}}
									>
										{option.label}
										{value === option.value && <Check className="h-4 w-4" />}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
