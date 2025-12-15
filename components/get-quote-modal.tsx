"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "./ui/field";
import ComboBox from "./ui/combo-box-2";
import { Form } from "./ui/form";
import { client } from "@/sanity/lib/client";
import { allProductsQuery } from "@/sanity/lib/queries";
import { sanitizeSanityData, sanitizeSanityStrings } from "@/sanity/lib/utils";

type ProductOption = {
	value: string;
	label: string;
	meta?: {
		slug?: string;
		colors?: Array<{
			name?: string | null;
			partNumber?: string | null;
			hex?: string | null;
		}>;
		sku?: string | null;
	};
};

type ProductColor = {
	name?: string | null;
	partNumber?: string | null;
	hex?: string | null;
};

const states = [
	{ label: "(Blank)", value: "" },
	{ label: "Alabama" },
	{ label: "Alaska" },
	{ label: "Arizona" },
	{ label: "Arkansas" },
	{ label: "California" },
	{ label: "Colorado" },
	{ label: "Connecticut" },
	{ label: "Delaware" },
	{ label: "District of Columbia" },
	{ label: "Florida" },
	{ label: "Georgia" },
	{ label: "Hawaii" },
	{ label: "Idaho" },
	{ label: "Illinois" },
	{ label: "Indiana" },
	{ label: "Iowa" },
	{ label: "Kansas" },
	{ label: "Kentucky" },
	{ label: "Louisiana" },
	{ label: "Maine" },
	{ label: "Maryland" },
	{ label: "Massachusetts" },
	{ label: "Michigan" },
	{ label: "Minnesota" },
	{ label: "Mississippi" },
	{ label: "Missouri" },
	{ label: "Montana" },
	{ label: "Nebraska" },
	{ label: "Nevada" },
	{ label: "New Hampshire" },
	{ label: "New Jersey" },
	{ label: "New Mexico" },
	{ label: "New York" },
	{ label: "North Carolina" },
	{ label: "North Dakota" },
	{ label: "Ohio" },
	{ label: "Oklahoma" },
	{ label: "Oregon" },
	{ label: "Pennsylvania" },
	{ label: "Rhode Island" },
	{ label: "South Carolina" },
	{ label: "South Dakota" },
	{ label: "Tennessee" },
	{ label: "Texas" },
	{ label: "Utah" },
	{ label: "Vermont" },
	{ label: "Virginia" },
	{ label: "Washington" },
	{ label: "West Virginia" },
	{ label: "Wisconsin" },
	{ label: "Wyoming" },
];

const inquiryTypes = [
	{ label: "Commercial End User", value: "Commercial End User" },
	{ label: "Residential End User", value: "Residential End User" },
	{ label: "OEM", value: "OEM" },
	{ label: "Distributor", value: "Distributor" },
	{ label: "Other", value: "Other" },
];

