# Word Detective: bulk word upload

The Word Detective Studio editor accepts a pasted one-word-per-line or comma-separated word list, or a UTF-8 `.txt`/single-column `.csv` file. Choose key stage and word length first. Preview shows valid unique words, duplicates and invalid entries; all words must match the specified length. Save up to 500 words in one bank. Uploads are read locally in the browser and submitted through the existing authenticated admin API.

Word-only uploads intentionally do not fabricate definitions. New words get a generic Word Detective letter-game clue and a post-game answer sentence. Existing manual clues and examples are preserved when words remain in a bank during editing. Each update replaces that bank's list with the pasted list, so words removed from the text are removed from the bank when saved. The shared daily challenge is unchanged.

Verify: paste 5-letter words and save; upload .txt and .csv single-column lists; reject wrong word lengths; eliminate duplicate words; edit existing banks while retaining existing authored clues; verify published bank appears in Practice mode; confirm drafts are hidden from the public endpoint.
