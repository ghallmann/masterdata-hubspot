# masterdata-hubspot
Pega a lista de desejos (lista de IDs de itens) dos clientes da tabela no masterdata e faz o upsert (cria ou atualiza) contato do cliente na hubspot com a propriedade lista_de_desejos

## (Script desativado 26/05/2026 após a migração para shopify. Se no futuro for necessário reativar é só descomentar o comando no arquivo de cron)


Esse script tá rodando no server **forms-automacoes**, dentro da pasta `/usr/local/scripts/masterdata-hubspot`. 
O `crontab` foi configurado para executar o script todos os dias às **10h00 (UTC)**. Para editar ou revisar a configuração, use:

```bash
crontab -e

