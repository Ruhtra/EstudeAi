"use client"
import SubscriptionPlans from "./_components/subscription_plans"
import axios from "axios"
import { toast } from "sonner";
export default function PricingPage() {


    const handleSelectPlan = async (plan: "mensal" | "anual") => {
        const lookupKey = plan === "mensal" ? "plano_mensal" : "plano_anual"

        try {
            const response = await axios.post("/api/subscription/create-checkout-session", {
                lookup_key: lookupKey,
            })

            if (response.data?.url) {
                window.location.href = response.data.url
            } else {
                toast("Não foi possível obter a URL de checkout.")
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast(error.message || "Erro ao criar a sessão de checkout.")
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
                <SubscriptionPlans
                    title="Planos de Assinatura"
                    subtitle="Acesse todos os recursos da nossa plataforma com um plano que se adapta às suas necessidades."
                    buttonText={{
                        monthly: "Começar período gratuito",
                        annual: "Assinar com desconto",
                    }}
                    onSelectPlan={handleSelectPlan}
                />
            </div>
        </div>
    )
}
