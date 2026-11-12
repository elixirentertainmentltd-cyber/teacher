# Word Detective: custom classroom banks
The existing TML admin dashboard gains a Word Detective studio tab. Admins create 1–100-word curriculum banks with a title, subject, KS1–KS4 stage, optional year-group label, publication toggle, clues and example sentences.
The backend uses the existing signed administrator cookie, same-origin validation, parameterised SQL, MySQL and public-versus-draft checks. No pupil accounts or tracking.
The data tables are created on first authorised admin use; migration script: `database/003_word_detective.sql`.
Published word banks are displayed as selectable **practice missions** on `/tools/word-detective`. Daily puzzles are deliberately unchanged and use the existing curated words. Draft banks never appear in the public API. No upstream code or artwork was copied.
Test: create a draft bank, confirm it is absent publicly; publish it, check that it appears on the game and that all words have correct clues; edit, unpublish, and delete; confirm unauthenticated API POST/DELETE requests are rejected.
