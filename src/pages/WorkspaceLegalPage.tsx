import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, RefreshCcw, Scale, BookOpen, ChevronLeft } from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { PublicPageTracker } from "../components/PublicPageTracker";

const LEGAL_NAV = [
  { slug: "terms", label: "Terms of Service", icon: FileText },
  { slug: "privacy", label: "Privacy Policy", icon: Shield },
  { slug: "refund", label: "Refund Policy", icon: RefreshCcw },
  { slug: "acceptable-use", label: "Acceptable Use", icon: Scale },
  { slug: "accessibility", label: "Accessibility", icon: BookOpen },
];

const COMPANY = {
  name: "XI Eleven XVI Sixteen LLC",
  dba: "E-Quipped: Work[space]",
  ein: "33-3471366",
  state: "Florida",
  email: "equippedbyxixvi@gmail.com",
  effectiveDate: "June 1, 2025",
};

/* ── Shared Section component ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-2 text-white">{title}</h3>
      <div className="space-y-2 text-sm text-white/50 leading-relaxed">{children}</div>
    </div>
  );
}

/* ── Terms of Service ── */
function TermsContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1 text-white">Terms of Service</h1>
      <p className="text-sm text-white/40 mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Agreement to Terms">
        <p>By accessing or using the E-Quipped: Work[space] platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). The Service is operated by {COMPANY.name}, doing business as {COMPANY.dba}, a limited liability company organized under the laws of the State of {COMPANY.state} (EIN: {COMPANY.ein}).</p>
        <p>If you do not agree to these Terms, you may not access or use the Service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>E-Quipped: Work[space] is a 3D interactive virtual office platform that provides customizable workspaces, video conferencing, AI-powered meeting transcription and insights, team presence management, and collaboration tools designed for remote and hybrid teams.</p>
      </Section>

      <Section title="3. Account Registration">
        <p>To access the Service, you must create an account. You agree to:</p>
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
        <p>The Service offers paid subscription tiers based on team size:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Starter ($49/month):</strong> 1–5 seats</li>
          <li><strong>Team ($129/month):</strong> 6–15 seats</li>
          <li><strong>Business ($299/month):</strong> 16–50 seats</li>
          <li><strong>Enterprise ($599/month):</strong> 50+ seats</li>
        </ul>
        <p>Annual billing is available at a 20% discount. Recurring subscriptions are billed at the start of each billing period. You may cancel at any time, and your access will continue through the end of the current billing period. Prices are subject to change with 30 days' notice.</p>
      </Section>

      <Section title="5. Workspace Administration">
        <p>Workspace administrators have the ability to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Invite and remove team members</li>
          <li>Configure rooms, offices, and workspace settings</li>
          <li>Access meeting transcripts and action items generated within the workspace</li>
          <li>Manage billing and subscription settings</li>
        </ul>
        <p>Administrators are responsible for ensuring their team members comply with these Terms.</p>
      </Section>

      <Section title="6. Intellectual Property">
        <p>All software, design, graphics, logos, and platform content are the property of {COMPANY.name} or its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
        <p>You retain ownership of content you upload or create within your workspace (documents, recordings, meeting notes). You grant us a limited license to process this content solely to provide the Service.</p>
      </Section>

      <Section title="7. User Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Use the Service for any unlawful purpose</li>
          <li>Share account credentials with unauthorized individuals</li>
          <li>Attempt to circumvent access controls or security measures</li>
          <li>Interfere with the Service's operation or other users' access</li>
          <li>Upload harmful code, malware, or malicious content</li>
          <li>Record or distribute meeting content without participant consent</li>
          <li>Use the platform to harass, abuse, or threaten others</li>
        </ul>
      </Section>

      <Section title="8. AI Features Disclaimer">
        <p>The AI-powered features (meeting transcription, insights, action item extraction) are provided as productivity tools. {COMPANY.name} does not guarantee the accuracy or completeness of AI-generated outputs. You should review AI-generated content before acting on it. We are not responsible for decisions made based on AI-generated meeting summaries or insights.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY.name.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.</p>
        <p>Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.</p>
      </Section>

      <Section title="10. Disclaimer of Warranties">
        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
      </Section>

      <Section title="11. Governing Law & Dispute Resolution">
        <p>These Terms shall be governed by the laws of the State of {COMPANY.state}, without regard to conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration in the State of {COMPANY.state}, in accordance with the rules of the American Arbitration Association.</p>
      </Section>

      <Section title="12. Modifications">
        <p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use of the Service after changes constitutes acceptance.</p>
      </Section>

      <Section title="13. Termination">
        <p>We may suspend or terminate your account if you violate these Terms. Upon termination, your right to use the Service ceases immediately. We will provide reasonable notice and an opportunity to export your data before permanent deletion. Sections related to intellectual property, limitation of liability, and governing law survive termination.</p>
      </Section>

      <Section title="14. Contact">
        <p>For questions about these Terms, contact us at:</p>
        <p className="mt-2">
          <strong className="text-white">{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a><br />
          State of Organization: {COMPANY.state} · EIN: {COMPANY.ein}
        </p>
      </Section>
    </>
  );
}

