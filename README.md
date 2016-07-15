videojs-hola-skin
============

A custom skin for VideoJS 5 with animated play/pause buttons.

## Quick start

To start using Hola Skin with video.js, follow these steps:

1. Add these includes to your document's `<head>`:

  ```html
  <link href="https://cdn.rawgit.com/hola/videojs5-hola-skin/7d90ba104a042866779afd742410b211abdea9da/dist/css/videojs-hola-skin.css" rel="stylesheet">
  <script src="https://cdn.rawgit.com/hola/videojs5-hola-skin/7d90ba104a042866779afd742410b211abdea9da/dist/js/videojs-hola-skin.min.js"></script>
  ```

2. Set `plugins` option for your Video.js setup:

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

## Configuration options
The following configuration options are supported for this plugin:

| Property                   | Type                 | Default                      | Description |
| -------------------------- | -------------------- | -----------------------------| ----------- |
| className                  | ```<String>```       | 'vjs5-hola-skin'             | Skin class name to be added to the videojs container. If configuration options include ```className``` without ```css```, default skin loading is skipped. |
| css                        | ```<String>|false``` | '/css/videojs-hola-skin.css' | Name of the css file to be downloaded dynamically, use 'false' when css added to the DOM statically in HTML like in the example above. |
| ver                        | ```<String>```       | ```<package version>```      | Version query string appended to ```css``` file name.<br> For instance, if configured to '1.1', css will load from /css/videojs-hola-skin.css?ver=1.1  |
| show_controls_before_start | ```<Boolean>```      | false                        | Show player controls (play button, volume control etc) on start before the video is first played. |
  
