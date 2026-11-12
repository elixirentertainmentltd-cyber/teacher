# Word Detective stage-only banks

The admin now selects only the school stage. The required letter length is set automatically:

| School stage | Required letters |
| --- | ---: |
| KS1 | 4 |
| KS2 | 5 |
| KS3 | 6 |
| GCSE (stored internally as KS4) | 7 |

The bulk paste/TXT/CSV workflow and 500-word limit remain unchanged. The editor displays the required length and marks mismatched words as invalid. The server derives the expected length from the stage instead of trusting the request's wordLength field. New banks cannot duplicate a stage.

**Existing banks remain stored unchanged** to avoid deleting curated words. Previously saved banks with other lengths or multiple banks for one stage are preserved, but may need review and manual consolidation. Choosing Edit loads their words and applies the new expected length; Save requires the uploaded word list to match it. Do not delete existing records automatically.

Pupil selection labels use GCSE instead of KS4. Daily puzzles retain their original word sets and are not changed by these admin settings.

## Manual test checklist
- Choose KS1, KS2, KS3, GCSE: required length shows 4, 5, 6, 7 respectively.
- Upload a list with one wrong-length word: Save disabled and validation message shown.
- Upload a valid TXT/CSV list: Save succeeds and pupil Practice mode shows the published bank.
- POST malformed or tampered wordLength: only correctly sized cases are accepted.
- Edit an older bank, verify words and clues remain until saved.
