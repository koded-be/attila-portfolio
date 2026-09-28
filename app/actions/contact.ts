"use server";

import { checkBotId } from "botid/server";
import {
  EMAIL_PATTERN,
  MAX_IDEA,
  MAX_SHORT,
  type ContactData,
} from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site";

export type ContactResult = { ok: true } | { error: string };

// Input comes straight from the client, never trust its shape
const field = (data: Partial<ContactData>, key: keyof ContactData) =>
  String(data?.[key] ?? "").trim();

export async function sendContact(
  data: Partial<ContactData>,
): Promise<ContactResult> {
  const { isBot } = await checkBotId();
  if (isBot) return { error: "Request blocked, please try again" };

  // Honeypot: bots fill every field, pretend it worked
  if (field(data, "website")) return { ok: true };

  const name = field(data, "name");
  const email = field(data, "email");
  const idea = field(data, "idea");
  const company = field(data, "company");

  if (!name || !email || !idea) return { error: "Please fill in all fields" };
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_SHORT) {
    return { error: "Please enter a valid email" };
  }
  if (
    name.length > MAX_SHORT ||
    company.length > MAX_SHORT ||
    idea.length > MAX_IDEA
  ) {
    return { error: "Your message is too long" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Portfolio <${process.env.RESEND_FROM_EMAIL}>`,
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "-"}\n\n${idea}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return { error: "Something went wrong, please try again later" };
  }

  return { ok: true };
}
