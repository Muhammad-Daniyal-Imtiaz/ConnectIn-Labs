const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS freelance_submissions_unique_idx ON freelance_submissions(project_id, applicant_user_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS freelance_submissions_project_idx ON freelance_submissions(project_id);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS freelance_submissions_applicant_idx ON freelance_submissions(applicant_user_id);`);
    console.log("Created indexes manually.");
  } catch (err) {
    console.error(err);
  }
}
run();
