import { PrismaClient, ProviderRole } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE Provider
export const createProvider = async (providerData: {
  firstName: string;
  lastName: string;
  email?: string;
  imageurl?: string;
  bio?: string;
  role?: string; // coming from frontend
  userId?: string;
  clerkId: string
}) => {
  // Convert role string to enum if valid
  let role: ProviderRole | undefined;
  if (providerData.role && Object.values(ProviderRole).includes(providerData.role as ProviderRole)) {
    role = providerData.role as ProviderRole;
  }

  return await prisma.provider.create({
    data: {
      firstName: providerData.firstName,
      lastName: providerData.lastName,
      email: providerData.email,
      imageurl: providerData.imageurl,
      bio: providerData.bio,
      role,        // ✅ enum-safe
      userId: providerData.userId,
      clerkId: providerData.clerkId
    },
    include: { user: true,  bookingSettings: true },
  });
};

// READ all providers
export const getAllProviders = async () => {
  return await prisma.provider.findMany({
    include: {
      user: true,
      
      bookingSettings: true,
    },
  });
};

// READ provider by ID
export const getProviderById = async (id: string) => {
  return await prisma.provider.findUnique({
    where: { id },
    include: {
      user: true,
    
      bookings: true,
 
      bookingSettings: true,
    },
  });
};

export const getProviderByClerkId = async (clerkId: string) => {
  return prisma.provider.findUnique({
    where: { clerkId },
    include: { 
      user: true,
    
      bookings: true,
 
      bookingSettings: true, }, // include linked user
  });
};

// READ provider by active
export const getProviderAvailable = async () => {
  return await prisma.provider.findMany({
    where: { isAvailable:true },
    include: {
      user: true,
      bookings: true,
  
      bookingSettings: true,
    }, 
    orderBy: {
      rating: 'desc', // optional: show highest rated first
    },
  });
};
// READ provider by userId (if linked)
export const getProviderByUserId = async (userId: string) => {
  return await prisma.provider.findUnique({
    where: { userId },
    include: {
      user: true,
      
      bookingSettings: true,
    },
  });
};

// UPDATE provider
export const updateProvider = async (
  id: string,
  updateData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    imageurl?: string;
    rating?: number;
    totalReviews?: number;
    role?: ProviderRole | { set: ProviderRole };   // <-- use enum type
    isAvailable?: boolean;
  }
) => {
  return await prisma.provider.update({
    where: { id },
    data: updateData,
  });
};

// DELETE provider
export const deleteProvider = async (id: string) => {
  return await prisma.provider.delete({
    where: { id },
  });
};
