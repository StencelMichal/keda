kubectl delete -f kafka-scaler.yml
kubectl delete -f consumer.yml
kubectl delete -f kafka.yml
kubectl delete -f zookeeper.yml
kubectl delete -f https://github.com/kedacore/keda/releases/download/v2.10.1/keda-2.10.1.yaml
kubectl config set-context --current --namespace=default