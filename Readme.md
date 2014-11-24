# Установка


## Скачать код проекта 

<pre>git clone git@github.com:asmsoft/test-chat.git .</pre>

## Настройка сервера

В файле server.js при необходимости сделать настройки

<pre>var host = "127.0.0.1";
 var port = 9090;
 
 var accounts = [
     { login: 'login1', password: 'password1' },
     { login: 'login2', password: 'password2' },
     { login: 'login3', password: 'password3' },
     { login: 'login4', password: 'password4' }
 ];</pre>

## Запустить сервер

<pre>node server.js</pre>

# Использование

По умолчанию сервер слушает на порту 127.0.0.1:9090.

Клиенту необходимо соединяться на этот порт.


#Протокол

## Аутентификация клиента

<pre>GET /auth?login=xxx&password=yyy</pre>

Аккаунты, доступные по умолчанию: login1/password1, login2/password2, login3/password3

## Подключение

<pre>GET /poll</pre>

## Отправка сообщения

<pre>GET /message?message=text</pre>
