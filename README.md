Project 2 - Node.js
Inleverdatum maandag om 23:59 Punten 30 Inleveren een bestandsupload Bestandstypen zip en 7z Beschikbaar tot 15 jan op 23:59
Content
For this project you will have to build an API using Node.js. To clarify: we are talking about a dynamic API, so one that will store and read data dynamically from a database to persistently save information. A static page will not suffice!

It is not allowed to just copy/paste an online tutorial to finish this project, but you are allowed to use them as a basis for your own website if you:
- understand the code you are using and can explain what it does in your own words
- you correctly cite your sources

 

You are free to choose the type of API that you build, for example for the small business of your parents, a local sports club, music festival, video game, ... As long as it meets the standards described in this assignment. If you wish, you can use the same database and tables as your Laravel project.

Functional minimum requirements
As the name indicates, these requirements are the minimum features that need to be present.

You have an API with at least the following features:

Two default CRUD interfaces, meaning that for 2 entities (such as news post, comment, ...) you can
Create a new instance of it in the database
Update an existing instance with new data
Delete records
Return a list of all the records
Basic validation
Fields submitted to the API cannot be empty where logical (for example, you might not need to fill in both a mobile phone number at a landline)
Numeric fields cannot accept string
A first name cannot contain numbers
... 
One instance of returning values with a limit and offset
One instance of returning values after you have searched for a value on one field
Extra requirements
If you perfectly implement every single minimal requirement you will get a passing grade for the project. If you wish to excel in your result, you can add extra features to your API. Below you can find a list of example features you can add:

Advanced validation, going beyond simple requirements such as values being blank or not. For example, an "end date" needs to be after a "start date", a phone number needs to be formatted like '+32 444 44 44 44', ...
Advanced search, on more than one field
Advanced sorting
Limiting results to authenticated users
...
If you're unsure about how good a feature might be, feel free to ask the teacher.

Technical requirements
Aside from the functional requirements, there are a few guidelines for the technical aspect of the project as well:

You are free to choose which type of database you want to use and are not limited to MySQL or mongodb
You can choose to either use the built-in http module or use express
You need to use the proper HTTP verb for the endpoints, for example
GET for read-only access to a resource
POST to create a new instance
PUT to update an existing instance
...
GIT
The use of git is required. Remember to commit often and to add logical commit messages. This allows me to follow along with your progress, but it also provides you with a fallback when something does go wrong with your code.

Important: add the 'node-modules' folder to your .gitignore file.

Add a link to your GitHub repo for this project to your "readme" file.

Submitting
Aside from the GitHub repo, you'll also have to submit a .zip of your project on Canvas. You name your file: bw_firstname_lastname_node.zip. In the zip you will delete the node-modules folder. 

Handing in too late will result in a 0. I only accept submissions through Canvas. Canvas not working because you try to submit your project at the very last minute is not an excuse for handing in too late.