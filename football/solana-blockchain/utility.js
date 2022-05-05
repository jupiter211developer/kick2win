function UrlExists(url, cb) {
    $.ajax({
        url: url,
        dataType: 'text',
        type: 'GET',
        complete: function (xhr) {
            if (typeof cb === 'function')
                cb.apply(this, [xhr.status]);
        }
    });
}
function isPhantomInstalled() {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    if (isPhantomInstalled) {
        try {
            connect();
        } 
        catch (err) {
            $("#connectWallet").removeAttr('hidden');
            $('button.btnDirection').attr('hidden',true);
        }
    }
    else {
        $('button.btnDirection').attr('hidden',true);
        $("#connectWallet").removeAttr('hidden');
        Swal.fire('Required Solana','Redirecting to phantom wallet website to install it on your browser!','warning').then((value)=>{
            getProvider();
        });
    }
}
$("#connectWallet").on("click",function(){
    connect();
});
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
const connect = async function() {
    const resp = await window.solana.connect();
    $("#walletAddress").val(resp.publicKey.toString());
    var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
    let p = getProvider();
    getBalance(connection, p.publicKey).then(res => { 
        $("#currentBalance").text(Number(res)/1000000000+' SOL');
        $("#confirmSolSubmit").attr('hidden',false);
        $('button.btnDirection').attr('hidden',false);
        $("#confirmSolSubmit").removeAttr('disabled');
        $("#confirmSolSubmit").removeClass('disabled');
        $("#connectWallet").attr('hidden',true);
        $("#walletConnected").removeAttr('hidden');
        $("button.btnSol").fadeIn(500);
    }).catch(err => {
        $("#snackbar").text(err.code+': '+err.message);
        snackbar();
        $("#confirmSolSubmit").attr('hidden',true);
        $('button.btnDirection').attr('hidden',true);
        $("#confirmSolSubmit").attr('disabled');
        $("#confirmSolSubmit").addClass('disabled');
        $('#connectWallet').removeAttr('hidden');
        $("#walletConnected").attr('hidden',true);
        $("button.btnSol").fadeOut(100);
    });
}
function fetchLeaderboard() {
    var csrf = $("#csrf_token").val();
    setInterval(function(){
        $.post('server/api.php',{cmd:'fetch_leaderboard',csrf:csrf},function(resp){
            $('#leaderboard').html(resp);
        });
    },5000);
}
function renderResult() {
    let x = Math.random();
    if (x > 0.5) {
        return true;
    }
    else {
        return false;
    }
}
function saveGame() {
    var playerWalletAddr = $("#walletAddress").val();
    var betAmount = Number($("#betAmount").val());
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
                $("#gid").val(obj['response']);
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
function updateGame(status) {
    var csrf = $("#csrf_token").val();
    var id = $("#gid").val();
    if (csrf == null || csrf == '' || csrf.length <= 0) {
        $("#snackbar").text('CSRF token issue! Please refresh the page!');
        snackbar();
        return false;
    }
    else if (id == null || id == '') {
        $("#snackbar").text('Game ID not found!');
        snackbar();
        return false;
    }
    else if (status == null || status == '') {
        $("#snackbar").text('Game status is undefined!');
        snackbar();
        return false;
    }
    else {
        $.post('server/api.php',{cmd:'update_game',id:id,csrf:csrf,status:status},function(resp){
            // console.log(resp);
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
$('#confirmSolSubmit').on('click',function(){
    getSOL();
});
function getSOL() {
    var betAmount = Number($("#betAmount").val());
    var choice = $("#direction").val();
    var csrf = $("#csrf_token").val();
    if (betAmount == null || betAmount == 0 || betAmount == '') {
        $("#snackbar").text('Please enter an amount');
        snackbar();
        return false;
    }
    else if (choice == null || choice == '') {
        $("#snackbar").text('Please choose, LEFT or RIGHT!');
        snackbar();
        return false;
    }
    else if (csrf == null || csrf == '' || csrf.length <= 0) {
        $("#snackbar").text('CSRF token issue! Please refresh the page!');
        snackbar();
        return false;
    }
    else {
        $("button#confirmSolSubmit").html('<span class="fa fa-spinner fa-spin text-warning init-reveal"></span><br> Processing...');
        $("button#confirmSolSubmit").attr('disabled','disabled');
        $('button.btnDirection').attr('hidden',true);
        $.post('server/api.php',{cmd:'fetch_wallet',csrf:csrf},function(resp){
            console.log(resp);
            let obj = JSON.parse(resp);
            if (obj['data'] == 'true') {
                var adminWalletAddr = obj['pubkey'];
                var playerWalletAddr = $("#walletAddress").val();

                requestMoneyFromPlayer(adminWalletAddr,betAmount).then(res => {
                    $('.btn-choice').fadeOut(100);
                    $("#snackbar").text(betAmount+' SOL transferred to Admin wallet!');
                    snackbar();
                    $('button#confirmSolSubmit').hide();
                    saveGame();
                    return true;
                }).catch(err => {
                    $("#snackbar").text(err.code+': '+err.message);
                    snackbar();
                    $('button#confirmSolSubmit').html('SPIN');
                    $('button#confirmSolSubmit').removeAttr('disabled');
                    return false;
                });
            }
            else {
                $("#snackbar").text('Could not found admin wallet!');
                snackbar();
                return false;
            }
        });
    }
}
function sentSOL() {
    $("#btnWithdrawSOL").html('<span class="fa fa-wallet"></span> Processing...');
    $("#btnWithdrawSOL").attr('disabled','disabled');
    var csrf = $("#csrf_token").val();
    var playerWalletAddr = $("#walletAddress").val();
    var betAmount = Number($("#betAmount").val());
    if (csrf == null || csrf == '' || csrf.length <= 0) {
        $("#snackbar").text('CSRF token issue! Please refresh the page!');
        snackbar();
        return false;
    }
    else if (playerWalletAddr == null || playerWalletAddr == '' || playerWalletAddr.length <= 0) {
        $("#snackbar").text('Wallet address not found!');
        snackbar();
        return false;
    }
    else if (betAmount == null || betAmount == '' || betAmount.length <= 0) {
        $("#snackbar").text('Invalid Bet amount!');
        snackbar();
        return false;
    }
    else {
        UrlExists('http://localhost:3000/', function (status) {
            if (status === 200) {
                $.post('http://localhost:3000/transfer/',{playerWalletAddr:playerWalletAddr,betAmount:betAmount},(res)=>{
                    if (res == 'true') {
                        $("#snackbar").text('SOL transferred successfully into your wallet!');
                        snackbar();
                        $("#btnWithdrawSOL").attr('hidden',true);
                        $("#btnReplay").fadeIn(800);
                    }
                    else {
                        $("#snackbar").text('Error occurred while transfering SOL into your wallet!');
                        snackbar();
                        $("#btnWithdrawSOL").html('<span class="fa fa-wallet"></span> Withdraw SOL');
                        $("#btnWithdrawSOL").attr('hidden',true);
                    }
                });
            } else if (status === 404) {
                $("#snackbar").text('Node server is down!');
                snackbar();
                $("#btnWithdrawSOL").removeAttr('hidden');
                $("#btnWithdrawSOL").removeAttr('disabled');
                $("#btnWithdrawSOL").html('<span class="fa fa-wallet"></span> Withdraw SOL');
            } else {
                $("#snackbar").text('Node API is incorrect!');
                snackbar();
                $("#btnWithdrawSOL").removeAttr('hidden');
                $("#btnWithdrawSOL").removeAttr('disabled');
                $("#btnWithdrawSOL").html('<span class="fa fa-wallet"></span> Withdraw SOL');
            }
        });
    }
}
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