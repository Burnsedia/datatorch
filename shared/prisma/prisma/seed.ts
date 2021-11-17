import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
const prisma = new PrismaClient()

export async function seed() {
  try {
    const password0 = await argon2.hash('example')
    const password1 = await argon2.hash('example')
    const password2 = await argon2.hash('example')
    const kevin = await prisma.projectOwner.create({
      data: {
        type: 'USER',
        userCredentials: {
          create: {
            email: 'kserrano@example.com',
            login: 'kserrano',
            password: password0
          }
        },
        name: 'Kevin Serrano'
      }
    })

    const michael = await prisma.projectOwner.create({
      data: {
        type: 'USER',
        userCredentials: {
          create: {
            email: 'mnguyen@example.net',
            login: 'mnguyen',
            password: password1
          }
        },
        name: 'Michael Nguyen'
      }
    })

    const justin = await prisma.projectOwner.create({
      data: {
        type: 'USER',
        userCredentials: {
          create: {
            email: 'jbrooks@exmaple.dev',
            login: 'jbrooks',
            password: password2
          }
        },
        name: 'Justin Brooks'
      }
    })

    const exampleDraft = await prisma.articleDraft.create({
      data: {
        author: {
          connect: {
            id: michael.id
          }
        },
        title:"test title",
        content:"test content"
      }
    })

    //console.log({ kevin, michael, justin, exampleDraft })
  } catch (e) {
    //console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
