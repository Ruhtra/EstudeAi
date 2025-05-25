"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, CheckCircle2, Crown, Sparkles, Star, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export type SubscriptionPlan = "mensal" | "anual"

interface TrialInfo {
  daysRemaining: number
  endDate: string
  planAfterTrial: "mensal" | "anual"
}

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan | null
  title?: string
  subtitle?: string
  showTrialToggle?: boolean
  buttonText?: {
    monthly: string
    annual: string
    currentPlan?: string
  }
  onSelectPlan?: (plan: SubscriptionPlan) => void
  className?: string
  trialInfo?: TrialInfo
  showTrialInfo?: boolean
}

export default function SubscriptionPlans({
  currentPlan = null,
  title = "Planos de Assinatura",
  subtitle = "Acesse todos os recursos da nossa plataforma com um plano que se adapta às suas necessidades.",
  showTrialToggle = true,
  buttonText = {
    monthly: "Começar período gratuito",
    annual: "Assinar com desconto",
    currentPlan: "Plano atual",
  },
  onSelectPlan,
  className = "",
  trialInfo,
  showTrialInfo = false,
}: SubscriptionPlansProps) {
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false)

  return (
    <div className={className}>
      {title && subtitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16 text-center"
        >
          <div className="mb-2 flex justify-center">
            <Badge className="bg-primary/10 text-primary px-3 py-1 text-xs sm:text-sm font-medium">
              <Sparkles className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {title}
            </Badge>
          </div>
          <h1 className="mb-3 md:mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground px-1">{subtitle}</p>
        </motion.div>
      )}

      {showTrialInfo && trialInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border border-amber-200 dark:from-amber-900/30 dark:to-yellow-900/30 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-800/50 rounded-full p-2 mt-0.5">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-400 text-base">
                  {trialInfo.daysRemaining === 1
                    ? "Último dia do seu período gratuito!"
                    : `Faltam ${trialInfo.daysRemaining} dias para o fim do seu período gratuito`}
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Após {new Date(trialInfo.endDate).toLocaleDateString("pt-BR")}, você será cobrado automaticamente
                  {trialInfo.planAfterTrial === "mensal"
                    ? " R$10,00 por mês pelo plano mensal."
                    : " R$100,00 pelo plano anual."}
                </p>
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Você pode alterar seu plano a qualquer momento antes do fim do período gratuito.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showTrialToggle && (
        <div className="mb-8 md:mb-10 flex items-center justify-center space-x-2">
          <span className="text-xs sm:text-sm font-medium">Simular usuário que já usou período gratuito</span>
          <Switch checked={hasUsedFreeTrial} onCheckedChange={setHasUsedFreeTrial} />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
        {/* Plano Mensal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="relative"
        >
          <Card
            className={`h-full overflow-hidden border-2 ${
              currentPlan === "mensal" ? "border-primary" : "border-slate-200 dark:border-slate-800"
            } transition-all duration-300 hover:border-primary/50 hover:shadow-lg`}
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>

            {currentPlan === "mensal" && (
              <div className="absolute right-4 top-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Check className="mr-1 h-3 w-3" />
                  Plano atual
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-xl md:text-2xl">Plano Mensal</CardTitle>
              <CardDescription className="text-sm">Flexibilidade com pagamento mensal</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 md:pb-6">
              <div className="mb-4 md:mb-6">
                {!hasUsedFreeTrial ? (
                  <>
                    <div className="flex flex-wrap items-baseline">
                      <span className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-500">R$0</span>
                      <span className="ml-1 text-xs sm:text-sm text-muted-foreground">/primeiros 30 dias</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-base md:text-lg line-through text-muted-foreground">R$10/mês</span>
                      <Badge
                        variant="outline"
                        className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs"
                      >
                        <Star className="mr-1 h-3 w-3" />
                        30 dias grátis
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-baseline">
                    <span className="text-3xl md:text-4xl font-bold">R$10</span>
                    <span className="ml-1 text-xs sm:text-sm text-muted-foreground">/mês</span>
                  </div>
                )}
              </div>

              {!hasUsedFreeTrial && (
                <div className="mb-4 md:mb-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 text-xs sm:text-sm text-green-700 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400">
                  <div className="flex items-center font-medium">
                    <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Experimente sem compromisso</span>
                  </div>
                  <p className="mt-1 pl-6 text-xs">
                    Após o período gratuito, o plano será renovado automaticamente por R$10/mês. Você pode cancelar a
                    qualquer momento.
                  </p>
                </div>
              )}

              {hasUsedFreeTrial && currentPlan !== "mensal" && currentPlan !== null && (
                <div className="mb-4 md:mb-6 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-xs sm:text-sm">
                  <p>Cobrança mensal sem compromisso de permanência.</p>
                </div>
              )}

              <ul className="space-y-2 md:space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Acesso completo à plataforma</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Cancele quando quiser</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {currentPlan === "mensal" ? (
                <Button size="lg" className="w-full text-sm" disabled>
                  {buttonText.currentPlan || "Plano atual"}
                </Button>
              ) : (
                <Button size="lg" className="w-full text-sm" onClick={() => onSelectPlan && onSelectPlan("mensal")}>
                  {!hasUsedFreeTrial ? buttonText.monthly : "Assinar agora"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Plano Anual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="relative"
        >
          <Card className={`h-full overflow-hidden border-2 ${
              currentPlan === "anual" ? "border-primary" : "border-slate-200 dark:border-slate-800"
            } bg-gradient-to-br from-white to-primary/5 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-slate-900 dark:to-primary/10`}>                          
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>

            {currentPlan !== "anual" && (
              <div className="absolute right-4 top-0 translate-y-[-50%]">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 px-3 py-1.5 text-white shadow-md">
                      <Crown className="mr-1 h-3.5 w-3.5" />
                      Mais econômico
                    </Badge>
              </div>
            )}

            {currentPlan === "anual" && (
              <div className="absolute right-4 top-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Check className="mr-1 h-3 w-3" />
                  Plano atual
                </Badge>
              </div>
            )} 

            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-xl md:text-2xl">Plano Anual</CardTitle>
              <CardDescription className="text-sm">Economize com o plano anual</CardDescription>
            </CardHeader>

            <CardContent className="pb-4 md:pb-6">
              <div className="mb-4 md:mb-6">
                <div className="flex flex-wrap items-baseline">
                  <span className="text-3xl md:text-4xl font-bold">R$100</span>
                  <span className="ml-1 text-xs sm:text-sm text-muted-foreground">/ano</span>
                </div>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Economize R$20 por ano
                  </Badge>
                </div>
              </div>

              <div className="mb-4 md:mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 text-xs sm:text-sm text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400">
                <div className="flex items-center font-medium">
                  <span>Apenas R$8,33 por mês</span>
                </div>
                <p className="mt-1 text-xs">Preço fixo garantido durante todo o período</p>
              </div>

              <ul className="space-y-2 md:space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Acesso completo à plataforma</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Recursos exclusivos</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span>Economia de 16,7% em relação ao mensal</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              {currentPlan === "anual" ? (
                <Button size="lg" className="w-full text-sm" disabled>
                  {buttonText.currentPlan || "Plano atual"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-sm"
                  onClick={() => onSelectPlan && onSelectPlan("anual")}
                >
                  {buttonText.annual}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 md:mt-12 text-center"
      >
        <p className="text-xs sm:text-sm text-muted-foreground">
          Todos os planos incluem acesso completo à plataforma. Você pode cancelar a qualquer momento.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Ao assinar, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-primary">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-primary">
            Política de Privacidade
          </a>
          .
        </p>
      </motion.div>
    </div>
  )
}
