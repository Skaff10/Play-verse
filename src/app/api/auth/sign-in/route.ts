import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { firebaseUid, email, displayName } = await req.json();

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: 'firebaseUid and email are required' }, { status: 400 });
    }

    // Upsert user: create if doesn't exist, update email/displayName if it does
    let user = await prisma.user.findUnique({
      where: { id: firebaseUid },
    });

    if (!user) {
      // Also check if a user with this email already exists (edge case: migrated account)
      const existingByEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingByEmail) {
        // Update existing user to use Firebase UID
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            displayName: displayName || existingByEmail.displayName,
          },
        });
      } else {
        // Create brand new user with Firebase UID as their Prisma ID
        const namePart = displayName || email.split('@')[0];
        const safeName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        user = await prisma.user.create({
          data: {
            id: firebaseUid,
            email: email.toLowerCase().trim(),
            displayName: safeName,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email.split('@')[0]}`,
            totalScore: 0,
          },
        });
      }
    }

    const cookieStore = await cookies();
    cookieStore.set('playverse_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication failed', 
        message: error?.message || 'Unknown server error'
      }, 
      { status: 500 }
    );
  }
}

