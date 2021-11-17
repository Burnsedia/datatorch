import { extendType, objectType } from 'nexus'

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('description')
    t.boolean('disabled')
    t.string('createdAt')
    t.string('updatedAt')
  }
})

export const ProjectQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('project', {
      type: 'Project'
    })
  }
})
