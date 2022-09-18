import { AzureLogAnalytics } from '../AzureLogAnalytics';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup, AzurermProvider} from "@cdktf/provider-azurerm";

const app = new App();
const stack = new TerraformStack(app, "testAzureLogAnalytics");
    
new AzurermProvider(stack, "azureFeature", {
    features: {},
  });

const rg = new ResourceGroup(stack, "rg", {
  location: 'eastus',
  name: 'rg-latest',

});

new AzureLogAnalytics(stack, 'testLA', {
  name: 'la-test',
  location: 'eastus',
  retention: 90,
  sku: "PerGB2018",
  resource_group_name: rg.name ,
});
    
app.synth();