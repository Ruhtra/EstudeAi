"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

export default function SuccessPage() {
    const { update } = useSession()
    const router = useRouter()
    const [hasError, setHasError] = useState(false)
    const [hasChecked, setHasChecked] = useState(false)

    // TO-DO: Ajustar o timeout de 100ms para uma abordagem melhor futuramente
    // Executa a verificação apenas uma vez
    if (!hasChecked) {
        setHasChecked(true)

        // Executa de forma assíncrona para não bloquear o render
        setTimeout(async () => {
            try {
                console.log("Executando update...")
                const updatedSession = await update()
                console.log("Update concluído:", updatedSession)

                setTimeout(() => {
                    if (!updatedSession?.user.hasPayment) {
                        setHasError(true)
                    } else {
                        handleManualRedirect()
                    }

                }, 2000)
            } catch (error) {
                console.error("Erro no update:", error)
                setHasError(true)
            }
        }, 100)
    }


    const handleManualRedirect = useCallback(() => {
        router.push("/student")
    }, [router])




    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-2xl"
            >
                <Card
                    className={`relative overflow-hidden border-2 shadow-2xl ${hasError
                        ? "border-amber-200 bg-gradient-to-br from-white to-amber-50 dark:border-amber-800 dark:from-slate-900 dark:to-amber-950"
                        : "border-green-200 bg-gradient-to-br from-white to-green-50 dark:border-green-800 dark:from-slate-900 dark:to-green-950"
                        }`}
                >
                    {/* Efeitos visuais de fundo */}
                    <div
                        className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl ${hasError ? "bg-amber-500/20" : "bg-green-500/20"
                            }`}
                    ></div>
                    <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>

                    <CardContent className="relative p-8 md:p-12 text-center">
                        {/* Ícone animado */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                            className="mb-6 flex justify-center"
                        >
                            <div className="relative">
                                <div
                                    className={`flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full ${hasError ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"
                                        }`}
                                >
                                    {hasError ? (
                                        <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-amber-600 dark:text-amber-400" />
                                    ) : (
                                        <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-400" />
                                    )}
                                </div>
                                {/* Círculos animados ao redor do ícone */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className={`absolute inset-0 rounded-full border-2 border-dashed ${hasError ? "border-amber-300 dark:border-amber-700" : "border-green-300 dark:border-green-700"
                                        }`}
                                />
                            </div>
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mb-4 flex justify-center"
                        >
                            <Badge
                                className={`px-4 py-2 text-sm font-medium ${hasError
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    }`}
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                {hasError ? "Problema Detectado" : "Pagamento Confirmado"}
                            </Badge>
                        </motion.div>

                        {/* Título principal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className={`mb-4 bg-clip-text text-3xl md:text-4xl font-bold tracking-tight text-transparent ${hasError
                                ? "bg-gradient-to-r from-amber-600 to-orange-600"
                                : "bg-gradient-to-r from-green-600 to-primary"
                                }`}
                        >
                            {hasError ? "Ops! Problema no Redirecionamento" : "Pagamento Realizado com Sucesso!"}
                        </motion.h1>

                        {/* Descrição */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mb-8 text-lg text-muted-foreground"
                        >
                            {hasError
                                ? "Seu pagamento foi processado, mas houve um problema técnico no redirecionamento automático."
                                : "Sua assinatura foi ativada e você já tem acesso completo a todos os recursos da plataforma."}
                        </motion.p>

                        {/* Card de informações */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className={`mb-8 rounded-lg p-6 border ${hasError
                                ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20"
                                : "bg-gradient-to-r from-primary/10 to-green-500/10 border-primary/20"
                                }`}
                        >
                            {hasError ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-3 text-amber-600 dark:text-amber-400">
                                        <AlertTriangle className="h-5 w-5" />
                                        <span className="font-medium">Redirecionamento manual necessário</span>
                                    </div>
                                    <Button
                                        onClick={handleManualRedirect}
                                        className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90"
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Ir para Área do Aluno
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3 text-primary">
                                    <ArrowRight className="h-5 w-5" />
                                    <span className="font-medium">Redirecionando para sua área do aluno...</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Loading animado - só mostra se não há erro */}
                        {!hasError && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="flex items-center justify-center gap-3"
                            >
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Preparando sua experiência personalizada...</span>
                            </motion.div>
                        )}

                        {/* Barra de progresso - só mostra se não há erro */}
                        {!hasError && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mt-6"
                            >
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <motion.div
                                        animate={{
                                            width: ["0%", "100%", "0%"],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "easeInOut",
                                        }}
                                        className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">Verificando status do pagamento...</p>
                            </motion.div>
                        )}

                        {/* Mensagem adicional para erro */}
                        {hasError && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="mt-6 text-center"
                            >
                                <p className="text-sm text-muted-foreground">
                                    Não se preocupe, sua assinatura está ativa. Use o botão acima para acessar sua conta.
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                {/* Elementos decorativos flutuantes */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    className={`absolute top-10 left-10 ${hasError ? "text-amber-500/30" : "text-green-500/30"}`}
                >
                    <Sparkles className="h-8 w-8" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 10, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute top-20 right-10 text-primary/30"
                >
                    <Sparkles className="h-6 w-6" />
                </motion.div>
            </motion.div>
        </div>
    )
}
