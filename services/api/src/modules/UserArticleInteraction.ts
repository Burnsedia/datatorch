import { enumType, objectType } from 'nexus'
import { UserArticleInteraction, UserArticleInteractionType} from 'nexus-prisma'

const userArticleInteractionType = enumType(UserArticleInteractionType)

export const userArticleInteraction = objectType({
  name: UserArticleInteraction.$name,
  description: UserArticleInteraction.$description,
  definition(t) {
    t.field(UserArticleInteraction.id)
    t.field('projectOwner', {
      type: 'ProjectOwner',
        resolve: (parent, _, ctx) => {
          return ctx.db.projectOwner.findUnique({
            where: { id: parent.projectOwnerId },
          })
        }
    })
    t.field('article', {
      type: 'ArticlePost',
        resolve: (parent, _, ctx) => {
          return ctx.db.articlePost.findUnique({
            where: { id: parent.articleId },
          })
        }
    })
    t.field(UserArticleInteraction.interactionTime)
    t.field('interactionType',{type:userArticleInteractionType})
  }
})

