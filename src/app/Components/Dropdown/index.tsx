import { Option } from "@/app/hooks/useFetchData"
import styles from './styles.module.scss'
import { cn } from "@/app/helpers"
import { RefObject, useEffect, useRef, useState } from "react"

// this is the number which indicates which element from the end will trigger pagination
// For example, if we have total of 80 items and ITEM_FROM_THE_END = 5 
// then 80 - 5 = 75. Pagination will trigger on the 75th element
const ITEM_FROM_THE_END = 5 

interface Props {
    options: Option[]
    onChange: (value: Option | null) => void
    containerRef: RefObject<HTMLDivElement>
    triggerRef: (node?: Element | null | undefined) => void
}

const Dropdown = ({ options, onChange, containerRef, triggerRef }: Props) => {

    const [activeOption, setActiveOption] = useState<Option | null>(options[0] ?? null)

    const optionsRef = useRef(options)
    const activeOptionRef = useRef(activeOption)

    useEffect(() => {
        optionsRef.current = options
    },[options])

    useEffect(() => {
        activeOptionRef.current = activeOption
    },[activeOption])

    const onSubmit = () => {
        onChange(activeOptionRef.current)
    }

    const scrollToElement = (elementId: string, align: ScrollLogicalPosition) => {
        const el = document.getElementById(elementId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: align, inline: "nearest" })
        }        
    }

    const keyboardHandler = (e: KeyboardEvent) => {
        const options = optionsRef.current
        const activeOption = activeOptionRef.current
        const index = options.findIndex((option) => option.objectId === activeOption?.objectId)
        switch (e.key) {
            case 'ArrowUp':  {
                if (index > 0){
                    setActiveOption(options[index - 1])
                    scrollToElement(options[index - 1].objectId, 'end')
                }
                break;
            }
            case 'ArrowDown': {
                const nextOption: Option | undefined = options[index + 1]
                if (nextOption) {
                    setActiveOption(nextOption)
                    scrollToElement(nextOption.objectId, 'start')
                }
                break;
            }
            case 'Enter': {
                onSubmit()
                break;
            }
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', keyboardHandler)
        return () => document.removeEventListener('keydown', keyboardHandler)
    },[])

    if (options.length === 0) return <div>no options</div>


    
    return <div className={styles.container} ref={containerRef}>
        {options.map((i, index, array) => 
            <div 
                className={cn(styles.option, i.objectId === activeOption?.objectId && styles['option--active'])} 
                onMouseEnter={() => setActiveOption(i)}
                key={i.objectId}
                onClick={onSubmit}
                id={i.objectId}
                ref={index === array.length - ITEM_FROM_THE_END ? triggerRef : undefined}
            >
                {i.Name}
            </div>)}
    </div>
}

export default Dropdown