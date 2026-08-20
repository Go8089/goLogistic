import { useState } from "react";
import type { SubmitEvent } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import Input from "../components/Input";
import Button from "../components/Button";

interface ContactForm {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactForm = {
  fullName: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const contactDetails = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210",
    description: "Mon–Sat, 9:00 AM – 7:00 PM",
  },
  {
    icon: Mail,
    title: "Email",
    value: "contact@transmove.com",
    description: "We usually respond within one business day.",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Pune, Maharashtra",
    description: "India",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Monday – Saturday",
    description: "9:00 AM – 7:00 PM",
  },
];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (
    field: keyof ContactForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Spring Boot API will be connected here later.
    console.log("Contact request:", form);

    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's talk about your transportation needs."
        description="Have a shipment to move or need more information about our road transportation services? Get in touch with our team."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Contact information
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Reach us through any of the channels below. Our team can help
              with transportation requirements, quotes, and shipment
              questions.
            </p>

            <div className="mt-8 space-y-5">
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-gray-200 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {item.value}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            {submitted ? (
              <SuccessMessage onReset={resetForm} />
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Send us a message
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Fill out the form and our team will get back to you.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      name="fullName"
                      placeholder="Your name"
                      required
                      value={form.fullName}
                      onChange={(value) =>
                        updateField("fullName", value)
                      }
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={form.phone}
                      onChange={(value) =>
                        updateField("phone", value)
                      }
                    />
                  </div>

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={form.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                  />

                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    value={form.subject}
                    onChange={(value) =>
                      updateField("subject", value)
                    }
                  />

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Message
                      <span className="ml-1 text-blue-600">*</span>
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={form.message}
                      onChange={(event) =>
                        updateField(
                          "message",
                          event.target.value,
                        )
                      }
                      placeholder="Tell us about your requirement..."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <Button type="submit">
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Transportation CTA */}
      <section className="border-y border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Road Transportation
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Need a transportation quote?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
                Tell us about your pickup location, destination, cargo, and
                vehicle requirements. We will help you find the right road
                transportation solution.
              </p>

              <Link
                to="/quote"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get a Quote
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <MapPin
                  size={22}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Service Area
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    We provide road transportation based on available routes
                    and vehicle capacity. Contact us to confirm service
                    availability for your pickup and delivery locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface SuccessMessageProps {
  onReset: () => void;
}

function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <CheckCircle2 size={28} />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
        Message received
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
        Thank you for contacting us. Our team will review your message and
        get back to you shortly.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
      >
        Send Another Message
      </button>
    </div>
  );
}