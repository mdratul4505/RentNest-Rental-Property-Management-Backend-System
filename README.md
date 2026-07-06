# RentNest 🏠
> "Find & List Rental Properties with Ease"

RentNest is a feature-rich, secure, and robust backend API for a rental property marketplace. It provides tailored endpoints for Tenants, Landlords, and Admins to manage property listings, rental requests, Stripe payments, and reviews.

---

## 🛠️ Technology Stack
- **Core Platform**: Node.js & Express.js (v5+)
- **Language**: TypeScript
- **Database ORM**: Prisma (v7+)
- **Database**: PostgreSQL
- **Security & Auth**: JWT (JSON Web Tokens) with Access & Refresh Token rotation + bcryptjs password hashing
- **Input Validation**: Zod Schema validation
- **Payment Processing**: Stripe API Integration
- **Error Handling**: Consistent global error handling returning structured JSON

---

## 📋 Features

### Public Features
- **Browse Properties**: Retrieve all properties with advanced filters (location, price range, property type, amenities, and text search).
- **View Property Details**: Read details of any specific property listing, including landlord info and reviews.
- **Categories**: Browse categories like Apartment, House, Studio, and Duplex.

### Tenant Features
- **Registration & Auth**: Secure registration and token-based login.
- **Rental Requests**: Submit property rental/booking requests with customized move-in dates.
- **Rental Request History**: View requests categorized by status (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`).
- **Stripe Payments**: Create a Stripe PaymentIntent and confirm payment dynamically upon landlord approval.
- **Reviews**: Leave feedback and star ratings on properties after active or completed rentals.
- **Profile Management**: Retrieve logged-in tenant profile details.

### Landlord Features
- **Property Management**: Create, edit, and delete property listings.
- **Status Toggling**: Enable or disable property availability dynamically.
- **Approve/Reject requests**: Manage rental requests submitted by tenants.
- **Tenant History**: Access previous booking requests.

### Admin Features
- **User Moderation**: View all users and toggle user status (`ACTIVE` / `BLOCKED`).
- **Global Overview**: Inspect all active property listings and rental requests.
- **Category Control**: Manage categories to keep options up to date.

---

## 🔐 Credentials & Environment Setup

### Working Admin Credentials (Mandatory)
* **Email**: `admin@rentnest.com`
* **Password**: `AdminRentNest2026!`

### Working Tenant Credentials (Test)
* **Email**: `tenant@rentnest.com`
* **Password**: `Tenant123!`

### Working Landlord Credentials (Test)
* **Email**: `landlord@rentnest.com`
* **Password**: `Landlord123!`

### Environment Variables (`.env`)
Create a `.env` file in the root folder with the following configuration:
```env
PORT=5000
APP_URL="http://localhost:5000"
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET="super_secret_key_access_987654321_rentnest"
JWT_REFRESH_SECRET="super_secret_key_refresh_123456789_rentnest"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
```

---

## 🚀 Setup & Execution Instructions

Follow these steps to set up and run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Migrate Schema
Run the database migrations to set up the tables:
```bash
npx prisma migrate dev --name init
```

### 3. Seed Initial Database Data
Populate categories and the standard Admin, Landlord, and Tenant accounts:
```bash
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will boot up and listen on port `5000` (e.g. `http://localhost:5000`).

---

## 📁 API Documentation & Postman Collection
The repository includes a pre-configured Postman Collection:
- **File**: `RentNest.postman_collection.json`
- **Import Instructions**:
  1. Open Postman.
  2. Click **Import** in the top-left corner.
  3. Drag and drop the `RentNest.postman_collection.json` file.
  4. Select the environment variables or use the default collection variables (`base_url` set to `http://localhost:5000`).
  5. The Collection automates authorization: logging in will save the JWT token under the `accessToken` variable dynamically!

---

## 🛑 Consistent Error Responses
All endpoints implement standard input validation schemas and return error details in JSON:
```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": {
    "issues": [
      {
        "path": "body.email",
        "message": "Invalid email address"
      }
    ]
  }
}
```
Or for general application exceptions:
```json
{
  "success": false,
  "message": "Property not found",
  "errorDetails": null
}
```
