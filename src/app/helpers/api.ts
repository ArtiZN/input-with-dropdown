const URL = 'https://parseapi.back4app.com/classes/NamesList'
const FAKE_ID = 'zsSkPsDYTc2hmphLjjs9hz2Q3EXmnSxUyXnouj1I' // This is the fake app's application id
const FAKE_KEY = '4LuCXgPPXXO2sU5cXm6WwpwzaKyZpo3Wpj4G4xXK' 

const buildQueryString = (query?: Record<string, string | Number>) => {
    if (!query) return ''
    return Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
}

const getSearchFilter = (search: string) => encodeURIComponent(JSON.stringify({
    /* the API does not provide 'contained' option
    so 'gte' is the best I've got, however it may work 
    just a bit incorrectly 
    And it's also case sensitive */
    'Name': {
      "$gte": search,   
    }
}))

const fetchRequest = (search: string, query?: Record<string, string | number>) => {
    const queryString = buildQueryString({...query});
    const where = getSearchFilter(search)
    return fetch(
        `${URL}?${queryString}&where=${where}`,
        {
          headers: {
            'X-Parse-Application-Id': FAKE_ID,
            'X-Parse-Master-Key': FAKE_KEY
          }
        }
      ).then((res) => {
        return res.json()
    })
}

export { fetchRequest }