# ArgoCD Installation & Setup Script
# Run this inside a shell with kubectl access to your local cluster

echo "Creating argocd namespace..."
kubectl create namespace argocd || true

echo "Installing ArgoCD manifests..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Waiting for ArgoCD components to be ready..."
kubectl wait --for=condition=available --timeout=600s deployment/argocd-server -n argocd

echo "Patching ArgoCD server to NodePort (for local access)..."
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

echo "ArgoCD initial admin password:"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""

echo "Access ArgoCD at: https://localhost:8080 (after running port-forward)"
echo "Run: kubectl port-forward svc/argocd-server -n argocd 8080:443"
