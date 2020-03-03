//------------------------------ READ THIS --------------------------------------
//
//
// before starting, you need to add;
//
//1) google optimize preview URL (optional)
//2) URL by choosing a brand on line 86 (this is always needed no matter if AB test preview is given)
//3) define in the TESTDEVICESarray which devices are to be tested!
//
//
//------------------------------ END READ THIS ----------------------------------

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const fs = require('fs');
const fse = require('fs-extra');
const devices = require('puppeteer/DeviceDescriptors');
const ownDevice = require('1devices');
const date = require('2datetime');
const dateTime = date.dateTime;


// ------------- DEVICES OBJECTS  
const Nexus6P = devices[ 'Nexus 6P' ];
const Nexus6 = devices[ 'Nexus 6' ];
const Nexus5 = devices[ 'Nexus 5' ];
const pixel2 = devices[ 'Pixel 2' ];
const pixel2XL = devices[ 'Pixel 2 XL' ];
const galaxyS5 = devices[ 'Galaxy S5' ];
const galaxyS9 = ownDevice.galaxyS9;
const galaxyS7 = ownDevice.galaxyS7;
const iPhoneX = devices[ 'iPhone X' ];
const iPhoneXr = devices[ 'iPhone XR' ];
const iPhone8 = devices[ 'iPhone 8' ];
const iPhone6 = devices[ 'iPhone 6' ];
const iPhone5 = devices[ 'iPhone 5' ];
const iPadPro = devices[ 'iPad Pro' ];
const iPad = devices[ 'iPad' ];
const iPadMini = devices[ 'iPad Mini' ];
const iPadlandscape = devices[ 'iPad landscape' ];
const desktop1440_880 = ownDevice.desktop1440_880;
// --------- END DEVICES OBJECTS

//--------- start brand objects

const brands = [{
  brand: 'Skoda',
  tool:'mynew',
  url: 'https://cloud.mail.dieteren.be/mynew/cars?lang=fr&brand=Skoda',
  selectorCarStep1: '#KAM > div.car-wrap',
  selectorGenderStep3: '#m',
  selectorCommentStep3: '#carsForm > div.request-container.form-wrap > div.row > div:nth-child(7) > div > div > div > textarea'
},
{
  brand: 'Audi',
  tool:'mynew',
  url: 'https://cloud.mail.dieteren.be/mynew/cars?lang=nl&brand=Audi',
  selectorCarStep1: '#A1S > div.car-wrap',
  selectorCarStep1_1: '#A1S > img',
  selectorOpenGenderStep3: '#select2-gender-form-container',
  selectorGenderStep3: '', // Not possible for Audi - has a dynamic ID (see puppeteer AUDI hardcoded start's with ID match)
  selectorCommentStep3: '#carsForm > div.request-container.form-wrap > div.row > div:nth-child(10) > div > div > div > textarea'
},
{
  brand: 'Seat',
  tool:'mynew',
  url: 'https://cloud.mail.dieteren.be/mynew/cars?lang=nl&brand=Seat',
  selectorCarStep1: '#LE5 > div.car-wrap',
  selectorOpenGenderStep3: '#select2-gender-form-container',
  selectorGenderStep3: '',// Not possible for Seat - has a dynamic ID (see puppeteer SEAT hardcoded start's with ID match)
  selectorCommentStep3: '#carsForm > div.request-container.form-wrap > div.row > div:nth-child(10) > div > div > div > textarea'
}
];

// in step 1 of the funnel the brand have specific car names, the queryselector is different! -- Audi has 2 selctions to make
// in step 3 of the funnel seat/audi (dropdown) and skoda (radiobutton) have different gender selectors!

const audi = brands[1];
const skoda = brands[0];
const seat = brands[2];


const brandObject = audi; // -----'audi' or 'seat' or 'skoda'-----URL auto selected----- Change this to choose wich brand !
const url = brandObject.url; //START URL FOR PUPPETEER 
const brand = brandObject.brand;
console.log(brand + ' ' + brandObject.tool);

//-------- end brand objects



// ---- ADD TESTdevices you want to test to this Array -----
const testDevices = [galaxyS5, galaxyS9, pixel2, Nexus6P, desktop1440_880, iPhoneX, iPhone8, iPhone5, iPad, iPadPro];
// const testDevices = [desktop1440_880];

testAll(brand, testDevices);  // function for loop - commented to see effect on build !!



// ---FILL IN AB TEST PREVIEW URL AND/OR flow start URL

