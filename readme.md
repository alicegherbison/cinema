# Cinema

[Film Finder](https://alicegherbison.github.io/cinema) is a **work in progress** to help a family member plan cinema visits.

This is based off the frustration that the [current Cineworld website](https//www.cineworld.co.uk) organises film times by individual day and not film title, meaning you can only see one day at a time. This makes it **difficult** to:
* compare days to visit (choosing the most appropriate time for you based on the film you want to see)
* decide which day is best to see more than one film at a time
* plan to visit multiple times in a week (e.g. if you have a Cineworld Unlimited card)

This is used as a personal project to learn API calls, results display and how to table unknown-length returned data.

Requires a **registered API key** from [The List](https://api.thelist.co.uk) and returns all upcoming films at [Cineworld Fountainpark](https://www.cineworld.co.uk/cinemas/edinburgh), Edinburgh.

Results **exclude** any subtitled films, but include 3D, 4D and Cinebabies.

## Upcoming features
* move to Netlify
* use an environment variable for API key

## Personal learnings
* accessing JSON object properties
* how to add headers to the API call
* appropriate date formatting
* constructing HTML elements in JavaScript
