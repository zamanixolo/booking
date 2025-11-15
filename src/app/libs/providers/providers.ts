// src/lib/provider/provider.ts

import { ProviderRole, Provider, Prisma } from "@prisma/client";
// 🎯 Import the shared D1 type definition from the central prisma.ts file (UP two levels)
import { D1PrismaClient } from '../prisma';


// Define common data types for clarity
export type ProviderCreateInput = {
  firstName: string;
  lastName: string;
  email?: string | null;
  imageurl?: string | null;
  bio?: string | null;
  role?: string; // Coming from frontend
  userId?: string | null;
  clerkId: string;
};

export type ProviderUpdateInput = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageurl?: string;
  rating?: number;
  totalReviews?: number;
  role?: ProviderRole;
  isAvailable?: boolean;
};


// --- Provider Management Functions ---
// All functions now accept a 'prisma' instance as the first argument

/**
 * Create a new provider.
 * @param prisma The D1-compatible Prisma client instance.
 * @param providerData Provider creation data.
 */
export const createProvider = async (
  prisma: D1PrismaClient,
  providerData: ProviderCreateInput
): Promise<Provider> => {
  let role: ProviderRole | undefined;
  if (providerData.role && Object.values(ProviderRole).includes(providerData.role as ProviderRole)) {
    role = providerData.role as ProviderRole;
  }

  return await prisma.provider.create({
    data: { ...providerData, role } as Prisma.ProviderCreateInput,
    include: { user: true, bookingSettings: true },
  });
};

/**
 * READ all providers.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getAllProviders = async (prisma: D1PrismaClient): Promise<Provider[]> => {
  return await prisma.provider.findMany({
    include: { user: true, bookingSettings: true },
  });
};

/**
 * READ provider by ID.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getProviderById = async (
  prisma: D1PrismaClient,
  id: string
): Promise<Provider | null> => {
  return await prisma.provider.findUnique({
    where: { id },
    include: { user: true, bookings: true, bookingSettings: true },
  });
};

export const getProviderByClerkId = async (
  prisma: D1PrismaClient,
  clerkId: string
): Promise<Provider | null> => {
  return prisma.provider.findUnique({
    where: { clerkId },
    include: { user: true, bookings: true, bookingSettings: true },
  });
};

export const getProviderAvailable = async (prisma: D1PrismaClient): Promise<Provider[]> => {
  return await prisma.provider.findMany({
    where: { isAvailable:true },
    include: { user: true, bookings: true, bookingSettings: true }, 
    orderBy: { rating: 'desc' },
  });
};

export const getProviderByUserId = async (
  prisma: D1PrismaClient,
  userId: string
): Promise<Provider | null> => {
  return await prisma.provider.findUnique({
    where: { userId },
    include: { user: true, bookingSettings: true },
  });
};

/**
 * UPDATE provider by ID.
 */
export const updateProvider = async (
  prisma: D1PrismaClient,
  id: string,
  updateData: ProviderUpdateInput
): Promise<Provider> => {
  return await prisma.provider.update({
    where: { id },
    data: updateData as Prisma.ProviderUpdateInput,
  });
};

/**
 * DELETE provider by ID.
 */
export const deleteProvider = async (prisma: D1PrismaClient, id: string): Promise<Provider> => {
  return await prisma.provider.delete({
    where: { id },
  });
};
