"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogIn, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScrollAnimation } from "./_components/scroll-animation"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EstudeAI
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="#features" className="text-gray-600 hover:text-blue-600">
                Recursos
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600">
                Sobre
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600">
                Contato
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Área do Usuário
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={'/auth/login'}>
                  <DropdownMenuItem>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/auth/register">
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Criar Conta</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main>
          <section className="pt-32 pb-20 md:pt-40 md:pb-32">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <ScrollAnimation>
                  <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                      Aprenda com EstudeAi, <br />
                      <span className="text-blue-600">Evolua com EstudeAI</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Button size="lg" className="mr-4">
                      Comece Agora
                    </Button>
                    <Button variant="outline" size="lg">
                      Saiba Mais
                    </Button>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation>
                  <div className="md:w-1/2">
                    <Image
                      src="/placeholder.svg"
                      alt="EstudeAI em ação"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Recursos Principais</h2>
              </ScrollAnimation>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Aprendizado Personalizado",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    icon: "🧠",
                  },
                  {
                    title: "Análise de Desempenho",
                    description:
                      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    icon: "📊",
                  },
                  {
                    title: "Conteúdo Interativo",
                    description:
                      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                    icon: "🖥️",
                  },
                ].map((feature, index) => (
                  <ScrollAnimation key={index}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="py-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <ScrollAnimation>
                  <div className="md:w-1/2 mb-10 md:mb-0">
                    <Image
                      src="/placeholder.svg"
                      alt="Sobre EstudeAI"
                      width={500}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation>
                  <div className="md:w-1/2 md:pl-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre o EstudeAI</h2>
                    <p className="text-gray-600 mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                      mollit anim id est laborum.
                    </p>
                    <Button>Conheça Nossa História</Button>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          <section id="contact" className="py-20 bg-blue-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold mb-8">Pronto para Começar?</h2>
                <p className="text-xl mb-8">
                  Junte-se a milhares de estudantes que já estão transformando sua forma de aprender.
                </p>
                <Link href={'/auth/register'}>
                  <Button size="lg" variant="secondary">
                    Crie Sua Conta Grátis
                  </Button>
                </Link>
              </ScrollAnimation>
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="text-2xl font-bold">
                  EstudeAI
                </Link>
                <p className="mt-2 text-sm text-gray-400">© 2023 EstudeAI. Todos os direitos reservados.</p>
              </div>
              <nav className="flex space-x-4">
                <Link href="#" className="hover:text-blue-400">
                  Termos
                </Link>
                <Link href="#" className="hover:text-blue-400">
                  Privacidade
                </Link>
                <Link href="#" className="hover:text-blue-400">
                  Contato
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  )
}

