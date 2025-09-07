# Prometheus

## Table Of Contents

# Prometheus

- **Prometheus** is an open-source systems **monitoring** and **alerting** toolkit originally built at **SoundCloud** and later donated to the **Cloud Native Computing Foundation** (**CNCF**). It’s designed for **monitoring** highly dynamic container environments and microservices architectures.
- **Key features and concepts of Prometheus**:
  1.  **Multi-Dimensional Data Model**: **Metrics** are identified by metric name and key-value pairs called labels, enabling flexible querying and aggregation.
  2.  **PromQL**: A powerful query language for selecting and aggregating time series data, allowing complex monitoring and alerting rules.
  3.  **Pull-Based Scraping**: Prometheus actively pulls metrics from instrumented targets at regular intervals rather than receiving pushed data.
  4.  **Service Discovery**: Automatic discovery of monitoring targets from various sources like **Kubernetes**, **AWS**, and **Consul**.
  5.  **Time Series Database**: Optimized storage for time series data with efficient compression and long-term retention capabilities.
  6.  **Alerting**: Built-in alerting rules and integration with Alertmanager for handling alerts with deduplication, grouping, and routing.
  7.  **Multiple Visualization Options**: Integration with **Grafana** and built-in expression browser for data visualization.

# Components of Prometheus

## 1. Prometheus Server

- Main component that scrapes, stores, and serves time series data

## 2. Client Libraries

- Libraries for instrumenting application code in various programming languages

## 3. Push Gateway

- For supporting short-lived jobs that cannot be scraped directly

## 4. Exporters

- Tools that expose existing metrics from third-party systems in **Prometheus** format

# Resources and Further Reading

1. [wawand.co - prometheus](https://wawand.co/glossary/prometheus/?ref=dailydev)
