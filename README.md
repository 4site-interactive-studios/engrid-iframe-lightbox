# ENgrid Iframe Lightbox

This project allow you to embed a [ENgrid](https://github.com/4site-interactive-studios/engrid) Donation Page Iframe in a lightbox on your website.

## How to use

Add the script below to your website.

```html
<script
  defer="defer"
  src="{URL}/engrid-iframe-lightbox.js"
  data-engrid-url="https://give.oxfamamerica.org/page/35383/donate/1?mode=DEMO"
  data-engrid-overlay-bgcolor="#667eea"
  data-engrid-content-bgcolor="#ffffff"
  data-engrid-max-width="650px"
></script>
```

## Options:

- **data-engrid-url**: The URL of the ENgrid Donation Page Iframe you want to embed **(required)**
- **data-engrid-overlay-bgcolor**: The background color of the overlay (default: #000000).
- **data-engrid-overlay-bgcolor**: The background color of the content (default: #ffffff).
- **data-engrid-max-width**: The maximum width of the content (default: 800px).

Change the data attributes with the information you need.

## Example of implementation via Google Tag Manager

```javascript
window.addEventListener("load", function () {
  var script = document.createElement("script");
  script.src = "{URL}/engrid-iframe-lightbox.js";
  script.dataset.engridUrl =
    "https://give.oxfamamerica.org/page/35383/donate/1?mode=DEMO";
  document.querySelector("head").appendChild(script);
});
```

## Development

Your js code must be on the `src/app` folder. Styling changes must be on `src/scss/main.scss`.

## Install Dependencies

1. `npm install`

## Deploy

1. `npm run build` - Builds the project
2. `npm run watch` - Watch for changes and rebuilds the project

It will create a `dist` folder, where you can get the `engrid-iframe-lightbox.js` file and publish it.
