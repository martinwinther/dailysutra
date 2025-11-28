import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function RefundPolicyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Policy"
        subtitle="Our policy on refunds for Daily Sutra purchases."
      />

      <GlassCard>
        <div className="space-y-6 text-sm text-[hsl(var(--muted))]">
          <section>
            <p className="text-xs text-[hsl(var(--muted))] mb-4">
              <strong className="text-[hsl(var(--text))]">Last Updated:</strong> January 2025
            </p>
            <p>
              This Refund Policy explains our policy regarding refunds for purchases of Daily Sutra. Please read this policy carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              1. Refund Eligibility
            </h2>
            <div className="space-y-3">
              <p>
                Daily Sutra is a digital product that provides immediate access to content upon purchase. We offer refunds under the following circumstances:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-[hsl(var(--text))]">Within 14 days of purchase:</strong> You may request a full refund for any reason within 14 days of your purchase date.
                </li>
                <li>
                  <strong className="text-[hsl(var(--text))]">Technical issues:</strong> If you experience technical problems that prevent you from accessing the service and we are unable to resolve them, you may be eligible for a refund.
                </li>
                <li>
                  <strong className="text-[hsl(var(--text))]">Duplicate charges:</strong> If you are charged multiple times for the same purchase, we will refund all duplicate charges.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              2. Refund Time Period
            </h2>
            <p>
              Refund requests must be submitted within 14 days of your purchase date. After this period, refunds are generally not available except in cases of technical issues or duplicate charges, at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              3. How to Request a Refund
            </h2>
            <div className="space-y-3">
              <p>To request a refund, please contact us with the following information:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your account email address</li>
                <li>The date of your purchase</li>
                <li>The reason for your refund request</li>
                <li>Your Stripe receipt or transaction ID (if available)</li>
              </ul>
              <p>
                You can reach us at{" "}
                <a
                  href="mailto:support@dailysutra.app"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  support@dailysutra.app
                </a>{" "}
                or use our{" "}
                <Link href="/contact" className="text-[hsl(var(--accent))] hover:underline">
                  contact form
                </Link>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              4. Refund Processing
            </h2>
            <div className="space-y-3">
              <p>
                Once we approve your refund request:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>We will process the refund within 5-10 business days</li>
                <li>The refund will be issued to the original payment method</li>
                <li>You will receive an email confirmation when the refund is processed</li>
                <li>Your access to paid content will be revoked upon refund completion</li>
              </ul>
              <p>
                <strong className="text-[hsl(var(--text))]">Note:</strong> The time it takes for the refund to appear in your account depends on your payment provider and may take up to 10 business days after we process it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              5. Non-Refundable Situations
            </h2>
            <p className="mb-3">
              Refunds are generally not available in the following situations:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>After 14 days from the purchase date (except for technical issues)</li>
              <li>If you have violated our Terms of Service</li>
              <li>If you have already received a refund for the same purchase</li>
              <li>For purchases made through third-party platforms (subject to their refund policies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              6. Free Trial
            </h2>
            <p>
              The free trial period (first 4 weeks) is provided at no cost and does not require a refund. If you decide not to upgrade after the trial, you simply do not make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              7. Chargebacks
            </h2>
            <p>
              If you initiate a chargeback through your payment provider instead of contacting us first, we may suspend your account pending resolution. We encourage you to contact us directly to resolve any issues before initiating a chargeback.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              8. Right of Withdrawal (EU Customers)
            </h2>
            <p>
              If you are located in the European Union, you have the right to withdraw from your purchase within 14 days without giving any reason. However, please note that if you have already accessed significant portions of the paid content, we may deduct a proportional amount from your refund, as permitted by EU law for digital content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on this page. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              10. Contact Us
            </h2>
            <p>
              If you have questions about refunds or need to request a refund, please contact us:
            </p>
            <p className="mt-2">
              <strong className="text-[hsl(var(--text))]">Email:</strong>{" "}
              <a
                href="mailto:support@dailysutra.app"
                className="text-[hsl(var(--accent))] hover:underline"
              >
                support@dailysutra.app
              </a>
            </p>
            <p className="mt-2">
              <Link href="/contact" className="text-[hsl(var(--accent))] hover:underline">
                Contact Form
              </Link>
            </p>
            <p className="mt-3 text-xs">
              We typically respond to refund requests within 48 hours during business days.
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}

