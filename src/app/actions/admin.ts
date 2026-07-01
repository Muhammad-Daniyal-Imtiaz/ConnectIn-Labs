"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { db } from "@/db";
import { users, profiles, posts, jobPostings, companyPages, challenges, mvps, freelanceProjects, jobApplications, challengeTeams, challengeSubmissions, postLikes, connections, follows } from "@/db/schema";
import { eq, desc, count, lt, sql } from "drizzle-orm";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email || !isAdminEmail(email)) {
    throw new Error("Unauthorized: not an admin");
  }
  return email;
}

export async function getAdminStats() {
  try {
    await assertAdmin();
    const [userCount] = await db.select({ value: count() }).from(users);
    const [postCount] = await db.select({ value: count() }).from(posts);
    const [jobCount] = await db.select({ value: count() }).from(jobPostings);
    const [companyCount] = await db.select({ value: count() }).from(companyPages);
    const [challengeCount] = await db.select({ value: count() }).from(challenges);
    const [mvpCount] = await db.select({ value: count() }).from(mvps);
    const [freelanceCount] = await db.select({ value: count() }).from(freelanceProjects);
    const [connectionCount] = await db.select({ value: count() }).from(connections);
    const [followCount] = await db.select({ value: count() }).from(follows);
    const [appCount] = await db.select({ value: count() }).from(jobApplications);
    return {
      success: true,
      stats: {
        users: userCount?.value || 0,
        posts: postCount?.value || 0,
        jobs: jobCount?.value || 0,
        companies: companyCount?.value || 0,
        challenges: challengeCount?.value || 0,
        mvps: mvpCount?.value || 0,
        freelance: freelanceCount?.value || 0,
        connections: connectionCount?.value || 0,
        follows: followCount?.value || 0,
        applications: appCount?.value || 0,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminUsers(limit = 20, cursor?: string) {
  try {
    await assertAdmin();
    const whereClause = cursor ? lt(users.createdAt, cursor) : undefined;
    const list = await db.select().from(users).where(whereClause).orderBy(desc(users.createdAt)).limit(limit + 1);
    const hasMore = list.length > limit;
    const items = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].createdAt : null;

    const enriched = await Promise.all(items.map(async (u) => {
      const [profileRow] = await db.select().from(profiles).where(eq(profiles.userId, u.id)).limit(1);
      const [pCount] = await db.select({ value: count() }).from(posts).where(eq(posts.userId, u.id));
      const [connCount] = await db.select({ value: count() }).from(connections).where(sql`(sender_id = ${u.id} OR receiver_id = ${u.id}) AND status = 'accepted'`);
      return { ...u, profile: profileRow || null, postCount: pCount?.value || 0, connectionCount: connCount?.value || 0 };
    }));

    return { success: true, users: enriched, nextCursor, hasMore };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminPosts(limit = 20, cursor?: string) {
  try {
    await assertAdmin();
    const whereClause = cursor ? lt(posts.createdAt, cursor) : undefined;
    const list = await db.select({
      post: posts,
      user: users,
    }).from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1);

    const hasMore = list.length > limit;
    const rows = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore && rows.length > 0 ? rows[rows.length - 1].post.createdAt : null;

    const enriched = await Promise.all(rows.map(async ({ post, user }) => {
      const [likeCount] = await db.select({ value: count() }).from(postLikes).where(eq(postLikes.postId, post.id));
      return {
        ...post,
        likeCount: likeCount?.value || 0,
        author: user ? { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null,
      };
    }));

    return { success: true, posts: enriched, nextCursor, hasMore };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminJobs(limit = 20, cursor?: string) {
  try {
    await assertAdmin();
    const whereClause = cursor ? lt(jobPostings.createdAt, cursor) : undefined;
    const list = await db.select({
      job: jobPostings,
      poster: users,
    }).from(jobPostings)
      .leftJoin(users, eq(jobPostings.postedByUserId, users.id))
      .where(whereClause)
      .orderBy(desc(jobPostings.createdAt))
      .limit(limit + 1);

    const hasMore = list.length > limit;
    const rows = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore && rows.length > 0 ? rows[rows.length - 1].job.createdAt : null;

    const enriched = rows.map(({ job, poster }) => ({
      ...job,
      poster: poster ? { id: poster.id, name: poster.name, email: poster.email, avatarUrl: poster.avatarUrl } : null,
    }));

    return { success: true, jobs: enriched, nextCursor, hasMore };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminCompanies(limit = 20, cursor?: string) {
  try {
    await assertAdmin();
    const whereClause = cursor ? lt(companyPages.createdAt, cursor) : undefined;
    const list = await db.select({
      company: companyPages,
      owner: users,
    }).from(companyPages)
      .leftJoin(users, eq(companyPages.ownerId, users.id))
      .where(whereClause)
      .orderBy(desc(companyPages.createdAt))
      .limit(limit + 1);

    const hasMore = list.length > limit;
    const rows = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore && rows.length > 0 ? rows[rows.length - 1].company.createdAt : null;

    const enriched = rows.map(({ company, owner }) => ({
      ...company,
      owner: owner ? { id: owner.id, name: owner.name, email: owner.email, avatarUrl: owner.avatarUrl } : null,
    }));

    return { success: true, companies: enriched, nextCursor, hasMore };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminChallenges(limit = 20, cursor?: string) {
  try {
    await assertAdmin();
    const whereClause = cursor ? lt(challenges.createdAt, cursor) : undefined;
    const list = await db.select({
      challenge: challenges,
      creator: users,
    }).from(challenges)
      .leftJoin(users, eq(challenges.postedByUserId, users.id))
      .where(whereClause)
      .orderBy(desc(challenges.createdAt))
      .limit(limit + 1);

    const hasMore = list.length > limit;
    const rows = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore && rows.length > 0 ? rows[rows.length - 1].challenge.createdAt : null;

    const enriched = await Promise.all(rows.map(async ({ challenge, creator }) => {
      const [teamCount] = await db.select({ value: count() }).from(challengeTeams).where(eq(challengeTeams.challengeId, challenge.id));
      const [subCount] = await db.select({ value: count() }).from(challengeSubmissions).where(eq(challengeSubmissions.challengeId, challenge.id));
      return {
        ...challenge,
        teamCount: teamCount?.value || 0,
        submissionCount: subCount?.value || 0,
        creator: creator ? { id: creator.id, name: creator.name, email: creator.email, avatarUrl: creator.avatarUrl } : null,
      };
    }));

    return { success: true, challenges: enriched, nextCursor, hasMore };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePostAsAdmin(postId: string) {
  try {
    await assertAdmin();
    await db.delete(postLikes).where(eq(postLikes.postId, postId));
    await db.delete(posts).where(eq(posts.id, postId));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteJobAsAdmin(jobId: string) {
  try {
    await assertAdmin();
    await db.delete(jobApplications).where(eq(jobApplications.jobId, jobId));
    await db.delete(jobPostings).where(eq(jobPostings.id, jobId));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCompanyAsAdmin(companyId: string) {
  try {
    await assertAdmin();
    const jobs = await db.select({ id: jobPostings.id }).from(jobPostings).where(eq(jobPostings.companyPageId, companyId));
    for (const j of jobs) {
      await db.delete(jobApplications).where(eq(jobApplications.jobId, j.id));
    }
    await db.delete(jobPostings).where(eq(jobPostings.companyPageId, companyId));
    await db.delete(companyPages).where(eq(companyPages.id, companyId));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteChallengeAsAdmin(challengeId: string) {
  try {
    await assertAdmin();
    const teams = await db.select({ id: challengeTeams.id }).from(challengeTeams).where(eq(challengeTeams.challengeId, challengeId));
    for (const t of teams) {
      await db.delete(challengeSubmissions).where(eq(challengeSubmissions.teamId, t.id));
    }
    await db.delete(challengeTeams).where(eq(challengeTeams.challengeId, challengeId));
    await db.delete(challenges).where(eq(challenges.id, challengeId));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
