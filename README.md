

#### ------ Assumption ------

* The application is a web interface and might require access publicly so part of the challenge I am planning to add JWT token based security. Currently, react stores refresh token locally which can be improved for better security.


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

#### Setup Frontend (port:3000)
```
cd experiment_frontend
npm install
npm start
```
#### Setup Backend (port:8000)

Install dependencies
```
pip install -r requirements.txt
```

Migrate

```
./manage.py makemigrations
./manage.py migrate
```
Load first user for login
```
./manage.py loaddata user_data.json
//encrypt password of loaded user/s
./manage.py initdata
```

Run
```
./manage.py runserver  
```






#### ------ Screenshots ------

#### Login Screen
![image description](/images/img1.png)

#### Empty dashboard
![image description](/images/img2.png)

#### Experiment upload screen
![image description](/images/img3.png)

#### Plot and filters
![image description](/images/img4.png)

#### Experiment switch
![image description](/images/img5.png)


