# ⚡ Quick Start - TradeJournal Pro

Comece a usar em **5 minutos**! 🚀

## 🎯 Passo 1: Instalar Dependências (1 min)

```bash
npm install
```

## 🎯 Passo 2: Configurar Supabase (2 min)

### 2.1 Criar Projeto
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Dê um nome (ex: "tradejournal-pro")
4. Escolha uma senha forte
5. Selecione região (mais próxima de você)
6. Clique em "Create new project"
7. **Aguarde 2 minutos** (provisionamento)

### 2.2 Executar Migration
1. No dashboard, vá em **SQL Editor** (ícone de código)
2. Clique em **New Query**
3. Abra o arquivo `supabase/migrations/001_initial_schema.sql`
4. **Copie TODO o conteúdo**
5. **Cole** no SQL Editor
6. Clique em **Run** (ou F5)
7. Aguarde "Success. No rows returned" ✅

### 2.3 Copiar Credenciais
1. Vá em **Settings** (engrenagem) → **API**
2. Copie:
   - **Project URL** (ex: https://abc123.supabase.co)
   - **anon public** key (começa com "eyJ...")
   - **service_role** key (aba "service_role")

## 🎯 Passo 3: Configurar Ambiente (1 min)

Crie arquivo `.env.local` na raiz:

```bash
# Cole suas credenciais do Supabase aqui:
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...sua-key-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...sua-service-key-aqui

# Crie uma senha forte para API:
API_SECRET_KEY=minha-senha-super-secreta-123

# Deixe como está:
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**💡 Dica**: Para gerar API_SECRET_KEY:
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

## 🎯 Passo 4: Rodar! (1 min)

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎉 Usar pela Primeira Vez

### 1. Criar Conta
1. Acesse http://localhost:3000/login
2. Clique em **"Criar conta"**
3. Email: seu@email.com
4. Senha: mínimo 6 caracteres
5. Clique em **"Criar Conta"**
6. ✅ Conta criada!

**⚠️ IMPORTANTE**: 
- Supabase envia email de confirmação
- Verifique sua caixa de entrada
- Clique no link para confirmar
- Se não receber, use o email de teste do Supabase

**🔥 DICA**: Para desenvolvimento, você pode usar o modo de "Auto Confirm" no Supabase:
- Vá em **Authentication** → **Settings**
- Desative "Enable email confirmations"
- Agora contas são criadas instantaneamente! (só para DEV)

### 2. Fazer Login
1. Email + senha que você criou
2. Clique em **"Entrar"**
3. Você será redirecionado para o Dashboard! 🎊

### 3. Explorar o Dashboard
- 📊 Veja os KPIs (estarão zerados por enquanto)
- 📅 Acesse Calendar
- 📈 Acesse Analysis
- 🛠 Acesse Management

### 4. Criar Setups e Tags
1. Vá em **Management** (sidebar)
2. Clique em **"Add Setup"**
   - Nome: "Trend Continuation"
   - Descrição: "Trading com a tendência"
   - Escolha uma cor verde
   - Salvar
3. Clique em **"Add Tag"**
   - Nome: "Followed Plan"
   - Escolha uma cor
   - Salvar

Repita e crie:
- Setups: "Breakout", "Reversal", "Scalp"
- Tags: "Perfect Entry", "Stop Loss Hit", "Good R:R"

### 5. Adicionar Seu Primeiro Trade

#### Via API (Recomendado para teste):

```bash
# Copie seu User ID em Settings
# Copie sua API Key do .env.local

curl -X POST http://localhost:3000/api/collect-trade \
  -H "Content-Type: application/json" \
  -H "x-api-key: minha-senha-super-secreta-123" \
  -d '{
    "timestamp": "2025-01-15T14:30:00Z",
    "symbol": "MNQ",
    "side": "LONG",
    "quantity": 1,
    "entry_price": 18000.00,
    "exit_price": 18010.00,
    "pnl": 200.00,
    "setup": "Trend Continuation",
    "tags": ["Followed Plan", "Perfect Entry"],
    "notes": "Ótimo trade seguindo a tendência!",
    "user_id": "seu-user-id-do-settings"
  }'
```

**Windows PowerShell**:
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "minha-senha-super-secreta-123"
}

$body = @{
    timestamp = "2025-01-15T14:30:00Z"
    symbol = "MNQ"
    side = "LONG"
    quantity = 1
    entry_price = 18000.00
    exit_price = 18010.00
    pnl = 200.00
    setup = "Trend Continuation"
    tags = @("Followed Plan", "Perfect Entry")
    notes = "Ótimo trade!"
    user_id = "seu-user-id-do-settings"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/collect-trade" -Method Post -Headers $headers -Body $body
```

