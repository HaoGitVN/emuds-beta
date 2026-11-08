# EmuDS – hướng dẫn triển khai

## Cấu trúc
```
emuds/
├─ index.html   giao diện + trình chơi (đã gắn sẵn EmulatorJS qua CDN chính thức)
├─ games.json   danh mục game được phép phân phối (tuỳ chọn)
└─ worker.js    CORS proxy có allowlist (tuỳ chọn)
```

## 1. Đưa lên mạng (không cần tải EmulatorJS)
`index.html` nạp EmulatorJS từ https://cdn.emulatorjs.org/stable/data/ nên bạn chỉ cần host các file này.
- Cloudflare Pages / Netlify / GitHub Pages: tải cả thư mục lên, không cần lệnh build.
- Gắn tên miền EmuDS ở mục Custom domains; HTTPS được cấp tự động.
- Mở thử trên máy: `python3 -m http.server 8080` trong thư mục, rồi vào http://localhost:8080 (không mở trực tiếp file bằng file://).

## 2. Cách chơi
Bấm "Thêm game", chọn 1 file .nds: game được lưu trong trình duyệt và chạy ngay. Chọn nhiều file thì chúng vào thư viện, bấm ▶ để chơi.

## 3. (Tuỳ chọn) Tự host EmulatorJS
Tải bản phát hành từ emulatorjs.org, chép thư mục `data` vào `emuds/data/`, đổi `EJS_PATH` trong index.html thành "data/". Một số core cần thêm header COOP/COEP (Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp), khi đó tạo file `_headers` chứa hai dòng này cho Cloudflare Pages.

## 4. (Tuỳ chọn) Danh mục game và proxy CORS
Sửa games.json (chỉ game bạn có quyền phân phối). Nếu nguồn không có CORS, deploy worker.js, điền tiền tố URL được phép vào ALLOW, rồi đặt địa chỉ worker vào biến PROXY trong index.html.

## Lưu tiến trình
ROM đã thêm nằm trong IndexedDB (database `emuds`). Save state và lưu trong game dùng menu của EmulatorJS, tách theo từng game.
