# Introducing: KlusterView

### A lightweight, ready-to-deploy Kubernetes metrics visualizer for the rest of us

Anyone who works regularly with Kubernetes environments knows that, despite the array of tools on the market for monitoring the health and performance of a cluster, knowing precisely what metrics are meaningful (and how to access them for quick reference) can be challenging. This is doubly true for individual developers as well as small and midsize enterprises without large dedicated DevOps teams: the gold standard for performance monitoring in Kubernetes (and other complex orchestration platfoms), the Prometheus/Grafana/Kube State Metrics (PGK) stack, requires extensive up-front configuration, and offers a dizzying array of metrics and visualization options that can bewilder the uninitiated.

Enter KlusterView: a universally compatible plug-and-play visualization tool that distills the best of what the PGK stack has to offer into a streamlined interface, offering a concise and crystal-clear picture of cluster health without any platform-specific setup or specialized configuration. Users can install KlusterView and its dependencies in a single step (details here), and be up and running in minutes, putting critical performance information within a moment's reach wherever and whenever you access your cluster.

## KlusterView v1.0 offers:

- An embedded dashboard displaying moment-by-moment resource usage (CPU, memory, disk), pod and node health status, and trends in these metrics over a variable time window, rendering any concerns immediately visible
- A schematic representation of cluster nodes and their constitutent pods providing top-line pod-level performance metrics at a glance
- A specialized dashboard for displaying detailed pod-level metrics, including historical resource usage data, to speed identification of container-specific issues
- A **single point of access** to all of this, eliminating the need to expose additional in-cluster tools to the local network

**In addition, for those wishing to further integrate KlusterView with existing monitoring tools, we offer:**

- A prebuilt, development-ready application image featuring hot reloading
- A robust front- and back-end testing suite to safeguard core functionality and simplify maintainability
- A fully accessible set of installation scripts and YAML configuration files, categorized and indexed for easy modification

### How to Get Started

KlusterView and its dependencies can be installed using either a Helm chart or an installation script. Please see our [GitHub](https://github.com/oslabs-beta/KlusterView) or ArtifactHub repositories for details.

After installing, simply point your browser to Port 31001 on any Node in your cluster, and check out your

## The Path Forward

KlusterView is an open-source product that was developed under the tech accelerator Open Source Labs. If you are interested in contributing, our source code and iteration notes can be found on the [KlusterView GitHub](https://github.com/oslabs-beta/KlusterView). **We welcome anyone interested in this product to submit issues and/or contribute to its development** -- our users and our community make us stronger!

Our development roadmap, including both current features and future plans, is as follows:

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

## Meet the Team

The core KlusterView development team can be found at the links below, or at klusterview@gmail.com. Please reach out with any questions/comments, or to continue the conversation!

  <table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/35903887?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Kyle Slugg</b></sub>
      <br />
      <a href="http://www.kyleslugg.co">💻</a>
      <a href="https://www.linkedin.com/in/kyle-slugg/">🖇️</a>
      <a href="https://github.com/kyleslugg">🐙</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/64520371?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Shahmar Aliyev</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/shahmaraliyev/">🖇️</a>
      <a href="https://github.com/ShahmarAliyev">🐙</a>
    </td>
    <td align="center">
      <img src="https://d2culxnxbccemt.cloudfront.net/craft/content/uploads/articles/uploads/2013/05/Screen-Shot-2013-05-14-at-11.51.11-AM.png" width="140px;" alt=""/>
      <br />
      <sub><b>Mike Nunn</b></sub>
      <br />
      <a href="?????">🖇️</a>
      <a href="https://github.com/24juice22">🐙</a>
    </td>
     <td align="center">
      <img src="https://d2culxnxbccemt.cloudfront.net/craft/content/uploads/articles/uploads/2013/05/Screen-Shot-2013-05-14-at-11.51.11-AM.png" width="140px;" alt=""/>
      <br />
      <sub><b>Jonathan Tsai</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/jonathan-tsai95/">🖇️</a>
      <a href="https://github.com/jonathantsai1995">🐙</a>
    </td>

- 💻 = Website
- 🖇️ = LinkedIn
- 🐙 = Github
