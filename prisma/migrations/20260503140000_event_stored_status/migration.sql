-- Stored manual upcoming vs archive flag (admin-controlled).
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'UPCOMING';

ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_status_check";
ALTER TABLE "Event" ADD CONSTRAINT "Event_status_check" CHECK ("status" IN ('UPCOMING', 'PAST'));
