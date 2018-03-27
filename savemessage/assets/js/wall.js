var Wall;
window.addEventListener('load', function () {

    // Check if Web3 has been injected by the browser:

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        console.log('metamask trovato');
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    var WallContract = web3.eth.contract([
        {
            "constant": true,
            "inputs": [
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "readMessage",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getMaxIndex",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "source",
                    "type": "string"
                }
            ],
            "name": "stringToBytes32",
            "outputs": [
                {
                    "name": "result",
                    "type": "bytes32"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "text",
                    "type": "string"
                }
            ],
            "name": "saveMessage",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "log",
                    "type": "bytes32"
                }
            ],
            "name": "log_string",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "log",
                    "type": "uint256"
                }
            ],
            "name": "log_index",
            "type": "event"
        }
    ]);

    Wall = WallContract.at('0xD7De7AB5A245dA11c3dDc098Ab634Be0De6DFA3A');
    console.log(Wall);

})

$('#btnRead').click(
    function (){
        var toread = parseInt($('#toread').val());
        console.log(toread);
        Wall.readMessage(toread,function(error, result){
            if(!error)
            {
                $("#retrieved").html(result);
                $('#retrieved').removeClass('hidden');
                console.log(result);
            }
            else
                console.error(error);
        });
    }
);


$('#btnSave').click(
    function (){
        var towrite = $('#towrite').val().toString();
        console.log(towrite);
        $('#btnSave').hide();
        $('#writespinner').removeClass('hidden');
        $('#savedmessageid').removeClass('hidden');
        $("#savedmessageid").html('Your message is being saved. Please wait.');
        Wall.saveMessage(towrite,{value: 3000000000000000, gasPrice: 10000000000, gas: 150000},function(error, result){
            if(!error)
            {
                // $("#retrieved").html(result);
                getTransactionReceipt(result);
                console.log(result);
            }
            else
                console.error(error);
        });
    }
);

// get tx receipt, for when it arrives we know the tx is mined
var getTransactionReceipt = function (txId) {
    web3.eth.getTransactionReceipt(txId, function (error, result) {
        if (result === null) {
            setTimeout(function () { getTransactionReceipt(txId) }, 500);
        } else {
            $('#writespinner').hide();
            $('#savedmessageid').removeClass('hidden');
            $('#btnSave').show();
            $("#savedmessageid").html('Message ID: '+parseInt(result.logs[0].data),16);
            console.log(result);
        }
    });
};
