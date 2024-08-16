// login monra09
// senha pato12

/**
 * =====================================================
 * |                 W E L C O M E                     |
 * =====================================================
 * | OLÁ, SEJA BEM VINDO AO CÓDIGO FONTE. EU SOU 0     |
 * | SAMUEL. CRIADOR DO BOT.                           |
 * |                                                   |
 * | CASO ESTEJA PERDIDO.. EU TAMBÉM ESTOU !!          |
 * | CRIEI O BOT EM UM MOMENTO DE TÉDIO, MAS           |
 * | AQUI ESTÃO ALGUMAS ESPECIFICAÇÕES:        |
 * |                                                   |
 * | - A variavel args[0] guarda o player a ser        |
 * |   pesquisado quando você digita:                  |
 * |   node buscarHabbo.js <player>                    |
 * | - O Bot só funciona se o player existir.          |
 * | - As vezes o bot falha e da  um erro estranho.    | 
 * | - Sinta-se livre para mexer e aprimorar o código. |
 * | - SE DER ERRO, RODA DENOVO Q UMA HORA FUNCIONA    |
 * | - O código inicia lá em baixo.                    | 
 * | - Peço que não note os erros de lógica, criei     |
 * |    sem pensar em otimização.                      |  
 * | - O bot pode ser aprimorado para mais funções.    |
 * -----------------------------------------------------
 * |                 8====D ~~~> O:                    |
 * |                                                   |
 * -----------------------------------------------------
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const args = process.argv.slice(2);
const userLogin = `monra09`;
const userPassword = `pato12`;
const searchUser = args[0];

const exit = (err) => console.log(err);

const login = async (page) => {
    await page.waitFor(5000);
    const login = await page.$("input.rounded-input.blue-active.username");
    if (!login) return 0;
    await login.type(userLogin);

    await page.waitFor(1000);
    const password = await page.$("input[name='credentials_password']");
    await password.type(userPassword);
    await page.waitFor(500);

    await page.click(".rounded-button.blue.plain.submit-form.g-recaptcha.default-prevent");
}

const handleRefreshError = async (page) => {
    console.log("Detectado error.refresh, tentando recarregar...");
    await page.reload({ waitUntil: 'networkidle2' });
}

const runBot = () => {
    (
        async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();

            const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36";
            await page.setUserAgent(userAgent);
            await page.setExtraHTTPHeaders({
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "pt-BR,pt;q=0.6",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://www.habblet.city",
                "referer": "https://www.habblet.city/",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
            });

            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });
            });

            await page.goto('https://www.habblet.city/', { waitUntil: 'networkidle2' });
            await page.setViewport({ width: 1280, height: 700 });

            // Se detectar error.refresh, recarregar a página
            if (await page.$('div[data-type="error"].notification-container')) {
                await handleRefreshError(page);
            }

            // Continuar com o login
            await login(page);
            await page.waitFor(4000);

            const game = await browser.newPage();
            await game.goto("https://www.habblet.city/");
            await game.setViewport({ width: 1280, height: 1024 });

            await game.waitFor(2000);
            await game.click("#closeAd1");
            await game.waitFor(2000);
            await game.click("#closeAd2");

            await game.waitForSelector(".cursor-pointer.navigation-item.icon.icon-friendsearch");
            await game.waitFor(2000);
            await game.click(".cursor-pointer.navigation-item.icon.icon-friendsearch");

            await game.waitFor(5000);
            const search = await game.$("input.search-input.goldfish");
            await game.waitFor(5000);
            await search.type(searchUser);
            await game.waitFor(3000);
            await game.click("div.btn-search.goldfish.cursor-pointer");
            await game.waitFor(4000);
            await game.click("div.cursor-pointer.nitro-friends-spritesheet.icon-profile-sm");

            await game.waitFor(3000);
            const user = {
                nome: await game.$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.fw-bold", el => el.textContent.trim()),
                missao: await game.$$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.small", el => el[0].textContent.trim()),
                criacao: await game.$$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.small span", el => el[0].textContent.split('<')[0].trim())
            }
            console.log(user);
            await browser.close();
        }
    )()
}

const init = () => {
    if (!args[0])
        return exit("player pesquisado nao passado");
    runBot();
}

init();
