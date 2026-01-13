import './Page.css'

function TermsPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="legal-page">
          <h1>Terms and Conditions</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="legal-section">
            <h2>1. Booking and Reservations</h2>
            <p>
              All bookings are subject to availability and confirmation. To secure your reservation, a deposit may be required. 
              Bookings are confirmed only after payment is received and processed.
            </p>
            <p>
              You must be at least 18 years old to make a booking. By making a booking, you confirm that you have the authority 
              to accept and do accept these terms and conditions.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Payment Terms</h2>
            <p>
              Payment terms will be specified at the time of booking. We accept various payment methods as indicated during checkout. 
              Full payment may be required before the event date, depending on the package selected.
            </p>
            <p>
              All prices are in Philippine Peso (₱) and are subject to change without prior notice. The price confirmed at booking 
              is the final price, unless additional services are requested.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Cancellation and Refunds</h2>
            <p>
              <strong>Cancellation by Guest:</strong> Cancellations must be made in writing. Refund policies vary based on the 
              cancellation date:
            </p>
            <ul>
              <li>More than 14 days before the event: Full refund minus processing fees</li>
              <li>7-14 days before the event: 50% refund</li>
              <li>Less than 7 days before the event: No refund</li>
            </ul>
            <p>
              <strong>Cancellation by Resort:</strong> In the unlikely event that we must cancel your booking, you will receive 
              a full refund or the option to reschedule at no additional cost.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Guest Responsibilities</h2>
            <p>
              Guests are responsible for the conduct of all members of their party. Any damage to property or facilities will be 
              charged to the booking party. The resort reserves the right to refuse service or remove guests who violate resort 
              policies or engage in disruptive behavior.
            </p>
            <p>
              Guests must comply with all resort rules, including but not limited to: noise restrictions, pool safety rules, 
              and facility usage guidelines.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Package Inclusions</h2>
            <p>
              Package details, including included pax, duration, and amenities, are specified at the time of booking. Additional 
              guests beyond the included pax will incur extra charges as stated in the package description.
            </p>
            <p>
              Some amenities or services may be subject to availability or seasonal restrictions. We will notify you of any 
              significant changes to your booking.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Liability</h2>
            <p>
              Batino's Garden Farm Resort is not liable for any loss, damage, or injury to persons or property during your stay, 
              except where such loss, damage, or injury is directly caused by our negligence.
            </p>
            <p>
              Guests are advised to secure appropriate travel or event insurance. We recommend that valuable items are not left 
              unattended.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Force Majeure</h2>
            <p>
              We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable control, 
              including but not limited to natural disasters, government restrictions, or pandemics. In such cases, we will work 
              with you to reschedule or provide appropriate refunds.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to Bookings</h2>
            <p>
              Changes to bookings are subject to availability and may incur additional charges. Rescheduling requests should be 
              made as early as possible. We will do our best to accommodate reasonable requests.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Privacy and Data</h2>
            <p>
              Your personal information will be used in accordance with our Privacy Policy. By making a booking, you consent 
              to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us:
            </p>
            <ul>
              <li>Phone: 0927 272 6865</li>
              <li>Email: batino50@gmail.com</li>
              <li>Facebook: <a href="https://www.facebook.com/people/Batinos-farm-resort/100063931547018/" target="_blank" rel="noopener noreferrer">Batino's Farm Resort</a></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of the Philippines. Any disputes will be subject to the 
              exclusive jurisdiction of the courts of Cavite, Philippines.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
