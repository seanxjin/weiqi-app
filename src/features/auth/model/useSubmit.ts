import { useRef, useState, type FormEvent } from 'react'

export function useSubmit(action: (form: FormData) => Promise<void>) {
  const [error, setError] = useState<unknown>(null)
  const [pending, setPending] = useState(false)
  const submitting = useRef(false)
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    const form = new FormData(event.currentTarget)
    submitting.current = true
    setPending(true)
    setError(null)
    try {
      await action(form)
    } catch (caught) {
      setError(caught)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }
  return { error, pending, onSubmit }
}
