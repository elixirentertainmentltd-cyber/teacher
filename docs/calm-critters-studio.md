# Calm Critters: illustrated worlds and scene studio

Open **Admin → Calm Critters studio** using the existing website admin login.

1. Select a built-in scene to edit, or choose **New scene**.
2. Give the scene a name and description, then upload its landscape background.
3. Choose **Add creature**, enter its name and upload a PNG or WebP with a transparent background (JPEG is also accepted).
4. Set its position and size using the preview and sliders. Choose **Arrive earlier/later** to set discovery order. Each scene supports up to 60 creature types, with repeated individual arrivals during classroom use. Choose an automatic or explicit movement style (walk, hop, fly, swim, drift or still). Small insects can use sizes down to 1% with half-percentage steps.
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

## Roaming, repeated arrivals and size

Calm Critters creates a separate instance for every arrival, including repeated animals of the same species. Arrivals continue after every species has appeared; there is no one-per-species or twelve-animal limit. Each instance has its own identity, position and roaming phase. The classroom counter counts individuals; the collection tracks unique species. Browser performance remains dependent on the number of visible animals. Existing browser progress migrates to individual instances.

Walking animals patrol and turn around; rabbits hop, flying creatures drift through the air, and fish swim. Built-in widths and feet positions now distinguish insects, small mammals and larger animals. Transparent margins in sprite sheets are cropped by the renderer so image padding no longer determines apparent size. Admin-authored scenes retain their saved sizes.

**Animals run away** is enabled for this upgrade, including browsers that previously inherited the pause default. Teachers can still select Pause progress afterwards. Sustained excessive noise sends the whole group visibly off the edge. Departing artwork remains mounted until the escape animation ends; the collection is retained. A brief interruption is still tolerated, and three seconds of calm clears the weather. Reduced-motion preferences stop roaming and replace exits with a short fade. Pausing the activity freezes roaming.

In artwork preview, use **Add an animal** repeatedly to see duplicate arrivals, then **Test loud noise** and **Return to quiet** to exercise the shared sound-response logic with simulated levels. No microphone is used and preview animals are not saved to the classroom collection.

Additional automated checks cover brief versus sustained noise, repeated retreats, quiet recovery, pause-only behaviour, exit retention/re-entry, 150 arrivals of one species with unique identities, and relative sizing. The real microphone path still needs validation on a classroom device.

## Speech-detection correction

Microphone samples now use floating-point time-domain data and a logarithmic relative volume scale. The old byte/linear meter could leave quieter speech below the classroom goal. Browser echo cancellation, noise suppression and automatic gain control are requested off so speech is not deliberately attenuated before measurement. These remain relative readings, not calibrated sound-pressure levels. Work presets are Silent 22, Independent 38 and Partner work 58. The settings upgrade resets the goal to 38 and enables Animals run away once because old thresholds belonged to the previous scale; other saved preferences are retained. Calibrate again for the room if needed.

A sustained threshold breach now sends the entire group off-screen together. The preview clearly states that its microphone is OFF and provides a Use microphone button. The settings meter explicitly shows the live level, the goal, and whether the input is above or below it. Sound-response elapsed time now tolerates one-second frames so a slow projector does not stretch a few seconds of noise into a much longer wait. Brief-spike protection and collection retention are unchanged.

Regression checks cover synthetic quiet/voice waveforms through the same sample-conversion and noise-response functions used by the microphone path, slow frames, and retention of every group member during exit animations. A real classroom microphone is still needed for device-specific validation.

## Facing direction correction

The arctic wolf footage exposed an assumption that every illustration faced right. Native artwork direction is now tracked for all source sheets, with explicit left-facing entries for the woodland fox/deer, seahorse, arctic seal/fox/wolf/fish and meteor. The animation normalises artwork orientation before applying its walking, swimming, flying and escape directions. Saved scenes automatically inherit this correction through their image reference.

Travel and turning share the same duration and phase, including flying and swimming. Walking/swimming turn at the halfway point; the curved flight route turns at 70%, where its horizontal direction reverses. Escaping animals face their exit edge. New uploaded creatures can set **Original artwork faces → Left/Right** in the admin studio. The source artwork files remain unchanged.
