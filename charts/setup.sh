kubectl apply -f keda-namespace.yml
kubectl config set-context --current --namespace=keda
kubectl apply -f zookeeper.yml
kubectl apply -f kafka.yml
kubectl apply -f consumer.yml
kubectl apply -f https://github.com/kedacore/keda/releases/download/v2.10.1/keda-2.10.1.yaml
kubectl apply -f kafka-scaler.yml
