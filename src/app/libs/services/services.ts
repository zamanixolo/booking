// src/app/libs/services/Service.ts

import { Service, Prisma } from "@prisma/client";
// 🎯 Import the shared D1 type definition
import { D1PrismaClient } from '../prisma'; // Adjust the import path as necessary


// 🛑 OLD: const prisma = new PrismaClient(); // This line must be removed


// Define common data types for clarity
export type ServiceCreateInput = {
  name: string;
  description?: string | null;
  providers?: string[]; // Assuming provider IDs are passed as strings
};

export type ServiceUpdateInput = {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
  providers?: string[];
};


// --- Service Management Functions ---
// All functions now accept a 'prisma' instance as the first argument

/**
 * Create a new service.
 * @param prisma The D1-compatible Prisma client instance.
 * @param serviceData Service creation data.
 */
export const createService = async (
  prisma: D1PrismaClient,
  serviceData: ServiceCreateInput
): Promise<Service> => {
  return await prisma.service.create({
    data: {
      name: serviceData.name,
      description: serviceData.description,
      // If connecting providers during creation, logic goes here
    }
  });
};

/**
 * READ all active services.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getAllServices = async (prisma: D1PrismaClient): Promise<Service[]> => {
  return await prisma.service.findMany({
    where: { isActive: true }
  });
};

/**
 * READ service by ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The service's internal database UUID.
 */
export const getServiceById = async (
  prisma: D1PrismaClient,
  id: string
): Promise<Service | null> => {
  return await prisma.service.findUnique({
    where: { id }
  });
};

/**
 * UPDATE Service by ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The service's internal database UUID.
 * @param updateData Data to update.
 */
export const updateService = async (
  prisma: D1PrismaClient,
  id: string,
  updateData: ServiceUpdateInput
): Promise<Service> => {
  return await prisma.service.update({
    where: { id },
    data: {
      name: updateData.name,
      description: updateData.description,
      isActive: updateData.isActive,
      // Logic for updating provider links would also go here if necessary
    }
  });
};

/**
 * DELETE Service (soft delete).
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The service's internal database UUID.
 */
export const deleteService = async (
  prisma: D1PrismaClient,
  id: string
): Promise<Service> => {
  return await prisma.service.update({
    where: { id },
    data: { isActive: false }
  });
};
