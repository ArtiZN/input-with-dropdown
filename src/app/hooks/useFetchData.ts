import { ForwardedRef, MutableRefObject, RefObject, useEffect, useRef, useState } from "react"

const URL = 'https://parseapi.back4app.com/classes/NamesList'

const ITEMS_ON_PAGE = 20

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

const fetchRequest = (url: string, search: string, query?: Record<string, string | number>) => {
    const queryString = buildQueryString({...query});
    const where = getSearchFilter(search)
    return fetch(
        `${url}?${queryString}&where=${where}`,
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

export interface Option {
    Genre: string
    Letter: string
    Name: string
    createdAt: string
    objectId: string
    updatedAt: string
}

interface Props {
    search: string
    isTrigger: boolean
}

const useFetchData = ({ search, isTrigger }: Props) => {

    const loadingRef = useRef<boolean>(false)
    const [options, setOptions] = useState<Option[]>([])

    const [page, setPage] = useState(1);

    const fetchData = async () => {
        loadingRef.current === true
        const result = await fetchRequest(URL, search, { limit: ITEMS_ON_PAGE, skip: (page - 1) * ITEMS_ON_PAGE });

        if (page > 1)
            setOptions([...options, ...result.results]);
        else {
            setOptions(result.results)
        }
        loadingRef.current === false
    };

    useEffect(() => {
        if (!loadingRef.current && isTrigger) {
            fetchData();
        }
    }, [page, search]);

    useEffect(() => {
        setPage(1)
    },[search])


    useEffect(() => {
        if (!loadingRef.current && isTrigger) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isTrigger]);

    return { options }

}

export default useFetchData