const quoteSchema = z.object({
	productSlug: z.string().optional(),
	colorId: z.string().optional(),
	phone: z.string().min(7, "Enter a valid phone number"),
	name: z.string().min(2, "Name is required"),
	company: z.string().optional(),
	email: z.string().email("Enter a valid email"),
	state: z.string().optional(),
	inquiryType: z.string().optional(),
	message: z.string().max(1000, "Message is too long").optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;
type GetQuoteModalFormProps = {
	productSlug?: string;
	productTitle?: string;
	productColors?: ProductColor[] | null;
	productSku?: string | null;
	selectedColor?: ProductColor | undefined;
	open?: boolean;
	setOpen?: (open: boolean) => void;
};
export function GetQuoteModalForm({
	productSlug,
	productTitle,
	productColors,
	productSku,
	selectedColor,
	open,
	setOpen,
}: GetQuoteModalFormProps) {
	const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
	const [isFetchingProducts, setIsFetchingProducts] = useState(false);

	const form = useForm<QuoteFormValues>({
		resolver: zodResolver(quoteSchema),
		defaultValues: {
			productSlug: productSlug ?? "",
			colorId: selectedColor?.name
				? selectedColor.name + "-" + selectedColor.partNumber
				: "",
			phone: "",
			name: "",
			company: "",
			email: "",
			state: "",
			inquiryType: "Commercial End User",
			message: "",
		},
	});

	const {
		handleSubmit,
		control,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = form;

	useEffect(() => {
		let isMounted = true;
		setIsFetchingProducts(true);
		client
			.fetch(allProductsQuery)
			.then(products => {
				if (!isMounted) return;
				const sanitizedProducts = sanitizeSanityStrings(products ?? []);
				const options: ProductOption[] = (sanitizedProducts as any[])
					.filter(Boolean)
					.map((product: any) => ({
						value: product?.slug || "",
						label: product?.title ?? "Untitled Product",
						meta: {
							slug: product?.slug || "",
							colors: product?.colors,
							sku: product?.sku,
						},
					}));
				setProductOptions(options);
			})
			.catch(() => {
				toast.error("Unable to load products. Please try again.");
			})
			.finally(() => {
				if (isMounted) {
					setIsFetchingProducts(false);
				}
			});
		return () => {
			isMounted = false;
		};
	}, []);

	// Reset color selection when modal closes
	useEffect(() => {
		if (!open) {
			form.setValue("productSlug", productSlug ?? "");
			form.setValue(
				"colorId",
				selectedColor?.name
					? selectedColor.name + "-" + selectedColor.partNumber
					: ""
			);
		}
	}, [open, form, selectedColor, productSlug]);

	const productPlaceholder = useMemo(() => {
		if (isFetchingProducts) return "Loading products...";
		if (!productOptions.length) return "No products available";
		return "Select a product";
	}, [isFetchingProducts, productOptions.length]);

	const productSlugValue = form.watch("productSlug");
	const selectedProduct = useMemo(() => {
		return productOptions.find(p => p.value === productSlugValue);
	}, [productSlugValue, productOptions]);

	const availableColors = useMemo(() => {
		// Use props if available (from product page), otherwise use selected product
		if (productColors && productColors.length > 0) {
			return productColors;
		}
		return selectedProduct?.meta?.colors ?? [];
	}, [productColors, selectedProduct]);

	const colorOptions = useMemo(() => {
		return availableColors.map(color => ({
			value: color.name ? color.name + "-" + color.partNumber : "",
			label: color.name || "Unnamed",
			meta: {
				partNumber: color.partNumber,
				hex: color.hex,
			},
		}));
	}, [availableColors]);

	const currentProductTitle = productTitle || selectedProduct?.label || "";
	const currentProductSku = productSku || selectedProduct?.meta?.sku || "";

	// Update the client-side onSubmit function
	const onSubmit = async (values: QuoteFormValues) => {
		try {
			// Get product details from selected product or props
			const finalProductSlug =
				productSlug || selectedProduct?.value || values.productSlug || "";
			const finalProductName = currentProductTitle || "Not specified";

			// Format product name: "Product Name - Color - SKU"
			let productOfInterest = finalProductName;

			if (values.colorId && availableColors.length > 0) {
				const selectedColorObj = availableColors.find(
					color =>
						color.name &&
						color.partNumber &&
						`${color.name}-${color.partNumber}` === values.colorId
				);
				if (selectedColorObj?.name) {
					productOfInterest = `${finalProductName} - ${selectedColorObj.name}`;
					if (selectedColorObj.partNumber) {
						productOfInterest += ` - ${selectedColorObj.partNumber}`;
					}
				}
			} else if (currentProductSku) {
				productOfInterest = `${finalProductName} - ${currentProductSku}`;
			}

			const response = await fetch("/api/submit-quote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					sanitizeSanityData({
						...values,
						productSlug: finalProductSlug || "not-specified",
						productName: finalProductName,
						productOfInterest,
						quantity: 0, // Keep for API compatibility but not required from form
					})
				),
			});

			if (!response.ok) {
				throw new Error("Failed to send quote request.");
			}

			toast.success("Quote request submitted");
			reset();
			setOpen?.(false);
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<FieldSet className="">
					<Field>
						<FieldLabel htmlFor="productSlug">
							Product of Interest
						</FieldLabel>
						<FieldContent>
							<Controller
								name="productSlug"
								control={control}
								render={({ field }) => (
									<ComboBox
										value={field.value}
										onValueChange={value => {
											field.onChange(value);
											// Reset color when product changes
											form.setValue("colorId", "");
										}}
										options={productOptions}
										placeholder={productPlaceholder}
										isLoading={isFetchingProducts}
										className="w-full"
										contentClassname="max-h-64"
									/>
								)}
							/>
							<FieldError
								errors={errors.productSlug ? [errors.productSlug] : undefined}
							/>
						</FieldContent>
					</Field>

					{colorOptions.length > 0 && (
						<Field>
							<FieldLabel htmlFor="colorId">Color</FieldLabel>
							<FieldContent>
								<Controller
									name="colorId"
									control={control}
									render={({ field }) => (
										<ComboBox
											value={field.value}
											onValueChange={value => field.onChange(value)}
											options={colorOptions}
											placeholder="Select a color (optional)"
											className="w-full"
											contentClassname="max-h-64"
										/>
									)}
								/>
							</FieldContent>
						</Field>
					)}

					<Field>
						<FieldLabel htmlFor="phone">
							Phone Number <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input id="phone" placeholder="Phone Number" {...register("phone")} />
							<FieldError errors={errors.phone ? [errors.phone] : undefined} />
						</FieldContent>
					</Field>

					<FieldGroup className="grid gap-4 md:grid-cols-2">
						<Field>
							<FieldLabel htmlFor="name">
								Name <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<Input id="name" placeholder="Name" {...register("name")} />
								<FieldError errors={errors.name ? [errors.name] : undefined} />
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="company">Company</FieldLabel>
							<FieldContent>
								<Input id="company" placeholder="Company" {...register("company")} />
							</FieldContent>
						</Field>
					</FieldGroup>

					<Field>
						<FieldLabel htmlFor="email">
							Email <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input
								id="email"
								placeholder="Email"
								type="email"
								{...register("email")}
							/>
							<FieldError errors={errors.email ? [errors.email] : undefined} />
						</FieldContent>
					</Field>

					<FieldGroup className="grid gap-4 md:grid-cols-2">
						<Field>
							<FieldLabel htmlFor="state">State</FieldLabel>
							<FieldContent>
								<Controller
									name="state"
									control={control}
									render={({ field }) => (
										<ComboBox
											value={field.value}
											onValueChange={value => field.onChange(value)}
											options={states.map(state => ({
												value: state.label,
												label: state.label,
											}))}
											placeholder="Select a state (optional)"
											className="w-full"
											contentClassname="max-h-64"
										/>
									)}
								/>
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="inquiryType">Inquiry Type</FieldLabel>
							<FieldContent>
								<Controller
									name="inquiryType"
									control={control}
									render={({ field }) => (
										<ComboBox
											showSearch={false}
											value={field.value}
											onValueChange={value => field.onChange(value)}
											options={inquiryTypes}
											placeholder="Select an inquiry type (optional)"
											className="w-full"
											contentClassname="max-h-64"
										/>
									)}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>

					<Field>
						<FieldLabel htmlFor="message">Application / Request / Message</FieldLabel>
						<FieldContent>
							<textarea
								rows={4}
								placeholder="Tell us about your project"
								id="message"
								className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:border-primary"
								{...register("message")}
							/>
							<FieldError errors={errors.message ? [errors.message] : undefined} />
						</FieldContent>
					</Field>
				</FieldSet>

				<div className="flex justify-end">
					<Button
						className="w-full md:w-auto mt-2"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default function GetQuoteModal({
	open,
	setOpen,
	...props
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
} & GetQuoteModalFormProps) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-4xl! z-10000">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">
						Request a Quote
					</DialogTitle>
				</DialogHeader>
				<GetQuoteModalForm open={open} setOpen={setOpen} {...props} />
			</DialogContent>
		</Dialog>
	);
}
