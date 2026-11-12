# Word Detective (Teach Me a Lesson)
Original, free browser-based word deduction game for UK KS1–KS4 learners, integrated at `/tools/word-detective`.
Inspired by the concept of Vocab Sleuth: https://github.com/teacherdotdev/vocab-sleuth (Apache-2.0). The code, clues, UI and word sets in this feature are original TML implementations; no upstream source files are copied.
## Gameplay
- Select KS1, KS2, KS3 or KS4 and choose a daily or practice case.
- Guess a clue-based word in six attempts, with duplicate-aware green/yellow/grey letter feedback.
- Tap the accessible onscreen keyboard or type with a physical keyboard.
- Optional hint shows the first and last letters; the answer and an example sentence appear when a case ends.
- Daily answer is deterministic per UK calendar date and stage. Daily attempts are stored in localStorage on the current device; practice never persists or reports data to a server.
- All words and educational clues live in `lib/word-detective.ts`.
## Limitations
This first version accepts any A–Z guess of the correct length and is not a dictionary validator. It avoids accidentally rejecting valid British English or age-appropriate words. The current curated banks contain ten cases per key stage; expand them before launching a multi-year daily content programme.
## Future work
Teacher-managed case banks could integrate with the existing TML admin/CMS following the site's access controls. Consider adding topic-specific banks and printable case sheets.
