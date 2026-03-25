import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function ErrorState({ message = "Something went wrong." }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export default ErrorState
