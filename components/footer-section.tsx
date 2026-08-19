import Link from "next/link"
import { FileText, Mail, Phone } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="px-4 pb-12 pt-4 md:px-10 lg:px-16">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-8 md:p-10">
        <div className="grid gap-6 text-sm text-muted-foreground md:grid-cols-[1.4fr_1fr_0.8fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@lumitera.ru" className="transition hover:text-primary">info@lumitera.ru</a>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:hello@lumitera.ru" className="transition hover:text-primary">hello@lumitera.ru</a>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:+79529357625" className="transition hover:text-primary">+7 (952) 935-76-25</a>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground">Брежнев Дмитрий Игоревич</p>
            <p>ИНН: 544600172030</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/agreements" className="flex items-center gap-2 text-foreground transition hover:text-primary">
              <FileText className="h-4 w-4" />
              Соглашения
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">© 2026 Lumitera. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}