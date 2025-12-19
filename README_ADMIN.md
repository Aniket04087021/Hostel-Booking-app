# Admin Access Guide

## How to Access Admin Dashboard

### Step 1: Create an Admin User

First, you need to create an admin user. You have two options:

#### Option A: Using the Script (Recommended)

Run this command in the backend directory:

```bash
cd backend
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@restaurant.com`
- **Password**: `admin123`
- **⚠️ IMPORTANT**: Change this password after first login!

#### Option B: Manual Database Update

1. First, sign up as a regular user through the website
2. Then, update the user in MongoDB to set `isAdmin: true`

You can do this in MongoDB Compass or using MongoDB shell:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

### Step 2: Access Admin Login Page

1. Go to: `http://localhost:5173/admin/login` (or your deployed URL)
2. Or navigate to: `https://hostel-booking-app-jdda.vercel.app/admin/login`

### Step 3: Login as Admin

- Enter the admin email and password
- Click "Admin Login"
- You'll be redirected to the admin dashboard

### Step 4: Access Admin Dashboard

After successful login, you'll be redirected to:
- `http://localhost:5173/admin` (local)
- `https://hostel-booking-app-jdda.vercel.app/admin` (deployed)

## Admin Dashboard Features

Once logged in as admin, you can:
- ✅ View all booking requests
- ✅ Filter bookings by year, month, date, and name
- ✅ Accept or decline booking requests
- ✅ See paginated results (5, 10, 50, or 100 records per page)
- ✅ View booking status (pending, accepted, declined)

## Important Notes

1. **Regular users** cannot access the admin dashboard - they'll be redirected to the admin login page
2. **Admin login** is separate from regular user login
3. **Only users with `isAdmin: true`** can access admin features
4. The admin dashboard is protected on both frontend and backend

## Troubleshooting

If you can't access the admin dashboard:
1. Make sure you've created an admin user (see Step 1)
2. Verify the user has `isAdmin: true` in the database
3. Try logging out and logging back in
4. Check browser console for any errors

