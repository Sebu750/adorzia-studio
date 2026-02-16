# Serverless Functions Overview

<cite>
**Referenced Files in This Document**
- [supabase/functions/deno.json](file://supabase/functions/deno.json)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json)
- [supabase/functions/profile-management/deno.json](file://supabase/functions/profile-management/deno.json)
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts)
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
This document explains the Supabase serverless function architecture powered by the Deno runtime. It covers the deployment model, execution environment, cold start optimization strategies, Deno configuration and import maps, dependency management, function lifecycle, error handling, logging, monitoring, security, rate limiting, and performance optimization. It also provides examples of function structure, parameter handling, and response formatting across multiple real-world functions.

## Project Structure
Supabase serverless functions live under the supabase/functions directory. Each function is a self-contained folder with an index.ts entrypoint and optional Deno configuration. A shared Deno configuration and import map define global settings and external module resolution.

```mermaid
graph TB
Root["supabase/functions/"]
SharedCfg["deno.json<br/>shared config"]
ImportMap["import_map.json<br/>external imports"]
FuncA["profile-management/<br/>deno.json + index.ts"]
FuncB["send-transactional/<br/>index.ts"]
FuncC["stripe-webhook/<br/>index.ts"]
FuncD["marketplace-orders/<br/>index.ts"]
FuncE["broadcast-notification/<br/>index.ts"]
FuncF["manage-admin/<br/>index.ts"]
FuncG["verify-authenticity/<br/>index.ts"]
FuncH["create-checkout/<br/>index.ts"]
FuncI["customer-portal/<br/>index.ts"]
FuncJ["marketplace-checkout/<br/>index.ts"]
Root --> SharedCfg
Root --> ImportMap
Root --> FuncA
Root --> FuncB
Root --> FuncC
Root --> FuncD
Root --> FuncE
Root --> FuncF
Root --> FuncG
Root --> FuncH
Root --> FuncI
Root --> FuncJ
```

**Diagram sources**
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/profile-management/deno.json](file://supabase/functions/profile-management/deno.json#L1-L7)
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L1-L185)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L149)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L1-L148)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L274)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L1-L318)

**Section sources**
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/profile-management/deno.json](file://supabase/functions/profile-management/deno.json#L1-L7)

## Core Components
- Deno runtime and HTTP server: Functions use Deno’s standard http/server serve to bind handlers to requests.
- Supabase client: All functions initialize a Supabase client using environment variables for URLs and keys.
- CORS handling: Functions consistently handle preflight OPTIONS and set Access-Control-Allow-* headers.
- Request parsing: Functions parse JSON bodies and extract query parameters or headers.
- Error handling: Centralized try/catch blocks return structured JSON errors with appropriate HTTP status codes.
- Logging: Functions log meaningful events and errors to aid debugging and monitoring.
- External dependencies: Functions import Stripe, Resend, and Supabase clients via ESM imports defined in import_map.json.

Examples of function structure and patterns are visible across multiple functions, including:
- Profile management: validates inputs, checks admin privileges, updates database records, and logs actions.
- Transactional emails: authenticates via Authorization header, sends emails via Resend, and logs outcomes.
- Stripe webhooks: verifies signatures, updates purchase records, and adjusts user profiles.
- Marketplace orders: authenticates users, lists orders, fetches details, and cancels orders with inventory adjustments.
- Broadcast notifications: verifies admin roles and inserts notifications in batches.
- Admin management: enforces role-based access and supports self-service updates and admin creation.
- Authenticity verification: public verification and certificate retrieval endpoints.
- Checkout and customer portal: creates Stripe sessions and portal sessions.
- Marketplace checkout: constructs sessions, calculates shipping, and creates orders.

**Section sources**
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L1-L185)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L229)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L149)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L1-L148)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L274)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L1-L318)

