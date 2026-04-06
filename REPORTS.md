+---------------------------------------------------------+
|  SYSTEM UPDATE REPORT                                   |
+---------------------------------------------------------+
|  > TARGET  : Demo Frontend / SQLite Persistence         |
|  > DATE    : 2026-04-06                                 |
|  > VERSION : v0.1.0 -> v0.1.1                            |
|  > STATUS  : SUCCESS                                    |
+---------------------------------------------------------+
|  [+] ADDED                                              |
|      - Lớp state chia sẻ cho hydrate/persist/checkout.   |
|      - SQLite store server-side cho snapshot demo.      |
|      - API routes: `/api/demo-state`, `/api/storefront/*`|
|      - Checkout modal fake có xác nhận invoice.         |
|  [*] MODIFIED                                           |
|      - Đồng bộ demo state qua API + localStorage fallback|
|      - Luồng mua hàng chuyển từ "click là tạo invoice"   |
|        sang checkout nhiều bước.                         |
|      - Modal shell có backdrop/Esc close.               |
|  [-] REMOVED                                            |
|      - Logic tạo invoice trực tiếp từ nút mua trên shop. |
+---------------------------------------------------------+
|  ~ IMPACT ANALYSIS                                      |
|      - Perf: State sync có debounce; vẫn nhẹ cho demo.   |
|      - Sec : Chỉ ghi dữ liệu demo nội bộ, có validate.   |
+---------------------------------------------------------+
|  ! NEXT STEPS / NOTES                                   |
|      - [ ] Nối thêm fake payment confirmation nếu muốn. |
|      - [ ] Cân nhắc bổ sung lint package nếu cần lint.   |
|      - [ ] Nếu muốn public demo, dùng tunnel/reverse proxy|
|            thay vì port-forward trực tiếp.               |
|      - [ ] Mở rộng UI polish nếu cần đồng bộ thêm brand. |
+---------------------------------------------------------+



+---------------------------------------------------------+
|  SYSTEM UPDATE REPORT                                   |
+---------------------------------------------------------+
|  > TARGET  : Full Frontend — Domain Panels (4 domains)  |
|  > DATE    : 2026-04-06 20:27                           |
|  > VERSION : v0.1.1 -> v0.2.0                            |
|  > STATUS  : SUCCESS                                    |
+---------------------------------------------------------+
|  [+] ADDED                                              |
|      - panels/shared.tsx: UI primitives tái sử dụng     |
|        (GlassCard, MetricCard, ProgressLine, Sparkline..) |
|      - panels/admin-panel.tsx: 4 sections đầy đủ        |
|        Overview (KPI + Node grid + Alerts)              |
|        Fleet (NodeCard interactive + Detail panel)      |
|        License (Ledger + Platform health)               |
|        Analytics (Sparkline + Node comparison table)    |
|      - panels/panel-panel.tsx: 4 sections đầy đủ        |
|        Instances (Quick stats + InstanceCard + Detail)  |
|        Images (OS templates + Build log)                |
|        Networking (VPC + Firewall + LB + DNS)           |
|        Activity (Filterable feed + Summary)             |
|      - panels/dash-panel.tsx: 3 sections đầy đủ         |
|        Dashboard (Wallet card + Instance list)          |
|        Billing (Balance meter + Invoice timeline)       |
|        Settings (Profile + 2FA toggle + Notifications)  |
|      - panels/shop-panel.tsx: 3 sections đầy đủ         |
|        Catalog (PlanCard gradient + Category filter)    |
|        API (Endpoint list + Code snippet + Response)    |
|        Brand (Design tokens + A/B experiment + Manifesto)|
|  [*] MODIFIED                                           |
|      - domain-panels.tsx: Chuyển thành barrel re-export |
|        từ 1540 dòng xuống 4 dòng export                 |
|  [-] REMOVED                                            |
|      - Inline code cũ trong domain-panels.tsx           |
+---------------------------------------------------------+
|  ~ IMPACT ANALYSIS                                      |
|      - Perf: Bundle split tốt hơn, lazy load từng panel |
|      - Sec : Không thay đổi logic xác thực              |
+---------------------------------------------------------+
|  ! NEXT STEPS / NOTES                                   |
|      - [ ] Wire backend API thật vào các panel          |
|      - [ ] Thêm animations khi switch section           |
|      - [ ] Chỉnh sửa thêm tuỳ biến cho panel.            |
+---------------------------------------------------------+