/* ── Privacy Policy ── */
function PrivacyContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1 text-white">Privacy Policy</h1>
      <p className="text-sm text-white/40 mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Introduction">
        <p>{COMPANY.name}, doing business as {COMPANY.dba} ("we," "us," or "our"), respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our virtual workspace platform.</p>
      </Section>

      <Section title="2. Information We Collect">
        <h4 className="font-bold text-sm mt-3 mb-1 text-white/70">Information You Provide</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Account registration data (name, email address, password)</li>
          <li>Payment and billing information (processed securely via Stripe)</li>
          <li>Workspace configuration data (room names, office settings, branding)</li>
          <li>Meeting content (audio/video streams, transcriptions, shared screens)</li>
          <li>Communications you send to us or within the platform</li>
        </ul>
        <h4 className="font-bold text-sm mt-3 mb-1 text-white/70">Information Collected Automatically</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Device information (browser type, operating system)</li>
          <li>Usage data (rooms visited, features used, presence status)</li>
          <li>IP address and approximate location</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide, maintain, and improve the virtual workspace Service</li>
          <li>Process transactions and manage subscriptions</li>
          <li>Generate meeting transcriptions, AI insights, and action items</li>
          <li>Enable team presence and collaboration features</li>
          <li>Send administrative communications (account updates, security alerts)</li>
          <li>Analyze usage patterns to improve the platform experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. Meeting Data & AI Processing">
        <p>When you use our meeting features:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Audio/video streams are processed in real-time and not stored permanently unless you enable recording</li>
          <li>Meeting transcriptions are generated by AI and stored within your workspace</li>
          <li>AI-generated insights and action items are derived from transcriptions</li>
          <li>Meeting data is accessible only to workspace members and administrators</li>
          <li>We do not use your meeting content to train AI models</li>
        </ul>
      </Section>

      <Section title="5. How We Share Your Information">
        <p>We do not sell your personal information. We may share information with:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong className="text-white/70">Service Providers:</strong> Third parties that help us operate the platform (e.g., Stripe for payments, Convex for data hosting, Vercel for hosting, LiveKit for video/audio)</li>
          <li><strong className="text-white/70">Legal Compliance:</strong> When required by law, regulation, or legal process</li>
          <li><strong className="text-white/70">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong className="text-white/70">With Your Consent:</strong> When you explicitly authorize us to share</li>
        </ul>
      </Section>

      <Section title="6. Data Security">
        <p>We implement industry-standard security measures including AES-256 encryption at rest, TLS/SSL encryption in transit, secure password hashing, content protection for shared screens, and role-based access controls. However, no method of electronic transmission is 100% secure.</p>
      </Section>

      <Section title="7. Data Retention">
        <p>We retain your personal information for as long as your workspace subscription is active. Meeting transcriptions and AI-generated content are retained according to your workspace settings. Upon account deletion, we will delete or anonymize your data within 90 days, except where retention is required by law.</p>
      </Section>

      <Section title="8. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
          <li>Export your workspace data in a portable format</li>
        </ul>
        <p>To exercise these rights, contact us at <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a>.</p>
      </Section>

      <Section title="9. Cookies">
        <p>We use cookies and similar technologies to keep you logged in, remember your preferences (theme, room settings), and analyze usage patterns. You may disable cookies through your browser settings, but some features may not function properly.</p>
      </Section>

      <Section title="10. Children's Privacy">
        <p>The Service is not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete it promptly.</p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notification. Your continued use of the Service after changes constitutes acceptance.</p>
      </Section>

      <Section title="12. Contact Us">
        <p>
          <strong className="text-white">{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a><br />
          State of Organization: {COMPANY.state} · EIN: {COMPANY.ein}
        </p>
      </Section>
    </>
  );
}

/* ── Refund Policy ── */
function RefundContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1 text-white">Refund & Cancellation Policy</h1>
      <p className="text-sm text-white/40 mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Workspace Subscriptions">
        <ul className="list-disc ml-6 space-y-1">
          <li>You may cancel your subscription at any time</li>
          <li>Upon cancellation, you retain access through the end of your current billing period</li>
          <li>We offer a <strong className="text-white/70">full refund within 14 days</strong> of your first subscription payment if you are not satisfied</li>
          <li>After the 14-day window, no partial refunds are issued for the current billing period</li>
          <li>Annual subscriptions are eligible for a prorated refund within the first 30 days</li>
        </ul>
      </Section>

      <Section title="2. Downgrading">
        <p>You may downgrade your plan at any time. The change takes effect at the start of your next billing period. You will not be charged the difference, and no refund is issued for the remainder of the current period at the higher tier.</p>
      </Section>

      <Section title="3. Data After Cancellation">
        <p>Upon cancellation, your workspace data (room configurations, meeting transcriptions, etc.) will be retained for 30 days. After 30 days, data is permanently deleted. You may export your data before cancellation.</p>
      </Section>

      <Section title="4. How to Request a Refund">
        <p>To request a refund, email us at <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a> with:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your account email address</li>
          <li>Date of purchase</li>
          <li>Reason for refund</li>
        </ul>
        <p>Refunds are processed within 5–10 business days to the original payment method.</p>
      </Section>

      <Section title="5. Chargebacks">
        <p>If you initiate a chargeback with your bank or credit card company before contacting us, we reserve the right to suspend your workspace pending resolution. We encourage you to reach out to us first.</p>
      </Section>

      <Section title="6. Contact">
        <p>
          <strong className="text-white">{COMPANY.name}</strong> d/b/a {COMPANY.dba}<br />
          Email: <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a>
        </p>
      </Section>
    </>
  );
}

