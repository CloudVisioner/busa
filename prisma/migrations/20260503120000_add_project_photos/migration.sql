-- Align with Prisma schema: Project.photos (String[], default empty).
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "photos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
