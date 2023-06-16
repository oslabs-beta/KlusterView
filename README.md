# KlusterView

## Overview

Placeholder Text

## Installation

Klusterview is built atop the Grafana, Prometheus, and Kube State Metrics packages. The application will look for Grafana and Prometheus as services (by the names `grafana` and `prometheus`) in the `monitoring-kv` namespace, and will assume that Kube State Metrics has been installed on the cluster undergoing monitoring. **Either of the following methods will install each of these packages in the appropriate namespace and under the appropriate name**.

### Helm Chart

KlusterView is most easily installed using its Helm chart, held in this repository. To install via this method, please ensure that the following dependencies are met, and follow the steps below.

#### Prerequesites

- Kubernetes 1.16+
- Helm 3+

#### Get Helm Repository Info

```shell
helm repo add klusterview "<-----URL WILL GO HERE----->"
helm repo update
```

#### Install Helm Chart

```shell
helm install [Release Name] klusterview/klusterview
```

### Manual Installation

#### Prerequisites

- Kubernetes 1.16+
- Sufficient privileges to create objects via Kubectl

#### Installation

From the project's `scripts` directory, execute `./setup.sh` with root user permissions. This will intruct Kubectl to install KlusterView and its dependencies using the manifests contained in the `deployment/_manual_install` directory, which are functionally identical to those contained in the Helm chart.

## Accessing the Application

KlusterView will run on Port 31001 of each node. To display the application, access this port directly via your web browser, or use the tool of your choice (port forwarding, tunneling, MiniKube's `service` command, etc.) to forward the relevant port to your `localhost`.
