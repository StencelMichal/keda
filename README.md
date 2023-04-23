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
* po przeczytaniu wiadomości wykona faktyczne obliczenia, w celu zwiększenia zużycia procesora

Plan demo:
* Wykorzystujemy Kafke, na której znaduje się kolejka wiadomości
* Aplikacja w Node czyta wiadomości z Kafki i zachowuje się wedle ustalonego wariantu
* Wiadomości produkowane są szybciej niż aplikacja jest w stanie je przetworzyć
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

| *Schemat architektury projektu* |
|:--:| 
| ![keda(2)](https://user-images.githubusercontent.com/30327956/233847780-b697263c-df22-4c32-86bc-0a0c12240224.png) | 

## 5. Opis konfiguracji środowiska
Konfiguracja środowiska będzie wymagać określenia następujących parametrów:  
* długość kolejki w Kafce
* ilość wiadomości tworzonych na sekundę w producencie
* tryb obciążenia sleep lub faktyczne wykonywanie obliczeń

## 6. Metoda instalacji
## 7. Jak powtórzyć - krok po kroku
### 7.1. Podejście Infrastructure as Code
## 8. Krok po kroku wdrożenie demo:
### 8.1. Konfiguracja ustawień 
### 8.2. Przygotowanie danych
### 8.3. Procedura wykonania
### 8.4. Prezentacja wyników
## 9. Podsumowanie - wnioski
## 10. Bibliografia
