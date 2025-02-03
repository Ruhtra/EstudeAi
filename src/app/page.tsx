"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useSpring, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, LogIn, UserPlus } from "lucide-react";

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentProgress = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)));
      }
    };

    window.addEventListener("scroll", updateScroll);

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return progress;
};

const FadeInWhenVisible = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollProgress = useScrollProgress();
  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* <Head>
        <meta property="og:title" content="Mauhel • Admin" />
        <meta
          property="og:description"
          content="Descubra o poder do Mauhel App para gerenciar suas atividades e acompanhar seu progresso de maneira prática e eficiente."
        />
        <meta property="og:image" content="/manifest/icon512_maskable.png" />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <meta property="theme-color" content="#e63946" />
      </Head> */}

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EstudeAI
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600"
            >
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
              <Link href={"/auth/login"}>
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
              </Link>

              <Link href={"/auth/register"}>
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
        <section className="min-h-screen flex items-center justify-center pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 mb-10 md:mb-0"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                  Aprenda de Forma Eficiente, <br />
                  <span className="text-blue-600">Evolua com EstudeAI</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Transforme sua jornada de aprendizado com nossa plataforma de
                  estudos inovadora e interativa.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link href={"/auth/register"}>
                    <Button size="lg" className="mr-4">
                      Comece Agora
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Saiba Mais
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2"
              >
                <Image
                  src="/placeholder.svg"
                  alt="EstudeAI em ação"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Recursos Principais
              </h2>
            </FadeInWhenVisible>
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
                <FadeInWhenVisible key={index}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="text-4xl mr-4">{feature.icon}</span>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="md:w-1/2 mb-10 md:mb-0"
              >
                <Image
                  src="/placeholder.svg"
                  alt="Sobre EstudeAI"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="md:w-1/2 md:pl-10"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Sobre o EstudeAI
                </h2>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600 mb-6">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <Button>Conheça Nossa História</Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-8">Pronto para Começar?</h2>
              <p className="text-xl mb-8">
                Junte-se a milhares de estudantes que já estão transformando sua
                forma de aprender.
              </p>

              <Link href={"/auth/register"}>
                <Button size="lg" variant="secondary">
                  Crie Sua Conta Grátis
                </Button>
              </Link>
            </FadeInWhenVisible>
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
              <p className="mt-2 text-sm text-gray-400">
                © 2023 EstudeAI. Todos os direitos reservados.
              </p>
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
  );
}
