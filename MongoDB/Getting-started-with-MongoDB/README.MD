# Getting Started with MongoDB

# Overview Of MongoDB
* __MongoDB__ is a leading NoSQL document-based database. There are many ways to run MongoDB; The two most used ones are 
  * "MongoDB Atlas," and 
  * Locally Installed MongoDB.

# Download and Installtion
* You can download a free __MongoDB database__ at https://www.mongodb.com Or get started right away with a __MongoDB cloud service__ at https://www.mongodb.com/cloud/atlas.

# What is MongoDB Atlas?
* __MongoDB Atlas__ is a fully-managed cloud database that handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice (AWS , Azure, and GCP)

# MongoDB Concepts
1. __MongoDB Server__ is a server-side component which can host multiple databases.
2. __Cluster__: are groups of servers that store your data
3. A __MongoDB database__ is a physical container of collections.
4. A __collection__ in MongoDB is equivalent to a relational database table and it exists within a single database. It includes a group of MongoDB documents.
5. __Document__: includes a set of key value pairs.  All documents include a dynamic schema which means documents which comprise of same collection do not need to have same set of fields and structure.
6. __Replica Sets__: are a set of a few connected mongodb instances that store the same data.

# MongoDB vs. MySQL - When should I use MongoDB instead of MySQL?
* _MySQL_ and _MongoDB_ are two rather specific types of databases. Generally you first pick the _storage method_ you want. 
    * The storage methods divide themselves into two groups: _relational_ and _NoSQL_. 
    * And the _NoSQL storage_ methods can be divided in about four groups (there’s a lot of division methods): 
      * column store, 
      * key-value store, 
      * graph store, 
      * document store.
    * _MongoDB_ is a _document store database system_.

* But just to compare the two: a _relational database_ is excellent for storing facts that all have intrinsic connections between them, that are the same every time. 
    * Let’s say you have a school, and there’s classes that have students, and students attend courses, and courses have teachers, who teach students, give out grades, e.t.c.,. Every noun in that sentence could be made into a table, with fixed, intrinsic relations with the other tables. A student never teaches classes, a teacher never receives grades, and so on. You could still make a relational database that allows students to teach classes, using association tables, but if that keeps happening you’ll probably want to have a different kind of database altogether.
  
* _NoSQL databases_ in general are for when the data you are storing does not have (that many) fixed and intrinsic inner relations. Say, you want to store your error logs. A log has a code, a message, a level, and so on. But those are all attributes of your log, not separate entities with many-to-many relations with other entities.
  
* Now, one of the other store methods I mentioned is _key-value store_. That means getting rid of all connections between data. You’ve got just a single row with a key and your value(s) (using JSON you can store as many values in a single field as you want). Document store can be called a variant of that, except it accommodates more complex values more easily.