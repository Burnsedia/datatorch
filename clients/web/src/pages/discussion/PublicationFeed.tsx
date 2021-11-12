import React from 'react'
import { useGetArticlePostsByPublicationQuery } from '@/generated/graphql'
import Post from './Post'
import { useDiscussionPageContext } from './DiscussionContext'

const PublicationFeed: React.FC<props> = ({ publication }) => {
  const context = useDiscussionPageContext()
  const posts = useGetArticlePostsByPublicationQuery({
    variables: {
      publicationName: context.currentPublication
    }
  })
  return (
    <div>
      {posts.data?.getArticlePostsByPublication.map(posts => (
        <Post
          key={posts.id}
          id={posts.id}
          postType={posts.postType}
          publicationName={posts.publication}
          author={posts.articleDraft.author.name}
          title={posts.articleDraft.title}
          content={posts.articleDraft.content}
        />
      ))}
    </div>
  )
}
export default PublicationFeed
