import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adId, adTitle, reason, reporterEmail, message } = body;

    // IN A PRODUCTION ENVIRONMENT:
    // You would use nodemailer or Resend to send an email.
    // Example:
    /*
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
      from: 'system@callgirl4u.com',
      to: 'worksunil26@gmail.com',
      subject: `AD REPORT: ${adTitle}`,
      text: `Reported Ad ID: ${adId}\nReason: ${reason}\nReporter: ${reporterEmail}\nMessage: ${message}`
    });
    */

    console.log("-----------------------------------------");
    console.log("NEW AD REPORT RECEIVED");
    console.log(`To: worksunil26@gmail.com`);
    console.log(`Ad ID: ${adId}`);
    console.log(`Ad Title: ${adTitle}`);
    console.log(`Reason: ${reason}`);
    console.log(`Reporter Email: ${reporterEmail || "Anonymous"}`);
    console.log(`Message: ${message}`);
    console.log("-----------------------------------------");

    return NextResponse.json({ success: true, message: "Report received" });
  } catch (error) {
    console.error("Report API Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
