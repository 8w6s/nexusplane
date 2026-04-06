# 🌐 NexusPlane API v1 — Full Structure (Enhanced Edition)

**Version:** 1.0.0  
**Status:** Production-Ready  
**Auth:** JWT + API Keys + Node Tokens (mTLS)  
**Rate Limit:** 1000 req/min (configurable)  
**Pagination:** `?page=1&limit=50` (all list endpoints)  
**Filtering:** `?status=active&region=us-east`  

## 🌐 ROOT
```text
GET  /v1/health                    # System status
GET  /v1/version                   # API version
```

---

## 🔐 1. AUTH & SECURITY
```textNTwwwww
# User Authentication
POST   /v1/auth/login              # {email, password} → JWT
POST   /v1/auth/register           # {email, password, name} → User + Email verify
POST   /v1/auth/logout             # Invalidate JWT
POST   /v1/auth/refresh            # Refresh JWT from refresh_token

# Email Verification
POST   /v1/auth/verify-email       # {token} → Activate account
POST   /v1/auth/resend-verification

# Password Reset
POST   /v1/auth/forgot-password    # {email} → Send reset link
POST   /v1/auth/reset-password     # {token, new_password}

# 2FA
POST   /v1/auth/2fa/enable         # {code} → Enable TOTP
POST   /v1/auth/2fa/verify         # {code} → Login with 2FA
POST   /v1/auth/2fa/disable        # {code} → Disable

# API Keys (for integrations)
GET    /v1/api-keys                # List user API keys
POST   /v1/api-keys                # Create new key {name, permissions[]}
GET    /v1/api-keys/{key_id}       
PATCH  /v1/api-keys/{key_id}       # Update name/permissions
DELETE /v1/api-keys/{key_id}
```

---

## 👤 2. USER / IAM
```text
# Profile
GET    /v1/me                      # Current user info
PATCH  /v1/me                      # Update profile {name, email, avatar}

# Usage & Activity
GET    /v1/me/usage                # CPU/Memory/Disk/Bandwidth usage
GET    /v1/me/logs                 # User action logs
GET    /v1/me/sessions             # Active sessions
DELETE /v1/me/sessions/{session_id}
DELETE /v1/me/sessions/all         # Logout everywhere

# Notifications
GET    /v1/me/notifications        # List notifications
PATCH  /v1/me/notifications/{id}   # Mark as read
PATCH  /v1/me/notifications/all    # Mark all read
```

---

## 👥 3. TEAM / RBAC
```text
# Teams (Organizations)
GET    /v1/teams                   # List user teams
POST   /v1/teams                   # {name, slug} → Create team
GET    /v1/teams/{team_id}         
PATCH  /v1/teams/{team_id}         # Update name/description
DELETE /v1/teams/{team_id}

# Team Members
GET    /v1/teams/{team_id}/members
POST   /v1/teams/{team_id}/members # {user_email, role_id}
DELETE /v1/teams/{team_id}/members/{user_id}

# Custom Roles (Granular RBAC)
GET    /v1/teams/{team_id}/roles
POST   /v1/teams/{team_id}/roles   # {name, permissions[]}
PATCH  /v1/teams/{team_id}/roles/{role_id}
DELETE /v1/teams/{team_id}/roles/{role_id}
```

---

## 🛒 4. CATALOG / STORE
```text
# Product Discovery
GET /v1/catalog/categories         # VPS, GameServer, Storage, etc.
GET /v1/catalog/products           # ?category=game&region=us-east
GET /v1/catalog/products/{product_id}

# Infrastructure Options
GET /v1/catalog/regions            # us-east, eu-west, ap-southeast
GET /v1/catalog/zones              # us-east-1a, us-east-1b
GET /v1/catalog/os                 # Ubuntu 22.04, CentOS 9, Windows Server
GET /v1/catalog/images             # Custom AMIs
GET /v1/catalog/flavors            # nano, micro, small, medium, large
GET /v1/catalog/pricing            # Hourly + Monthly rates
GET /v1/catalog/templates          # Pre-configured stacks (WordPress, Node.js)
```

---

## 📦 5. ORDERS
```text
GET    /v1/orders                  # ?status=pending&date_from=2024-01-01
POST   /v1/orders                  # {product_id, region, flavor, quantity}
GET    /v1/orders/{order_id}
POST   /v1/orders/{order_id}/cancel
POST   /v1/orders/{order_id}/retry # Retry failed provisioning
```

---

