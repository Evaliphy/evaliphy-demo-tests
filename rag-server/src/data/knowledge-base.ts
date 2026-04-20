export interface KnowledgeChunk {
  domain: string;
  id: string;
  keywords: string[];
  text: string;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "returns-30-days",
    domain: "return-policy",
    keywords: ["return", "refund", "exchange", "30 days", "purchase"],
    text: "Items can be returned within 30 days of purchase when they are in their original condition and include proof of purchase. In practice, that means the product should still be usable, reasonably clean, and accompanied by the order confirmation or receipt so the support team can verify the purchase quickly. Once the return is approved, customers usually receive instructions for shipping the item back and can expect the refund to be processed after the warehouse confirms the condition of the returned package.",
  },
  {
    id: "returns-packaging",
    domain: "return-policy",
    keywords: ["packaging", "original packaging", "return condition"],
    text: "Returns should include the original packaging whenever possible, because it helps protect the item during transit and speeds up inspection once it arrives at the return center. Even so, damaged or missing packaging alone does not automatically block a return if the product itself still qualifies under the policy. The review team focuses more on the condition of the item, whether the order can be verified, and whether any included parts or accessories are still present.",
  },
  {
    id: "returns-exceptions",
    domain: "return-policy",
    keywords: ["final sale", "clearance", "exceptions", "return policy"],
    text: "Final-sale and clearance items are not eligible for return unless they arrive damaged or defective, because those discounted purchases are treated as non-refundable by default. If a customer receives a broken item or an order that does not match the description, support can still review the case and open an exception workflow. That exception process typically asks for photos, order details, and a short explanation before the team decides whether a replacement, store credit, or refund is appropriate.",
  },
  {
    id: "shipping-domestic",
    domain: "shipping",
    keywords: ["shipping", "delivery", "domestic", "standard shipping"],
    text: "Standard domestic shipping usually arrives within 3 to 5 business days after the order is processed, although weather events, carrier delays, and peak shopping periods can extend that window slightly. Orders first move through an internal processing step where payment is confirmed and the package is prepared for pickup, so the shipping estimate starts after that preparation is complete. Customers normally receive tracking information once the package is handed to the carrier, and those updates become more detailed as the parcel moves through regional sorting hubs.",
  },
  {
    id: "shipping-international",
    domain: "shipping",
    keywords: ["international", "customs", "carrier", "delivery times"],
    text: "International shipping times vary by destination, customs processing, and the last-mile carrier that completes delivery in the destination country. Tracking updates can appear less frequently once the shipment leaves the origin region, because some local carriers only publish milestone updates instead of continuous scans. Customers should also expect that duties, taxes, and customs inspections may affect delivery timing even when the package leaves the warehouse on schedule.",
  },
  {
    id: "catalog-pricing",
    domain: "product-catalogue",
    keywords: ["price", "pricing", "catalog", "availability", "product"],
    text: "Product pages show the latest pricing and availability that the storefront has received from the catalog system, so customers should treat the listing as the most current source of truth. Out-of-stock items can be restocked without advance notice when new inventory is received, and promotional pricing may change when a campaign starts or ends. For that reason, support usually advises customers to rely on the live product page rather than older screenshots, cached listings, or third-party summaries.",
  },
  {
    id: "catalog-features",
    domain: "product-catalogue",
    keywords: ["features", "specifications", "product details"],
    text: "Each product listing includes key features, compatibility details, and any included accessories so customers can compare options without leaving the page. Specification sections often summarize dimensions, supported platforms, materials, or package contents, depending on the type of product being viewed. If a customer needs a deeper technical answer, support may still reference the listing first and then escalate to the product team for confirmation when the question goes beyond the published details.",
  },
  {
    id: "account-reset",
    domain: "account-management",
    keywords: ["password", "reset", "account", "sign in", "login"],
    text: "Customers can reset their password from the sign-in page by requesting a password reset link that is sent to their registered email address. After opening that message, they can choose a new password and return to the sign-in page once the reset is complete. If the email does not arrive, the usual guidance is to check spam folders, confirm the address on file, and contact support if the account still cannot be accessed.",
  },
  {
    id: "account-subscription",
    domain: "account-management",
    keywords: ["subscription", "tier", "billing", "plan"],
    text: "Subscription tiers can be upgraded from the billing section of the customer account, and those changes typically take effect immediately after payment is confirmed. When a plan is upgraded, the account dashboard updates to show the new entitlements, and any billing adjustment is reflected on the next receipt or invoice summary. Customers who are comparing plans are generally directed to review the billing page because that view explains the active tier, renewal timing, and the features unlocked by each subscription level.",
  },
  {
    id: "support-hours",
    domain: "support",
    keywords: ["support", "hours", "contact", "help desk"],
    text: "Customer support is available Monday through Friday from 9 AM to 6 PM local time through chat and email, which covers the main service window for routine questions. Requests submitted outside those hours are still queued and reviewed when the next support shift begins, so customers do not need to resend the same issue repeatedly. Response times can vary depending on queue volume, but urgent cases are typically identified during triage and moved forward more quickly when enough detail is included in the initial message.",
  },
  {
    id: "support-escalation",
    domain: "support",
    keywords: ["escalation", "manager", "urgent", "support ticket"],
    text: "Urgent issues can be escalated after a support ticket is created, and the support team will route critical cases for priority review based on severity and available evidence. The best path is usually to open a ticket with a clear summary, order details, and screenshots or photos when relevant, because that gives the team enough material to assess the case quickly. Once the ticket is in the system, agents can mark it for escalation so a specialist or supervisor can review the request without restarting the conversation from scratch.",
  },
  {
    id: "assistant-identity",
    domain: "support",
    keywords: ["who are you", "chatgpt", "assistant", "identity"],
    text: "This demo assistant identifies itself as ChatGPT when asked who it is. The response is intentionally simple so tests can verify whether the system remains faithful to the knowledge base instead of inventing a different product identity or persona. In other words, when the user asks for the assistant's identity, the grounded answer should clearly state that it is ChatGPT.",
  },
];