import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, RefreshCcw, Scale, BookOpen } from "lucide-react";

const LEGAL_NAV = [
  { slug: "terms", label: "Terms of Service", icon: FileText },
  { slug: "privacy", label: "Privacy Policy", icon: Shield },
  { slug: "refund", label: "Refund Policy", icon: RefreshCcw },
  { slug: "acceptable-use", label: "Acceptable Use", icon: Scale },
  { slug: "accessibility", label: "Accessibility", icon: BookOpen },
];

const COMPANY = {
  name: "XI Eleven XVI Sixteen LLC",
  dba: "E-Quipped: Work",
  ein: "33-3471366",
  state: "Florida",
  email: "equippedbyxixvi@gmail.com",
  effectiveDate: "June 1, 2025",
};

/* ── Terms of Service ── */
function TermsContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Agreement to Terms">
        <p>By accessing or using the E-Quipped: Work platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). The Service is operated by {COMPANY.name}, doing business as {COMPANY.dba}, a limited liability company organized under the laws of the State of {COMPANY.state} (EIN: {COMPANY.ein}).</p>
        <p>If you do not agree to these Terms, you may not access or use the Service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>E-Quipped: Work is an AI education and training platform that provides interactive courses, sandbox activities, quizzes, and related educational content designed to help individuals and businesses develop AI proficiency for workplace applications.</p>
      </Section>

      <Section title="3. Account Registration">
        <p>To access certain features, you must create an account. You agree to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information as needed</li>
          <li>Keep your password secure and confidential</li>
          <li>Accept responsibility for all activity under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        <p>You must be at least 18 years old or the age of majority in your jurisdiction to create an account.</p>
      </Section>

      <Section title="4. Subscription Plans & Payments">
        <p>The Service offers free and paid subscription tiers:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Free Tier:</strong> Access to Modules 1–2 at no cost</li>
          <li><strong>Pro Tier ($29/month):</strong> Unlocks Modules 3–4</li>
          <li><strong>Elite Tier ($49/month):</strong> Unlocks Modules 5–6</li>
          <li><strong>Workflow Master ($149 one-time):</strong> Unlocks Module 7</li>
        </ul>
        <p>Recurring subscriptions are billed monthly. You may cancel at any time, and your access will continue through the end of the current billing period. Prices are subject to change with 30 days' notice.</p>
      </Section>

      <Section title="5. Intellectual Property">
        <p>All content, materials, code, graphics, logos, and educational content on the Service are the property of {COMPANY.name} or its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
        <p>You are granted a limited, non-exclusive, non-transferable license to access the content for personal and internal business use. You may not:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Copy, reproduce, or distribute course content</li>
          <li>Create derivative works from the content</li>
          <li>Sell, resell, or sublicense access to the Service</li>
          <li>Use the content for competing educational products</li>
        </ul>
      </Section>

      <Section title="6. User Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Use the Service for any unlawful purpose</li>
          <li>Share account credentials with others</li>
          <li>Attempt to circumvent access controls or security measures</li>
          <li>Interfere with the Service's operation or other users' access</li>
          <li>Upload harmful code, malware, or malicious content</li>
          <li>Scrape, crawl, or automatically extract data from the Service</li>
        </ul>
      </Section>

      <Section title="7. AI Sandbox Disclaimer">
        <p>The AI sandbox activities are educational tools. Outputs generated within the sandbox are for learning purposes only and should not be relied upon as professional advice. {COMPANY.name} is not responsible for any decisions made based on AI-generated outputs within the platform.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY.name.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.</p>
        <p>Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.</p>
      </Section>

      <Section title="9. Disclaimer of Warranties">
        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
      </Section>

      <Section title="10. Governing Law & Dispute Resolution">
        <p>These Terms shall be governed by the laws of the State of {COMPANY.state}, without regard to conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration in the State of {COMPANY.state}, in accordance with the rules of the American Arbitration Association.</p>
      </Section>

      <Section title="11. Modifications">
        <p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use of the Service after changes constitutes acceptance.</p>
      </Section>

      <Section title="12. Termination">
        <p>We may suspend or terminate your account if you violate these Terms. Upon termination, your right to use the Service ceases immediately. Sections related to intellectual property, limitation of liability, and governing law survive termination.</p>
      </Section>

      <Section title="13. Contact">
        <p>For questions about these Terms, contact us at:</p>
        <p className="mt-2">
          <strong>{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a><br />
          State of Organization: {COMPANY.state}
        </p>
      </Section>
    </>
  );
}

