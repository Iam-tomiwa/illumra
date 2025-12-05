import { NextRequest, NextResponse } from "next/server";
import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
	SendSmtpEmail,
} from "@getbrevo/brevo";

interface QuoteFormValues {
	productSlug: string;
	colorId?: string;
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

		// 2. Construct the Email Content with professional template
		const logoUrl =
			"https://res.cloudinary.com/tomiwadev/image/upload/v1764456817/image_2025-11-29_235333893_k8yazw.png";
		// Get the origin from the request
		const origin = req.nextUrl.origin;
		const siteUrl =
			origin || process.env.NEXT_PUBLIC_SITE_URL || "https://illumra.com";
		const companyEmail = "sales@illumra.com";
		const companyPhone = "(801) 349-1200";
		const headquarters = "Lindon, UT";

		// Parse color information from colorId (format: "ColorName-PartNumber")
		let colorName = "";
		let colorPartNumber = "";
		if (values.colorId) {
			const colorParts = values.colorId.split("-");
			if (colorParts.length >= 2) {
				colorName = colorParts[0];
				colorPartNumber = colorParts.slice(1).join("-"); // Handle part numbers with hyphens
			} else {
				colorName = values.colorId;
			}
		}

		const emailBodyHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background-color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <img src="${logoUrl}" alt="ILLUMRA Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h1 style="margin: 0 0 30px; font-size: 28px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
                New Quote Request Received
              </h1>
              
              <!-- Product Details Section -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #fbce03; padding-bottom: 10px;">
                  Product Details
                </h2>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Product:</strong>
                      <a href="${siteUrl}/products/${values.productSlug}" style="color: #0066cc; text-decoration: none; font-weight: 500;">
                        ${values.productName}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Quantity:</strong>
                      ${values.quantity}
                    </td>
                  </tr>
                  ${
																			values.colorId
																				? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Color:</strong>
                      ${colorName}${colorPartNumber ? ` (${colorPartNumber})` : ""}
                    </td>
                  </tr>
                  `
																				: ""
																		}
                </table>
              </div>
              
              <!-- Contact Information Section -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #fbce03; padding-bottom: 10px;">
                  Contact Information
                </h2>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Name:</strong>
                      ${values.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Company:</strong>
                      ${values.company || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Email:</strong>
                      <a href="mailto:${values.email}" style="color: #0066cc; text-decoration: none;">
                        ${values.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Phone:</strong>
                      <a href="tel:${values.phone.replace(/[^\d+]/g, "")}" style="color: #0066cc; text-decoration: none;">
                        ${values.phone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">State:</strong>
                      ${values.state}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Inquiry Type:</strong>
                      ${values.inquiryType}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Message Section -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #fbce03; padding-bottom: 10px;">
                  Message / Application
                </h2>
                <p style="margin: 0; font-size: 15px; color: #333333;">
                  ${values.message || "No specific message provided."}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #ffffff; font-weight: 600;">
                      ILLUMRA
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 15px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #cccccc; line-height: 1.6;">
                      <strong style="color: #ffffff;">Headquarters:</strong> ${headquarters}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 15px; border-top: 1px solid #333333; padding-top: 15px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #cccccc;">
                      <a href="mailto:${companyEmail}" style="color: #fbce03; text-decoration: none;">
                        ${companyEmail}
                      </a>
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #cccccc;">
                      <a href="tel:+18013491200" style="color: #fbce03; text-decoration: none;">
                        ${companyPhone}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 15px; border-top: 1px solid #333333;">
                    <p style="margin: 0; font-size: 12px; color: #999999;">
                      &copy; ${new Date().getFullYear()} ILLUMRA. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
		sendSmtpEmail.subject = `NEW QUOTE REQUEST: ${values.name} - ${values.productName}`;
		sendSmtpEmail.htmlContent = emailBodyHTML;

		// 4. Send the Email via Brevo
		await apiInstance.sendTransacEmail(sendSmtpEmail);

		// 5. Success Response
		return NextResponse.json(
			{ message: "Quote submitted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.dir(error, { depth: 2 });
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
