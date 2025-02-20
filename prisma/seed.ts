import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.user.deleteMany()
  await prisma.group.deleteMany()

  // Create users
  const rafael = await prisma.user.create({
    data: {
      firstName: 'Rafael',
      lastName: 'Macedo',
      username: 'rafael-macedo',
      clerkUserId: 'user_2tJjdX2yYyKBI6cfEXzqlwtbStB',
      imageUrl:
        'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydEdrTnRLQWV0MkNtSDNreUhWRjM3eThQOFQiLCJyaWQiOiJ1c2VyXzJ0SmpkWDJ5WXlLQkk2Y2ZFWHpxbHd0YlN0QiIsImluaXRpYWxzIjoiUk0ifQ'
    }
  })

  const ana = await prisma.user.create({
    data: {
      firstName: 'Ana',
      lastName: 'Ferreira',
      username: 'ana-ferreira',
      clerkUserId: 'user_2tKA85WOvcNQF4OC39xqBFb2LIc',
      imageUrl:
        'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydEdrTnRLQWV0MkNtSDNreUhWRjM3eThQOFQiLCJyaWQiOiJ1c2VyXzJ0S0E4NVdPdmNOUUY0T0MzOXhxQkZiMkxJYyJ9'
    }
  })

  const john = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john-doe',
      clerkUserId: 'user_2tKBgvkttuzeQwW8GKXPlOwmFrH',
      imageUrl:
        'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydEdrTnRLQWV0MkNtSDNreUhWRjM3eThQOFQiLCJyaWQiOiJ1c2VyXzJ0S0Jndmt0dHV6ZVF3VzhHS1hQbE93bUZySCIsImluaXRpYWxzIjoiSkQifQ'
    }
  })

  const jane = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane-doe',
      clerkUserId: 'user_2tKB93AIiIi0OOKK1Mw3UXm3cBS',
      imageUrl:
        'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydEdrTnRLQWV0MkNtSDNreUhWRjM3eThQOFQiLCJyaWQiOiJ1c2VyXzJ0S0I5M0FJaUlpME9PS0sxTXczVVhtM2NCUyIsImluaXRpYWxzIjoiSkQifQ'
    }
  })

  // Create friendships between Rafael, Ana, and John
  await prisma.userFriend.createMany({
    data: [
      { userId: rafael.id, friendId: ana.id },
      { userId: ana.id, friendId: rafael.id },
      { userId: rafael.id, friendId: john.id },
      { userId: john.id, friendId: rafael.id },
      { userId: ana.id, friendId: john.id },
      { userId: john.id, friendId: ana.id },
      { userId: ana.id, friendId: jane.id },
      { userId: jane.id, friendId: ana.id },
      { userId: john.id, friendId: jane.id },
      { userId: jane.id, friendId: john.id },
      { userId: rafael.id, friendId: jane.id },
      { userId: jane.id, friendId: rafael.id }
    ]
  })

  // Create a group
  const group = await prisma.group.create({
    data: {
      name: 'Household',
      members: {
        createMany: {
          data: [
            { userId: ana.id },
            { userId: rafael.id },
            { userId: john.id },
            { userId: jane.id }
          ]
        }
      }
    }
  })

  // Create multiple expenses with payments
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        description: 'Lunch',
        amount: 400,
        date: new Date(),
        groupId: group.id,
        payments: {
          create: [
            { amount: 125, paidById: rafael.id },
            { amount: 200, paidById: ana.id },
            { amount: 75, paidById: john.id }
          ]
        }
      }
    })
  ])

  // Create splits for the expenses
  await Promise.all(
    expenses.map(expense =>
      prisma.split.createMany({
        data: [
          { amount: expense.amount / 4, expenseId: expense.id, userId: ana.id },
          {
            amount: expense.amount / 4,
            expenseId: expense.id,
            userId: rafael.id
          },
          {
            amount: expense.amount / 4,
            expenseId: expense.id,
            userId: john.id
          },
          { amount: expense.amount / 4, expenseId: expense.id, userId: jane.id }
        ]
      })
    )
  )

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
