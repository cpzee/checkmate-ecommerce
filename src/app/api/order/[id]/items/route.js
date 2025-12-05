import { db } from 'checkmate/lib/db';

/**
 * GET /api/order/:id/items - Get products for a specific order
 * @param {Request} request
 * @param {Object} context with params containing id
 * @returns json array of products in the order
 */
export async function GET(request, context) {
    try {
        const params = await context.params;
        const orderId = params.id;
        
        const result = await db.query(
            `SELECT opm.id, opm.productid, p.productname, p.productdescription 
             FROM orderproductmap opm 
             JOIN products p ON opm.productid = p.id 
             WHERE opm.orderid = $1 
             ORDER BY opm.id ASC`,
            [orderId]
        );
        
        return Response.json(result.rows);
    } catch (error) {
        console.error('Error fetching order items:', error);
        return Response.json({ error: 'Failed to fetch order items' }, { status: 500 });
    }
}

/**
 * POST /api/order/:id/items - Add products to an order
 * @param {Request} request
 * @param {Object} context with params containing id
 * @returns json of created order items
 */
export async function POST(request, context) {
    try {
        const params = await context.params;
        const orderId = params.id;
        const body = await request.json();
        const { productIds } = body;

        // Delete existing items for this order
        await db.query('DELETE FROM orderproductmap WHERE orderid = $1', [orderId]);

        // Insert new items
        if (productIds && productIds.length > 0) {
            for (const productId of productIds) {
                await db.query(
                    'INSERT INTO orderproductmap (orderid, productid) VALUES ($1, $2)',
                    [orderId, productId]
                );
            }
        }

        // Return the updated items
        const result = await db.query(
            `SELECT opm.id, opm.productid, p.productname, p.productdescription 
             FROM orderproductmap opm 
             JOIN products p ON opm.productid = p.id 
             WHERE opm.orderid = $1
             ORDER BY opm.id ASC`,
            [orderId]
        );

        return Response.json(result.rows);
    } catch (error) {
        console.error('Error adding order items:', error);
        return Response.json({ error: 'Failed to add order items' }, { status: 500 });
    }
}

