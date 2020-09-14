let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
    baseUrl = '/server'
}else {
    baseUrl = '/api'
}

export  {baseUrl}