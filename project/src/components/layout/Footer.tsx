

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/sennsy12"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Alan Czubak
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/sennsy12/Expense-tracker"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
} 