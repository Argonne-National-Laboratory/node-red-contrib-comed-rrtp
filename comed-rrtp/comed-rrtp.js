/**
 * Copyright 2016 Argonne National Laboratory.
 *
 * Licensed under the BSD 3-Clause License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

 module.exports = function(RED) {
	"use strict";
    var RED = require(process.env.NODE_RED_HOME+"/red/red");
    var settings = RED.settings;
    var request = require('request'); 
    var cheerio = require('cheerio');   
    var yearRegEx = /\[Date.UTC\((\d{4})/g;
    var monthRegEx = /\[Date.UTC\(\d{4},(\d{1,2})/g;
    var dayRegEx = /\[Date.UTC\(\d{4},\d{1,2},(\d{1,2})/g;
    var hourRegEx = /\[Date.UTC\(\d{4},\d{1,2},\d{1,2},(\d{1,2})/g;
    var minRegEx = /\[Date.UTC\(\d{4},\d{1,2},\d{1,2},\d{1,2},(\d{1,2})/g;
    var secRegEx = /\[Date.UTC\(\d{4},\d{1,2},\d{1,2},\d{1,2},\d{1,2},(\d{1,2})\)/g;
    var priceRegEx = /\[Date.UTC\(\d{4},\d{1,2},\d{1,2},\d{1,2},\d{1,2},\d{1,2}\),\s(\d{1,4}.\d{1,4})\]./g;      

   function getMatches(string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = [];
        var match;
        while (match = regex.exec(string)) {
          matches.push(match[index]);
        }
        return matches;
      }

    function TomPredPrices(n) {
    RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;    
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=daynexttomorrow',        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {              
        var matches,year = [],month = [],day = [],hour = [],min = [],sec = [],price = [];           

        // Get an array containing the year
           matches = getMatches(body, yearRegEx, 1);                      
           for (var i=0; i<matches.length; i++) {
           year[i] = parseInt(matches[i]);
           }         

        // Get an array containing the month
           matches = getMatches(body, monthRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           month[i] = parseInt(matches[i]);
           }

        // Get an array containing the day
           matches = getMatches(body, dayRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           day[i] = parseInt(matches[i]);
           }


        // Get an array containing the hour
           matches = getMatches(body, hourRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           hour[i] = parseInt(matches[i]);
           }   

        // Get an array containing the minute
           matches = getMatches(body, minRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           min[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the second
           matches = getMatches(body, secRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           sec[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the price
           matches = getMatches(body, priceRegEx, 1);        
           for (var i=0; i<matches.length; i++) {
           price[i] = matches[i];
           }
             
        outmsg.payload = [];
        for (var i=0; i<matches.length; i++) {
         
            outmsg.payload[i] = {                
                year: parseInt(year[i]),
                month: parseInt(month[i]) + 1, //January is 0!
                day: parseInt(day[i]),
                hour: parseInt(hour[i]),
                minute: parseInt(min[i]),
                second: parseInt(sec[i]),
                tom_pred_hourly_price: parseFloat(price[i])
            };

          }                           
          node.send(outmsg);
        }
    })    
      
      
    }); 

    }

    RED.nodes.registerType("TomPredPrices",TomPredPrices);

    function PredPrices(n) {
        RED.nodes.createNode(this,n);        
		var node = this;
		this.name = n.name;		   
		

    node.on("input", function(msg) {
	    var outmsg = {
	        topic: msg.topic
	    };      
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
        if(dd<10) {
        dd='0'+dd;
        } 

        if(mm<10) {
        mm='0'+mm;
        }     
      var date = yyyy.toString()+mm.toString()+dd.toString(); 
      /*console.log('year: '+yyyy); 
      console.log('month: '+mm);
      console.log('day: '+ dd);
      console.log('date: ' +date);*/
      var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=daynexttoday&date='+date,        
        json: true
      };

	    request(options, function (error, response, body) {
  		  if (!error && response.statusCode == 200) {   	      	 
        var matches,year = [],month = [],day = [],hour = [],min = [],sec = [],price = [];               

        // Get an array containing the year
           matches = getMatches(body, yearRegEx, 1);                      
           for (var i=0; i<matches.length; i++) {
           year[i] = parseInt(matches[i]);
           }         

        // Get an array containing the month
           matches = getMatches(body, monthRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           month[i] = parseInt(matches[i]);
           }

        // Get an array containing the day
           matches = getMatches(body, dayRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           day[i] = parseInt(matches[i]);
           }


        // Get an array containing the hour
           matches = getMatches(body, hourRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           hour[i] = parseInt(matches[i]);
           }   

        // Get an array containing the minute
           matches = getMatches(body, minRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           min[i] = parseInt(matches[i]);
           }

        // Get an array containing the second
           matches = getMatches(body, secRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           sec[i] = parseInt(matches[i]);
           }
        
        // Get an array containing the price
           matches = getMatches(body, priceRegEx, 1);        
           for (var i=0; i<matches.length; i++) {
           price[i] = matches[i];
           }
             
        outmsg.payload = [];
        for (var i=0; i<matches.length; i++) {
         
            outmsg.payload[i] = {                
                year: parseInt(year[i]),
                month: parseInt(month[i]) + 1, //January is 0!
                day: parseInt(day[i]),
                hour: parseInt(hour[i]),
                minute: parseInt(min[i]),
                second: parseInt(sec[i]),
                predicted_hourly_price: parseFloat(price[i])
            };

          }                           
          node.send(outmsg);
  		  }
		})	  
		  
		  
	  }); 

    }

    RED.nodes.registerType("PredPrices",PredPrices);

    function CurntPredPrice(n) {
        RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;   
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
      if(dd<10) {
      dd='0'+dd;
      } 

      if(mm<10) {
      mm='0'+mm;
      }     
    var date = yyyy.toString()+mm.toString()+dd.toString();    
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=daynexttoday&date='+date,        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {             
        var d = new Date();
        var currhour = d.getHours();        
        var matches,year = [],month = [],day = [],hour = [],min = [],sec = [],price = [],tmp = [];           

        // Get an array containing the year
           matches = getMatches(body, yearRegEx, 1);                      
           for (var i=0; i<matches.length; i++) {
           year[i] = parseInt(matches[i]);
           }         

        // Get an array containing the month
           matches = getMatches(body, monthRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           month[i] = parseInt(matches[i]);
           }

        // Get an array containing the day
           matches = getMatches(body, dayRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           day[i] = parseInt(matches[i]);
           }


        // Get an array containing the hour
           matches = getMatches(body, hourRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           hour[i] = parseInt(matches[i]);
           }   

        // Get an array containing the minute
           matches = getMatches(body, minRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           min[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the second
           matches = getMatches(body, secRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           sec[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the price
           matches = getMatches(body, priceRegEx, 1);        
           for (var i=0; i<matches.length; i++) {
           price[i] = matches[i];
           }
            
        tmp.payload = [];         
        for (var i=0; i<matches.length; i++) {
         
            tmp.payload[i] = {                
                year: parseInt(year[i]),
                month: parseInt(month[i]) + 1, //January is 0!
                day: parseInt(day[i]),
                hour: parseInt(hour[i]),
                minute: parseInt(min[i]),
                second: parseInt(sec[i]),
                predicted_hourly_price: parseFloat(price[i])
            };

          }          
          outmsg.payload = tmp.payload[currhour];        
          node.send(outmsg);
        }
    })    
      
      
    }); 

    }

    RED.nodes.registerType("CurntPredPrice",CurntPredPrice);

    function CurntPrices(n) {
        RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;   
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
      if(dd<10) {
      dd='0'+dd;
      } 

      if(mm<10) {
      mm='0'+mm;
      }     
    var date = yyyy.toString()+mm.toString()+dd.toString();    
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=day&date='+date,        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {             
        var matches,year = [],month = [],day = [],hour = [],min = [],sec = [],price = [];

        // Get an array containing the year
           matches = getMatches(body, yearRegEx, 1);                      
           for (var i=0; i<matches.length; i++) {
           year[i] = parseInt(matches[i]);
           }         

        // Get an array containing the month
           matches = getMatches(body, monthRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           month[i] = parseInt(matches[i]);
           }

        // Get an array containing the day
           matches = getMatches(body, dayRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           day[i] = parseInt(matches[i]);
           }


        // Get an array containing the hour
           matches = getMatches(body, hourRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           hour[i] = parseInt(matches[i]);
           }   

        // Get an array containing the minute
           matches = getMatches(body, minRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           min[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the second
           matches = getMatches(body, secRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           sec[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the price
           matches = getMatches(body, priceRegEx, 1);        
           for (var i=0; i<matches.length; i++) {
           price[i] = matches[i];
           }
            
        outmsg.payload = [];         
        for (var i=0; i<matches.length; i++) {
         
            outmsg.payload[i] = {                
                year: parseInt(year[i]),
                month: parseInt(month[i]) + 1, //January is 0!
                day: parseInt(day[i]),
                hour: parseInt(hour[i]),
                minute: parseInt(min[i]),
                second: parseInt(sec[i]),
                hourly_price: parseFloat(price[i])
            };

          }  
          node.send(outmsg);
        }
    })    
      
      
    }); 

    }

    RED.nodes.registerType("CurntPrices",CurntPrices);

    function CurntPrice(n) {
        RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=instanthourly',        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var priceRegEx = /(\d{1,4}.\d{1,4})/g;
        var timeRegEx = /(\d{1,2}-\d{1,2}\s\w{1,2}\s\w{1,3})/g;         
        var $ = cheerio.load(body);
        var list = $('p').map(function() {
        return $(this).text();
        }).get();
        var price = getMatches(list[0], priceRegEx, 1);        
        var time = getMatches(list[1], timeRegEx, 1);
        var ftime = time[0];

        outmsg.payload = {
                price: parseFloat(price),
                time: ftime,
            };

          }  
          node.send(outmsg);        
    })    
      
      
    }); 

    }

    RED.nodes.registerType("CurntPrice",CurntPrice);

    function CurntHrAvgPrice(n) {
        RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=instant',        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var priceRegEx = /(\d{1,4}.\d{1,4})/g;
        var timeRegEx = /(\d{1,2}\:\d{1,2}\s\w{1,2}\s\w{1,3})/g;         
        var $ = cheerio.load(body);
        var list = $('p').map(function() {
        return $(this).text();
        }).get();
        var price = getMatches(list[0], priceRegEx, 1);        
        var time = getMatches(list[1], timeRegEx, 1);
        var ftime = time[0];

        outmsg.payload = {
                price: parseFloat(price),
                time: ftime,
            };

          }  
          node.send(outmsg);        
    })    
      
      
    }); 

    }

    RED.nodes.registerType("CurntHrAvgPrice",CurntHrAvgPrice);

    function FiveMinPrices(n) {
        RED.nodes.createNode(this,n);        
    var node = this;
    this.name = n.name;      
    var options = {
        uri: 'https://rrtp.comed.com/rrtp/ServletFeed?type=pricechartfiveminute',        
        json: true
    };

    node.on("input", function(msg) {
      var outmsg = {
          topic: msg.topic
      };      

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {              
        var matches,year = [],month = [],day = [],hour = [],min = [],sec = [],price = [];                

        // Get an array containing the year
           matches = getMatches(body, yearRegEx, 1);                      
           for (var i=0; i<matches.length; i++) {
           year[i] = parseInt(matches[i]);
           }         

        // Get an array containing the month
           matches = getMatches(body, monthRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           month[i] = parseInt(matches[i]);
           }

        // Get an array containing the day
           matches = getMatches(body, dayRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           day[i] = parseInt(matches[i]);
           }


        // Get an array containing the hour
           matches = getMatches(body, hourRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           hour[i] = parseInt(matches[i]);
           }   

        // Get an array containing the minute
           matches = getMatches(body, minRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           min[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the second
           matches = getMatches(body, secRegEx, 1);
           for (var i=0; i<matches.length; i++) {
           sec[i] = parseInt(matches[i]);
           }
        

        // Get an array containing the price
           matches = getMatches(body, priceRegEx, 1);        
           for (var i=0; i<matches.length; i++) {
           price[i] = matches[i];
           }
            
        outmsg.payload = [];         
        for (var i=0; i<matches.length; i++) {
         
            outmsg.payload[i] = {                
                year: parseInt(year[i]),
                month: parseInt(month[i]) + 1, //January is 0!
                day: parseInt(day[i]),
                hour: parseInt(hour[i]),
                minute: parseInt(min[i]),
                second: parseInt(sec[i]),
                five_minute_price: parseFloat(price[i])
            };

          }                   
          node.send(outmsg);
        }
    })    
      
      
    }); 

    }

    RED.nodes.registerType("FiveMinPrices",FiveMinPrices);
 }

 