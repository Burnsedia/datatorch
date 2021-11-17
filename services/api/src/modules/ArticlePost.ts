import { arg, enumType, list, nonNull, objectType, queryField, stringArg, mutationField } from 'nexus'
import { ArticlePost, ArticlePostType, UserArticleInteraction} from 'nexus-prisma'

export const postType = enumType(ArticlePostType)

export const articlePost = objectType({
  name: ArticlePost.$name,
  description: ArticlePost.$description,
  definition(t) {
    t.field(ArticlePost.id)
    t.nonNull.field('articleDraft', {
      type: 'ArticleDraft',
      resolve: (parent,_,ctx) => {
        return ctx.db.articleDraft.findUnique({
          where: { id: parent.articleDraftId }
        })
      }
    })
    t.field(ArticlePost.publication)
    t.field(ArticlePost.createdAt)
    t.field(ArticlePost.lastActivity)
    t.field('postType', {type: postType})
    t.field('childOf', {
      type: 'ArticlePost',
      resolve: (parent,_,ctx) => {
        return ctx.db.articlePost.findUnique({
          where: { id: parent.parentId || undefined }
        })
      }
    })
    t.list.field('children', {
      type: 'ArticlePost',
      resolve: (parent,_,ctx) => {
        return ctx.db.articlePost.findMany({
          where: { parentId: parent.id}
        })
      }
    })
    t.field(ArticlePost.upvotes)
    t.field(ArticlePost.downvotes)
    t.field(ArticlePost.views)
    t.field(ArticlePost.isTop)
    t.field(ArticlePost.isVerified)
    t.list.field('userArticleInteractions', {
      type: 'UserArticleInteraction',
      resolve: (parent,_,ctx) => {
        return ctx.db.userArticleInteraction.findMany({
          where: { articleId: parent.id }
        })
      }
    })
  }
})

// For debugging only delete this eventually
export const getAllArticlePosts = queryField('getAllArticlePosts', {
  type: list(ArticlePost.$name),
  resolve(parent, args, ctx) {
    return ctx.db.articlePost.findMany()
  }
})

// Get all posts for a particular publication
export const getArticlePostsByPublication = queryField('getArticlePostsByPublication', {
  type: list(ArticlePost.$name),
  args: {
    publicationName: nonNull(stringArg()),
    postType: arg({type:postType})
  },
  resolve(parent,args,ctx) {
    return ctx.db.articlePost.findMany({
      where: { 
        publication: args.publicationName, 
        postType: args.postType
      }
    })
  }
})

// Get all comments for a particular publication
export const getChildrenArticlePostsForPostId = queryField('getChildrenArticlePostsForPostId', {
  type: list(ArticlePost.$name),
  args: {
    postId: nonNull(stringArg()),
    postType: arg({type:postType})
  },
  resolve(parent,args,ctx) {
    return ctx.db.articlePost.findMany({
      where: { 
        parentId: args.postId,
        postType: args.postType
      }
    })
  }
})

// Get article post by ID
export const getArticlePostById = queryField('getArticlePostById', {
  type: (ArticlePost.$name),
  args: {
    articlePostId: nonNull(stringArg())
  },
  resolve(parent,args,ctx) {
    return ctx.db.articlePost.findUnique({
      where: {id: args.articlePostId}
    })
  }
})

// Create post
export const createArticlePost = mutationField('createArticlePost',{
  type: ArticlePost.$name,
  args: {
      articleDraftId: nonNull(stringArg()),
      publication: stringArg(),
      postType: arg({type: ArticlePostType.name})
  },
  resolve(parent,args,ctx) {
      return ctx.db.articlePost.create({
          data: {
            articleDraft: {
              connect: {
                id: args.articleDraftId
              }
            },
            publication: args.publication,
            postType: args.postType
          }
      })
  }
})

// Create post that is a child of another post
export const createChildArticlePost = mutationField('createChildArticlePost',{
  type: ArticlePost.$name,
  args: {
      articleDraftId: nonNull(stringArg()),
      publication: stringArg(),
      postType: arg({type: ArticlePostType.name}),
      parentId: stringArg()
  },
  resolve(parent,args,ctx) {
      return ctx.db.articlePost.create({
          data: {
            articleDraft: {
              connect: {
                id: args.articleDraftId
              }
            },
            childOf: {
              connect: {
                id: args.parentId
              }
            },
            publication: args.publication,
            postType: args.postType
          }
      })
  }
})

// Delete post 
export const deleteArticlePost = mutationField('deleteArticlePost',{
  type: ArticlePost.$name,
  args: {
      articlePostId: nonNull(stringArg())
  },
  resolve(parent,args,ctx) {
      return ctx.db.articlePost.delete({
        where: { id: args.articlePostId }
      })
  }
})
