-- DropForeignKey
ALTER TABLE "UserCredentials" DROP CONSTRAINT "UserCredentials_projectOwnerId_fkey";

-- AddForeignKey
ALTER TABLE "UserCredentials" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
