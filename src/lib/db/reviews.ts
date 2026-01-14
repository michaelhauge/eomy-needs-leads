import { sql } from './connection';
import type { Review } from './types';

export async function getReviewsForRecommendation(recommendationId: number): Promise<Review[]> {
  if (!sql) return [];
  const rows = await sql<Review[]>`
    SELECT id, recommendation_id, reviewer_name, rating, review_text, created_at
    FROM reviews
    WHERE recommendation_id = ${recommendationId}
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function createReview(data: {
  recommendation_id: number;
  reviewer_name: string;
  rating: number;
  review_text?: string;
}): Promise<Review | null> {
  if (!sql) return null;

  // Insert the review
  const [review] = await sql<Review[]>`
    INSERT INTO reviews (recommendation_id, reviewer_name, rating, review_text)
    VALUES (${data.recommendation_id}, ${data.reviewer_name}, ${data.rating}, ${data.review_text || null})
    RETURNING id, recommendation_id, reviewer_name, rating, review_text, created_at
  `;

  // Update the cached average rating and count on the recommendation
  await sql`
    UPDATE recommendations
    SET
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE recommendation_id = ${data.recommendation_id}
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE recommendation_id = ${data.recommendation_id}
      )
    WHERE id = ${data.recommendation_id}
  `;

  return review;
}
