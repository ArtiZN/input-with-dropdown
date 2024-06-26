import { useState } from "react";
import Input from "./Components/Input"
import { Option } from "@/app/hooks/useFetchData"
import styles from "./page.module.css"

export default function Home() {

  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  return (
    <main className={styles.main}>
      <Input onChange={setSelectedOption} />
    </main>
  );
}
