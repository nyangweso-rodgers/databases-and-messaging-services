# Data Warehouse

## Table Of Contents

# Data Warehouse Concepts

## 1. Dimensional Modelling in Data Warehousing

- A **Dimensional Model** is a database structure that is optimized for online queries and **Data Warehousing** tools. It is comprised of "**fact**" and "**dimension**" tables. A "**fact**" is a **numeric value that a business wishes to count or sum**. A "**dimension**" is essentially an entry point for getting at the facts.
- Elements of Dimensional Modelling:

  1. **Fact**: are the measurements/metrics
  2. **Dimension**: provides the context surrounding a business process event. i.e., they give who, what, where of a fact. e.g., customer name, location, product name. e.t.c.,
  3. **Atrributes**:

     - are the various **characteristics** of the **dimension** in **dimensional data modeling**.
     - Attributes are used to earch, filter, or classify facts. E.g., in the **Location** dimension, the **atributes** can be:
       - State
       - Country
       - Zipcode e.t.c.,
     - **Remark**:
       - Dimension Tables contain Attributes

  4. **Fact Table**:

     - this is a **primary table** in **dimension modelling**. A **fact table** contains:
       - Measurements/facts
       - Foreign Key to dimension table

  5. **Dimension Table**:
     - A dimension table contains dimensions of a fact.
     - Dimension tables are de-normalized tables.
     - The Dimension Attributes are the various columns in a dimension table
     - Dimensions offers descriptive characteristics of the facts with the help of their attributes
     - No set limit set for given for number of dimensions
     - The dimension can also contain one or more hierarchical relationships

- **Steps for Dimensional Modelling**

  1. Identify Business Process

  2. **Identify Grain (level of detail)**: describes the level of detail for the business problem/solution. It is the process of identifying the lowest level of information for any table in your data warehouse.

  3. **Identify Dimensions**: Dimensions are nouns like date, store, inventory, etc. These dimensions are where all the data should be stored. For example, the date dimension may contain data like a year, month and weekday.

  4. **Identify Facts**: This step is co-associated with the business users of the system because this is where they get access to data stored in the data warehouse. Most of the fact table rows are numerical values like price or cost per unit, etc.

  5. **Build Schema**: In this step, you implement the **Dimension Model**. A schema is nothing but the database structure (arrangement of tables). There are two popular schemas:

     - **Star Schema**: The star schema architecture is easy to design. It is called a star schema because diagram resembles a star, with points radiating from a center. The center of the star consists of the fact table, and the points of the star is dimension tables. The fact tables in a star schema which is third normal form whereas dimensional tables are de-normalized.

     - **Snowflake Schema**: The snowflake schema is an extension of the star schema. In a snowflake schema, each dimension are normalized and connected to more dimension tables.

## 2. Slowly Changing Dimension (SCD)

# Resources
