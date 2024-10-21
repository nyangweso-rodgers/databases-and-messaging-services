# Replica Set in MongoDB

# What is Replication?

- **Replication** is the process of creating multiple copies of the same data to increase the availability and stability. Technically, if a node is down, we can forward the incoming requests to another node while making the previous one back to life. Replication prevents data loss since you always have a copy of your data somewhere; it can be in the same physical server or distributed across many regions.

# Replica in MongoDB

- In **MongoDB**, A **replica** set is a group of **mongod** processes that maintain the same data set. It follows a specific structure where we have a first node called **primary** that receives the that then, these data are synced between the others node called **secondary**.

# Requirements

- A **replica set** requires a minimum of two voting members to function properly. These members can elect a primary if one fails.

# Create a Replica Set with Docker compose

- How to successfully set up a **MongoDB replica set** with **Docker Compose**. This ensures that you have a highly available and resilient MongoDB deployment.

## Step 1: Create a `docker-compose.yml` file

- Create a `docker-compose.yml` file with the following content:

  ```yml
  version: "3"
  services:
    ######################################
    # mongo
    #
    mongo:
      image: mongo:latest
      container_name: mongo
      ports:
        - "27017:27017"
      #env_file:
      #- .env # Using the shared root .env file
      #environment:
      #MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
      #MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
      #MONGO_INITDB_DATABASE: ${MONGO_INITDB_DATABASE}

      #command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
      #command: ["--replSet", "my-replica-set", "--bind_ip_all", "--port", "27017"]
      volumes:
        - mongo_volume:/data/db
        #- ./init-replica-set.js:/docker-entrypoint-initdb.d/init-replica-set.js
      #healthcheck:
      #test: test $$(echo "rs.initiate({_id:'my-replica-set',members:[{_id:0,host:\"mongo:27017\"},{_id:1,host:\"mongo-secondary1:27018\"},{_id:2,host:\"mongo-secondary2:27019\"}]}).ok || rs.status().ok" | mongo --port 27017 --quiet) -eq 1
      #interval: 10s
      #start_period: 30s
      #entrypoint: ["/usr/bin/mongod", "--replSet", "rsmongo", "--bind_ip_all"]
      entrypoint: ["mongod", "--replSet", "rsmongo", "--bind_ip_all"]
    ######################################
    # mongo-secondary1
    #
    mongo-secondary1:
      image: mongo:latest
      container_name: mongo-secondary1
      ports:
        - "27018:27018" # Map different port for each member
      #command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
      #command: ["--replSet", "my-replica-set", "--bind_ip_all", "--port", "27018"]
      volumes:
        - mongo_secondary1_volume:/data/db
      #entrypoint: ["/usr/bin/mongod", "--replSet", "rsmongo", "--bind_ip_all"]
      entrypoint: ["mongod", "--replSet", "rsmongo", "--bind_ip_all"]
    ######################################
    # mongo-secondary2
    #
    mongo-secondary2:
      image: mongo:latest
      container_name: mongo-secondary2
      ports:
        - "27019:27019" # Map different port for each member
      #command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
      #command: ["--replSet", "my-replica-set", "--bind_ip_all", "--port", "27019"]
      volumes:
        - mongo_secondary2_volume:/data/db
      #entrypoint: ["/usr/bin/mongod", "--replSet", "rsmongo", "--bind_ip_all"]
      entrypoint: ["mongod", "--replSet", "rsmongo", "--bind_ip_all"]
  ```

- Here, We created three **Docker containers** from **MongoDB images**.

## Step 2: Connect `mongosh` to one of the mongod instances.

- Start the **MongoDB shell** from the primary container:
  ```sh
    docker exec -it mongo bash
    mongosh
  ```

## Step 3: Initiate the replica set.

- Run `rs.initiate()` to initiate the replica set with the default configuration:

  ```sh
    docker exec -it mongo bash
    mongosh
    rs.initiate()
  ```

