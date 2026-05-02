# Notification System Architecture & Optimization Strategy

## Introduction
This document outlines the design and scaling strategies for a high-performance notification system. The goal is to provide reliable, real-time updates to students while maintaining high availability and low latency across all services.

## Core Objectives
- **Reliability**: Zero-loss message delivery even under high load.
- **Scalability**: Decoupled architecture using message queues for horizontal scaling.
- **Optimization**: Strategic indexing and caching for sub-millisecond data retrieval.

## Stage 1: API Design
The system provides a RESTful API for managing user notifications.
- `POST /notifications`: Create and send a new notification.
- `GET /notifications`: Retrieve a list of notifications for the authenticated user.
- `DELETE /notifications/:id`: Mark a notification as deleted or dismissed.

## Stage 2: Database Design
We use **PostgreSQL** for persistence due to its support for complex queries and indexing.

### Table: `notifications`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `student_id` | Integer | ID of the student receiving the notification |
| `type` | String | Type of notification (e.g., PLACEMENT, RESULT, EVENT) |
| `message` | Text | The notification content |
| `is_read` | Boolean | Read status (default: false) |
| `created_at` | Timestamp | Time of creation |

## Stage 3: Query Optimization
### Problem
Slow retrieval for active notifications:
```sql
SELECT * FROM notifications 
WHERE student_id = 1042 AND is_read = false 
ORDER BY created_at DESC;
```
### Fix
Implement a compound index to cover filtering and sorting:
```sql
CREATE INDEX idx_notifications_student_read_created 
ON notifications(student_id, is_read, created_at DESC);
```

## Stage 4: Performance Strategies
- **Pagination**: We use cursor-based pagination to prevent "deep paging" performance hits.
- **Caching**: Recent notifications are cached in **Redis**. *Rationale: I chose Redis because its in-memory nature allows us to serve the most frequent "unread count" queries without touching the main database.*
- **Lazy Loading**: UI elements load details on demand to save bandwidth.

## Stage 5: Fix `notify_all`
### Problem
The initial `notify_all` implementation was sequential and brittle.
### Solution
- **Message Queue (Kafka)**: We decouple the notification trigger from the actual delivery. *Rationale: Using Kafka allows us to handle massive spikes in notifications (e.g., during a result release) without crashing the backend. It also provides built-in retry mechanisms if a downstream service fails.*

## Stage 6: Top 10 Notifications (Efficient Maintenance)
### The Challenge
Maintaining a real-time "Top 10" list as thousands of notifications pour in is a computational challenge.

### The Solution: Min-Heap
Instead of re-sorting the database, I implemented a **Min-Heap** approach. *Rationale: By maintaining a small, 10-element heap in memory, we can update the list in O(log 10) time. This ensures that the user's "Important" feed is always up-to-the-second without lag.*

### Ranking Logic
1. **Priority Level**: Placement (3) > Result (2) > Event (1).
2. **Recency**: If priorities are equal, the more recent `created_at` timestamp wins.
