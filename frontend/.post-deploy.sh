#!/bin/bash
cd ~/frontend
npm install
npm run build
cp -r build/* ~/domains/yourdomain.com/public_html/
