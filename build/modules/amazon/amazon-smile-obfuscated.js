const a7_0x472bf2=a7_0x378d;(function(_0x5e8677,_0x1c15cf){const _0x3d13fc=a7_0x378d,_0x31cd2d=_0x5e8677();while(!![]){try{const _0x2a50b0=parseInt(_0x3d13fc(0x19f))/0x1*(parseInt(_0x3d13fc(0x172))/0x2)+parseInt(_0x3d13fc(0x17c))/0x3+-parseInt(_0x3d13fc(0x176))/0x4+parseInt(_0x3d13fc(0x190))/0x5+-parseInt(_0x3d13fc(0x197))/0x6+-parseInt(_0x3d13fc(0x166))/0x7+-parseInt(_0x3d13fc(0x162))/0x8*(-parseInt(_0x3d13fc(0x18b))/0x9);if(_0x2a50b0===_0x1c15cf)break;else _0x31cd2d['push'](_0x31cd2d['shift']());}catch(_0x473170){_0x31cd2d['push'](_0x31cd2d['shift']());}}}(a7_0x586e,0xd317c));function a7_0x378d(_0x13c566,_0x24f7b0){const _0x586e9c=a7_0x586e();return a7_0x378d=function(_0x378d85,_0x8c48db){_0x378d85=_0x378d85-0x155;let _0x47630f=_0x586e9c[_0x378d85];return _0x47630f;},a7_0x378d(_0x13c566,_0x24f7b0);}const cheerio=require(a7_0x472bf2(0x199)),tough=require(a7_0x472bf2(0x159)),got=require(a7_0x472bf2(0x16f)),qs=require('qs'),Tasks=require(a7_0x472bf2(0x188));class amazonSmile extends Tasks{constructor(_0x8ebc4f){const _0x19b389=a7_0x472bf2;super(_0x8ebc4f),this['itemID']=_0x19b389(0x178),this[_0x19b389(0x1a3)]=_0x19b389(0x1a0);}['getRandomInt'](_0x59fd98,_0x19c429){const _0x9ece5d=a7_0x472bf2;return Math[_0x9ece5d(0x1ab)](Math[_0x9ece5d(0x17f)]()*(_0x19c429-_0x59fd98+0x1))+_0x59fd98;}[a7_0x472bf2(0x195)](){const _0xf9229f=a7_0x472bf2;this[_0xf9229f(0x15c)](_0xf9229f(0x1a6)),this[_0xf9229f(0x18a)]=!![];}async[a7_0x472bf2(0x16c)](){const _0x485c02=a7_0x472bf2;this[_0x485c02(0x15c)](_0x485c02(0x16a)),await this[_0x485c02(0x192)](),await this['getTokens'](),await this[_0x485c02(0x156)](),await this['placeOrder']();}async[a7_0x472bf2(0x192)](){const _0x433f1d=a7_0x472bf2;if(this['cancelled'])return;const _0x47132c=await this[_0x433f1d(0x196)]('https://www.amazon.com/gp/aod/ajax?asin='+this[_0x433f1d(0x1ac)]+_0x433f1d(0x170),{'method':_0x433f1d(0x193),'userAgent':'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36','headers':{'accept':_0x433f1d(0x161),'accept-language':_0x433f1d(0x167),'cache-control':'max-age=0','downlink':'10','ect':'4g','rtt':'0','sec-ch-ua':_0x433f1d(0x17e),'sec-ch-ua-mobile':'?0','sec-fetch-dest':_0x433f1d(0x19e),'sec-fetch-mode':_0x433f1d(0x164),'sec-fetch-site':'none','sec-fetch-user':'?1','upgrade-insecure-requests':'1','cookie':_0x433f1d(0x19d)},'proxy':_0x433f1d(0x15d)},'GET'),_0x260617=cheerio[_0x433f1d(0x191)](_0x47132c[_0x433f1d(0x186)]);this[_0x433f1d(0x1a2)]=_0x260617(_0x433f1d(0x198))[_0x433f1d(0x194)]()['val'](),console[_0x433f1d(0x1a7)](this['listingId']);}async[a7_0x472bf2(0x171)](){const _0x108adf=a7_0x472bf2;if(this[_0x108adf(0x18a)])return;await this[_0x108adf(0x17d)](this[_0x108adf(0x155)](0x3e8,0x7d0));const _0x497bb9=await this[_0x108adf(0x196)]('https://www.amazon.com/dp/'+this[_0x108adf(0x1ac)]+'/',{'method':_0x108adf(0x193),'ja3':'771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0','userAgent':_0x108adf(0x1a5),'headers':{'accept':_0x108adf(0x161),'accept-language':_0x108adf(0x167),'cache-control':_0x108adf(0x15a),'Connection':_0x108adf(0x16d),'DNT':'1','downlink':'10','ect':'4g','rtt':'50','sec-ch-ua':_0x108adf(0x187),'sec-ch-ua-mobile':'?0','sec-fetch-dest':_0x108adf(0x19e),'sec-fetch-mode':'navigate','sec-fetch-site':_0x108adf(0x15e),'sec-fetch-user':'?1','upgrade-insecure-requests':'1','cookie':this[_0x108adf(0x1a3)]},'proxy':'127.0.0.1:8866'},_0x108adf(0x193));this[_0x108adf(0x15c)](_0x108adf(0x16e)),this[_0x108adf(0x15c)](_0x497bb9[_0x108adf(0x18f)]);const _0x1edb75=new Date(),_0x570bc7=cheerio[_0x108adf(0x191)](_0x497bb9[_0x108adf(0x186)]);console[_0x108adf(0x1a7)](_0x570bc7(_0x108adf(0x184))[_0x108adf(0x16b)]()),this[_0x108adf(0x1a9)]=_0x570bc7(_0x108adf(0x184))[_0x108adf(0x16b)]();const _0x2e7b49=new Date();console[_0x108adf(0x1a7)](_0x108adf(0x174)+(_0x1edb75-_0x2e7b49)+_0x108adf(0x17a));}async['addToCart'](){const _0x9efee2=a7_0x472bf2,_0x10df14={'id':_0x9efee2(0x1ad),'quantity':0x1};if(this['cancelled'])return;await this[_0x9efee2(0x17d)](this['getRandomInt'](0x3e8,0x7d0));const _0x473a9a=await this[_0x9efee2(0x196)]('https://www.amazon.com/checkout/turbo-initiate?ref_=dp_start-bbf_1_glance_buyNow_2-1&referrer=detail&pipelineType=turbo&clientId=retailwebsite&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783&temporaryAddToCart=1',{'userAgent':'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36','ja3':_0x9efee2(0x1a1),'headers':{'accept':_0x9efee2(0x169),'accept-encoding':_0x9efee2(0x1a4),'accept-language':_0x9efee2(0x167),'content-type':_0x9efee2(0x18c),'downlink':'10','ect':'4g','origin':_0x9efee2(0x1a8),'referer':_0x9efee2(0x185)+this['itemID']+_0x9efee2(0x18e),'rtt':'50','sec-fetch-dest':_0x9efee2(0x19a),'sec-fetch-mode':'cors','sec-fetch-site':_0x9efee2(0x173),'x-amz-checkout-csrf-token':_0x9efee2(0x1aa),'x-amz-checkout-entry-referer-url':_0x9efee2(0x185)+this[_0x9efee2(0x1ac)]+_0x9efee2(0x189),'user-agent':_0x9efee2(0x1a5),'x-amz-support-custom-signin':'1','x-amz-turbo-checkout-dp-url':_0x9efee2(0x185)+this['itemID']+_0x9efee2(0x189),'cookie':_0x9efee2(0x158)},'proxy':_0x9efee2(0x15d),'body':qs[_0x9efee2(0x19b)]({'isAsync':0x1,'asin.1':this['itemID'],'addressID':this[_0x9efee2(0x1a9)],'offerListing.1':this['listingId'],'quantity.1':0x1})},_0x9efee2(0x183));if(this[_0x9efee2(0x18a)])return;if(_0x473a9a['status']===0xc8){const _0x4b14da=_0x473a9a[_0x9efee2(0x186)],_0x1dc2d9=cheerio[_0x9efee2(0x191)](_0x473a9a[_0x9efee2(0x186)]);this[_0x9efee2(0x168)]=_0x1dc2d9('input[name=\x27anti-csrftoken-a2z\x27]')[_0x9efee2(0x16b)](),console[_0x9efee2(0x1a7)](this[_0x9efee2(0x168)]),console['log'](this['listingId']),this[_0x9efee2(0x15c)](_0x9efee2(0x179));}else await this[_0x9efee2(0x15c)](_0x9efee2(0x180),![]),await this[_0x9efee2(0x15c)](_0x9efee2(0x181),![]),await this[_0x9efee2(0x17d)](0x1388),await this[_0x9efee2(0x156)]();}async[a7_0x472bf2(0x182)](){const _0x2e4709=a7_0x472bf2;await this['sleep'](this[_0x2e4709(0x155)](0xbb8,0x1388));if(this[_0x2e4709(0x18a)])return;const _0x51ad07=await this[_0x2e4709(0x196)](_0x2e4709(0x165)+Date[_0x2e4709(0x177)]()+_0x2e4709(0x18d),{'userAgent':_0x2e4709(0x1a5),'ja3':_0x2e4709(0x1a1),'headers':{'x-amz-checkout-entry-referer-url':_0x2e4709(0x185)+this[_0x2e4709(0x1ac)]+_0x2e4709(0x189),'rtt':'50','accept-encoding':'gzip,\x20deflate,\x20br','User-Agent':'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36','content-type':'application/x-www-form-urlencoded','x-amz-support-custom-signin':'1','accept':_0x2e4709(0x169),'x-requested-with':_0x2e4709(0x175),'x-amz-turbo-checkout-dp-url':_0x2e4709(0x185)+this[_0x2e4709(0x1ac)],'downlink':'10','x-amz-checkout-csrf-token':_0x2e4709(0x1aa),'ect':'4g','DNT':'1','origin':_0x2e4709(0x1a8),'sec-ch-ua':_0x2e4709(0x17e),'sec-fetch-site':_0x2e4709(0x173),'sec-fetch-mode':'cors','sec-fetch-dest':_0x2e4709(0x19a),'sec-ch-ua-mobile':'?0','accept-language':_0x2e4709(0x167),'anti-csrftoken-a2z':this['anti_csrf'],'cookie':'session-id=137-4178342-7052624;\x20ubid-main=134-4083507-7705729;\x20lc-main=en_US;\x20csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==;\x20session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a;\x20x-main=\x22NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh\x22;\x20at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt;\x20sess-at-main=\x22+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM=\x22;\x20sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0;\x20session-id-time=2082787201l;\x20i18n-prefs=USD;\x20csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no'},'proxy':_0x2e4709(0x15d),'body':qs['stringify']({'x-amz-checkout-csrf-token':_0x2e4709(0x1aa),'ref_':_0x2e4709(0x160),'referrer':'spc','pid':'106-3294680-2791410','pipelineType':_0x2e4709(0x157),'clientId':'retailwebsite','temporaryAddToCart':'1','hostPage':_0x2e4709(0x19c),'weblab':'RCX_CHECKOUT_TURBO_DESKTOP_NONPRIME_87784','isClientTimeBased':'1'})},_0x2e4709(0x183));if(this['cancelled'])return;_0x51ad07[_0x2e4709(0x18f)]===0xc8?(console[_0x2e4709(0x1a7)](_0x51ad07[_0x2e4709(0x186)]),await this[_0x2e4709(0x15c)]('Placed\x20Order')):(console[_0x2e4709(0x1a7)](_0x51ad07['status']),console[_0x2e4709(0x1a7)](_0x51ad07['body']),await this[_0x2e4709(0x15c)](_0x2e4709(0x163)));}async[a7_0x472bf2(0x17b)](_0x2eb276){const _0x2eb84f=a7_0x472bf2,_0x370d32={'content':_0x2eb276};await Request(_0x2eb84f(0x15b),{'method':_0x2eb84f(0x183),'headers':{'content-type':_0x2eb84f(0x15f)},'body':JSON['stringify'](_0x370d32)});}}module['exports']=amazonSmile;function a7_0x586e(){const _0x5227f9=['2593250WRyHBE','load','monitor','GET','first','stop','requestClient','6456126zKUgKF','input[name=\x22offeringID.1\x22]','cheerio','empty','stringify','detail','session-id=138-4961397-2098842;\x20session-id-time=2082787201l;\x20i18n-prefs=USD;\x20skin=noskin;\x20ubid-main=131-5594381-4092768','document','3axJclc','session-id=138-4961397-2098842;\x20session-id-time=2082787201l;\x20ubid-main=131-5594381-4092768;\x20session-token=\x22zV/+kdGwltNvIFHvCZik7kxHMuewIEdE5fXTpxQdBXkNjoaySi20Uu4fqNbmtplagI3bzwH3TH/8HV6z4ErB1OgWU26vxkMNMowFtP9GxgU6lFtqbQoGv2HPeO0w28zwQy4QBrYQm/ccmW1JmeIKpZj+RuqZ6hi8VzKpR7y4YR5dmxz7juxSAqwLbwC3g9a28qd9eYI0dN6JGhbMH+pzOpwjbdnZEYlk0tSM3XplpXzSCB1FBpLQEc7A28N5khBbWXqm9mCaH8jVywoipSYUNw==\x22;\x20x-main=\x22HDl?TgE1nVqO3axTBv4eRmlh8CglXXIQrjnOTCo8?IBIvBUT6PCCI6txlgpfeOIJ\x22;\x20at-main=Atza|IwEBIFajTGK8q5SwH-eCO9PJjbQ9nIrGthDyA-Ffg1xORtVEZIubNqIy0_-s5TYx3lXb7Lbz1-p1C4jhFCO5cOBevJam94_ySzYENEx8lTu7ad-OparNp56rVVxfz_7LwAF816HVfqclQnNEM0GWUQB3sG8eIQo8iSlx9gwjUxtZVr2wGfWpP-BZGCB9b3amJwVoqq3d3BHw4nbpMy9EVAjiFQqH;\x20sess-at-main=\x22hw78994Yxd9Zi/S9u10rsSxzfwCk/HfBY9y1l/H3KG4=\x22;\x20sst-main=Sst1|PQHryEMSDTqIgaNbN1zkg3n_CRoV7x0GQXli1505WcIbwhatBy7m3oXv2wHRFiHyhhVJtP91dtoeI5KGcbY89ReuDM_ajae4O4yJ1GS9AA6kslM9lqEOci8czQGdNNXDQiM801ieXkIJu2VWRlrP6yJPqcC0otcn4CBVH6XlWoP1fFr3GSBev3ZtqCJLIH6akD_bg9MPDqc2rwBAMTEwjdtmb-2W5bk8ZAYQuPaPUWca77zv8o0KPxdpnjD13260ohryjq5F-EsBfWIpzsJ8qtP4rI1YhlcRRqfdLPK7DQ4Hlfc;\x20lc-main=en_US;\x20i18n-prefs=USD','771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0','listingId','cookieString','gzip,\x20deflate,\x20br','Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36','Stopped','log','https://www.amazon.com','addressID','137-4178342-7052624','floor','itemID','39261345120278','getRandomInt','addToCart','turbo','session-id=137-4178342-7052624;\x20ubid-main=134-4083507-7705729;\x20lc-main=en_US;\x20csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==;\x20session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a;\x20x-main=\x22NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh\x22;\x20at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt;\x20sess-at-main=\x22+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM=\x22;\x20sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0;\x20session-id-time=2082787201l;\x20i18n-prefs=USD;\x20csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no','tough-cookie','max-age=0','https://discord.com/api/webhooks/798655800431738885/gzpTO29OlnqHTPKskCTRr48u2h8ziPxZC2CxBODIr3Bsk0L0lJMNs2wJjojGYpk5_vDI','sendStatus','127.0.0.1:8866','none','application/json','chk_spc_placeOrder','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9','22637704xyAfTq','Error\x20checking\x20out','navigate','https://www.amazon.com/checkout/spc/place-order?ref_=dp_start-bbf_1_glance_buyNow_4-2&referrer=detail&pipelineType=turbo&cachebuster=','11249014ARpfqK','en-US,en;q=0.9','anti_csrf','*/*','Starting\x20Task','val','initialize','keep-alive','Getting\x20tokens','got','&pldnSite=1','getTokens','958546DgtIRi','same-origin','Parsing\x20took\x20','XMLHttpRequest','6114604SBcuzd','now','B00006IFB4','OK\x20initiating','\x20ms','webhook','870384HTmkDB','sleep','\x22\x20Not\x20A;Brand\x22;v=\x2299\x22,\x20\x22Chromium\x22;v=\x2290\x22,\x20\x22Google\x20Chrome\x22;v=\x2290\x22','random','Error\x20getting\x20not\x20200','Retrying','placeOrder','POST','#ubbShipTo','https://www.amazon.com/gp/product/','body','\x22Google\x20Chrome\x22;v=\x2287\x22,\x20\x22\x20Not;A\x20Brand\x22;v=\x2299\x22,\x20\x22Chromium\x22;v=\x2287\x22','../../tasks','/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1','cancelled','9tcACxa','application/x-www-form-urlencoded','&clientId=retailwebsite&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783&temporaryAddToCart=1','?pf_rd_r=93T3ZVFMYYBR3WSE25VZ&pf_rd_p=5ae2c7f8-e0c6-4f35-9071-dc3240e894a8&pd_rd_r=04cfb4ae-5ce0-4c74-a438-00dd2fa05c39&pd_rd_w=dmzCg&pd_rd_wg=qRvAq&ref_=pd_gw_unk','status'];a7_0x586e=function(){return _0x5227f9;};return a7_0x586e();}