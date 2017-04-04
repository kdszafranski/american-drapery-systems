# American Drapery Systems Measurement Tool

This application was built for American Drapery Systems (ADS) to help with their window and drapery measurement process.
It connects ADS customer profiles to respective data on building surveys done by ADS, the rooms/areas within the building and specific window measurements for each room.


[Try it here](https://ads-prime.herokuapp.com/)

Authentication has been disabled for demo purposes, allowing anyone to login, create, delete and modify data. Gmail account required for login.

## The Problem
As a commercial window treatment (blinds, shades etc.) company, ADS first surveys the buildings for which treatments have been requested.
Formerly, Evernote was the platform on which these measurements would be document, to later be manually entered into spreadsheets and other documentation.
This process was time consuming and repetitive, lacking organization. Furthermore, pictures of the job site and additional documentation had to be associated with each window treatment project.

## The Solution

A web application that brings automation to the ADS data entry and retrieval processes.

Features:
* Automatic copying of previously entered set of measurements (Proximal windows often have nearly identical characteristics).
* Live search filtering for all existing surveys.
* Storage of ADS customer information for auto-populating forms of future surveys.
* File and image uploading and hosting.
* PDF export of pertinent measurements and information on a given survey.
* Multi level read-write admin/user privlages.  


## Technologies Used

AngularJS | Angular Material | Javascript | HTML5 | CSS3

Firebase (authentication) | AWS.S3 | Node.js | Express.js | PostgreSQL | Heroku (hosting)


This application was developed by Alex Hermundson, Casey Hyde, Jake Iwen, & Jeff Kealy for the group project phase of Prime Digital Academy.
