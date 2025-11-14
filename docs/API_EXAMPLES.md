# 📡 API Examples - TradeJournal Pro

Exemplos práticos de como usar a API do TradeJournal Pro.

## 🔑 Autenticação

A API suporta duas formas de autenticação:

1. **API Key (Recomendado para NinjaTrader)**
   ```
   Header: x-api-key: sua-chave-aqui
   ```

2. **User Session (Para apps web)**
   ```
   Cookies de sessão do Supabase
   ```

## 📊 Endpoint Principal

```
POST /api/collect-trade
```

## 📝 Exemplos

### 1. Trade Básico (LONG)

```bash
curl -X POST https://seu-dominio.com/api/collect-trade \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-api-key" \
  -d '{
    "timestamp": "2025-01-15T14:30:00Z",
    "symbol": "MNQ",
    "side": "LONG",
    "quantity": 1,
    "entry_price": 18000.00,
    "exit_price": 18010.00,
    "pnl": 200.00,
    "user_id": "seu-user-id"
  }'
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Trade saved successfully",
  "trade": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "timestamp": "2025-01-15T14:30:00Z",
    "symbol": "MNQ",
    "side": "LONG",
    "quantity": 1,
    "entry_price": 18000.00,
    "exit_price": 18010.00,
    "pnl": 200.00,
    "created_at": "2025-01-15T14:30:05Z"
  }
}
```

### 2. Trade com Setup e Tags

```bash
curl -X POST https://seu-dominio.com/api/collect-trade \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-api-key" \
  -d '{
    "timestamp": "2025-01-15T15:45:00Z",
    "symbol": "ES",
    "side": "SHORT",
    "quantity": 2,
    "entry_price": 4800.00,
    "exit_price": 4795.00,
    "pnl": 500.00,
    "setup": "Trend Continuation",
    "tags": ["Followed Plan", "Perfect Entry", "Good Risk/Reward"],
    "notes": "Trade conforme o plano. Entrada no pullback.",
    "user_id": "seu-user-id"
  }'
```

### 3. Trade Perdedor

```bash
curl -X POST https://seu-dominio.com/api/collect-trade \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-api-key" \
  -d '{
    "timestamp": "2025-01-15T16:20:00Z",
    "symbol": "NQ",
    "side": "LONG",
    "quantity": 1,
    "entry_price": 18500.00,
    "exit_price": 18490.00,
    "pnl": -40.00,
    "setup": "Breakout",
    "tags": ["Failed Breakout", "Stop Loss Hit"],
    "notes": "Falso breakout. Stop loss acionado corretamente.",
    "user_id": "seu-user-id"
  }'
```

### 4. JavaScript/TypeScript

```typescript
async function sendTradeToJournal(trade) {
  const response = await fetch('https://seu-dominio.com/api/collect-trade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.quantity,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      pnl: trade.pnl,
      setup: trade.setup,
      tags: trade.tags,
      notes: trade.notes,
      user_id: process.env.USER_ID,
    }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save trade')
  }
  
  return data
}

// Uso
try {
  const result = await sendTradeToJournal({
    symbol: 'MNQ',
    side: 'LONG',
    quantity: 1,
    entryPrice: 18000,
    exitPrice: 18005,
    pnl: 100,
    setup: 'Trend Continuation',
    tags: ['Followed Plan'],
    notes: 'Great trade'
  })
  console.log('✅ Trade saved:', result.trade.id)
} catch (error) {
  console.error('❌ Error:', error.message)
}
```

### 5. Python

```python
import requests
from datetime import datetime

def send_trade_to_journal(trade):
    url = "https://seu-dominio.com/api/collect-trade"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "sua-api-key"
    }
    
    payload = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "symbol": trade["symbol"],
        "side": trade["side"],
        "quantity": trade["quantity"],
        "entry_price": trade["entry_price"],
        "exit_price": trade["exit_price"],
        "pnl": trade["pnl"],
        "setup": trade.get("setup"),
        "tags": trade.get("tags", []),
        "notes": trade.get("notes"),
        "user_id": "seu-user-id"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Uso
try:
    result = send_trade_to_journal({
        "symbol": "MNQ",
        "side": "LONG",
        "quantity": 1,
        "entry_price": 18000.0,
        "exit_price": 18005.0,
        "pnl": 100.0,
        "setup": "Trend Continuation",
        "tags": ["Followed Plan"],
        "notes": "Great trade"
    })
    print(f"✅ Trade saved: {result['trade']['id']}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
```

