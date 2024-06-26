"use client"
import { useState } from "react";
import Input from "./Components/Input/Input"
import { Option } from "@/app/hooks/useFetchData"
import styles from "./page.module.css"

export default function Home() {

  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  return (
    <main className={styles.main}>
      <div>Selected option: {selectedOption?.Name ?? 'Currently not selected'}</div>
      <Input onChange={setSelectedOption} />
    </main>
  );
}
