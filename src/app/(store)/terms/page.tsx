'use client';

import { useMode } from '@/hooks/useMode';

export default function TermsOfServicePage() {
  const { isClassic } = useMode();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using the Burger Empire website (burger-empire.build.withdarsh.com), or any of our related services — including online food ordering, dine-in, table reservations, loyalty programmes, gift cards, meal plan subscriptions, the Student Pass, referral programme, and coupon offers (collectively, the "Services") — you agree to be bound by these Terms and Conditions.

These terms constitute a legally binding agreement between you ("you", "your", "user", or "customer") and Abc Foods Pvt Ltd ("Burger Empire", "we", "us", or "our"), a company registered in India. If you do not agree to these terms, please do not use our Services.

These terms are published in accordance with the Information Technology Act, 2000, the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Food Safety and Standards Act, 2006 (FSSAI), and other applicable Indian laws.`,
    },
    {
      title: 'Account Registration and Responsibilities',
      content: `To access certain features of our Services — such as placing orders, earning Baby Coins, using gift cards, subscribing to meal plans, or making reservations — you must create a Burger Empire account. By registering, you agree to:

- Provide accurate, current, and complete information (name, email, phone number).
- Maintain the security of your password and account credentials. You are solely responsible for all activities that occur under your account.
- Use only one account per person. Creating multiple accounts to exploit promotional offers, referral bonuses, or Baby Coins is strictly prohibited and will result in suspension of all associated accounts and forfeiture of accrued benefits.
- Promptly update your account information if it changes.
- Notify us immediately at hello@burger-empire.build.withdarsh.com if you suspect any unauthorised access to or use of your account.

You must be at least 16 years of age to create an account. Individuals between 16 and 18 may use the platform with the consent and supervision of a parent or legal guardian.

We reserve the right to suspend, restrict, or permanently terminate any account that violates these terms, is involved in fraudulent activity, or is used in a manner that we reasonably consider harmful to Burger Empire, our partners, or other users.`,
    },
    {
      title: 'Ordering and Payment',
      content: `When you place an order through our platform, the following terms apply:

Pricing:
- All prices on burger-empire.build.withdarsh.com are listed in Indian Rupees (INR).
- Prices include applicable GST unless stated otherwise. The tax breakdown is displayed at checkout.
- Menu prices are subject to change without prior notice. The price displayed at the time you confirm your order is the price that will be charged.
- Prices may vary between delivery, pickup, and dine-in due to packaging, delivery charges, or outlet-specific pricing.

Payment Methods:
- Online Payment: We accept payments through Razorpay, which supports UPI, credit cards, debit cards, net banking, and digital wallets (Paytm, PhonePe, etc.). All online payments are processed securely by Razorpay in compliance with PCI-DSS standards.
- Cash on Delivery (COD): Available in select delivery areas. COD availability may be restricted for certain order values or during peak hours at our discretion.
- Baby Coins: Accumulated loyalty points may be redeemed towards payment, subject to the terms of the Baby Coins programme (Section 7).
- Gift Card Balance: Gift card credits can be applied at checkout (Section 8).

Order Confirmation:
- An order is confirmed only when you receive an order confirmation notification (via email, SMS, or WhatsApp) with an order ID.
- We reserve the right to refuse, cancel, or limit any order for reasons including: item unavailability, pricing errors, suspected fraud, delivery area limitations, outlet closure, or if the order exceeds reasonable quantity limits.
- In the event of a pricing error, we will notify you and provide the option to proceed at the corrected price or cancel the order for a full refund.`,
    },
    {
      title: 'Pricing and Menu Availability',
      content: `- Our menu is subject to change. Items may be added, removed, or modified at any time based on ingredient availability, seasonality, or business decisions.
- We make reasonable efforts to display accurate descriptions and images of our food items. However, actual items may vary slightly in appearance from photographs on the website.
- Certain items may be available only at specific outlets (Abc City or Abc City 2) or during specific hours.
- We comply with the Food Safety and Standards Act, 2006 (FSSAI) and display our FSSAI licence information as required. Nutritional and allergen information, where provided, is approximate and intended as a general guide.
- Customers with food allergies or dietary restrictions are strongly encouraged to review ingredient information on our website and inform our staff before ordering. While we take precautions, our kitchens handle common allergens and cross-contamination cannot be fully eliminated.
- All food items are prepared fresh and are intended for immediate consumption. We do not guarantee shelf life beyond the day of delivery.`,
    },
    {
      title: 'Delivery and Pickup',
      content: `Delivery:
- We deliver to serviceable areas within our delivery radius around our Abc City and Abc City 2 outlets. You can check delivery availability by entering your address or PIN code on our website.
- Delivery fees may apply based on distance, order value, and demand. The delivery fee is clearly displayed at checkout before you confirm your order.
- Estimated delivery times are approximate and typically range from 30 to 60 minutes. Actual delivery times may vary due to order volume, weather conditions, traffic, kitchen load, or other factors beyond our control.
- You are responsible for providing a complete and accurate delivery address and a reachable phone number. If our delivery personnel cannot reach you or access your location within a reasonable time (approximately 10 minutes of arrival), the order may be marked as delivered, and no refund will be provided.
- We are not liable for quality deterioration of food items caused by delayed acceptance of delivery by the customer.
- Minimum order values may apply for delivery orders and may vary by location.

Pickup:
- Pickup orders can be placed online and collected from the selected outlet during operating hours.
- You will receive a notification when your order is ready for collection.
- Pickup orders must be collected within 30 minutes of the ready notification. Orders not collected within this window may be disposed of, and no refund will be issued.

Dine-In:
- Menu items, prices, and availability for dine-in may differ from online ordering.
- Payment for dine-in orders is subject to the terms of the respective outlet.`,
    },
    {
      title: 'Cancellation and Refund Policy',
      content: `We want you to be satisfied with every Burger Empire experience. Our cancellation and refund policy is as follows:

Cancellation by You:
- You may cancel your order within 2 minutes of placement for a full refund. This cancellation window is available through the order tracking page on our website.
- After the 2-minute window, cancellation may not be possible as food preparation typically begins immediately. Requests made after this window will be considered on a case-by-case basis.

Cancellation by Us:
- If we are unable to fulfil your order (due to item unavailability, outlet closure, or unforeseen circumstances), we will notify you promptly and provide a full refund to the original payment method.
- We reserve the right to cancel orders that we suspect are fraudulent, placed using stolen payment methods, or that violate these terms.

Refund Processing:
- Refunds for online payments will be processed within 5-7 business days to the original payment method (credit card, debit card, UPI, wallet, etc.) via Razorpay.
- Cash on Delivery refunds will be processed as Burger Empire store credit or via bank transfer (NEFT/IMPS) to your designated bank account within 7-10 business days.
- Refunds paid using Baby Coins will be credited back to your Baby Coins balance.
- Refunds paid using gift card balance will be credited back to the gift card.

Quality Issues:
- If you receive an incorrect order, missing items, or food that does not meet our quality standards, please contact our support team within 2 hours of delivery. Include your order ID and photographs showing the issue.
- After investigation, we will offer an appropriate resolution, which may include a full or partial refund, replacement, store credit, or Baby Coins compensation.
- Refunds or replacements are generally not available for items that have been substantially consumed, unless a genuine quality or safety issue is identified.

This refund policy is in accordance with the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020.`,
    },
    {
      title: 'Loyalty Programme — Baby Coins',
      content: `Burger Empire operates a loyalty rewards programme called "Baby Coins." By participating, you agree to the following terms:

Earning Baby Coins:
- You earn Baby Coins on qualifying purchases made through your Burger Empire account, at the rate specified on the rewards page. The earning rate may vary based on your loyalty tier (Bronze, Silver, or Gold).
- Baby Coins are credited to your account after an order is successfully delivered or picked up. Cancelled or refunded orders do not earn Baby Coins.
- Bonus Baby Coins may be awarded through promotional campaigns, referral completions, or special events, at our discretion.

Redeeming Baby Coins:
- Baby Coins can be redeemed for rewards from the rewards catalogue, which may include free food items, delivery fee waivers, and other benefits.
- Each reward has a specified Burger Coin cost, which is subject to change.
- Baby Coins can also be applied as a discount on orders, at the conversion rate displayed at checkout.
- Redeemed Baby Coins cannot be reversed, refunded, or converted back to cash.

Loyalty Tiers:
- The programme includes three tiers — Bronze, Silver, and Gold — based on your total Baby Coins earned. Each tier offers different earning multipliers and perks.
- Tier status is evaluated periodically and may be adjusted based on your activity.

General Rules:
- Baby Coins have no monetary or cash value and cannot be transferred, sold, bartered, or exchanged for money.
- Baby Coins are non-transferable between accounts.
- Baby Coins may expire after 12 months of account inactivity (no orders placed or Baby Coins earned/redeemed).
- Abuse of the programme — including creating multiple accounts, exploiting technical errors, or engaging in fraudulent transactions to earn Baby Coins — will result in immediate forfeiture of all Baby Coins and possible account suspension.
- We reserve the right to modify the earning rates, redemption values, tier thresholds, rewards catalogue, or the overall programme structure at any time. Material changes will be communicated via email or on-site notification with reasonable advance notice.
- We reserve the right to discontinue the Baby Coins programme at any time. In such an event, we will provide at least 30 days' notice for members to redeem their outstanding balance.`,
    },
    {
      title: 'Gift Cards',
      content: `Burger Empire gift cards (digital) are subject to the following terms:

- Gift cards can be purchased on burger-empire.build.withdarsh.com and are delivered digitally via email to the recipient.
- Gift cards are denominated in Indian Rupees (INR) and can be applied towards any purchase on our platform, including food orders and meal plan subscriptions.
- Gift cards do not expire, in compliance with applicable Indian consumer protection guidelines.
- Gift cards are non-refundable and cannot be exchanged for cash, cheque, or bank transfer.
- Gift card balances cannot be transferred from one gift card to another or to another user's account.
- Multiple gift cards may be applied to a single order, subject to platform functionality.
- If an order total exceeds the gift card balance, the remaining amount must be paid via another accepted payment method. If the order total is less than the gift card balance, the remaining balance stays on the gift card for future use.
- We are not responsible for lost, stolen, or unauthorised use of gift card codes. Treat your gift card code as you would cash. We will not reissue or replace gift cards that have been used without your authorisation.
- We reserve the right to deactivate or refuse gift cards that we believe were obtained fraudulently, or to limit gift card purchases if we suspect abuse.
- Gift card purchases are final. Once a gift card has been delivered, it is not eligible for return, cancellation, or refund.`,
    },
    {
      title: 'Student Pass',
      content: `The Burger Empire Student Pass offers verified students an automatic discount on orders. By applying for and using the Student Pass, you agree to these terms:

Eligibility and Verification:
- The Student Pass is available to currently enrolled students at recognised educational institutions in India.
- To apply, you must provide your student enrollment number and the name of your institution through your Burger Empire account.
- Verification is typically completed within 24-48 hours. We reserve the right to request additional documentation to verify your student status.
- Providing false or misleading student information will result in immediate revocation of the Student Pass, forfeiture of any discounts received, and potential account suspension.

Discount and Usage:
- Once verified, the student discount is automatically applied to eligible orders placed through your account. No coupon code is required.
- The discount percentage is specified on the Student Pass page and may vary.
- The Student Pass discount may not be combined with certain other offers, coupons, or promotions, as specified in the terms of those offers.
- The discount applies to the food subtotal and does not apply to delivery fees, packaging charges, or taxes.

Validity and Renewal:
- The Student Pass is valid for the period specified at the time of issuance (typically one academic year).
- You may be required to re-verify your student status upon expiry for renewal.
- We reserve the right to modify the discount percentage, eligible items, or terms of the Student Pass programme at any time with reasonable notice.
- We reserve the right to revoke a Student Pass at any time if we determine that the holder is no longer an eligible student or has violated these terms.`,
    },
    {
      title: 'Meal Plans and Subscriptions',
      content: `Burger Empire offers meal plan subscriptions that allow you to receive scheduled deliveries at a discounted rate. By subscribing, you agree to these terms:

Subscription Terms:
- Meal plans are available in various configurations (e.g., daily, weekly) as displayed on our meal plans page. Plan options, pricing, and availability are subject to change.
- When you subscribe, you agree to the plan duration, delivery schedule, and total price as displayed at the time of purchase.
- Payment for meal plans is collected upfront for the selected plan period, or on a recurring basis as specified in the plan details.

Delivery and Scheduling:
- Meal plan deliveries are made to the address specified in your subscription. You may update your delivery address with reasonable advance notice.
- Delivery times for meal plan orders follow our standard delivery windows.
- If you are unavailable to receive a scheduled delivery and have not paused or skipped it in advance, the delivery will be marked as fulfilled, and that meal will be deducted from your plan.

Pausing, Skipping, and Cancellation:
- You may pause or skip individual deliveries through your account, subject to the advance notice period specified in your plan details.
- You may cancel your meal plan subscription at any time. Refunds for unused portions of prepaid plans will be calculated on a pro-rata basis, minus any discounts already applied (i.e., refunds are calculated at the regular non-subscription menu price for meals already delivered).
- We reserve the right to cancel or modify meal plan offerings with reasonable notice. If we cancel a plan, you will receive a full refund for any undelivered meals.

General:
- Meal plan subscriptions are personal and non-transferable.
- The menu items included in meal plans may rotate and are subject to availability.
- Meal plan pricing reflects a discounted rate compared to individual ordering. The discount is contingent on completing the full plan period.`,
    },
    {
      title: 'Promotional Offers, Coupons, and Referral Programme',
      content: `Promotional Offers and Coupons:
- From time to time, we may offer promotional discounts, coupon codes, and special deals. Each promotion is subject to its own specific terms, including validity period, minimum order value, maximum discount amount, eligible items, and usage limits.
- Coupons are intended for personal use only. Unless explicitly stated, coupons are limited to one use per customer and per account.
- Coupons cannot be combined with other coupons or certain other offers unless explicitly stated.
- We reserve the right to withdraw, modify, or cancel any promotional offer at any time without prior notice.
- Coupons obtained through unauthorised channels, bulk generation, or exploitation of technical errors are void and will not be honoured.
- If an order placed with a coupon is cancelled or refunded, the coupon may or may not be reinstated at our discretion.

Referral Programme:
- Burger Empire's referral programme allows you to invite friends to join the platform. When a referred friend creates an account using your referral link or code and completes their first qualifying order, both you and your friend may receive Baby Coins or other rewards as specified in the programme details.
- Referral rewards are credited after the referred friend's first order is successfully delivered and not refunded.
- Self-referrals (referring yourself using a different account or identity) are strictly prohibited and will result in forfeiture of referral rewards and potential account suspension.
- We reserve the right to modify or discontinue the referral programme, including reward amounts and eligibility criteria, at any time.
- There may be a limit on the number of referral rewards you can earn within a given period.`,
    },
    {
      title: 'Table Reservations',
      content: `You can reserve a table at our dine-in outlets (Abc City and Abc City 2) through burger-empire.build.withdarsh.com. The following terms apply:

- Reservations are subject to availability and are confirmed only when you receive a confirmation notification.
- Please arrive within 15 minutes of your reserved time. Reservations not honoured within this window may be released to other guests without notice.
- You may cancel or modify a reservation through your account or by contacting us. We appreciate advance notice for cancellations so we can accommodate other guests.
- The number of guests should match the party size specified in the reservation. Significant changes to party size may require a new reservation.
- Reservations are for the specified date, time, and outlet only. They are non-transferable.
- We reserve the right to cancel reservations in the event of unforeseen circumstances (e.g., outlet closure, maintenance, private events). We will notify you as early as possible and assist with rebooking.
- Table reservations do not guarantee specific seating arrangements unless explicitly confirmed.
- Menu items, pricing, and offers available for dine-in may differ from online ordering.`,
    },
    {
      title: 'User Conduct',
      content: `When using Burger Empire services, you agree not to:

- Use the platform for any unlawful purpose or in violation of any applicable Indian laws.
- Provide false, inaccurate, or misleading information during registration, ordering, or any interaction with our platform.
- Create multiple accounts to abuse promotions, referral programmes, Baby Coins, or any other benefits.
- Attempt to gain unauthorised access to other user accounts, our servers, databases, or any systems connected to our platform.
- Interfere with or disrupt the operation of our website, including through the use of bots, scrapers, automated scripts, or denial-of-service attacks.
- Use our platform to transmit spam, phishing attempts, malware, or any harmful or offensive content.
- Reproduce, duplicate, copy, sell, resell, or exploit any portion of our Services for commercial purposes without our express written permission.
- Harass, abuse, threaten, or intimidate our staff, delivery personnel, or other customers.
- Attempt to manipulate reviews, ratings, or feedback on our platform.
- Use the platform in any manner that could damage, disable, overburden, or impair our infrastructure.

Violation of these rules may result in immediate account suspension or termination, forfeiture of accrued benefits (Baby Coins, rewards, gift card balances), and, where applicable, legal action.`,
    },
    {
      title: 'Intellectual Property',
      content: `All content, trademarks, and intellectual property on the Burger Empire platform are owned by or licensed to Abc Foods Pvt Ltd and are protected under the Copyright Act, 1957, the Trade Marks Act, 1999, and other applicable Indian intellectual property laws:

- The Burger Empire name, logo, tagline, and all associated branding elements are proprietary to Abc Foods Pvt Ltd. You may not use, reproduce, or display them without our prior written consent.
- All website content — including text, graphics, images, photographs, icons, recipes, UI design, and software code — is the property of Abc Foods Pvt Ltd or its licensors and is protected by copyright.
- You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content from our platform without prior written permission.
- You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use our website for personal, non-commercial purposes (i.e., browsing the menu and placing orders).
- Any feedback, suggestions, ideas, or improvements you voluntarily provide to us regarding our Services may be used by us without any obligation, compensation, or attribution to you.`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by applicable Indian law, including the Consumer Protection Act, 2019:

- Burger Empire and Abc Foods Pvt Ltd, including our directors, employees, agents, and partners, shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of (or inability to use) our Services. This includes, without limitation, loss of profits, data, goodwill, or other intangible losses.
- Our total aggregate liability for any claim arising from or related to these terms or your use of the Services shall not exceed the amount actually paid by you for the specific order or service that gave rise to the claim.
- We do not guarantee that our website or Services will be available at all times, uninterrupted, error-free, or free from harmful components. We are not liable for any loss or damage caused by temporary unavailability of our platform due to maintenance, technical issues, or force majeure events.
- We are not responsible for allergic reactions or adverse health effects arising from the consumption of our food products where the customer has not disclosed their allergies or has disregarded allergen information provided on our platform. Customers with known allergies must exercise their own judgement and inform our staff.
- We are not liable for damages arising from the acts or omissions of third-party service providers, including payment processors (Razorpay), delivery logistics, telecommunications providers, or cloud hosting services.
- Nothing in these terms excludes or limits liability that cannot be excluded or limited under applicable Indian law, including liability for death or personal injury caused by negligence, or fraud.`,
    },
    {
      title: 'Dispute Resolution and Governing Law',
      content: `Governing Law:
- These Terms and Conditions are governed by and construed in accordance with the laws of India.

Dispute Resolution:
- If you have a dispute or complaint regarding our Services, we encourage you to first contact our customer support team at hello@burger-empire.build.withdarsh.com. We will make every effort to resolve your concern promptly and fairly.
- If the dispute is not resolved through customer support, you may escalate the matter to our Grievance Officer (details in our Privacy Policy).
- Before initiating any formal legal proceedings, you agree to attempt resolution through good-faith negotiation and, if necessary, mediation.
- For consumer complaints, you may also approach the appropriate Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019 — at the District, State, or National level, depending on the value of the claim.

Jurisdiction:
- Subject to the consumer forum remedies described above, any legal proceedings arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts in Abc City, Abc State, India.

Force Majeure:
- We shall not be liable for any failure or delay in performing our obligations where such failure or delay results from circumstances beyond our reasonable control, including but not limited to: natural disasters, pandemics, government orders or restrictions, strikes, riots, power outages, internet or telecommunications failures, fire, flood, or acts of war.`,
    },
    {
      title: 'Changes to These Terms',
      content: `We reserve the right to update, modify, or replace these Terms and Conditions at any time. When we make changes:

- The "Last updated" date at the top of this page will be revised.
- For material changes that significantly affect your rights or obligations, we will provide prominent notice on our website and, where possible, send a notification to the email address associated with your account at least 7 days before the changes take effect.
- Your continued use of Burger Empire services after the updated terms take effect constitutes your acceptance of the revised terms.
- If you do not agree with any changes, you should discontinue use of our Services and close your account. Any orders already placed before the change will be governed by the terms in effect at the time of the order.

We encourage you to review these terms periodically.`,
    },
    {
      title: 'Severability',
      content: `If any provision of these Terms and Conditions is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions. The remaining terms will continue in full force and effect.`,
    },
    {
      title: 'Entire Agreement',
      content: `These Terms and Conditions, together with our Privacy Policy, and any specific terms applicable to individual services (such as promotional offer terms, meal plan terms, or gift card terms as displayed at the time of purchase), constitute the entire agreement between you and Abc Foods Pvt Ltd regarding your use of Burger Empire services.

These terms supersede any prior agreements, communications, or understandings, whether written or oral, relating to the subject matter herein.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions, concerns, or feedback about these Terms and Conditions, please contact us:

- Email: hello@burger-empire.build.withdarsh.com
- Website: burger-empire.build.withdarsh.com/contact
- Address: Abc Foods Pvt Ltd (Burger Empire), Abc City, Abc State, India

For urgent order-related issues, please use our in-app support chat or reach out via WhatsApp. Our customer support team typically responds within a few hours on business days.

For legal notices, please send correspondence to: Abc Foods Pvt Ltd (Burger Empire), Abc City, Abc State, India, or email hello@burger-empire.build.withdarsh.com with the subject line "Legal Notice".`,
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
            Terms &amp; Conditions
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
            Please read these Terms and Conditions carefully before using the Burger Empire platform
            (burger-empire.build.withdarsh.com), operated by Abc Foods Pvt Ltd. By accessing or using our website and services —
            including online food ordering, dine-in, table reservations, loyalty programmes, gift
            cards, meal plan subscriptions, the Student Pass, referral programme, and promotional
            offers — you agree to be bound by these terms. These terms are governed by the laws of
            India, including the Information Technology Act, 2000, the Consumer Protection Act, 2019,
            and the Food Safety and Standards Act, 2006.
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