## Step 4: View the replica set configuration

- Use `rs.conf()` to display the [replica set configuration object]():
  ```sh
    rs.config()
  ```
- The replica set configuration object resembles the following

  ```sh
    {
      _id: 'rsmongo',
      version: 1,
      term: 1,
      members: [
        {
          _id: 0,
          host: 'c57886d0a663:27017',
          arbiterOnly: false,
          buildIndexes: true,
          hidden: false,
          priority: 1,
          tags: {},
          secondaryDelaySecs: Long('0'),
          votes: 1
        }
      ],
      protocolVersion: Long('1'),
      writeConcernMajorityJournalDefault: true,
      settings: {
        chainingAllowed: true,
        heartbeatIntervalMillis: 2000,
        heartbeatTimeoutSecs: 10,
        electionTimeoutMillis: 10000,
        catchUpTimeoutMillis: -1,
        catchUpTakeoverDelayMillis: 30000,
        getLastErrorModes: {},
        getLastErrorDefaults: { w: 1, wtimeout: 0 },
        replicaSetId: ObjectId('66576c617a9b2ee5c324b737')
      }
    }
  ```

## Step 5: Ensure that the replica set has a primary

- Use `rs.status()` to identify the primary in the replica set.
  ```sh
    rs.status()
  ```
- Output:
  ```sh
    {
      set: 'rsmongo',
      date: ISODate('2024-05-29T18:47:21.441Z'),
      myState: 1,
      term: Long('1'),
      syncSourceHost: '',
      syncSourceId: -1,
      heartbeatIntervalMillis: Long('2000'),
      majorityVoteCount: 1,
      writeMajorityCount: 1,
      votingMembersCount: 1,
      writableVotingMembersCount: 1,
      optimes: {
        lastCommittedOpTime: { ts: Timestamp({ t: 1717008436, i: 1 }), t: Long('1') },
        lastCommittedWallTime: ISODate('2024-05-29T18:47:16.882Z'),
        readConcernMajorityOpTime: { ts: Timestamp({ t: 1717008436, i: 1 }), t: Long('1') },
        appliedOpTime: { ts: Timestamp({ t: 1717008436, i: 1 }), t: Long('1') },
        durableOpTime: { ts: Timestamp({ t: 1717008436, i: 1 }), t: Long('1') },
        lastAppliedWallTime: ISODate('2024-05-29T18:47:16.882Z'),
        lastDurableWallTime: ISODate('2024-05-29T18:47:16.882Z')
      },
      lastStableRecoveryTimestamp: Timestamp({ t: 1717008426, i: 1 }),
      electionCandidateMetrics: {
        lastElectionReason: 'electionTimeout',
        lastElectionDate: ISODate('2024-05-29T17:56:49.844Z'),
        electionTerm: Long('1'),
        lastCommittedOpTimeAtElection: { ts: Timestamp({ t: 1717005409, i: 1 }), t: Long('-1') },
        lastSeenOpTimeAtElection: { ts: Timestamp({ t: 1717005409, i: 1 }), t: Long('-1') },
        numVotesNeeded: 1,
        priorityAtElection: 1,
        electionTimeoutMillis: Long('10000'),
        newTermStartDate: ISODate('2024-05-29T17:56:49.907Z'),
        wMajorityWriteAvailabilityDate: ISODate('2024-05-29T17:56:49.935Z')
      },
      members: [
        {
          _id: 0,
          name: 'c57886d0a663:27017',
          health: 1,
          state: 1,
          stateStr: 'PRIMARY',
          uptime: 3315,
          optime: { ts: Timestamp({ t: 1717008436, i: 1 }), t: Long('1') },
          optimeDate: ISODate('2024-05-29T18:47:16.000Z'),
          lastAppliedWallTime: ISODate('2024-05-29T18:47:16.882Z'),
          lastDurableWallTime: ISODate('2024-05-29T18:47:16.882Z'),
          syncSourceHost: '',
          syncSourceId: -1,
          infoMessage: '',
          electionTime: Timestamp({ t: 1717005409, i: 2 }),
          electionDate: ISODate('2024-05-29T17:56:49.000Z'),
          configVersion: 1,
          configTerm: 1,
          self: true,
          lastHeartbeatMessage: ''
        }
      ],
      ok: 1,
      '$clusterTime': {
        clusterTime: Timestamp({ t: 1717008436, i: 1 }),
        signature: {
          hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
          keyId: Long('0')
        }
      },
      operationTime: Timestamp({ t: 1717008436, i: 1 })
    }
  ```

