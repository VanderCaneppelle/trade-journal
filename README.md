# 📊 TradeJournal Pro

Um sistema completo de journal de trades com visual moderno inspirado no TurtleMetrics/TradeZella, construído com Next.js 14, TypeScript, Supabase e shadcn/ui.

![TradeJournal Pro](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📈 Dashboard Completo
- **KPIs em Tempo Real**: Current P&L, Win Rate, Profit Factor, Sharpe Ratio, Max Drawdown
- **Gráficos Interativos**: Equity curve e Daily P&L com Recharts
- **Tabela Profissional**: TanStack Table com sorting, filtering e paginação
- **Métricas Avançadas**: Consistency Score, Average Trade, Risk/Reward Ratio

### 📅 Calendário de Trading
- Visualização mensal do P&L
- Cores verde/vermelho para lucro/prejuízo
- Estatísticas por dia (trades, winrate)
- Navegação entre meses

### 📊 Analysis Avançada
- Performance por Setup
- Distribuição Win/Loss
- Heatmap de atividade (hora x dia da semana)
- Métricas detalhadas por estratégia

### 🛠 Management
- CRUD completo de Setups
- CRUD completo de Tags
- Organização visual com cores personalizadas

### 🔐 Autenticação Segura
- Login/Signup via Supabase Auth
- Row Level Security (RLS)
- Isolamento total de dados por usuário

### 🔌 API Integration
- Endpoint `/api/collect-trade` para NinjaTrader
- Validação com Zod
- Autenticação via API Key
- Documentação integrada

## 🚀 Setup

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

### 1. Clone o Repositório

```bash
git clone <your-repo-url>
cd ninja_journal
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Aguarde o projeto ser provisionado

#### 3.2 Execute a Migration

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Cole no editor e execute

Isso criará:
- Tabela `trades` com todas as colunas necessárias
- Tabela `setups` para estratégias de trading
- Tabela `tags` para marcadores
- Indexes para performance
- Row Level Security (RLS) policies

#### 3.3 Obtenha as Credenciais

No dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# API Key para NinjaTrader (escolha uma senha forte)
API_SECRET_KEY=sua-chave-secreta-aqui

# URL do site (para produção)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Execute o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Como Usar

### Primeiro Acesso

1. Acesse `/login`
2. Clique em "Criar conta"
3. Use seu email e uma senha (mínimo 6 caracteres)
4. Confirme seu email (verifique a caixa de entrada)
5. Faça login

### Criando Setups e Tags

1. Vá em **Management**
2. Crie seus setups (ex: "Trend Continuation", "Breakout")
3. Crie suas tags (ex: "Followed Plan", "Emotional Trade")

### Adicionando Trades Manualmente

Você pode adicionar trades via API. Exemplo usando `curl`:

```bash
curl -X POST http://localhost:3000/api/collect-trade \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta-aqui" \
  -d '{
    "timestamp": "2025-01-15T14:33:00Z",
    "symbol": "MNQ",
    "side": "LONG",
    "quantity": 1,
    "entry_price": 18000.50,
    "exit_price": 18004.00,
    "pnl": 70.00,
    "setup": "Trend Continuation",
    "tags": ["Followed Plan"],
    "user_id": "seu-user-id-aqui"
  }'
```

### Integrando com NinjaTrader

1. Vá em **Settings** no dashboard
2. Copie seu **User ID**
3. Configure um script no NinjaTrader para fazer POST requests ao fechar trades
4. Use o endpoint `/api/collect-trade`

Exemplo de script C# para NinjaTrader (básico):

```csharp
// Ao fechar uma posição
protected override void OnPositionUpdate(Position position, double averagePrice, 
    int quantity, MarketPosition marketPosition)
{
    if (marketPosition == MarketPosition.Flat && position.Quantity == 0)
    {
        var trade = new {
            timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            symbol = Instrument.MasterInstrument.Name,
            side = position.MarketPosition == MarketPosition.Long ? "LONG" : "SHORT",
            quantity = Math.Abs(quantity),
            entry_price = averagePrice,
            exit_price = Close[0],
            pnl = position.ProfitCurrency,
            user_id = "seu-user-id",
            api_key = "sua-api-key"
        };
        
        // Enviar via HTTP POST
        SendTradeToAPI(trade);
    }
}
```

## 🏗 Estrutura do Projeto

```
ninja_journal/
├── app/
│   ├── api/
│   │   └── collect-trade/         # API endpoint
│   ├── auth/
│   │   └── signout/               # Logout
│   ├── dashboard/
│   │   ├── analysis/              # Página de análise
│   │   ├── calendar/              # Calendário de trades
│   │   ├── management/            # Gerenciamento de setups/tags
│   │   ├── settings/              # Configurações
│   │   ├── layout.tsx             # Layout do dashboard
│   │   └── page.tsx               # Dashboard principal
│   ├── login/                     # Autenticação
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── analysis/                  # Componentes de análise
│   ├── calendar/                  # Componentes de calendário
│   ├── dashboard/                 # KPIs, gráficos, tabelas
│   ├── management/                # CRUD de setups/tags
│   ├── ui/                        # shadcn/ui components
│   ├── header.tsx
│   └── sidebar.tsx
├── lib/
│   ├── supabase/                  # Cliente Supabase
│   ├── metrics.ts                 # Cálculos de métricas
│   └── utils.ts
├── supabase/
│   └── migrations/                # SQL migrations
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 📊 Métricas Calculadas

O sistema calcula automaticamente:

- **Total P&L**: Soma de todos os trades
- **Win Rate**: Porcentagem de trades vencedores
- **Profit Factor**: Gross Profit / Gross Loss
- **Sharpe Ratio**: Retorno ajustado ao risco (anualizado)
- **Max Drawdown**: Maior queda desde o pico
- **Consistency Score**: Porcentagem de dias lucrativos
- **Average Trade**: P&L médio por trade
- **Expectancy**: Expectativa matemática por trade
- **Risk/Reward Ratio**: Relação entre ganho médio e perda média

## 🎨 Tema e Design

O projeto usa:
- **Dark mode** por padrão
- **Gradientes** verde/vermelho para P&L
- **Animações** suaves com Framer Motion
- **Glassmorphism** nos cards
- **Skeleton loaders** para UX
- **Responsivo** para desktop e mobile

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação via Supabase Auth
- ✅ API key para endpoints externos
- ✅ Validação de dados com Zod
- ✅ HTTPS obrigatório em produção

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push para GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente
4. Deploy!

```bash
# Ou via CLI
npx vercel --prod
```

### Outras Plataformas

O projeto é compatível com:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 Próximos Passos

Sugestões de features adicionais:

- [ ] Import de CSV
- [ ] Export de relatórios em PDF
- [ ] Notificações push
- [ ] Dark/Light mode toggle
- [ ] Multi-currency support
- [ ] Integração com TradingView
- [ ] Mobile app (React Native)
- [ ] Backtest simulator
- [ ] AI-powered insights

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Se tiver dúvidas ou problemas:

1. Abra uma [Issue](https://github.com/seu-usuario/ninja_journal/issues)
2. Entre em contato via email
3. Consulte a documentação do [Supabase](https://supabase.com/docs)
4. Consulte a documentação do [Next.js](https://nextjs.org/docs)

## 🙏 Créditos

Inspirado em:
- [TurtleMetrics](https://turtlemetrics.com)
- [TradeZella](https://tradezella.com)
- [EdgeWonk](https://edgewonk.com)

Construído com:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [TanStack Table](https://tanstack.com/table)
- [Framer Motion](https://www.framer.com/motion)

---

**Made with ❤️ for traders**

Happy Trading! 📈

