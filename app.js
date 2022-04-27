const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


// : =================== Prepare csv file ===========================
//? check if file exist
// const path = "./product.csv";
// if(!fs.existsSync(path)){
    const csvWriter = createCsvWriter({
      path: 'product.csv',
      header: [
        {id: 'Handle' ,title: 'Handle'},
        {id: 'Title' ,title: 'Title'},
        {id: 'Body' ,title: 'Body (HTML)'},
        {id: 'Vendor' ,title: 'Vendor'},
        {id: 'StandardizedProductType' ,title: 'Standardized Product Type'},
        {id: 'CustomProductType' ,title: 'Custom Product Type'},
        {id: 'Tags' ,title: 'Tags'},
        {id: 'Published' ,title: 'Published'},
        {id: 'Option1Name' ,title: 'Option1 Name'},
        {id: 'Option1Value' ,title: 'Option1 Value'},
        {id: 'Option2Name' ,title: 'Option2 Name'},
        {id: 'Option2Value' ,title: 'Option2 Value'},
        {id: 'Option3Name' ,title: 'Option3 Name'},
        {id: 'Option3Value' ,title: 'Option3 Value'},
        {id: 'VariantSKU' ,title: 'Variant SKU'},
        {id: 'VariantGrams' ,title: 'Variant Grams'},
        {id: 'VariantInventoryTracker' ,title: 'Variant Inventory Tracker'},
        {id: 'VariantInventoryQty' ,title: 'Variant Inventory Qty'},
        {id: 'VariantInventoryPolicy' ,title: 'Variant Inventory Policy'},
        {id: 'VariantFulfillmentService' ,title: 'Variant Fulfillment Service'},
        {id: 'VariantPrice' ,title: 'Variant Price'},
        {id: 'VariantCompareAtPrice' ,title: 'Variant Compare At Price'},
        {id: 'VariantRequiresShipping' ,title: 'Variant Requires Shipping'},
        {id: 'VariantTaxable' ,title: 'Variant Taxable'},
        {id: 'VariantBarcode' ,title: 'Variant Barcode'},
        {id: 'ImageSrc' ,title: 'Image Src'},
        {id: 'ImagePosition' ,title: 'Image Position'},
        {id: 'ImageAltText' ,title: 'Image Alt Text'},
        {id: 'GiftCard' ,title: 'Gift Card'},
        {id: 'SEOTitle' ,title: 'SEO Title'},
        {id: 'SEODescription' ,title: 'SEO Description'},
        {id: 'GoogleShoppingGoogleProductCategory' ,title: 'Google Shopping  Google Product Category'},
        {id: 'GoogleShoppingGender' ,title: 'Google Shopping  Gender'},
        {id: 'GoogleShoppingAgeGroup' ,title: 'Google Shopping  Age Group'},
        {id: 'GoogleShoppingMPN' ,title: 'Google Shopping  MPN'},
        {id: 'GoogleShoppingAdWordsGrouping' ,title: 'Google Shopping  AdWords Grouping'},
        {id: 'GoogleShoppingAdWordsLabels' ,title: 'Google Shopping  AdWords Labels'},
        {id: 'GoogleShoppingCondition' ,title: 'Google Shopping  Condition'},
        {id: 'GoogleShoppingCustomProduct' ,title: 'Google Shopping  Custom Product'},
        {id: 'GoogleShoppingCustomLabel0' ,title: 'Google Shopping  Custom Label 0'},
        {id: 'GoogleShoppingCustomLabel1' ,title: 'Google Shopping  Custom Label 1'},
        {id: 'GoogleShoppingCustomLabel2' ,title: 'Google Shopping  Custom Label 2'},
        {id: 'GoogleShoppingCustomLabel3' ,title: 'Google Shopping  Custom Label 3'},
        {id: 'GoogleShoppingCustomLabel4' ,title: 'Google Shopping  Custom Label 4'},
        {id: 'VariantImage' ,title: 'Variant Image'},
        {id: 'VariantWeightUnit' ,title: 'Variant Weight Unit'},
        {id: 'VariantTaxCode' ,title: 'Variant Tax Code'},
        {id: 'Costperitem' ,title: 'Cost per item'},
        {id: 'PriceInternational' ,title: 'Price  International'},
        {id: 'CompareAtPriceInternational' ,title: 'Compare At Price  International'},
        {id: 'Status' ,title: 'Status'}

      ]
    });
