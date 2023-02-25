# Indexing

# SQL Indexing
* It is a technique, using which we can improve search performance in our database. Helps in quickly searching the records in the table. When we search any record in DB, it goes to the index and finds the exact location of the record and skips the unnecessary records in between and quickly gives us the results.

* Different DB vendors have introduced their own types of __Index__. Many DB has even more than one type of Index. But more or less their purpose is the same. The query syntax to define the index may also vary based on the DB vendor.

*  _Remarks_;
    - _When to use Indexing?_: Always remember Indexing should be only applied to the column which is frequently being used in the where clause. 

    - Indexing works great on columns which contain numeric data.

    - Indexing on primary key columns is not required because most modern databases implicitly apply indexing to them.
    
    - _When Not to Use Indexing?_: If DB has fewer records no need to use indexing. it will overkill the purpose of Indexing. Try to avoid Indexing on a column containing long text-based data, in such case Indexing will be quite poor.
    
    - Don't apply it on every column, otherwise, this will degrade the write and update operation on DB. As every write and update operation also updates the Index.