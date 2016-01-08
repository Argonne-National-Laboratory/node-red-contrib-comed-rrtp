node-red-contrib-comed-rrtp
===========================

[![NPM](https://nodei.co/npm/node-red-contrib-comed-rrtp.png)](https://nodei.co/npm/node-red-contrib-comed-rrtp/)

[Node-Red][1] nodes for obtaining Commonwealth Edison's Residential Real-Time Pricing (RRTP) information.  

These nodes scrape the [ComEd RRTP][2] site to obtain real-time and predicted pricing information.

The ComEd real-time hourly market price is determined by the average of the twelve 5-minute prices from that hour, and so the averaged real-time hourly price is not known until after the hour has passed. The current hour average price is the real-time average of the current hour’s 5-minute prices.  ComEd RRTP customers are billed based on the [PJM][3] real-time hourly market prices.  There are slight differences between the PJM 5-minute prices and the ComEd 5-minute prices because of adjustments that ComEd passes through to customers. These are distribution loss factors, a system average uncollectable factor, and an incremental uncollectable loss factor. 

**Negative Prices**: With real-time hourly market prices, it is possible for the price of electricity to be negative for short periods of time. This typically occurs in the middle of the night and under certain circumstances when electricity supply is far greater than demand. In the market, some types of electricity generators cannot or prefer not to reduce electricity output for short periods of time when demand is insufficient, and as a result some generators may provide electricity to the market at prices below zero. Since Hourly Pricing participants pay the market price of electricity, they are actually being paid to use electricity during negative priced hours. Delivery charges still apply.

#Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-comed-rrtp

#Nodes

###TomPredPrices 

Use this node to get the predicted prices (cents/kWh) for the next day (24 hours).  Next day predicted prices become available each day at approximately 4:30 PM CT.

###PredPrices 

Use this node to get the predicted prices (cents/kWh) for the current day (24 hours). 

###CurntPredPrice

Use this node to get the predicted price (cents/kWh) for the current day, current hour. 

###CurntPrices 

Use this node to get the actual hourly prices (cents/kWh) for the current day up to nearest ending hour. 

###CurntPrice 

Use this node to get the actual hourly price (cents/kWh) for the nearest ending hour of the current day.

###CurntHrAvgPrice

Use this node to get the running average of 5 min prices (cents/kWh) for the latest hour of the current day, up to the nearest ending 5 minute mark of the hour.

###FiveMinPrices 

Use this node to get the actual price (cents/kWh) of energy for the 5 minute intervals for the current day, up to the nearest ending 5 minute mark of the hour.

#Author

[Jason D. Harper][4]


[1]:http://nodered.org
[2]:https://hourlypricing.comed.com/live-prices/
[3]:http://www.pjm.com/pub/account/lmpgen/lmppost.html
[4]:https://github.com/jayharper

