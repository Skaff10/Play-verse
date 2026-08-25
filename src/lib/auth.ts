import { cookies } from 'next/headers';
import { prisma } from './prisma';

export interface UserSession {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  totalScore: number;
  moviesLoggedCount: number;
  seriesLoggedCount: number;
  gamesLoggedCount: number;
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
      select: {
        id: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        totalScore: true,
        moviesLoggedCount: true,
        seriesLoggedCount: true,
        gamesLoggedCount: true,
      },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

