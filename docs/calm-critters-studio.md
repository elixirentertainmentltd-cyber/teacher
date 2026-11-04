# Calm Critters: illustrated worlds and scene studio

Open **Admin → Calm Critters studio** using the existing website admin login.

1. Select a built-in scene to edit, or choose **New scene**.
2. Give the scene a name and description, then upload its landscape background.
3. Choose **Add creature**, enter its name and upload a PNG or WebP with a transparent background (JPEG is also accepted).
4. Set its position and size using the preview and sliders. Choose **Arrive earlier/later** to set discovery order. Each scene supports up to 60 creatures.
5. Leave **Published** unticked for a private draft, or tick it and choose **Save and publish scene**. Drafting an existing scene also hides it from the public activity. Save before leaving the editor.

Images use the existing persistent `TML_UPLOAD_DIR` and MySQL media records. The studio creates its `tml_calm_scenes` table on first authenticated save; `database/002_calm_critters.sql` can alternatively be run in advance if the app's MySQL account cannot create tables. The earlier core CMS migration remains required for uploads. Uploaded images stay private until referenced by a published scene. Published media may remain cached for up to five minutes after unpublishing, matching the existing media endpoint's cache policy.

The editor detects concurrent saves and asks an admin to reload instead of overwriting the newer revision. Files are not deleted when a creature is removed from a scene. Settings and the classroom collection remain local to the classroom browser; scene definitions are shared through MySQL.

## Classroom view

The scene fills the browser with original illustrated artwork. The world picker, guide, collection, settings and full-screen controls remain accessible. The settings drawer contains the lesson timer, microphone selection, work presets, sound goal, two-stage quiet/talking calibration and creature arrival timing. Brief noise is tolerated. Sustained noise clouds the habitat; the optional retreat setting hides one creature and then another every five seconds until calm returns. The collection remembers discoveries even after a retreat or scene reset.

**Preview the artwork without a microphone** lets staff try worlds and reveal creatures without microphone permission. Preview discoveries do not enter the classroom collection. Sound detection requires HTTPS and a microphone; this browser session had no usable audio input, so real microphone calibration and device switching need testing on the classroom computer.

## Artwork provenance

Seven backgrounds and seven transparent sprite atlases were created for this implementation using built-in image generation. They are stored in `public/calm-critters/<scene>/background.webp` and `sprites.webp`. Each atlas has twelve cells in four columns and three rows; the scene data references the cell with `#0` to `#11`. The artwork and interface do not use Shy Safari source files or artwork.

Prompt brief: richly detailed painted storybook environments with natural textures and atmospheric depth, clear foreground space for wildlife, no UI or text; recognisable full-body creatures with natural proportions, detailed fur/feathers/scales and consistent lighting, arranged in a four-by-three transparent atlas. Backgrounds cover meadow, coral bay, space, woodland, rainforest, polar coast and prehistoric river valley. A second image-generation pass removed backgrounds around the creature cutouts. The atlas renderer also accepts ordinary uploaded creature images.

## Verification

- Production Next.js build and TypeScript checks pass.
- `node --test scripts/calm-critters.test.cjs`: default scene integrity, actual asset presence, malformed input, duplicate identity, bounds and external image rejection, and catalogue fallback without configured MySQL.
- Browser checks cover switching all seven worlds, artwork preview, settings presets, timer, local admin login, loading built-in scenes, creature creation, naming, positioning and arrival reordering.
- Live MySQL persistence, persistent upload permissions and real microphone input still require deployment verification. No production database credentials were present in this development workspace.
