kubectl apply -f kreda-namespace.yml
kubectl config set-context --current --namespace=kreda
kubectl apply -f zookeeper.yml
kubectl apply -f kafka.yml
kubectl apply -f consumer.yml

