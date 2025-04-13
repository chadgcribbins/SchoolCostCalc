# Converting SVG Files to PNG/ICO

The project includes SVG files for the favicon and logo. You'll need to convert these to the appropriate formats for use in a React application.

## Converting SVG to ICO (favicon)

### Option 1: Online Converter

1. Use an online converter like [convertio.co](https://convertio.co/svg-ico/) or [favicon.io](https://favicon.io/favicon-converter/)
2. Upload the `favicon.svg` file
3. Download the converted `.ico` file
4. Save it as `favicon.ico` in the `public` folder

### Option 2: Using ImageMagick

If you have ImageMagick installed:

```bash
convert -background transparent public/favicon.svg -define icon:auto-resize=16,32,48,64 public/favicon.ico
```

## Converting SVG to PNG (logo)

### Option 1: Online Converter

1. Use an online converter like [convertio.co](https://convertio.co/svg-png/)
2. Upload the `logo.svg` file
3. Set the dimensions to 192x192 for `logo192.png` and 512x512 for `logo512.png`
4. Download the converted PNG files
5. Save them in the `public` folder

### Option 2: Using ImageMagick

If you have ImageMagick installed:

```bash
convert -background transparent public/logo.svg -resize 192x192 public/logo192.png
convert -background transparent public/logo.svg -resize 512x512 public/logo512.png
```

## Alternative: Use the SVGs Directly

If you prefer, you can also modify the `index.html` and `manifest.json` files to use the SVG files directly, which works in most modern browsers:

1. In `index.html`, change:

   ```html
   <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
   ```

   to:

   ```html
   <link rel="icon" href="%PUBLIC_URL%/favicon.svg" type="image/svg+xml" />
   ```

2. In `manifest.json`, update the icon entries to use SVG instead of ICO/PNG (note: some app stores and platforms may still require PNG icons)
