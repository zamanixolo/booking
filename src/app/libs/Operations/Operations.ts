import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 CREATE
export async function createOrUpdateOperatingHour(data: {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive?: boolean
}) {
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
export async function getAllOperatingHours() {
  return await prisma.operatingHours.findMany({
    orderBy: { dayOfWeek: 'asc' },
  })
}

// 🟢 READ - single
export async function getOperatingHourById(id: string) {
  return await prisma.operatingHours.findUnique({
    where: { id },
  })
}

// 🟠 UPDATE
export async function updateOperatingHour(
  id: string,
  data: {
    dayOfWeek?: number
    startTime?: string
    endTime?: string
    isActive?: boolean
  }
) {
  return await prisma.operatingHours.update({
    where: { id },
    data,
  })
}

// 🔴 DELETE
export async function deleteOperatingHour(id: string) {
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