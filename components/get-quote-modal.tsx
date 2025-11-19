"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { sanitizeSanityData } from "@/sanity/lib/utils";

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
	{ label: "Alabama", value: "AL" },
	{ label: "Alaska", value: "AK" },
	{ label: "Arizona", value: "AZ" },
	{ label: "Arkansas", value: "AR" },
	{ label: "California", value: "CA" },
	{ label: "Colorado", value: "CO" },
	{ label: "Connecticut", value: "CT" },
	{ label: "Delaware", value: "DE" },
	{ label: "District of Columbia", value: "DC" },
	{ label: "Florida", value: "FL" },
	{ label: "Georgia", value: "GA" },
	{ label: "Hawaii", value: "HI" },
	{ label: "Idaho", value: "ID" },
	{ label: "Illinois", value: "IL" },
	{ label: "Indiana", value: "IN" },
	{ label: "Iowa", value: "IA" },
	{ label: "Kansas", value: "KS" },
	{ label: "Kentucky", value: "KY" },
	{ label: "Louisiana", value: "LA" },
	{ label: "Maine", value: "ME" },
	{ label: "Maryland", value: "MD" },
	{ label: "Massachusetts", value: "MA" },
	{ label: "Michigan", value: "MI" },
	{ label: "Minnesota", value: "MN" },
	{ label: "Mississippi", value: "MS" },
	{ label: "Missouri", value: "MO" },
	{ label: "Montana", value: "MT" },
	{ label: "Nebraska", value: "NE" },
	{ label: "Nevada", value: "NV" },
	{ label: "New Hampshire", value: "NH" },
	{ label: "New Jersey", value: "NJ" },
	{ label: "New Mexico", value: "NM" },
	{ label: "New York", value: "NY" },
	{ label: "North Carolina", value: "NC" },
	{ label: "North Dakota", value: "ND" },
	{ label: "Ohio", value: "OH" },
	{ label: "Oklahoma", value: "OK" },
	{ label: "Oregon", value: "OR" },
	{ label: "Pennsylvania", value: "PA" },
	{ label: "Rhode Island", value: "RI" },
	{ label: "South Carolina", value: "SC" },
	{ label: "South Dakota", value: "SD" },
	{ label: "Tennessee", value: "TN" },
	{ label: "Texas", value: "TX" },
	{ label: "Utah", value: "UT" },
	{ label: "Vermont", value: "VT" },
	{ label: "Virginia", value: "VA" },
	{ label: "Washington", value: "WA" },
	{ label: "West Virginia", value: "WV" },
	{ label: "Wisconsin", value: "WI" },
	{ label: "Wyoming", value: "WY" },
];

const inquiryTypes = [
	{ label: "Commercial End User", value: "commercial" },
	{ label: "Residential End User", value: "residential" },
	{ label: "OEM", value: "oem" },
	{ label: "Distributor", value: "distributor" },
	{ label: "Other", value: "other" },
];

const quoteSchema = z.object({
	productId: z.string().min(1, "Select a product"),
	colorId: z.string().optional(),
	quantity: z
		.number()
		.int("Quantity must be a whole number")
		.min(1, "Quantity must be at least 1"),
	phone: z.string().min(7, "Enter a valid phone number"),
	name: z.string().min(2, "Name is required"),
	company: z.string().optional(),
	email: z.string().email("Enter a valid email"),
	state: z.string().min(2, "Select a state"),
	inquiryType: z.string().min(1, "Select an inquiry type"),
	message: z.string().max(1000, "Message is too long").optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function GetQuoteModal({
	productId,
	productTitle,
	productColors,
	productSku,
	open,
	setOpen,
}: {
	productId?: string;
	productTitle?: string;
	productColors?: ProductColor[] | null;
	productSku?: string | null;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
	const [isFetchingProducts, setIsFetchingProducts] = useState(false);

	const form = useForm<QuoteFormValues>({
		resolver: zodResolver(quoteSchema),
		defaultValues: {
			productId: productId ?? "",
			colorId: "",
			quantity: 1,
			phone: "",
			name: "",
			company: "",
			email: "",
			state: "",
			inquiryType: "commercial",
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
				const sanitizedProducts = sanitizeSanityData(products ?? []);
				const options: ProductOption[] = (sanitizedProducts as any[])
					.filter(Boolean)
					.map((product: any) => ({
						value: product?._id,
						label: product?.title ?? "Untitled Product",
						meta: {
							slug: product?.slug,
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
			form.setValue("colorId", "");
		}
	}, [open, form]);

	const productPlaceholder = useMemo(() => {
		if (isFetchingProducts) return "Loading products...";
		if (!productOptions.length) return "No products available";
		return "Select a product";
	}, [isFetchingProducts, productOptions.length]);

	const productIdValue = form.watch("productId");
	const selectedProduct = useMemo(() => {
		return productOptions.find(p => p.value === productIdValue);
	}, [productIdValue, productOptions]);

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

	const onSubmit = async (values: QuoteFormValues) => {
		try {
			// Format product name: "Product Name - Color - SKU"
			let productOfInterest = currentProductTitle;

			if (values.colorId && availableColors.length > 0) {
				const selectedColor = availableColors.find(
					(_, index) => index.toString() === values.colorId
				);
				if (selectedColor?.name) {
					productOfInterest = `${currentProductTitle} - ${selectedColor.name}`;
					if (selectedColor.partNumber) {
						productOfInterest += ` - ${selectedColor.partNumber}`;
					}
				}
			} else if (currentProductSku) {
				productOfInterest = `${currentProductTitle} - ${currentProductSku}`;
			}

			// Here you would send the form data including productOfInterest
			console.log("Product of Interest:", productOfInterest);
			console.log("Form values:", values);

			await new Promise(resolve => setTimeout(resolve, 800));
			toast.success("Quote request submitted");
			reset();
			setOpen(false);
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-4xl! z-10000">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">
						Request a Quote
					</DialogTitle>
					{/* <DialogDescription>
						Fill out the form and our team will reach out with pricing and lead times.
					</DialogDescription> */}
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FieldSet className="">
							<Field>
								<FieldLabel htmlFor="productId">
									Product of Interest<span className="text-destructive">*</span>
								</FieldLabel>
								<FieldContent>
									<Controller
										name="productId"
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
										errors={errors.productId ? [errors.productId] : undefined}
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

							<FieldGroup className="grid gap-4 md:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="quantity">
										Quantity<span className="text-destructive">*</span>
									</FieldLabel>
									<FieldContent>
										<Input
											id="quantity"
											type="number"
											min={1}
											placeholder="Quantity"
											{...register("quantity", { valueAsNumber: true })}
										/>
										<FieldError
											errors={errors.quantity ? [errors.quantity] : undefined}
										/>
									</FieldContent>
								</Field>
								<Field>
									<FieldLabel htmlFor="phone">
										Phone Number <span className="text-destructive">*</span>
									</FieldLabel>
									<FieldContent>
										<Input id="phone" placeholder="Phone Number" {...register("phone")} />
										<FieldError errors={errors.phone ? [errors.phone] : undefined} />
									</FieldContent>
								</Field>
							</FieldGroup>

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
									<FieldLabel htmlFor="state">
										State <span className="text-destructive">*</span>
									</FieldLabel>
									<FieldContent>
										<Controller
											name="state"
											control={control}
											render={({ field }) => (
												<ComboBox
													value={field.value}
													onValueChange={value => field.onChange(value)}
													options={states}
													placeholder="Select a state"
													className="w-full"
													contentClassname="max-h-64"
												/>
											)}
										/>
										<FieldError errors={errors.state ? [errors.state] : undefined} />
									</FieldContent>
								</Field>
								<Field>
									<FieldLabel htmlFor="inquiryType">
										Inquiry Type <span className="text-destructive">*</span>
									</FieldLabel>
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
													placeholder="Select an inquiry type"
													className="w-full"
													contentClassname="max-h-64"
												/>
											)}
										/>
										<FieldError
											errors={errors.inquiryType ? [errors.inquiryType] : undefined}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>

							<Field>
								<FieldLabel htmlFor="message">
									Application / Request / Message
								</FieldLabel>
								<FieldContent>
									<textarea
										rows={4}
										placeholder="Tell us about your project"
										id="message"
										className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										{...register("message")}
									/>
									<FieldError errors={errors.message ? [errors.message] : undefined} />
								</FieldContent>
							</Field>
						</FieldSet>

						<div className="flex justify-end">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
