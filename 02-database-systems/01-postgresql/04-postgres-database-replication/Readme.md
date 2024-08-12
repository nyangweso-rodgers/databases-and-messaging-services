# Fundamentals Of PostgreSQL

## Table Of Contents

# How to Capture Changes in PostgreSQL

## 1. Listen/Notify

- **Listen/Notify** is an implementation of the publish-subscribe pattern.
- With **Listen/Notify**, a Postgres session (or connection) can "listen" to a particular channel for notifications. Activity in the database or other sessions can "notify" that channel. Whenever a notification is sent to a channel, all sessions listening to that channel receive the notification instantly.

## 2. Poll the table

- The simplest robust way to capture changes is to poll the table directly. Here, you need each table to have an `updated_at` column or similar that updates whenever the row updates. (You can use a trigger for this.) A combination of `updated_at` and `id` serve as your cursor. In this setup, your application logic that **polls** the table handles storing and maintaining the cursor.
- Downsides include:
  - you can't detect when a row is deleted. There's no way to "see" the missing row in the table. One remediation is to have a Postgres trigger fire on deletes, and store the id (and whatever other columns you want) in a separate table: e.g. deleted_contacts. Then, your application can poll that table to discover deletes instead.
  - The second downside is that you don't get diffs. You know this record was updated since you last polled the table, but you don't know what was updated on the record.
- Remarks:
  - Maybe deletes aren't a big deal for your use case or you don't care about diffs. If so, polling the table is a reasonable and simple solution for tracking changes.

## 3. Replication (WAL)

- **Postgres** supports streaming replication to other Postgres databases. In streaming replication, **Postgres** sends the **WAL** stream over a network connection from the primary to a replica. The standby servers pull these WAL records and replay them to keep their database in sync with the primary database.
- Streaming replication was built for streaming changes to other Postgres servers. But you can use it to capture changes for your application too.
- You first create a replication slot, like this:
  ```sql
    select * from
    pg_create_logical_replication_slot('<your_slot_name>', '<output_plugin>');
  ```
- Instead of consuming from the **WAL** directly, you can use tools like **Debezium** to do this for you. **Debezium** will consume the **WAL** from **Postgres** and stream those changes to a variety of sinks, including **Kafka** or **NATS**.
- Downsides include:
  - Using Postgres' replication facilities to capture changes is a robust solution. The biggest downside is complexity. Replication slots and the replication protocol are less familiar to most developers than the "standard" parts (i.e. tables and queries).
  - Along with this complexity is a decrease in clarity. If something with replication breaks or if there's a lag or things aren't working as expected, it can be a bit trickier to debug than the other solutions outlined here.
  - Another aspect worth mentioning is that **replication slots** may require tweaking `postgresql.conf`. For example, you may need to tweak parameters like `max_wal_senders` and `max_replication_slots`. So you'll need total access to the database to implement this solution.

## 4. Capture changes in an audit table

- In this approach, you set up a separate table for logging changes, e.g. `changelog`. That table contains column related to the record's modification, such as:
  - `action`: Was this an `insert`, `update`, or `delete`?
  - `old`: A jsonb of the record before the mutation. Blank for `inserts`.
  - `values`: A jsonb of the change fields. Blank for `deletes`.
  - `inserted_at`: Time the change occurred.
- To set this up, you need to create a trigger function that inserts into this table every time a change occurs. Then, you need to create triggers on all the tables you care about to invoke that trigger function.
- **Downsides** include:
  - This approach is similar to using a **replication slot**, but more manual. The trigger function and table design might work to start. But you'd likely need to make tweaks before deploying at scale in production.
- Remark:
  - The advantage over **replication slots** is that it's all "standard" Postgres. Instead of an opaque replication slot, you have an easy to query Postgres table. And you don't need access to postgresql.conf to make this work.

# Resources and Further Reading

1. [blog.sequinstream.com/all-the-ways-to-capture-changes-in-postgres](https://blog.sequinstream.com/all-the-ways-to-capture-changes-in-postgres/?ref=dailydev)
