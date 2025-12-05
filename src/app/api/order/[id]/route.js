import {db} from 'checkmate/lib/db';

/**
 * GET /api/order/:id - Get order by ID
 * @param {Request} request 
 * @param {Object} context with params containing id
 * @returns json of the order
 */
export async function GET(request, context) {
    try {
        const params = await context.params;
        const {id} = params;
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return Response.json({error: 'Order not found'}, {status: 404});
        }
        return Response.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching order:', error);
        return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

/**
 * PUT /api/order/:id - Update order by ID
 * @param {Request} request 
 * @param {Object} context with params containing id
 * @returns json of the updated order
 */
export async function PUT(request, context) {
    try {
        const params = await context.params;
        const {id} = params;
        const body = await request.json();
        const {orderDescription} = body;

        const result = await db.query(
            'UPDATE orders SET orderdescription = $1 WHERE id = $2 RETURNING *',
            [orderDescription, id]
        );
        if (result.rows.length === 0) {
            return Response.json({error: 'Order not found'}, {status: 404});
        }
        return Response.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order:', error);
        return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

/**
 * DELETE /api/order/:id - Delete order by ID
 * @param {Request} request 
 * @param {Object} context with params containing id
 * @returns json with success message
 */
export async function DELETE(request, context) {
    try {
        const params = await context.params;
        const {id} = params;
        const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return Response.json({error: 'Order not found'}, {status: 404});
        }
        return Response.json({message: 'Order deleted successfully'});
    } catch (error) {
        console.error('Error deleting order:', error);
        return Response.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}