/* ── Privacy Policy ── */
function PrivacyContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Introduction">
        <p>{COMPANY.name}, doing business as {COMPANY.dba} ("we," "us," or "our"), respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
      </Section>

      <Section title="2. Information We Collect">
        <h4 className="font-bold text-sm mt-3 mb-1">Information You Provide</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Account registration data (name, email address, password)</li>
          <li>Payment and billing information (processed securely via Stripe)</li>
          <li>Course progress data (lesson completions, quiz scores, sandbox responses)</li>
          <li>Communications you send to us</li>
        </ul>
        <h4 className="font-bold text-sm mt-3 mb-1">Information Collected Automatically</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Device information (browser type, operating system)</li>
          <li>Usage data (pages visited, time spent, features used)</li>
          <li>IP address and approximate location</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide, maintain, and improve the Service</li>
          <li>Process transactions and manage subscriptions</li>
          <li>Track your learning progress and provide personalized recommendations</li>
          <li>Send administrative communications (account updates, security alerts)</li>
          <li>Send marketing communications (with your consent; you may opt out at any time)</li>
          <li>Analyze usage patterns to improve the educational experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. How We Share Your Information">
        <p>We do not sell your personal information. We may share information with:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Service Providers:</strong> Third parties that help us operate the platform (e.g., Stripe for payments, Convex for data hosting, Vercel for hosting)</li>
          <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>With Your Consent:</strong> When you explicitly authorize us to share</li>
        </ul>
      </Section>

      <Section title="5. Data Security">
        <p>We implement industry-standard security measures to protect your information, including encryption in transit (TLS/SSL), secure password hashing, and access controls. However, no method of electronic transmission is 100% secure, and we cannot guarantee absolute security.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain your personal information for as long as your account is active or as needed to provide the Service. Upon account deletion, we will delete or anonymize your data within 90 days, except where retention is required by law.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
          <li>Export your data in a portable format</li>
        </ul>
        <p>To exercise these rights, contact us at <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a>.</p>
      </Section>

      <Section title="8. Cookies">
        <p>We use cookies and similar technologies to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Keep you logged in</li>
          <li>Remember your preferences</li>
          <li>Analyze usage patterns</li>
        </ul>
        <p>You may disable cookies through your browser settings, but some features may not function properly.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>The Service is not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete it promptly.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notification. Your continued use of the Service after changes constitutes acceptance.</p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          <strong>{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a><br />
          State of Organization: {COMPANY.state}
        </p>
      </Section>
    </>
  );
}

/* ── Refund Policy ── */
function RefundContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1">Refund & Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Monthly Subscriptions (Pro & Elite Tiers)">
        <ul className="list-disc ml-6 space-y-1">
          <li>You may cancel your subscription at any time from your account settings</li>
          <li>Upon cancellation, you retain access through the end of your current billing period</li>
          <li>We offer a <strong>full refund within 7 days</strong> of your first subscription payment if you are not satisfied</li>
          <li>After the 7-day window, no partial refunds are issued for the current billing period</li>
          <li>Cancellation takes effect at the end of the current billing cycle</li>
        </ul>
      </Section>

      <Section title="2. One-Time Purchase (Workflow Master)">
        <ul className="list-disc ml-6 space-y-1">
          <li>The Workflow Master module is a one-time purchase of $149</li>
          <li>We offer a <strong>full refund within 14 days</strong> of purchase if you have completed less than 50% of the module content</li>
          <li>After 14 days or 50% completion, the purchase is non-refundable</li>
        </ul>
      </Section>

      <Section title="3. Free Tier">
        <p>The Free Tier (Modules 1–2) requires no payment and involves no refund eligibility.</p>
      </Section>

      <Section title="4. How to Request a Refund">
        <p>To request a refund, email us at <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a> with:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your account email address</li>
          <li>Date of purchase</li>
          <li>Reason for refund</li>
        </ul>
        <p>Refunds are processed within 5–10 business days to the original payment method.</p>
      </Section>

      <Section title="5. Chargebacks">
        <p>If you initiate a chargeback with your bank or credit card company before contacting us, we reserve the right to suspend your account pending resolution. We encourage you to reach out to us first — we're committed to fair resolution.</p>
      </Section>

      <Section title="6. Contact">
        <p>
          <strong>{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a>
        </p>
      </Section>
    </>
  );
}

