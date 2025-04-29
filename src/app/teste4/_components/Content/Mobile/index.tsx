import React, { createContext, useContext, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Contexto para gerenciar o estado de expansão
const MobileItemContext = createContext<{
    isExpanded: boolean;
    toggleExpanded: () => void;
    expandable: boolean;
} | null>(null);

const MobileItemProvider = ({ children, expandable }: { children: React.ReactNode; expandable: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!expandable) {
            setIsExpanded(true);
        }
    }, [expandable]);

    const toggleExpanded = () => {
        if (expandable) {
            setIsExpanded((prev) => !prev);
        }
    };

    return (
        <MobileItemContext.Provider value={{ isExpanded, toggleExpanded, expandable }}>
            {children}
        </MobileItemContext.Provider>
    );
};

const useMobileItemContext = () => {
    const context = useContext(MobileItemContext);
    if (!context) {
        throw new Error("useMobileItemContext must be used within a MobileItemProvider");
    }
    return context;
};

// -----------------------------------------------------------------------------
// Componentes personalizados para o card mobile
// -----------------------------------------------------------------------------

const ItemMobile = ({ children, expandable = false }: { children: React.ReactNode; expandable?: boolean }) => (
    <MobileItemProvider expandable={expandable}>
        <Card>
            <CardContent className="p-4">
                <div className="w-full">{children}</div>
            </CardContent>
        </Card>

    </MobileItemProvider>
);

const ItemMobileHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-between items-start">{children}</div>
);

const ItemMobileHeaderTitle = ({ children, title }: { children?: React.ReactNode; title: string }) => (
    <div className="flex flex-col">
        <h3 className="font-medium text-sm">{title}</h3>
        {children}
    </div>
);

const ItemMobileHeaderBadges = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-wrap gap-2 mt-1">{children}</div>
);

const ItemMobileHeaderOptions = ({ children }: { children: React.ReactNode }) => {
    const { expandable } = useMobileItemContext();
    return (
        <div className="flex items-center">
            {children}
            {expandable && <ItemMobileTrigger />}
        </div>
    );
};

const ItemMobileTrigger = () => {
    const { isExpanded, toggleExpanded } = useMobileItemContext();
    return (
        <button className="ml-2" onClick={toggleExpanded}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
    );
};

const ItemMobileContent = ({ children }: { children: React.ReactNode }) => {
    const { isExpanded } = useMobileItemContext();
    return <div className={`mt-3 ${isExpanded ? "block" : "hidden"}`}>{children}</div>;
};

const ItemMobileContentData = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
);

// -----------------------------------------------------------------------------
// Exportação dos componentes
// -----------------------------------------------------------------------------

export const ContentMobile = {
    ItemMobile,
    ItemMobileHeader,
    ItemMobileHeaderTitle,
    ItemMobileHeaderBadges,
    ItemMobileHeaderOptions,
    ItemMobileTrigger,
    ItemMobileContent,
    ItemMobileContentData,
};