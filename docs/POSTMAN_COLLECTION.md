# Smart Campus Operations Hub - Module B API Documentation

## Postman Collection

This document provides examples for testing the Booking Management API using Postman or any REST client.

## Base URL

```
http://localhost:8080/api
```

---

## Authentication

### 1. Login

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@smartcampus.com",
  "password": "user123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@smartcampus.com",
  "fullName": "Regular User",
  "role": "USER"
}
```

**Note:** Save the `token` from the response and use it in the `Authorization` header for subsequent requests.

---

### 2. Register (Optional)

**POST** `/auth/register`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "role": "USER"
}
```

---

## Booking Endpoints

### Authorization Header

For all booking endpoints, include:

```
Authorization: Bearer <your_token_here>
```

---

### 3. Create Booking

**POST** `/bookings`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "resourceId": 1,
  "startDateTime": "2026-04-10T09:00:00",
  "endDateTime": "2026-04-10T11:00:00",
  "purpose": "Team meeting for project discussion",
  "expectedAttendees": 10
}
```

**Success Response (201 Created):**

```json
{
  "id": 1,
  "resourceId": 1,
  "resourceName": "Lecture Hall A1",
  "userId": 2,
  "userFullName": "Regular User",
  "startDateTime": "2026-04-10T09:00:00",
  "endDateTime": "2026-04-10T11:00:00",
  "purpose": "Team meeting for project discussion",
  "expectedAttendees": 10,
  "status": "PENDING",
  "adminNotes": null,
  "reviewedByUserId": null,
  "reviewedByUserName": null,
  "reviewedAt": null,
  "createdAt": "2026-04-06T14:30:00",
  "updatedAt": "2026-04-06T14:30:00"
}
```

**Error Response (409 Conflict):**

```json
{
  "timestamp": "2026-04-06T14:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "The resource is already booked for the selected time period. Conflicting booking(s) exist.",
  "path": "/api/bookings"
}
```

---

### 4. Get My Bookings

**GET** `/bookings/my-bookings`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "resourceId": 1,
    "resourceName": "Lecture Hall A1",
    "userId": 2,
    "userFullName": "Regular User",
    "startDateTime": "2026-04-10T09:00:00",
    "endDateTime": "2026-04-10T11:00:00",
    "purpose": "Team meeting for project discussion",
    "expectedAttendees": 10,
    "status": "PENDING",
    "adminNotes": null,
    "createdAt": "2026-04-06T14:30:00",
    "updatedAt": "2026-04-06T14:30:00"
  }
]
```

---

### 5. Get All Bookings (Admin Only)

**GET** `/bookings`  
**GET** `/bookings?status=PENDING` (with filter)

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response:** Array of all bookings

---

### 6. Get Booking by ID

**GET** `/bookings/{id}`

**Headers:**

```
Authorization: Bearer <token>
```

**Example:** `GET /bookings/1`

---

### 7. Approve Booking (Admin Only)

**PUT** `/bookings/{id}/approve`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "adminNotes": "Approved for educational purposes"
}
```

**Response:**

```json
{
  "id": 1,
  "status": "APPROVED",
  "adminNotes": "Approved for educational purposes",
  "reviewedByUserId": 1,
  "reviewedByUserName": "Admin User",
  "reviewedAt": "2026-04-06T15:00:00",
  ...
}
```

---

### 8. Reject Booking (Admin Only)

**PUT** `/bookings/{id}/reject`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "adminNotes": "Resource unavailable for maintenance"
}
```

---

### 9. Cancel Booking

**PUT** `/bookings/{id}/cancel`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": 1,
  "status": "CANCELLED",
  ...
}
```

---

### 10. Delete Booking

**DELETE** `/bookings/{id}`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Booking deleted successfully"
}
```

---

## Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created                              |
| 400         | Bad Request (validation error)       |
| 401         | Unauthorized (invalid/missing token) |
| 403         | Forbidden (insufficient permissions) |
| 404         | Not Found                            |
| 409         | Conflict (booking conflict)          |
| 500         | Internal Server Error                |

---

## Testing Workflow

### As Regular User:

1. Login with `user@smartcampus.com / user123`
2. Create a booking
3. View your bookings
4. Cancel a booking (if needed)

### As Admin:

1. Login with `admin@smartcampus.com / admin123`
2. Get all bookings (filter by PENDING)
3. Approve or reject pending bookings
4. View all bookings with different status filters

---

## Validation Rules

- Start date/time must be in the future
- End date/time must be after start date/time
- Maximum booking duration: 7 days
- Expected attendees: 1-1000
- Purpose: Required, max 500 characters
- Admin notes: Required for approval/rejection, max 500 characters

---

## Importing to Postman

1. Create a new Postman Collection
2. Add the endpoints above as requests
3. Create an environment variable `{{token}}` for authentication
4. Use the login response to set the token variable
5. Add `Authorization: Bearer {{token}}` to all protected endpoints