/* ── Acceptable Use Policy ── */
function AcceptableUseContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1">Acceptable Use Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Purpose">
        <p>This Acceptable Use Policy outlines the rules for using the E-Quipped: Work platform. By using the Service, you agree to comply with this policy.</p>
      </Section>

      <Section title="2. Prohibited Uses">
        <p>You may NOT use the Service to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Violate any applicable laws or regulations</li>
          <li>Share, distribute, or sell course content, quiz answers, or sandbox solutions</li>
          <li>Use multiple accounts to circumvent access controls or gain unfair advantages</li>
          <li>Submit plagiarized, AI-generated, or copied content as your own work in sandbox activities</li>
          <li>Harass, abuse, or threaten other users or our staff</li>
          <li>Attempt to hack, reverse-engineer, or disrupt the platform</li>
          <li>Use the platform to train or build competing AI education products</li>
          <li>Misrepresent your identity or credentials</li>
        </ul>
      </Section>

      <Section title="3. AI Sandbox Guidelines">
        <ul className="list-disc ml-6 space-y-1">
          <li>Sandbox activities should be completed using your own knowledge and reasoning</li>
          <li>Prompts you write should be your own original work</li>
          <li>Do not input confidential, proprietary, or sensitive business data into sandbox activities</li>
          <li>The AI evaluation is for educational purposes — do not rely on it for professional decisions</li>
        </ul>
      </Section>

      <Section title="4. Enforcement">
        <p>Violations of this policy may result in:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Warning notification</li>
          <li>Temporary suspension of account</li>
          <li>Permanent termination of account without refund</li>
          <li>Legal action where applicable</li>
        </ul>
      </Section>

      <Section title="5. Reporting Violations">
        <p>If you become aware of any violations, please report them to <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a>.</p>
      </Section>
    </>
  );
}

/* ── Accessibility Statement ── */
function AccessibilityContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1">Accessibility Statement</h1>
      <p className="text-sm text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="Our Commitment">
        <p>{COMPANY.name} is committed to ensuring that the E-Quipped: Work platform is accessible to people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.</p>
      </Section>

      <Section title="Standards">
        <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Our efforts include:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Semantic HTML structure for screen reader compatibility</li>
          <li>Keyboard navigation support throughout the platform</li>
          <li>Sufficient color contrast ratios for text and interactive elements</li>
          <li>Alternative text for images and visual content</li>
          <li>Resizable text and responsive design</li>
          <li>Clear focus indicators for interactive elements</li>
        </ul>
      </Section>

      <Section title="Known Limitations">
        <p>While we strive for full accessibility, some content may have limitations:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Some interactive animations may not be fully accessible to screen readers</li>
          <li>Third-party embedded content may not meet all accessibility standards</li>
        </ul>
        <p>We are actively working to address these limitations.</p>
      </Section>

      <Section title="Feedback">
        <p>If you encounter any accessibility barriers, please contact us at <a href={`mailto:${COMPANY.email}`} className="text-fuchsia-600 hover:underline">{COMPANY.email}</a>. We take accessibility feedback seriously and will respond within 5 business days.</p>
      </Section>
    </>
  );
}

/* ── Shared Section component ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-2">{title}</h3>
      <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

/* ── Content map ── */
const CONTENT_MAP: Record<string, React.FC> = {
  terms: TermsContent,
  privacy: PrivacyContent,
  refund: RefundContent,
  "acceptable-use": AcceptableUseContent,
  accessibility: AccessibilityContent,
};

/* ── Main LegalPage ── */
export function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = slug || "terms";
  const Content = CONTENT_MAP[currentSlug];

  if (!Content) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-xl font-bold">Page not found</h2>
        <Link to="/legal/terms" className="mt-4 text-fuchsia-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> View Terms of Service
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 lg:px-8">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar nav */}
        <nav className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-8 space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Legal</p>
            {LEGAL_NAV.map((item) => {
              const Icon = item.icon;
              const active = currentSlug === item.slug;
              return (
                <Link key={item.slug} to={`/legal/${item.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl p-6 lg:p-8 shadow-sm">
            <Content />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} {COMPANY.name} d/b/a {COMPANY.dba}. All rights reserved.</p>
            <p className="mt-1">Organized under the laws of the State of {COMPANY.state} · EIN: {COMPANY.ein}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LEGAL_NAV };
