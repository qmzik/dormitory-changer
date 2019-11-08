# dormitory-changer

## Пользователи
### POST /user/signup
req {
    email: string,
    password: string,
    dormitory_id: number
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

### GET /good?owner_id=""&name=""&change=""
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
