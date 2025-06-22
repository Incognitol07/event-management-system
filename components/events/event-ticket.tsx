"use client";

import React from "react";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

interface EventTicketProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: { name: string; capacity: number };
    capacity: number;
    priority: string;
    category?: string;
    department?: string;
    organizers?: Array<{
      user: { name: string; role: string };
      role: string;
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
  ticketNumber?: string;
  isPreview?: boolean;
}

export default function EventTicket({
  event,
  user,
  rsvp,
  ticketNumber,
  isPreview = false,
}: EventTicketProps) {
  const eventDate = new Date(event.date);
  const rsvpDate = new Date(rsvp.rsvpAt);

  const primaryOrganizer = event.organizers?.find(
    (org) => org.role === "PRIMARY_ORGANIZER"
  );
  const allOrganizers =
    event.organizers?.filter((org) => org.role === "CO_ORGANIZER") || [];
  const qrData = JSON.stringify({
    eventId: event.id,
    userId: user.id,
    rsvpId: rsvp.id,
    ticketNumber: ticketNumber || `T${event.id}-${user.id}-${rsvp.id}`,
    verificationCode: btoa(`${event.id}:${user.id}:${rsvp.id}:${rsvp.rsvpAt}`),
  });

  const handleDownload = () => {
    const element = document.getElementById("event-ticket-printable");
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Ticket - ${event.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #000;
            }
            .ticket-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              position: relative;
            }
            .perforated-top, .perforated-bottom {
              height: 12px;
              background-image: radial-gradient(circle at 6px 6px, transparent 3px, white 3px);
              background-size: 12px 6px;
              background-repeat: repeat-x;
            }
            .perforated-top {
              background-position: 0 0;
            }
            .perforated-bottom {
              background-position: 0 6px;
            }
            .ticket-content {
              padding: 48px;
              position: relative;
            }
            .ticket-header {
              margin-bottom: 32px;
            }
            .ticket-title {
              font-size: 36px;
              font-weight: 200;
              letter-spacing: -0.025em;
              line-height: 1;
              margin-bottom: 8px;
              color: #111827;
            }
            .ticket-subtitle {
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 16px;
            }
            .accent-line {
              height: 1px;
              width: 128px;
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
              gap: 48px;
              margin-bottom: 32px;
            }
            .detail-section {
              margin-bottom: 32px;
            }
            .detail-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              margin-bottom: 32px;
            }
            .detail-label {
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .detail-value {
              font-size: 18px;
              font-weight: 300;
              color: #111827;
            }
            .description {
              font-size: 14px;
              line-height: 1.6;
              font-weight: 300;
              color: #374151;
            }
            .qr-section {
              text-align: center;
            }
            .qr-container {
              display: inline-block;
              padding: 16px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              margin-bottom: 24px;
            }
            .ticket-number {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: #111827;
              background: #f9fafb;
              padding: 12px;
              border-radius: 8px;
            }
            .attendee-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 32px;
              margin-bottom: 32px;
            }
            .attendee-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 24px;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
            }
            .status-accepted {
              background: #dcfce7;
              color: #166534;
            }
            .footer-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 32px;
              text-align: center;
            }
            .footer-text {
              font-size: 12px;
              letter-spacing: 0.15em;
              color: #9ca3af;
              margin-bottom: 8px;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Download button */}
      {!isPreview && (
        <div className="mb-6 text-center">
          <button
            onClick={handleDownload}
            className="bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center space-x-2 mx-auto touch-manipulation active:scale-95"
          >
            <span>Download Ticket</span>
            <span className="text-lg">⬇</span>
          </button>
        </div>
      )}{" "}
      {/* Printable ticket content */}
      <div id="event-ticket-printable" className="ticket-container">
        <div className="bg-white relative overflow-hidden">
          {/* Subtle grid pattern for mathematical harmony - matches landing page */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Ticket perforated edge effect */}
          <div className="relative">
            {/* Top perforated edge */}
            <div
              className="absolute top-0 left-0 right-0 h-3 bg-white"
              style={{
                background: `radial-gradient(circle at 6px 0px, transparent 3px, white 3px)`,
                backgroundSize: "12px 6px",
                backgroundRepeat: "repeat-x",
              }}
            />

            {/* Bottom perforated edge */}
            <div
              className="absolute bottom-0 left-0 right-0 h-3 bg-white"
              style={{
                background: `radial-gradient(circle at 6px 6px, transparent 3px, white 3px)`,
                backgroundSize: "12px 6px",
                backgroundRepeat: "repeat-x",
              }}
            />

            {/* Main ticket content */}
            <div className="px-8 sm:px-12 py-12 sm:py-16 relative z-10">
              {/* Header section */}
              <div className="mb-8 sm:mb-12">
                <div className="text-xs font-medium text-gray-500 tracking-[0.2em] uppercase mb-4">
                  Event Admission Ticket
                </div>
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-gray-900 tracking-tighter leading-none mb-2">
                    {event.title}
                  </h1>
                  {/* Subtle accent line */}
                  <div className="relative h-px w-24 sm:w-32 bg-gray-900">
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-8 sm:mb-12">
                {/* Event details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Date and time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Date
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {format(eventDate, "EEEE, MMMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Time
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>

                  {/* Venue and capacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Venue
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {event.venue.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Capacity
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {event.capacity} attendees
                      </div>
                    </div>
                  </div>

                  {/* Event details */}
                  {event.category && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Category
                      </div>
                      <div className="text-lg font-light text-gray-900 capitalize">
                        {event.category.toLowerCase().replace(/_/g, " ")}
                      </div>
                    </div>
                  )}

                  {event.department && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Department
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {event.department}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                      Description
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed font-light">
                      {event.description}
                    </div>
                  </div>

                  {/* Organizers */}
                  {primaryOrganizer && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                        Organized by
                      </div>
                      <div className="text-lg font-light text-gray-900 mb-1">
                        {primaryOrganizer.user.name}
                      </div>
                      {allOrganizers.length > 0 && (
                        <div className="text-sm text-gray-600 font-light">
                          with{" "}
                          {allOrganizers.map((org) => org.user.name).join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* QR Code and ticket info */}
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-4">
                      Verification Code
                    </div>
                    <div className="inline-block p-4 bg-white border border-gray-200 rounded-2xl">
                      <QRCodeSVG
                        value={qrData}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                  </div>

                  {/* Ticket number */}
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                      Ticket Number
                    </div>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {ticketNumber || `T${event.id}-${user.id}-${rsvp.id}`}
                    </div>
                  </div>
                </div>
              </div>
              {/* Attendee details */}
              <div className="border-t border-gray-200 pt-8">
                <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-4">
                  Attendee Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Name</div>
                    <div className="text-lg font-light text-gray-900">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <div className="text-lg font-light text-gray-900">
                      {user.email}
                    </div>
                  </div>
                  {user.matricNo && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Matric No.
                      </div>
                      <div className="text-lg font-light text-gray-900">
                        {user.matricNo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Registration details */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
                  <div>
                    <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                      Registration Status
                    </div>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        rsvp.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : rsvp.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rsvp.status.charAt(0) +
                        rsvp.status.slice(1).toLowerCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">
                      Registered On
                    </div>
                    <div className="text-sm font-light text-gray-900">
                      {format(rsvpDate, "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Footer */}
              <div className="border-t border-gray-200 pt-8 mt-8 text-center">
                <div className="text-xs text-gray-400 tracking-[0.15em] mb-2">
                  University Event Management System
                </div>
                <div className="text-xs text-gray-400">
                  Please present this ticket at the event entrance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
