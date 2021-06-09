export default async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  const { fii } = req.query
  const url = "https://www.fundsexplorer.com.br/funds/"+fii;
  const model = {
    codigo: '#head > div > div > div > div.ticker-wrapper > h1 ($ | trim)',
    preco: '#stock-price > span.price ($ | trim)',
    percentagem: '#stock-price > span.percentage ($ | trim)',
    liquidez_diaria: ' div:nth-child(1) > span.indicator-value ($ | trim)',
    ultimo_rendimento: ' div:nth-child(2) > span.indicator-value ($ | trim)',
    dividendo_yield: ' div:nth-child(3) > span.indicator-value ($ | trim)',
    patrimonio_liquido: ' div:nth-child(4) > span.indicator-value ($ | trim)',
    valor_patrimonial: ' div:nth-child(5) > span.indicator-value ($ | trim)',
    rentabilidade_no_mes: ' div:nth-child(6) > span.indicator-value ($ | trim)',
    p_vp: ' div:nth-child(7) > span.indicator-value ($ | trim)',
    info_basica:{
      razao_social:'div:nth-child(1) > ul > li:nth-child(1) > div.text-wrapper > span.description ($ | trim)',
      cnpj:'div:nth-child(2) > ul > li:nth-child(1) > div.text-wrapper > span.description ($ | trim)',
      data_da_constituicao_do_fundo:'div:nth-child(1) > ul > li:nth-child(2) > div.text-wrapper > span.description ($ | trim)',
      publico_alvo:'div:nth-child(2) > ul > li:nth-child(2) > div.text-wrapper > span.description ($ | trim)',
      cotes_emitidas:'div:nth-child(1) > ul > li:nth-child(3) > div.text-wrapper > span.description ($ | trim)',
      mandato:'div:nth-child(2) > ul > li:nth-child(3) > div.text-wrapper > span.description ($ | trim)',
      patrimonio_inicial:'div:nth-child(1) > ul > li:nth-child(4) > div.text-wrapper > span.description ($ | trim)',
      segmento:'div:nth-child(2) > ul > li:nth-child(4) > div.text-wrapper > span.description ($ | trim)',
      valor_inicial_da_cota:'div:nth-child(1) > ul > li:nth-child(5) > div.text-wrapper > span.description ($ | trim)',
      prazo_de_apuracao:'div:nth-child(2) > ul > li:nth-child(5) > div.text-wrapper > span.description ($ | trim)',
      tipo_de_gestao:'div:nth-child(1) > ul > li:nth-child(6) > div.text-wrapper > span.description ($ | trim)',
      taxa_de_administracao:'div:nth-child(2) > ul > li:nth-child(6) > div.text-wrapper > span.description ($ | trim)',
      taxa_de_performance:'div:nth-child(1) > ul > li:nth-child(7) > div.text-wrapper > span.description ($ | trim)',
      taxa_de_gerenciamento:'div:nth-child(2) > ul > li:nth-child(7) > div.text-wrapper > span.description ($ | trim)',
      taxa_de_gestao:'div:nth-child(1) > ul > li:nth-child(8) > div.text-wrapper > span.description ($ | trim)',
      taxa_de_consultoria:'div:nth-child(2) > ul > li:nth-child(8) > div.text-wrapper > span.description ($ | trim)',
    }
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
        result.info_basica.patrimonio_inicial = result.info_basica.patrimonio_inicial.replace("R$ ","")
        result.info_basica.valor_inicial_da_cota = result.info_basica.valor_inicial_da_cota.replace("R$ ","")
        

        res.json(result);
      }
  });
};


