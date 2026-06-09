import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  return NextResponse.json({
    templates: [
      {
        id: "ai-disclosure",
        title: "AI Assistance Disclosure",
        subtitle: "À coller dans tes CGV / conditions d'utilisation",
        content: `## AI Assistance Disclosure

I hereby disclose that I may use artificial intelligence tools ("AI") to assist in the creation, personalization, and optimization of communications with my fans and subscribers, including but not limited to:

- Email and newsletter content
- SMS and push notification copy
- Social media direct messages
- Content drafts and descriptions

All AI-generated or AI-assisted content is reviewed and approved by me before publication. I maintain full editorial control and responsibility for all content sent through my channels.

For questions about my use of AI, please contact me directly.`,
      },
      {
        id: "email-consent",
        title: "Email Marketing Consent",
        subtitle: "Formulaire RGPD compliant pour collecte d'email",
        content: `## Email Marketing Consent

By checking this box, I consent to receive marketing communications via email from [Creator Name].

I understand that:
- I can unsubscribe at any time via the link in each email
- My email address will be stored securely
- My data will not be shared with third parties
- I can request access to my data at any time

[ ] I consent to receive email marketing communications

Date: ________
Email: ________`,
      },
      {
        id: "sms-consent",
        title: "SMS Marketing Consent",
        subtitle: "Double opt-in template pour SMS",
        content: `## SMS Marketing Consent (Double Opt-In)

Step 1 — Opt-In: By checking this box and providing my phone number, I consent to receive SMS messages from [Creator Name].

Step 2 — Confirmation: I understand that I will receive a confirmation SMS and must reply "YES" to confirm my subscription.

Message frequency: up to 5 messages per week.

Message and data rates may apply. Reply STOP to cancel at any time.

[ ] I consent to receive SMS marketing communications

Phone: ________
Date: ________`,
      },
      {
        id: "dpa",
        title: "Data Processing Agreement (DPA)",
        subtitle: "Pour les sous-traitants et partenaires techniques",
        content: `# DATA PROCESSING AGREEMENT

This DPA is between the Creator ("Controller") and [Partner Name] ("Processor").

## 1. SCOPE
Processor will process personal data on behalf of Controller for the purpose of marketing automation and fan engagement.

## 2. DATA PROCESSED
- Fan names, email addresses, phone numbers
- Interaction history and preferences
- Purchase and subscription data

## 3. PROCESSOR OBLIGATIONS
- Process data only on documented instructions
- Implement appropriate security measures (Art. 32 GDPR)
- Notify Controller of any data breach within 48 hours
- Maintain a record of processing activities (Art. 30)
- Delete or return all data upon termination

## 4. SUB-PROCESSORS
Processor may engage sub-processors with prior written consent of Controller.

## 5. DATA SUBJECT RIGHTS
Processor shall assist Controller in fulfilling data subject requests (Arts. 15-22 GDPR).

## 6. AUDIT RIGHTS
Controller may audit Processor's compliance with this DPA annually.

## 7. GOVERNING LAW
This DPA shall be governed by the laws of France and the GDPR.`,
      },
    ],
  });
}
