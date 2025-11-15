// src/app/libs/operating-hours/OperatingHours.ts

import { OperatingHours, Prisma } from "@prisma/client";
// 🎯 Import the shared D1 type definition
import { D1PrismaClient } from '../prisma'; // Adjust the import path as necessary


// 🛑 OLD: const prisma = new PrismaClient(); // This line must be removed


// Define common data types for clarity
export type OperatingHourInput = {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive?: boolean
};

export type OperatingHourUpdateInput = Partial<OperatingHourInput>;


// --- Operating Hours Management Functions ---
// All functions now accept a 'prisma' instance as the first argument


// 🟢 CREATE / UPSERT
/**
 * Creates a new operating hour or updates an existing one based on the day of the week.
 * @param prisma The D1-compatible Prisma client instance.
 * @param data Operating hour data.
 */
export async function createOrUpdateOperatingHour(
  prisma: D1PrismaClient,
  data: OperatingHourInput
): Promise<OperatingHours> {
  return await prisma.operatingHours.upsert({
    where: { dayOfWeek: data.dayOfWeek },
    update: {
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
    },
    create: {
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
    },
  })
}

// 🟡 READ - all
/**
 * Reads all operating hours, sorted by day of the week.
 * @param prisma The D1-compatible Prisma client instance.
 */
export async function getAllOperatingHours(prisma: D1PrismaClient): Promise<OperatingHours[]> {
  return await prisma.operatingHours.findMany({
    orderBy: { dayOfWeek: 'asc' },
  })
}

// 🟢 READ - single
/**
 * Reads a single operating hour by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The operating hour's internal database UUID.
 */
export async function getOperatingHourById(
  prisma: D1PrismaClient,
  id: string
): Promise<OperatingHours | null> {
  return await prisma.operatingHours.findUnique({
    where: { id },
  })
}

// 🟠 UPDATE
/**
 * Updates a single operating hour by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The operating hour's internal database UUID.
 * @param data Data to update.
 */
export async function updateOperatingHour(
  prisma: D1PrismaClient,
  id: string,
  data: OperatingHourUpdateInput
): Promise<OperatingHours> {
  return await prisma.operatingHours.update({
    where: { id },
    data,
  })
}

// 🔴 DELETE
/**
 * Deletes a single operating hour by its ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The operating hour's internal database UUID.
 */
export async function deleteOperatingHour(
  prisma: D1PrismaClient,
  id: string
): Promise<OperatingHours> {
  return await prisma.operatingHours.delete({
    where: { id },
  })
}


// // CREATE Operating Hours (with upsert to handle duplicates)
// export const createOperatingHours = async (operatingHoursData: {
//   providerId: string;
//   dayOfWeek: number;
//   startTime: string;
//   endTime: string;
// }) => {
//   return await prisma.operatingHours.upsert({
//     where: {
//       providerId_dayOfWeek: {
//         providerId: operatingHoursData.providerId,
//         dayOfWeek: operatingHoursData.dayOfWeek
//       }
//     },
//     update: {
//       startTime: operatingHoursData.startTime,
//       endTime: operatingHoursData.endTime,
//       isActive: true
//     },
//     create: operatingHoursData
//   });
// };

// // READ Operating Hours
// export const getOperatingHoursByProvider = async (providerId: string) => {
//   return await prisma.operatingHours.findMany({
//     where: { providerId, isActive: true },
//     orderBy: { dayOfWeek: 'asc' }
//   });
// };

// export const getOperatingHoursByDay = async (providerId: string, dayOfWeek: number) => {
//   return await prisma.operatingHours.findUnique({
//     where: {
//       providerId_dayOfWeek: {
//         providerId,
//         dayOfWeek
//       }
//     }
//   });
// };

// // Get all operating hours (including inactive)
// export const getAllOperatingHoursByProvider = async (providerId: string) => {
//   return await prisma.operatingHours.findMany({
//     where: { providerId },
//     orderBy: { dayOfWeek: 'asc' }
//   });
// };

// // UPDATE Operating Hours
// export const updateOperatingHours = async (id: string, updateData: {
//   startTime?: string;
//   endTime?: string;
//   isActive?: boolean;
// }) => {
//   return await prisma.operatingHours.update({
//     where: { id },
//     data: updateData
//   });
// };

// // Bulk update operating hours
// export const updateOperatingHoursBulk = async (updates: {
//   id: string;
//   startTime?: string;
//   endTime?: string;
//   isActive?: boolean;
// }[]) => {
//   const transactions = updates.map(update =>
//     prisma.operatingHours.update({
//       where: { id: update.id },
//       data: {
//         startTime: update.startTime,
//         endTime: update.endTime,
//         isActive: update.isActive
//       }
//     })
//   );

//   return await prisma.$transaction(transactions);
// };

// // DELETE Operating Hours
// export const deleteOperatingHours = async (id: string) => {
//   return await prisma.operatingHours.delete({
//     where: { id }
//   });
// };

// // Soft delete (set isActive to false)
// export const deactivateOperatingHours = async (id: string) => {
//   return await prisma.operatingHours.update({
//     where: { id },
//     data: { isActive: false }
//   });
// };