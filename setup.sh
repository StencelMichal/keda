minikube start
minikube addons enable metrics-server

eval $(minikube docker-env)

scaler=${INPUT_SCALER:-kafka}

docker build -t super-consumer -f ./consumer/Dockerfile .
docker build -t producer -f ./producer/Dockerfile .

kubectl apply -f ./charts/keda-namespace.yml
kubectl config set-context --current --namespace=keda
kubectl apply -f ./charts/zookeeper.yml
kubectl apply -f ./charts/kafka.yml


SETUP_TOPIC="kubectl exec $(kubectl get pod -l app=kafka-broker -o name) -- kafka-topics.sh --zookeeper zookeeper-service:2181 --topic test-topic --create --partitions 20 --replication-factor 1 2>/dev/null"
eval $SETUP_TOPIC
while [ $? -ne 0 ]; do
    sleep 0.5
    eval $SETUP_TOPIC
done

kubectl apply -f ./charts/consumer.yml
kubectl apply -f ./charts/producer.yml
kubectl apply -f https://github.com/kedacore/keda/releases/download/v2.10.1/keda-2.10.1.yaml

kubectl apply -f ./charts/kafka-scaler.yml

kubectl exec service/kafka-service -- apt update -y
kubectl exec service/kafka-service -- apt install watch -y

kubectl port-forward deployment/producer 8000:3000 &
minikube dashboard