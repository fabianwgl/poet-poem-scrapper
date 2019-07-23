

(async () => {
  const puppeteer = require('puppeteer')

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.poemhunter.com/arthur-rimbaud/poems/')
  const helperPage = await browser.newPage()
  //    await page.screenshot({path: 'example.png'});

  //    const tbody = await page.$$('#solSDDiv > div:nth-child(1) > div > div.content > table > tbody')
  //    const childrens = await tbody.$$('tr');
  const elements = await page.$$('.title>a', el => el);
  //    console.log({elements})
  
  const GetProperty = async(element, property) => {
    return await (await element.getProperty(property)).jsonValue()
  }

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  
  await asyncForEach(elements, async node => {
    const href = await GetProperty(node, 'href')
    //  console.log(href)

    await helperPage.goto(href)
    const pPoem = await helperPage.$$('#solSiirMetinDV > div.KonaBody > p', p => p)
    console.log({pPoem})
    const text = await GetProperty(pPoem[0], 'innerText')
    console.log(text)
  })

  await browser.close();
})();