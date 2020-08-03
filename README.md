# QuasarBank

A MERN application for Virtual Banking and Portfolio Management.

## Functionality
Main Functionality is portfolio managament system, in which you can virtually invest money for practicing trading, all without risking any real money.
You can buy/sell US Stocks, at real time pricing.

## How to Start

1) Clone the repository: `$ git clone https://github.com/saurabhb44/QuasarBank`
2) The app is built on MERN Stack, so the first thing you'll need is Node.js installed on your PC. 
    * [Install Node.js from Here](https://nodejs.org/en/download/)
3) MongoDB: 
    * on *Windows*
      * [Download for Windows](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.0-signed.msi)
    * on *Ubuntu*
      * [Download for Ubuntu](https://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/4.4/multiverse/binary-amd64/mongodb-org-server_4.4.0_amd64.deb)
4) Go to the QuasarBank Folder and install required packages using npm: `$ npm install`.
5) Run the React app: `$ npm start`
6) Start the backend: `$ nodemon ./backend/index.js`
7) The react server runs at port 3000, so go to the url in the browser: `$ http://localhost:3000/`
8) Happy Banking!

## Usage:
1) Rgister as a Client

  ![Main](./ScreenShots/Register.png)

2) Login with registered Email & Password

  ![Main](./ScreenShots/LoginPage.png)
  
3) Home

  ![Main](./ScreenShots/Home.png)  
  
4) Bank Statement

  ![Main](./ScreenShots/BankStatement_Cropped.png)
  
5) Send Money to friend

  ![Main](./ScreenShots/SendMoney.png)
  
6) Manage Profile

  ![Main](./ScreenShots/Profile.png)
  
## Portfolio Management
You are given an initial Rs. 10,000, so it's time to start trading

### Buy Shares from US Stock Market
* Search your favourite Share
  
  ![Main](./ScreenShots/buyShares.png)
  
* Buy specifying the required Quantity on current rates in Rs

  ![Main](./ScreenShots/buyWindow.png)
  
* View purchased shares in Trade History

  ![Main](./ScreenShots/TradeHistory.png)
  
 * Sell some or all shares of specified company
 
  ![Main](./ScreenShots/SellWindow.png)
  
  * Trade History after selling
  
    ![Main](./ScreenShots/TradeHistoryAfterSelling.png)
