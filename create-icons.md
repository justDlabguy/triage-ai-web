# Creating Missing Icons

Since we can't generate PNG files directly, you'll need to create these icons manually or use an online tool:

## Required Icons

### 1. favicon.ico
- Size: 16x16, 32x32, 48x48 (multi-size ICO file)
- Use the logo design with medical cross and person icon
- Colors: Blue (#0ea5e9) background, white foreground
- Tool: https://favicon.io/favicon-converter/

### 2. icon-192.png
- Size: 192x192 pixels
- Format: PNG with transparency
- Same design as favicon but larger
- Use for PWA and mobile bookmarks

### 3. icon-512.png
- Size: 512x512 pixels
- Format: PNG with transparency
- Same design as favicon but larger
- Use for PWA and app stores

### 4. og-image.png
- Size: 1200x630 pixels
- Format: PNG or JPG
- Social media preview image
- Include: "Triage AI" text, logo, and tagline
- Background: Gradient or medical theme

## Quick Creation Steps

1. **Use Favicon Generator**:
   - Go to https://favicon.io/favicon-generator/
   - Text: "T" or use the medical cross symbol
   - Background: #0ea5e9 (blue)
   - Font: Modern/clean font

2. **Use Canva or Figma**:
   - Create 192x192 and 512x512 versions
   - Export as PNG with transparent background
   - Use the same blue and white color scheme

3. **For OG Image**:
   - Use Canva with "Facebook Post" template
   - Resize to 1200x630
   - Add "Triage AI - Healthcare Assistant" text
   - Include medical/healthcare imagery

## Alternative: Use Placeholder Service

For quick deployment, you can use placeholder images:

```html
<!-- Temporary placeholders -->
https://via.placeholder.com/192x192/0ea5e9/ffffff?text=T
https://via.placeholder.com/512x512/0ea5e9/ffffff?text=T
https://via.placeholder.com/1200x630/0ea5e9/ffffff?text=Triage+AI
```

## After Creating Icons

1. Save all files in `public/` directory
2. Update the manifest.json if needed
3. Test the PWA installation
4. Verify social media previews