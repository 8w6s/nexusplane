const fs = require('fs');
const files = [
  'admin-panel.tsx', 'panel-panel.tsx', 'dash-panel.tsx', 'shop-panel.tsx', 'shared.tsx'
];

files.forEach(file => {
  const path = `web/components/dashboard/panels/${file}`;
  let content = fs.readFileSync(path, 'utf8');
  // Thay thế các grid columns cứng bằng minmax(0, Xfr) giúp chống vỡ layout
  content = content.replace(/xl:grid-cols-\[([0-9\.]+)fr_([0-9\.]+)fr\]/g, "xl:grid-cols-[minmax(0,$1fr)_minmax(0,$2fr)]");
  fs.writeFileSync(path, content);
});
console.log('Fixed grids completely!');
