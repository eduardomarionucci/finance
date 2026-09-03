import {
  BarChart3,
  Bell,
  ChevronRight,
  CreditCard,
  Bandage,
  GraduationCap,
  Home,
  Search,
  Settings,
  Smile,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Transações", icon: Users },
  { label: "Carteiras", icon: CreditCard },
  { label: "Categorias", icon: BarChart3 },
  { label: "Configurações", icon: Settings },
];

const statCards = [
  { title: "Receita total", value: "R$ 24,8k", hint: "+12% neste mês" },
  { title: "Clientes ativos", value: "1.248", hint: "+8% esta semana" },
  { title: "Conversões", value: "68%", hint: "+4,3% hoje" },
];

type Category = {
  name: string;
  amount: number;
  transactions: number;
  percentage: number;
  icon: LucideIcon;
  barClass: string;
  iconClass: string;
};

const categories: Category[] = [
  {
    name: "Moradia",
    amount: 8320,
    transactions: 24,
    percentage: 38,
    icon: Home,
    barClass: "bg-pink-500",
    iconClass: "bg-pink-100 text-pink-600",
  },
  {
    name: "Alimentação",
    amount: 5180,
    transactions: 18,
    percentage: 24,
    icon: Utensils,
    barClass: "bg-violet-500",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    name: "Lazer",
    amount: 3760,
    transactions: 10,
    percentage: 17,
    icon: Smile,
    barClass: "bg-blue-500",
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    name: "Educação",
    amount: 2910,
    transactions: 7,
    percentage: 13,
    icon: GraduationCap,
    barClass: "bg-teal-500",
    iconClass: "bg-teal-100 text-teal-600",
  },
  {
    name: "Saúde",
    amount: 1420,
    transactions: 6,
    percentage: 8,
    icon: Bandage,
    barClass: "bg-emerald-500",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function CategoryChart({ items }: { items: Category[] }) {
  const maxAmount = Math.max(...items.map((category) => category.amount), 1);

  return (
    <div className="flex h-56 w-full items-end justify-between gap-3">
      {items.map((category) => {
        const Icon = category.icon;
        const height = `${(category.amount / maxAmount) * 100}%`;

        return (
          <div key={category.name} className="flex h-full min-w-0 flex-1 flex-col items-center gap-3">
            <div className="relative flex h-full w-14 items-end justify-center">
              <div
                className={`relative w-full rounded-t-3xl ${category.barClass}`}
                style={{ height }}
                title={`${category.name}: ${currencyFormatter.format(category.amount)}`}
              >
                <span className="absolute bottom-3 left-1/2 inline-flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-4 w-4 text-slate-700" />
                </span>
              </div>
            </div>
            <span className="truncate text-xs font-medium text-slate-500">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function CategoryList({ items }: { items: Category[] }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50">
      {items.map((category) => {
        const Icon = category.icon;

        return (
          <li key={category.name} className="flex items-center gap-3 p-4">
            <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${category.iconClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{category.name}</p>
              <p className="text-xs text-slate-500">{category.transactions} transações</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-rose-600">- {currencyFormatter.format(category.amount)}</p>
              <p className="text-sm font-medium text-slate-500">{category.percentage}%</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-slate-50 font-sans">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-200 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white">
                F
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Finance</p>
                <p className="text-xs text-slate-500">Painel admin</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={item.active}>
                          <button className="w-full justify-start rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                            {item.active ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 font-sans">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" />
              <div>
                <p className="text-sm font-medium text-slate-900">Bem-vindo de volta</p>
                <p className="text-xs text-slate-500">Hoje é um ótimo dia para acompanhar o negócio.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar"
                  className="h-auto border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </label>
              <Button variant="outline" size="icon" className="rounded-lg border-slate-200 bg-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
                João Silva
              </Button>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  Nova visão do seu negócio
                </div>
                <h1 className="text-2xl font-semibold">Seu dashboard está pronto para crescer.</h1>
                <p className="mt-2 max-w-xl text-sm text-blue-100">
                  Acompanhe métricas, clientes e resultados em um único lugar.
                </p>
              </div>
              <Button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
                Ver relatórios
              </Button>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {statCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-sm text-emerald-600">{card.hint}</p>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Despesas por categoria</p>
                    <p className="text-sm text-slate-500">Últimos 30 dias</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {categories.length} categorias
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3 pb-6">
                  <CategoryChart items={categories} />
                </div>

                <CategoryList items={categories} />
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-900">Atividades recentes</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="rounded-lg bg-slate-50 p-3">Novo cliente cadastrado no painel.</li>
                  <li className="rounded-lg bg-slate-50 p-3">Meta de faturamento atualizada.</li>
                  <li className="rounded-lg bg-slate-50 p-3">Relatório mensal enviado com sucesso.</li>
                </ul>
              </article>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
