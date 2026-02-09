# Phase 0 Data Model Design

This file defines conceptual model design before implementation.

## 1) Restaurant

Purpose: Top-level tenant boundary.

Fields:
- `_id`
- `name`
- `slug` (unique)
- `logoUrl`
- `contact`
- `address`
- `currency` (default `INR`)
- `taxConfig` (`cgst`, `sgst`, `serviceTax`, `inclusiveOrExclusive`)
- `tipConfig` (`enabled`, `defaultPercentOptions`)
- `paymentConfig` (`cashEnabled`, `onlineEnabled`, `provider`)
- `createdAt`, `updatedAt`

Indexes:
- `slug` unique

## 2) Table

Purpose: Physical table metadata and QR identity.

Fields:
- `_id`
- `restaurantId` (required)
- `tableNumber` (human-readable)
- `capacity`
- `qrToken` (secure random string)
- `isActive`
- `createdAt`, `updatedAt`

Indexes:
- compound unique: (`restaurantId`, `tableNumber`)
- unique: `qrToken`

## 3) MenuItem

Purpose: Restaurant menu catalog.

Fields:
- `_id`
- `restaurantId` (required)
- `name`
- `description`
- `category`
- `price`
- `imageUrl`
- `dietaryTags` (`veg`, `vegan`, `glutenFree`, etc.)
- `modifiers` (array of modifier groups)
- `isAvailable`
- `inventoryCount` (optional)
- `timeRules` (optional happy hours)
- `createdAt`, `updatedAt`

Indexes:
- (`restaurantId`, `category`)
- (`restaurantId`, `isAvailable`)

## 4) Session

Purpose: Temporary table ordering session.

Fields:
- `_id`
- `restaurantId` (required)
- `tableId` (required)
- `sessionToken` (secure token)
- `mode` (`collective` or `individual`)
- `participants` (array with name + joinedAt)
- `cartSnapshot` (items, person mapping)
- `status` (`active`, `checked_out`, `expired`)
- `expiresAt` (required TTL anchor)
- `createdAt`, `updatedAt`

Indexes:
- unique: `sessionToken`
- TTL: `expiresAt`
- (`restaurantId`, `tableId`, `status`)

## 5) Order

Purpose: Persisted placed order with lifecycle.

Fields:
- `_id`
- `restaurantId`
- `tableId`
- `sessionId`
- `orderNumber` (human-friendly)
- `items` (with modifiers and quantities)
- `personBreakdown` (for individual mode)
- `contact` (`mobile`, `email`)
- `status` (`received`, `preparing`, `ready`, `served`, `billed`, `paid`)
- `billing` (subtotal, taxes, tip, total)
- `payment` (`method`, `status`, `gatewayRef`)
- `placedAt`
- `createdAt`, `updatedAt`

Indexes:
- (`restaurantId`, `createdAt`)
- (`restaurantId`, `status`)
- unique per restaurant: (`restaurantId`, `orderNumber`)

## 6) OTP

Purpose: One-time verification records.

Fields:
- `_id`
- `restaurantId`
- `sessionId`
- `mobile` (or email if email OTP mode)
- `email`
- `otpHash`
- `attemptCount`
- `expiresAt`
- `verifiedAt` (nullable)
- `createdAt`

Indexes:
- TTL: `expiresAt`
- (`sessionId`, `mobile`, `email`)

## 7) AdminUser

Purpose: Restaurant-side access control.

Fields:
- `_id`
- `restaurantId`
- `fullName`
- `email` (unique per restaurant)
- `passwordHash`
- `role` (`owner`, `manager`, `kitchen`, `cashier`)
- `isActive`
- `lastLoginAt`
- `createdAt`, `updatedAt`

Indexes:
- unique compound: (`restaurantId`, `email`)
- (`restaurantId`, `role`)

## Relationship Summary

- One `Restaurant` has many `Table`, `MenuItem`, `Order`, and `AdminUser`.
- One `Table` has many temporary `Session` records over time.
- One `Session` can produce one or more `Order` records (if multiple rounds).
- `OTP` references a session and expires quickly via TTL.

## Multi-Tenant Rule (Critical)

Every query in backend services must be scoped by `restaurantId` to prevent cross-tenant leakage.
