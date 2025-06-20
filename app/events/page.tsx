'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { format } from 'date-fns'
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, XCircle, Plus } from 'lucide-react'

type Event = {
  id: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  venue: { name: string; capacity: number }
  capacity: number
  priority: string
  isApproved: boolean
  createdBy: { name: string; role: string }
}

export default function EventsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('approved')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user, filter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        let filteredEvents = data
        
        if (filter === 'approved') {
          filteredEvents = data.filter((event: Event) => event.isApproved)
        } else if (filter === 'pending') {
          filteredEvents = data.filter((event: Event) => !event.isApproved)
        }
        
        setEvents(filteredEvents)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveEvent = async (eventId: number) => {
    if (user?.role !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/events/${eventId}/approve`, {
        method: 'PATCH',
      })
      if (response.ok) {
        fetchEvents() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to approve event:', error)
    }
  }

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const canCreateEvents = user.role === 'ADMIN' || user.role === 'STAFF'
  const canApproveEvents = user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          </div>
          {canCreateEvents && (
            <button
              onClick={() => router.push('/events/new')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Approved Events
          </button>
          {canApproveEvents && (
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'pending' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending Approval
            </button>
          )}
          {canApproveEvents && (
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Events
            </button>
          )}
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No events found for the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      {event.isApproved ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        event.priority === 'EMERGENCY' ? 'bg-red-100 text-red-700' :
                        event.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        event.priority === 'NORMAL' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.capacity} expected</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      Created by {event.createdBy.name} ({event.createdBy.role})
                    </div>
                  </div>
                  {canApproveEvents && !event.isApproved && (
                    <button
                      onClick={() => approveEvent(event.id)}
                      className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
