-- AlterTable
ALTER TABLE "ArticlePost" ALTER COLUMN "publication" SET DEFAULT E'General';

-- AlterIndex
ALTER INDEX "ArticlePost_articleDraftId_unique" RENAME TO "ArticlePost.articleDraftId_unique";
