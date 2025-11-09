import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// CREATE BookingSettings with multiple providers
export const createBookingSettings = async (data: {
  providerIds: string[];
  serviceId: string;
  defaultSessionDuration: number;
  defaultPrice: number;
}) => {
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

// READ all BookingSettings
export const getBookingSettings = async () => {
  return await prisma.bookingSettings.findMany({
    include: {
      service: true,
      providers: true,
    },
  });
};

// READ BookingSettings by ID
export const getBookingSettingsById = async (id: string) => {
  return await prisma.bookingSettings.findUnique({
    where: { id },
    include: {
      service: true,
      providers: true,
    },
  });
};

// UPDATE BookingSettings (including providers)
export const updateBookingSettings = async (
  id: string,
  data: {
    providerIds?: string[];
    serviceId?: string;
    defaultSessionDuration?: number;
    defaultPrice?: number;
  }
) => {
  return await prisma.bookingSettings.update({
    where: { id },
    data: {
      ...(data.serviceId && { service: { connect: { id: data.serviceId } } }),
      ...(data.providerIds && {
        providers: {
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

// DELETE BookingSettings
export const deleteBookingSettings = async (id: string) => {
  return await prisma.bookingSettings.delete({
    where: { id },
  });
};
