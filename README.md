# Dokumentacja projektu 
### **KEDA-14**
Autorzy:
* Michał Stencel
* Michał Skwara
* Mikołaj Bul
* Adam Niemiec

Rok: 2023 Grupa: 4

## 1. Wprowadzenie
KEDA (Kubernetes-based Event-Driven Autoscaling) to narzędzie open-source, które umożliwia automatyczne skalowanie aplikacji opartych na kontenerach w środowisku Kubernetes w zależności od zdefiniowanych metryk oraz zachodzących zdarzeń w systemie. Technologia wprowadza możliwość dynamicznego zarządzania obciążeniem aplikacji w chmurze publicznej, a także pomaga osiągnąć efektywność kosztową poprzez zwiększanie lub zmniejszanie liczby replik kontenerów w oparciu o potrzeby aplikacji. KEDA zbiera metryki, a następnie wykorzystuje je do automatycznego dostosowywania liczby replik kontenerów w klastrze Kubernetes. Dzięki temu aplikacje są skalowane w sposób dynamiczny, w oparciu o rzeczywiste potrzeby, co pozwala na efektywniejsze wykorzystanie zasobów i usprawnienie działania aplikacji.


## 2. Teoretyczne podstawy / stos technologiczny
Z dokumentacji KEDA:

**What is KEDA:**

KEDA is a Kubernetes-based Event Driven Autoscaler. With KEDA, you can drive the scaling of any container in Kubernetes based on the number of events needing to be processed.

KEDA is a single-purpose and lightweight component that can be added into any Kubernetes cluster. KEDA works alongside standard Kubernetes components like the Horizontal Pod Autoscaler and can extend functionality without overwriting or duplication. With KEDA you can explicitly map the apps you want to use event-driven scale, with other apps continuing to function. This makes KEDA a flexible and safe option to run alongside any number of any other Kubernetes applications or frameworks.

**How KEDA works:**

KEDA performs three key roles within Kubernetes:

* Agent — KEDA activates and deactivates Kubernetes Deployments to scale to and from zero on no events. This is one of the primary roles of the keda-operator container that runs when you install KEDA.
* Metrics — KEDA acts as a Kubernetes metrics server that exposes rich event data like queue length or stream lag to the Horizontal Pod Autoscaler to drive scale out. It is up to the Deployment to consume the events directly from the source. This preserves rich event integration and enables gestures like completing or abandoning queue messages to work out of the box. The metric serving is the primary role of the keda-operator-metrics-apiserver container that runs when you install KEDA.
* Admission Webhooks - Automatically validate resource changes to prevent misconfiguration and enforce best practices by using an admission controller. As an example, it will prevent multiple ScaledObjects to target the same scale target.
Architecture

The diagram below shows how KEDA works in conjunction with the Kubernetes Horizontal Pod Autoscaler, external event sources, and Kubernetes’ etcd data store:

![image](https://user-images.githubusercontent.com/58272881/228941965-3594b59e-32f1-4a82-980d-96341a538418.png)


## 3. Case study:
W ramach demo planujemy porównać 2 metody skalowania horyzontalnego aplikacji umieszczonej w klastrze Kubernetesa:
* na podstawie długości kolejki oczekujących wiadomości w Apache Kafka
* na podstawie zużycia CPU w kontenerach z aplikacją

Aplikacja będzie działać w 2 wariantach:
* po przeczytaniu wiadomości wywoła funkcję sleep
* po przeczytaniu wiadomości wykona faktyczne obliczenia(rekurencyjne obliczanie ciągu Fibonacciego), w celu zwiększenia zużycia procesora

Plan demo:
* Wykorzystujemy Kafke, na której znaduje się kolejka wiadomości
* Aplikacja konsumenta napisana w Node czyta wiadomości z Kafki i zachowuje się wedle przeczytanego wariantu
* Wiadomości produkowane są przez aplikację producenta - kolejka zapełnia się szybciej niż konsument jest w stanie przetworzyć wiadomości
* Ilość wiadomości w kolejce lub % zużycia procesora przekracza ustalony próg
* KEDA skaluje aplikację horyzontalnie 

## 4. Architektura rozwiązania
W projekcie wykorzystane zostaną następujące technologie:
* KEDA
* Apache Kafka
* Zookeeper
* Node
* Docker
* Kubernetes

Ich użycie konieczne będzie do stworzenia zaplanowanej architektury rozwiązania
| *Schemat architektury projektu* |
|:--:| 
| ![keda(2)](https://user-images.githubusercontent.com/30327956/233847780-b697263c-df22-4c32-86bc-0a0c12240224.png) | 

Oczekiwane zachowanie
| Typ obciążenia\typ skalowania | Kafka | CPU |
|---------------|------------|------------|
| **sleep** | skaluje się | nie skaluje się |
| **obliczenia** | skaluje się | skaluje się |


## 5. Opis konfiguracji środowiska
Konfiguracja środowiska będzie wymagać określenia następujących parametrów:  
* długość kolejki w Kafce
* ilość wiadomości tworzonych na sekundę w producencie
* tryb obciążenia sleep lub faktyczne wykonywanie obliczeń

## 6. Metoda instalacji
Do lokalnego uruchomienia projektu wymagana jest instalacja następujacych narzędzi:
* [Docker](https://www.docker.com/)
* [minikube](https://minikube.sigs.k8s.io/docs/)
* [Kubernetes kubectl](https://kubernetes.io/docs/tasks/tools/)


## 7. Jak powtórzyć - krok po kroku
### Uruchomienie lokalne
Projekt uruchamiany jest przy pomocy skryptu `setup.sh`. Stawiany jest wtedy lokalny klaster Kubernetesa w kontenerze Dockerowym. Następnie w klastrze uruchamiane są wszystkie elementy architektury systemu wraz z napisanymi przez nas aplikacjami.


Działaniem aplikacji sterujemy dzięki wysyłaniu reqestów na 2 enpointy:
* GET `/config/setMessageInterval/:interval` - zmiana interwału czasowego definiującego czas pomiędzy wysłaniem wiadomości na kolejkę
* GET `/config/toggle-workload` - zmiana trybu pracy na przeciwny

Skrypt `switch-to-cpu.sh` zmienia tryb skalowania z długości kolejki w Kafce na zużycie CPU.

## 8. Krok po kroku wdrożenie demo:
#### 8.1. Skalowanie po Kafce ze sleepem
1. Uruchomić setup.sh.


| *Stan początkowy* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/212e2fcb-b0f2-4de2-b021-e3203961f76c) | 


2. Odpalić komendy `kubectl exec svc/kafka-service -it -- bash` oraz `watch -n 1 kafka-consumer-groups.sh --bootstrap-server kafka-service:9092 --describe --group super-group-id` - uruchamiamy monitoring laga na partycjach topicu
3. Zaobserwować liczbę konsumentów na dashboardzie i lag.


| *Monitoring partycji w Kafce* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/acb038d1-3bfb-43b0-a9a9-39f712bcb2f1) | 


4. Zmniejszyć message_interval w producencie - wysyłamy request na `/config/setMessageInterval/:interval`.


| *Wysłanie requestu zmniejszenia messagge_interval* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/567fe678-1bda-4a67-bec7-f18ba397a54e) | 


5. Zauważyć, że lag przekracza ustalony treshold.


| *Lag jest większy niż treshold* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/b0db236c-ab6e-417c-8dcd-6b576dea122f) | 

  
6. Zaobserwować zwiększoną liczbę konsumentów.


| *Ilość konsumentów wzrasta - skalowanie w górę* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/00a2dcb0-f2a7-494b-b4a9-675fbae3bc90) | 


