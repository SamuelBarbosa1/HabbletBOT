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

import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { connect } from 'puppeteer-real-browser';

puppeteerExtra.use(StealthPlugin());

const args = process.argv.slice(2);
const userLogin = 'monra09';
const userPassword = 'pato12';
const searchUser = args[0];

const exit = (err) => console.log(err);

const login = async (page) => {
    await page.waitForTimeout(5000);
    const login = await page.$("input.rounded-input.blue-active.username");
    if (!login) return 0;
    await login.type(userLogin);

    await page.waitForTimeout(1000);
    const password = await page.$("input[name='credentials_password']");
    await password.type(userPassword);
    await page.waitForTimeout(500);

    await page.click(".rounded-button.blue.plain.submit-form.g-recaptcha.default-prevent");
};

const handleRefreshError = async (page) => {
    console.log("Detectado error.refresh, tentando recarregar...");
    await page.reload({ waitUntil: 'networkidle2' });
};

const runBot = async () => {
    const { browser, page } = await connect({
        headless: false,
        turnstile: true
    });

    await page.setViewport({ width: 1280, height: 700 });

    // Se detectar error.refresh, recarregar a página
    if (await page.$('div[data-type="error"].notification-container')) {
        await handleRefreshError(page);
    }

    // Continuar com o login
    await login(page);
    await page.waitForTimeout(4000);

    const game = await browser.newPage();
    await game.goto('https://www.habblet.city/');
    await game.setViewport({ width: 1280, height: 1024 });

    await game.waitForTimeout(2000);
    await game.click("#closeAd1");
    await game.waitForTimeout(2000);
    await game.click("#closeAd2");

    await game.waitForSelector(".cursor-pointer.navigation-item.icon.icon-friendsearch");
    await game.waitForTimeout(2000);
    await game.click(".cursor-pointer.navigation-item.icon.icon-friendsearch");

    await game.waitForTimeout(5000);
    const search = await game.$("input.search-input.goldfish");
    await game.waitForTimeout(5000);
    await search.type(searchUser);
    await game.waitForTimeout(3000);
    await game.click("div.btn-search.goldfish.cursor-pointer");
    await game.waitForTimeout(4000);
    await game.click("div.cursor-pointer.nitro-friends-spritesheet.icon-profile-sm");

    await game.waitForTimeout(3000);
    const user = {
        nome: await game.$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.fw-bold", el => el.textContent.trim()),
        missao: await game.$$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.small", el => el[0].textContent.trim()),
        criacao: await game.$$eval(".d-flex.overflow-hidden.flex-column.gap-2.container-fluid.content-area div.d-inline.text-black.small span", el => el[0].textContent.split('<')[0].trim())
    };
    console.log(user);
    await browser.close();
};

const init = () => {
    if (!args[0]) return exit("player pesquisado não passado");
    runBot();
};

init();