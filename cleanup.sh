kubectl delete -f ./charts/kafka-scaler.yml
kubectl delete -f ./charts/cpu-scaler.yml
kubectl delete -f ./charts/consumer.yml
kubectl delete -f ./charts/kafka.yml
kubectl delete -f ./charts/zookeeper.yml
kubectl delete -f https://github.com/kedacore/keda/releases/download/v2.10.1/keda-2.10.1.yaml
kubectl config set-context --current --namespace=default
