import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elaa.com' },
    update: {},
    create: {
      email: 'admin@elaa.com',
      password: await hash('Admin@123', 10),
      role: 'ADMIN'
    }
  });

  if (admin) {
    console.log(`✅ Admin account ${admin.email} successfully created/updated`);
  }
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });