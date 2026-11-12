# Word Detective banks: key stage + word length

The Word Detective admin studio now identifies each word bank by **key stage** (KS1, KS2, KS3 or KS4) and an **exact word length** (4–12 letters). Admins enter up to 100 words for that combination, including clues and example sentences. A server-side validator checks word length, uniqueness and clue content. The API prevents a second bank for the same key-stage/length combination.

Published banks are available to pupils in Practice mode under a stage-and-length label. The daily game is unchanged. Drafts remain admin-only, and no new database migration is needed: the existing schema stores generated bank titles and word length is determined from the saved word list.

## Existing banks

Pre-existing custom banks and their words are preserved. A bank that already has uniformly sized words is shown with that length. A legacy bank with mixed lengths appears as such in the admin list; to convert it to the new structure, edit the bank, select one length, and adjust words before saving. The existing bank is not deleted or silently shortened.

## Verify after deployment

Create KS2 / 5 letters, enter and publish several five-letter words, verify it appears in the game's Practice bank selector, edit and unpublish, and check draft visibility. Confirm saving a four-letter word in the five-letter bank is rejected and another KS2 / five-letter bank produces a duplicate-bank error. Review an existing mixed-length bank if one is present.