// const previewURLGoogleOptimize = "https://www.google-analytics.com/gtm/set_cookie?uiv2&id=GTM-TS4PDF6&gtm_auth=G4S7idMaTbioFtOmTgrRug&gtm_debug&gtm_experiment=GTM-TS4PDF6_OPT-WRW33%241&gtm_preview=opt_preview-slim&redirect=https%3A%2F%2Foptimize.google.com%2Foptimize%2Fsharepreview%3Fid%3DGTM-TS4PDF6%26gtm_experiment%3DGTM-TS4PDF6_OPT-WRW33%25241%26url%3Dhttps%253A%252F%252Fcloud.mail.dieteren.be%252Fmynew%252Fform%253Fbrand%253DSKODA%2526lang%253Dfr%2526model1%253DOC2%2526testdrive%253Dtrue%26opt_experiment_name%3DA%252FB%2520%25234%2520-%2520No%2520engagement%2520V2%26opt_variation_name%3DVariant%25201%26slim%3Dtrue%26container_name%3Dskoda.be&optimize_editor";

// --- END  AB TEST PREVIEW URL AND/OR flow start URL 





// ONLY CODE BELOW  -----------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
// DO NOT MAKE ANY CHANGE BELOW THIS LINE


// -------  function START ------------------------------------------------------------


