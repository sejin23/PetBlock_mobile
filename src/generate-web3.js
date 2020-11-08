import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import RPCProvider from 'web3-provider-engine/subproviders/rpc';

module.exports = function(rpcUrl) {
    const providerEngine = new ProviderEngine();
    providerEngine.addProvider(new RPCProvider({ rpcUrl: rpcUrl }));

    providerEngine.start();
    return new Web3(providerEngine);
}