import { AzureContainerRegistry } from '../AzureContainerRegistry';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup, AzurermProvider} from "@cdktf/provider-azurerm";

const app = new App();
const stack = new TerraformStack(app, "testAzureContainerRegistry");
    
new AzurermProvider(stack, "azureFeature", {
    features: {},
  });

const rg = new ResourceGroup(stack, "rg", {
  location: 'eastus',
  name: 'rg-latest',

});

new AzureContainerRegistry(stack, 'testACR', {
  name: 'acrtest888',
  location: rg.location,
  resource_group_name: rg.name,
  sku: "Premium",
  admin_enabled: false,
  georeplication_locations: [{location: "westus"}],
  tags: {
    environment: "test",
  },
});
    
app.synth();