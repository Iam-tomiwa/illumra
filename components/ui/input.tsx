import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";

export type InputProps = {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	containerClass?: string;
} & React.ComponentProps<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, startIcon, endIcon, containerClass, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		return (
			<div className={cn("relative flex items-center", containerClass)}>
				{startIcon && (
					<div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
						{startIcon}
					</div>
				)}
				<input
					ref={ref}
					data-slot="input"
					className={cn(
						"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						"focus-visible:border-ring focus-visible:ring-ring/50 ",
						"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive file:mr-4 file:px-4 file:rounded-md file:inline-flex file:h-7  file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
						startIcon && "pl-9",
						endIcon && "pr-9",
						className
					)}
					{...props}
					type={showPassword ? "text" : type}
				/>
				{endIcon && (
					<div className="absolute right-0 flex items-center z-[100]">{endIcon}</div>
				)}
				{type === "password" && (
					<button
						type="button"
						className="absolute cursor-pointer right-3 flex items-center"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeClosed className="size-4" />
						) : (
							<Eye className="size-4" />
						)}
					</button>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
