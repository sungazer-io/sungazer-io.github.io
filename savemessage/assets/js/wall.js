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
    web3.version.getNetwork(function (err, netId){
        switch (netId) {
        case "1":
            console.log('This is mainnet');
            Wall = WallContract.at('0x267CcD9E8ac55aFb9e4b865912dEAB467dE9caD1');
            break
        case "2":
            console.log('This is the deprecated Morden test network.');
            break
        case "3":
            console.log('This is the ropsten test network.');
            Wall = WallContract.at('0x4AD10146bC99EFC992E146842272AA9a77ECb62D');
            break
        case "4":
            console.log('This is the Rinkeby test network.');
            Wall = WallContract.at('0xD7De7AB5A245dA11c3dDc098Ab634Be0De6DFA3A');
            break
        case "42":
            console.log('This is the Kovan test network.');
            break
        default:
            console.log('This is an unknown network.')
        }
    });
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
                doDecrypt();
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
        Wall.saveMessage(towrite,{value: 3000000000000000, gasPrice: 4000000000, gas: 450000},function(error, result){
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



function doDecrypt() {

    var password = $('#passwordtoread').val();
    if (password === '') {
        return;
    }

    try {
        var rp, p;

        p = getParameters();

        var text = sjcl.decrypt(password, JSON.stringify(p), {}, rp);


        var html = escapeHtml(text);

        $("#retrieved").html(html);


    } catch (e) {
        console.error(e.message);
    }
}

var config = {
    maxUrlLength: 2000,
    isDefault: true,
    v: 1,
    iter: 1000,
    ks: 128,
    ts: 64,
    mode: "ccm",
    cipher: "aes",
    delimiter: '.'
};

function escapeHtml(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function getParameters()
{
    var message = $("#retrieved").html();
    var code = message.match(/#([\S]+)/ig);

    if (code === null) {
        throw new Error('Encrypted message does not found.')
    }

    code = code[0].substring(1);
    var parts = code.split(config.delimiter);

    if (parts.length === 3) {
        return {
            "v": 1,
            "cipher": "aes",
            "mode": "ccm",
            "iter": 1000,
            "ks": 128,
            "ts": 64,
            "iv": parts[0],
            "salt": parts[1],
            "ct": parts[2],
            "adata": ""
        };
    } else if (parts.length === 4) {
        return {
            "v": 1,
            "cipher": "aes",
            "mode": "ccm",
            "iter": 1000,
            "ks": 128,
            "ts": 64,
            "iv": parts[0],
            "salt": parts[1],
            "ct": parts[2],
            "adata": parts[3]
        };
    } else if (parts.length === 8) {
        return {
            "v": 1,
            "cipher": parts[0],
            "mode": parts[1],
            "iter": parseInt(parts[2]),
            "ks": parseInt(parts[3]),
            "ts": parseInt(parts[4]),
            "iv": parts[5],
            "salt": parts[6],
            "ct": parts[7],
            "adata": ""
        };
    } else if (parts.length === 9) {
        return {
            "v": 1,
            "cipher": parts[0],
            "mode": parts[1],
            "iter": parseInt(parts[2]),
            "ks": parseInt(parts[3]),
            "ts": parseInt(parts[4]),
            "iv": parts[5],
            "salt": parts[6],
            "ct": parts[7],
            "adata": parts[8]
        };
    } else {
        throw new Error('Encrypted message format is not recognized.');
    }
}
