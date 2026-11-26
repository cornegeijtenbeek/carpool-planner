# Roadmap

This file provides an overview of the direction this project is heading. The roadmap is organized in steps that focus on a specific feature.

## M1 Add component library

A component library is chosen and integrated. This will speed up future feature implementations. All current components will be replaced.

## M2 Add search

Users can find destination based on address or venue name.

## M3 Add database

- A database is created and integrated in the app.
- A configuration page is added where users can create, update, read, and delete members.

## M4 Add carpool areas

All known carpool parking areas are added to a dedicated layer. Once a plan has been made, only carpool locations in the vicinity of an intersection are displayed.

## M5 Shareable plan

After a carpool plan has been made, users can share this carpool plan. The URL contains an authorization token, without it the webpage will not be accessible. A featured image is auto created and included to give a high-level overview.

## M6 Shareable link

The shareable plan includes a link to an interactive map page where recipients will have:

- Basic zoom functionality.
- The ability to tap selected carpool areas.
- Redirection to the navigation app of choice.
