# K8S

Kubernetes setup for project. Note that in its current state it is **NOT FOR PRODUCTION**. Secrets would require proper configuration, development and production yaml splitting, CockorachDB to secure mode, and other considerations listed in kubernetes documentation.

## Getting started

### Prerequisites

- kubectl (v1.31.2)
- kustomize (v5.4.2)
- k3d (v5.7.5)
- helm (v3.16.2)
- helmfile (v1.0.0-rc.8)

### Installation

- `k3d cluster create --config k3d-cluster.yaml`
- `helmfile init`
- `helmfile apply`
- `kubectl kustomize . | kubectl apply -f -`

### Updating cluster

Helm changes:

- `helmfile deps`
- `helmfile apply`

Kustomization changes:

- `kubectl kustomize . | kubectl apply -f -`

### Development

- `localhost:8081` - app
- `localhost:8082` - granafa (admin/admin)
