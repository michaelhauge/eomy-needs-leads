import { NextRequest, NextResponse } from 'next/server';
import { getReviewsForRecommendation, createReview } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const recommendationId = searchParams.get('recommendation_id');

    if (!recommendationId) {
      return NextResponse.json(
        { error: 'recommendation_id is required' },
        { status: 400 }
      );
    }

    const id = parseInt(recommendationId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid recommendation_id' },
        { status: 400 }
      );
    }

    const reviews = await getReviewsForRecommendation(id);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendation_id, reviewer_name, rating, review_text } = body;

    // Validate required fields
    if (!recommendation_id || !reviewer_name || rating === undefined) {
      return NextResponse.json(
        { error: 'recommendation_id, reviewer_name, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await createReview({
      recommendation_id: parseInt(recommendation_id, 10),
      reviewer_name: reviewer_name.trim(),
      rating: ratingNum,
      review_text: review_text?.trim() || undefined,
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
