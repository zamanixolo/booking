import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE - Create a new booking
export const createBooking = async (data: {
  clientId?: string;
  providerId: string;
  serviceId: string;
  price: number;
  sessionDuration: number;
  date: Date;
  time: string;
  specialRequests?: string;
}) => {
  return await prisma.booking.create({
    data: {
      ...data,
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
export const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      client: true,
      provider: true,
      services: true,
    },
    orderBy: { date: 'desc' },
  });
};

// READ - Get bookings by client
export const getBookingsByClient = async (clientId: string) => {
  return await prisma.booking.findMany({
    where: { clientId },
    include: {
      client: true,
      provider: true,
      services: true,
    },
    orderBy: { date: 'desc' },
  });
};
// READ - Get single booking by ID
export const getBookingById = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      client: true,
      provider: true,
      services: true,
    },
  });
};

// READ - Get bookings by provider
export const getBookingsByProvider = async (providerId: string) => {
  return await prisma.booking.findMany({
    where: { providerId },
    include: {
      client: true,
      provider: true,
      services: true,
    },
    orderBy: { date: 'desc' },
  });
};

// UPDATE - Update booking
export const updateBooking = async (id: string, data: {
  status?: BookingStatus;
  price?: number;
  sessionDuration?: number;
  date?: Date;
  time?: string;
  specialRequests?: string;
}) => {
  return await prisma.booking.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
    include: {
      client: true,
      provider: true,
      services: true,
    },
  });
};

// DELETE - Delete booking
export const deleteBooking = async (id: string) => {
  return await prisma.booking.delete({
    where: { id },
  });
};