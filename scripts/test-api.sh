#!/bin/bash

# Script para testar a API do TradeJournal Pro
# Uso: ./test-api.sh

# Configure estas variáveis
API_URL="http://localhost:3000/api/collect-trade"
USER_ID="seu-user-id-aqui"
API_KEY="sua-api-key-aqui"

echo "🧪 Testando API do TradeJournal Pro..."
echo ""

# Teste 1: GET (verificar status)
echo "📊 Teste 1: Verificando status da API..."
curl -X GET "$API_URL"
echo -e "\n"

# Teste 2: POST com trade de exemplo
echo "📊 Teste 2: Enviando trade de exemplo..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "{
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"symbol\": \"MNQ\",
    \"side\": \"LONG\",
    \"quantity\": 1,
    \"entry_price\": 18000.50,
    \"exit_price\": 18004.00,
    \"pnl\": 70.00,
    \"setup\": \"Trend Continuation\",
    \"tags\": [\"Followed Plan\", \"Good Entry\"],
    \"notes\": \"Teste via script\",
    \"user_id\": \"$USER_ID\"
  }"
echo -e "\n"

# Teste 3: POST com trade perdedor
echo "📊 Teste 3: Enviando trade perdedor..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "{
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"symbol\": \"MES\",
    \"side\": \"SHORT\",
    \"quantity\": 2,
    \"entry_price\": 4800.00,
    \"exit_price\": 4805.00,
    \"pnl\": -50.00,
    \"setup\": \"Breakout\",
    \"tags\": [\"Stop Loss Hit\"],
    \"notes\": \"Mercado reverteu rápido\",
    \"user_id\": \"$USER_ID\"
  }"
echo -e "\n"

echo "✅ Testes concluídos!"
echo "Acesse o dashboard para ver os trades: http://localhost:3000/dashboard"