### 6. C# (NinjaTrader)

```csharp
using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

public class TradeJournalAPI
{
    private readonly string apiUrl;
    private readonly string apiKey;
    private readonly string userId;
    
    public TradeJournalAPI(string url, string key, string user)
    {
        apiUrl = url;
        apiKey = key;
        userId = user;
    }
    
    public async Task<bool> SendTradeAsync(Trade trade)
    {
        var payload = new
        {
            timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            symbol = trade.Symbol,
            side = trade.Side,
            quantity = trade.Quantity,
            entry_price = trade.EntryPrice,
            exit_price = trade.ExitPrice,
            pnl = trade.PnL,
            setup = trade.Setup,
            tags = trade.Tags,
            notes = trade.Notes,
            user_id = userId
        };
        
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("x-api-key", apiKey);
            
            var json = JsonConvert.SerializeObject(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync(apiUrl, content);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                Print($"✅ Trade saved: {result}");
                return true;
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                Print($"❌ Error: {error}");
                return false;
            }
        }
    }
}

// Uso no NinjaTrader
var api = new TradeJournalAPI(
    "https://seu-dominio.com/api/collect-trade",
    "sua-api-key",
    "seu-user-id"
);

await api.SendTradeAsync(new Trade
{
    Symbol = "MNQ",
    Side = "LONG",
    Quantity = 1,
    EntryPrice = 18000,
    ExitPrice = 18005,
    PnL = 100,
    Setup = "Trend Continuation",
    Tags = new[] { "Followed Plan" },
    Notes = "Great entry on pullback"
});
```

## ❌ Erros Comuns

### 401 Unauthorized
```json
{
  "error": "Invalid API key"
}
```
**Solução**: Verifique se o header `x-api-key` está correto.

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["side"],
      "message": "Invalid enum value. Expected 'LONG' | 'SHORT'"
    }
  ]
}
```
**Solução**: Corrija os dados enviados conforme o schema.

### 500 Internal Server Error
```json
{
  "error": "Failed to save trade",
  "details": "Database connection failed"
}
```
**Solução**: Verifique as configurações do Supabase.

## 📋 Schema de Validação

```typescript
{
  timestamp: string (ISO 8601),        // Obrigatório
  symbol: string,                      // Obrigatório
  side: "LONG" | "SHORT",              // Obrigatório
  quantity: number (inteiro positivo), // Obrigatório
  entry_price: number (positivo),      // Obrigatório
  exit_price: number (positivo),       // Obrigatório
  pnl: number,                         // Obrigatório
  setup: string | null,                // Opcional
  tags: string[] | null,               // Opcional
  notes: string | null,                // Opcional
  user_id: string (UUID),              // Obrigatório
  api_key: string                      // Obrigatório (header ou body)
}
```

## 🧪 Testando a API

### Via cURL
```bash
./scripts/test-api.sh
```

### Via Postman

1. Importe a collection: `docs/postman_collection.json`
2. Configure as variáveis de ambiente
3. Execute os requests

### Via Insomnia

1. Importe o workspace: `docs/insomnia_workspace.json`
2. Configure os headers
3. Execute os requests

## 📈 Rate Limiting

Atualmente não há rate limiting, mas em produção recomenda-se:

- **100 requests/minuto** por usuário
- **1000 requests/hora** por usuário

Configure usando [Upstash Rate Limit](https://upstash.com/docs/redis/features/ratelimiting) ou similar.

## 🔐 Segurança

### Boas Práticas

1. ✅ Use HTTPS em produção
2. ✅ Mantenha a API key secreta
3. ✅ Nunca exponha credenciais no código
4. ✅ Use variáveis de ambiente
5. ✅ Rotacione API keys periodicamente
6. ✅ Monitore uso suspeito

### Gerando API Key Segura

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

## 📞 Suporte

Precisa de ajuda com a API?

- 📖 [Documentação completa](../README.md)
- 🐛 [Reportar bug](https://github.com/seu-usuario/ninja_journal/issues)
- 💬 [Discord/Slack] (se houver)
- 📧 Email: [seu-email]

---

**Happy Trading!** 📈

