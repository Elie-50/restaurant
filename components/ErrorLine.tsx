function ErrorLine({ text }: { text: string }) {
  return (
    <p className="text-red-500 text-sm font-bold">
      {text}
    </p>
  )
}

export default ErrorLine
