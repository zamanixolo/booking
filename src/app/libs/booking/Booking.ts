// src/app/libs/booking/Booking.ts

import { Booking, BookingStatus, Prisma } from '@prisma/client';
// Import the shared D1 type definition
import { D1PrismaClient } from '../prisma'; // Adjust the import path as necessary


// 🛑 OLD: const prisma = new PrismaClient(); // This line must be removed


// Define common data types for clarity
// Use the exact Prisma input type that expects flat IDs (clientId, providerId, etc.)
export type BookingCreateInput = Prisma.BookingCreateInput;

export type BookingUpdateInput = {
  status?: BookingStatus;
  price?: number;
  sessionDuration?: number;
  date?: Date;
  time?: string;
  specialRequests?: string;
};


// --- Booking Management Functions ---
// All functions now accept a 'prisma' instance as the first argument


// CREATE - Create a new booking
/**
 * Creates a new booking record.
 * @param prisma The D1-compatible Prisma client instance.
 * @param data Booking creation data.
 */
export const createBooking = async (
  prisma: D1PrismaClient,
  data: BookingCreateInput
): Promise<Booking> => {
  
  // The 'data' object now conforms perfectly to what 'prisma.booking.create' expects
  return await prisma.booking.create({
    data: {
      ...data,
      // Ensure date is a Date object if it came in as a string
      date: new Date(data.date), 
    },
    include: {
      client: true,
      provider: true,
      services: true,
    },
  });
};

// READ - Get all bookings
/**
 * Gets all bookings in the system.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getAllBookings = async (prisma: D1PrismaClient): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    include: { client: true, provider: true, services: true, },
    orderBy: { date: 'desc' },
  });
};

// READ - Get bookings by client
/**
 * Gets bookings associated with a specific client ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param clientId The client's internal database UUID.
 */
export const getBookingsByClient = async (
  prisma: D1PrismaClient,
  clientId: string
): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: { clientId },
    include: { client: true, provider: true, services: true, },
    orderBy: { date: 'desc' },
  });
};

// READ - Get single booking by ID
/**
 * Gets a single booking by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The booking's internal database UUID.
 */
export const getBookingById = async (
  prisma: D1PrismaClient,
  id: string
): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: { id },
    include: { client: true, provider: true, services: true, },
  });
};

// READ - Get bookings by provider
/**
 * Gets bookings associated with a specific provider ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param providerId The provider's internal database UUID.
 */
export const getBookingsByProvider = async (
  prisma: D1PrismaClient,
  providerId: string
): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    where: { providerId },
    include: { client: true, provider: true, services: true, },
    orderBy: { date: 'desc' },
  });
};

// UPDATE - Update booking
/**
 * Updates a single booking record by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The booking's internal database UUID.
 * @param data Data to update.
 */
export const updateBooking = async (
  prisma: D1PrismaClient,
  id: string,
  data: BookingUpdateInput
): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }), 
    } as Prisma.BookingUpdateInput,
    include: { client: true, provider: true, services: true, },
  });
};

// DELETE - Delete booking
/**
 * Deletes a single booking record by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The booking's internal database UUID.
 */
export const deleteBooking = async (
  prisma: D1PrismaClient,
  id: string
): Promise<Booking> => {
  return await prisma.booking.delete({
    where: { id },
  });
};
