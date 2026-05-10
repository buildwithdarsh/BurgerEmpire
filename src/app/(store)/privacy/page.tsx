'use client';

import { useMode } from '@/hooks/useMode';

export default function PrivacyPolicyPage() {
  const { isClassic } = useMode();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information that you provide directly and information that is gathered automatically when you use our platform. This includes:

Personal Information You Provide:
- Identity details: Full name, email address, phone number, and date of birth (optional).
- Delivery addresses: Saved addresses for home, work, or other locations you add to your account.
- Account credentials: Your password, which is stored securely using industry-standard bcrypt hashing. We never store your password in plain text.
- Payment information: We do not store your card details. All payment processing is handled securely by Razorpay, our PCI-DSS compliant payment gateway. We only retain transaction reference IDs and payment status.
- Student verification data: If you apply for a Student Pass, we collect your institution name and student enrollment number for verification purposes.
- Communication records: Messages you send through support tickets, feedback forms, WhatsApp, or email correspondence.

Information Collected Automatically:
- Device and browser information: IP address, browser type and version, operating system, screen resolution, and device identifiers.
- Usage data: Pages visited, time spent on pages, click patterns, menu items browsed, items added to or removed from your cart, and search queries on our platform.
- Location data: Your delivery address is required for order fulfilment. We may also use your approximate location (derived from your IP address) to show relevant outlet information and delivery availability. We do not track your real-time GPS location.
- Cookies and similar technologies: As described in Section 4 below.

Information from Your Orders and Activity:
- Order history: Items ordered, order amounts, payment methods used (COD or online), delivery or pickup preferences, and order timestamps.
- Loyalty programme data: Baby Coins earned, redeemed, and current balance; your loyalty tier (Bronze, Silver, or Gold); and reward redemption history.
- Gift card data: Gift cards purchased or received, balances, and usage history.
- Meal plan and subscription details: Plan type, subscription period, remaining deliveries, and renewal dates.
- Referral activity: Referral codes shared, referrals completed, and associated bonuses.
- Reservation data: Table reservation dates, times, party size, outlet location, and special requests.
- Coupon and promotion usage: Discount codes applied and promotional offers availed.`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect for the following purposes, in accordance with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011:

Order Fulfilment and Services:
- Process and deliver your food orders, including coordinating with kitchen staff and delivery personnel.
- Manage table reservations at our Abc City and Abc City 2 outlets.
- Administer your meal plan subscriptions, including scheduling deliveries and processing renewals.
- Process gift card purchases, track balances, and apply gift card credits to orders.
- Manage your Baby Coins loyalty balance, tier status, and reward redemptions.
- Verify student credentials for Student Pass discount eligibility.
- Process refunds and handle cancellation requests.

Account and Communication:
- Create and manage your Burger Empire account.
- Send order confirmations, preparation updates, dispatch notifications, and delivery confirmations via email, SMS, or WhatsApp.
- Respond to your customer support enquiries and resolve issues.
- Send transactional messages such as password reset links, account verification, and payment receipts.

Personalisation and Improvement:
- Personalise your experience, including menu recommendations based on your order history and dietary preferences (Classic or Healthy mode).
- Improve our menu offerings, website functionality, and overall service quality.
- Conduct internal analytics to understand ordering patterns, popular items, and peak hours.
- Test new features and optimise the user experience on our platform.

Marketing (With Your Consent):
- Send promotional communications about new menu items, seasonal offers, and special deals — only when you have opted in.
- Notify you about loyalty programme milestones, expiring Baby Coins, or tier upgrades.
- Share referral programme updates and bonus notifications.
- You can opt out of marketing communications at any time by updating your account preferences or clicking the unsubscribe link in any promotional email.

Security and Legal:
- Detect, prevent, and investigate fraud, abuse, or security incidents, including multiple-account abuse of promotional offers.
- Enforce our Terms and Conditions and other policies.
- Comply with applicable Indian laws, including tax regulations, FSSAI requirements, and legal process.`,
    },
    {
      title: 'Data Sharing and Disclosure',
      content: `We do not sell, rent, or trade your personal information to third parties. We share your data only in the following limited and necessary circumstances:

Payment Processing:
- Razorpay: When you pay online, your payment details are processed directly by Razorpay (our PCI-DSS compliant payment gateway). We share your order amount, order reference, and contact details with Razorpay to facilitate the transaction. Razorpay's privacy policy governs their handling of your payment data.

Delivery Partners:
- Our delivery personnel receive your name, phone number, delivery address, and order details necessary to complete your delivery. They are contractually bound to use this information solely for delivery purposes.

Communication Services:
- We use third-party services for sending transactional emails, SMS notifications, and WhatsApp messages. These providers receive only the information necessary to deliver your messages (e.g., your phone number or email address and the message content).

Analytics and Performance:
- We use analytics tools (such as Google Analytics) to understand how visitors interact with our website. These tools collect anonymised and aggregated data such as page views, session duration, and general geographic region. We configure these tools to anonymise IP addresses where possible.

Legal Requirements:
- We may disclose your information if required to do so by law, court order, or governmental authority, including compliance with the Information Technology Act, 2000, the Consumer Protection Act, 2019, or requests from law enforcement agencies.
- We may share information to protect the rights, property, or safety of Burger Empire, our customers, or the public.

Business Transfers:
- In the event of a merger, acquisition, reorganisation, or sale of assets of Abc Foods Pvt Ltd, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have regarding your information.

We do not share your information with advertisers or ad networks for targeted advertising purposes.`,
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: `Our website (burger-empire.build.withdarsh.com) uses cookies and similar technologies to provide and improve our services. Here is what we use and why:

Essential Cookies:
- Session cookies that keep you logged in as you browse our website.
- Cart cookies that preserve items in your shopping cart.
- Security cookies that help prevent fraudulent activity.
- These cookies are strictly necessary for the website to function. They cannot be disabled.

Preference Cookies:
- Remember your selected mode (Classic or Healthy) so you see the right menu and styling.
- Store your preferred delivery address and outlet location.
- Remember your language and display preferences.

Analytics Cookies:
- Help us understand how visitors use our website — which pages are popular, where users drop off, and how we can improve navigation.
- We use Google Analytics with anonymised IP addresses, meaning your full IP is never stored by the analytics provider.
- These cookies collect aggregated, non-personally-identifiable information.

Managing Cookies:
- You can manage or delete cookies through your browser settings at any time.
- Most browsers allow you to refuse cookies or alert you when a cookie is being set.
- If you disable essential cookies, some features of our website (such as placing orders or staying logged in) may not function properly.
- We do not use third-party advertising or retargeting cookies on our platform.`,
    },
    {
      title: 'Data Retention',
      content: `We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by Indian law:

- Account data: Retained for the duration your account is active. If you delete your account, we will erase your personal data within 90 days, except where retention is required by law.
- Order history and transaction records: Retained for 8 years after the transaction date, as required under the Indian Income Tax Act and GST regulations for financial record-keeping.
- Baby Coins and loyalty data: Retained for the duration of your account. Baby Coins expire after 12 months of account inactivity, after which the expired coin records are retained for 1 additional year for audit purposes.
- Student Pass records: Retained for 1 year after the pass expires.
- Support tickets and correspondence: Retained for 3 years after resolution for quality assurance and legal purposes.
- Analytics data: Collected in aggregated and anonymised form and may be retained indefinitely, as it cannot be linked back to any individual.
- Marketing consent records: Retained for as long as the consent is valid, plus 2 years after withdrawal (to demonstrate compliance).

When data is no longer needed, we securely delete it from our systems or anonymise it so it can no longer be associated with you.`,
    },
    {
      title: 'Data Security',
      content: `We take the security of your personal information seriously and implement reasonable security practices and procedures as required under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Our measures include:

Technical Safeguards:
- All data transmitted between your browser and our servers is encrypted using TLS (Transport Layer Security) / SSL encryption.
- Passwords are hashed using bcrypt with salting, making them unreadable even to our own systems.
- Sensitive data at rest is encrypted using industry-standard encryption algorithms.
- Our application implements rate limiting, input validation, and protection against common web vulnerabilities (XSS, CSRF, SQL injection).

Organisational Safeguards:
- Access to personal data is restricted to authorised personnel on a need-to-know basis.
- Our staff with data access are bound by confidentiality obligations.
- We conduct periodic security reviews and audits of our systems.
- We maintain secure cloud infrastructure hosted on reputable providers with regular automated backups.

Payment Security:
- We do not store your credit/debit card numbers, CVV, or banking credentials on our servers.
- All online payments are processed through Razorpay, which is PCI-DSS Level 1 compliant (the highest level of payment security certification).
- Cash on Delivery transactions do not involve any digital payment data.

While we strive to protect your personal information, no method of electronic transmission or storage is completely secure. We encourage you to use a strong, unique password for your Burger Empire account and to keep your login credentials confidential.`,
    },
    {
      title: 'Your Rights',
      content: `Under the Information Technology Act, 2000 and its associated rules, you have the following rights regarding your personal data:

- Right to Access: You can request a copy of all personal data we hold about you. You can also view most of your data directly in your account settings, order history, and loyalty dashboard.
- Right to Correction: You can update your personal details (name, email, phone number, addresses) directly through your account page. For corrections to other data, contact us at hello@burger-empire.build.withdarsh.com.
- Right to Withdrawal of Consent: You may withdraw your consent for data processing at any time. This includes opting out of marketing communications, deleting saved addresses, or requesting account deletion. Note that withdrawing consent for essential processing (e.g., order fulfilment) may affect our ability to provide services to you.
- Right to Erasure: You can request deletion of your Burger Empire account and associated personal data. Upon receiving a verified request, we will delete your data within 90 days, except for information we are legally required to retain (e.g., tax records, transaction history under GST and Income Tax regulations).
- Right to Data Portability: You can request your personal data in a structured, commonly used, machine-readable format. Contact us at hello@burger-empire.build.withdarsh.com to initiate a data export.
- Right to Complain: If you are not satisfied with our response, you have the right to lodge a complaint with the relevant authority, including the Grievance Officer designated below or the Adjudicating Officer appointed under Section 46 of the IT Act, 2000.

To exercise any of these rights, email us at hello@burger-empire.build.withdarsh.com with the subject line "Privacy Rights Request". We will verify your identity and respond within 30 days.`,
    },
    {
      title: 'Children\'s Privacy',
      content: `Burger Empire services are intended for a general audience, but account registration and online ordering are available only to individuals aged 16 years and above. We do not knowingly collect personal information from children under the age of 16.

If you are a parent or guardian and believe that your child under 16 has provided personal information to us (e.g., by creating an account), please contact us at hello@burger-empire.build.withdarsh.com. Upon verification, we will promptly delete such information from our records.

Minors between the ages of 16 and 18 may use Burger Empire services with the consent and supervision of a parent or legal guardian. The parent or guardian is responsible for the minor's use of the platform, including any orders placed and payments made.`,
    },
    {
      title: 'Third-Party Links',
      content: `Our website may contain links to third-party websites, services, or applications that are not operated by us. This includes links to Razorpay's payment page, social media platforms, and partner websites.

We are not responsible for the privacy practices, content, or security of any third-party websites. We encourage you to review the privacy policies of any third-party service before providing your personal information.

This Privacy Policy applies solely to information collected through burger-empire.build.withdarsh.com and our associated services.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices, services, legal requirements, or regulatory guidance. When we make changes:

- The "Last updated" date at the top of this page will be revised.
- For material changes that significantly affect how we handle your personal data, we will provide prominent notice on our website and, where possible, send a notification to the email address associated with your account.
- Your continued use of Burger Empire services after the updated policy takes effect constitutes your acceptance of the revised terms.

We encourage you to review this policy periodically to stay informed about how we protect your information.`,
    },
    {
      title: 'Grievance Officer',
      content: `In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have appointed a Grievance Officer to address your concerns regarding data privacy and the processing of personal information.

Grievance Officer:
- Name: The Founder
- Organisation: Abc Foods Pvt Ltd (Burger Empire)
- Email: hello@burger-empire.build.withdarsh.com
- Address: Abc Foods Pvt Ltd (Burger Empire), Abc City, Abc State, India

You may contact the Grievance Officer with any complaints or concerns regarding the processing of your personal information. The Grievance Officer shall acknowledge your complaint within 24 hours and resolve it within 15 days from the date of receipt, as required by law.

If you are unsatisfied with the resolution provided, you may escalate the matter to the Indian Computer Emergency Response Team (CERT-In) or approach the Adjudicating Officer under the IT Act, 2000.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please reach out to us:

- Email: hello@burger-empire.build.withdarsh.com
- Website: burger-empire.build.withdarsh.com/contact
- Address: Abc Foods Pvt Ltd (Burger Empire), Abc City, Abc State, India

We aim to respond to all privacy-related enquiries within 48 hours on business days.`,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      {/* Hero */}
      <section
        className="py-12 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-white/70">
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-5 py-[80px]">
        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-5 md:p-10">
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Burger Empire (&quot;burger-empire.build.withdarsh.com&quot;), operated by Abc Foods Pvt Ltd (&quot;we&quot;, &quot;us&quot;,
            or &quot;our&quot;), is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website
            or use any of our services, including online food ordering, dine-in, table reservations,
            loyalty programmes, gift cards, meal plan subscriptions, and the Student Pass. This policy
            is published in compliance with the Information Technology Act, 2000, the Information
            Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or
            Information) Rules, 2011, and other applicable Indian laws. By using our services, you
            consent to the collection and use of your information as described in this policy.
          </p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ color: accent }}
                >
                  {i + 1}. {section.title}
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