function testAll (brand, data) {

  if (brand == 'Skoda') { // SKODA for loop starts here
  for (let deviceToTest of data){
    const device = deviceToTest.name;

 
  // Puppeteer --SKODA-- starts HERE --------------------------------------------------------------------

    (async () => {
      const browser = await puppeteer.launch({
        headless: true,       // default headless is true 
        args: ['--no-sandbox'] // no sandbox is for heroku
      }); 
      
    //args: ['--no-sandbox', '--disable-setuid-sandbox'],


      console.log('start ' + device);

      const page = await browser.newPage();
      await page.emulate(deviceToTest);   //emulate device new

      //--- START google optimize preview load (comment to just test a normal website with no a/b test)
      //uncomment below
      // await page.goto(previewURLGoogleOptimize);
      // await page.click('body > div > div > div > main > md-whiteframe > div > div > div.opt-preview-content.opt-preview-link-container.ng-scope > a');
      // await page.content();
      // await page.waitFor(5000);
      //
      // --- END google optimize preview link


      await page.goto(url);  //normal URL from 'brand' object 

      const dir = './tmp/' + brand + '/' + dateTime + '/' ;  // ---- create folders for screenshots per device per run.
      fse.ensureDir(dir)
      .then(() => {
        console.log(dir + " folder created succes! hoerey!")
      })
      .catch(err => {
        console.error(err + " folder creation --> something went wrong !! ohnooo!")
      })

      // funnel specific code here
      await page.content();
      await page.click('#cookie-bar > p:nth-child(1) > a.cb-enable');
      await page.waitFor(7000);
      await page.screenshot({path: dir + '1-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '1-fullPage-' + device + '.png', fullPage: true});
      console.log('step 1 ' + device);
      await page.waitForSelector(brandObject.selectorCarStep1);
      await page.click(brandObject.selectorCarStep1); // works for seat and skoda, but audi needs a second selection of specific model.
      await page.waitFor(5000);
      await page.waitForSelector('#TD');
      await page.click('#TD');
      await page.screenshot({path: dir + '2-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '2-fullPage-' + device + '.png', fullPage: true});
      console.log('step 2 ' + device);
      await page.waitForSelector('#myidRequest');
      await page.click('#myidRequest');
      await page.content();
      console.log('step 3 ' + device);
      await page.waitFor(6000);
      // await page.waitForSelector(brandObject.selectorGenderStep3); // THOIS GIVES A TIMEOUT ERROR 
      await page.click(brandObject.selectorGenderStep3);
      await page.type('#firstname-form', "test-firstname");
      await page.type('#lastname-form', "test-lastname");
      await page.type('#phone-form', "0000000000");
      await page.type('#email-form', "test345678@test3456789.be");
      await page.waitForSelector('#select2-DEALER_SIM-container');
      await page.click('#select2-DEALER_SIM-container');
      console.log('step 3.3 ' + device);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      console.log('step 3.4 ' + device);
      await page.type(brandObject.selectorCommentStep3, "DIT IS EEN TEST - NEGEREN -- THIS IS A TEST PLEASE IGNORE -- CECI EST UN TEST - IGNORER SVP");
      await page.screenshot({path: dir + '3-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '3-fullPage-' + device + '.png', fullPage: true});


      const analyticsData = await page.evaluate('dataLayer');   //-- save dataLayer to file
      fs.writeFile("dataLayer/dataLayer-" + device + "-" + dateTime + ".json", JSON.stringify(analyticsData), "utf8", (err, data) => {
        if (err) {
        console.error(err);
      } else {
        console.log("dataLayerFileCreated for " + device);
      }});


      // --- START IMPORTANT =>  DO NOT UNcomment line below  - else same garage gets many many mails !!!!!

      // await page.click('#submitForm01');

      // --- END COMMENT IMPORTANT 

      await page.content();
      // await page.waitFor(5000);
      await page.screenshot({path: dir + '4-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '4-fullPage-' + device + '.png', fullPage: true});
      console.log('step 4 ' + device);

      await browser.close();
      console.log("Done " + device);
      })();  // end puppeteer
  } // end for loop
console.log("Skoda is running ...");
}// end IF skoda

 else if (brand == "Seat"){ 
  for (let deviceToTest of data){ // --SEAT for loop starts HERE ---------------------------------------------
    const device = deviceToTest.name;

 
  // Puppeteer --SEAT- starts HERE --------------------------------------------------------------------

    (async () => {
      const browser = await puppeteer.launch({
        headless: true,       // default headless is true 
        args: ['--no-sandbox'] // no sandbox is for heroku
      }); 
      
    //args: ['--no-sandbox', '--disable-setuid-sandbox'],


      console.log('start ' + device);

      const page = await browser.newPage();
      await page.emulate(deviceToTest);   //emulate device new


      //--- START google optimize preview load (comment to just test a normal website with no a/b test)
      //uncomment below
      // await page.goto(previewURLGoogleOptimize);
      // await page.click('body > div > div > div > main > md-whiteframe > div > div > div.opt-preview-content.opt-preview-link-container.ng-scope > a');
      // await page.content();
      // await page.waitFor(5000);
      //
      // --- END google optimize preview link


      await page.goto(url);  //normal URL from 'brand' object (this is always needed no matter if AB test preview is given)


      const dir = './tmp/' + brand + '/' + dateTime + '/' ;  // ---- create folders for screenshots per device per run.
      fse.ensureDir(dir)
      .then(() => {
        console.log(dir + " folder created succes! hoerey!")
      })
      .catch(err => {
        console.error(err + " folder creation --> something went wrong !! ohnooo!")
      })

      // funnel specific code here
      await page.content();
      await page.click('#cookie-bar > p:nth-child(1) > a.cb-enable');
      await page.waitFor(7000);
      await page.screenshot({path: dir + '1-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '1-fullPage-' + device + '.png', fullPage: true});
      console.log('step 1 ' + device);
      await page.waitForSelector(brandObject.selectorCarStep1);
      await page.click(brandObject.selectorCarStep1); // works for seat and skoda, but audi needs a second selection of specific model.
      await page.waitFor(5000);
      await page.waitForSelector('#TD');
      await page.click('#TD');
      await page.screenshot({path: dir + '2-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '2-fullPage-' + device + '.png', fullPage: true});
      console.log('step 2 ' + device);
      await page.waitForSelector('#myidRequest');
      await page.click('#myidRequest');
      await page.content();
      console.log('step 3 ' + device);
      await page.waitFor(5000);
      await page.waitForSelector(brandObject.selectorOpenGenderStep3);
      await page.click(brandObject.selectorOpenGenderStep3);
      await page.waitForSelector('[id^="select2-gender-form-result-"][id$="-male"]');
      await page.click('[id^="select2-gender-form-result-"][id$="-male"]');
      await page.type('#firstname-form', "test-firstname");
      await page.type('#lastname-form', "test-lastname");
      await page.type('#phone-form', "0000000000");
      await page.type('#email-form', "test345678@test3456789.be");
      await page.waitForSelector('#select2-DEALER_SIM-container');
      await page.click('#select2-DEALER_SIM-container');
      console.log('step 3.3 ' + device);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      console.log('step 3.4 ' + device);
      await page.type(brandObject.selectorCommentStep3, "DIT IS EEN TEST - NEGEREN -- THIS IS A TEST PLEASE IGNORE -- CECI EST UN TEST - IGNORER SVP");
      await page.screenshot({path: dir + '3-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '3-fullPage-' + device + '.png', fullPage: true});


      const analyticsData = await page.evaluate('dataLayer');   //-- save dataLayer to file
      fs.writeFile("dataLayer/dataLayer-" + device + "-" + dateTime + ".json", JSON.stringify(analyticsData), "utf8", (err, data) => {
        if (err) {
        console.error(err);
      } else {
        console.log("dataLayerFileCreated for " + device);
      }});


      // --- START IMPORTANT =>  DO NOT UNcomment line below  - else same garage gets many many mails !!!!!

      // await page.click('#submitForm01');

      // --- END COMMENT IMPORTANT 

      await page.content();
      // await page.waitFor(5000);
      await page.screenshot({path: dir + '4-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '4-fullPage-' + device + '.png', fullPage: true});
      console.log('step 4 ' + device);

      await browser.close();
      console.log("Done " + device);
      })();  // end puppeteer
  } // end for loop


  console.log("Seat is running ...");

} // END IF SEAT

 else if (brand == "Audi"){

  for (let deviceToTest of data){ // --AUDI for loop starts HERE ---------------------------------------------
    const device = deviceToTest.name;

 
  // Puppeteer --AUDI- starts HERE --------------------------------------------------------------------

    (async () => {
      const browser = await puppeteer.launch({
        headless: true,       // default headless is true 
        args: ['--no-sandbox'] // no sandbox is for heroku
      }); 
      
    //args: ['--no-sandbox', '--disable-setuid-sandbox'],


      console.log('start ' + device);

      const page = await browser.newPage();
      await page.emulate(deviceToTest);   //emulate device new


      //--- START google optimize preview load (comment to just test a normal website with no a/b test)
      //uncomment below
      // await page.goto(previewURLGoogleOptimize);
      // await page.click('body > div > div > div > main > md-whiteframe > div > div > div.opt-preview-content.opt-preview-link-container.ng-scope > a');
      // await page.content();
      // await page.waitFor(5000);
      //
      // --- END google optimize preview link


      await page.goto(url);  //normal URL from 'brand' object (this is always needed no matter if AB test preview is given)


      const dir = './tmp/' + brand + '/' + dateTime + '/' ;  // ---- create folders for screenshots per device per run.
      fse.ensureDir(dir)
      .then(() => {
        console.log(dir + " folder created succes! hoerey!")
      })
      .catch(err => {
        console.error(err + " folder creation --> something went wrong !! ohnooo!")
      })

      // funnel specific code here
      await page.content();
      await page.waitForSelector('#cookie-bar > p:nth-child(1) > a.cb-enable');
      await page.click('#cookie-bar > p:nth-child(1) > a.cb-enable');
      await page.waitFor(7000);
      await page.screenshot({path: dir + '1-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '1-fullPage-' + device + '.png', fullPage: true});
      console.log('step 1 ' + device);
      await page.click(brandObject.selectorCarStep1); // works for seat and skoda, but audi needs 2nd selection
      await page.waitFor(1000);
      await page.waitForSelector(brandObject.selectorCarStep1_1);
      await page.click(brandObject.selectorCarStep1_1); 
      await page.waitFor(5000);
      await page.waitForSelector('#TD');
      await page.click('#TD'); // button to step 2
      await page.screenshot({path: dir + '2-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '2-fullPage-' + device + '.png', fullPage: true});
      console.log('step 2 ' + device);
      await page.waitForSelector('#myidRequest');
      await page.click('#myidRequest');
      await page.content();
      console.log('step 3 ' + device);
      await page.waitFor(5000);
      await page.waitForSelector(brandObject.selectorOpenGenderStep3);
      await page.click(brandObject.selectorOpenGenderStep3);
      await page.waitForSelector('[id^="select2-gender-form-result-"][id$="-male"]');
      await page.click('[id^="select2-gender-form-result-"][id$="-male"]');
      await page.type('#firstname-form', "test-firstname");
      await page.type('#lastname-form', "test-lastname");
      await page.type('#phone-form', "0000000000");
      await page.type('#email-form', "test345678@test3456789.be");
      await page.waitForSelector('#select2-DEALER_SIM-container');
      await page.click('#select2-DEALER_SIM-container');
      console.log('step 3.3 ' + device);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      console.log('step 3.4 ' + device);
      await page.type(brandObject.selectorCommentStep3, "DIT IS EEN TEST - NEGEREN -- THIS IS A TEST PLEASE IGNORE -- CECI EST UN TEST - IGNORER SVP");
      await page.screenshot({path: dir + '3-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '3-fullPage-' + device + '.png', fullPage: true});


      const analyticsData = await page.evaluate('dataLayer');   //-- save dataLayer to file
      fs.writeFile("dataLayer/dataLayer-" + device + "-" + dateTime + ".json", JSON.stringify(analyticsData), "utf8", (err, data) => {
        if (err) {
        console.error(err);
      } else {
        console.log("dataLayerFileCreated for " + device);
      }});


      // --- START IMPORTANT =>  DO NOT UNcomment line below  - else same garage gets many many mails !!!!!

      // await page.click('#submitForm01');

      // --- END COMMENT IMPORTANT 

      await page.content();
      // await page.waitFor(5000);
      await page.screenshot({path: dir + '4-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '4-fullPage-' + device + '.png', fullPage: true});
      console.log('step 4 ' + device);

      await browser.close();
      console.log("Done " + device);
      })();  // end puppeteer
  } // end for loop

  console.log("Audi is running ...");
} // END IF AUDI



///////////// - END OF LOOPING AND PUPPETEERING




  //START EXPRESS APP
  app.use(express.static(__dirname+'/tmp/' + brand + '/' + dateTime +'/'));
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  })
   
  app.listen(port, '0.0.0.0');
  console.log('Running at Port ' + port);
  //STOP EXPRESS APP

 console.log("All is done");

} // end of function TestAll


