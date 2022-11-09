

#### ------ Assumption ------

* The application is a web interface and might require access publicly so part of the challenge I am planning to add JWT token based security. Currently, react stores refresh token locally which can be improved for better security.

#### ------ Screenshots ------



![image description](/Users/vkumar/Desktop/images/img1.png)

#### ------ Tech stack ------
* Django restfamework (backend)
* React js (frontend)
* SQLite (database)
* Centos (demo deployment)

#### ------ Features ------

#### Secure rest api

  * Usage of proper HTTP status
  * Usage of serializers
  * Usage of custom exception handles for api rest
  * Usage of JWT
  * Usage for django's policy

#### Initial data load
  * Usage of Django's fixture for initial data upload (user data)
  * Usage of custom command (./manage.py initdata) for encrypting password of loaded user
	
#### Secure login at frontend

  * React hooks usage context usage
	
#### Accept multiple experiments
  * To allows comparison of historical data
  * And to support future data

#### Experimental data upload

  * Multiple file uploads via frontend
  * Validations
  * Map files data to objects
  * Usage to transactions for roll back
  * Upload/experiment creation progress bar
  * Some simple tricks to load data faster to database



