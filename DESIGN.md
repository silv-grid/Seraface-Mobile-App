# SeraFace design

## Overview

A practical mobile skincare workspace: profile, report, product shortlist, routine and budget. Retain the original purple/pink identity and the existing profile choices. The sample walkthrough is visibly separate from service output.

## Colors

The original palette lives in `constants/colors.js`. The page background is pale pink `#f8f0fb`; primary actions and active navigation use purple `#7423c7`. Primary text is `#303030`, supporting text `#555555`. Purple/pink gradients remain on the profile controls and home emblem. Button gradients use the darker purple/pink endpoints for readable white text. Do not use gradients to render body text or navigation labels.

## Typography

Use the platform system font. Page titles are 30/36, section titles 19/26, body text 16/25, and short mode labels 11. Allow titles and actions to wrap. Prices use a larger, bold figure; missing prices remain words, never zero.

## Layout

Four persistent tabs: Home, Products, Routine, Budget. Details remain in their parent stack. Content scrolls with 24px side padding and a 760px desktop maximum. Use rows and separators for products and routines, with the original rounded field groups for the profile. Touch targets are at least 48px. Standard navigator tab buttons preserve web navigation and native behavior.

## Elevation & Depth

Flat surfaces, fine purple separators, no floating ornamental panels. Notices use a soft tinted background. Actions provide pressed feedback. No perpetual animation; stack transitions are immediate.

## Shapes

12px corners on actions and notices, rounded profile choices, 24px home emblem. Avoid pill-shaped body panels.

## Components

`components/Workspace.jsx` supplies Page, Action, Notice and shared styles. Profile components keep the original choice grid and removable entries. State is communicated with text and accessible roles, not color alone. Loading disables the relevant action. Errors keep drafts and offer retry. Clearing saved data requires a separate confirmation.

## Do's and Don'ts

- Show sample mode on every main workflow page; label the profile before submission.
- Preserve actual service names, instructions and missing-data states.
- Do not invent ratings, match percentages, product links, skin findings or medical certainty.
- Do not silently replace failed service output with sample content.
- Use fictional examples only in the explicit sample walkthrough.
- Keep screenshots from the running app and identify web previews as web previews.
