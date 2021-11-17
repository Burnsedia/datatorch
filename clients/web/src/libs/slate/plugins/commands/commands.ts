import {
  FaFont,
  FaHeading,
  FaSquareRootAlt,
  FaTwitter} from 'react-icons/fa'
import { Command } from './utils'

const basicBlocks: Command[] = [
  {
    element: { type: 'paragraph' },
    group: 'Basic Block',
    icon: FaFont,
    name: 'Text',
    desc: 'Just start writing with plain text.'
  },
  // {
  //   group: 'Basic Block',
  //   icon: FaCode,
  //   name: 'Code',
  //   desc: 'Display highlighted code.'
  // },
  {
    element: { type: 'heading', level: 1 },
    group: 'Basic Block',
    icon: FaHeading,
    name: 'Heading 1',
    desc: 'Big section heading.'
  },
  {
    element: { type: 'heading', level: 2 },
    group: 'Basic Block',
    icon: FaHeading,
    name: 'Heading 2',
    desc: 'Medium section heading.'
  },
  {
    element: { type: 'heading', level: 3 },
    group: 'Basic Block',
    icon: FaHeading,
    name: 'Heading 3',
    desc: 'Small section heading.'
  },
  // {
  //   group: 'Basic Block',
  //   icon: FaQuoteLeft,
  //   name: 'Quote',
  //   desc: 'Capture a quote.'
  // },
  // {
  //   group: 'Basic Block',
  //   icon: FaGripLines,
  //   name: 'Divider',
  //   desc: 'Visually divide blocks.'
  // },
  // {
  //   group: 'Basic Block',
  //   icon: FaListUl,
  //   name: 'Bulleted list',
  //   desc: 'Create a simple bulleted list.'
  // },
  // {
  //   group: 'Basic Block',
  //   icon: FaListOl,
  //   name: 'Numbered list',
  //   desc: 'Create a list with numbering.'
  // },
  {
    element: { type: 'equation', block: true },
    group: 'Basic Block',
    icon: FaSquareRootAlt,
    name: 'Equation',
    desc: 'Create complex equations using TeX.'
  }
]

// const inline: Command[] = [
//   {
//     element: { text: '', code: true },
//     group: 'Inline',
//     icon: FaInfinity,
//     name: 'Inline Code',
//     desc: 'Insert mathematical symbols in text.'
//   },
//   {
//     element: { text: '', equation: true },
//     group: 'Inline',
//     icon: FaInfinity,
//     name: 'Inline Equation',
//     desc: 'Insert mathematical symbols in text.'
//   }
// ]

// const media: Command[] = [
//   {
//     group: 'Media',
//     icon: FaImage,
//     name: 'Image',
//     desc: 'Embed an image from a link.'
//   },
//   {
//     group: 'Media',
//     icon: FaVideo,
//     name: 'Video',
//     desc: 'Embed from Youtube, Vimeo...'
//   }
// ]

const embeds: Command[] = [
  {
    element: { type: 'tweet' },
    group: 'Embeds',
    icon: FaTwitter,
    name: 'Tweet',
    desc: 'Embed a Tweet.'
  },
  // {
  //   group: 'Embeds',
  //   icon: FaGithub,
  //   name: 'Github Gist',
  //   desc: 'Embed a Gist from GitHub.'
  // },
  // {
  //   group: 'Embeds',
  //   icon: FaCodepen,
  //   name: 'CodePen',
  //   desc: 'Embed a CodePen.'
  // }
]

export const commands: Command[] = [
  ...basicBlocks,
  // ...inline,
  // ...media,
  ...embeds
]
