import { NextRequest, NextResponse } from "next/server";
import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
	SendSmtpEmail,
} from "@getbrevo/brevo";

interface QuoteFormValues {
	// ... (Your QuoteFormValues type remains the same)
	productSlug: string;
	productId: string;
	color?: string;
	productName: string;
	quantity: number;
	phone: string;
	name: string;
	company?: string;
	email: string;
	state: string;
	inquiryType: string;
	message?: string;
}

// Function to handle the POST request
export async function POST(req: NextRequest) {
	if (req.method !== "POST") {
		return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
	}

	try {
		const values: QuoteFormValues = await req.json();

		// 1. Initialize Brevo Client
		const apiInstance = new TransactionalEmailsApi();

		// Set the API Key using the dedicated API Key method
		apiInstance.setApiKey(
			TransactionalEmailsApiApiKeys.apiKey,
			process.env.NEXT_PUBLIC_B_API_KEY!
		);

		// 2. Construct the Email Content (remains largely the same)
		const emailBodyHTML = `
      <h1>🚨 New Quote Request Received 🚨</h1>
      <hr>
      <h2>Product Details</h2>
      <p><strong>Product ID:</strong> ${values.productSlug}</p>
      <p><strong>Quantity:</strong> ${values.quantity}</p>
      <hr>
      <h2>Contact Information</h2>
      <p><strong>Name:</strong> ${values.name}</p>
      <p><strong>Company:</strong> ${values.company || "N/A"}</p>
      <p><strong>Email:</strong> <a href="mailto:${values.email}">${values.email}</a></p>
      <p><strong>Phone:</strong> ${values.phone}</p>
      <p><strong>State:</strong> ${values.state}</p>
      <p><strong>Inquiry Type:</strong> ${values.inquiryType}</p>
      <hr>
      <h2>Message / Application</h2>
      <p>${values.message || "No specific message provided."}</p>
    `;

		// 3. Configure the Email to Send (use the imported class)
		const sendSmtpEmail = new SendSmtpEmail();
		sendSmtpEmail.to = [
			{ email: process.env.NEXT_PUBLIC_SITE_OWNER_EMAIL!, name: "Site Owner" },
		];
		sendSmtpEmail.sender = {
			email: process.env.NEXT_PUBLIC_SITE_OWNER_EMAIL!,
			name: "Illumra Quote Form",
		};
		sendSmtpEmail.subject = `NEW QUOTE REQUEST: ${values.name} - ${values.productId}`;
		sendSmtpEmail.htmlContent = emailBodyHTML;

		// 4. Send the Email via Brevo
		await apiInstance.sendTransacEmail(sendSmtpEmail);

		// 5. Success Response
		return NextResponse.json(
			{ message: "Quote submitted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error, { depth: 2 });
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
