# Databases

## Table Of Contents
- [SQL Databases]()
  - [PosgreSQL]()
  
- [NoSQL Databases](https://github.com/nyangweso-rodgers/My-Databases/tree/main/NoSQL-Databases)
    1. [MongoDB](https://github.com/nyangweso-rodgers/My-Databases/tree/main/MongoDB)

    2. [Redis](https://github.com/nyangweso-rodgers/My-Databases)

- [Data Warehousing](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse)
    - [Dimensional Modeling in Data Wareousing](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse/Dimensional-Modeling-in-Data-Warehousing)
    - [Google BigQuery](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse/Google-BigQuery)

# Introduction to Databases
* __Database__: application that allow one to store and access data. _a database is a collection of data that is organized in a manner that facilitates ease of access, as well as efficient management and tracking._. a database is made up of __tables__ that store relevant information.

# Definition of Terms in Databases
1. __Database Table__ : a table stores and displays data in a structtured format consisting of columns and rows. web applications use them to provide dynamic functions to users e.g., displaying products, content management, and user management.

2. __Primary Key__: field in the table that uniquely identifies the table records. _Features if a Primary Key include_:
    * it must contain a unique value for each row
    * it cannot contain NULL values
    
3. __Database Management System__ (__DBMS__) : software to create, define and manage database. e.g., _Microsoft_, _Oracle_, _IBM_, _Apache_, _SQLServer_, _DB2_, _Cassandra_, _Firebind, _MongoDB_, _FileMaker_,  _MySQL_, _PostgreSQL_.

# Setting Python's Virtual Environment for this Prroject
1. Navigate to the root directory of your project using the terminal or command prompt.
2. Run the following command to create a new virtual environment: This will create a new directory called env in your project directory, which contains the virtual environment.

    ```sh
        python -m venv venv
    ```
3. Activate the virtual environment by running the following command: This will activate the virtual environment and change your shell's prompt to indicate that you're working within the virtual environment.

    ```sh
         source env/bin/activate  # For Linux or macOS
         source venv/Scripts/activate  # For Windows
    ```
4. You can now install any required modules using pip, which will install them within the virtual environment. For example:

    ```sh
        pip install numpy
    ```
5. This will install the numpy module within the virtual environment, making it available for use in your project.
6. it's a best practice to use a separate file, usually called requirements.txt or Pipfile, to list the required dependencies for your project. You can generate this file automatically using pip freeze, which will list all of the installed packages and their versions within your virtual environment. Here's an example of how to generate a requirements.txt file:

    ```sh
        pip freeze > requirements.txt
    ```
7. With this approach, others can create their own virtual environment and install the required dependencies using the requirements.txt file, by running the following command:
    
    ```sh
        pip install -r requirements.txt
    ```