// }
// else{
//   const csvWriter = 
// }

(async () => {
    // ! ========================================= Settings ===================================================
      const vendor = "SpitiGadget"; // ? usally your store name 
      const productType = "Apparel & Accessories > Clothing"; // ? Product Type in a catergory ex:(usally the types you create on your store  )
      const published = "true"; // ? this option whether you want the product to be published or add as draft 
      const status = "draft"; // ? this option whether you want the product to be active,draft or archived  
      const variantInventoryPolicy	= "continue";// ? variant Policy accept deny or continue for either product stop or contine selling after invetory reach 0
      const variantInventoryQty	= 50; // ? this is the quantity of each variant let keep it flat for all variant (cause : don't need ot for now)
      const variantFulfillmentService = vendor+"-fulfillment";//?( fullfulment you use for your products)
      const variantRequiresShipping = "true" //? if it a hard product always should be true
      const variantTaxable = "true";	
      const profitpercentage = 22; //? custom variable for the percent that i want to adjust for the amazon price


    // ! ========================================= /End Settings ==================================================
    const startUrl = "https://www.amazon.com/GreenLife-Ceramic-Non-Stick-Cookware-Turquoise/dp/B07R6XYN5Q"
    let browser = await puppeteer.launch({headless : true});
    let page = await browser.newPage();
    await page.goto(startUrl);
    // * ==================================
    // * =================== Varilables ====================
    let style_count = 0
    let color_count = 0
    let color_name = ""
    let style_name = ""
    let product_variation_url = []
    let item = []
    //  ! detect if there any style and return how many  exist
    try{
      style_count = await page.$$eval("div#variation_style_name > ul.a-unordered-list > li", (el) => el.length);
    }
    catch{
      style_count = 0
    }
    //  ! detect if there any color and return how many  exist
    try{
      color_count = await page.$$eval("div#variation_color_name > ul.a-unordered-list > li", (el) => el.length);
    }
    catch{
      color_count = 0
    }
    if(style_count > 0){
      style_name = await page.$eval("div#variation_style_name > div.a-row > span.selection", (el) => el.innerHTML.trim() );
      if(color_count > 0){
        console.log("Yes And color more than 1")
      }
    }
    else if(style_count == 0 && color_count > 0 ){
      color_name = await page.$eval("div#variation_color_name > div.a-row > span.selection", (el) => el.innerHTML.trim() );
      product_variation_url = await page.$$eval("div#variation_color_name > ul.a-unordered-list > li", (el) => el.map(x => "https://www.amazon.com/dp/"+x.getAttribute("data-defaultasin")));
      indexOfCureeentUrl = product_variation_url.indexOf(startUrl)
      product_variation_url.splice(indexOfCureeentUrl,1)
    }
    // * ===============================================Variables after first fetch page============================================================
    let title = await page.$eval("span#productTitle", (el) => el.innerHTML.trim().replace(/([")(',])/g,""));
    handler = title.replace(/(\s)/g,"-");
    handler = handler.replace(/(---)/g,"-");
    // : ====================================================== handling price ====================================================
        let curentprice = await page.$eval("#corePrice_feature_div > div > span.a-price > span.a-offscreen", (el) => el.innerHTML.trim().replace('$',''));
            curentprice = parseFloat(curentprice) + parseFloat(curentprice) / 100 * profitpercentage;
            curentprice = curentprice.toFixed(2)    
    // : ====================================================== handling price ====================================================

    
    let aboutItem = await page.$$eval("div#feature-bullets", (el) => el.map( // ! DESCRIPTION IN SHOPIFY
      x => x.outerHTML
    ))
    aboutItem = Object.entries(aboutItem).map(x => x.join(":")).join("\n");
    aboutItem = aboutItem.replace(/(0:)|(\\n)|(')/g,"")
    // * ===========================================================================================================
  
    let images  = await page.$$eval("li.a-spacing-small > span.a-list-item > span.a-button > span.a-button-inner > span.a-button-text > img", (el) => {
       return  el.map( x => x.src.replace(/(0:)|(\\n)|(')/,""))
    })
    // this is an video image that we dont't want to add  
    let indeximage = longest_str_in_array(images)
    indeximage = images.indexOf(indeximage)
    console.log("the index of longest image url is : "+indeximage) // ! here is the exra connsole that appers
    if( indeximage != -1 ){
      images.splice(indeximage,1)
    }
    images = images.map( image => image.replace(/(._.*)/g,".jpg"))
    //!=========================================== Debuggin ====================================
      item.push({
        Handle: handler, 
        Title: title, 
        Body: aboutItem, 
        Vendor: vendor, 
        StandardizedProductType: productType, 
        CustomProductType: '', 
        Tags: '', 
        Published: published, 
        Option1Name: color_name !="" ? 'Color' : '', 
        Option1Value: color_name !="" ? color_name : '', 
        Option2Name: style_name !="" ? "Style" : '', 
        Option2Value: style_name !="" ? style_name : '', 
        Option3Name: '', 
        Option3Value: '', 
        VariantSKU: '', 
        VariantGrams: '', 
        VariantInventoryTracker: '', 
        VariantInventoryQty: variantInventoryQty, 
        VariantInventoryPolicy: variantInventoryPolicy, 
        VariantFulfillmentService: "manual", 
        VariantPrice: curentprice, 
        VariantCompareAtPrice: '', 
        VariantRequiresShipping: variantRequiresShipping, 
        VariantTaxable: variantTaxable, 
        VariantBarcode: '', 
        ImageSrc: images[0], 
        ImagePosition: 1, 
        ImageAltText: title, 
        GiftCard: '', 
        SEOTitle: '', 
        SEODescription: '', 
        GoogleShoppingGoogleProductCategory: '', 
        GoogleShoppingGender: '', 
        GoogleShoppingAgeGroup: '', 
        GoogleShoppingMPN: '', 
        GoogleShoppingAdWordsGrouping: '', 
        GoogleShoppingAdWordsLabels: '', 
        GoogleShoppingCondition: '', 
        GoogleShoppingCustomProduct: '', 
        GoogleShoppingCustomLabel0: '', 
        GoogleShoppingCustomLabel1: '', 
        GoogleShoppingCustomLabel2: '', 
        GoogleShoppingCustomLabel3: '', 
        GoogleShoppingCustomLabel4: '', 
        VariantImage: images[0], 
        VariantWeightUnit: '', 
        VariantTaxCode: '', 
        Costperitem: '', 
        PriceInternational: '', 
        CompareAtPriceInternational: '', 
        Status: status
      })

      for(let i=1 ; i < images.length ; i++)
      {
          item.push({
            Handle: handler, 
            Title: '', 
            Body: '', 
            Vendor: '', 
            StandardizedProductType: '', 
            CustomProductType: '', 
            Tags: '', 
            Published: '', 
            Option1Name: '', 
            Option1Value: '',
            Option2Name: '', 
            Option2Value: '', 
            Option3Name: '', 
            Option3Value: '', 
            VariantSKU: '', 
            VariantGrams: '', 
            VariantInventoryTracker: '', 
            VariantInventoryQty: '', 
            VariantInventoryPolicy: '', 
            VariantFulfillmentService: '', 
            VariantPrice: '', 
            VariantCompareAtPrice: '', 
            VariantRequiresShipping: '', 
            VariantTaxable: '', 
            VariantBarcode: '', 
            ImageSrc: images[i], 
            ImagePosition: '', 
            ImageAltText: '', 
            GiftCard: '', 
            SEOTitle: '', 
            SEODescription: '', 
            GoogleShoppingGoogleProductCategory: '', 
            GoogleShoppingGender: '', 
            GoogleShoppingAgeGroup: '', 
            GoogleShoppingMPN: '', 
            GoogleShoppingAdWordsGrouping: '', 
            GoogleShoppingAdWordsLabels: '', 
            GoogleShoppingCondition: '', 
            GoogleShoppingCustomProduct: '', 
            GoogleShoppingCustomLabel0: '', 
            GoogleShoppingCustomLabel1: '', 
            GoogleShoppingCustomLabel2: '', 
            GoogleShoppingCustomLabel3: '', 
            GoogleShoppingCustomLabel4: '', 
            VariantImage: '', 
            VariantWeightUnit: '', 
            VariantTaxCode: '', 
            Costperitem: '', 
            PriceInternational: '', 
            CompareAtPriceInternational: '', 
            Status: ''
          })
        }

      csvWriter
      .writeRecords(item)
      .then(()=> console.log('The CSV file was written successfully'));

   
  
// ! ============================================== End debuggin ===================================
    await browser.close();

    // * ========================================= first action of starturl ends =============================================================
    // * ========================================= ============================================ =============================================================
    
    for(const url of product_variation_url){
        const browser = await puppeteer.launch({headless : true});
        const page = await browser.newPage();
        await page.goto(url);
                 // * ==================================
    // * =================== Varilables ====================
     style_count = 0
     color_count = 0
     color_name = ""
     style_name = ""
     item = []
    //  ! detect if there any style and return how many  exist
    try{
        console.log("trying to get style count")
        style_count = await page.$$eval("div#variation_style_name > ul.a-unordered-list > li", (el) => el.length);
        style_name = await page.$eval("div#variation_style_name > div.a-row > span.selection", (el) => el.innerHTML.trim() );
    }
    catch{
        console.log("no styles")
        style_count = 0
    }
   //  ! detect if there any color and return how many  exist
   try{
        console.log("trying to get color count")
        color_count = await page.$$eval("div#variation_color_name > ul.a-unordered-list > li", (el) => el.length);
        if(color_count > 0){
          color_name = await page.$eval("div#variation_color_name > div.a-row > span.selection", (el) => el.innerHTML.trim() );
          console.log(color_name)
        }
    }
    catch{
        console.log("no color")
        color_count = 0
    }
   
//    if(style_count > 0){
//       style_name = await page.$eval("div#variation_style_name > div.a-row > span.selection", (el) => el.innerHTML.trim() );
//       if(color_count > 0){
//         console.log("Yes And color more than 1")
//       }
//     }
   
    // * ===============================================Variables after first fetch page============================================================
    title = await page.$eval("span#productTitle", (el) => el.innerHTML.trim().replace(/([")(',])/g,""));
    handler = title.replace(/(\s)/g,"-");
    handler = handler.replace(/(---)/g,"-");
    // : ====================================================== handling price ====================================================
        let curentprice = await page.$eval("#corePrice_feature_div > div > span.a-price > span.a-offscreen", (el) => el.innerHTML.trim().replace('$',''));
            curentprice = parseFloat(curentprice) + parseFloat(curentprice) / 100 * profitpercentage;
            curentprice = curentprice.toFixed(2)    
    // : ====================================================== handling price ====================================================

    
     aboutItem = await page.$$eval("div#feature-bullets", (el) => el.map( // ! DESCRIPTION IN SHOPIFY
      x => x.outerHTML
    ))
    aboutItem = Object.entries(aboutItem).map(x => x.join(":")).join("\n");
    aboutItem = aboutItem.replace(/(0:)|(\\n)|(')/g,"")
    // * ===========================================================================================================
  
     images  = await page.$$eval("li.a-spacing-small > span.a-list-item > span.a-button > span.a-button-inner > span.a-button-text > img", (el) => {
       return  el.map( x => x.src.replace(/(0:)|(\\n)|(')/,""))
    })
    // this is an video image that we dont't want to add  
    indeximage = longest_str_in_array(images)
    indeximage = images.indexOf(indeximage)
    console.log("the index of longest image url is : "+indeximage) // ! here is the exra connsole that appers
    if( indeximage != -1 ){
      images.splice(indeximage,1)
    }
    images = images.map( image => image.replace(/(._.*)/g,".jpg"))
    //!=========================================== Debuggin ====================================
      item.push({
        Handle: handler, 
        Title: '', 
        Body: '', 
        Vendor: '', 
        StandardizedProductType: '', 
        CustomProductType: '', 
        Tags: '', 
        Published: published, 
        Option1Name: color_name !="" ? 'Color' : '', 
        Option1Value: color_name !="" ? color_name : '', 
        Option2Name: style_name !="" ? "Style" : '', 
        Option2Value: style_name !="" ? style_name : '', 
        Option3Name: '', 
        Option3Value: '', 
        VariantSKU: '', 
        VariantGrams: '', 
        VariantInventoryTracker: '', 
        VariantInventoryQty: variantInventoryQty, 
        VariantInventoryPolicy: variantInventoryPolicy, 
        VariantFulfillmentService: "manual", 
        VariantPrice: curentprice, 
        VariantCompareAtPrice: '', 
        VariantRequiresShipping: variantRequiresShipping, 
        VariantTaxable: variantTaxable, 
        VariantBarcode: '', 
        ImageSrc: images[0], 
        ImagePosition: '', 
        ImageAltText: '', 
        GiftCard: '', 
        SEOTitle: '', 
        SEODescription: '', 
        GoogleShoppingGoogleProductCategory: '', 
        GoogleShoppingGender: '', 
        GoogleShoppingAgeGroup: '', 
        GoogleShoppingMPN: '', 
        GoogleShoppingAdWordsGrouping: '', 
        GoogleShoppingAdWordsLabels: '', 
        GoogleShoppingCondition: '', 
        GoogleShoppingCustomProduct: '', 
        GoogleShoppingCustomLabel0: '', 
        GoogleShoppingCustomLabel1: '', 
        GoogleShoppingCustomLabel2: '', 
        GoogleShoppingCustomLabel3: '', 
        GoogleShoppingCustomLabel4: '', 
        VariantImage: images[0], 
        VariantWeightUnit: '', 
        VariantTaxCode: '', 
        Costperitem: '', 
        PriceInternational: '', 
        CompareAtPriceInternational: '', 
        Status: status
      })

      for(let i=1 ; i < images.length ; i++)
      {
          item.push({
            Handle: handler, 
            Title: '', 
            Body: '', 
            Vendor: '', 
            StandardizedProductType: '', 
            CustomProductType: '', 
            Tags: '', 
            Published: '', 
            Option1Name: '', 
            Option1Value: '',
            Option2Name: '', 
            Option2Value: '', 
            Option3Name: '', 
            Option3Value: '', 
            VariantSKU: '', 
            VariantGrams: '', 
            VariantInventoryTracker: '', 
            VariantInventoryQty: '', 
            VariantInventoryPolicy: '', 
            VariantFulfillmentService: '', 
            VariantPrice: '', 
            VariantCompareAtPrice: '', 
            VariantRequiresShipping: '', 
            VariantTaxable: '', 
            VariantBarcode: '', 
            ImageSrc: images[i], 
            ImagePosition: '', 
            ImageAltText: '', 
            GiftCard: '', 
            SEOTitle: '', 
            SEODescription: '', 
            GoogleShoppingGoogleProductCategory: '', 
            GoogleShoppingGender: '', 
            GoogleShoppingAgeGroup: '', 
            GoogleShoppingMPN: '', 
            GoogleShoppingAdWordsGrouping: '', 
            GoogleShoppingAdWordsLabels: '', 
            GoogleShoppingCondition: '', 
            GoogleShoppingCustomProduct: '', 
            GoogleShoppingCustomLabel0: '', 
            GoogleShoppingCustomLabel1: '', 
            GoogleShoppingCustomLabel2: '', 
            GoogleShoppingCustomLabel3: '', 
            GoogleShoppingCustomLabel4: '', 
            VariantImage: '', 
            VariantWeightUnit: '', 
            VariantTaxCode: '', 
            Costperitem: '', 
            PriceInternational: '', 
            CompareAtPriceInternational: '', 
            Status: ''
          })
        }

      csvWriter
      .writeRecords(item)
      .then(()=> console.log('The CSV file was written successfully'));
      await browser.close();

}
            // ! ======================================= Functions =============================================
            // * --------------------------------------- ---------------------------------------------------------
            function longest_str_in_array(arra) //? self explained
              {
                var max_str = arra[0].length;
                var ans = arra[0];
                for (var i = 1; i < arra.length; i++) {
                    var maxi = arra[i].length;
                    if (maxi > max_str) {
                        ans = arra[i];
                        max_str = maxi;
                    }
                }
                return ans;
              }
          // ! =========================================== End Functions =========================================

         
  })();


