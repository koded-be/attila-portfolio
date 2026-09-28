"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { sendContact } from "@/app/actions/contact";
import {
  EMAIL_PATTERN,
  MAX_IDEA,
  MAX_SHORT,
  type ContactData,
} from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site";
import { Button } from "./_common/button";

const inputClass = (error?: FieldError) =>
  `w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors ${
    error
      ? "border-red-400 focus:border-red-400"
      : "border-white/15 focus:border-primary"
  }`;

type FieldProps = {
  id: keyof ContactData;
  label: string;
  error?: FieldError;
  children: ReactNode;
};

const Field = ({ id, label, error, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm text-white/70">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-sm text-red-400">
        {error.message}
      </p>
    )}
  </div>
);

const MailLink = () => (
  <a
    href={`mailto:${CONTACT_EMAIL}`}
    className="text-white/70 underline hover:text-primary transition-colors"
  >
    {CONTACT_EMAIL}
  </a>
);

export const Contact = () => {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({ mode: "onTouched" });

  const onSubmit = async (data: ContactData) => {
    setStatus("idle");
    try {
      const result = await sendContact(data);
      if ("ok" in result) {
        reset();
        setStatus("sent");
      } else {
        setServerError(result.error);
        setStatus("error");
      }
    } catch {
      setServerError("Could not reach the server, please try again");
      setStatus("error");
    }
  };

  // Wires up aria attributes so screen readers announce field errors
  const a11y = (id: keyof ContactData) => ({
    id,
    "aria-invalid": !!errors[id],
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

  return (
    <section
      id="contact"
      className="flex items-center bg-gray-950 min-h-screen"
    >
      <div className="flex flex-col gap-4 p-20 w-full max-w-600 mx-auto bg-gray-900 rounded-2xl">
        <div className="grid grid-cols-2 gap-16 w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl text-primary uppercase mb-8">Contact Me</h2>
            <Image
              src="/TilaFoto.jpg"
              alt="Picture Attila Tolnai"
              width={400}
              height={400}
              className="rounded-full"
            />
          </div>

          {status === "sent" ? (
            <div
              role="status"
              className="flex flex-col items-start justify-center gap-4"
            >
              <h3 className="text-2xl text-primary">Message sent!</h3>
              <p className="text-white/70">
                Thanks for reaching out. I&apos;ll get back to you as soon as
                possible.
              </p>
              <Button onClick={() => setStatus("idle")}>
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-6"
            >
              <Field id="name" label="Name" error={errors.name}>
                <input
                  {...a11y("name")}
                  {...register("name", {
                    required: "Please enter your name",
                    validate: (v) => !!v.trim() || "Please enter your name",
                    maxLength: {
                      value: MAX_SHORT,
                      message: `Max ${MAX_SHORT} characters`,
                    },
                  })}
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field id="email" label="Email" error={errors.email}>
                <input
                  {...a11y("email")}
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Please enter a valid email address",
                    },
                    maxLength: {
                      value: MAX_SHORT,
                      message: `Max ${MAX_SHORT} characters`,
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field
                id="idea"
                label="Please tell us more about your idea"
                error={errors.idea}
              >
                <textarea
                  {...a11y("idea")}
                  {...register("idea", {
                    required: "Please tell me a bit about your idea",
                    validate: (v) =>
                      !!v.trim() || "Please tell me a bit about your idea",
                    maxLength: {
                      value: MAX_IDEA,
                      message: `Max ${MAX_IDEA} characters`,
                    },
                  })}
                  placeholder="What can I do for you?"
                  rows={4}
                  className={`${inputClass(errors.idea)} resize-none`}
                />
              </Field>

              <Field id="company" label="Company" error={errors.company}>
                <input
                  {...a11y("company")}
                  {...register("company", {
                    maxLength: {
                      value: MAX_SHORT,
                      message: `Max ${MAX_SHORT} characters`,
                    },
                  })}
                  type="text"
                  autoComplete="organization"
                  placeholder="koded."
                  className={inputClass(errors.company)}
                />
              </Field>

              {/* Honeypot, hidden from humans */}
              <input
                {...register("website")}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              {status === "error" && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                >
                  {serverError}. You can also mail me directly at{" "}
                  <MailLink />.
                </div>
              )}

              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Contact me"}
                </Button>
              </div>

              <p className="text-sm text-white/40 mt-2">
                Or mail me at <MailLink />
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
