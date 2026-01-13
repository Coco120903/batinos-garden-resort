import './Page.css'

function PrivacyPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="legal-page">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Batino's Garden Farm Resort ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our booking system and services.
            </p>
            <p>
              <strong>We will never sell your personal information.</strong> Your privacy is important to us, and we are committed 
              to maintaining the confidentiality and security of your data.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Booking details and preferences</li>
              <li>Payment information (processed securely through payment providers)</li>
              <li>Account credentials (email, password - stored securely and encrypted)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, click patterns)</li>
              <li>IP address and location data (for security and analytics purposes)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage your bookings and reservations</li>
              <li>Communicate with you about your bookings, including confirmations and updates</li>
              <li>Send you important information about your account and our services</li>
              <li>Improve our website, services, and customer experience</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations</li>
              <li>Respond to your inquiries and provide customer support</li>
            </ul>
            <p>
              <strong>We do not use your information for marketing purposes without your explicit consent.</strong>
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in 
              the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We may share information with trusted service providers who assist us in 
                operating our website and conducting our business (e.g., payment processors, email service providers). These 
                providers are contractually obligated to protect your information.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid 
                legal requests.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information 
                may be transferred as part of that transaction.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure password storage using industry-standard hashing</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use 
              commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct your personal information through your account settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account (account will be archived, not permanently deleted)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text 
              files stored on your device that help us remember your preferences and improve site functionality.
            </p>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use 
              certain features of our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information 
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              unless a longer retention period is required or permitted by law. When you delete your account, your information is 
              archived and not permanently deleted, as required for legal and business record-keeping purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy 
              periodically.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul>
              <li>Phone: 0927 272 6865</li>
              <li>Email: batino50@gmail.com</li>
              <li>Facebook: <a href="https://www.facebook.com/people/Batinos-farm-resort/100063931547018/" target="_blank" rel="noopener noreferrer">Batino's Farm Resort</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
