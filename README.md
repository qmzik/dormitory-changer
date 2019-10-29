# dormitory-changer

## Пользователи
### POST /user/signup
req {
    email: string,
    password: string
}

### POST /user/signin
req {
    email: string,
    password: string
}

res {
    token: string
}

## Общежития
### GET /dormitory
res {
    [{ name: string, dormitory_id: number }]
}

## Вещи для обмена
### POST /good
req {
    name: string,
    description: string,
    change: string,
    owner_id: number,
}

### GET /good
res {
    [
      {
         name: string,
         description: string,
         change: string,
         owner_id: number,
      }
    ]
}