7. W monitoringu laga zauważyć zmianę przypisania partycji topicu.
8. Lag powinien maleć.
9. Zwiększyć message_interval


| *Wysłanie requestu zwiększenia messagge_interval* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/62ebcfaa-336d-40fb-bf0f-7baa348dd1b8) | 


10. Zaobserwować skalowanie w dół po odczekaniu cooldownPeriod.


| *Zmniejszenie ilości konsumentów - skalowanie w dół* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/31796029-05cf-4d92-a0d5-ed5578ce8410) | 

#### 8.2. Skalowanie po Kafce z obliczeniami
1. Zmieniamy tryb pracy konsumentów requestem `/config/toggle-workload`.


| *Zmiana trybu pracy* |
|:--:| 
|   ![image](https://github.com/StencelMichal/keda/assets/72918433/c2712440-2595-43ff-9000-5cd6ff8b8258) | 


2. Powtarzamy punkty 3.-10.
3. Obserwujemy takie same efekty.


| *Zmniejszenie ilości konsumentów - skalowanie w dół* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/3abef9e6-9613-4a3b-b30c-6eeeb96db32a) | 


#### 8.3. Skalowanie po CPU z obliczeniami
1. Zmieniamy tryb skalowania uruchamiająć skrypt `switch-to-cpu.sh`.

| *Stan początkowy* |
|:--:| 
|   ![image](https://github.com/StencelMichal/keda/assets/72918433/a5cd78bc-51b5-42ec-aa2a-00afe0702a27) | 

2. Powtarzamy punkty 3.-10.
3. Obserwujemy takie same efekty - jednak są one nieco wolniejsze.


| *Przeskalowanie w górę* |
|:--:| 
|  ![image](https://github.com/StencelMichal/keda/assets/72918433/545359de-7a2b-41b8-9965-1307efb6747e) |


#### 8.4. Skalowanie po CPU ze sleepem
1. Zmieniamy tryb pracy konsumentów requestem `/config/toggle-workload`.


| *Stan początkowy* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/e390890a-89ed-438c-87fd-5238dc2dad2e) | 

  
2. Powtarzamy punkty 3.-10.
3. Skalowanie nie działa.


| *Brak skalowania po zmniejszeniu message_interval* |
|:--:| 
| ![image](https://github.com/StencelMichal/keda/assets/72918433/6510c8ff-4c58-4b0d-8fff-6b2f4a5e3b72) | 


## 9. Podsumowanie - wnioski
KEDA pozwala na wykorzystanie bardziej zaawansowanych sposobów skalowania, których brakuje w standardowym skalowaniu Kubernetes'a.
Narzędzie wprowadza elastyczność w skalowaniu aplikacji na podstawie zdarzeń, takich jak rozmiar kolejki, wywołania API, czy odczyty z kolejek komunikatów. W naszym projekcie przedstawiliśmy potencjalną przewagę skalowania z metryką wyrażoną przez długość kolejki Kafka nad standardowym skalowaniem po obciążeniu CPU. Poprzez zastosowanie custom'owego skalowania jesteśmy w stanie zoptymalizować wykorzystanie zasobów za pomocą dostowania liczby instancji aplikacji.
Dzięki bardziej zaawansowanym mechanizmom skalowania, KEDA zwiększa możliwości projektu i pozwala na lepsze dostosowanie aplikacji do dynamicznie zmieniających się wymagań. Niektóre udostępnione w niej metody skalowania są lepsze niż te dostępne bazowo w Kubernetes.
KEDA jest łatwo konfigurowalnym narzędziem, które można dostosować do specyficznych potrzeb aplikacji, a jego wdrożenie nie wymaga dużych zmian w infrastrukturze, ponieważ jest zintegrowane z Kubernetes.
## 10. Bibliografia
* [KEDA](https://keda.sh/docs/2.10/) - dokumentacja
