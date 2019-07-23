

(async () => {
  const fs = require('fs').promises
  const puppeteer = require('puppeteer')

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.poemhunter.com/arthur-rimbaud/poems/page-4/?a=a&l=3&y=')
  const helperPage = await browser.newPage()

  //    HELPER FUNCTIONS
  const GetProperty = async(element, property) => {
    return await (await element.getProperty(property)).jsonValue()
  }

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  const elements = await page.$$('.title>a', el => el);
  
  await asyncForEach(elements, async node => {
    const href = await GetProperty(node, 'href')

    await helperPage.goto(href)

    const h1PoemTitle = await helperPage.$$('#solSiirMetinDV > h1', h1 => h1)
    const pPoem = await helperPage.$$('#solSiirMetinDV > div.KonaBody > p', p => p)
    
    const title = await GetProperty(h1PoemTitle[0], 'innerText')
    const text = await GetProperty(pPoem[0], 'innerText')
    console.log({title, text})
    await fs.writeFile(`./poems/${title.replace('/', '-')}.txt`, text)

  })

  await browser.close();
})();