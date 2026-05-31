"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserStatus() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { isAuthenticated: false, hasRole: false };
    }

    // Check if user exists in Turso DB
    const existingUsers = await db.select().from(users).where(eq(users.id, clerkUser.id)).limit(1);
    
    if (existingUsers.length > 0) {
      return { 
        isAuthenticated: true, 
        hasRole: true, 
        user: existingUsers[0] 
      };
    }

    return { 
      isAuthenticated: true, 
      hasRole: false, 
      clerkEmail: clerkUser.emailAddresses[0]?.emailAddress || "",
      clerkName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
      clerkAvatar: clerkUser.imageUrl || ""
    };
  } catch (error) {
    console.error("Error checking user status:", error);
    return { isAuthenticated: false, hasRole: false };
  }
}

export async function saveUserOnboarding(role: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    // Double check if already onboarded
    const existingUsers = await db.select().from(users).where(eq(users.id, clerkUser.id)).limit(1);
    if (existingUsers.length > 0) {
      return existingUsers[0];
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
    const avatarUrl = clerkUser.imageUrl || "";

    const newUser = {
      id: clerkUser.id,
      email,
      name,
      role,
      avatarUrl,
    };

    await db.insert(users).values(newUser);
    return newUser;
  } catch (error) {
    console.error("Error during onboarding:", error);
    throw new Error("Failed to save user onboarding record.");
  }
}

export async function updateUserRole(role: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    await db.update(users).set({ role }).where(eq(users.id, clerkUser.id));
    return { success: true, role };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role.");
  }
}
