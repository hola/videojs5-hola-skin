videojs-hola-skin
============

A custom skin for VideoJS 5 with animated play/pause buttons.

## Quick start

To start using Hola Skin with video.js, follow these steps:

1. Add these includes to your document's `<head>`:

  ```html
  <link href="https://cdn.rawgit.com/hola/videojs5-hola-skin/6dddd1cc59b995cfa5b38a8ca65f6cc5aab52515/dist/css/videojs-hola-skin.css" rel="stylesheet">
  <script src="https://cdn.rawgit.com/hola/videojs5-hola-skin/6dddd1cc59b995cfa5b38a8ca65f6cc5aab52515/dist/js/videojs-hola-skin.min.js"></script>
  ```

2. Set `plugins` option for you Video.js setup:

  In video tag `data-setup` attribute in your html
  ```html
  data-setup='{"plugins":{"hola_skin": {"css": false}}}'
  ```

  or in javascript videojs call:
  ```javascript
  videojs('your-video-element', {
    plugins: {
      hola_skin: {css: false}
    }
  });
  ```
