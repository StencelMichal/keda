kubectl apply -f keda-namespace.yml
kubectl config set-context --current --namespace=keda
kubectl apply -f zookeeper.yml
kubectl apply -f kafka.yml

SETUP_TOPIC="kubectl exec $(kubectl get pod -l app=kafka-broker -o name) -- kafka-topics.sh --zookeeper zookeeper-service:2181 --topic test-topic --create --partitions 20 --replication-factor 1 2>/dev/null"
eval $SETUP_TOPIC
while [ $? -ne 0 ]; do
    sleep 0.5
    eval $SETUP_TOPIC
done

kubectl apply -f consumer.yml
kubectl apply -f https://github.com/kedacore/keda/releases/download/v2.10.1/keda-2.10.1.yaml
kubectl apply -f kafka-scaler.yml
