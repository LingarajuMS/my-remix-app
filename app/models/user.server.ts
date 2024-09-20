import { prisma } from '~/db.server';
import bcrypt from 'bcryptjs';

export async function createUser(username: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { username, email, password: passwordHash }
  });
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findFirst({
  where: {
    username: "ipgautomotive",
    password: "carmaker"
  }
});
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}


