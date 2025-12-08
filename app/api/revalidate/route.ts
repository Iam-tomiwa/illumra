import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
	try {
		const { body, isValidSignature } = await parseBody<{
			_type: string;
			slug?: { current?: string };
		}>(req, process.env.SANITY_REVALIDATE_SECRET);

		if (!isValidSignature) {
			return new NextResponse("Invalid Signature", { status: 401 });
		}

		if (!body?._type) {
			return new NextResponse("Bad Request", { status: 400 });
		}

		// Revalidate based on document type
		switch (body._type) {
			case "homePage":
				revalidatePath("/");
				break;
			case "product":
				revalidatePath("/products");
				if (body.slug?.current) {
					revalidatePath(`/products/${body.slug.current}`);
				}
				break;
			case "productCategory":
			case "productVoltage":
			case "productFrequency":
			case "productProtocol":
				revalidatePath("/products");
				break;
			case "aboutPage":
				revalidatePath("/about");
				break;
			case "post":
				revalidatePath("/blog");
				if (body.slug?.current) {
					revalidatePath(`/blog/${body.slug.current}`);
				}
				break;
			case "store":
				revalidatePath("/stores");
				break;
			case "settings":
				// Settings affects the whole site (header, footer, etc.)
				revalidatePath("/", "layout");
				break;
			default:
				// For any other type, revalidate the home page as a fallback
				revalidatePath("/");
		}

		return NextResponse.json({
			status: 200,
			revalidated: true,
			now: Date.now(),
			body,
		});
	} catch (err: unknown) {
		console.error(err);
		return new NextResponse(err instanceof Error ? err.message : "Unknown error", { status: 500 });
	}
}
