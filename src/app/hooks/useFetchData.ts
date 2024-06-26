import { useEffect, useRef, useState } from "react"
import { fetchRequest } from "../helpers/api"
import { ITEMS_ON_PAGE } from "../helpers/configConstants"

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

    // I could handle errors and loading as well but I don't really think it's needed that much here
    const loadingRef = useRef<boolean>(false)
    const [options, setOptions] = useState<Option[]>([])

    const [page, setPage] = useState(1);

    const fetchData = async () => {
        loadingRef.current === true
        const result = await fetchRequest(search, { limit: ITEMS_ON_PAGE, skip: (page - 1) * ITEMS_ON_PAGE });

        if (page > 1)
            setOptions([...options, ...result.results]);
        else {
            setOptions(result.results)
        }
        loadingRef.current === false
    };

    useEffect(() => {
        if (!loadingRef.current) {
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