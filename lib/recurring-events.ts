// Utility functions for calculating recurring events on-the-fly

export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface BaseEvent {
  id: number
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  venueId: number
  capacity: number
  memo: string
  isApproved: boolean
  priority: string
  category: string
  department: string | null
  createdById: number
  isRecurring: boolean
  recurrenceType: RecurrenceType | null
  recurrenceEnd: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface RecurringEventInstance extends BaseEvent {
  instanceDate: Date
  isRecurringInstance: boolean
  parentEventId: number
}

/**
 * Calculate all recurring instances of an event within a date range
 */
export function calculateRecurringInstances(
  baseEvent: BaseEvent,
  startDate: Date,
  endDate: Date
): RecurringEventInstance[] {
  if (!baseEvent.isRecurring || !baseEvent.recurrenceType) {
    return []
  }

  const instances: RecurringEventInstance[] = []
  let currentDate = new Date(baseEvent.date)
  
  // Find the first occurrence within or after the start date
  while (currentDate < startDate) {
    currentDate = getNextOccurrence(currentDate, baseEvent.recurrenceType)
  }

  // Generate instances within the date range
  while (currentDate <= endDate) {
    // Check if we've exceeded the recurrence end date
    if (baseEvent.recurrenceEnd && currentDate > baseEvent.recurrenceEnd) {
      break
    }

    // Skip the original event date (it's already in the database)
    if (currentDate.getTime() !== baseEvent.date.getTime()) {
      instances.push({
        ...baseEvent,
        instanceDate: new Date(currentDate),
        isRecurringInstance: true,
        parentEventId: baseEvent.id,
      })
    }

    currentDate = getNextOccurrence(currentDate, baseEvent.recurrenceType)
  }

  return instances
}

/**
 * Get the next occurrence date based on recurrence type
 */
function getNextOccurrence(date: Date, recurrenceType: RecurrenceType): Date {
  const nextDate = new Date(date)

  switch (recurrenceType) {
    case 'DAILY':
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case 'WEEKLY':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'MONTHLY':
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
  }

  return nextDate
}

/**
 * Check if a specific date is a recurring instance of an event
 */
export function isRecurringInstanceDate(
  baseEvent: BaseEvent,
  targetDate: Date
): boolean {
  if (!baseEvent.isRecurring || !baseEvent.recurrenceType) {
    return false
  }

  // Check if target date is before the base event date
  if (targetDate < baseEvent.date) {
    return false
  }

  // Check if target date is after the recurrence end date
  if (baseEvent.recurrenceEnd && targetDate > baseEvent.recurrenceEnd) {
    return false
  }

  // Calculate if the target date matches the recurrence pattern
  const timeDiff = targetDate.getTime() - baseEvent.date.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  switch (baseEvent.recurrenceType) {
    case 'DAILY':
      return daysDiff > 0 && daysDiff % 1 === 0
    case 'WEEKLY':
      return daysDiff > 0 && daysDiff % 7 === 0
    case 'MONTHLY':
      // For monthly recurrence, check if it's the same day of the month
      const baseDay = baseEvent.date.getDate()
      const targetDay = targetDate.getDate()
      return daysDiff > 0 && baseDay === targetDay
  }

  return false
}

/**
 * Generate a virtual event instance for a specific recurring date
 */
export function generateVirtualInstance(
  baseEvent: BaseEvent,
  instanceDate: Date
): RecurringEventInstance | null {
  if (!isRecurringInstanceDate(baseEvent, instanceDate)) {
    return null
  }

  return {
    ...baseEvent,
    instanceDate,
    isRecurringInstance: true,
    parentEventId: baseEvent.id,
  }
}

/**
 * Get the recurrence description for display
 */
export function getRecurrenceDescription(
  recurrenceType: RecurrenceType | null,
  recurrenceEnd: Date | null
): string {
  if (!recurrenceType) return ''

  let description = ''
  switch (recurrenceType) {
    case 'DAILY':
      description = 'Repeats daily'
      break
    case 'WEEKLY':
      description = 'Repeats weekly'
      break
    case 'MONTHLY':
      description = 'Repeats monthly'
      break
  }

  if (recurrenceEnd) {
    description += ` until ${recurrenceEnd.toLocaleDateString()}`
  }

  return description
}
