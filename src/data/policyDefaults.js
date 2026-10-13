// Default legal-policy text — mirrors the hardcoded fallbacks in the customer app
// (Frontend/src/Pages/Cancellation.jsx and PrivacyPolicy.jsx). Only the wording is
// editable here; the icon + colour of each card are chosen by position in the
// customer app, so the owner never has to think about styling. These power the
// editors' "Start from current text" seed so the owner edits the real live copy
// instead of a blank form. Once saved, site_content overrides the bundled defaults.

export const DEFAULT_CANCELLATION = [
  { title: 'Reservation Confirmation', content: ['All reservations are considered confirmed only after full payment has been received and a booking confirmation has been issued by Engeemos Bookastay Apartments.'] },
  { title: 'Check-in Day Cancellations', content: ['Cancellations made on the day of check-in are non-refundable.'] },
  { title: 'Booking made a week or less to check-in date', content: [
    'Cancellations made 72 hours or more before the scheduled check-in time will be eligible for a full refund, excluding any non-refundable processing or transaction fees (if applicable).',
    'Cancellations made less than 72 hours before check-in will attract a charge equivalent to either one (1) night’s stay or 50% of the total booking amount, whichever is higher.',
  ] },
  { title: 'Booking made 2 weeks but less than a month to check-in date', content: [
    'Cancellations made 5 days or more before the scheduled check-in time will be eligible for a full refund, excluding any non-refundable processing or transaction fees (if applicable).',
    'Cancellations made less than 5 days before check-in will attract a charge equivalent to 50% of the total booking amount.',
  ] },
  { title: 'Booking made within 1 month or more of check-in', content: [
    'Cancellations made 10 days or more before the scheduled check-in time will be eligible for a full refund, excluding any non-refundable processing or transaction fees (if applicable).',
    'Cancellations made less than 10 days before check-in will attract a charge equivalent to 50% of the total booking amount.',
  ] },
  { title: 'No-Show', content: ['If a guest fails to arrive on the scheduled check-in date without prior notice, the booking will be treated as a no-show and the full booking amount forfeited.'] },
  { title: 'Early Check-Out', content: ['No refunds will be issued for unused nights if a guest checks out earlier than the confirmed check-out date.'] },
  { title: 'Modification of Bookings', content: ['Requests to modify booking dates shall be considered but approval is subject to availability.'] },
  { title: 'Non-refundable Bookings', content: ['Promotional, discounted, or special-rate bookings may be designated as non-refundable. This will be clearly stated at the time of booking.'] },
  { title: 'Refund Processing', content: ['Approved refunds will be processed within 7-14 business days and will be refunded to the original payment method. Bank or payment gateway charges may be deducted where applicable.'] },
  { title: 'Force Majeure', content: ['Engeemos Bookastay Apartments shall not be held liable for cancellations or inability to honour bookings due to events beyond our control, including but not limited to natural disasters, government restrictions, strikes, or emergencies. In such cases, we may offer a credit or reschedule at our discretion.'] },
  { title: 'Policy Updates', content: ['We reserve the right to update or amend this Cancellation Policy at any time. The version in effect at the time of booking shall apply.'] },
];

export const DEFAULT_PRIVACY = [
  { title: 'Personal Data Collection', content: [
    'We collect personal data that you provide when: making reservations or inquiries; communicating with us by phone, email, or messaging apps, and checking in or out of our apartments.',
    'This information may include full name, email, phone number, address, government-issued identification details, booking information (dates, apartment type, etc.), payment transaction data (via third-party providers), optional information you choose to share with us, website usage data (e.g., cookies), and CCTV footage in common/security areas.',
  ] },
  { title: 'Manner of Data Collection', content: ['We obtain personal data from guests via website booking forms, telephone, email, or messaging apps, cookies and analytics on our website.'] },
  { title: 'Purpose & Legal Basis for Data Processing', content: [
    'Collected personal data are processed for purposes including confirming and managing reservations, verifying identity and ensuring guest safety, processing payments and issuing receipts, communicating updates about your stay, complying with legal and regulatory requirements, and improving our services and website experience.',
    'Under the NDPA 2023, the legal basis for data collection includes your consent, the performance of a contract, legal obligations and legitimate interests (when appropriately balanced with your rights).',
  ] },
  { title: 'Consent', content: [
    'By using our website or providing personal data when booking or staying with us, you consent to the collection and processing of your personal data as described in this policy.',
    'You may withdraw your consent at any time, subject to legal or contractual obligations.',
  ] },
  { title: 'Cookies & Website Tracking', content: ['We use cookies and similar technologies to make the site function properly, analyse website performance, and tailor consent to improve your experience. A cookie banner will appear on your first visit to obtain consent for non-essential cookies.'] },
  { title: 'Sharing Your Data', content: ['We do not sell or rent personal data. We may, however, share data with payment processors for payment handling, IT service providers supporting our systems, security and law enforcement (if required by law), and professional advisors like auditors. Any third party receiving your data must protect it in according with applicable data protection laws.'] },
  { title: 'Data Security', content: [
    'We apply appropriate technical and organisational measures to protect personal data against unauthorised access, loss or corruption, unlawful processing, and data breaches.',
    'We regularly review these safeguards to improve data security.',
  ] },
  { title: 'Data Retention', content: ['We retain personal data only as long as necessary for the fulfilment of reservation services, compliance with legal retention obligations, and handling enquiries or disputes. When data is no longer required, it will be securely deleted or anonymised.'] },
  { title: 'Your Rights', content: ['Under the NDPA, you have the right to access your personal data, request correction or update of inaccurate data, request deletion of your data, object to certain processing, restrict processing in specific situations, withdraw consent (where processing is consent-based), and lodge a complaint with the Nigeria Data Protection Commission (NDPC). Contact us to exercise any of these rights.'] },
  { title: 'Data Breach Notification', content: ['In case of a confirmed data breach involving your personal data, we will notify you and the relevant authorities in accordance with NDPA requirements.'] },
  { title: 'Changes to This Policy', content: ['We may update this Privacy Policy to reflect changes in laws or how we process data. The most recent version will always be available on our website.'] },
];
