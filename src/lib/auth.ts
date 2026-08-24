import { cookies } from 'next/headers';
import { prisma } from './prisma';

export interface UserSession {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  totalScore: number;
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('playverse_session')?.value;

    if (!sessionToken) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) return null;

    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      totalScore: user.totalScore,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
