import {expect, Page, test} from '@playwright/test';
import luxon = require('luxon');

// import dayjs = require('dayjs');
// import customParseFormat = require('dayjs/plugin/customParseFormat');
// import localizedFormat = require('dayjs/plugin/localizedFormat');
// // Extend Day.js with the necessary plugins
// dayjs.extend(customParseFormat);
// dayjs.extend(localizedFormat);

// function wait(ms){
//     let start = new Date().getTime();
//     let end = start;
//     while(end < start + ms) {
//         end = new Date().getTime();
//     }
// }

const timeZone = 'Europe/London'; // UK time zone

function getCurrentDateTimeInTimeZone(timeZone: string): luxon.DateTime {
    const now = luxon.DateTime.now()
    now.setZone(timeZone)
    return now.plus({days: 1});
}

async function loginTest(page: Page): Promise<void> {
    await page.goto('https://demo-mobile.scriptassist.co.uk/login')

    await page.getByPlaceholder('Email').fill('dheeraj.tiwari@scriptassistinterview.com');
    await page.getByPlaceholder('Password').fill('m2h8U$S3yN95');
    await page.getByRole('button', {name: 'Sign in'}).click();

    await page.waitForURL('https://demo-mobile.scriptassist.co.uk/care');

    const welcomeMessage = await page.locator('h3').first().innerText();
    // if welcome, assuming logged in successfully
    expect(welcomeMessage).toContain('Welcome')
}

/// function to have login test
test('login with correct details', async ({page}) => {
    await loginTest(page)
})

// something is not getting correct, because of that can't verify this
// test('should show error for invalid credentials', async ({page}) => {
//     await page.goto('https://demo-mobile.scriptassist.co.uk/login')
//
//     await page.getByPlaceholder('Email').fill('test@scriptassistinterview.com');
//     await page.getByPlaceholder('Password').fill('wrong pass');
//     let button = page.getByRole('button', {name: 'Sign in'});
//     await button.click();
//     // loop to wait for button re-enable, because error is shown after re-enabling of button
//     wait(5000)
//
//     // Verify that the error message is displayed
//     await page.locator('#login-error').getByRole('button').click();
//     const errorMessage =    page.getByText('Email or password is incorrect');
//     let innerText = await errorMessage.allInnerTexts()
//     let textContent = await errorMessage.allTextContents()
//     expect(innerText).toContain('Email or password is incorrect');
// });

test('appointment booking test', async ({page}) => {

    await loginTest(page)

    await page.waitForURL('https://demo-mobile.scriptassist.co.uk/care');

    const welcomeMessage = await page.locator('h3').first().innerText();
    // if welcome, assuming logged in successfully
    expect(welcomeMessage).toContain('Welcome')

    await page.goto('https://demo-mobile.scriptassist.co.uk/book-appointment');
    await page.locator('div').filter({hasText: /^Doctor\/Nurse$/}).getByRole('textbox').click();
    await page.getByRole('option', {name: 'Harry Bakewell'}).click();
    // await page.locator('div').filter({ hasText: /^Appointment type$/ }).locator('div').nth(2).click();
    await page.locator('div').filter({hasText: /^Appointment type$/}).getByRole('textbox').click();
    await page.getByRole('option', {name: 'Initial Consultation (60 mins'}).click();
    await page.locator('label').filter({hasText: 'Phone'}).click();
    let dateToBeSelected = getCurrentDateTimeInTimeZone(timeZone);
    let dateToBeSelectedString = dateToBeSelected.toFormat('dd MMMM');
    await page.getByLabel(dateToBeSelectedString).click();
    let noSlotNotice = await page.getByText('No slots available').count()
    expect(noSlotNotice).toBeLessThan(1);
    await page.locator('label').filter({hasText: '00:00'}).click();
    await page.getByRole('button', {name: 'Confirm booking'}).click();
    await page.getByRole('button', {name: 'Make payment'}).click();
    await page.getByLabel('Pay by bank').check();

    const paymentPagePromise = page.waitForEvent('popup');
    await page.getByRole('button', {name: 'Pay Now'}).click();
    const paymentPage = await paymentPagePromise;
    await paymentPage.getByTestId('go-to-bank-button').click();

    // success or failure of payment will lead to payment confirmation page
    let details = page.getByRole('heading', {name: 'Appointment details'});
    // appointment booked regardless of payment confirmation
    expect((await details.allInnerTexts()).at(0)).toBe('Appointment details');

});

test('view upcoming booking', async ({page}) => {
    await loginTest(page);
    await page.goto('https://demo-mobile.scriptassist.co.uk/appointment-history')
    await page.getByRole('tab', {name: 'Upcoming'}).click();
    let noBookingNote = page.getByRole('heading', {name: 'No upcoming'});
    // for no upcoming as nothing is confirmed yet
    expect(await noBookingNote.count()).toBe(1)
})

test('cancel appointment booking test', async ({page}) => {
    await loginTest(page);
    await page.goto('https://demo-mobile.scriptassist.co.uk/appointment-history')
    let dateToBeSelected = getCurrentDateTimeInTimeZone(timeZone);
    let dateToBeSelectedString = dateToBeSelected.toFormat('EEE MMM dd yyyy');
    let dayAndMonth = dateToBeSelected.toFormat("EE MMM")
    await page.getByLabel('Pending').locator('div').filter({hasText: `${dateToBeSelectedString} 00:00 Phone consultation Harry Bakewell60 minutes£150.00${dayAndMonth}`}).nth(1).click();
    await page.getByRole('button', {name: 'Cancel', exact: true}).click();
    await page.getByRole('button', {name: 'Confirm'}).click();
    await page.waitForURL('**\/appointment-history')
    let url = page.url()
    expect(url).toContain('appointment-history')
})
