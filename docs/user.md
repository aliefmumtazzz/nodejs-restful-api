# User API Spec

## Register User API

Endpont : POST /api/users

Request Body :

```json
{
  "username": "alief",
  "password": "rahasia",
  "name": "ALief Mumtaz"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "alief",
    "name": "Alief Mumtaz"
  }
}
```

Response Body Error :

```json
{
  "errors": "username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "Username": "alief",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User Api

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Muh. Alief Mumtaz", // opsional
  "password": "new password" // opsional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "alief",
    "name": "Muh. Alief Mumtaz"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User Api

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "username": "alief",
    "name": "Alief Mumtaz"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DETELE /api/users/logout

Response Body Success :

```json
{
  "data": "oke"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
