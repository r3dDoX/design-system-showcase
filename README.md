# Design System Showcase

## Installation
To use this package install it via:
```bash
npm install design-systems-showcase
```

Additionally to set up the proper CSS variables, you need to import the provided `style.css` file in your project.
```css
@import "design-system-showcase/style.css";
```

## Usage
To use all components, you can import the `index.js` file in your project:
```js
import 'design-system-showcase';
```

If you want to lazy load the components where you need them, you can import the individual components:
```js
import 'design-system-showcase/src/components/button/button.component';
```

## Font
We recommend using the [Inter](https://rsms.me/inter/) font in your project.
You can either install it as a [package](https://www.npmjs.com/package/inter-ui) or use it over a CDN as described in the linke above.

If you installed the package, declaring it in CSS would look like this:
```css
@font-face {
  font-family: "Inter";
  font-weight: 100 900;
  font-display: swap;
  src: url("inter-ui/Inter (web)/Inter.var.woff2?v=3.19") format("woff2-variations");
}

html {
  font-family: Inter, sans-serif !important;
}
```
This uses the variable font version of Inter, which is smaller in size and provides more flexibility.
