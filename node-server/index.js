const request = require('request')
const cors = require('cors');
const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')
const app = express()
app.use(cors());
var corsOptions = {
	// origin: ["https://kick2win.co/","https://play.kick2win.co/"],
	origin: ["https://10.10.13.230"],
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
const bodyParser = require('body-parser')
const solanaWeb3 = require('@solana/web3.js')
const Keypair = require('@solana/web3.js')
const clusterApiUrl = require('@solana/web3.js')
const Connection = require('@solana/web3.js')
const Transaction = require('@solana/web3.js')
const SystemProgram = require('@solana/web3.js')
const LAMPORTS_PER_SOL = require('@solana/web3.js')
const sendAndConfirmTransaction = require('@solana/web3.js')
const bs58 = require('bs58');

const port = 8443

// function getpayer() {
// 	let sd = "39,254,215,112,46,84,166,102,56,171,43,165,16,206,61,60,223,17,136,50,77,109,32,199,66,243,202,86,55,223,201,154,130,139,141,50,73,243,228,203,118,150,149,95,54,101,170,81,253,99,239,77,81,52,80,220,107,141,55,227,155,233,140,231" //replace it with your private key (uint8array)
// 	let publicKey = '7k1NA1rjtreeBaEQZxEAH7Q2gHCdpbvSKPgPjpgPY1oL'
// 	let secretKey = '5HcQvxtuU45Y9dcPXqDuVtgV2FzymGejFUdhd5Vk6qCBYDvDM9LqaxGqWU9kBPnqSBzCdHhzTRPM36RXQZeNAabg'
// 	var privatekey = bs58.decode(secretKey)
// 	// let a = new Uint8Array(sd.split(","))
// 	// let payer = new solanaWeb3.Keypair({
// 	// 	publicKey: new TextEncoder("utf-8").encode(publicKey),
// 	// 	secretKey: new TextEncoder("utf-8").encode(secretKey),
// 	// })
// 	// let payer = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(sd.split(",")))
// 	let payer1 = solanaWeb3.Keypair.fromSecretKey(privatekey)
// 	console.log(payer1)

// 	// console.log(payer)
// 	// let payer = solanaWeb3.Keypair.fromSecretKey(uint8array)
// 	// var string = new TextDecoder("utf-8").decode(uint8array);
// }

// getpayer()

app.use(bodyParser.urlencoded({ extended: false }))
app.post('/transfer', cors(corsOptions),(req, res) => {
	let secretKey = 'exw453FW9nWp3PWyg9KPbJTSLUM7rZCN7ybK6Bk8AQ5UBAeibEWnMiniPe8R1ENCVtw8RKtZzAoLyrUfxsACQLR' //house wallet secret key
	let sd = bs58.decode(secretKey)
	// var privatekey = bs58.decode(secretKey)
		// let sd = "39,254,215,112,46,84,166,102,56,171,43,165,16,206,61,60,223,17,136,50,77,109,32,199,66,243,202,86,55,223,201,154,130,139,141,50,73,243,228,203,118,150,149,95,54,101,170,81,253,99,239,77,81,52,80,220,107,141,55,227,155,233,140,231" //replace it with your private key (uint8array)
		let playerWalletAddr = req.body.playerWalletAddr
		const to = new solanaWeb3.PublicKey(playerWalletAddr);
		let betAmount = req.body.betAmount
		let commPercentage = 3;
		let commisionPercent = (commPercentage*betAmount)/100;

		// let commWalletPub = 'G1KmTwvaumDdivb2qbSwsdmUkfnkda5ZhzDdeRaRuEwZ'
		// const toCommWallet = new solanaWeb3.PublicKey(commWalletPub)
		// let pureCommissionValue = (betAmount * 2) - ((betAmount * 2) - commisionPercent)

		const ads = async function() {
			var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'))
			
			// let publicKey = ''
			// let secretKey = ''
			// let payer = new solanaWeb3.Keypair({ publicKey, secretKey })
			let payer = solanaWeb3.Keypair.fromSecretKey(sd)
			let transaction = new solanaWeb3.Transaction()

			transaction.add(solanaWeb3.SystemProgram.transfer({
				fromPubkey: payer.publicKey,
				toPubkey: to,
				lamports: solanaWeb3.LAMPORTS_PER_SOL * ((betAmount * 2) - commisionPercent),
			}));

			const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer],)

			//transaction for sending commission in a diff wallet
// 			transaction.add(solanaWeb3.SystemProgram.transfer({
// 				fromPubkey: payer.publicKey,
// 				toPubkey: toCommWallet,
// 				lamports: solanaWeb3.LAMPORTS_PER_SOL * pureCommissionValue,
// 			}));

// 			const signature2 = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer],)
			
			if (signature && signature.length > 0) {
				res.set('Content-Type', 'text/plain')
				res.send('true');
			}
			else {
				res.set('Content-Type', 'text/plain')
				res.send('false');
			}
		}
		try {
			ads()
		}
		catch(err) {
			console.log(err)
		}
	})

app.post('/transferComm', cors(corsOptions),(req, res) => {
	
	let secretKey = 'exw453FW9nWp3PWyg9KPbJTSLUM7rZCN7ybK6Bk8AQ5UBAeibEWnMiniPe8R1ENCVtw8RKtZzAoLyrUfxsACQLR' //house wallet secret key
	let sd = bs58.decode(secretKey)
		// let playerWalletAddr = req.body.playerWalletAddr
		// const to = new solanaWeb3.PublicKey(playerWalletAddr)
		let betAmount = req.body.betAmount
		let commPercentage = 3;
		let commisionPercent = (commPercentage*betAmount)/100;

		let commWalletPub = 'fzB1Gp5187Lo9poN7MuE5CoNko73AA4ZHx6DFbdiaH1' // fee wallet public key
		const toCommWallet = new solanaWeb3.PublicKey(commWalletPub)
		let pureCommissionValue = (betAmount * 2) - ((betAmount * 2) - commisionPercent)

		const adss = async function() {
			var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'))

			let payer = solanaWeb3.Keypair.fromSecretKey(sd)

			let transaction = new solanaWeb3.Transaction()

			//transaction for sending commission in a diff wallet
			transaction.add(solanaWeb3.SystemProgram.transfer({
				fromPubkey: payer.publicKey,
				toPubkey: toCommWallet,
				lamports: solanaWeb3.LAMPORTS_PER_SOL * pureCommissionValue,
			}));

			const signature2 = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer],)
			if (signature2 && signature2.length > 0) {
				res.set('Content-Type', 'text/plain')
				res.send('true');
			}
			else {
				res.set('Content-Type', 'text/plain')
				res.send('false');
			}
		}
		try {
			adss()
		}
		catch(err) {
			
			console.log(err)
		}
	})
app.get('/', (req, res) => {
	res.sendFile(__dirname+'/index.html');
})
const sslServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'cert', 'privkey.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert', 'fullchain.pem'))
},app)

sslServer.listen(port, () => {
	console.log('Secured server is running!')
});