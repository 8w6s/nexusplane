# 🧭 NexusPlane Buyer Journey Pipeline

> "User không mua server — họ mua solution / compute capacity / outcome."

Tài liệu này định nghĩa hành trình End-to-End của một khách hàng (Tenant) từ lúc biết đến NexusPlane cho đến khi họ xây dựng một doanh nghiệp (SaaS/Reseller) trên chính nền tảng này.

---

## 1. Discover (Biết đến sản phẩm)
- **Nguồn**: Google, Reddit, Discord, Truyền miệng.
- **Tâm lý**: "Có rẻ không? Nhanh không? Dễ dùng không?"

## 2. Evaluate (Đánh giá)
- **Hành động**: Xem Catalog, đọc Pricing, check Docs API.
- **Yêu cầu UI**: Minh bạch giá cả, giao diện nhìn đắt tiền, có nút xem Demo.

## 3. Onboarding (Đăng ký)
- **Hành động**: Sign up -> Verify -> Login.
- **Yêu cầu**: UI mượt, không bắt nhập Credit Card ngay lập tức, lý tưởng nhất là cho một khoản Free Credit để test hệ thống.

## 4. Configure (Cấu hình - Điểm chạm khác biệt)
- **Hành động**: Chọn Region -> OS -> Specs -> Add-ons (Firewall, Snapshots).
- **Trải nghiệm**: Giống hệt AWS/DigitalOcean, cảm giác mình đang chọn "Infrastructure Config" chứ không phải đi thuê cái VPS cùi.

## 5. Purchase / Order (Đặt hàng)
- **Hành động**: Click chốt đơn.
- **Tâm lý**: User tưởng họ mua cái server tĩnh, thực tế hệ thống nhận Order và tiến hành provision.

## 6. Deploy (Magic Moment 🚀)
- **Hành động**: Thanh tiến trình ảo diệu báo "Provisioning..." -> "Running".
- **Rule sống còn**: Nếu quá trình này chậm (quá 2 phút) hoặc văng lỗi -> Chắc chắn mất 90% user. Đây là điểm tạo Trust mạnh nhất.

## 7. Operate (Sử dụng hàng ngày)
- **Hành động**: SSH vào, cài app, check RAM/CPU.
- **Công cụ**: Web Console (VNC/SSH), Metrics Chart, Reboot Button. Bắt buộc phải mượt như native.

## 8. Scale (Mở rộng & In tiền)
- **Hành động**: Bấm Resize RAM/CPU, hoặc Spawn thêm 5 con server nữa, config Load Balancer.
- **Ý nghĩa**: Bắt đầu sinh ra MRR (Doanh thu đều đặn hàng tháng) cực lớn cho Platform.

## 9. Integrate (Level Advanced)
- **Hành động**: Bỏ qua UI. Lên Docs copy API Keys, copy bash script, setup Terraform / Webhooks.
- **Ý nghĩa**: Quá độ từ sản phẩm "Giao diện" sang "Hạ tầng lõi".

## 10. Monetize (Partner hóa)
- **Kiếm tiền**: User dùng API để tự mở bán Game Hosting, làm PaaS cho Web, chạy ngầm AI... 
- **Kết luận**: Nhờ có NexusPlane, user tạo ra tiền. Họ không bao giờ rời bỏ bạn nữa. Lợi ích đôi bên (Win-Win).

---

> **Insight Cuối Cùng**: Nếu user chỉ dừng ở bước "Tạo VPS" -> Bạn là Hosting. Nếu user tiến tới bước Monitize -> Bạn là **Platform**.
