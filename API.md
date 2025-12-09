# API Documentation

## Order Management API

### Base URL

```
/api/order
```

### Endpoints

#### 1. Get All Orders

```
GET /api/order
```

**Description:** Retrieve all orders with product counts
**Response:** Array of orders with product counts
**Status Codes:**

- 200: Success
- 500: Server error

**Example Response:**

```json
[
  {
    "id": 1,
    "orderdescription": "Order Desc",
    "createdat": "2025-12-05T08:20:10.645Z",
    "productcount": 3
  }
]
```

---

#### 2. Get Order by ID

```
GET /api/order/:id
```

**Description:** Retrieve a specific order by ID with its product count
**Parameters:**

- `id` (number, required): Order ID
  **Response:** Single order object with product count
  **Status Codes:**
- 200: Success
- 404: Order not found
- 500: Server error

**Example Response:**

```json
{
  "id": 1,
  "orderdescription": "Order Desc",
  "createdat": "2025-12-05T08:20:10.645Z",
  "productcount": 3
}
```

---

#### 3. Create New Order (with Products)

```
POST /api/order
```

**Description:** Create a new order and associate products in a single atomic transaction
**Request Body:**

```json
{
  "orderDescription": "Order description text",
  "productIds": [1, 2, 3]
}
```

**Parameters:**

- `orderDescription` (string, required): Description of the order
- `productIds` (array of numbers, optional): Array of product IDs to add to this order
  **Response:** Created order object with inserted product count
  **Status Codes:**
- 200: Success
- 400: Invalid request (missing orderDescription, invalid productIds)
- 500: Server error

**Example Response:**

```json
{
  "id": 6,
  "orderdescription": "Order description text",
  "createdat": "2025-12-05T09:17:28.287Z",
  "productcount": 3
}
```

**Notes:**

- All operations (order creation + product association) are wrapped in a database transaction for atomicity
- If productIds are provided, they are bulk-inserted into the orderproductmap table
- Product existence is validated; invalid productIds will cause the entire transaction to rollback
- Duplicate product associations are prevented by a unique constraint on (orderid, productid)

---

#### 4. Update Order (with Products)

```
PUT /api/order/:id
```

**Description:** Update an existing order and replace its associated products in a single atomic transaction
**Parameters:**

- `id` (number, required): Order ID
  **Request Body:**

```json
{
  "orderDescription": "Updated description",
  "productIds": [1, 2, 4]
}
```

**Parameters (in body):**

- `orderDescription` (string, required): Updated order description
- `productIds` (array of numbers, optional): New list of product IDs. Replaces all existing associations. Empty array removes all products.
  **Response:** Updated order object with product count
  **Status Codes:**
- 200: Success
- 404: Order not found
- 400: Invalid request
- 500: Server error

**Example Response:**

```json
{
  "id": 1,
  "orderdescription": "Updated description",
  "createdat": "2025-12-05T08:20:10.645Z",
  "productcount": 3
}
```

**Notes:**

- All operations (order update + product reassociation) are wrapped in a database transaction
- Existing product associations are deleted and replaced with the new list
- If productIds is omitted, existing associations are preserved (order description only is updated)
- If productIds is an empty array, all product associations are removed

---

#### 5. Delete Order by ID

```
DELETE /api/order/:id
```

**Description:** Delete an order and all its associated products in a single atomic transaction
**Parameters:**

- `id` (number, required): Order ID
  **Response:** Success message
  **Status Codes:**
- 200: Success
- 404: Order not found
- 500: Server error

**Example Response:**

```json
{
  "message": "Order deleted successfully"
}
```

**Notes:**

- Cascading delete: associated rows in orderproductmap are automatically deleted via foreign key cascade
- Transaction ensures order and all mappings are deleted atomically

---

## Supporting Endpoints

### Get Products

```
GET /api/products
```

**Description:** Get all available products for selection in the UI
**Response:** Array of products
**Status Codes:**

- 200: Success
- 500: Server error

**Example Response:**

```json
[
  {
    "id": 1,
    "productname": "HP laptop",
    "productdescription": "This is HP laptop"
  },
  {
    "id": 2,
    "productname": "lenovo laptop",
    "productdescription": "This is lenovo"
  }
]
```

---

## Design Rationale

### Why Consolidated Order Endpoints?

1. **Atomicity**: Creating/updating an order and its products happens in a single database transaction. This ensures the database is never in an inconsistent state (e.g., order created but product associations failed).

2. **Efficiency**:
   - Single round-trip to the server for order + products instead of 2 separate requests
   - GET /api/order returns product counts directly via SQL JOIN, avoiding per-order count queries
3. **Simpler API Surface**: Instead of managing `/api/order/:id/items` as a separate endpoint, products are managed as part of order lifecycle (create/update/delete).

4. **Cleaner Frontend Logic**: The add-order and edit-order pages send all data in one request, reducing async complexity.

### Transaction Guarantees

- **POST /api/order**: If order insert succeeds but product mapping bulk-insert fails, the entire transaction rolls back and the order is not created.
- **PUT /api/order/:id**: If order description update succeeds but product reassociation fails, the entire transaction rolls back.
- **DELETE /api/order/:id**: Order deletion with cascading product association cleanup happens atomically.

### Database Schema Notes

- `orderproductmap(id, orderid, productid)` has:
  - Foreign key `orderid` references `orders(id) ON DELETE CASCADE`
  - Foreign key `productid` references `products(id) ON DELETE CASCADE`
  - Unique constraint on `(orderid, productid)` prevents duplicate associations

---

## Example Client Usage

### Create Order with Products

```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "orderDescription": "Laptop order for John",
    "productIds": [1, 2]
  }'
```

### Update Order and Change Products

```bash
curl -X PUT http://localhost:3000/api/order/1 \
  -H "Content-Type: application/json" \
  -d '{
    "orderDescription": "Updated order - added bike",
    "productIds": [1, 3, 4]
  }'
```

### Get All Orders (with Product Counts)

```bash
curl http://localhost:3000/api/order
```

### Delete Order (and all its products)

```bash
curl -X DELETE http://localhost:3000/api/order/1
```
