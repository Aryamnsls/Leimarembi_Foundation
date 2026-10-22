#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

required=(
  "website/src/app/layout.tsx"
  "website/src/app/icon.png"
  "website/next.config.ts"
  "website/src/middleware.ts"
  "website/public/.htaccess"
  "website/public/manifest.webmanifest"
  "website/public/sw.js"
  "website/public/offline.html"
  "website/public/icons/icon-192.png"
  "website/public/icons/icon-512.png"
  "website/public/icons/icon-maskable-512.png"
  "website/public/icons/apple-touch-icon.png"
  "website/src/components/PWAInstallPrompt.tsx"
)
for path in "${required[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "ERROR: expected file missing: $path" >&2
    echo "Extract the PWA bundle into the repository root before running this script." >&2
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR=".git/pwa-backups/$STAMP"
mkdir -p "$BACKUP_DIR"
cp "website/src/app/layout.tsx" "$BACKUP_DIR/layout.tsx"
cp "website/src/app/icon.png" "$BACKUP_DIR/app-icon.png"
cp "website/public/.htaccess" "$BACKUP_DIR/public.htaccess"
echo "Backups saved under $BACKUP_DIR"

python3 - <<'PY'
from pathlib import Path
import re

layout_path = Path('website/src/app/layout.tsx')
s = layout_path.read_text()

if 'PWAInstallPrompt' not in s:
    if 'import type { Metadata } from "next";' not in s:
        raise SystemExit('Unsupported layout: expected Next Metadata import was not found; backup is preserved and nothing was changed.')
    s = s.replace('import type { Metadata } from "next";', 'import type { Metadata, Viewport } from "next";', 1)
    s = s.replace('import Providers from "@/components/Providers";', 'import Providers from "@/components/Providers";\nimport PWAInstallPrompt from "@/components/PWAInstallPrompt";', 1)
elif 'Viewport' not in s.splitlines()[0]:
    s = s.replace('import type { Metadata } from "next";', 'import type { Metadata, Viewport } from "next";', 1)

if 'manifest: "/manifest.webmanifest"' not in s:
    marker = 'export const metadata: Metadata = {\n'
    if marker not in s:
        raise SystemExit('Unsupported layout: metadata object marker missing; backup is preserved.')
    insert = ('export const metadata: Metadata = {\n'
              '  applicationName: "Leimarembi Foundation",\n'
              '  manifest: "/manifest.webmanifest",\n'
              '  appleWebApp: { capable: true, statusBarStyle: "default", title: "Leimarembi" },\n'
              '  formatDetection: { telephone: false },\n')
    s = s.replace(marker, insert, 1)

icons_re = re.compile(r'  icons: \{.*?\n  \},(?=\n};)', re.S)
icons = '''  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },'''
if '/icons/apple-touch-icon.png' not in s:
    s2, n = icons_re.subn(icons, s, count=1)
    if n != 1:
        raise SystemExit('Unsupported layout: existing icons block was not found; backup is preserved.')
    s = s2

if 'export const viewport: Viewport' not in s:
    marker = 'export default function RootLayout'
    if marker not in s:
        raise SystemExit('Unsupported layout: RootLayout export was not found; backup is preserved.')
    viewport = ('export const viewport: Viewport = {\n'
                '  width: "device-width",\n'
                '  initialScale: 1,\n'
                '  viewportFit: "cover",\n'
                '  themeColor: "#1B2A57",\n'
                '};\n\n')
    s = s.replace(marker, viewport + marker, 1)

if '<PWAInstallPrompt />' not in s:
    if '            <Footer />' not in s:
        raise SystemExit('Unsupported layout: Footer insertion point was not found; backup is preserved.')
    s = s.replace('            <Footer />', '            <Footer />\n            <PWAInstallPrompt />', 1)

layout_path.write_text(s)

htaccess_path = Path('website/public/.htaccess')
h = htaccess_path.read_text()
if '# PWA response headers' not in h:
    pwa = '''# PWA response headers: keep the worker/manifest fresh so deployments propagate safely.
<IfModule mod_mime.c>
    AddType application/manifest+json .webmanifest
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "^(sw\\.js|manifest\\.webmanifest|offline\\.html)$">
        Header always set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>
    <FilesMatch "^(icon-192|icon-512|icon-maskable-512|apple-touch-icon)\\.png$">
        Header set Cache-Control "public, max-age=604800"
    </FilesMatch>
</IfModule>

'''
    htaccess_path.write_text(pwa + h)

print('Patched website/src/app/layout.tsx and website/public/.htaccess.')
PY

# Align the file-based Next.js icon convention with the square PWA icon.
cp "website/public/icons/icon-512.png" "website/src/app/icon.png"


printf '\nPWA files are in place. Next run:\n'
printf '  node website/scripts/pwa-smoke-test.mjs website/public\n'
printf 'Then resolve the deployment strategy documented in PWA-UPGRADE-README.md before building/deploying.\n'

if grep -q "output: 'export'" website/next.config.ts && [[ -f website/src/middleware.ts && -f website/open-next.config.ts ]]; then
  echo "WARNING: both static export and OpenNext/middleware configuration are present; PWA apply does not resolve this deployment conflict."
fi
