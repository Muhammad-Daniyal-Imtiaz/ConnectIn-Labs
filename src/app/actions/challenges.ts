"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { challenges, companyPages, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllChallenges() {
  try {
    const list = await db
      .select()
      .from(challenges)
      .orderBy(desc(challenges.createdAt));
      
    return { success: true, challenges: list };
  } catch (error: any) {
    console.error("Error fetching challenges:", error);
    return { success: false, error: "Failed to load challenges." };
  }
}

export async function createChallenge(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const email = session.user.email.toLowerCase().trim();
    const dbUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!dbUsers.length) throw new Error("User not found");
    const dbUser = dbUsers[0];

    const companyPageId = formData.get("companyPageId") as string;
    let companyName = "";
    let companyLogo = null;
    let companySlug = null;

    if (companyPageId) {
      const cPages = await db.select().from(companyPages).where(eq(companyPages.id, companyPageId)).limit(1);
      if (cPages.length && cPages[0].ownerId === dbUser.id) {
        companyName = cPages[0].name;
        companyLogo = cPages[0].logoUrl;
        companySlug = cPages[0].slug;
      } else {
        throw new Error("Invalid company page.");
      }
    } else {
      throw new Error("Challenges must be posted by a verified Company Page.");
    }

    const newChallengeId = `chal_${Math.random().toString(36).substring(2, 11)}`;
    const challengeData = {
      id: newChallengeId,
      postedByUserId: dbUser.id,
      companyPageId,
      companyName,
      companyLogo,
      companySlug,
      title: (formData.get("title") as string)?.trim() || "Untitled Challenge",
      description: (formData.get("description") as string)?.trim() || "",
      prize: (formData.get("prize") as string)?.trim() || "",
      duration: (formData.get("duration") as string)?.trim() || "",
      location: (formData.get("location") as string)?.trim() || "",
      minTeamMembers: parseInt(formData.get("minTeamMembers") as string) || 1,
      maxTeamMembers: parseInt(formData.get("maxTeamMembers") as string) || 5,
      category: (formData.get("category") as string)?.trim() || "Engineering",
      status: "Open"
    };

    await db.insert(challenges).values(challengeData);
    
    return { success: true, challenge: challengeData };
  } catch (error: any) {
    console.error("Error creating challenge:", error);
    return { success: false, error: error.message || "Failed to create challenge." };
  }
}

export async function updateChallenge(id: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");
    
    const email = session.user.email.toLowerCase().trim();
    const dbUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!dbUsers.length) throw new Error("User not found");
    const dbUser = dbUsers[0];

    // Check ownership
    const existing = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
    if (!existing.length) throw new Error("Challenge not found");
    if (existing[0].postedByUserId !== dbUser.id) throw new Error("Unauthorized to edit this challenge");

    const updateData = {
      title: (formData.get("title") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      prize: (formData.get("prize") as string)?.trim(),
      duration: (formData.get("duration") as string)?.trim(),
      location: (formData.get("location") as string)?.trim(),
      minTeamMembers: parseInt(formData.get("minTeamMembers") as string) || 1,
      maxTeamMembers: parseInt(formData.get("maxTeamMembers") as string) || 5,
      category: (formData.get("category") as string)?.trim() || "Engineering",
    };

    await db.update(challenges).set(updateData).where(eq(challenges.id, id));

    return { success: true, challenge: { ...existing[0], ...updateData } };
  } catch (error: any) {
    console.error("Error updating challenge:", error);
    return { success: false, error: error.message || "Failed to update challenge." };
  }
}

export async function deleteChallenge(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");
    
    const email = session.user.email.toLowerCase().trim();
    const dbUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!dbUsers.length) throw new Error("User not found");
    const dbUser = dbUsers[0];

    // Check ownership
    const existing = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
    if (!existing.length) throw new Error("Challenge not found");
    if (existing[0].postedByUserId !== dbUser.id) throw new Error("Unauthorized to delete this challenge");

    await db.delete(challenges).where(eq(challenges.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting challenge:", error);
    return { success: false, error: error.message || "Failed to delete challenge." };
  }
}
