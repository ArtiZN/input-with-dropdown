import { RefObject, useEffect, useRef, useState } from "react"
import { AutoSizer, List } from 'react-virtualized'
import { cn } from "@/app/helpers"
import { Option } from "@/app/hooks/useFetchData"
import { ITEM_FROM_THE_END } from "@/app/helpers/configConstants"
import styles from './styles.module.scss'

interface Props {
    options: Option[]
    onChange: (value: Option | null) => void
    containerRef: RefObject<HTMLDivElement>
    triggerRef: (node?: Element | null | undefined) => void
}

const Dropdown = ({ options, onChange, containerRef, triggerRef }: Props) => {

    const [activeOption, setActiveOption] = useState<Option | null>(options[0] ?? null)

    // need to access current value in event listeners. Can't use state because of closures
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
            el.scrollIntoView({ block: align, inline: "nearest" })
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
                    scrollToElement(options[index - 1].objectId, 'center')
                }
                break;
            }
            case 'ArrowDown': {
                const nextOption: Option | undefined = options[index + 1]
                if (nextOption) {
                    setActiveOption(nextOption)
                    scrollToElement(nextOption.objectId, 'center')
                }
                break;
            }
            case 'ArrowRight':
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

    if (options.length === 0) return <div>no options</div> // super simple placeholder

    return <div className={styles.container} ref={containerRef} onKeyDown={(e) => e.preventDefault()}>
        <AutoSizer>{({ width, height }) => 
            <List 
                height={height} 
                rowHeight={50} 
                rowCount={options.length} 
                width={width}
                rowRenderer={({
                    index,
                    style,
                  }) => {
                    const item = options[index]
                    return <div 
                        style={style}
                        className={cn(styles.option, item.objectId === activeOption?.objectId && styles['option--active'])} 
                        onMouseEnter={() => setActiveOption(item)}
                        key={item.objectId}
                        onClick={onSubmit}
                        id={item.objectId}
                        ref={index === options.length - ITEM_FROM_THE_END ? triggerRef : undefined}
                    >
                        {item.Name}
                    </div>
                }}
        />}
        </AutoSizer>
    </div>
}

export default Dropdown