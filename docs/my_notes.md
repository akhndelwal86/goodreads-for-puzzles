
- puzzle awards
- users can also create collections 
- tag functionality: where how to add tags
- barcode search
- need to figure what all is behind the sign in 
- mobile responsiveness
- makea a puzzle of the day list and an admin dashboad to pouplate it / what is the current logic
- some sort of curated list or smart list on browse page also 
- sharing functionlality
- modals to be redesigned
- add heart functionality to puzzle which directly adds to the users wishlist 
- rate it functionality on the puzzle cards
- Rating logic 
- make one more browse page with list categories etc 
-need to make more smart lists 
- need to standardise the call to actions
- will need admin dashboard also later for managing and moderatign 
- fix url naming also later
- Code and folder structure cleanup 
- add more featuers to the my puzzles section 
- how does abandon work in my puzzles


P1:  Implement Multi-Image Support for Puzzles
- Add additional_images JSONB column to puzzles table
- Update TypeScript types (main_image_url + additional_images array)
- Extend upload API for multiple images (max 4 additional)
- Build image gallery/carousel component for detail page
- Update puzzle creation flow for multi-image upload
 