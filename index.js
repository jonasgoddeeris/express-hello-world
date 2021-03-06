//------------------------------ READ THIS --------------------------------------
//
//
// before starting, you need to add;
//
//- google optimize preview URL
//- URL
//- define in the TESTDEVICESarray which devices are to be tested!
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
const iPhoneXsMaxFirefox = ownDevice.iPhoneXsMaxFirefox;
const iPadPro = devices[ 'iPad Pro' ];
const iPad = devices[ 'iPad' ];
const iPadMini = devices[ 'iPad Mini' ];
const iPadlandscape = devices[ 'iPad landscape' ];
const desktop1440_880 = ownDevice.desktop1440_880;
// --------- END DEVICES OBJECTS




// ---- ADD TESTdevices you want to test to this Array -----
// const testDevices = [galaxyS5, galaxyS9, pixel2, Nexus6P, desktop1440_880, iPhoneX, iPhone8, iPhone5, iPad, iPadPro];
const testDevices = [desktop1440_880, galaxyS5];


testAll(testDevices);  // function for loop - commented to see effect on build !!



//--------- start brand objects

const skodaObject = {
  name: 'Skoda MyNew',
  url: 'https://cloud.mail.dieteren.be/mynew/cars?lang=fr&brand=Skoda'
}

const audiObject = {
  name: 'Audi MyNew',
  url: 'https://cloud.mail.dieteren.be/mynew/cars?lang=nl&brand=Audi'
}

const url = skodaObject.url; //START URL FOR PUPPETEER
const result = url.match(/brand=(.*?)$/);
const brand = result[1];


//-------- end brand objects


// ---FILL IN AB TEST PREVIEW URL AND/OR flow start URL

const previewURLGoogleOptimize = "https://www.google-analytics.com/gtm/set_cookie?uiv2&id=GTM-TS4PDF6&gtm_auth=G4S7idMaTbioFtOmTgrRug&gtm_debug&gtm_experiment=GTM-TS4PDF6_OPT-WRW33%241&gtm_preview=opt_preview-slim&redirect=https%3A%2F%2Foptimize.google.com%2Foptimize%2Fsharepreview%3Fid%3DGTM-TS4PDF6%26gtm_experiment%3DGTM-TS4PDF6_OPT-WRW33%25241%26url%3Dhttps%253A%252F%252Fcloud.mail.dieteren.be%252Fmynew%252Fform%253Fbrand%253DSKODA%2526lang%253Dfr%2526model1%253DOC2%2526testdrive%253Dtrue%26opt_experiment_name%3DA%252FB%2520%25234%2520-%2520No%2520engagement%2520V2%26opt_variation_name%3DVariant%25201%26slim%3Dtrue%26container_name%3Dskoda.be&optimize_editor";

// --- END  AB TEST PREVIEW URL AND/OR flow start URL 




// ------- for loop function START ------------------------------------------------------------


function testAll (data) {
  for (let deviceToTest of data){
    const device = deviceToTest.name;


  // Puppeteer starts HERE --------------------------------------------------------------------

    (async () => {
      const browser = await puppeteer.launch({
        headless: true,       // default headless is true 
        args: ['--no-sandbox'] // no sandbox is for heroku
      }); 
      
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
      await page.waitFor(5000);
      await page.screenshot({path: dir + '1-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '1-fullPage-' + device + '.png', fullPage: true});
      console.log('step 1 ' + device);
      await page.click('#KAM > div.car-wrap'); // insert generic ID for brand generic form
      await page.waitFor(5000);
      await page.click('#TD');
      await page.screenshot({path: dir + '2-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '2-fullPage-' + device + '.png', fullPage: true});
      console.log('step 2 ' + device);
      await page.waitFor(5000);
      await page.waitForSelector('#myidRequest');
      await page.click('#myidRequest');
      await page.content();
      console.log('step 3 ' + device);
      await page.waitFor(5000);
      await page.waitForSelector('#m');
      await page.click('#m');
      await page.type('#firstname-form', "test-firstname");
      await page.type('#lastname-form', "test-lastname");
      await page.type('#phone-form', "0000000000");
      await page.type('#email-form', "test345678@test3456789.be");
      await page.click('#select2-DEALER_SIM-container');
      console.log('step 3.3 ' + device);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      console.log('step 3.4 ' + device);
      await page.type('#carsForm > div.request-container.form-wrap > div.row > div:nth-child(7) > div > div > div > textarea', "DIT IS EEN TEST - NEGEREN -- THIS IS A TEST PLEASE IGNORE -- CECI EST UN TEST - IGNORER SVP");
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
      await page.waitFor(5000);
      await page.screenshot({path: dir + '4-viewport-' + device + '.png', fullPage: false});
      await page.screenshot({path: dir + '4-fullPage-' + device + '.png', fullPage: true});
      console.log('step 4 ' + device);

      await browser.close();
      console.log("Done " + device);
      })();
  }

  //START EXPRESS APP
  app.use(express.static(__dirname+'/tmp/Skoda/' + dateTime +'/'));
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  })
   
  app.listen(port, '0.0.0.0');
  console.log('Running at Port ' + port);
}
  //STOP EXPRESS APP

