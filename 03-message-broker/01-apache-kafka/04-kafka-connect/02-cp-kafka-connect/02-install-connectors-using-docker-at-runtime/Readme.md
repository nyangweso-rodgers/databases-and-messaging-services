# Install Connectors Using Docker At Runtime

## Table Of Contents

# Install Connectors Using Docker At Runtime

- Typically, you will add **connector** instances once the worker process is running by manually submitting the configuration or via an external automation.
- When a **Docker container** is run, it uses the `Cmd` or `EntryPoint` that was defined when the image was built. [Confluent’s Kafka Connect image](https://hub.docker.com/r/confluentinc/cp-kafka-connect-base) will—as you would expect—launch the **Kafka Connect** worker.
  ```sh
    docker inspect --format='{{.Config.Cmd}}' confluentinc/cp-kafka-connect-base:5.5.0
  ```
- We can override that at runtime to install the **plugins** first. In **Docker Compose** this looks like this:
  ```yml
  # docker-compose.yml
  environment:
    CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components/"
  command:
    - bash
    - c
    - |
      # Install connector plugins
      # This will by default install into /usr/share/confluent-hub-components/ so make
      #  sure that this path is added to the plugin.path in the environment variables
      confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
      # Launch the Kafka Connect worker
      /etc/confluent/docker/run &
      # Don't exit
      sleep infinity
  ```
