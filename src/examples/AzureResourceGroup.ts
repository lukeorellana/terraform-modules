import { AzureResourceGroup } from '../AzureResourceGroup';
import { App, TerraformStack} from "cdktf";
import {AzurermProvider} from "@cdktf/provider-azurerm";

const app = new App();
const stack = new TerraformStack(app, "test");
    
new AzurermProvider(stack, "azureFeature", {
    features: {},
  });

new AzureResourceGroup(stack, 'testRG', {
name: 'rg-test',
location: 'eastus',
tags: {
    name: 'test',
    Env: "NonProd",
},
});
    
app.synth();