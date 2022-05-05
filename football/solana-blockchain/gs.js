$(document).ready(function(){
	$('button.btnDirection').attr('hidden',true);
	function getBalance(connection, publicKey) {
		return connection.getBalance(publicKey);
	}
	const getProvider = () => {
		if ("solana" in window) {
			const provider = window.solana;
			if (provider.isPhantom) {
				return provider;
			}
		}
		window.open("https://phantom.app/", "_blank");
	};
	const isPhantomInstalled = window.solana && window.solana.isPhantom;
	const connect = async function() {
		const resp = await window.solana.connect();
		$("#walletAddress").text(resp.publicKey.toString());
		$("#showAddress").attr('title',resp.publicKey.toString());
		var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
		let p = getProvider();
		getBalance(connection, p.publicKey).then(res => { 
			$("#currentBalance").text(Number(res)/1000000000+' SOL');
			$("#kick").attr('hidden',false);
			$('button.btnDirection').attr('hidden',false);
			$("#connectWallet").attr('hidden',true);
			$('button.btnSol').fadeIn(400);
		}).catch(err => {
			$("#snackbar").text(err.code+': '+err.message);
			snackbar();
			$('#connectWallet').attr('hidden',false);
			$('button.btnDirection').attr('hidden',true);
			$('button.btnSol').fadeOut(400);
		});
	}
	if (isPhantomInstalled) {
		try {
			connect();
		}
		catch (err) {
			$('button.btnDirection').attr('hidden',true);
			$("#connectWallet").attr('hidden',false);
		}
	}
	else {
		$("#connectWallet").attr('hidden',false);
		$('button.btnDirection').attr('hidden',true);
		Swal.fire('Required Solana','Redirecting to phantom wallet website to install it on your browser!','warning').then((value)=>{
			getProvider();
		});
	}
	$("#connectWallet").on("click",function(){
		connect();
	});
	$("#airdropSol").on("click",async function(){
		var provider = await getProvider();
		var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
		var airdropSignature = await connection.requestAirdrop(
			provider.publicKey,
			solanaWeb3.LAMPORTS_PER_SOL,
			);
		var airdrop = await connection.confirmTransaction(airdropSignature);
	});
	$("button.btnSol").on('click', function(){
		var amount = Number($(this).val());
		if (amount == 0.1 || amount == 0.5 || amount == 1.0){
			$("#betAmount").val(amount);
		}
		else {
			$("#snackbar").text('Can not take'+amount+' SOL as Bet amount!');
                        //$("#betAmount").focus();
                        snackbar();
                        return false;
                    }
                });
	$("#kick").on("click",function(){
		var betAmount = Number($("#betAmount").val());
		var choice = $("#direction").val();

		if (betAmount == null || betAmount == 0 || betAmount == '' || betAmount > 1.0 || betAmount < 0.1) {
			$("#snackbar").text('Please choose valid amount');
			snackbar();
			return false;
		}
		else if (choice == null || choice == '') {
			$("#snackbar").text('Please choose, LEFT or RIGHT!');
			snackbar();
			return false;
		}
		else {
			var csrf = $("#csrf_token").val();
			
			$(this).html('Processing...');
			$(this).attr('disabled','disabled');
			$('button.btnDirection').attr('hidden',true);
			$.post('server/api.php',{cmd:'fetch_wallet',csrf:csrf},function(resp){
				let obj = JSON.parse(resp);
				if (obj['data'] == 'true') {
					var adminWalletAddr = obj['pubkey'];
					var playerWalletAddr = $("#walletAddress").text();
					saveGame(playerWalletAddr,betAmount);

					requestMoneyFromPlayer(adminWalletAddr,betAmount).then(res => {

						if (rand6040()) {
							//$('#coin').addClass('heads');
							//if (choice == 'head') {
								updateGame(playerWalletAddr, betAmount, status = 'won');
								setTimeout(function(){
									$('button.btnDirection').attr('hidden',true);
									$("#kick").attr('hidden',true);
									$("#withdrawSOLBtn").attr('hidden',false);
									$("#retryLuckBtn").attr('hidden',true);
									$("#snackbar").text('Congratulations!');
									$('body').css('background-image','url("http://localhost/devartsys/assets/img/win3.png")')
									snackbar();
								},4000);
							}
							else {
								$(".spinner-img").css('background-image','url("http://localhost/devartsys/assets/img/lose.png")');
								updateGame(playerWalletAddr, betAmount, status = 'lost');
								$("#result").text('Lose');
								setTimeout(function(){
									$('button.btnDirection').attr('hidden',true);
									$("#kick").attr('hidden',true);
									$("#withdrawSOLBtn").attr('hidden',true);
									$("#retryLuckBtn").attr('hidden',false);
									$("#snackbar").text('Better luck next time!');
									snackbar();
								},4000);
							}
						/*}
						else {
							$('#coin').addClass('tails');
							if (choice == 'tail') {
								updateGame(playerWalletAddr, betAmount, status = 'won');
								setTimeout(function(){
									$("#result").text('Won');
									$("#kick").attr('hidden',true);
									$("#withdrawSOLBtn").attr('hidden',false);
									$("#retryLuckBtn").attr('hidden',true);
									$("#snackbar").text('Congratulations!');
									snackbar();
								},4000);
							}
							else {
								updateGame(playerWalletAddr, betAmount, status = 'lost');
								setTimeout(function(){
									$("#result").text('Lose');
									$("#kick").attr('hidden',true);
									$("#withdrawSOLBtn").attr('hidden',true);
									$("#retryLuckBtn").attr('hidden',false);
									$("#snackbar").text('Better luck next time!');
									snackbar();
								},4000);
							}
						}*/
					}).catch(err => {
						$("#snackbar").text(err.code+': '+err.message);
						snackbar();
						$('#bet').html('Bet Now');
						$('#bet').removeAttr('disabled');
					});
				}
				else {
					$("#snackbar").text('Could not found admin wallet!');
					snackbar();
				}
			});
		}
	});
	$("#playAgainBtn").on('click', function(){
		window.location = '';
	});
	$("#retryLuckBtn").on('click', function(){
		window.location = '';
	});
	$("#withdrawSOLBtn").on('click', function(){
		$('button.btnDirection').attr('hidden',true);
		$("#withdrawSOLBtn").attr('disabled','disabled');
		$("#loader").attr('hidden',false);
		var csrf = $("#csrf_token").val();
		$.post('server/api.php',{cmd:'fetch_wallet',csrf:csrf},function(resp){
			var obj = JSON.parse(resp);
			var playerWalletAddr = $("#walletAddress").text();
			var betAmount = Number($("#betAmount").val());

			UrlExists('https://domain.com:8443/', function (status) {
				if (status === 200) {
					$.post('https://domain.com:8443/transfer/',{playerWalletAddr:playerWalletAddr,betAmount:betAmount},(res)=>{
						if (res == 'true') {
							$("#snackbar").text('SOL transferred successfully into your wallet!');
							snackbar();
							$('button.btnDirection').attr('hidden',true);
							$("#withdrawSOLBtn").attr('hidden',true);
							$("#loader").attr('hidden',true);
							$("#playAgainBtn").attr('hidden',false);
						}
						else {
							$("#snackbar").text('Error occurred while transfering SOL into your wallet!');
							snackbar();
							$('button.btnDirection').attr('hidden',true);
							$("#withdrawSOLBtn").attr('hidden',true);
							$("#loader").attr('hidden',true);
							$("#playAgainBtn").attr('hidden',false);
						}
					});
				} else if (status === 404) {
					$("#snackbar").text('Node server is down!');
					snackbar();
					$("#withdrawSOLBtn").removeAttr('disabled');
					// setTimeout(function(){window.location = '';},3000);
				} else {
					$("#snackbar").text('Node API is incorrect!');
					snackbar();
					$("#withdrawSOLBtn").removeAttr('disabled');
					// setTimeout(function(){window.location = '';},3000);
				}
			});
			
		});
	});
	const requestMoneyFromPlayer = async function(adminWalletAddr,betAmount){
		var connection = new solanaWeb3.Connection(
			solanaWeb3.clusterApiUrl('devnet'),
			);
		var provider = await getProvider();
		var adminWallet = new solanaWeb3.PublicKey(adminWalletAddr);

		var transaction = new solanaWeb3.Transaction().add(
			solanaWeb3.SystemProgram.transfer({
				fromPubkey: provider.publicKey,
				toPubkey: adminWallet,
				lamports: solanaWeb3.LAMPORTS_PER_SOL * betAmount
			}),
			);
		transaction.feePayer = await provider.publicKey;
		let blockhashObj = await connection.getRecentBlockhash();
		transaction.recentBlockhash = await blockhashObj.blockhash;
		let signed = await provider.signTransaction(transaction);
		let signature = await connection.sendRawTransaction(signed.serialize());
		let zoom = await connection.confirmTransaction(signature);
		if (zoom.value.err == null) {
			return true;
		}
		else {
			return false;
		}
	}
	function rand6040(){var x=Math.random();if(x<0.7){return false;}else{ return true;}}
	function saveGame(playerWalletAddr = '', betAmount = 0) {
		var csrf = $("#csrf_token").val();
		if (playerWalletAddr == null || playerWalletAddr == '') {
			$("#snackbar").text('Your wallet address is not found! Please reconnect with Phantom!');
			snackbar();
			return false;
		}
		else if (betAmount == null || betAmount == '' || betAmount == 0) {
			$("#snackbar").text('BET amount is zero!');
			snackbar();
			return false;
		}
		else {
			$.post('server/api.php',{cmd:'save_game',player_address:playerWalletAddr,bet_amount:betAmount,csrf:csrf},function(resp){
				var obj = JSON.parse(resp);
				if (obj['status'] == 'true') {
					$("#lastId").val(obj['response']);
					return true;
				}
				else {
					$("#snackbar").text('Oops! Something went wrong while saving game data!');
					snackbar();
					return false;
				}
			});
		}
	}

	function updateGame(playerWalletAddr = '', betAmount = 0, status = '') {
		var csrf = $("#csrf_token").val();
		var lastId = $("#lastId").val();
		if (csrf == null || csrf == '') {
			$("#snackbar").text('CSRF token issue! Please refresh the page!');
			snackbar();
			return false;
		}
		else if (lastId == null || lastId == '') {
			$("#snackbar").text('Player ID not found!');
			snackbar();
			return false;
		}
		else if (playerWalletAddr == null || playerWalletAddr == '') {
			$("#snackbar").text('Your wallet address is not found!');
			snackbar();
			return false;
		}
		else if (betAmount == null || betAmount == '' || betAmount == 0) {
			$("#snackbar").text('BET amount is zero!');
			snackbar();
			return false;
		}
		else if (status == null || status == '') {
			$("#snackbar").text('Game status is undefined!');
			snackbar();
			return false;
		}
		else {
			$.post('server/api.php',{cmd:'update_game',last_id:lastId,csrf:csrf,player_address:playerWalletAddr,bet_amount:betAmount,status:status},function(resp){
				var obj = JSON.parse(resp);
				if (obj['status'] == 'true') {
					$("#snackbar").text('Game status is updated!');
					snackbar();
					return true;
				}
				else {
					$("#snackbar").text('Oops! Something went wrong while updating game status!');
					snackbar();
					return false;
				}
			});
		}
	}
});
