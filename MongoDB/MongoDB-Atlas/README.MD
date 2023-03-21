# MongoDB Atlas

## Table Of Contents
- [Further Reading]()
  - [Dev Community - How to setup mongodb atlas?](https://dev.to/sachinchaurasiya/how-to-setup-mongodb-atlas-an7)
  - [Dev Community - Using MongoDB For Free on MongoDB Atlas](https://dev.to/wteja/using-mongodb-for-free-on-mongodb-atlas-4d41)

# Overview Of MongoDB Atlas
* __MongoDB Atlas__ is a cloud-hosted database service that offers a fully managed MongoDB experience. It is available on Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure.
* MongoDB Atlas provides a simple, intuitive interface that makes it easy to:
  * deploy, 
  * monitor, and 
  * scale your MongoDB deployments.


# MongoDB Cluster Pricing
* Atlas has different pricing levels, depending on the size and usage of your database.
* __Free Cluster Tier__:
  * allows you to deploy a free cluster which has a three-server replica set with 512 megabytes of storage.
  * Free tier clusters never expire.
  * Under the free tier you’ll have access to a subset of Atlas features, like 
    * Charts and 
    * Realm
  * If you are learning how to use MongoDB or creating small-scale applications, a free tier is a great option for storing your data.


# Guide to using MongoDB Atlas
* The main advantage of __MongoDB Atlas__ is that we can create and use our databases in the cloud. 
* We first need to create account in [MongoDB Atlas](https://www.mongodb.com/atlas/database). 
* Then we create organizations  
* Create a Database cluster in the organization.

# Steps to create a cluster on MongoDB Atlas
1. Create a MongoDB Atlas Account
   1. Under context, there is a dropdown where you can create a new project

2. Create a new cluster
3. You can keep everything as the default
4. Create a new user on the Database
5. You can find this in the Database Access
6. Whitelist your IP address
7. This can be find this in the Network Access
8. Allow access from anywhere (0.0.0.0/0)
9. Connect to your cluster
10. Go back to your cluster and press connect
11. Click on Connect your application
12. You will use your URI to connect to your database
13. It should look like this: "mongodb+srv://:@.mongodb.net/test?retryWrites=true, notice that the user and cluster#-dbname"

# Features of MongoDB Atlas
