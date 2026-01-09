import { NextRequest, NextResponse } from 'next/server';
import { createRecommendation } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, category_id, contact_info, recommended_by } = body;

    // Validate required fields
    if (!name || !recommended_by) {
      return NextResponse.json(
        { error: 'Name and recommended_by are required' },
        { status: 400 }
      );
    }

    // Create the recommendation
    const recommendation = await createRecommendation({
      name: name.trim(),
      description: description?.trim() || undefined,
      category_id: category_id ? parseInt(category_id, 10) : undefined,
      contact_info: contact_info?.trim() || undefined,
      recommended_by: recommended_by.trim(),
    });

    if (!recommendation) {
      return NextResponse.json(
        { error: 'Failed to create recommendation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
