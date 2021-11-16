const puppeteer = require('puppeteer');
const peopleModel = require('./mongoDB/linkedin.db').peoplesModel

const getUserData = async (page, listItem) => {
    try {

        await page.goto(listItem)
        await page.waitForSelector('.pv-entity__date-range span:nth-child(2)')

        const fullDate = await page.evaluate(async () =>
            document.querySelector('.pv-entity__date-range span:nth-child(2)').textContent
        )
        const year = fullDate.split(' ')[1]
        if (year >= new Date().getFullYear() - 1) {
            await page.click('.pv-text-details__separator a')
            await page.waitForSelector('.artdeco-modal__header h1')
            const data = await page.evaluate(() => {
                const linkNames = []
                const name = document.querySelector('.artdeco-modal__header h1').textContent
                const links = document.querySelectorAll('.pv-contact-info__ci-container a')
                links.forEach(link => linkNames.push(link.href))
                return { name: name.trim(), link: linkNames }
            })
            const newUser = new peopleModel({
                name: data.name,
                LinkedinLink: data.link[0],
                email: data.link[1] === 'undefined' ? null : data.link[1]
            });
            newUser.save();
            await page.waitForSelector('.artdeco-modal__dismiss')
            await page.click('.artdeco-modal__dismiss')
            await page.goBack();
        }
    }
    catch (err) {
        await page.goBack()
        return null
    }
}
const main = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();

        //Go TO HTML LINK

        await page.goto('https://www.linkedin.com/checkpoint/rm/sign-in-another-account?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
        //SET VIEW PORT
        await page.setViewport({ width: 1200, height: 768 });

        //USERNAME INPUT
        await page.waitForSelector('#username')
        await page.type('#username', "ameerwajdeyousef@gmail.com")

        //USERNAME PASWORD
        await page.waitForSelector('#password')
        await page.type('#password', '999wajde')

        //SIGN IN BUTTON
        await page.waitForSelector('.login__form_action_container button')
        await page.click('.login__form_action_container button')

        //SEARCH INPUT
        await Promise.all([
            await page.waitForSelector(`#global-nav-typeahead input`),
            await page.click('#global-nav-typeahead input'),
            await page.focus('#global-nav-typeahead input'),
            await page.type('#global-nav-typeahead input', 'ceo of stealth israel'),
            await page.keyboard.press('Enter'),
            await page.waitForNavigation()
        ])

        //Search All Results
        // Manual clicking of the link
        await page.waitForSelector('.search-results__cluster-bottom-banner .app-aware-link')
        await page.click('.search-results__cluster-bottom-banner .app-aware-link')
        await page.waitForNavigation()
        await page.waitForSelector('li')
        const peopleList = await page.evaluate(() => Array.from(document.querySelectorAll('.reusable-search__entity-result-list li .entity-result__title-text a')
            , element => element.href));

        // console.log(peopleList.length);


        for (const personLink of peopleList) {
            await getUserData(page, personLink)
        }





        // peopleList.map(async (listItem, i) => {
        //     const user = await getUserData(page, listItem)
        //    
        //     console.log('sss');
        //     await page.goBack()
        //     await page.goBack()

        //     // if (i == 2) {
        //     //     const user = await getUserData(page, listItem)
        //     //     const newUser = new peopleModel({
        //     //         name: user.name,
        //     //         LinkedinLink: user.link[0],
        //     //         email: user.link[1] === 'undefined' ? null : user.link[1]
        //     //     });
        //     //     newUser.save();
        //     // }

        // })

        await page.waitForTimeout(29292929)

    }
    catch (e) {
        console.log(e);
    }

};

module.exports = {
    main: main
}