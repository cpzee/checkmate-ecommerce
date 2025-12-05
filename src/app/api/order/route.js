import {db} from 'checkmate/lib/db';

/**
 * GET /api/order - Get all orders
 * @returns json array of all orders
 */
export async function GET() {
    try {
        const result = await db.query('SELECT * FROM orders ORDER BY id ASC');
        return Response.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

/**
 * POST /api/order - Create new order
 * @param {Request} request 
 * @returns json of created order
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const {orderDescription} = body;

        const result = await db.query(
            'INSERT INTO orders (orderdescription, createdat) VALUES ($1, NOW()) RETURNING *',
            [orderDescription]
        );
        return Response.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }
}