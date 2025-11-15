// src/app/libs/booking-settings/BookingSettings.ts

import { BookingSettings, Prisma } from "@prisma/client";
// 🎯 Import the shared D1 type definition
import { D1PrismaClient } from '../prisma'; // Adjust the import path as necessary


// 🛑 OLD: const prisma = new PrismaClient(); // This line must be removed


// Define common data types for clarity
export type BookingSettingsCreateInput = {
  providerIds: string[];
  serviceId: string;
  defaultSessionDuration: number;
  defaultPrice: number;
};

export type BookingSettingsUpdateInput = {
  providerIds?: string[];
  serviceId?: string;
  defaultSessionDuration?: number;
  defaultPrice?: number;
};


// --- Booking Settings Management Functions ---
// All functions now accept a 'prisma' instance as the first argument

/**
 * CREATE BookingSettings with multiple providers.
 * @param prisma The D1-compatible Prisma client instance.
 * @param data Booking settings creation data.
 */
export const createBookingSettings = async (
  prisma: D1PrismaClient,
  data: BookingSettingsCreateInput
): Promise<BookingSettings> => {
  return await prisma.bookingSettings.create({
    data: {
      service: { connect: { id: data.serviceId } },
      providers: {
        connect: data.providerIds.map((id) => ({ id })),
      },
      defaultSessionDuration: data.defaultSessionDuration,
      defaultPrice: data.defaultPrice,
    },
    include: {
      service: true,
      providers: true,
    },
  });
};

/**
 * READ all BookingSettings.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getBookingSettings = async (prisma: D1PrismaClient): Promise<BookingSettings[]> => {
  return await prisma.bookingSettings.findMany({
    include: {
      service: true,
      providers: true,
    },
  });
};

/**
 * READ BookingSettings by ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The settings internal database UUID.
 */
export const getBookingSettingsById = async (
  prisma: D1PrismaClient,
  id: string
): Promise<BookingSettings | null> => {
  return await prisma.bookingSettings.findUnique({
    where: { id },
    include: {
      service: true,
      providers: true,
    },
  });
};

/**
 * UPDATE BookingSettings (including providers).
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The settings internal database UUID.
 * @param data Data to update.
 */
export const updateBookingSettings = async (
  prisma: D1PrismaClient,
  id: string,
  data: BookingSettingsUpdateInput
): Promise<BookingSettings> => {
  return await prisma.bookingSettings.update({
    where: { id },
    data: {
      ...(data.serviceId && { service: { connect: { id: data.serviceId } } }),
      ...(data.providerIds && {
        providers: {
          // Use 'set' to replace the entire list of connected providers
          set: data.providerIds.map((id) => ({ id })),
        },
      }),
      ...(data.defaultSessionDuration && {
        defaultSessionDuration: data.defaultSessionDuration,
      }),
      ...(data.defaultPrice && { defaultPrice: data.defaultPrice }),
    },
    include: {
      service: true,
      providers: true,
    },
  });
};

/**
 * DELETE BookingSettings.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The settings internal database UUID.
 */
export const deleteBookingSettings = async (
  prisma: D1PrismaClient,
  id: string
): Promise<BookingSettings> => {
  return await prisma.bookingSettings.delete({
    where: { id },
  });
};