#### Ou use o script de teste:

```bash
# Edite scripts/test-api.sh com seu User ID e API Key
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

### 6. Ver Resultados!
1. Volte ao **Dashboard**
2. 🎉 Veja seu trade na tabela!
3. 📊 Veja as métricas atualizadas!
4. 📅 Veja no Calendar!
5. 📈 Veja nas Analysis!

## 🎯 Adicionar Vários Trades (Popular com dados)

Use este script para adicionar 20 trades de exemplo:

```bash
# Salve como: scripts/populate-trades.sh
#!/bin/bash

USER_ID="seu-user-id-aqui"
API_KEY="sua-api-key-aqui"
API_URL="http://localhost:3000/api/collect-trade"

# Array de setups
setups=("Trend Continuation" "Breakout" "Reversal" "Scalp")

# Array de tags
tags_positive=("Followed Plan" "Perfect Entry" "Good R:R")
tags_negative=("Emotional Trade" "FOMO" "No Setup")

# Gerar 20 trades
for i in {1..20}; do
  # Randomizar profit/loss
  if [ $((RANDOM % 2)) -eq 0 ]; then
    pnl=$((RANDOM % 300 + 50))  # Profit: 50 a 350
    tag_array="${tags_positive[$((RANDOM % 3))]}"
  else
    pnl=$((-(RANDOM % 150 + 20)))  # Loss: -20 a -170
    tag_array="${tags_negative[$((RANDOM % 3))]}"
  fi
  
  # Randomizar setup
  setup="${setups[$((RANDOM % 4))]}"
  
  # Randomizar side
  if [ $((RANDOM % 2)) -eq 0 ]; then
    side="LONG"
  else
    side="SHORT"
  fi
  
  # Data aleatória nos últimos 30 dias
  days_ago=$((RANDOM % 30))
  date=$(date -u -d "$days_ago days ago" +"%Y-%m-%dT%H:%M:%SZ")
  
  echo "📊 Trade $i: $setup | $side | \$$pnl"
  
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $API_KEY" \
    -d "{
      \"timestamp\": \"$date\",
      \"symbol\": \"MNQ\",
      \"side\": \"$side\",
      \"quantity\": 1,
      \"entry_price\": 18000.00,
      \"exit_price\": 18010.00,
      \"pnl\": $pnl,
      \"setup\": \"$setup\",
      \"tags\": [\"$tag_array\"],
      \"user_id\": \"$USER_ID\"
    }" > /dev/null
    
  sleep 0.2
done

echo "✅ 20 trades adicionados!"
```

Execute:
```bash
chmod +x scripts/populate-trades.sh
./scripts/populate-trades.sh
```

## 🚀 Deploy (Opcional)

Quando estiver pronto:

1. Faça push para GitHub
2. Acesse vercel.com
3. Import repository
4. Configure env vars
5. Deploy! ✅

[Guia completo de deploy](DEPLOYMENT.md)

## ❓ Problemas Comuns

### ❌ "Database connection failed"
**Solução**: Verifique se copiou as credenciais corretas do Supabase

### ❌ "Invalid API key"
**Solução**: Verifique se o .env.local está na raiz do projeto

### ❌ "Auth redirect mismatch"
**Solução**: No Supabase, vá em Authentication → URL Configuration e adicione http://localhost:3000

### ❌ "Module not found"
**Solução**: Delete node_modules e reinstale:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Trades não aparecem
**Solução**: 
1. Verifique se o User ID está correto (Settings)
2. Verifique se a API Key está correta
3. Veja o console do browser (F12) por erros

## 📚 Próximos Passos

1. ✅ Ler [README.md](README.md) completo
2. ✅ Explorar [API_EXAMPLES.md](docs/API_EXAMPLES.md)
3. ✅ Configurar integração com NinjaTrader
4. ✅ Fazer deploy na Vercel
5. ✅ Compartilhar com traders!

## 💬 Precisa de Ajuda?

- 📖 [README.md](README.md) - Documentação completa
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy em produção
- 📡 [API_EXAMPLES.md](docs/API_EXAMPLES.md) - Exemplos de API
- 🐛 [GitHub Issues](https://github.com/seu-usuario/ninja_journal/issues)

---

**Happy Trading!** 📈

Agora você está pronto para rastrear seus trades como um profissional! 🎯

