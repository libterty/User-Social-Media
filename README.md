# USER-SOCIAL-MEDIA

A simple web application for user social media

## Features

- listing users from user api
- searching users by title
- add users to your favorite list
- manage your favorite list
- submit comment to user and localstorage will process to save your content for next useage

### Searching
type the title of the movies in search bar.

### Favorite List
In index page, press the `bookmark` button on the movie to keep it into favorite list.
You can checkout the favorite list in `favorite.html`
press `x` to remove it from favorite list.

### Submit Comment 
In index page, you can sumbit your comment by pressing `Post` button or simply press enter.
You can checkout the comment in the `form-body` class.
Every enter comments will be store in to localstorage for next shown preparation.

### History Function
In index page, press the `fa-angle-double-down` or `History` to shown the store messages from localstorage where you have entered before
In additional to prevent double-click and close the review of history, the pressing button will change to `fa-angle-double-up`.

### Location and Email 
In index page, you can show and unshow the location and email inforamtion from user api.
The function supports with mouseover and mouseout events with classes change to prevent double click and unshowing the information.

### Improve the List view and favorite List
In index page, the List view icons are not supported several events action which will be fixed for next update.
In both index and favorite page, there are several bugs need to be fixed which will be updated for nex update.