## Architecture Overview
The serverless functions follow a consistent pattern:
- Entry point: Each function exports a handler that accepts a Request and returns a Response.
- Authentication: Many functions validate Authorization headers and use Supabase auth to verify tokens.
- Supabase integration: Functions use the Supabase client to query and mutate data, often bypassing Row Level Security (RLS) by using a service role key.
- External services: Functions integrate with Stripe for payments and Resend for transactional emails.
- CORS: Functions uniformly handle preflight requests and set CORS headers.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Edge as "Deno Edge Function"
participant Supabase as "Supabase"
participant Stripe as "Stripe"
participant Resend as "Resend"
Client->>Edge : "HTTP Request"
Edge->>Edge : "Parse headers/body"
Edge->>Supabase : "auth.getUser() / queries"
alt Payment flow
Edge->>Stripe : "createCheckoutSession()"
Stripe-->>Edge : "session.url"
else Email flow
Edge->>Resend : "emails.send()"
Resend-->>Edge : "messageId"
else Webhook
Edge->>Stripe : "constructEvent(signature)"
Stripe-->>Edge : "event"
Edge->>Supabase : "update purchase/profile"
end
Edge-->>Client : "JSON Response + CORS headers"
```

**Diagram sources**
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L74)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L160)

## Detailed Component Analysis

### Deno Configuration and Import Maps
- Global Deno configuration: Defines the import map path for resolving external modules.
- Import map: Declares ESM imports for @supabase/supabase-js and stripe.
- Per-function Deno config: Some functions include a local deno.json to enable nodeModulesDir or set library metadata.

```mermaid
flowchart TD
A["supabase/functions/deno.json"] --> B["import_map.json"]
C["per-function deno.json"] --> D["nodeModulesDir/auto"]
C --> E["lib metadata"]
B --> F["@supabase/supabase-js"]
B --> G["stripe"]
```

**Diagram sources**
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/profile-management/deno.json](file://supabase/functions/profile-management/deno.json#L1-L7)

**Section sources**
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/profile-management/deno.json](file://supabase/functions/profile-management/deno.json#L1-L7)

### Function Lifecycle and Execution Environment
- Cold start: First request to a function triggers cold start. To minimize cold start impact, keep functions small, avoid heavy initialization, and reuse connections where possible.
- Request handling: Functions receive a Request object, parse headers and body, and return a Response with appropriate status and headers.
- CORS preflight: Functions return 204/200 for OPTIONS with CORS headers.
- Environment variables: Functions read SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, and provider-specific keys (e.g., STRIPE_SECRET_KEY, RESEND_API_KEY_*).

```mermaid
flowchart TD
Start(["Function Entry"]) --> Preflight{"Method == OPTIONS?"}
Preflight --> |Yes| ReturnOK["Return 204/ok + CORS"]
Preflight --> |No| Parse["Parse headers/body"]
Parse --> Validate["Validate inputs"]
Validate --> Ok{"Valid?"}
Ok --> |No| Return400["Return 400 JSON"]
Ok --> |Yes| Auth["Authenticate via Supabase"]
Auth --> AuthOk{"Authenticated?"}
AuthOk --> |No| Return401["Return 401 JSON"]
AuthOk --> |Yes| Process["Process business logic"]
Process --> Update["Update DB / Call external APIs"]
Update --> Return200["Return 200 JSON + CORS"]
ReturnOK --> End(["Exit"])
ReturnOK --> End
Return400 --> End
Return401 --> End
Return200 --> End
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L24-L228)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L8-L148)

**Section sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L24-L228)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L8-L148)

### Error Handling and Logging
- Try/catch blocks wrap request processing to ensure structured error responses.
- Console logging is used for operational visibility; include contextual details for debugging.
- Functions return JSON bodies with an error field and appropriate HTTP status codes.

```mermaid
flowchart TD
A["Request Received"] --> B["Try block"]
B --> C["Business Logic"]
C --> D{"Error?"}
D --> |No| E["Success Response"]
D --> |Yes| F["Catch(error)"]
F --> G["Log error"]
G --> H["Return 500 JSON"]
E --> I["Exit"]
H --> I
```

**Diagram sources**
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L53-L159)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L220-L227)

**Section sources**
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L53-L159)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L220-L227)

### Parameter Handling and Response Formatting
- Query parameters: Functions use URLSearchParams to extract filters and pagination options.
- JSON body: Functions await req.json() to parse request payloads.
- Response helpers: Several functions define helper functions to ensure consistent CORS headers and JSON formatting.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Func as "Function Handler"
participant Supabase as "Supabase"
Client->>Func : "GET /orders?action=list&page=1&limit=10"
Func->>Func : "parse query params"
Func->>Supabase : "auth.getUser(token)"
Supabase-->>Func : "user"
Func->>Supabase : "select orders with pagination"
Supabase-->>Func : "orders + count"
Func-->>Client : "200 JSON { orders, pagination }"
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L58-L98)

**Section sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L58-L98)

### Security Considerations
- Authorization: Functions require Authorization headers and validate tokens via Supabase auth.
- Role enforcement: Admin-only functions verify roles using a Supabase client initialized with a service role key.
- Secrets: Functions read sensitive keys from environment variables (e.g., SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, RESEND_API_KEY_*).
- CORS: Functions set Access-Control-Allow-Origin and related headers to control cross-origin access.
- Webhook security: Stripe webhooks verify signatures using endpoint secrets before processing.

```mermaid
flowchart TD
A["Incoming Request"] --> B["Check Authorization header"]
B --> C{"Token valid?"}
C --> |No| D["401 Unauthorized"]
C --> |Yes| E["Fetch user roles via service role client"]
E --> F{"Has required role?"}
F --> |No| G["403 Forbidden"]
F --> |Yes| H["Proceed with action"]
```