## 💳 6. BILLING / PAYMENT
```text
# Balance & Usage
GET  /v1/billing/balance           # Account credit
POST /v1/billing/deposit           # Add funds {amount, gateway}
GET  /v1/billing/usage             # Hourly breakdown

# Transactions
GET  /v1/transactions              # All payments/refunds
GET  /v1/transactions/{txn_id}

# Invoices
GET  /v1/invoices                  # ?status=unpaid&month=2024-01
GET  /v1/invoices/{inv_id}         # PDF download
POST /v1/invoices/{inv_id}/pay     # {gateway}

# Subscriptions (Recurring)
GET  /v1/subscriptions
GET  /v1/subscriptions/{sub_id}
POST /v1/subscriptions/{sub_id}/cancel
POST /v1/subscriptions/{sub_id}/resume

# Payment Provider Webhooks
POST /v1/webhooks/stripe           # Signature verified
POST /v1/webhooks/paypal
POST /v1/webhooks/manual           # Admin manual payment
```

---

## 🖥️ 7. SERVERS (Customer View)
```text
GET    /v1/servers                 # ?status=running&region=us-east
POST   /v1/servers                 # Deploy from catalog
GET    /v1/servers/{srv_id}
PATCH  /v1/servers/{srv_id}        # Update tags, metadata
DELETE /v1/servers/{srv_id}        # Terminate (graceful)

# Server Actions
POST /v1/servers/{srv_id}/actions
{
  "type": "start|stop|restart|kill|reinstall|resize|rebuild",
  "params": { "os": "ubuntu-22.04", "size": "2xCPU" }
}

# Console Access
GET  /v1/servers/{srv_id}/console/websocket  # VNC/SSH over WS
POST /v1/servers/{srv_id}/console/command    # Send command
```

---

## 📊 8. SERVER DATA / MONITORING
```text
GET /v1/servers/{srv_id}/metrics     # CPU/Mem/Disk/IO (1min granularity)
GET /v1/servers/{srv_id}/bandwidth   # In/Out traffic (daily/hourly)
GET /v1/servers/{srv_id}/logs        # System logs (last 100 lines)
```

---

## 💾 9. SNAPSHOTS / BACKUPS
```text
GET    /v1/servers/{srv_id}/snapshots
POST   /v1/servers/{srv_id}/snapshots  # Create snapshot
GET    /v1/snapshots
GET    /v1/snapshots/{snapshot_id}
DELETE /v1/snapshots/{snapshot_id}

POST   /v1/snapshots/{snapshot_id}/restore
POST   /v1/snapshots/{snapshot_id}/create-server  # Deploy from snapshot
```

---

## 🌐 10. NETWORKS (VPC-like)
```text
GET    /v1/networks
POST   /v1/networks                 # {name, cidr: "10.0.0.0/16"}
GET    /v1/networks/{network_id}
PATCH  /v1/networks/{network_id}
DELETE /v1/networks/{network_id}

GET    /v1/networks/{network_id}/ports
POST   /v1/networks/{network_id}/ports  # Create port
POST   /v1/networks/{network_id}/attach # server_id
POST   /v1/networks/{network_id}/detach
```

---

## 🌍 11. FLOATING IPs
```text
GET    /v1/ips                      # Available pool
POST   /v1/ips                      # Allocate new {region}
GET    /v1/ips/{ip_id}
DELETE /v1/ips/{ip_id}              # Release

POST   /v1/ips/{ip_id}/attach       # {server_id}
POST   /v1/ips/{ip_id}/detach
GET    /v1/servers/{srv_id}/ips     # Assigned IPs
```

---

## 🔥 12. FIREWALL (L3/L4)
```text
GET    /v1/firewall/groups
POST   /v1/firewall/groups          # {name, description}
GET    /v1/firewall/groups/{group_id}
PATCH  /v1/firewall/groups/{group_id}
DELETE /v1/firewall/groups/{group_id}

GET    /v1/firewall/groups/{group_id}/rules
POST   /v1/firewall/groups/{group_id}/rules
# {protocol: tcp, port: 80, src_cidr: 0.0.0.0/0, action: accept}
GET    /v1/firewall/rules/{rule_id}
PATCH  /v1/firewall/rules/{rule_id}
DELETE /v1/firewall/rules/{rule_id}

POST   /v1/firewall/groups/{group_id}/attach   # {server_id}
POST   /v1/firewall/groups/{group_id}/detach
```

---

## 🛡️ 13. WAF (L7 Application Firewall)
```text
GET    /v1/waf/policies
POST   /v1/waf/policies             # {name, mode: "detect|block"}
GET    /v1/waf/policies/{policy_id}
PATCH  /v1/waf/policies/{policy_id}
DELETE /v1/waf/policies/{policy_id}

GET    /v1/waf/policies/{policy_id}/rules
POST   /v1/waf/policies/{policy_id}/rules
# {name: "SQLi", pattern: "1' OR '1'='1", action: "block"}
GET    /v1/waf/rules/{rule_id}
PATCH  /v1/waf/rules/{rule_id}
DELETE /v1/waf/rules/{rule_id}

POST   /v1/waf/policies/{policy_id}/attach   # {server_id or domain}
POST   /v1/waf/policies/{policy_id}/detach
```

