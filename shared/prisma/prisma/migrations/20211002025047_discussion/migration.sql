-- CreateEnum
CREATE TYPE "ArticlePostType" AS ENUM ('DISCUSSION', 'QUESTION', 'CLASSIFIED');

-- CreateEnum
CREATE TYPE "UserArticleInteractionType" AS ENUM ('VIEW', 'UPVOTE', 'DOWNVOTE', 'RESPONSE');

-- CreateTable
CREATE TABLE "ArticleDraft" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "projectId" TEXT,
    "replacedByArticleDraftId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "title" TEXT,
    "content" TEXT,
    "articlePostId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticlePost" (
    "id" TEXT NOT NULL,
    "articleDraftId" TEXT NOT NULL,
    "publication" TEXT NOT NULL DEFAULT E'Default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postType" "ArticlePostType" NOT NULL,
    "parentId" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isTop" BOOLEAN,
    "isVerified" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserArticleInteraction" (
    "id" TEXT NOT NULL,
    "projectOwnerId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "interactionTime" TIMESTAMP(3) NOT NULL,
    "interactionType" "UserArticleInteractionType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticlePost_articleDraftId_unique" ON "ArticlePost"("articleDraftId");

-- AddForeignKey
ALTER TABLE "ArticleDraft" ADD FOREIGN KEY ("authorId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleDraft" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlePost" ADD FOREIGN KEY ("articleDraftId") REFERENCES "ArticleDraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlePost" ADD FOREIGN KEY ("parentId") REFERENCES "ArticlePost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArticleInteraction" ADD FOREIGN KEY ("projectOwnerId") REFERENCES "ProjectOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArticleInteraction" ADD FOREIGN KEY ("articleId") REFERENCES "ArticlePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
