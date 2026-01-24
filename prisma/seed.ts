import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['warn', 'error'] })

async function seedRoles() {
  const roles = [
    { name: 'Admin', description: 'Full system access and user management', permissions: 'Full Access' },
    { name: 'Engineer', description: 'Create and modify products, BoMs, ECOs', permissions: 'Read/Write' },
    { name: 'Approver', description: 'Approve or reject ECOs', permissions: 'Approve' },
    { name: 'Operations', description: 'View and implement approved ECOs', permissions: 'Read/Implement' },
  ]
  for (const role of roles) {
    await prisma.role.upsert({ where: { name: role.name }, update: {}, create: role })
  }
}

async function seedUsers() {
  const users = [
    { name: 'System Admin', email: 'admin@example.com', password: 'password123', role: 'Admin', status: 'Active' },
    { name: 'Sarah Engineer', email: 'engineer@example.com', password: 'password123', role: 'Engineer', status: 'Active' },
    { name: 'Michael Approver', email: 'approver@example.com', password: 'password123', role: 'Approver', status: 'Active' },
  ]
  for (const user of users) {
    await prisma.user.upsert({ where: { email: user.email }, update: {}, create: user })
  }
}

async function seedProducts() {
  const products = [
    {
      productId: 'P001',
      name: 'Office Chair Deluxe',
      category: 'Furniture',
      currentVersion: 'v2.3',
      salePrice: 459.99,
      costPrice: 287.5,
      sku: 'SKU-OCD-001',
      manufacturer: 'ComfortWorks',
    },
    {
      productId: 'P002',
      name: 'Industrial Pump XR-500',
      category: 'Industrial',
      currentVersion: 'v1.8',
      salePrice: 2450.0,
      costPrice: 1680.0,
      sku: 'SKU-IPX-500',
      manufacturer: 'PumpTech',
    },
  ]
  for (const p of products) {
    await prisma.product.upsert({ where: { productId: p.productId }, update: {}, create: p as any })
  }
}

async function seedSystemSettings() {
  const settings = [
    { key: 'companyName', value: 'CodingKarma Inc.' },
    { key: 'currency', value: 'USD' },
    { key: 'timeZone', value: 'UTC' },
  ]
  for (const s of settings) {
    await prisma.systemSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
}

export async function main() {
  console.log('Seeding database...')
  await seedRoles()
  await seedUsers()
  await seedProducts()
  await seedSystemSettings()
  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
