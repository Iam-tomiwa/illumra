import { NextRequest, NextResponse } from "next/server";
import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
	SendSmtpEmail,
} from "@getbrevo/brevo";

interface ContactFormValues {
	name: string;
	email: string;
	phone: string;
	subject?: string;
	message: string;
}

// Function to handle the POST request
export async function POST(req: NextRequest) {
	if (req.method !== "POST") {
		return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
	}

	try {
		const values: ContactFormValues = await req.json();

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

		const emailBodyHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
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
                New Contact Form Submission
              </h1>
              
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
                  ${values.subject ? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 15px; color: #333333;">
                      <strong style="color: #1a1a1a; min-width: 120px; display: inline-block;">Subject:</strong>
                      ${values.subject}
                    </td>
                  </tr>
                  ` : ""}
                </table>
              </div>
              
              <!-- Message Section -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #fbce03; padding-bottom: 10px;">
                  Message
                </h2>
                <p style="margin: 0; font-size: 15px; color: #333333; white-space: pre-wrap; line-height: 1.6;">
                  ${values.message}
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
			name: "Illumra Contact Form",
		};
		sendSmtpEmail.subject = values.subject 
			? `NEW CONTACT: ${values.subject} - ${values.name}` 
			: `NEW CONTACT: ${values.name}`;
		sendSmtpEmail.htmlContent = emailBodyHTML;

		// 4. Send the Email via Brevo
		await apiInstance.sendTransacEmail(sendSmtpEmail);

		// 5. Success Response
		return NextResponse.json(
			{ message: "Contact form submitted successfully" },
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

