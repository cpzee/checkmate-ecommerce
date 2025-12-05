import { db } from 'checkmate/lib/db';

/**
 * GET /api/products - Get all products
 * @returns json array of products
 */
export async function GET() {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY id ASC');
        return Response.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
