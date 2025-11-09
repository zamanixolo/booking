import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Create a new user
export const createUser = async (data: {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "CLIENT" | "TRAINER" | "ADMIN";
  imageurl?: string;
}) => {
  const formattedData = {
    ...data,
    role: data.role ? (data.role as any) : "CLIENT", // ✅ normalize role
  };

  return prisma.user.create({
    data: formattedData,
  });
};

// Get all users
export const getUsers = async () => {
  return prisma.user.findMany({
    include: { provider: true },
  });
};

// Get user by Clerk ID
export const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
    include: { provider: true },
  });
};

// Get user by internal UUID
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { provider: true },
  });
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  });
};

// Update user by internal ID
export const updateUser = async (id: string, data: {
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: "CLIENT" | "TRAINER" | "ADMIN";
  imageurl?: string;
}) => {
  const formattedData = {
    ...data,
    ...(data.role && { role: data.role as any }),
  };

  return prisma.user.update({
    where: { id },
    data: formattedData,
  });
};

// Update user by Clerk ID
export const updateUserByClerkId = async (clerkId: string, data: {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: "CLIENT" | "TRAINER" | "ADMIN";
  imageurl?: string;
}) => {
  const formattedData = {
    ...data,
    ...(data.role && { role: data.role as any }),
  };

  return prisma.user.update({
    where: { clerkId },
    data: formattedData,
  });
};