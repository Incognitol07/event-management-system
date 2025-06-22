"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EventTicket from "@/components/events/event-ticket";
import Modal from "@/components/ui/ticket-modal";

interface TicketSectionProps {
  eventId: string;
  userId: number;
  userRSVP: {
    id?: number;
    status: string;
  } | null;
}

interface TicketData {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: { id: number; name: string; capacity: number };
    capacity: number;
    priority: string;
    category?: string;
    department?: string;
    organizers?: Array<{
      id: number;
      userId: number;
      role: string;
      user: {
        id: number;
        name: string;
        role: string;
      };
    }>;
  };
  user: {
    id: number;
    name: string;
    email: string;
    matricNo?: string;
    role: string;
  };
  rsvp: {
    id: number;
    status: string;
    rsvpAt: string;
  };
  ticketNumber: string;
}

export default function TicketSection({
  eventId,
  userId,
  userRSVP,
}: TicketSectionProps) {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchTicket = async () => {
    if (!userRSVP || userRSVP.status !== "ACCEPTED") return;

    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/ticket`, {
        headers: {
          "x-user-id": userId.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTicketData(data);
      } else {
        console.error("Failed to fetch ticket");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async () => {
    if (!ticketData) {
      await fetchTicket();
    }
    setShowModal(true);
  };
  const handleDownloadTicket = () => {
    if (!ticketData) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download your ticket");
      return;
    }

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Ticket - ${ticketData.event.title}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 16px;
              background: white;
              color: #000;
              line-height: 1.3;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .ticket-container {
              max-width: 720px;
              margin: 0 auto;
              background: white;
              position: relative;
              overflow: hidden;
              page-break-inside: avoid;
              height: auto;
              min-height: auto;
            }
            
            /* Subtle grid pattern */
            .ticket-container::before {
              content: '';
              position: absolute;
              inset: 0;
              opacity: 0.015;
              background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0);
              background-size: 24px 24px;
            }
            
            /* Perforated edges */
            .ticket-container::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 12px;
              background: radial-gradient(circle at 6px 0px, transparent 3px, white 3px);
              background-size: 12px 6px;
              background-repeat: repeat-x;
            }
              .ticket-content {
              padding: 20px 28px;
              position: relative;
              z-index: 10;
            }
            
            .ticket-header {
              margin-bottom: 18px;
            }
              .ticket-subtitle {
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 12px;
            }
            
            .ticket-title {
              font-size: 32px;
              font-weight: 200;
              letter-spacing: -0.025em;
              line-height: 1.1;
              margin-bottom: 8px;
              color: #111827;
            }
            
            .accent-line {
              height: 1px;
              width: 96px;
              background: #111827;
              position: relative;
            }
            
            .accent-dot {
              position: absolute;
              top: -2px;
              left: 50%;
              width: 4px;
              height: 4px;
              background: #111827;
              border-radius: 50%;
              transform: translateX(-50%);
            }
              .content-grid {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 24px;
              margin-bottom: 16px;
            }
            
            .detail-section {
              margin-bottom: 14px;
            }
            
            .detail-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              margin-bottom: 16px;
            }
              .detail-label {
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 4px;
            }
            
            .detail-value {
              font-size: 16px;
              font-weight: 300;
              color: #111827;
              line-height: 1.3;
            }
            
            .description {
              font-size: 13px;
              line-height: 1.5;
              font-weight: 300;
              color: #374151;
            }
            
            .qr-section {
              text-align: center;
            }            .qr-container {
              display: inline-block;
              padding: 12px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              margin-bottom: 16px;
            }
            
            .ticket-number {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #111827;
              background: #f9fafb;
              padding: 8px 12px;
              border-radius: 8px;
            }
            
            .attendee-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              margin-bottom: 12px;
            }
            
            .attendee-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 12px;
            }
            
            .status-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              margin-bottom: 12px;
            }
            
            .status-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }            .status-badge {
              display: inline-flex;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              background: #dcfce7;
              color: #166534;
            }
            
            .organizer-section {
              margin-bottom: 16px;
            }
            
            .organizer-name {
              font-size: 16px;
              font-weight: 300;
              color: #111827;
              margin-bottom: 4px;
            }
            
            .organizer-additional {
              font-size: 13px;
              color: #6b7280;
              font-weight: 300;
            }
            
            .footer-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              text-align: center;
            }
              .footer-text {
              font-size: 11px;
              letter-spacing: 0.15em;
              color: #9ca3af;
              margin-bottom: 4px;
            }              @media print {
              @page {
                size: A4;
                margin: 0.75in;
              }
              
              body {
                margin: 0 !important;
                padding: 0 !important;
                font-size: 100% !important;
              }
              
              .ticket-container {
                max-width: none !important;
                margin: 0 !important;
                page-break-inside: avoid !important;
                transform: scale(0.95);
                transform-origin: top left;
                width: 105% !important;
              }
              
              .ticket-content {
                padding: 24px 32px !important;
              }
              
              .ticket-title {
                font-size: 28px !important;
              }
              
              .detail-value {
                font-size: 15px !important;
              }
              
              .description {
                font-size: 12px !important;
              }
              
              .organizer-name {
                font-size: 15px !important;
              }
              
              .content-grid {
                gap: 28px !important;
                margin-bottom: 18px !important;
              }
              
              .detail-section {
                margin-bottom: 14px !important;
              }
              
              .detail-grid {
                gap: 16px !important;
                margin-bottom: 16px !important;
              }
              
              .attendee-section,
              .status-section {
                padding-top: 14px !important;
                margin-bottom: 14px !important;
              }
              
              .organizer-section {
                margin-bottom: 14px !important;
              }
              
              .footer-section {
                padding-top: 14px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-content">
              <!-- Header section -->
              <div class="ticket-header">
                <div class="ticket-subtitle">Event Admission Ticket</div>
                <div class="ticket-title">${ticketData.event.title}</div>
                <div class="accent-line">
                  <div class="accent-dot"></div>
                </div>
              </div>

              <!-- Main content grid -->
              <div class="content-grid">
                <!-- Event details -->
                <div>
                  <!-- Date and time -->
                  <div class="detail-grid">
                    <div>
                      <div class="detail-label">Date</div>
                      <div class="detail-value">${new Date(
                        ticketData.event.date
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</div>
                    </div>
                    <div>
                      <div class="detail-label">Time</div>
                      <div class="detail-value">${
                        ticketData.event.startTime
                      } - ${ticketData.event.endTime}</div>
                    </div>
                  </div>

                  <!-- Venue and capacity -->
                  <div class="detail-grid">
                    <div>
                      <div class="detail-label">Venue</div>
                      <div class="detail-value">${
                        ticketData.event.venue.name
                      }</div>
                    </div>
                    <div>
                      <div class="detail-label">Capacity</div>
                      <div class="detail-value">${
                        ticketData.event.capacity
                      } attendees</div>
                    </div>
                  </div>

                  ${
                    ticketData.event.category
                      ? `
                    <div class="detail-section">
                      <div class="detail-label">Category</div>
                      <div class="detail-value">${ticketData.event.category
                        .toLowerCase()
                        .replace(/_/g, " ")}</div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    ticketData.event.department
                      ? `
                    <div class="detail-section">
                      <div class="detail-label">Department</div>
                      <div class="detail-value">${ticketData.event.department}</div>
                    </div>
                  `
                      : ""
                  }

                  <!-- Description -->
                  <div class="detail-section">
                    <div class="detail-label">Description</div>
                    <div class="description">${
                      ticketData.event.description
                    }</div>
                  </div>

                  <!-- Organizers -->
                  ${
                    ticketData.event.organizers &&
                    ticketData.event.organizers.length > 0
                      ? `
                    <div class="organizer-section">
                      <div class="detail-label">Organized by</div>
                      ${ticketData.event.organizers
                        .filter((org) => org.role === "PRIMARY_ORGANIZER")
                        .map(
                          (org) => `
                        <div class="organizer-name">${org.user.name}</div>
                      `
                        )
                        .join("")}
                      ${
                        ticketData.event.organizers.filter(
                          (org) => org.role === "CO_ORGANIZER"
                        ).length > 0
                          ? `
                        <div class="organizer-additional">
                          with ${ticketData.event.organizers
                            .filter((org) => org.role === "CO_ORGANIZER")
                            .map((org) => org.user.name)
                            .join(", ")}
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `
                      : ""
                  }
                </div>

                <!-- QR Code and ticket info -->
                <div class="qr-section">
                  <div class="detail-label">Verification Code</div>                  <div class="qr-container">
                    <svg width="100" height="100" style="background: white;">
                      <text x="50" y="50" text-anchor="middle" font-size="10" fill="#666">QR Code</text>
                    </svg>
                  </div>
                  <div class="detail-label">Ticket Number</div>
                  <div class="ticket-number">${ticketData.ticketNumber}</div>
                </div>
              </div>

              <!-- Attendee details -->
              <div class="attendee-section">
                <div class="detail-label">Attendee Information</div>
                <div class="attendee-grid">
                  <div>
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${ticketData.user.name}</div>
                  </div>
                  <div>
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${ticketData.user.email}</div>
                  </div>
                  ${
                    ticketData.user.matricNo
                      ? `
                    <div>
                      <div class="detail-label">Matric No.</div>
                      <div class="detail-value">${ticketData.user.matricNo}</div>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>

              <!-- Registration details -->
              <div class="status-section">
                <div class="status-grid">
                  <div>
                    <div class="detail-label">Registration Status</div>
                    <span class="status-badge">Accepted</span>
                  </div>
                  <div>
                    <div class="detail-label">Registered On</div>
                    <div class="detail-value">${new Date(
                      ticketData.rsvp.rsvpAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })} at ${new Date(
      ticketData.rsvp.rsvpAt
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}</div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer-section">
                <div class="footer-text">University Event Management System</div>
                <div class="footer-text">Please present this ticket at the event entrance</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Only show for accepted RSVPs
  if (!userRSVP || userRSVP.status !== "ACCEPTED") {
    return null;
  }
  return (
    <>
      <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 mb-2">
          🎫 Your Ticket
        </h3>
        <p className="text-sm text-green-700 mb-4">
          Your registration has been accepted! You can now view and download
          your event ticket.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleViewTicket}
            disabled={loading}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            {loading ? "Loading..." : "View Ticket"}
          </Button>

          {ticketData && (
            <Button
              onClick={handleDownloadTicket}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Download Ticket
            </Button>
          )}
        </div>
      </div>{" "}
      {/* Ticket Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Event Ticket"
        maxWidth="max-w-4xl"
        headerActions={
          ticketData && (
            <Button
              onClick={handleDownloadTicket}
              className="bg-gray-900 text-white hover:bg-gray-800 flex items-center space-x-2"
            >
              <span>Download Ticket</span>
              <span>⬇</span>
            </Button>
          )
        }
      >
        {ticketData && (
          <div className="p-6">
            <div id="rendered-ticket">
              <EventTicket
                event={ticketData.event}
                user={ticketData.user}
                rsvp={ticketData.rsvp}
                ticketNumber={ticketData.ticketNumber}
                isPreview={true}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
