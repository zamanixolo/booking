// src/lib/user/user.ts

import { User, Prisma } from '@prisma/client';
// 🎯 Import the shared D1 type definition from the central prisma.ts file
import { D1PrismaClient } from '../prisma'; 

// Define common data types for clarity
export type UserCreateInput = {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role?: "CLIENT" | "TRAINER" | "ADMIN";
  imageurl?: string | null;
};

export type UserUpdateInput = Partial<Omit<UserCreateInput, 'clerkId'>>;

// --- User Management Functions ---
// All functions now accept a 'prisma' instance as the first argument

/**
 * Create a new user.
 * @param prisma The D1-compatible Prisma client instance.
 * @param data User creation data.
 */
export const createUser = async (
  prisma: D1PrismaClient,
  data: UserCreateInput
): Promise<User> => {
  // Normalize the role field, defaulting to CLIENT if not provided
  const formattedData = {
    ...data,
    role: data.role || "CLIENT",
  };

  return prisma.user.create({
    data: formattedData as Prisma.UserCreateInput,
  });
};

/**
 * Get all users.
 * @param prisma The D1-compatible Prisma client instance.
 */
export const getUsers = async (prisma: D1PrismaClient): Promise<User[]> => {
  return prisma.user.findMany({
    include: { provider: true },
  });
};

/**
 * Get user by Clerk ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param clerkId The user's Clerk ID.
 */
export const getUserByClerkId = async (
  prisma: D1PrismaClient,
  clerkId: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { clerkId },
    include: { provider: true },
  });
};

/**
 * Get user by internal UUID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The user's internal database UUID.
 */
export const getUserById = async (
  prisma: D1PrismaClient,
  id: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: { provider: true },
  });
};

/**
 * Get user by email address.
 * @param prisma The D1-compatible Prisma client instance.
 * @param email The user's email address.
 */
export const getUserByEmail = async (
  prisma: D1PrismaClient,
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  });
};

/**
 * Update user by internal ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param id The user's internal database UUID.
 * @param data User update data.
 */
export const updateUser = async (
  prisma: D1PrismaClient,
  id: string,
  data: UserUpdateInput
): Promise<User> => {
  const formattedData = {
    ...data,
    ...(data.role && { role: data.role as any }),
  };

  return prisma.user.update({
    where: { id },
    data: formattedData as Prisma.UserUpdateInput,
  });
};

/**
 * Update user by Clerk ID.
 * @param prisma The D1-compatible Prisma client instance.
 * @param clerkId The user's Clerk ID.
 * @param data User update data.
 */
export const updateUserByClerkId = async (
  prisma: D1PrismaClient,
  clerkId: string,
  data: UserUpdateInput
): Promise<User> => {
  const formattedData = {
    ...data,
    ...(data.role && { role: data.role as any }),
  };

  return prisma.user.update({
    where: { clerkId },
    data: formattedData as Prisma.UserUpdateInput,
  });
};
