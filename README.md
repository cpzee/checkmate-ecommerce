# CheckMate E-Commerce Order Management System

A professional order management system built with Next.js 16, React 19, PostgreSQL, and Tailwind CSS. Create and manage orders with product selection, displaying order details with product counts.

## Project Overview

This application provides:

- **Order Management**: Create, read, update, and delete orders
- **Product Selection**: Associate products with orders via checkbox UI
- **Product Counting**: Display product counts for each order
- **Professional UI**: Clean, responsive interface with Tailwind CSS styling
- **RESTful API**: Consolidated endpoints for efficient order operations

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) - verify with `npm --version`
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional, for cloning the repository)

## Installation Steps

### 1. Install Node.js and npm

**macOS (using Homebrew):**

```bash
brew install node
```

**Windows (using Chocolatey):**

```bash
choco install nodejs
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install nodejs npm
```

**Verify installation:**

```bash
node --version
npm --version
```

### 2. Clone and Navigate to Project

```bash
# Clone the repository (if using git)
git clone <repository-url>
cd checkmate-ecommerce

# Or navigate to existing project directory
cd /path/to/checkmate-ecommerce
```

### 3. Install Project Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 16
- React 19
- PostgreSQL client (pg)
- Tailwind CSS
- ESLint

### 4. Configure Database Connection

Create a `.env.local` file in the project root:

```bash
# Linux/macOS
touch .env.local

# Windows (Command Prompt)
type nul > .env.local
```

Add the following environment variable with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/checkmate_db
```

**Example for local PostgreSQL:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/checkmate_db
```

### 5. Set Up PostgreSQL Database

**Create the database and tables:**

Connect to PostgreSQL:

```bash
psql -U postgres
```

In the PostgreSQL prompt, create the database:

```sql
CREATE DATABASE checkmate_db;
\c checkmate_db
```

Create the required tables:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  productname VARCHAR(255) NOT NULL,
  productdescription TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderdescription TEXT,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orderproductmap (
  id SERIAL PRIMARY KEY,
  orderid INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  productid INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(orderid, productid)
);

-- Insert sample products
INSERT INTO products (productname, productdescription) VALUES
  ('HP laptop', 'This is HP laptop'),
  ('Lenovo laptop', 'This is lenovo'),
  ('Dell laptop', 'This is Dell'),
  ('Apple MacBook', 'This is Apple MacBook');
```

Exit PostgreSQL:

```sql
\q
```

## Running the Project

### Start Development Server

```bash
npm run dev
```

The application will start and be available at:

```
http://localhost:3000
```

You should see output like:

```
  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
```

### Access the Application

Open your browser and navigate to:

- **Home**: http://localhost:3000
- **Add Order**: http://localhost:3000/add-order
- **View Orders**: http://localhost:3000/orders

### Build for Production

To create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build optimized production bundle
npm run build

# Start production server
npm start

# Run ESLint to check code quality
npm run lint
```

## API Endpoints

All endpoints are consolidated under `/api/order` for atomic operations:

### Orders

- `GET /api/order` - Get all orders with product counts
- `GET /api/order/:id` - Get specific order by ID
- `POST /api/order` - Create new order (with optional products)
- `PUT /api/order/:id` - Update order (with optional products)
- `DELETE /api/order/:id` - Delete order

### Products

- `GET /api/products` - Get all available products

For detailed API documentation, see [API.md](../API.md)

## Testing with curl

### Create an Order with Products

```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "orderDescription": "Laptop order for client",
    "productIds": [1, 2]
  }'
```

### Get All Orders

```bash
curl http://localhost:3000/api/order
```

### Get Specific Order

```bash
curl http://localhost:3000/api/order/1
```

### Update Order

```bash
curl -X PUT http://localhost:3000/api/order/1 \
  -H "Content-Type: application/json" \
  -d '{
    "orderDescription": "Updated order description",
    "productIds": [1, 3]
  }'
```

### Delete Order

```bash
curl -X DELETE http://localhost:3000/api/order/1
```

## Project Structure

```
checkmate-ecommerce/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── order/          # Order management endpoints
│   │   ├── add-order/          # Create order page
│   │   ├── orders/             # View orders page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Home page
│   └── lib/
│       └── db.js               # PostgreSQL connection
├── public/                      # Static assets
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
└── README.md                    # This file
```

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.0.7  | React framework with App Router |
| React        | 19.2.0  | UI library                      |
| PostgreSQL   | 12+     | Database                        |
| Tailwind CSS | 4       | Styling                         |
| pg           | 8.16.3  | PostgreSQL client               |
| Node.js      | 18+     | JavaScript runtime              |

## Troubleshooting

### Issue: `DATABASE_URL is not defined`

**Solution**: Ensure `.env.local` file exists in the project root with the correct PostgreSQL connection string.

### Issue: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**: Verify PostgreSQL is running:

```bash
# macOS
brew services list

# Ubuntu/Debian
sudo systemctl status postgresql

# Windows
Services > PostgreSQL
```

### Issue: Database table doesn't exist

**Solution**: Run the SQL table creation commands in PostgreSQL as shown in the "Set Up PostgreSQL Database" section above.

### Issue: Port 3000 already in use

**Solution**: Run on a different port:

```bash
npm run dev -- -p 3001
```

### Issue: npm install fails

**Solution**: Clear npm cache and try again:

```bash
npm cache clean --force
npm install
```

## Contributing

This project is part of the CheckMate examination system. Please follow the project guidelines when making changes.

## Support

For issues or questions, please contact the development team or check the project documentation.
