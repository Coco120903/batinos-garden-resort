import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './Page.css'

function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How do I make a booking?",
      answer: "You can book through our website by selecting a package, choosing your preferred date and time, and completing the booking form. You must be logged in and have a verified email address to make a booking. After submitting your booking, it will be reviewed by our admin team and you'll receive a confirmation once approved."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods. Payment details and terms will be provided during the booking process. A deposit may be required to secure your reservation, with full payment typically due before your event date."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can request to cancel or reschedule your booking. Cancellation and refund policies vary based on timing: full refund (minus fees) for cancellations more than 14 days in advance, 50% refund for 7-14 days, and no refund for less than 7 days. Rescheduling is subject to availability. Please contact us as early as possible for any changes."
    },
    {
      question: "What is included in the package?",
      answer: "Each package includes a specific number of guests (pax), duration, and access to resort facilities. Details are shown when you select a package. Additional guests beyond the included pax will incur extra charges. Some packages may include specific amenities or services - check the package description for full details."
    },
    {
      question: "What happens if I exceed the included pax?",
      answer: "If your group exceeds the included number of guests in your package, additional charges will apply per person as specified in the package details. Please inform us of the exact number of guests when booking to ensure accurate pricing."
    },
    {
      question: "How do I verify my email address?",
      answer: "After creating an account, you'll receive a verification email. Click the link in the email to verify your account. You must verify your email before you can make bookings. If you didn't receive the email, check your spam folder or use the 'Resend Verification' option on the login page."
    },
    {
      question: "What if I forget my password?",
      answer: "You can reset your password using the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "Can I book for someone else?",
      answer: "Yes, you can make a booking on behalf of someone else. However, the person making the booking is responsible for the reservation, payment, and ensuring all guests comply with resort policies."
    },
    {
      question: "What are your operating hours?",
      answer: "Our operating hours may vary by package and season. Standard hours are typically 6:00 AM to 10:00 PM, but specific packages may have different time slots. Check your booking confirmation or contact us for specific details about your package."
    },
    {
      question: "What facilities are available at the resort?",
      answer: "Our resort features multiple swimming pools (adult, teens, and baby pools), venue halls for events, cottages for accommodation, videoke facilities, parking, gaming areas, and playground facilities. Specific access depends on your selected package."
    },
    {
      question: "Is there parking available?",
      answer: "Yes, we have parking available for up to 13 cars. Parking is included with your booking at no additional charge."
    },
    {
      question: "Can I bring outside food and drinks?",
      answer: "Policies regarding outside food and drinks may vary. Some packages may include catering, while others may allow outside food with certain restrictions. Please check your package details or contact us directly for specific policies."
    },
    {
      question: "What should I do if I have a complaint or issue?",
      answer: "If you experience any issues during your visit or have concerns, please contact our staff immediately. You can also reach us via phone (0927 272 6865), email (batino50@gmail.com), or Facebook. We're committed to resolving any issues promptly."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking as early as possible, especially for weekends, holidays, and peak seasons. Popular dates fill up quickly, so booking 2-4 weeks in advance is advisable. However, we accept bookings based on availability."
    },
    {
      question: "Do you offer discounts for large groups or repeat customers?",
      answer: "We may offer special rates for large groups or special occasions. Please contact us directly via phone or Facebook to discuss your specific needs and any available discounts or packages."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="faqs-page">
          <div className="faqs-header">
            <h1>Frequently Asked Questions</h1>
            <p className="page-subtitle">
              Find answers to common questions about booking, packages, and our services.
            </p>
          </div>

          <div className="faqs-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`faq-icon ${openIndex === index ? 'faq-icon--open' : ''}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faqs-footer">
            <p>
              Still have questions? Contact us at{' '}
              <a href="tel:+639272726865">0927 272 6865</a>,{' '}
              <a href="mailto:batino50@gmail.com">batino50@gmail.com</a>, or{' '}
              <a href="https://www.facebook.com/people/Batinos-farm-resort/100063931547018/" target="_blank" rel="noopener noreferrer">
                message us on Facebook
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQsPage
