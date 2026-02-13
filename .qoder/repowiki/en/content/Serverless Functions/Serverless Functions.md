# Serverless Functions

<cite>
**Referenced Files in This Document**
- [supabase/functions/deno.json](file://supabase/functions/deno.json)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts)
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts)
- [supabase/functions/marketplace-cart/index.ts](file://supabase/functions/marketplace-cart/index.ts)
- [supabase/functions/marketplace-products/index.ts](file://supabase/functions/marketplace-products/index.ts)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts)
- [supabase/functions/submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts)
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts)
- [supabase/functions/reset-monthly-tokens/index.ts](file://supabase/functions/reset-monthly-tokens/index.ts)
- [supabase/functions/generate-sitemap/index.ts](file://supabase/functions/generate-sitemap/index.ts)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts)
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
This document describes the serverless functions architecture powering the Adorzia marketplace, subscription, scoring, notifications, and team management features. It explains deployment strategy, business logic, security and access control, integration patterns, function lifecycle, error handling, logging, monitoring, performance optimization, cold start mitigation, and cost management strategies.

## Project Structure
The serverless functions are organized under the Supabase functions directory. Each function is a self-contained module exposing a Deno HTTP handler. Shared dependencies are declared via an import map and a Deno configuration file.

```mermaid
graph TB
subgraph "Supabase Functions"
A["award-style-credits/index.ts"]
B["award-team-badges/index.ts"]
C["broadcast-notification/index.ts"]
D["calculate-designer-commission/index.ts"]
E["calculate-designer-score/index.ts"]
F["check-subscription/index.ts"]
G["create-checkout/index.ts"]
H["customer-portal/index.ts"]
I["generate-sitemap/index.ts"]
J["manage-admin/index.ts"]
K["manage-founding/index.ts"]
L["manage-team/index.ts"]
M["marketplace-cart/index.ts"]
N["marketplace-checkout/index.ts"]
O["marketplace-orders/index.ts"]
P["marketplace-products/index.ts"]
Q["newsletter-subscribe/index.ts"]
R["newsletter-unsubscribe/index.ts"]
S["purchase-foundation-rank/index.ts"]
T["reset-monthly-tokens/index.ts"]
U["send-contact/index.ts"]
V["send-transactional/index.ts"]
W["submit-feedback/index.ts"]
X["submit-stylebox-entry/index.ts"]
Y["upload-portfolio-project/index.ts"]
Z["validate-team-eligibility/index.ts"]
AA["verify-authenticity/index.ts"]
end
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L226)
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts#L1-L223)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L1-L140)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L149)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/marketplace-cart/index.ts](file://supabase/functions/marketplace-cart/index.ts#L1-L322)
- [supabase/functions/marketplace-products/index.ts](file://supabase/functions/marketplace-products/index.ts#L1-L256)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L1-L142)
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts#L1-L180)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L262)
- [supabase/functions/reset-monthly-tokens/index.ts](file://supabase/functions/reset-monthly-tokens/index.ts#L1-L111)
- [supabase/functions/generate-sitemap/index.ts](file://supabase/functions/generate-sitemap/index.ts#L1-L136)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

**Section sources**
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)

## Core Components
- Supabase client initialization and environment usage across functions
- Stripe integration for checkout and subscription checks
- Resend integration for transactional emails
- CORS handling and standardized response headers
- Logging via console with structured steps
- Access control via Supabase Auth getUser and admin role checks

Key implementation patterns:
- Deno serve HTTP handlers with OPTIONS preflight support
- Supabase service role key for privileged operations
- Anon key for public endpoints where appropriate
- Error-first approach with standardized JSON responses

**Section sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L13-L226)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L14-L140)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L8-L149)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L14-L85)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L15-L70)
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)

## Architecture Overview
The serverless functions integrate with Supabase Auth, Storage, and Database, and third-party services (Stripe, Resend). Functions are deployed as Deno HTTP handlers and exposed via Supabase Edge Functions runtime.

```mermaid
graph TB
Client["Client Apps<br/>Web/Mobile"] --> Edge["Supabase Edge Functions Runtime"]
Edge --> Auth["Supabase Auth"]
Edge --> DB["Supabase Postgres"]
Edge --> Storage["Supabase Storage"]
Edge --> Stripe["Stripe API"]
Edge --> Resend["Resend API"]
subgraph "Functions"
F1["marketplace-orders"]
F2["marketplace-cart"]
F3["marketplace-products"]
F4["check-subscription"]
F5["create-checkout"]
F6["broadcast-notification"]
F7["send-transactional"]
F8["calculate-designer-score"]
F9["award-style-credits"]
F10["upload-portfolio-project"]
F11["submit-stylebox-entry"]
F12["verify-authenticity"]
F13["reset-monthly-tokens"]
F14["manage-team"]
F15["generate-sitemap"]
end
Edge --> F1
Edge --> F2
Edge --> F3
Edge --> F4
Edge --> F5
Edge --> F6
Edge --> F7
Edge --> F8
Edge --> F9
Edge --> F10
Edge --> F11
Edge --> F12
Edge --> F13
Edge --> F14
Edge --> F15
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L226)
- [supabase/functions/marketplace-cart/index.ts](file://supabase/functions/marketplace-cart/index.ts#L1-L322)
- [supabase/functions/marketplace-products/index.ts](file://supabase/functions/marketplace-products/index.ts#L1-L256)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L1-L140)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L149)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts#L1-L223)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts#L1-L180)
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [supabase/functions/submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L1-L142)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L262)
- [supabase/functions/reset-monthly-tokens/index.ts](file://supabase/functions/reset-monthly-tokens/index.ts#L1-L111)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)
- [supabase/functions/generate-sitemap/index.ts](file://supabase/functions/generate-sitemap/index.ts#L1-L136)

## Detailed Component Analysis

### Marketplace Orders
Handles listing, retrieving details, and cancellation of orders for authenticated users. It validates the user via Supabase Auth, fetches related order items, and restores inventory upon cancellation.

```mermaid
sequenceDiagram
participant C as "Client"
participant F as "marketplace-orders"
participant S as "Supabase"
participant P as "Stripe"
C->>F : "GET /orders?action=list|detail|cancel"
F->>S : "auth.getUser(token)"
S-->>F : "user"
F->>S : "fetch marketplace_customers"
alt "list"
F->>S : "select orders with pagination"
S-->>F : "orders + count"
F-->>C : "200 JSON"
else "detail"
F->>S : "select order by id/order_number"
F->>S : "join order_items + product"
S-->>F : "order + items"
F-->>C : "200 JSON"
else "cancel"
F->>S : "select order by id"
F->>S : "update status + restore inventory"
S-->>F : "updated order"
F-->>C : "200 JSON"
end
```

**Diagram sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L13-L226)

**Section sources**
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L18-L226)

### Marketplace Cart
Manages guest and authenticated carts, supports add/update/remove/clear actions, enriches items with product and designer data, and calculates subtotals.

```mermaid
flowchart TD
Start(["Request Received"]) --> Auth["Extract Authorization"]
Auth --> GetUser["getUser(token)"]
GetUser --> HasUser{"Has user?"}
HasUser --> |Yes| GetOrCreateCustomer["Get or Create Customer"]
HasUser --> |No| Continue["Continue without customer"]
GetOrCreateCustomer --> Action{"Action"}
Continue --> Action
Action --> |get| GetCart["Find cart by customer/session"]
GetCart --> Enrich["Enrich items with product/designer"]
Enrich --> ReturnCart["Return cart"]
Action --> |add| ValidateAdd["Validate product_id, fetch product"]
ValidateAdd --> AddItem["Add or update item"]
AddItem --> UpdateCart["Update items + subtotal"]
UpdateCart --> ReturnUpdated["Return updated cart"]
Action --> |update| ValidateUpdate["Find item and update quantity"]
ValidateUpdate --> ReturnUpdated
Action --> |remove| RemoveItem["Remove item"]
RemoveItem --> ReturnUpdated
Action --> |clear| ClearCart["Clear items and reset discount"]
ClearCart --> ReturnUpdated
ReturnCart --> End(["Response"])
ReturnUpdated --> End
```

**Diagram sources**
- [supabase/functions/marketplace-cart/index.ts](file://supabase/functions/marketplace-cart/index.ts#L13-L322)

**Section sources**
- [supabase/functions/marketplace-cart/index.ts](file://supabase/functions/marketplace-cart/index.ts#L18-L322)

### Marketplace Products
Provides product listings with filters, sorting, pagination, and product detail retrieval with related products and reviews. Also exposes categories and collections.

```mermaid
sequenceDiagram
participant C as "Client"
participant F as "marketplace-products"
participant S as "Supabase"
C->>F : "GET /products?action=list|detail|categories|collections"
alt "list"
F->>S : "select products with filters + pagination"
S-->>F : "products + count"
F-->>C : "200 JSON"
else "detail"
F->>S : "select product + designer + category"
F->>S : "increment view_count"
F->>S : "fetch related products + reviews"
S-->>F : "product + related + reviews"
F-->>C : "200 JSON"
else "categories/collections"
F->>S : "select filtered lists"
S-->>F : "lists"
F-->>C : "200 JSON"
end
```

**Diagram sources**
- [supabase/functions/marketplace-products/index.ts](file://supabase/functions/marketplace-products/index.ts#L13-L256)

**Section sources**
- [supabase/functions/marketplace-products/index.ts](file://supabase/functions/marketplace-products/index.ts#L18-L256)

### Subscription Management
- Check subscription: Verifies active Stripe subscription for a user, updates profile tier, and returns subscription status.
- Create checkout: Initiates a Stripe Checkout session for a selected price.

```mermaid
sequenceDiagram
participant C as "Client"
participant CS as "check-subscription"
participant ST as "Stripe"
participant SA as "Supabase Auth"
participant SD as "Supabase DB"
C->>CS : "GET /check-subscription"
CS->>SA : "getUser(token)"
SA-->>CS : "user"
CS->>ST : "list customers by email"
ST-->>CS : "customer"
CS->>ST : "list active subscriptions"
ST-->>CS : "subscriptions"
CS->>SD : "update profiles.subscription_tier"
CS-->>C : "200 JSON {subscribed, ...}"
participant CC as "create-checkout"
C->>CC : "POST /create-checkout {priceId}"
CC->>SA : "getUser(token)"
SA-->>CC : "user"
CC->>ST : "create checkout session"
ST-->>CC : "session.url"
CC-->>C : "200 JSON {url}"
```

**Diagram sources**
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L14-L140)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L14-L85)

**Section sources**
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L25-L140)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L24-L85)

### Scoring and Credits
- Designer score calculation: Aggregates stylebox, portfolio, publication, and selling metrics into a weighted score and upserts results.
- Award style credits: Awards SC based on difficulty or bonus, promotes rank if threshold reached, and sends notifications.

```mermaid
flowchart TD
Start(["calculate-designer-score"]) --> FetchSub["Fetch approved stylebox submissions"]
FetchSub --> ComputeSB["Compute stylebox score (weighted fallback)"]
ComputeSB --> FetchPort["Fetch approved portfolio items"]
FetchPort --> ComputePort["Compute portfolio score (+quality bonus)"]
ComputePort --> FetchPub["Fetch published portfolio publications"]
FetchPub --> ComputePub["Compute publication score (+quality rating)"]
ComputePub --> FetchSales["Fetch designer sales"]
FetchSales --> ComputeSell["Compute selling score by revenue tiers"]
ComputeSell --> Weight["Apply weights and upsert designer_scores"]
Weight --> End(["200 JSON"])
subgraph "award-style-credits"
AStart(["award-style-credits"]) --> Gen["Generate awarded SC (random or bonus)"]
Gen --> LoadProfile["Load profile + current SC/total"]
LoadProfile --> CheckPromo["Check rank upgrade threshold"]
CheckPromo --> UpdateProfile["Update SC, total, rank"]
UpdateProfile --> Notify["Insert notification"]
Notify --> AEnd(["200 JSON"])
end
```

**Diagram sources**
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts#L30-L223)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts#L46-L180)

**Section sources**
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts#L41-L223)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts#L57-L180)

### Notifications
- Broadcast notification: Admin-only endpoint to send system notifications to all active users, inserting records in batches.
- Send transactional: Sends transactional emails via Resend and logs outcomes.

```mermaid
sequenceDiagram
participant Admin as "Admin Client"
participant BN as "broadcast-notification"
participant SA as "Supabase Auth"
participant SD as "Supabase DB"
Admin->>BN : "POST /broadcast-notification {type,message,title}"
BN->>SA : "getUser()"
SA-->>BN : "user"
BN->>SD : "select user_roles (admin/superadmin)"
SD-->>BN : "role"
BN->>SD : "select profiles (limit ~1000)"
SD-->>BN : "users"
BN->>SD : "insert notifications (batched)"
SD-->>BN : "ok"
BN-->>Admin : "200 JSON {success,count}"
participant TX as "send-transactional"
Admin->>TX : "POST /send-transactional {type,to,data}"
TX->>SA : "getUser() (optional)"
TX->>Resend : "emails.send(...)"
Resend-->>TX : "result"
TX->>SD : "insert email_logs"
TX-->>Admin : "200 JSON {success,message_id}"
```

**Diagram sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L8-L149)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L15-L70)

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L13-L149)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L15-L70)

### Content and Assets
- Upload portfolio project: Creates portfolio/project, uploads images to storage, sets thumbnails, and handles rollback on failure.
- Verify authenticity: Public verification and certificate retrieval; admin-only generation using RPC and hashing.

```mermaid
sequenceDiagram
participant D as "Designer Client"
participant UP as "upload-portfolio-project"
participant SA as "Supabase Auth"
participant SDA as "Storage Admin"
participant SD as "Supabase DB"
D->>UP : "POST /upload-portfolio-project {title,images,...}"
UP->>SA : "getUser()"
SA-->>UP : "user"
UP->>SD : "get or create portfolio"
UP->>SD : "insert portfolio_project"
loop "for each image"
UP->>SDA : "storage.upload(file)"
SDA-->>UP : "ok"
UP->>SDA : "getPublicUrl"
UP->>SD : "insert portfolio_assets"
end
UP-->>D : "200 JSON {success,project,assets}"
participant Pub as "Public Client"
participant VA as "verify-authenticity"
Pub->>VA : "POST /verify-authenticity {action : 'verify'|'get_certificate'|'generate',...}"
alt "verify"
VA->>SD : "lookup certificate by code/serial"
SD-->>VA : "certificate + product + designer"
VA-->>Pub : "200 JSON {verified,certificate}"
else "get_certificate"
VA->>SD : "lookup product certificate"
SD-->>VA : "certificate details"
VA-->>Pub : "200 JSON {certificate}"
else "generate"
VA->>SA : "Authorization required"
SA-->>VA : "user (admin)"
VA->>SD : "RPC generate_certificate_number"
VA->>SD : "insert product_authenticity_certificates"
SD-->>VA : "certificate"
VA-->>Pub : "200 JSON {success,certificate}"
end
```

**Diagram sources**
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L21-L300)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L24-L262)

**Section sources**
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L26-L300)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L29-L262)

### Teams
Manages team creation, invitations, join requests, and membership lifecycle with role checks and capacity enforcement.

```mermaid
flowchart TD
Start(["manage-team"]) --> Auth["getUser()"]
Auth --> Action{"action"}
Action --> |create| Rank["Check rank >= 3"]
Rank --> |OK| Create["Insert teams + lead member"]
Rank --> |Fail| ErrRank["403 Rank requirement"]
Create --> Notify["Insert notification"]
Notify --> Done(["200 JSON"])
Action --> |invite| Lead["Verify lead role"]
Lead --> |OK| Invite["Insert team_invitations + notify"]
Invite --> Done
Action --> |respond_invitation| RespInv["Lookup invitation + accept/decline"]
RespInv --> Member["Add to team if accepted"]
Member --> Done
Action --> |join_request| CanJoin["RPC can_join_team"]
CanJoin --> |OK| Req["Insert team_join_requests + notify lead"]
Req --> Done
Action --> |respond_request| LeadResp["Verify lead + approve/reject"]
LeadResp --> Member2["Add to team if approved"]
Member2 --> Done
Action --> |leave| Leave["Remove membership or delete team"]
Leave --> Done
```