+---------------------------------------------------------+
|  SYSTEM UPDATE REPORT                                   |
+---------------------------------------------------------+
|  > TARGET  : Frontend UX Polish & Backend Skeleton      |
|  > DATE    : 2026-04-06 22:33                           |
|  > VERSION : v0.2.0 -> v0.3.0                           |
|  > STATUS  : SUCCESS                                    |
+---------------------------------------------------------+
|  [+] ADDED                                              |
|      - Mobile Bottom Navigation Bar (App-like UX)       |
|      - Golang `cmd/nexus/main.go` using Fiber           |
|      - Golang API `internal/handlers/server.go`         |
|      - Golang DB Model `internal/models/server.go`      |
|  [*] MODIFIED                                           |
|      - nexusplane-shell.tsx: Sửa bug đơ cuộn nền        |
|      - Toàn bộ Panels: Thay Fixed Grids = Flexible Grids|
|  [-] REMOVED                                            |
|      - Thiết lập `overflow-hidden` đè cuộn trên mobile  |
+---------------------------------------------------------+
|  ~ IMPACT ANALYSIS                                      |
|      - Perf: Web siêu mượt, xoay ngang dọc ko vỡ khung   |
|      - Sec : Khung Core Backend sẵn sàng hứng mTLS Data |
+---------------------------------------------------------+
|  ! NEXT STEPS / NOTES                                   |
|      - [ ] Export Next.js tĩnh & đắp vào Go Backend     |
|      - [ ] Trỏ form mua VPS gọi sang `/v1/servers`      |
+---------------------------------------------------------+

+---------------------------------------------------------+
|  SYSTEM UPDATE REPORT                                   |
+---------------------------------------------------------+
|  > TARGET  : Source Control & GitHub Integration        |
|  > DATE    : 2026-04-06 23:11                           |
|  > VERSION : v0.3.0 -> v0.3.0                           |
|  > STATUS  : SUCCESS                                    |
+---------------------------------------------------------+
|  [+] ADDED                                              |
|      - Cập nhật .gitignore chuẩn cho Node & Go        |
|      - Khởi tạo git repo & commit đầu tiên              |
|      - Đẩy lên GitHub repo (nexusplane) qua \gh\ CLI    |
|  [*] MODIFIED                                           |
|      - Git history initialized                          |
|  [-] REMOVED                                            |
|      -                                                  |
+---------------------------------------------------------+
|  ~ IMPACT ANALYSIS                                      |
|      - Perf: N/A                                        |
|      - Sec : Code đã đẩy lên private repo an toàn       |
+---------------------------------------------------------+
|  ! NEXT STEPS / NOTES                                   |
|      - [ ] Có thể setup CI/CD pipeline nếu cần thiết.   |
+---------------------------------------------------------+

+---------------------------------------------------------+
|  SYSTEM UPDATE REPORT                                   |
+---------------------------------------------------------+
|  > TARGET  : GitHub Repository Visibility               |
|  > DATE    : 2026-04-06 23:20                           |
|  > VERSION : v0.3.0 -> v0.3.0                           |
|  > STATUS  : SUCCESS                                    |
+---------------------------------------------------------+
|  [+] ADDED                                              |
|      -                                                  |
|  [*] MODIFIED                                           |
|      - Thay đổi quyền truy cập repo từ Private sang Public|
|  [-] REMOVED                                            |
|      -                                                  |
+---------------------------------------------------------+
|  ~ IMPACT ANALYSIS                                      |
|      - Perf: N/A                                        |
|      - Sec : Code có thể truy cập public.               |
+---------------------------------------------------------+
|  ! NEXT STEPS / NOTES                                   |
|      - [ ]                                              |
+---------------------------------------------------------+
