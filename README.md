# dormitory-changer

## Пользователи
### POST /user/signup
req {
    email: string,
    password: string,
    dormitoryId: number
}

### POST /user/signin
req {
    email: string,
    password: string
}

res {
    token: string,
    userId: number
}

## Общежития
### GET /dormitory
res {
    [{ name: string, dormitoryId: number }]
}

## Вещи для обмена
### POST /good
req {
    name: string,
    description: string,
    change: string,
    ownerId: number,
}

### GET /good?ownerId&name&change
res {
    [
        {    
             goodId: number,
             name: string,
             description: string,
             change: string,
             ownerId: number
        }
    ]
}

### GET /good/find?q=test&limit=10
#### caption: q indexes name, description and change
#### caption: limit default is 20
res {
        [
            {    
                 goodId: number,
                 name: string,
                 description: string,
                 change: string,
                 ownerId: number
            }
        ]
}

### PATCH /good
req {
     goodId: number,
     name?: string,
     description?: string,
     change?: string,
}

### DELETE /good
req {
    goodId: number
}
