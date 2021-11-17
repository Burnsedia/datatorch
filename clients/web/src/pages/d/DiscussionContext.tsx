import { createContext, useContext } from 'react'

export enum DiscussionFilterType {
  Activity,
  Created,
  Upvotes
}

export enum DiscussionFilterTimescale {
  Day,
  Month,
  Season,
  Year,
  All
}

export interface DiscussionPageContext {
  currentPublication: string
  visiblePostTypes: Array<string>
  discussionFilter: DiscussionFilterType
  discussionFilterDescending: boolean
  currentWorkingDraftID: string
  loggedInUsername?: string
  dispatch: React.Dispatch<any>
}

export const discussionPageContextDefaults: DiscussionPageContext = {
  currentPublication: 'General',
  visiblePostTypes: ['classified', 'discussion', 'question'],
  discussionFilter: DiscussionFilterType.Activity,
  discussionFilterDescending: true,
  currentWorkingDraftID: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
}

export const DiscussionPageContext = createContext(
  discussionPageContextDefaults
)

export const useDiscussionPageContext = () => {
  return useContext(DiscussionPageContext)
}

export const discussionPageContextReducer = (state, action) => {
  switch (action.type) {
    case 'setPublication':
      return { ...state, currentPublication: action.currentPublication }
    case 'setVisiblePostTypes':
      return { ...state, visiblePostTypes: action.visiblePostTypes }
    case 'setDiscussionFilter':
      return { ...state, discussionFilter: action.discussionFilter }
    case 'setDiscussionFilterDescending':
      return {
        ...state,
        discussionFilterDescending: action.discussionFilterDescending
      }
    case 'setCurrentWorkingDraftID':
      return { ...state, currentWorkingDraftID: action.currentWorkingDraftID }
    case 'setLoggedInUsername':
      return { ...state, loggedInUsername: action.loggedInUsername }
  }
}
