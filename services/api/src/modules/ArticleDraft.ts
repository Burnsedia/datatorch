import { booleanArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'
import { ArticleDraft} from 'nexus-prisma'

export const articleDraft = objectType({
    name: ArticleDraft.$name,
    description: ArticleDraft.$description,
    definition(t) {
        t.field(ArticleDraft.id)
        t.nonNull.field('author', {
            type: 'ProjectOwner',
            resolve: (parent, _, ctx) => {
                return ctx.db.projectOwner.findUnique({
                    where: { id: parent.authorId || undefined },
                })
            }
        })
        t.field('project',{
            type: 'Project',
            resolve: (parent, _, ctx) => {
                return ctx.db.project.findUnique({
                    where: { id: parent.projectId || undefined} ,
                })
            }
        })
        t.field(ArticleDraft.replacedByArticleDraftId)
        t.field(ArticleDraft.isPublished)
        t.field(ArticleDraft.createdAt)
        t.field(ArticleDraft.lastSaved)
        t.field(ArticleDraft.publishedAt)
        t.field(ArticleDraft.title)
        t.field(ArticleDraft.content)
        t.field('articleDraft', {
            type: 'ArticlePost',
            resolve: (parent,_,ctx) => {
                return ctx.db.articlePost.findUnique({
                    where: { id: parent.articlePostId || undefined }
                })
            }
        })
    }
})

// For debugging only delete this eventually
export const getAllArticleDrafts = queryField('getAllArticleDrafts',{
    type: list(ArticleDraft.$name),
    resolve(parent, args, ctx) {
        return ctx.db.articleDraft.findMany()
    }
})

// Get all article drafts by a particular project owner
export const getArticleDraftsByProjectOwner = queryField('getArticleDrafts',{
    type: list(ArticleDraft.$name),
    args: {
        projectOwnerId: nonNull(stringArg())
    },
    resolve(parent, args, ctx) {
        return ctx.db.articleDraft.findMany({
            where: { authorId: args.projectOwnerId }
        })
    }
})

// Get all article drafts by a particular draft id
export const getArticleDraftById = queryField('getArticleDraft',{
    type: ArticleDraft.$name,
    args: {
        articleDraftId: nonNull(stringArg())
    },
    resolve(parent, args, ctx) {
        return ctx.db.articleDraft.findUnique({
            where: { id: args.articleDraftId }
        })
    }
})

// Get last article draft made by a particular project owner
export const getLastDraftByProjectOwner = queryField('getLastArticleDraft',{
    type: ArticleDraft.$name,
    args: {
        projectOwnerId: nonNull(stringArg())
    },
    resolve(parent, args, ctx) {
        return ctx.db.articleDraft.findFirst({
            where: { authorId: args.projectOwnerId },
            orderBy: { createdAt: "desc"}
        })
    }
})

// Create draft
export const createArticleDraft = mutationField('createArticleDraft',{
    type: ArticleDraft.$name,
    args: {
        authorId: nonNull(stringArg()),
        title: stringArg(),
        content: stringArg(),
        isPublished: booleanArg()
    },
    resolve(parent,args,ctx) {
        return ctx.db.articleDraft.create({
            data: {
                title: args.title,
                content: args.content,
                author: {
                    connect: {
                        id: args.authorId
                    }
                },
                isPublished: args.isPublished
            }
        })
    }
})

// Delete draft
export const deleteArticleDraft = mutationField('deleteArticleDraft',{
    type: ArticleDraft.$name,
    args: {
        articleDraftId: nonNull(stringArg())
    },
    resolve(parent,args,ctx) {
        return ctx.db.articleDraft.delete({
            where: { id: args.articleDraftId }
        })
    }
})