**Diagram sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L39-L62)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L37-L61)

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L39-L62)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L37-L61)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L14-L36)

### Rate Limiting and Performance Optimization
- Batch operations: Functions insert notifications in batches to avoid payload size limits and timeouts.
- Pagination: Functions implement pagination to limit result sets and reduce latency.
- Conditional logic: Functions short-circuit early when inputs are invalid to minimize unnecessary work.
- Minimal initialization: Keep imports and initialization inside the handler to reduce cold start overhead.
- Reuse Supabase client: Initialize the client once per request if needed, but prefer lightweight initialization.

```mermaid
flowchart TD
Start(["Request"]) --> Validate["Validate inputs"]
Validate --> Valid{"Valid?"}
Valid --> |No| Return400["Return 400"]
Valid --> |Yes| Auth["Authenticate"]
Auth --> AuthOK{"Authorized?"}
AuthOK --> |No| Return401["Return 401"]
AuthOK --> |Yes| Process["Process business logic"]
Process --> Batch{"Batch insert?"}
Batch --> |Yes| Loop["Loop with batch size"]
Batch --> |No| Single["Single insert/update"]
Loop --> Single
Single --> Return200["Return 200"]
Return400 --> End(["Exit"])
Return401 --> End
Return200 --> End
```

**Diagram sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L113-L128)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L168-L174)

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L113-L128)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L168-L174)

### Example Functions and Patterns

#### Profile Management
- Validates required fields and action type.
- Verifies admin privileges against the database.
- Updates profile records and logs actions.

```mermaid
sequenceDiagram
participant Client as "Client"
participant PM as "profile-management"
participant DB as "Supabase"
Client->>PM : "POST {userId, action, adminId}"
PM->>DB : "select admin role"
DB-->>PM : "role=admin?"
PM->>DB : "update profile + insert log"
DB-->>PM : "OK"
PM-->>Client : "200 JSON {success}"
```

**Diagram sources**
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L20-L170)

**Section sources**
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L20-L170)

#### Transactional Emails
- Requires Authorization header.
- Sends email via Resend and logs metadata.

```mermaid
sequenceDiagram
participant Client as "Client"
participant TX as "send-transactional"
participant Resend as "Resend"
participant DB as "Supabase"
Client->>TX : "POST {type, to, data}"
TX->>Resend : "emails.send()"
Resend-->>TX : "messageId"
TX->>DB : "insert email_logs"
TX-->>Client : "200 JSON {success}"
```

**Diagram sources**
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L49-L56)

**Section sources**
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L49-L56)

#### Stripe Webhooks
- Verifies webhook signature.
- Updates purchase records and user profiles.

```mermaid
sequenceDiagram
participant Stripe as "Stripe"
participant WH as "stripe-webhook"
participant DB as "Supabase"
Stripe->>WH : "webhook event"
WH->>WH : "verify signature"
WH->>DB : "update foundation_purchases"
DB-->>WH : "OK"
WH->>DB : "update profiles"
DB-->>WH : "OK"
WH-->>Stripe : "200"
```

**Diagram sources**
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L29-L120)

**Section sources**
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L29-L120)

#### Marketplace Orders
- Authenticates user, lists orders, fetches details, and cancels orders with inventory adjustments.

