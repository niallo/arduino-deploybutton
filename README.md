Deploy Button
=============

![Deploy Button](https://raw.github.com/niallo/arduino-deploybutton/master/deploybutton.png)

Uses an Arduino and Node.JS (with [Johnny
Five](https://github.com/rwldrn/johnny-five)) to enable literal push-button
deploy of your app to Heroku. It uses a physical push button to trigger deploy start.

Depressing the button will begin the deploy process. Red status LED will flash
during deploy and when finished, solid green or solid red LED will light to
represent success/failure.

