# Warkdown 98 Roadmap

This roadmap captures the improvements we discussed for the markdown editor.

## Completed

- Scoped markdown typography in the preview pane so headings no longer dominate the layout.
- Kept the 98.css look and the draggable windows intact.

## Next Up

### 1. Safer preview rendering
- Replace the current raw HTML preview path with a renderer that is easier to control and safer by default.
- Prefer `react-markdown` for the preview surface so markdown features can be extended without relying on `dangerouslySetInnerHTML`.
- Add support for common markdown extras if needed, such as tables, task lists, and code block styling.

### 2. Responsive window layout
- Make the editor and preview panes adapt to smaller screens.
- Stack windows vertically on narrow viewports instead of relying on fixed `vw` positioning.
- Keep the playful draggable behavior on desktop while preventing panes from falling off screen.

### 3. Better starter sample
- Expand the default markdown content so new users immediately see headings, lists, quotes, code blocks, and links.
- Use the sample to demonstrate the styling and export features more clearly.

### 4. Stronger interaction polish
- Improve focus and z-index behavior for the draggable windows.
- Add a layout reset action so users can recover if they move a window off screen.
- Consider remembering window positions between sessions.

### 5. Export feedback
- Make Markdown, HTML, and PDF export more explicit and reliable.
- Add a small status message or confirmation after export.
- Review the PDF export path so it produces predictable formatting.

## Suggested Order

1. Replace preview rendering with a safer, more maintainable approach.
2. Make the layout responsive.
3. Expand the default sample content.
4. Add interaction polish and export feedback.

## Notes

- The current visual theme is part of the app's personality, so improvements should preserve the retro UI rather than replacing it.
- The preview typography change is the first quality-of-life fix because it makes every other sample and export look better right away.
