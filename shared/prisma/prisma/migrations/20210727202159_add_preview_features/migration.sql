-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_projectOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_projectOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectRole" DROP CONSTRAINT "ProjectRole_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserCredentials" DROP CONSTRAINT "UserCredentials_projectOwnerId_fkey";

-- AddForeignKey
ALTER TABLE "UserCredentials" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
