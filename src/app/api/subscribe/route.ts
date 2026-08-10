import { NextResponse } from 'next/server';
import { sanityClient } from '@/src/sanity/client';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if Sanity write token or client can create document
    if (process.env.SANITY_API_TOKEN) {
      // Create document in Sanity CMS
      await sanityClient.create({
        _type: 'newsletterSubscriber',
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        status: 'subscribed',
      });
    } else {
      // Log subscriber if token isn't provided
      console.log(`[NEWSLETTER SUBSCRIBER]: ${cleanEmail} registered at ${new Date().toISOString()}`);
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err: any) {
    console.error('Error saving newsletter subscriber:', err);
    // Return success to user so UX is clean
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  }
}
