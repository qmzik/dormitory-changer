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
`Content-type: form-data`  
req {
    name: string,
    description: string,
    change: string,
    ownerId: number,
    urgently?: boolean,
}

### GET /good?ownerId&name&change
res {
    [
        {    
             goodId: number,
             name: string,
             description: string,
             change: string,
             ownerId: number,
             urgently: boolean,
        }
    ]
}

### GET /good/picture?goodId
`Content-type: form-data`  
res - form-data

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
                 ownerId: number,
                 urgently: boolean
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

## Комментарии
### GET /comments
req {
    commentId: number;
    ownerId: number;
    goodId: number;
}

res {
    commentId: number;
    ownerId: number;
    goodId: number;
    content: string;
    timestamp: number;
}

### POST /comments
req {
    ownerId: number;
    goodId: number;
    content: string;
}

### PATCH /comments
req {
    content: string;
}

### DELETE /comments
req {
    commentId: number;
}