---

## ⚙️ 14. JOBS (ASYNC TASKS)
```text
GET  /v1/jobs                       # ?status=running&limit=20
GET  /v1/jobs/{job_id}              # Progress + Result
POST /v1/jobs/{job_id}/cancel
```

---

## 📡 15. EVENTS (Real-time)
```text
GET /v1/events                      # Server create/delete, payment, etc.
GET /v1/events/{event_id}
# WebSocket: wss://api.nexusplane.com/v1/events/stream
```

---

## 📨 16. OUTBOUND WEBHOOKS
```text
GET    /v1/webhooks                 # User-defined webhooks
POST   /v1/webhooks                 # {name, url, events: ["server.create"]}
GET    /v1/webhooks/{webhook_id}
PATCH  /v1/webhooks/{webhook_id}
DELETE /v1/webhooks/{webhook_id}
POST   /v1/webhooks/{webhook_id}/test

GET    /v1/webhooks/{webhook_id}/deliveries
GET    /v1/webhooks/{webhook_id}/deliveries/{delivery_id}
POST   /v1/webhooks/{webhook_id}/deliveries/{delivery_id}/redeliver
```

---

## 🔌 17. INTEGRATIONS
```text
GET    /v1/integrations            # Slack, Discord, Telegram
POST   /v1/integrations            # {type: "slack", config: {...}}
GET    /v1/integrations/{id}
PATCH  /v1/integrations/{id}
DELETE /v1/integrations/{id}
```

---

## 🧩 18. PLUGINS (Monetization)
```text
GET    /v1/plugins                 # Available plugins
POST   /v1/plugins/install         # {plugin_id}
POST   /v1/plugins/{plugin_id}/enable
POST   /v1/plugins/{plugin_id}/disable
DELETE /v1/plugins/{plugin_id}     # Uninstall
```

---

## 🏢 19. ADMIN PANEL (Provider Control)
```text
# Dashboard Stats
GET    /v1/admin/stats/overview    # Revenue, servers, users (30d)
GET    /v1/admin/stats/revenue     # MRR, ARR, churn
GET    /v1/admin/stats/servers     # By region, status
GET    /v1/admin/stats/nodes       # Node utilization

# User Management
GET    /v1/admin/users             # ?status=suspended&team_id=xxx
GET    /v1/admin/users/{id}
PATCH  /v1/admin/users/{id}
POST   /v1/admin/users/{id}/suspend
POST   /v1/admin/users/{id}/unsuspend
POST   /v1/admin/users/{id}/impersonate  # Login as user

# Server Management
GET    /v1/admin/servers
POST   /v1/admin/servers/{id}/force-stop
POST   /v1/admin/servers/{id}/migrate    # {target_node_id}

# Orders & Billing
GET    /v1/admin/orders
POST   /v1/admin/orders/{id}/mark-paid   # Manual payment
GET    /v1/admin/invoices
GET    /v1/admin/snapshots

# Catalog Management
POST   /v1/admin/catalog/products
PATCH  /v1/admin/catalog/products/{id}
DELETE /v1/admin/catalog/products/{id}
POST   /v1/admin/catalog/categories
PATCH  /v1/admin/catalog/categories/{id}
DELETE /v1/admin/catalog/categories/{id}
POST   /v1/admin/catalog/pricing
PATCH  /v1/admin/catalog/pricing/{id}
```

---

## 🖥️ 20. NODES (Infrastructure Layer)
```text
GET    /v1/admin/nodes              # All provider nodes
POST   /v1/admin/nodes              # Add new node
GET    /v1/admin/nodes/{node_id}
PATCH  /v1/admin/nodes/{node_id}
DELETE /v1/admin/nodes/{node_id}

GET    /v1/admin/nodes/{node_id}/health
GET    /v1/admin/nodes/{node_id}/metrics
GET    /v1/admin/nodes/{node_id}/logs

POST   /v1/admin/nodes/{node_id}/drain    # Stop accepting new servers
POST   /v1/admin/nodes/{node_id}/enable
POST   /v1/admin/nodes/{node_id}/disable
```

---

## ⚡ 21. AGENT (Node Communication)
*NOTE: Requires `X-Node-Token` or mTLS*
```text
POST /v1/agent/heartbeat           # Node → API (every 30s)
POST /v1/agent/sync                # Pull tasks/config
POST /v1/agent/task-result         # {task_id, status, output}
GET  /v1/agent/tasks               # Node pulls pending tasks
```

---

## 📦 22. RESOURCE ABSTRACTION (Unified View)
```text
GET /v1/resources                  # ?type=server|snapshot|ip|volume
GET /v1/resources/{id}

# Bulk Operations
POST /v1/resources/bulk/actions    # [{"id": "srv-123", "action": "start"}]
```
