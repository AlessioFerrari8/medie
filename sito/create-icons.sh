#!/bin/bash

# Crea una directory temporanea e la directory delle icone 
mkdir -p /tmp/icons
mkdir -p /home/ubuntu/medie_app/icons

# Crea un'icona SVG di base
cat > /tmp/icons/icon.svg << EOF # SVG file per le icone 
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#4285f4" rx="100" ry="100" />
  <text x="256" y="300" font-family="Arial" font-size="220" font-weight="bold" text-anchor="middle" fill="white">M</text>
  <path d="M130,350 L380,350" stroke="white" stroke-width="20" stroke-linecap="round" />
  <path d="M180,390 L330,390" stroke="white" stroke-width="15" stroke-linecap="round" />
</svg>
EOF # EOF = Fine del file SVG

# Installa librerie necessarie
sudo apt-get update
sudo apt-get install -y librsvg2-bin imagemagick

# Crea le icone in diverse dimensioni
for size in 32 72 96 128 144 152 192 384 512; do
  rsvg-convert -w $size -h $size /tmp/icons/icon.svg > /home/ubuntu/medie_app/icons/icon-${size}x${size}.png
done

# Crea il favicon
cp /home/ubuntu/medie_app/icons/icon-32x32.png /home/ubuntu/medie_app/icons/favicon.png

echo "Icone create con successo!"

