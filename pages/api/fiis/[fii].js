export default async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  const { fii } = req.query
  const url = "https://www.fundsexplorer.com.br/funds/"+fii;
  const model = {
    codigo: '#head > div > div > div > div.ticker-wrapper > h1 ($ | trim)',
    nome: '#head > div > div > div > h3 ($ | trim)',
    preco: '#stock-price > span.price ($ | trim)',
    percentagem: '#stock-price > span.percentage ($ | trim)',
    liquidez_diaria: ' div:nth-child(1) > span.indicator-value ($ | trim)',
    ultimo_rendimento: ' div:nth-child(2) > span.indicator-value ($ | trim)',
    dividendo_yield: ' div:nth-child(3) > span.indicator-value ($ | trim)',
    patrimonio_liquido: ' div:nth-child(4) > span.indicator-value ($ | trim)',
    valor_patrimonial: ' div:nth-child(5) > span.indicator-value ($ | trim)',
    rentabilidade_no_mes: ' div:nth-child(6) > span.indicator-value ($ | trim)',
    p_vp: ' div:nth-child(7) > span.indicator-value ($ | trim)'
  }

  const scrapy = require('node-scrapy')
  const fetch = require('node-fetch')

  return fetch(url)
    .then((res) => res.text())
    .then((body) => {
      const result = scrapy.extract(body, model)
      if (!result) {
        res.status(404);
        res.json({
          message: 'IES Não encontrada',
          type: 'IES_CODE_NOT_FOUND',
        });
          return;
      }else{
        result.preco = result.preco.match(/(\d|,)+/g).pop();
        result.percentagem = result.percentagem.replace("%","")
        result.ultimo_rendimento = result.ultimo_rendimento.match(/(\d|,)+/g).pop();
        result.dividendo_yield = result.dividendo_yield.replace("%","")
        result.patrimonio_liquido = result.patrimonio_liquido.replace("R$ ","")
        result.valor_patrimonial = result.valor_patrimonial.match(/(\d|,)+/g).pop();
        result.rentabilidade_no_mes = result.rentabilidade_no_mes.replace("%","")

        res.json(result);
      }
  });
};