```mermaid
sequenceDiagram
participant Client as "Client"
participant MO as "marketplace-orders"
participant DB as "Supabase"
Client->>MO : "GET /orders?action=cancel&order_id"
MO->>DB : "auth.getUser(token)"
DB-->>MO : "user"
MO->>DB : "select order + items"
DB-->>MO : "order"
MO->>DB : "update order + restore inventory"
DB-->>MO : "updated order"
MO-->>Client : "200 JSON {order}"
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L150-L213)

**Section sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L150-L213)

#### Broadcast Notifications
- Verifies admin role and broadcasts notifications in batches.

```mermaid
sequenceDiagram
participant Client as "Client"
participant BN as "broadcast-notification"
participant DB as "Supabase"
Client->>BN : "POST {type, message}"
BN->>DB : "getUser() + role check"
DB-->>BN : "admin"
BN->>DB : "select users"
DB-->>BN : "user_ids"
BN->>DB : "insert notifications (batch)"
DB-->>BN : "OK"
BN-->>Client : "200 JSON {count}"
```

**Diagram sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L74-L128)

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L74-L128)

#### Manage Admin
- Enforces role-based access and supports self-service updates and admin creation.

```mermaid
sequenceDiagram
participant Client as "Client"
participant MA as "manage-admin"
participant DB as "Supabase"
Client->>MA : "POST {action, targetUserId, ...}"
MA->>DB : "getUser() + role check"
DB-->>MA : "admin/superadmin"
MA->>DB : "auth.admin.updateUserById() or createUser()"
DB-->>MA : "OK"
MA-->>Client : "200 JSON {result}"
```

**Diagram sources**
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L79-L133)

**Section sources**
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L79-L133)

#### Verify Authenticity
- Public verification endpoint and certificate retrieval; admin-only generation requires Authorization.

```mermaid
sequenceDiagram
participant Client as "Client"
participant VA as "verify-authenticity"
participant DB as "Supabase"
Client->>VA : "POST {action : verify, verification_code}"
VA->>DB : "select certificate"
DB-->>VA : "certificate"
VA->>DB : "update verification stats"
DB-->>VA : "OK"
VA-->>Client : "200 JSON {verified, certificate}"
```

**Diagram sources**
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L50-L133)

**Section sources**
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L50-L133)

#### Checkout and Customer Portal
- Creates Stripe checkout sessions and billing portal sessions.

```mermaid
sequenceDiagram
participant Client as "Client"
participant CC as "create-checkout"
participant Stripe as "Stripe"
Client->>CC : "POST {priceId}"
CC->>Stripe : "createCheckoutSession()"
Stripe-->>CC : "session.url"
CC-->>Client : "200 JSON {url}"
```

**Diagram sources**
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L53-L68)

**Section sources**
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L53-L68)

#### Marketplace Checkout
- Constructs sessions, calculates shipping, and creates orders.

```mermaid
sequenceDiagram
participant Client as "Client"
participant MC as "marketplace-checkout"
participant Stripe as "Stripe"
participant DB as "Supabase"
Client->>MC : "POST {action : create_session, ...}"
MC->>DB : "fetch cart + products"
DB-->>MC : "cart + products"
MC->>Stripe : "createCheckoutSession()"
Stripe-->>MC : "session.url"
MC-->>Client : "200 JSON {session_id, url, order_number}"
```

**Diagram sources**
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L52-L173)

**Section sources**
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L52-L173)

## Dependency Analysis
Functions depend on:
- Deno standard library for HTTP server and utilities.
- Supabase client for database and auth operations.
- Stripe for payment processing.
- Resend for transactional emails.

```mermaid
graph TB
PM["profile-management/index.ts"] --> Supabase["@supabase/supabase-js"]
TX["send-transactional/index.ts"] --> Supabase
TX --> Resend["resend"]
SW["stripe-webhook/index.ts"] --> Stripe["stripe"]
SW --> Supabase
MO["marketplace-orders/index.ts"] --> Supabase
BN["broadcast-notification/index.ts"] --> Supabase
MA["manage-admin/index.ts"] --> Supabase
VA["verify-authenticity/index.ts"] --> Supabase
CC["create-checkout/index.ts"] --> Stripe
CC --> Supabase
CP["customer-portal/index.ts"] --> Stripe
CP --> Supabase
MC["marketplace-checkout/index.ts"] --> Stripe
MC --> Supabase
```

**Diagram sources**
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L1-L6)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L2)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L2)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L2)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L1)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L1-L1)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L2)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L2)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L2)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L1-L3)

**Section sources**
- [supabase/functions/profile-management/index.ts](file://supabase/functions/profile-management/index.ts#L1-L6)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L2)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L1-L2)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L2)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L1)
- [supabase/functions/manage-admin/index.ts](file://supabase/functions/manage-admin/index.ts#L1-L1)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L2)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L2)
- [supabase/functions/customer-portal/index.ts](file://supabase/functions/customer-portal/index.ts#L1-L2)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L1-L3)

## Performance Considerations
- Cold start mitigation:
  - Keep function bundles minimal.
  - Avoid heavy synchronous initialization.
  - Reuse resources across invocations when safe.
- Network efficiency:
  - Use Supabase RPCs and joins to reduce round trips.
  - Batch database writes to minimize latency.
- Input validation:
  - Fail fast on missing or invalid parameters.
- Pagination and limits:
  - Apply reasonable limits to prevent timeouts and excessive memory usage.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Missing Authorization header: Functions return 401 Unauthorized; ensure clients pass a valid Bearer token.
- Invalid or expired tokens: Auth getUser fails; re-authenticate the user.
- Insufficient permissions: Role checks fail; verify user roles in the database.
- Missing environment variables: Functions log critical errors and return 500; ensure all required secrets are configured.
- Stripe signature verification failures: Webhooks reject unsigned or tampered events; verify endpoint secrets.
- Database errors: Functions log detailed errors; inspect logs for SQL errors and adjust queries accordingly.

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L16-L62)
- [supabase/functions/stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts#L14-L36)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L220-L227)

## Conclusion
The Supabase serverless functions architecture leverages Deno for efficient, secure, and scalable edge computing. By following consistent patterns—authentication, role enforcement, CORS handling, structured error responses, and robust logging—functions deliver reliable functionality across commerce, communications, and administrative workflows. Optimizing for cold starts, batching operations, and validating inputs ensures high performance and resilience.