**Diagram sources**
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L8-L548)

**Section sources**
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L47-L548)

### Additional Utilities
- Reset monthly tokens: Periodic reset of subscription-based token grants per tier.
- Generate sitemap: Builds XML sitemap from live products, categories, and articles.

**Section sources**
- [supabase/functions/reset-monthly-tokens/index.ts](file://supabase/functions/reset-monthly-tokens/index.ts#L20-L111)
- [supabase/functions/generate-sitemap/index.ts](file://supabase/functions/generate-sitemap/index.ts#L11-L136)

## Dependency Analysis
- External libraries:
  - @supabase/supabase-js for Supabase client operations
  - stripe for Stripe integration
  - resend for transactional email delivery
- Internal dependencies:
  - Supabase Auth for user verification
  - Supabase Database for CRUD and RPCs
  - Supabase Storage for asset uploads and public URLs

```mermaid
graph LR
IM["import_map.json"] --> Supabase["@supabase/supabase-js"]
IM --> StripeLib["stripe"]
IM --> ResendLib["resend"]
subgraph "Functions"
F1["marketplace-orders"]
F2["marketplace-cart"]
F3["marketplace-products"]
F4["check-subscription"]
F5["create-checkout"]
F6["broadcast-notification"]
F7["send-transactional"]
F8["calculate-designer-score"]
F9["award-style-credits"]
F10["upload-portfolio-project"]
F11["submit-stylebox-entry"]
F12["verify-authenticity"]
F13["reset-monthly-tokens"]
F14["manage-team"]
F15["generate-sitemap"]
end
Supabase --> F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13 & F14 & F15
StripeLib --> F4 & F5
ResendLib --> F7
```

**Diagram sources**
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/marketplace-orders/index.ts](file://supabase/functions/marketplace-orders/index.ts#L1-L226)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L1-L140)
- [supabase/functions/create-checkout/index.ts](file://supabase/functions/create-checkout/index.ts#L1-L85)
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L1-L149)
- [supabase/functions/send-transactional/index.ts](file://supabase/functions/send-transactional/index.ts#L1-L70)
- [supabase/functions/calculate-designer-score/index.ts](file://supabase/functions/calculate-designer-score/index.ts#L1-L223)
- [supabase/functions/award-style-credits/index.ts](file://supabase/functions/award-style-credits/index.ts#L1-L180)
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [supabase/functions/submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L1-L142)
- [supabase/functions/verify-authenticity/index.ts](file://supabase/functions/verify-authenticity/index.ts#L1-L262)
- [supabase/functions/reset-monthly-tokens/index.ts](file://supabase/functions/reset-monthly-tokens/index.ts#L1-L111)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)
- [supabase/functions/generate-sitemap/index.ts](file://supabase/functions/generate-sitemap/index.ts#L1-L136)

**Section sources**
- [supabase/functions/import_map.json](file://supabase/functions/import_map.json#L1-L7)
- [supabase/functions/deno.json](file://supabase/functions/deno.json#L1-L4)

## Performance Considerations
- Cold starts
  - Keep functions small and focused; minimize imports and initialization work.
  - Reuse Supabase clients per request scope; avoid long-lived connections.
  - Prefer Supabase Edge Functions for low-latency access close to Supabase infrastructure.
- Database queries
  - Use selective field projections and joins only when necessary.
  - Apply filters early; paginate with range queries.
  - Use indexes on frequently queried columns (e.g., user_id, status, created_at).
- Storage operations
  - Batch inserts for notifications to reduce payload size and latency.
  - Use public URLs from storage to avoid extra roundtrips.
- Network calls
  - Cache Stripe product/pricing data at the application level if feasible.
  - Minimize external API calls; coalesce where possible.
- Cost management
  - Limit result sets and enforce pagination.
  - Avoid unnecessary writes; batch operations where supported.
  - Monitor function execution time and optimize hot paths.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication failures
  - Ensure Authorization header is present and valid; verify token via Supabase Auth getUser.
  - For admin-only endpoints, confirm user roles in user_roles table.
- Stripe errors
  - Validate STRIPE_SECRET_KEY presence and correctness.
  - Check customer existence before creating sessions; handle missing customer gracefully.
- Supabase errors
  - Inspect error messages returned in JSON bodies; check row-level security policies.
  - Use service role key for privileged operations; avoid exposing anon keys unnecessarily.
- Storage rollbacks
  - On upload failures, ensure cleanup of uploaded files and database records.
- Logging
  - Use structured console logs with function-specific prefixes for easier correlation.
  - Include request IDs and user IDs where applicable.

**Section sources**
- [supabase/functions/broadcast-notification/index.ts](file://supabase/functions/broadcast-notification/index.ts#L13-L149)
- [supabase/functions/upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L228-L273)
- [supabase/functions/check-subscription/index.ts](file://supabase/functions/check-subscription/index.ts#L25-L140)

## Conclusion
The serverless functions architecture leverages Supabase Edge Functions to deliver scalable, secure, and modular business capabilities across marketplace operations, subscription management, scoring, notifications, and team workflows. By adhering to strict access controls, efficient data access patterns, and robust error handling, the system maintains reliability while enabling rapid iteration and cost-effective scaling.