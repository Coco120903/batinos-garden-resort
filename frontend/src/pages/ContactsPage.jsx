import { MapPin, Phone, ExternalLink, Facebook, Mail } from 'lucide-react'
import './Page.css'

function ContactsPage() {
  const googleMapsUrl = 'https://maps.app.goo.gl/HBgXnASeCD4v2LRk9'
  const facebookUrl = 'https://www.facebook.com/people/Batinos-farm-resort/100063931547018/'
  const phoneNumber = '0927 272 6865'

  return (
    <div className="page contacts-page">
      <div className="container">
        <div className="contacts-header">
          <h1>Contact Us</h1>
          <p className="page-subtitle">Message us on Facebook or call for bookings and inquiries.</p>
        </div>

        <div className="contacts-content">
          {/* Primary contact actions */}
          <div className="contact-actions">
            <a className="contact-action" href="tel:+639272726865">
              <span className="contact-action__icon"><Phone size={20} /></span>
              <span className="contact-action__text">
                <strong>{phoneNumber}</strong>
                <span>Call us for booking and inquiries</span>
              </span>
            </a>

            <a className="contact-action" href={facebookUrl} target="_blank" rel="noopener noreferrer">
              <span className="contact-action__icon"><Facebook size={20} /></span>
              <span className="contact-action__text">
                <strong>Facebook Page</strong>
                <span>Send us a message (fast replies)</span>
              </span>
              <ExternalLink size={18} />
            </a>

            <a className="contact-action" href="mailto:batino50@gmail.com">
              <span className="contact-action__icon"><Mail size={20} /></span>
              <span className="contact-action__text">
                <strong>batino50@gmail.com</strong>
                <span>Send us an email</span>
              </span>
            </a>

          </div>

          {/* Google Maps Embed */}
          <div className="maps-section">
            <h2>Find Us</h2>
            <p className="maps-subtitle">Silang, Cavite, Philippines</p>
            <div className="maps-container">
              <iframe
                src="https://www.google.com/maps?q=Batino's+Farm+Resort,Silang,Cavite,Philippines&output=embed"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: 'var(--border-radius-lg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Batino's Farm Resort Location"
              ></iframe>
              <div className="maps-footer">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <MapPin size={18} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactsPage
