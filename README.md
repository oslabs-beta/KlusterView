# KlusterView

  <p align="center">
  <img src="./assets/Klusterview.png" style="width:400px"/>
  </p>

## Overview

<span style="color:red">**Placeholder Text**</span>

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

## Contribution and Development Roadmap

The state of current and planned features is as follows:

| Feature                                                                        | Status |
| ------------------------------------------------------------------------------ | ------ |
| Cluster- and node-level resource usage and pod status monitoring               | ✅     |
| Detailed pod-level resource usage and status monitoring                        | ✅     |
| Cluster- and node-level structural information via node graph                  | ✅     |
| Full TypeScript implementation                                                 | ✅     |
| Full support for Grafana Live features                                         | ⏳     |
| In-window support for dashboard customization                                  | ⏳     |
| Integration with Grafana Role-Based Access Control                             | 🙏🏻     |
| Live monitoring of pod-level error and information logs                        | 🙏🏻     |
| Integration with Grafana Alerts Management vis a vis resource usage and status | 🙏🏻     |

- ✅ = Ready to use
- ⏳ = In progress
- 🙏🏻 = Looking for contributors

### Running in Development Mode

Should you wish to contribute to this project (and you are encouraged to!), you may access a live-reloading development server by using our KlusterView development [Docker image](https://hub.docker.com/repository/docker/kyleslugg/klusterview-dev/) in place of that used in production. You may also build this image from source: simply run `docker build -f Dockerfile-dev -t klusterview/dev .`Once loaded, the development server may be accessed on NodePort 31002 in the manner of your choosing.

### Running Tests

<span style="color:red">**Defer to Mike and Jonathan here**</span>

### Pull Request Review Policy

## Meet the Team

  <table>
  <tr>
    <td align="center" >
      <img src="https://avatars.githubusercontent.com/u/35903887?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Kyle Slugg</b></sub>
      <br />
      <div style="display:flex; align-items:center; justify-content:center;">
        <a href="http://www.kyleslugg.co"><img src='./assets/world-wide-web.png' style="width:20px; margin:3px;"/></a>
        <a href="https://www.linkedin.com/in/kyle-slugg/"><img src='./assets/LI-In-Bug.png' style="width:17px; margin: 3px;"/></a>
        <a href="https://github.com/kyleslugg"><img src="./assets/github-mark.png" style="width:20px; margin:3px;"/></a>
      </div>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/64520371?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Shahmar Aliyev</b></sub>
      <br />
        <div style="display:flex; align-items:center; justify-content:center;">
          <a href="https://shahmaraliyev.com/"><img src='./assets/world-wide-web.png' style="width:20px; margin:3px;"/></a>
              <a href="https://www.linkedin.com/in/shahmaraliyev/"><img src='./assets/LI-In-Bug.png' style="width:17px; margin: 3px;"/></a>
              <a href="https://github.com/ShahmarAliyev"><img src="./assets/github-mark.png" style="width:20px; margin:3px;"/></a>
        </div>
    </td>
    <td align="center">
      <img src="https://d2culxnxbccemt.cloudfront.net/craft/content/uploads/articles/uploads/2013/05/Screen-Shot-2013-05-14-at-11.51.11-AM.png" width="140px;" alt=""/>
      <br />
      <sub><b>Mike Nunn</b></sub>
      <br />
      <div style="display:flex; align-items:center; justify-content:center;">
        <a href="?????"><img src='./assets/LI-In-Bug.png' style="width:17px; margin: 3px;"/></a>
        <a href="https://github.com/24juice22"><img src="./assets/github-mark.png" style="width:20px; margin:3px;"/></a>
      </div>
    </td>
     <td align="center">
      <img src="https://d2culxnxbccemt.cloudfront.net/craft/content/uploads/articles/uploads/2013/05/Screen-Shot-2013-05-14-at-11.51.11-AM.png" width="140px;" alt=""/>
      <br />
      <sub><b>Jonathan Tsai</b></sub>
      <br />
      <div style="display:flex; align-items:center; justify-content:center;">
        <a href="https://www.linkedin.com/in/jonathan-tsai95/"><img src='./assets/LI-In-Bug.png' style="width:17px; margin: 3px;"/></a>
        <a href="https://github.com/jonathantsai1995"><img src="./assets/github-mark.png" style="width:20px; margin:3px;"/></a>
      </div>
    </td>
