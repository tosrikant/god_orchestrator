# God-Mode Orchestrator 🚀

A distributed, microservices-based AI orchestrator managed via GitOps and automated local CI/CD. This system uses a React frontend, a Spring Cloud Gateway, and a Spring Boot WebFlux orchestrator to handle multi-agent AI tasks.

## 🏗 Architecture
- **Frontend**: React (Vite) + Tailwind CSS, served via Nginx.
- **Gateway Service**: Spring Cloud Gateway (Port 8082) for routing and cross-service communication.
- **Orchestrator Service**: Spring Boot WebFlux (Port 8081) for AI inference and tool management.
- **Infrastructure**: Managed by Kubernetes (Docker Desktop) and synchronized via ArgoCD.
- **Ingress**: Nginx Ingress Controller routing all traffic through `http://localhost`.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Docker Desktop** (with Kubernetes enabled)
- **Chocolatey** (for Windows package management)
- **Skaffold**: `choco install skaffold -y`
- **ArgoCD**: (Optional) For GitOps management.

### 2. Initial Setup
Install the Nginx Ingress Controller to handle local routing:
```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

### 3. Running the Project (Automated Local CI/CD)
The most efficient way to run and develop this project is using **Skaffold**. This handles the build and deployment automatically whenever you change code.

Run this in the root directory:
```powershell
skaffold dev
```
- **UI Access**: [http://localhost](http://localhost)
- **API Entry**: [http://localhost/api/v1/orchestrator](http://localhost/api/v1/orchestrator)

### 4. GitOps Deployment (ArgoCD)
If you prefer the GitOps approach, ensure your manifests in `k8s/` are pushed to your repository, and point your ArgoCD application to the `master` branch.

---

## 🛠 Development Workflow
- **Code Changes**: Editing any file in `frontend/` or `backend/` will trigger a Skaffold rebuild and redeploy.
- **Logs**: View live streaming logs from all microservices directly in your `skaffold dev` terminal.
- **Images**: Local images are tagged and updated automatically (no more manual `v1`, `v2` tagging).

---

## 🛡 Security & Configuration
- **API Keys**: Enter your Gemini API key directly in the UI dashboard.
- **CORS**: Managed at the Ingress level; ensure no duplicate headers are added in the backend services.

---

*Built with God-Mode Orchestrator Technology Stack.*
