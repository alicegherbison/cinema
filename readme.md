# Cinema

[Film Finder](https://cinema.netlify.com) is small webpage to help a family member plan cinema visits.

This is based off the frustration that the [current Cineworld website](https//www.cineworld.co.uk) organises film times by individual day and not film title, meaning you can only see one day at a time. This makes it **difficult** to:

- compare days to visit (choosing the most appropriate time for you based on the film you want to see)
- decide which day is best to see more than one film at a time
- plan visiting multiple times in a week (e.g. if you have a Cineworld Unlimited card)

This is used as a personal project to learn API calls, results display and how to table unknown-length returned data.

API key is from [The List](https://api.thelist.co.uk) and returns all upcoming films at various [Cineworld](https://www.cineworld.co.uk/)s in Edinburgh and Glasgow.

Results **exclude** any subtitled films, but include 3D, 4D and Cinebabies.

## Personal learnings

- how to use an environment variable for API key in local and prod
- accessing JSON object properties
- how to add headers to the API call
- appropriate date formatting
- constructing HTML elements in JavaScript
