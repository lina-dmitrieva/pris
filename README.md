# Kubernetes с Minikube: Разворачивание сервиса с мониторингом и автоскейлингом

## О проекте

В этом проекте я развернула локальный Kubernetes-кластер с помощью Minikube, создала Docker-образ нашего приложения, развернула Deployment с 3 подами, настроила Metrics Server, Horizontal Pod Autoscaler, а также систему мониторинга на базе Prometheus и Grafana с дашбордами.

---

## Содержание

- [1. Установка Minikube](#1-установка-minikube)  
- [2. Создание Docker образа](#2-создание-docker-образа)  
- [3. Создание Deployment и масштабирование](#3-создание-deployment-и-масштабирование)  
- [4. Установка Metrics Server](#4-установка-metrics-server)  
- [5. Настройка Horizontal Pod Autoscaler (HPA)](#5-настройка-horizontal-pod-autoscaler-hpa)  
- [6. Установка Prometheus и Grafana](#6-установка-prometheus-и-grafana)  
- [7. Настройка дашборда в Grafana](#7-настройка-дашборда-в-grafana)  
- [8. Демонстрация и видео](#8-демонстрация-и-видео)

---

## 1. Установка Minikube

1. Сначала я скачала Minikube:
   ```powershell
   mkdir C:\minikube
   curl -Lo C:\minikube\minikube.exe https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe
Добавила C:\minikube в переменную среды PATH.

Запустила кластер:

```bash
minikube start
```

Также через команду alias я настроила вызов команды kubectl как k для удобства

## 2. Создание Docker образа
Создаkf Dockerfile для вашего приложения.

```bash
docker build -t my-app:1.0 .
```

## 3. Создание Deployment и масштабирование
Создала Deployment и потом через реплики расширила количество подов до трех:

```bash
k create deployment my-app --image=my-app:1.0
k scale deployment my-app --replicas=3
```

Можем проверить поды:

```bash
k get pods
```
4. Установка Metrics Server
Выполнила команду:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

И проверила статус:

```bash
kubectl get deployment metrics-server -n kube-system
```
5. Настройка Horizontal Pod Autoscaler (HPA)
Через команду в задании я настроила hpa

```bash
kubectl autoscale deployment my-app --cpu-percent=50 --min=2 --max=5
```

Можем проверить статус и убедиться, что команда сработала и деплоймент соответсвует заданным условиям:

```bash
kubectl get hpa
```

6. Установка Prometheus и Grafana через Helm
Установила Helm через официальный сайт.

Добавила репозиторий Prometheus:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Установила kube-prometheus-stack:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack
```

Проверим поды:

```bash
kubectl get pods
```

7. Настройка дашборда в Grafana
Открыла Grafana:

```bash
minikube service prometheus-grafana
```
с логином и паролем по умолчанию

Далее для создания нового дашборда следовала логике:
Создайте новый дашборд → Добавьте панель → Источник данных: Prometheus.

В поле запроса прописала:

```promql
sum(container_memory_usage_bytes{pod=~"my-nginx-deploy.*"})by(pod)
```
После чего сохранила дашборд

8. Демонстрация и видео
Ссылка на видео с демонстрацией: [https://disk.yandex.ru/i/0usiagA4cE6AlA]


