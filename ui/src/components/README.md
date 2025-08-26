# Component Documentation

## CurtainTile.vue


## GeneralTile.vue


### Props
- tile

## ImageTile.vue

### Description
- ImageTile Component
  
  This component displays an image tile with hover effects and a modal viewer.
  
  Props:
  - thumb: Object (required)
  - Represents the image data. Must include a `picture.url` field.
  - compactLegend: Boolean (default: false)
  - Toggles a compact layout for the legend in the modal viewer.
  
  Behavior:
  - Clicking the tile opens the `ImageViewer` modal.
  - The `ImageViewer` displays the image and its metadata (e.g., legend).
  - Hovering over the tile shows a magnify button (disabled by default).

## ImageViewer.vue

### Description
- Props:
  - images: Array of image objects with `url`, `title`, and `legend`.
  - index: Starting index for the carousel.
  - modelValue: Controls the visibility of the modal (v-model).
  - compactLegend: Toggles compact layout for the legend.
  
  Emits:
  - update:modelValue: Notifies parent when modal visibility changes.

## Test.vue