/* ── Acceptable Use Policy ── */
function AcceptableUseContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1 text-white">Acceptable Use Policy</h1>
      <p className="text-sm text-white/40 mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="1. Purpose">
        <p>This Acceptable Use Policy outlines the rules for using the E-Quipped: Work[space] platform. By using the Service, you agree to comply with this policy.</p>
      </Section>

      <Section title="2. Prohibited Uses">
        <p>You may NOT use the Service to:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Violate any applicable laws or regulations</li>
          <li>Share workspace access credentials with unauthorized individuals</li>
          <li>Record meetings or conversations without the knowledge and consent of all participants</li>
          <li>Upload or share inappropriate, offensive, or illegal content within workspaces</li>
          <li>Harass, abuse, or threaten other users or our staff</li>
          <li>Attempt to hack, reverse-engineer, or disrupt the platform</li>
          <li>Use the platform for unauthorized surveillance of team members</li>
          <li>Misrepresent your identity within a workspace</li>
          <li>Exceed your plan's seat limit by sharing credentials</li>
        </ul>
      </Section>

      <Section title="3. Meeting & Communication Guidelines">
        <ul className="list-disc ml-6 space-y-1">
          <li>All meeting participants should be aware that AI transcription may be active</li>
          <li>Do not share confidential third-party information without authorization</li>
          <li>Meeting recordings and transcriptions should be handled according to your organization's policies</li>
          <li>AI-generated insights should be reviewed before distribution</li>
        </ul>
      </Section>

      <Section title="4. Enforcement">
        <p>Violations of this policy may result in:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Warning notification to workspace administrator</li>
          <li>Temporary suspension of account</li>
          <li>Permanent termination of workspace without refund</li>
          <li>Legal action where applicable</li>
        </ul>
      </Section>

      <Section title="5. Reporting Violations">
        <p>If you become aware of any violations, please report them to <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a>.</p>
      </Section>
    </>
  );
}

/* ── Accessibility Statement ── */
function AccessibilityContent() {
  return (
    <>
      <h1 className="text-2xl font-extrabold mb-1 text-white">Accessibility Statement</h1>
      <p className="text-sm text-white/40 mb-6">Effective Date: {COMPANY.effectiveDate}</p>

      <Section title="Our Commitment">
        <p>{COMPANY.name} is committed to ensuring that the E-Quipped: Work[space] platform is accessible to people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.</p>
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
          <li>Closed captioning support for meeting transcriptions</li>
        </ul>
      </Section>

      <Section title="Known Limitations">
        <p>While we strive for full accessibility, some features may have limitations:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>The 3D floor map navigation may require mouse interaction</li>
          <li>Some real-time video features may not be fully accessible to screen readers</li>
          <li>AI-generated transcriptions may have accuracy limitations</li>
        </ul>
        <p>We are actively working to address these limitations.</p>
      </Section>

      <Section title="Feedback">
        <p>If you encounter any accessibility barriers, please contact us at <a href={`mailto:${COMPANY.email}`} className="text-cyan-400 hover:underline">{COMPANY.email}</a>. We take accessibility feedback seriously and will respond within 5 business days.</p>
      </Section>
    </>
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

/* ── Main Workspace Legal Page ── */
export function WorkspaceLegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = slug || "terms";
  const Content = CONTENT_MAP[currentSlug];

  if (!Content) {
    return (
      <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-xl font-bold">Page not found</h2>
        <Link to="/workspace-legal/terms" className="mt-4 text-cyan-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> View Terms of Service
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white">
      <PublicPageTracker />
      {/* ── nav ── */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative z-20 gap-2 border-b border-white/[0.06]">
        <Link
          to="/workspace-home"
          className="flex items-center gap-1 sm:gap-2 text-white/40 hover:text-white/70 transition-colors text-xs sm:text-sm shrink-0"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Back to Work[space]</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="flex-1 flex justify-center min-w-0">
          <BrandLogo variant="workspace" size="sm" theme="dark" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/workspace-login"
            className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/workspace-pricing"
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── content ── */}
      <div className="max-w-5xl mx-auto py-8 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar nav */}
          <nav className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-8 space-y-1">
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3 px-3">Legal</p>
              {LEGAL_NAV.map((item) => {
                const Icon = item.icon;
                const active = currentSlug === item.slug;
                return (
                  <Link key={item.slug} to={`/workspace-legal/${item.slug}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
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
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-8">
              <Content />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-white/25">
              <p>© {new Date().getFullYear()} {COMPANY.name} d/b/a {COMPANY.dba}. All rights reserved.</p>
              <p className="mt-1">Organized under the laws of the State of {COMPANY.state} · EIN: {COMPANY.ein}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
