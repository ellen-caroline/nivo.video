import { useEffect, useState } from "react";

// gancho personalizado para adiar a atualização de um valor 
// até que um determinado tempo (atraso) tenha passado desde a última vez que o valor foi alterado

// value é o tempo que será adiado
// delay é o tempo de atraso em milissegundos
// <T = unknown> é uma sintaxe TypeScript que indica um tipo genérico
export default function useDebounceValue<T = unknown>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    // efeito é acionado sempre que o valor ou o atraso mudam
    useEffect(() => {
        // setTimeout ou temporizador é iniciado para esperar o tempo especificado pelo atraso
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // limpar o temporizador se o valor ou o atraso mudar antes que o temporizador expire
        // evitando atualizações desnecessárias
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}