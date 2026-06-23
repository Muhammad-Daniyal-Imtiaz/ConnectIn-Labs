export const CACHE_TAGS = {
  POSTS: "posts",
  POST_LIKES: "post_likes",
  JOBS: "jobs",
  JOB_APPLICATIONS: "job_applications",
  COMPANIES: "companies",
  CHALLENGES: "challenges",
  CHALLENGE_TEAMS: "challenge_teams",
  CHALLENGE_SUBMISSIONS: "challenge_submissions",
  MVPS: "mvps",
  FREELANCE: "freelance",
  FREELANCE_SUBMISSIONS: "freelance_submissions",
  USERS: "users",
  PROFILES: "profiles",
  CONNECTIONS: "connections",
  FOLLOWS: "follows",
} as const;

export const TTL = {
  SHORT: 30_000,
  MEDIUM: 60_000,
  LONG: 300_000,
} as const;
