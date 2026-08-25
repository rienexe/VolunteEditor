
# VolunteEditor

**VolunteEditor** is a prototype Volunteer Management System focusing on creating and managing volunteering opportunities via user-centred editors. It was developed as part of a Bachelor's thesis and serves as an experimental platform for investigating different visual modelling approaches in low-code-style development environments.

## Project Overview

VolunteEditor provides two main parts:

-   **Frontend** – A Vue-based web application providing the user interface for volunteers and organisations.
-   **Backend** – A Node.js/Express REST API responsible for authentication, data management, file uploads and the application's business logic.

## Key Features

### For volunteers

Volunteers can use the platform to:

-   browse registered organisations
-   view organisation profiles
-   browse available volunteering opportunities
-   view detailed information about individual tasks
-   sign in as a volunteer

### For organisations

Authenticated organisation users can manage their volunteering activities through a dedicated dashboard:

-   edit the organisation's landing page
-   create and edit volunteering tasks
-   define task schemas
-   create and edit workflows
-   assign workflows to individual tasks

## Getting Started

### Prerequisites

The project requires both the frontend and backend to be installed and running separately. For Login no password is needed - leave field empty.

### Demo Accounts

The repository contains predefined demo users for testing the prototype.

#### Organisation accounts

| ID     | E-Mail         | Name                              |
|--------|----------------|-----------------------------------|
| org001 | org001@org.com | Alters- und Pflegeheim Musterdorf |
| org002 | org002@org.com | Die Stadtdiener                   |
| org003 | org003@org.com | MitDirundMir                      |
| org004 | org004@org.com | Mustergabe                        |
| org005 | org005@org.com | Museumsbahn Musterdorf (MbMd)     |
| org006 | org006@org.com | Börsenschluss                     |
| org007 | org007@org.com | Alles für die Bohne               |
| org008 | org008@org.com | Musterstadt Eventmanagement       |
| org009 | org009@org.com | Mustergültige Jugend              |

#### Volunteer account
| ID     | E-Mail         |
|--------|----------------|
| vol001 | vol001@vol.com |