## Step 6: Add a Secondary Nodes to the Replica Set

- To add a new secondary member with default vote and priority settings to a new **replica set**, you can call the `rs.add()` method with:
  ```sh
    rs.add( { host: "mongo-secondary1:27018" } )
  ```
- and,
  ```sh
    rs.add( { host: "mongo-secondary2:27019" } )
  ```

## Step 7: Confirm the Configuration

- Verify that the new configuration is applied by using `rs.config()` again:

  ```sh
    rs.config()
  ```

- Example Outputs:
  - Initial Configuration Output:
    ```sh
      {
      _id: 'rsmongo',
      version: 1,
      members: [
        {
          _id: 0,
          host: 'c57886d0a663:27017',
          priority: 1,
          votes: 1
        }
      ],
      settings: {
        chainingAllowed: true,
        heartbeatIntervalMillis: 2000,
        heartbeatTimeoutSecs: 10,
        electionTimeoutMillis: 10000,
      }
    }
    ```
  - Final Configuration Output:
    ```sh
      {
        _id: 'rsmongo',
        version: 3,
        term: 1,
        members: [
          {
            _id: 0,
            host: 'c57886d0a663:27017',
            arbiterOnly: false,
            buildIndexes: true,
            hidden: false,
            priority: 1,
            tags: {},
            secondaryDelaySecs: Long('0'),
            votes: 1
          },
          {
            _id: 1,
            host: 'mongo-secondary1:27018',
            arbiterOnly: false,
            buildIndexes: true,
            hidden: false,
            priority: 1,
            tags: {},
            secondaryDelaySecs: Long('0'),
            votes: 1
          },
          {
            _id: 2,
            host: 'mongo-secondary2:27019',
            arbiterOnly: false,
            buildIndexes: true,
            hidden: false,
            priority: 1,
            tags: {},
            secondaryDelaySecs: Long('0'),
            votes: 1
          }
        ],
        protocolVersion: Long('1'),
        writeConcernMajorityJournalDefault: true,
        settings: {
          chainingAllowed: true,
          heartbeatIntervalMillis: 2000,
          heartbeatTimeoutSecs: 10,
          electionTimeoutMillis: 10000,
          catchUpTimeoutMillis: -1,
          catchUpTakeoverDelayMillis: 30000,
          getLastErrorModes: {},
          getLastErrorDefaults: { w: 1, wtimeout: 0 },
          replicaSetId: ObjectId('66576c617a9b2ee5c324b737')
        }
      }
    ```

# Resources and Further Reading

1. [mongodb.com/docs/manual/replication/](https://www.mongodb.com/docs/manual/replication/)
2. [flowygo.com/en/blog/mongodb-and-docker-how-to-create-and-configure-a-replica-set/](https://flowygo.com/en/blog/mongodb-and-docker-how-to-create-and-configure-a-replica-set/)
3. [https://www.upsync.dev/2021/02/02/run-mongo-replica-set.html](https://www.upsync.dev/2021/02/02/run-mongo-replica-set.html)
4. [https://github.com/UpSync-Dev/docker-compose-mongo-replica-set](https://github.com/UpSync-Dev/docker-compose-mongo-replica-set)
