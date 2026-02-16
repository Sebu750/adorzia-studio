# Integration Patterns

<cite>
**Referenced Files in This Document**
- [client.ts](file://src/integrations/supabase/client.ts)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts)
- [types.ts](file://src/integrations/supabase/types.ts)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts)
- [cdn-image.ts](file://src/lib/cdn-image.ts)
- [image-processing.ts](file://src/lib/image-processing.ts)
- [images.ts](file://src/lib/images.ts)
- [EnhancedErrorBoundary.tsx](file://src/components/EnhancedErrorBoundary.tsx)
- [ErrorBoundary.tsx](file://src/components/ErrorBoundary.tsx)
- [api-deduplication.ts](file://src/lib/api-deduplication.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the integration patterns used by the Adorzia platform to connect with external services. It focuses on:
- Supabase client initialization, authentication flows, and database operations
- Serverless functions for business logic (payment processing, email services, data transformations)
- Stripe integration for subscriptions and payments via webhooks and checkout
- Cloud-based image optimization and CDN delivery
- Error handling, retry mechanisms, and fallback strategies
- Webhook integration patterns, real-time event handling, and cross-system consistency
- API gateway patterns abstracted behind clean component interfaces

## Project Structure
The integration surface spans client-side Supabase clients, serverless functions, and image processing utilities. The serverless functions are organized under the Supabase Functions directory and expose REST-like endpoints for payment, email, marketplace operations, and Stripe webhooks.

```mermaid
graph TB
subgraph "Client-Side"
A["React App"]
B["Supabase Client<br/>client.ts"]
C["Admin Supabase Client<br/>admin-client.ts"]
D["CDN Image Utils<br/>cdn-image.ts"]
end
subgraph "Serverless Functions"
E["Stripe Webhook<br/>stripe-webhook/index.ts"]
F["Create Checkout<br/>create-checkout/index.ts"]
G["Customer Portal<br/>customer-portal/index.ts"]
H["Transactional Email<br/>send-transactional/index.ts"]
I["Marketplace Orders<br/>marketplace-orders/index.ts"]
end
subgraph "External Services"
S["Stripe"]
R["Resend"]
X["Supabase DB/Storage"]
end
A --> B
A --> C
A --> D
B --> X
C --> X
D --> X
F --> S
G --> S
E --> S
E --> X
H --> R
H --> X
I --> X
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)

**Section sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)

## Core Components
- Supabase Clients
  - Standard client with local storage persistence and token refresh
  - Admin client with isolated storage keys and independent sessions
- Serverless Functions
  - Stripe checkout creation and customer portal session management
  - Stripe webhook for purchase lifecycle events
  - Transactional email sending via Resend with logging
  - Marketplace order listing, detail retrieval, and cancellation with inventory restoration
- Image Delivery and Processing
  - CDN URL generation with transformations and responsive srcset
  - Browser format detection and fallback strategies
  - Local caching of failed image fallbacks
  - Optional watermarking for internal assets

**Section sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [types.ts](file://src/integrations/supabase/types.ts#L1-L800)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [image-processing.ts](file://src/lib/image-processing.ts#L1-L82)

## Architecture Overview
The platform uses Supabase as the primary backend, with serverless functions bridging to external services (Stripe, Resend) and performing privileged operations (service role access). The client app interacts with Supabase through typed clients and uses CDN helpers for image delivery.

```mermaid
sequenceDiagram
participant U as "User"
participant FE as "Frontend"
participant SC as "Supabase Client"
participant SF as "Serverless Function"
participant ST as "Stripe"
participant SB as "Supabase DB"
U->>FE : "Initiate subscription"
FE->>SC : "Authenticate user"
FE->>SF : "POST /create-checkout (Bearer token)"
SF->>SC : "getUser(token)"
SF->>ST : "Create Checkout Session"
ST-->>SF : "Checkout URL"
SF-->>FE : "Checkout URL"
FE-->>U : "Redirect to Stripe"
ST-->>SF : "Webhook : checkout.session.completed"
SF->>SB : "Update purchase + profile (service role)"
SB-->>SF : "OK"
SF-->>FE : "Event processed"
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

## Detailed Component Analysis

### Supabase Client Initialization and Authentication
- Standard client
  - Initializes with Vite environment variables for URL and publishable key
  - Configures local storage-backed persistence, session persistence, and automatic token refresh
- Admin client
  - Uses a separate storage adapter with an admin-specific prefix to keep admin sessions independent
  - Provides isolated storage keys and session persistence for admin apps

```mermaid
flowchart TD
Start(["Initialize Supabase Client"]) --> LoadEnv["Load VITE_SUPABASE_URL<br/>and VITE_SUPABASE_PUBLISHABLE_KEY"]
LoadEnv --> CreateClient["createClient(URL, KEY, { auth: { storage, persistSession, autoRefreshToken } })"]
CreateClient --> Ready["Client Ready for Auth and DB Ops"]
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)

**Section sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [types.ts](file://src/integrations/supabase/types.ts#L1-L800)

### Stripe Integration: Payment Processing and Webhooks
- Create checkout session
  - Validates Bearer token via Supabase auth
  - Creates Stripe customer if needed
  - Builds a subscription checkout session with metadata and success/cancel URLs
- Customer portal
  - Retrieves user via Supabase auth
  - Finds or errors if no Stripe customer exists
  - Creates a billing portal session for managing subscriptions
- Stripe webhook
  - Verifies signatures using a secret
  - Uses service role Supabase client to bypass RLS
  - Handles checkout.session.completed and checkout.session.expired/canceled
  - Updates purchase records and user profiles accordingly

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant CF as "create-checkout"
participant CP as "customer-portal"
participant SW as "stripe-webhook"
participant ST as "Stripe"
participant SB as "Supabase"
FE->>CF : "Create checkout session"
CF->>ST : "Create session"
ST-->>CF : "Session URL"
CF-->>FE : "Session URL"
FE->>CP : "Open customer portal"
CP->>ST : "Create portal session"
ST-->>CP : "Portal URL"
CP-->>FE : "Portal URL"
ST-->>SW : "Webhook event"
SW->>SB : "Update foundation purchases + profiles"
SB-->>SW : "OK"
```

**Diagram sources**
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

**Section sources**
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

### Email Service Integration: Transactional Emails
- Endpoint validates authorization and extracts type, recipient, and data
- Sends email via Resend with a standardized subject and HTML body
- Logs email events to Supabase for audit and monitoring

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant TF as "send-transactional"
participant RS as "Resend"
participant SB as "Supabase"
FE->>TF : "Send transactional email (type, to, data)"
TF->>RS : "emails.send()"
RS-->>TF : "Message ID"
TF->>SB : "Insert email_log"
SB-->>TF : "OK"
TF-->>FE : "Success"
```

**Diagram sources**
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)

**Section sources**
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)

### Marketplace Orders: Data Transformations and Business Logic
- Enforces authorization via Bearer token
- Resolves customer ID from Supabase
- Supports listing orders with pagination and filtering, retrieving details, and cancellation with inventory restoration

```mermaid
flowchart TD
Req["Incoming Request"] --> Auth["Verify Bearer Token"]
Auth --> |Valid| ResolveCustomer["Resolve marketplace_customer.id"]
Auth --> |Invalid| Err401["Return 401"]
ResolveCustomer --> Action{"Action"}
Action --> |list| ListOrders["Fetch orders with pagination"]
Action --> |detail| OrderDetail["Fetch order + items with product details"]
Action --> |cancel| CancelOrder["Validate status, update to cancelled, restore inventory"]
ListOrders --> Resp["Return orders + pagination"]
OrderDetail --> Resp
CancelOrder --> Resp
```

**Diagram sources**
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)

**Section sources**
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)

### Cloudinary/CDN Integration: Image Optimization and Delivery
- CDN URL generation with transformations (width, height, quality, format, fit)
- Responsive srcset generation for multiple viewport widths
- Presets for product and designer images
- Lazy loading with native loading or Intersection Observer fallback
- Preload hints for critical images
- Browser format detection (AVIF/WebP/JPEG)
- Fallback strategies for missing or external images, including Unsplash optimization and placeholder images
- Timeout-based fallback resolution and local cache of failed fallbacks

```mermaid
flowchart TD
Src["Image Source"] --> CheckEmpty{"Empty or Placeholder?"}
CheckEmpty --> |Yes| Fallback["Return Unsplash placeholder"]
CheckEmpty --> |No| CheckUnsplash{"Is Unsplash URL?"}
CheckUnsplash --> |Yes| OptimizeUnsplash["Add optimization params (w,q,auto,fit)"]
CheckUnsplash --> |No| CheckFullURL{"Is Full CDN URL?"}
CheckFullURL --> |Yes| ReturnURL["Return as-is"]
CheckFullURL --> |No| BuildTransform["Build Supabase ImgProxy URL with params"]
OptimizeUnsplash --> ReturnURL
BuildTransform --> ReturnURL
```

**Diagram sources**
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)

**Section sources**
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [images.ts](file://src/lib/images.ts#L1-L95)
- [image-processing.ts](file://src/lib/image-processing.ts#L1-L82)

### API Gateway Patterns and Clean Interfaces
- Serverless functions act as gateways for external services:
  - Stripe checkout and customer portal endpoints
  - Transactional email endpoint
  - Marketplace order operations
- Each function:
  - Validates CORS and preflight OPTIONS
  - Authenticates callers via Bearer tokens against Supabase
  - Uses service role Supabase client for privileged DB operations
  - Returns structured JSON responses with appropriate status codes
- Frontend consumes these endpoints through typed Supabase clients and utility functions

**Section sources**
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)

## Dependency Analysis
- Supabase clients depend on environment variables and local storage for auth state
- Serverless functions depend on Supabase service role keys for privileged DB access and external secrets for Stripe and Resend
- Frontend depends on Supabase clients for auth and DB operations and on CDN utilities for image delivery
- Webhooks rely on signed events from Stripe to maintain integrity and update state consistently

```mermaid
graph LR
FE["Frontend"] --> SC["Supabase Client"]
FE --> IMG["CDN Image Utils"]
SC --> SB["Supabase DB"]
IMG --> SB
CO["create-checkout"] --> ST["Stripe"]
CP["customer-portal"] --> ST
SW["stripe-webhook"] --> ST
SW --> SB
TE["send-transactional"] --> RS["Resend"]
TE --> SB
MO["marketplace-orders"] --> SB
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

**Section sources**
- [client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L1-L305)
- [create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

## Performance Considerations
- Image optimization
  - Prefer WebP/AVIF when supported; degrade gracefully to JPEG
  - Use responsive srcset and lazy loading to improve LCP and reduce bandwidth
  - Preload critical images to minimize render blocking
- Request deduplication
  - Prevent duplicate network calls for the same operation using a deduplication utility
- Serverless cold starts
  - Keep functions small and avoid heavy initializations
  - Reuse connections where possible (e.g., Stripe SDK instances)
- Database queries
  - Use pagination and selective field selection for order listings
  - Apply filters early to reduce payload sizes

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Error boundaries
  - EnhancedErrorBoundary captures errors, logs diagnostics, and allows retry or reload
  - ErrorBoundary provides a simpler fallback UI with retry
- API deduplication
  - Detects duplicate in-flight requests and logs potential infinite loops
- Stripe webhook
  - Validates signature and environment configuration; logs detailed errors and returns structured responses
- Image fallbacks
  - Timeout-based fallback resolution and local cache of failed images to avoid repeated failures
  - Unsplash fallback with optimization parameters and placeholder fallback

**Section sources**
- [EnhancedErrorBoundary.tsx](file://src/components/EnhancedErrorBoundary.tsx#L1-L169)
- [ErrorBoundary.tsx](file://src/components/ErrorBoundary.tsx#L1-L40)
- [api-deduplication.ts](file://src/lib/api-deduplication.ts#L1-L65)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [cdn-image.ts](file://src/lib/cdn-image.ts#L240-L305)

## Conclusion
The Adorzia platform integrates external services through a cohesive pattern:
- Typed Supabase clients for authentication and database operations
- Serverless functions as secure gateways to Stripe and Resend, with service role access for privileged DB updates
- CDN utilities for high-performance image delivery with robust fallbacks
- Comprehensive error handling and observability via error boundaries and logging
- Webhook-driven consistency for payment lifecycles and order management

These patterns enable scalable, maintainable, and resilient integrations across distributed systems.