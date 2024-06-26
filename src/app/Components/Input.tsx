"use client"
import { useEffect, useRef, useState } from "react"
import useFetchData, { Option } from "../hooks/useFetchData"
import Dropdown from "./Dropdown"
import { useInView } from "react-intersection-observer";

const Input = () => {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { ref, inView } = useInView({
        threshold: 0.1,
      });
    /* I could move it into Dropdown so it would load when it's opened 
    but I wanted first results to be shown instantly so I 'pre-load' them  */
    const { options } = useFetchData({search: debouncedSearch, isTrigger: inView })
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)
    const [isDropdownVisible, setDropdownVisible] = useState(false)

    const onShow = () => setDropdownVisible(true)
    const onHide = () => setDropdownVisible(false)

    // very simple debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(timeoutId)
      }, [search])

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          inputRef.current &&
          containerRef.current &&
          !inputRef.current.contains(target) &&
          !containerRef.current.contains(target)
        ) {
            onHide()
        }
      };
    
      // Detect clicks outside of input and dropdown
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return <>
        <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Input your search here..." 
            onFocus={onShow}
            ref={inputRef}
        />
        {isDropdownVisible && <Dropdown triggerRef={ref} containerRef={containerRef} options={options} onChange={(value) => {
            setSelectedOption(value)
            setSearch(value?.Name ?? '')
            setDropdownVisible(false)
            inputRef.current?.blur()
        }} />}
    </>
}

export default Input