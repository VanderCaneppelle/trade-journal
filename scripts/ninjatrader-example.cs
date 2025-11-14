// Exemplo de integração com NinjaTrader
// Cole este código no seu Strategy ou Indicator no NinjaTrader

using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace NinjaTrader.NinjaScript.Strategies
{
    public class TradeJournalIntegration : Strategy
    {
        private string apiEndpoint = "https://your-domain.com/api/collect-trade";
        private string userId = "your-user-id-from-settings";
        private string apiKey = "your-api-key-from-env";
        
        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "Integração automática com TradeJournal Pro";
                Name = "TradeJournal Integration";
                Calculate = Calculate.OnBarClose;
            }
        }

        protected override void OnPositionUpdate(Position position, double averagePrice, 
            int quantity, MarketPosition marketPosition)
        {
            // Quando a posição é fechada (flat)
            if (marketPosition == MarketPosition.Flat && position.Quantity == 0)
            {
                SendTradeToJournal(position, averagePrice, quantity);
            }
        }

        private async void SendTradeToJournal(Position position, double averagePrice, int quantity)
        {
            try
            {
                var trade = new
                {
                    timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    symbol = Instrument.MasterInstrument.Name,
                    side = position.MarketPosition == MarketPosition.Long ? "LONG" : "SHORT",
                    quantity = Math.Abs(quantity),
                    entry_price = averagePrice,
                    exit_price = Close[0],
                    pnl = position.ProfitCurrency,
                    setup = "Auto", // Você pode customizar isso
                    tags = new string[] { "NinjaTrader" },
                    notes = $"Trade executado via NinjaTrader em {DateTime.Now}",
                    user_id = userId,
                    api_key = apiKey
                };

                using (var client = new HttpClient())
                {
                    var json = JsonConvert.SerializeObject(trade);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    
                    var response = await client.PostAsync(apiEndpoint, content);
                    
                    if (response.IsSuccessStatusCode)
                    {
                        Print("✅ Trade enviado para o journal com sucesso!");
                    }
                    else
                    {
                        Print($"❌ Erro ao enviar trade: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                Print($"❌ Exceção ao enviar trade: {ex.Message}");
            }
        }
    }
}

/* 
 * INSTRUÇÕES DE USO:
 * 
 * 1. Copie este código para o NinjaTrader (Tools → Edit NinjaScript → Strategy → New Strategy)
 * 2. Instale o pacote Newtonsoft.Json via NuGet no NinjaTrader
 * 3. Configure as variáveis:
 *    - apiEndpoint: URL do seu servidor
 *    - userId: Seu User ID (encontrado em Settings)
 *    - apiKey: Sua API key (configurada no .env.local)
 * 4. Compile o script
 * 5. Adicione a strategy ao seu chart
 * 6. Trades serão enviados automaticamente ao fechar posições
 * 
 * NOTA: Este é um exemplo básico. Você pode customizar:
 * - Adicionar lógica para detectar o setup automaticamente
 * - Adicionar tags baseadas em condições de mercado
 * - Adicionar notes com mais detalhes da execução
 * - Implementar retry logic em caso de falha na API
 */

