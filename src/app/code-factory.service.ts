import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Input, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CodeFactoryService {

  constructor( private generator: CodeFactoryService) {}
  
@Input()
  public _generateCode = new BehaviorSubject<any>({});
  _codeGenerator = this._generateCode.asObservable();
  public activeContracts: any[] = [];
  public test: string;
  
@Output() codeGeneratorEvent = new EventEmitter<string>()
  generateCode(_theContractCode: string, _theFunctionName: string, _theParams: any,/*  _initParams: any */){
    console.log("Generate in sidebar getriggert");
    console.log("Als parameter wurden übergeben:");
    console.log("_thefunctionName: " , _theFunctionName);
    console.log("the params: ", _theParams);
    //console.log("contract code is: ", this.activeContracts[0].source);
    let arrayOfInputData = [];
    _theParams.arguments.forEach(oneArg => {
      //console.log("One input is: ", oneArg)
      arrayOfInputData.push(oneArg.currentInputData);
    });
      _theParams = arrayOfInputData;
    console.log("final array of input data: ", arrayOfInputData);
    this._generateCode.next(
      `const { Universal: Ae, MemoryAccount, Node } = require('@aeternity/aepp-sdk')

      // GLOBALS START 
      
      // account that will be used for the transactions
      const acc1 = MemoryAccount({ keypair: { secretKey: 'bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca', publicKey: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU' } });
      
      // a reference to the aeternity blockchain
      var Chain;
      
      // a reference to your contract
      var myContract;
      
      // the name of the function you want to call
      var yourFunction = \"${_theFunctionName}\";
      
      // the parameters of your function
      yourParams = [${_theParams}];
      
      // the code of your contract - watch out for correct indentations !
      var code = 
      \`${_theContractCode}\`
      
      // GLOBALS END
      
      // instantiate a connection to the aeternity blockchain
      const main = async () => {
        const node1 = await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: 'https://sdk-testnet.aepps.com' })
        // const node2 = ...
      
          Chain = await Ae({
           // This two params deprecated and will be remove in next major release
            url: 'https://sdk-testnet.aepps.com',
            internalUrl: 'https://sdk-testnet.aepps.com',
            // instead use
            nodes: [
              { name: 'someNode', instance: node1 },
              // mode2
            ],
            compilerUrl: 'https://latest.compiler.aepps.com',
            // \`keypair\` param deprecated and will be removed in next major release
            
            accounts: [
              acc1,
              // acc2
            ],
            address: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU'
        })
        const height = await Chain.height()
        console.log('Connected to Testned Node! Current Block:', height)
      
        // deploy the contract
        await deployContract()
      
        // call your function
        console.log("Calling your function " + yourFunction);
        let callresult = await myContract.methods[yourFunction](...yourParams);
        console.log("Transaction ID: ", callresult.hash);
        console.log("Function call returned: ", callresult.decodedResult);
        
      }
      
      // call main
      main()
      
      deployContract = async () => {    
              let sourceCode = code
          
              // create a contract instance
              myContract = await Chain.getContractInstance(sourceCode);
          
          
              // Deploy the contract
              try {
                console.log("Deploying contract....")
                console.log("Using account for deployment: ", Chain.addresses());
                await myContract.methods.init();
              } catch(e){
                console.log("Something went wrong, investigating tx!");
                console.log(e);
                console.log(" Deployment failed: " + e, "error",  myContract.aci.name)
                  }
              console.log("Contract deployed successfully!")
              console.log("Contract address: ", myContract.deployInfo.address)
              console.log("Transaction ID: ", myContract.deployInfo.transaction)
              console.log("\\n \\n")
      
              return true;
            }` );
    }
  }






